param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$Destination,
  [int]$CropTop = 0,
  [int]$CropBottom = 0,
  [int]$Width = 1600,
  [int]$Height = 900
)

$ErrorActionPreference = 'Stop'
$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$destDir = Split-Path -Parent $Destination
if ($destDir -and -not (Test-Path $destDir)) {
  New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$crop = "crop=w='min(iw,(ih-$CropTop-$CropBottom)*$Width/$Height)':h='min(ih-$CropTop-$CropBottom,iw*$Height/$Width)':x='(iw-ow)/2':y='$CropTop'"
$scale = "scale=$($Width):$($Height):flags=lanczos"
& $ffmpeg -hide_banner -loglevel error -y -i $Source -vf "$crop,$scale" -c:v libwebp -quality 82 -compression_level 6 $Destination
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed with exit code $LASTEXITCODE" }
$out = Get-Item $Destination
Write-Output ("Prepared {0} ({1:N0} bytes)" -f $out.FullName, $out.Length)
