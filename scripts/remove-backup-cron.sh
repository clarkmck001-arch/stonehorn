#!/usr/bin/env bash
set -euo pipefail

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

(crontab -l 2>/dev/null || true) | sed '/stonehorn-daily-backup/d' > "$TMP_FILE"
crontab "$TMP_FILE"

echo "Stonehorn daily backup cron removed."
echo
echo "Current crontab:"
crontab -l || true
