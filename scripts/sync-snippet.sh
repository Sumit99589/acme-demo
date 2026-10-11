#!/usr/bin/env bash
# Copy the built Whydunit snippet into public/. Run after `pnpm build` in whydunit/packages/snippet.
set -euo pipefail
SRC="${1:-../whydunit/packages/snippet/dist/whydunit.js}"
cp "$SRC" public/whydunit.js
echo "synced $(wc -c < public/whydunit.js) bytes to public/whydunit.js"
