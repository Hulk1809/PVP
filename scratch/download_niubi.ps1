$dest = "$env:USERPROFILE\Downloads\NPE_free.exe"
Write-Host "Downloading NIUBI Partition Editor to $dest..."
Invoke-WebRequest -Uri "https://www.hdd-tool.com/download/NPE_free.exe" -OutFile $dest
Write-Host "Launching installer..."
Start-Process -FilePath $dest
Write-Host "Done! Please follow the installer window on your screen."
