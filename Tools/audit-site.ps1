param(
  [string]$Url = 'https://refinedbadger.com',
  [string]$OutputDir = '.audit'
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

Write-Output "Checking HTML..."
npx --yes html-validate public/index.html public/404.html
if ($LASTEXITCODE -ne 0) { throw 'HTML validation failed' }

Write-Output "Checking links..."
npx --yes linkinator $Url --recurse --skip '^mailto:'
if ($LASTEXITCODE -ne 0) { throw 'Link check failed' }
Write-Output "Running Lighthouse..."
$report = Join-Path $OutputDir 'lighthouse.html'
npx --yes lighthouse $Url --quiet --chrome-flags='--headless --no-sandbox' --output=html --output-path=$report
$lighthouseExit = $LASTEXITCODE
if ($lighthouseExit -ne 0 -and -not (Test-Path $report)) {
  throw "Lighthouse failed with exit code $lighthouseExit and produced no report"
}
if ($lighthouseExit -ne 0) {
  Write-Warning "Lighthouse produced a report but Chrome cleanup returned exit code $lighthouseExit on Windows."
}

Write-Output ("Audit complete: {0}" -f (Resolve-Path $report))
