#!/usr/bin/env bash
# Copy the built Whydunit snippet (core + on-demand recorder) into public/.
set -euo pipefail
DIST="${1:-../whydunit/packages/snippet/dist}"
cp "$DIST/whydunit.js" public/whydunit.js
cp "$DIST/whydunit-record.js" public/whydunit-record.js
echo "synced $(wc -c < public/whydunit.js) + $(wc -c < public/whydunit-record.js) bytes"
