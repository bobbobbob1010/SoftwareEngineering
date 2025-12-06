$ErrorActionPreference = "Stop"
Start-Transcript -Path "backend_ps_internal.log" -Force
Write-Host "Starting Backend Server..."
./gradlew bootRun
Stop-Transcript
