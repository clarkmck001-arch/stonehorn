#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${1:-$ROOT_DIR/backups}"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
ARCHIVE_PATH="$BACKUP_DIR/stonehorn-backup-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"
cd "$ROOT_DIR"

INCLUDE_PATHS=()
if [[ -d "data" ]]; then
  INCLUDE_PATHS+=("data")
fi
if [[ -d "uploads" ]]; then
  INCLUDE_PATHS+=("uploads")
fi

if [[ "${#INCLUDE_PATHS[@]}" -eq 0 ]]; then
  echo "No data/ or uploads/ directories found to back up."
  exit 1
fi

tar -czf "$ARCHIVE_PATH" "${INCLUDE_PATHS[@]}"
echo "Backup created: $ARCHIVE_PATH"
