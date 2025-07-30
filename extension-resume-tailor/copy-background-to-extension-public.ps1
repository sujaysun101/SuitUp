# PowerShell script to copy background.js to the Chrome extension public directory
$src = "..\extension-resume-tailor\src\background.js"
$dest = "..\extension\public\background.js"

Copy-Item -Path $src -Destination $dest -Force
Write-Host "Copied $src to $dest"
