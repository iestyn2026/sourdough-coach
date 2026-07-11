#!/bin/bash
# Start the dev server. Node lives in ~/.local/node (installed 2026-07-11, no
# system-wide install on this machine), so put it on the PATH first.
export PATH="$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")/.." || exit 1
exec npm run dev
