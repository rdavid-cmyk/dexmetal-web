#!/bin/bash
# Sends a Telegram alert when dexmetal-nightly-site-gate.service fails, times out, or cannot start.
# Triggered by OnFailure= in that unit. Token lives in /etc/dexmetal/telegram.env (root-only, 0600).
set -u
GATE_UNIT="dexmetal-nightly-site-gate.service"
ENV_FILE="/etc/dexmetal/telegram.env"

if [ ! -r "$ENV_FILE" ]; then
  echo "site-gate-alert: cannot read $ENV_FILE - alert NOT sent" >&2
  exit 1
fi
# shellcheck disable=SC1090
. "$ENV_FILE"

PREFIX=""
if [ -f "/run/systemd/system/${GATE_UNIT}.d/zz-alert-test.conf" ]; then
  PREFIX="[TEST - please ignore] "
fi

WHEN="$(TZ=America/Port_of_Spain date '+%a %d %b %Y, %I:%M %p') Trinidad time"
RESULT="$(systemctl show -p Result --value "$GATE_UNIT")"
INVOCATION="$(systemctl show -p InvocationID --value "$GATE_UNIT")"

if [ -n "$INVOCATION" ]; then
  LOG="$(journalctl -o cat --no-pager _SYSTEMD_INVOCATION_ID="$INVOCATION" 2>/dev/null)"
else
  LOG="$(journalctl -o cat --no-pager -u "$GATE_UNIT" --since '-15min' 2>/dev/null)"
fi
DETAIL="$(printf '%s\n' "$LOG" | grep -E 'FAIL|Error|error' | head -8)"
[ -z "$DETAIL" ] && DETAIL="$(printf '%s\n' "$LOG" | tail -8)"
[ -z "$DETAIL" ] && DETAIL="No log output. The check may not have started at all."

MSG="${PREFIX}DexMetal nightly site check FAILED
When: ${WHEN}
Reason code: ${RESULT}

What failed:
${DETAIL}

Server: dexmetal-prod. Full log: journalctl -u ${GATE_UNIT}"
MSG="${MSG:0:3500}"

RESP="$(curl -s --max-time 20 -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
  --data-urlencode "text=${MSG}")"
if printf '%s' "$RESP" | grep -q '"ok":true'; then
  echo "site-gate-alert: Telegram alert sent"
  exit 0
fi
echo "site-gate-alert: Telegram send FAILED: $(printf '%s' "$RESP" | head -c 300)" >&2
exit 1
