$ErrorActionPreference = "Stop"
Start-Transcript -Path "frontend_ps_internal.log" -Force
$env:BROWSER = "none"
Write-Host "Starting Frontend Server..."
npm start
Stop-Transcript
