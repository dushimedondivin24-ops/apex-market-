# APEX MARKET - local launcher
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

# Pick a free local port
$listener = $null
try {
  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
  $listener.Start()
  $port = $listener.LocalEndpoint.Port
} finally {
  if ($listener) { $listener.Stop() }
}

$python = Get-Command python -ErrorAction SilentlyContinue
$py = Get-Command py -ErrorAction SilentlyContinue

if (-not $python -and -not $py) {
  Write-Host "Python was not found. Opening the site directly in your browser..." -ForegroundColor Yellow
  Start-Process (Join-Path $PSScriptRoot 'index.html')
  Read-Host "Press Enter to close this window"
  exit 0
}

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "  APEX MARKET - Your Marketplace. Your Choice." -ForegroundColor Yellow
Write-Host "  -------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Local address : $url"
Write-Host "  Folder        : $PSScriptRoot"
Write-Host ""
Write-Host "  The demo opens in your browser. Keep this window" -ForegroundColor Cyan
Write-Host "  open while you use the site, then press Enter" -ForegroundColor Cyan
Write-Host "  here to stop the local server." -ForegroundColor Cyan
Write-Host ""

$exe = if ($python) { $python.Source } else { $py.Source }
$serverArgs = if ($python) { @('-m', 'http.server', "$port") } else { @('-3', '-m', 'http.server', "$port") }

$server = Start-Process -FilePath $exe -ArgumentList $serverArgs -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden
Start-Sleep -Milliseconds 900
Start-Process $url

try {
  Read-Host "Press Enter to stop the APEX MARKET demo server"
} finally {
  if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue }
  Write-Host "Demo server stopped. Goodbye!" -ForegroundColor DarkGray
}
