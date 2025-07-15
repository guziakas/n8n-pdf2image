#!/bin/bash
# setup-poppler.sh - Automated poppler-utils installation script

echo "🔧 Installing poppler-utils for n8n PDF to Image node..."
echo "This script will install poppler-utils on your system."
echo ""

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt &> /dev/null; then
            echo "ubuntu"
        elif command -v yum &> /dev/null; then
            echo "rhel"
        elif command -v dnf &> /dev/null; then
            echo "fedora"
        elif command -v apk &> /dev/null; then
            echo "alpine"
        elif command -v pacman &> /dev/null; then
            echo "arch"
        else
            echo "unknown-linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Install based on detected OS
install_poppler() {
    local os=$(detect_os)
    
    case $os in
        "ubuntu")
            echo "📦 Installing on Ubuntu/Debian..."
            sudo apt update && sudo apt install -y poppler-utils
            ;;
        "rhel")
            echo "📦 Installing on RHEL/CentOS..."
            sudo yum install -y poppler-utils
            ;;
        "fedora")
            echo "📦 Installing on Fedora..."
            sudo dnf install -y poppler-utils
            ;;
        "alpine")
            echo "📦 Installing on Alpine Linux..."
            sudo apk add poppler-utils
            ;;
        "arch")
            echo "📦 Installing on Arch Linux..."
            sudo pacman -S --noconfirm poppler
            ;;
        "macos")
            echo "📦 Installing on macOS..."
            if command -v brew &> /dev/null; then
                brew install poppler
            else
                echo "❌ Homebrew not found. Please install Homebrew first:"
                echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
            ;;
        *)
            echo "❌ Unsupported OS: $OSTYPE"
            echo "Please install poppler-utils manually for your system."
            echo "See DEPENDENCIES.md for detailed instructions."
            exit 1
            ;;
    esac
}

# Test installation
test_installation() {
    echo ""
    echo "✅ Testing installation..."
    
    if command -v pdftoppm &> /dev/null; then
        echo "🎉 poppler-utils installed successfully!"
        echo ""
        echo "📋 Version information:"
        pdftoppm -v 2>&1 | head -2
        echo ""
        echo "✅ Ready to use n8n PDF to Image node!"
        echo ""
        echo "📖 Next steps:"
        echo "   1. Install the n8n node: Settings > Community Nodes > 'n8n-nodes-pdf2image'"
        echo "   2. Test with a sample PDF in your n8n workflow"
        echo ""
    else
        echo "❌ Installation verification failed."
        echo "poppler-utils may not be properly installed or not in PATH."
        echo ""
        echo "🔧 Manual installation may be required."
        echo "See DEPENDENCIES.md for detailed instructions."
        exit 1
    fi
}

# Main execution
main() {
    echo "🔍 Detecting operating system..."
    local os=$(detect_os)
    echo "Detected: $os"
    echo ""
    
    # Confirm installation
    read -p "📥 Do you want to install poppler-utils? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_poppler
        test_installation
    else
        echo "❌ Installation cancelled."
        echo "You can run this script again when ready, or install manually."
        echo "See DEPENDENCIES.md for manual installation instructions."
        exit 0
    fi
}

# Run main function
main
