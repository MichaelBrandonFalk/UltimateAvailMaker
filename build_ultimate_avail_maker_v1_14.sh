#!/usr/bin/env bash
set -euo pipefail

APP_NAME="Ultimate Avail Maker"
VERSION="V1_14"
VERSION_LABEL="V1.14"
SHORT_VERSION="1.14"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_BUNDLE="${ROOT_DIR}/build/${APP_NAME} ${VERSION_LABEL}.app"
CONTENTS_DIR="${APP_BUNDLE}/Contents"
SITE_DIR="${CONTENTS_DIR}/Resources/site"
ZIP_PATH="${ROOT_DIR}/downloads/${APP_NAME} ${VERSION}-macOS.zip"
ICON_SOURCE="${ROOT_DIR}/assets/ultimate-avail-maker-logo.icns"
ARM_EXECUTABLE="${ROOT_DIR}/build/${VERSION}-UltimateAvailMaker-arm64"
INTEL_EXECUTABLE="${ROOT_DIR}/build/${VERSION}-UltimateAvailMaker-x86_64"
SDK_PATH="/Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk"
MODULE_CACHE="${ROOT_DIR}/build/${VERSION}-swift-module-cache"

if [[ -e "${APP_BUNDLE}" ]]; then
  echo "App bundle already exists: ${APP_BUNDLE}" >&2
  exit 1
fi

if [[ -e "${ZIP_PATH}" ]]; then
  echo "ZIP already exists: ${ZIP_PATH}" >&2
  exit 1
fi

mkdir -p "${CONTENTS_DIR}/MacOS" "${SITE_DIR}/libs" "${SITE_DIR}/LICENSES" "${ROOT_DIR}/downloads"

sed \
  -e "s/__VERSION_LABEL__/${VERSION_LABEL}/g" \
  -e "s/__SHORT_VERSION__/${SHORT_VERSION}/g" \
  "${ROOT_DIR}/macos/Info.plist.in" > "${CONTENTS_DIR}/Info.plist"

xcrun swiftc \
  -sdk "${SDK_PATH}" \
  -module-cache-path "${MODULE_CACHE}" \
  -target arm64-apple-macos11.0 \
  -O \
  -parse-as-library \
  -framework AppKit \
  -framework UniformTypeIdentifiers \
  -framework WebKit \
  "${ROOT_DIR}/macos/UltimateAvailMakerApp.swift" \
  -o "${ARM_EXECUTABLE}"

xcrun swiftc \
  -sdk "${SDK_PATH}" \
  -module-cache-path "${MODULE_CACHE}" \
  -target x86_64-apple-macos11.0 \
  -O \
  -parse-as-library \
  -framework AppKit \
  -framework UniformTypeIdentifiers \
  -framework WebKit \
  "${ROOT_DIR}/macos/UltimateAvailMakerApp.swift" \
  -o "${INTEL_EXECUTABLE}"

lipo -create "${ARM_EXECUTABLE}" "${INTEL_EXECUTABLE}" -output "${CONTENTS_DIR}/MacOS/UltimateAvailMaker"
chmod +x "${CONTENTS_DIR}/MacOS/UltimateAvailMaker"

cp "${ICON_SOURCE}" "${CONTENTS_DIR}/Resources/AppIcon.icns"

cp "${ROOT_DIR}/index.html" "${SITE_DIR}/"
cp "${ROOT_DIR}/styles.css" "${SITE_DIR}/"
cp "${ROOT_DIR}/site_logic.js" "${SITE_DIR}/"
cp "${ROOT_DIR}/avail_core.js" "${SITE_DIR}/"
cp "${ROOT_DIR}/README.md" "${SITE_DIR}/"
cp "${ROOT_DIR}/THIRD_PARTY_NOTICES.md" "${SITE_DIR}/"
cp "${ROOT_DIR}/libs/xlsx.full.min.js" "${SITE_DIR}/libs/"
cp "${ROOT_DIR}/LICENSES/sheetjs.LICENSE" "${SITE_DIR}/LICENSES/"

plutil -lint "${CONTENTS_DIR}/Info.plist" >/dev/null
codesign --force --deep --sign - "${APP_BUNDLE}"
ditto -c -k --sequesterRsrc --keepParent "${APP_BUNDLE}" "${ZIP_PATH}"

echo "Created ${APP_BUNDLE}"
echo "Created ${ZIP_PATH}"
