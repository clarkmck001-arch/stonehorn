#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRON_TAG="# stonehorn-daily-backup"
CRON_SCHEDULE="${CRON_SCHEDULE:-15 2 * * *}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
LOG_FILE="${LOG_FILE:-/tmp/stonehorn-backup.log}"
CMD="/bin/bash \"$ROOT_DIR/scripts/backup.sh\" \"$BACKUP_DIR\" >> \"$LOG_FILE\" 2>&1"
CRON_LINE="$CRON_SCHEDULE $CMD $CRON_TAG"

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

(crontab -l 2>/dev/null || true) | sed '/stonehorn-daily-backup/d' > "$TMP_FILE"
printf "%s\n" "$CRON_LINE" >> "$TMP_FILE"
crontab "$TMP_FILE"

echo "Stonehorn daily backup cron installed."
echo "Schedule: $CRON_SCHEDULE"
echo "Backup dir: $BACKUP_DIR"
echo "Log file: $LOG_FILE"
echo
echo "Current crontab:"
crontab -l
