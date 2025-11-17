#!/bin/bash
# Build Expo Dev Client for testing
# Usage: ./scripts/build-dev-client.sh [android|ios]

set -e

PLATFORM=${1:-android}

echo "Building Expo Dev Client for $PLATFORM..."

if [ "$PLATFORM" = "android" ]; then
  echo "Building Android Dev Client APK..."
  npx expo run:android --variant release --no-install
  
  # Copy APK to artifacts directory
  mkdir -p artifacts/android
  if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    cp android/app/build/outputs/apk/release/app-release.apk artifacts/android/FellowusMobile-dev-client.apk
    echo "✅ Dev Client APK copied to artifacts/android/FellowusMobile-dev-client.apk"
  else
    echo "❌ APK not found. Build may have failed."
    exit 1
  fi
elif [ "$PLATFORM" = "ios" ]; then
  echo "Building iOS Dev Client..."
  npx expo run:ios --configuration Release --no-install
  
  echo "✅ iOS Dev Client built. Use Xcode to export IPA if needed."
else
  echo "❌ Invalid platform: $PLATFORM. Use 'android' or 'ios'"
  exit 1
fi

echo "✅ Dev Client build complete!"

