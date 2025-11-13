# Installation Script for Chefs Kiss Project
# This script helps install packages while avoiding OneDrive file locking issues

Write-Host "=== Chefs Kiss Installation Script ===" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Step 2: Removing old node_modules (if exists)..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Step 3: Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
}

Write-Host "Step 4: Installing packages (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host "Note: If you see OneDrive errors, pause OneDrive syncing and try again." -ForegroundColor Cyan
Write-Host ""

# Try installation with multiple fallback options
try {
    npm install --legacy-peer-deps --no-optional
    Write-Host ""
    Write-Host "=== Installation Successful! ===" -ForegroundColor Green
    Write-Host "You can now run: npm start" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "=== Installation Failed ===" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try:" -ForegroundColor Yellow
    Write-Host "1. Pause OneDrive syncing (right-click OneDrive icon -> Pause syncing)" -ForegroundColor Yellow
    Write-Host "2. Run this script again" -ForegroundColor Yellow
    Write-Host "3. Or move the project outside OneDrive folder" -ForegroundColor Yellow
    exit 1
}

