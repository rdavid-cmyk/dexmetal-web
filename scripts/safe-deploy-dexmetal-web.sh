#!/usr/bin/env bash
# Safe deploy for dexmetal-web. Install on the server as:
#   /usr/local/bin/safe-deploy-dexmetal-web.sh   (chmod +x)
# This script is the ONLY approved way to deploy dexmetal-web.
# It builds first; pm2 is never touched unless the build succeeds.

set -u -o pipefail

APP_DIR="${APP_DIR:-/var/www/dexmetal-web}"
PM2_APP="${PM2_APP:-dexmetal-web}"
SITE_URL="${SITE_URL:-https://www.dexmetal.com/}"
WAIT_SECONDS="${WAIT_SECONDS:-45}"
BUILD_LOG="$(mktemp /tmp/dexmetal-build.XXXXXX.log)"

cd "$APP_DIR" || { echo "DEPLOY FAILED: cannot cd to $APP_DIR. Nothing was restarted." >&2; exit 1; }

echo "Building in $APP_DIR ..."
if ! npm run build >"$BUILD_LOG" 2>&1; then
  echo "DEPLOY FAILED: build failed. pm2 was NOT touched; the running site is unchanged." >&2
  echo "---- last 60 lines of build output (full log: $BUILD_LOG) ----" >&2
  tail -n 60 "$BUILD_LOG" >&2
  exit 1
fi
echo "Build succeeded."

echo "Restarting $PM2_APP ..."
if ! pm2 restart "$PM2_APP"; then
  echo "DEPLOY FAILED: 'pm2 restart $PM2_APP' returned an error." >&2
  exit 1
fi

echo "Waiting up to ${WAIT_SECONDS}s for HTTP 200 from $SITE_URL ..."
deadline=$((SECONDS + WAIT_SECONDS))
code="000"
while [ "$SECONDS" -lt "$deadline" ]; do
  code="$(curl -s -o /dev/null -m 10 -w '%{http_code}' "$SITE_URL" || true)"
  if [ "$code" = "200" ]; then
    echo "DEPLOY SUCCEEDED: $SITE_URL returned HTTP 200."
    exit 0
  fi
  sleep 2
done

echo "DEPLOY FAILED: restarted, but $SITE_URL did not return 200 within ${WAIT_SECONDS}s (last status: $code)." >&2
exit 1
