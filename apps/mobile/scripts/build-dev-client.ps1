# Build Expo Dev Client for testing (PowerShell)
# Usage: .\scripts\build-dev-client.ps1 [android|ios]

param(
    [Parameter(Position=0)]
    [ValidateSet("android", "ios")]
    [string]$Platform = "android"
)

Write-Host "Building Expo Dev Client for $Platform..." -ForegroundColor Cyan

if ($Platform -eq "android") {
    Write-Host "Building Android Dev Client APK..." -ForegroundColor Yellow
    npx expo run:android --variant release --no-install
    
    # Copy APK to artifacts directory
    $artifactsDir = "artifacts\android"
    if (-not (Test-Path $artifactsDir)) {
        New-Item -ItemType Directory -Path $artifactsDir -Force | Out-Null
    }
    
    $apkPath = "android\app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        Copy-Item $apkPath "$artifactsDir\FellowusMobile-dev-client.apk" -Force
        Write-Host "✅ Dev Client APK copied to $artifactsDir\FellowusMobile-dev-client.apk" -ForegroundColor Green
    } else {
        Write-Host "❌ APK not found. Build may have failed." -ForegroundColor Red
        exit 1
    }
} elseif ($Platform -eq "ios") {
    Write-Host "Building iOS Dev Client..." -ForegroundColor Yellow
    npx expo run:ios --configuration Release --no-install
    
    Write-Host "✅ iOS Dev Client built. Use Xcode to export IPA if needed." -ForegroundColor Green
}

Write-Host "✅ Dev Client build complete!" -ForegroundColor Green

