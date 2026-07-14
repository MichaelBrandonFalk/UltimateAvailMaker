#!/usr/bin/env bash
set -euo pipefail

APP_NAME="Ultimate Avail Maker"
VERSION="V1_1"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="${ROOT_DIR}/build/${APP_NAME} ${VERSION}"
ZIP_PATH="${ROOT_DIR}/downloads/${APP_NAME} ${VERSION}.zip"

if [[ -e "${PACKAGE_DIR}" ]]; then
  echo "Package directory already exists: ${PACKAGE_DIR}" >&2
  exit 1
fi

if [[ -e "${ZIP_PATH}" ]]; then
  echo "ZIP already exists: ${ZIP_PATH}" >&2
  exit 1
fi

mkdir -p "${PACKAGE_DIR}/libs" "${PACKAGE_DIR}/LICENSES" "${ROOT_DIR}/downloads"
cp "${ROOT_DIR}/index.html" "${PACKAGE_DIR}/"
cp "${ROOT_DIR}/styles.css" "${PACKAGE_DIR}/"
cp "${ROOT_DIR}/site_logic.js" "${PACKAGE_DIR}/"
cp "${ROOT_DIR}/avail_core.js" "${PACKAGE_DIR}/"
cp "${ROOT_DIR}/README.md" "${PACKAGE_DIR}/"
cp "${ROOT_DIR}/THIRD_PARTY_NOTICES.md" "${PACKAGE_DIR}/"
cp "${ROOT_DIR}/Launch Ultimate Avail Maker.command" "${PACKAGE_DIR}/"
cp "${ROOT_DIR}/libs/xlsx.full.min.js" "${PACKAGE_DIR}/libs/"
cp "${ROOT_DIR}/LICENSES/sheetjs.LICENSE" "${PACKAGE_DIR}/LICENSES/"

(
  cd "${ROOT_DIR}/build"
  zip -qry "${ZIP_PATH}" "${APP_NAME} ${VERSION}"
)

echo "Created ${ZIP_PATH}"
