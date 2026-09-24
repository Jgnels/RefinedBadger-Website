param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$Destination,
  [double]$StartSeconds = 0,
  [double]$DurationSeconds = 20,
  [int]$Width = 1280,
  [int]$Height = 720
)

$ErrorActionPreference = 'Stop'
$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$destDir = Split-Path -Parent $Destination
if ($destDir -and -not (Test-Path $destDir)) {
  New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$filter = "scale=$($Width):$($Height):force_original_aspect_ratio=increase:flags=lanczos,crop=$($Width):$($Height)"
& $ffmpeg -hide_banner -loglevel error -y -ss $StartSeconds -i $Source -t $DurationSeconds -vf $filter -an -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p -movflags +faststart $Destination
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed with exit code $LASTEXITCODE" }
$out = Get-Item $Destination
Write-Output ("Prepared {0} ({1:N0} bytes)" -f $out.FullName, $out.Length)
