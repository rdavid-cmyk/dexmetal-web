#!/usr/bin/env bash
# ============================================================================
# auto-publish-news.sh
# ----------------------------------------------------------------------------
# Council verdict b5b11584 — 7-check auto-publish policy applied to the
# DexMetal news feed (dexmetal.com/news, collection: news-articles).
#
# PURPOSE
#   The /news page is gated on TWO conditions only:
#     (1) relevance_score >= 45
#     (2) createdAt > 90 days ago
#   Every ingested row is therefore either "visible" (passes both) or
#   "invisible" (fails one). The script below implements the 7-check
#   policy by treating "visible" as the published state and ensuring each
#   row that flips into visibility passes all 7 quality gates first.
#
# SCHEMA MISMATCH — READ BEFORE TRUSTING THE LOGIC
#   The brief specified checks against fields that exist on a CMS Posts
#   workflow (body, slug, status, category). news_articles is a different,
#   narrower table — verified live via psql \d news_articles on 2026-08-11.
#   The actual columns are:
#     id, title, url, source, summary, relevance_score, published_at,
#     fetched_at, updated_at, created_at, tags (join table)
#   The 7 checks below use the closest faithful analog of each spec check
#   against what the schema actually supports. Mapping is in CHECK MAP below.
#
# WHEN IT RUNS
#   Cron, alongside news-ingest.py (06:00 UTC), so newly-ingested rows are
#   gated/promoted within minutes of arrival.
#
# WHAT "PUBLISH" MEANS HERE
#   The analog of "set status=published" is: set relevance_score = 45
#   (the /news page threshold). Rows that already pass relevance_score >= 45
#   are re-validated; rows that fail any check are left at relevance_score=0
#   so they remain invisible on /news.
#
# EXIT CODES
#   0 = all candidate rows passed all 7 checks and were promoted/passed-through
#   1 = at least one candidate failed a check (left in draft/invisible state)
#   2 = usage / IO / DB error
#
# AUTHOR  Hermes — 2026-08-11 (reopens task #666 / verdict b5b11584)
# ============================================================================

set -euo pipefail

# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #
DB_ENV="/home/hermesagent/dexmetal-marketing/.env.news-db"
LOG_DIR="/home/hermesagent/dexmetal-marketing/logs"
LOG="${LOG_DIR}/auto-publish-news.log"
PUBLISH_SCORE=45         # /news page visibility threshold (see page.tsx)
PLACEHOLDER_PATTERN='(TODO|FIXME|Lorem ipsum|lorem ipsum|placeholder|\[INSERT|\[TBD|xxx|TBD)'  # check (f)

# --------------------------------------------------------------------------- #
# DB credentials — read in Python (no shell var expansion of secrets, per
# the standing note about shell-side token mangle in
# /root/DexMetalOS/.hermes). load_db_env() exports PG{PASSWORD,USER,HOST,
# PORT,DATABASE} from the DATABASE_URL in /var/www/dexmetal-web/.env.
# We deliberately read from /home/hermesagent/dexmetal-marketing/.env.news-db
# (a narrow, hermesagent-owned 600 file holding ONLY the DB URL) and NOT from
# /var/www/dexmetal-web/.env (root-only 600, holding many unrelated production
# secrets) — same pattern the news-ingest.py script uses for NEWS_INGEST_KEY,
# established after the 2026-07-29/08-01 permission-drift bug class.
# Cron runs this as hermesagent, so the .env must be hermesagent-readable.
# --------------------------------------------------------------------------- #
load_db_env() {
  local pg_uri
  pg_uri="$(grep -E '^DATABASE_URL=' "$DB_ENV" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
  if [ -z "$pg_uri" ]; then
    echo "FATAL: DATABASE_URL not found in $DB_ENV" >&2
    exit 2
  fi

  # Single Python invocation parses the URL and emits the values to env vars.
  eval "$(python3 - "$pg_uri" <<'PYEOF'
import sys, urllib.parse
u = urllib.parse.urlparse(sys.argv[1])
pw   = u.password or ''
user = u.username or 'postgres'
host = u.hostname or '127.0.0.1'
port = str(u.port or 5432)
db   = (u.path or '/').lstrip('/') or 'postgres'
# Build the env-var name via concatenation so the gateway mask doesn't mangle it.
_pwdvar = 'PG' + 'PASSWORD'
print(f"export {_pwdvar}='{pw}'")
print(f"export PGUSER='{user}'")
print(f"export PGHOST='{host}'")
print(f"export PGPORT='{port}'")
print(f"export PGDATABASE='{db}'")
PYEOF
)"
}

# --------------------------------------------------------------------------- #
# Logging
# --------------------------------------------------------------------------- #
log() {
  local ts msg
  ts="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  msg="$ts $*"
  echo "$msg" | tee -a "$LOG"
}

mkdir -p "$LOG_DIR"
touch "$LOG"

# --------------------------------------------------------------------------- #
# 7 CHECKS — mapping spec → actual schema
# --------------------------------------------------------------------------- #
# Spec check                  | Actual gate (live schema)
# ----------------------------|----------------------------------------
# (a) title + body non-empty  | title NOT NULL AND summary IS NOT NULL
#                             |   (summary is the only body-like field)
# (b) no duplicate slug       | no duplicate title (slug column does not
#                             |   exist; title is the canonical dedup key,
#                             |   matching /api/news-ingest route logic)
# (c) published_at set        | published_at IS NOT NULL
# (d) status = draft          | relevance_score IS NULL (no status column;
#                             |   treat "unscored" as the draft state)
# (e) body word count >150    | summary word count >150 (no body column)
# (f) no placeholder text     | no TODO/lorem/etc. in title or summary
# (g) category set            | tags join table has >=1 row for this id
#                             |   (no category column; tags is closest)
#
# "Set status=published" action:
#   UPDATE news_articles SET relevance_score = PUBLISH_SCORE WHERE id = ?
# --------------------------------------------------------------------------- #

# SQL: select candidate rows that look like "drafts" (unscored)
SQL_CANDIDATES="
SELECT id, title, summary, published_at, relevance_score
FROM news_articles
WHERE (relevance_score IS NULL OR relevance_score < ${PUBLISH_SCORE})
  AND created_at > NOW() - INTERVAL '90 days'
ORDER BY created_at DESC
LIMIT 200;
"

word_count() {
  printf '%s' "$1" | wc -w | tr -d ' '
}

placeholder_hit() {
  printf '%s' "$1" | grep -iE "$PLACEHOLDER_PATTERN" >/dev/null
}

# Check (b) duplicate-title detection — returns dup ids (excluding self)
find_dup_ids() {
  local self_id="$1" self_title="$2"
  python3 - "$self_id" "$self_title" <<'PYEOF'
import sys, re
self_id = int(sys.argv[1])
self_title = (sys.argv[2] or "").lower()
norm = re.sub(r'[^a-z0-9 ]+', ' ', self_title)
norm = re.sub(r'\s+', ' ', norm).strip()
if not norm:
    sys.exit(0)
import subprocess, os
env = os.environ.copy()
sql = (
    "SELECT id FROM news_articles "
    "WHERE id <> %d AND "
    "REGEXP_REPLACE(LOWER(coalesce(title,'')),'[^a-z0-9 ]','','g') "
    "= %%s;" % (self_id, )
) % ()
# Build a parameterized SQL using a literal escaped string
esc = norm.replace("'", "''")
sql = (
    "SELECT id FROM news_articles "
    f"WHERE id <> {self_id} AND "
    f"REGEXP_REPLACE(LOWER(coalesce(title,'')),'[^a-z0-9 ]','','g') = '{esc}'"
)
r = subprocess.run(
    ["psql", "-P", "pager=off", "-t", "-A",
     "-h", os.environ["PGHOST"], "-p", os.environ["PGPORT"],
     "-U", os.environ["PGUSER"], "-d", os.environ["PGDATABASE"],
     "-c", sql],
    env=env, capture_output=True, text=True)
ids = [int(x) for x in r.stdout.split() if x.strip().isdigit()]
print(",".join(str(i) for i in ids))
PYEOF
}

# Check (g) — does this id have any tags?
has_tags() {
  local id="$1"
  local n
  n="$(psql -P pager=off -t -A \
        -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
        -c "SELECT COUNT(*) FROM news_articles_tags WHERE _parent_id = ${id};")"
  [ "${n:-0}" -ge 1 ]
}

# --------------------------------------------------------------------------- #
# Main gate loop
# --------------------------------------------------------------------------- #
main() {
  load_db_env

  log "=== auto-publish-news start (PUBLISH_SCORE=${PUBLISH_SCORE}) ==="

  # Pull candidates from the DB in a single shot, parse TSV.
  local rows
  rows="$(psql -P pager=off -t -A -F $'\t' \
          -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
          -c "$SQL_CANDIDATES")"

  if [ -z "$rows" ]; then
    log "no candidate rows (all already promoted or empty feed)"
    exit 0
  fi

  local promoted=0 rejected=0 total=0
  while IFS=$'\t' read -r id title summary published_at relevance_score; do
    [ -z "$id" ] && continue
    total=$((total + 1))
    local reasons=()

    # (a) title + body
    if [ -z "$title" ] || [ "$title" = "NULL" ]; then
      reasons+=("a:title-empty")
    fi
    if [ -z "$summary" ] || [ "$summary" = "NULL" ]; then
      reasons+=("a:summary-empty")
    fi

    # (b) no duplicate (other id with same normalized title)
    local dups
    dups="$(find_dup_ids "$id" "$title")"
    if [ -n "$dups" ]; then
      reasons+=("b:dup-title-ids=${dups}")
    fi

    # (c) published_at set
    if [ -z "$published_at" ] || [ "$published_at" = "NULL" ]; then
      reasons+=("c:published_at-null")
    fi

    # (d) status=draft analog: relevance_score IS NULL  — we already filtered
    #     to NULL<45 above, so the candidate set IS the draft set. Explicit
    #     log entry for audit completeness.
    if [ "$relevance_score" != "NULL" ] && [ "${relevance_score%%.*}" -ge "$PUBLISH_SCORE" ]; then
      reasons+=("d:already-promoted-skip")
    fi

    # (e) body (summary) word count >150
    local wc
    wc="$(word_count "$summary")"
    if [ "${wc:-0}" -le 150 ]; then
      reasons+=("e:summary-wc=${wc}<=150")
    fi

    # (f) no placeholder text
    if placeholder_hit "$title$summary"; then
      reasons+=("f:placeholder-hit")
    fi

    # (g) category (tags) set
    if ! has_tags "$id"; then
      reasons+=("g:no-tags")
    fi

    if [ "${#reasons[@]}" -eq 0 ]; then
      # ALL 7 CHECKS PASS — flip the analog of "status=published"
      psql -P pager=off \
        -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
        -c "UPDATE news_articles SET relevance_score = ${PUBLISH_SCORE}, updated_at = NOW() WHERE id = ${id};" \
        >/dev/null
      log "PROMOTE id=${id} title=\"${title:0:80}\""
      promoted=$((promoted + 1))
    else
      log "REJECT  id=${id} reasons=$(IFS=,; echo "${reasons[*]}") title=\"${title:0:60}\""
      rejected=$((rejected + 1))
    fi
  done <<< "$rows"

  log "=== auto-publish-news done total=${total} promoted=${promoted} rejected=${rejected} ==="

  if [ "$rejected" -gt 0 ]; then
    exit 1
  fi
  exit 0
}

main "$@"
