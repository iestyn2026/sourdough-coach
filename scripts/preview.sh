#!/bin/bash
# Serve the production build (dist/) locally — the same files Vercel will host.
# Node lives in ~/.local/node (no system-wide install), so put it on the PATH first.
export PATH="$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")/.." || exit 1
npm run build && exec npm run preview -- --port 4173 --strictPort
