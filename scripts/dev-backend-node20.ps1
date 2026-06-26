$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$nodeDir = Get-ChildItem (Join-Path $root '.tools') -Directory |
  Where-Object { $_.Name -like 'node-v20.*-win-x64' } |
  Sort-Object Name -Descending |
  Select-Object -First 1

if (-not $nodeDir) {
  throw 'Local Node 20 runtime was not found under .tools.'
}

$env:Path = "$($nodeDir.FullName);$env:Path"
Push-Location (Join-Path $root 'backend')
try {
  npm.cmd run dev
} finally {
  Pop-Location
}
