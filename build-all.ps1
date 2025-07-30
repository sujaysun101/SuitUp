# Resume Tailor - Complete Build Script
Write-Host "=== Resume Tailor Complete Build Script ===" -ForegroundColor Cyan

# Build Backend
Write-Host "`n1. Setting up backend..." -ForegroundColor Yellow
Set-Location "backend"
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Green
    python -m venv venv
}
Write-Host "Activating virtual environment..." -ForegroundColor Green
& ".\venv\Scripts\Activate.ps1"
Write-Host "Installing backend dependencies..." -ForegroundColor Green
pip install -r requirements.txt
Set-Location ".."

# Build Webapp
Write-Host "`n2. Building webapp..." -ForegroundColor Yellow
Set-Location "webapp"
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing webapp dependencies..." -ForegroundColor Green
    npm install
}
Write-Host "Building webapp for production..." -ForegroundColor Green
npm run build
Set-Location ".."

# Build Extension
Write-Host "`n3. Building extension..." -ForegroundColor Yellow
Set-Location "extension"
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing extension dependencies..." -ForegroundColor Green
    npm install
}
Write-Host "Building extension..." -ForegroundColor Green
npm run build
Set-Location ".."

Write-Host "`n=== Build Complete! ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && .\venv\Scripts\Activate.ps1 && uvicorn main:app --reload" -ForegroundColor White
Write-Host "2. Webapp: cd webapp && npm run dev" -ForegroundColor White
Write-Host "3. Extension: Load 'extension/dist' folder in Chrome extensions (Developer mode)" -ForegroundColor White
Write-Host "`nFor Google Drive integration, set up OAuth2 credentials in backend/.env" -ForegroundColor Yellow
