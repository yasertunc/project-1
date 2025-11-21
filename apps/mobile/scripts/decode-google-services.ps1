# Decode base64 GOOGLE_SERVICES_JSON_B64 into apps/mobile/google-services.json
# Usage:
# $env:GOOGLE_SERVICES_JSON_B64="<base64-string>"
# pwsh ./scripts/decode-google-services.ps1

$envVarName = 'GOOGLE_SERVICES_JSON_B64'
$destFile = Join-Path -Path (Get-Location) -ChildPath 'google-services.json'

$b64 = [System.Environment]::GetEnvironmentVariable($envVarName)
if ([string]::IsNullOrEmpty($b64)) {
    Write-Error "Environment variable $envVarName is not set. Set it to the base64 contents of google-services.json and retry."
    exit 2
}

try {
    $bytes = [System.Convert]::FromBase64String($b64)
    [System.IO.File]::WriteAllBytes($destFile, $bytes)
    Write-Host "Decoded google-services.json written to: $destFile" -ForegroundColor Green
    exit 0
} catch {
    Write-Error "Failed to decode or write google-services.json: $_"
    exit 3
}
