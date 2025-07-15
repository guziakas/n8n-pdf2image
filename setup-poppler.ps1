# setup-poppler.ps1 - PowerShell script for Windows poppler-utils installation

Write-Host "🔧 Installing poppler-utils for n8n PDF to Image node..." -ForegroundColor Cyan
Write-Host "This script will install poppler-utils on your Windows system." -ForegroundColor White
Write-Host ""

function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Install-WithChocolatey {
    Write-Host "📦 Installing poppler via Chocolatey..." -ForegroundColor Green
    
    try {
        choco install poppler -y
        return $true
    }
    catch {
        Write-Host "❌ Chocolatey installation failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Install-Manual {
    Write-Host "📥 Manual installation required." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor White
    Write-Host "1. 🌐 Go to: https://github.com/oschwartz10612/poppler-windows/releases" -ForegroundColor Cyan
    Write-Host "2. 📦 Download the latest poppler-xx.xx.x_x64.7z file" -ForegroundColor Cyan
    Write-Host "3. 📁 Extract to C:\poppler (or your preferred location)" -ForegroundColor Cyan
    Write-Host "4. 🔧 Add C:\poppler\Library\bin to your system PATH:" -ForegroundColor Cyan
    Write-Host "   - Open System Properties → Advanced → Environment Variables" -ForegroundColor Gray
    Write-Host "   - Edit 'Path' in System Variables" -ForegroundColor Gray
    Write-Host "   - Add new entry: C:\poppler\Library\bin" -ForegroundColor Gray
    Write-Host "5. 🔄 Restart your terminal/PowerShell" -ForegroundColor Cyan
    Write-Host "6. ✅ Test with: pdftoppm --version" -ForegroundColor Cyan
    Write-Host ""
}

function Test-Installation {
    Write-Host "✅ Testing installation..." -ForegroundColor Green
    
    try {
        $output = & pdftoppm --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 poppler-utils installed successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 Version information:" -ForegroundColor White
            Write-Host $output -ForegroundColor Gray
            Write-Host ""
            Write-Host "✅ Ready to use n8n PDF to Image node!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📖 Next steps:" -ForegroundColor White
            Write-Host "   1. Install the n8n node: Settings > Community Nodes > 'n8n-nodes-pdf2image'" -ForegroundColor Cyan
            Write-Host "   2. Test with a sample PDF in your n8n workflow" -ForegroundColor Cyan
            Write-Host ""
            return $true
        }
        else {
            throw "Command failed with exit code $LASTEXITCODE"
        }
    }
    catch {
        Write-Host "❌ Installation verification failed." -ForegroundColor Red
        Write-Host "poppler-utils may not be properly installed or not in PATH." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🔧 You may need to:" -ForegroundColor White
        Write-Host "   - Restart your terminal/PowerShell" -ForegroundColor Cyan
        Write-Host "   - Check that poppler is added to your PATH" -ForegroundColor Cyan
        Write-Host "   - Follow manual installation steps above" -ForegroundColor Cyan
        Write-Host ""
        return $false
    }
}

# Main execution
function Main {
    Write-Host "🔍 Checking system requirements..." -ForegroundColor White
    
    # Check if running as administrator for Chocolatey
    if (-not (Test-AdminRights)) {
        Write-Host "⚠️  Not running as administrator. Some installation methods may fail." -ForegroundColor Yellow
        Write-Host "   Consider running PowerShell as Administrator for best results." -ForegroundColor Gray
        Write-Host ""
    }
    
    # Check if poppler is already installed
    try {
        & pdftoppm --version | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ poppler-utils is already installed!" -ForegroundColor Green
            Test-Installation
            return
        }
    }
    catch {
        # Not installed, continue with installation
    }
    
    # Check for Chocolatey
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Host "✅ Chocolatey found." -ForegroundColor Green
        
        $choice = Read-Host "📥 Install poppler-utils via Chocolatey? (Y/n)"
        if ($choice -eq "" -or $choice -match "^[Yy]") {
            if (Install-WithChocolatey) {
                Test-Installation
            }
            else {
                Write-Host "Falling back to manual installation..." -ForegroundColor Yellow
                Install-Manual
            }
        }
        else {
            Install-Manual
        }
    }
    else {
        Write-Host "❌ Chocolatey not found." -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Recommendation: Install Chocolatey for easier package management:" -ForegroundColor Yellow
        Write-Host "   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Cyan
        Write-Host ""
        
        $choice = Read-Host "📥 Continue with manual installation? (Y/n)"
        if ($choice -eq "" -or $choice -match "^[Yy]") {
            Install-Manual
        }
        else {
            Write-Host "❌ Installation cancelled." -ForegroundColor Red
            Write-Host "You can run this script again when ready." -ForegroundColor Gray
        }
    }
}

# Execute main function
Main
