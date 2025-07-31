#!/usr/bin/env python3
"""
Setup script for Resume Tailor Backend
Run this script to set up the development environment
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"⏳ {description}...")
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"✅ {description} completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        return False
    return True

def check_python_version():
    """Check if Python version is compatible"""
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {python_version.major}.{python_version.minor} detected")
    return True

def create_virtual_environment():
    """Create a virtual environment"""
    if not run_command("python -m venv venv", "Creating virtual environment"):
        return False
    return True

def activate_virtual_environment():
    """Instructions for activating virtual environment"""
    if os.name == 'nt':  # Windows
        activate_script = "venv\\Scripts\\activate"
    else:  # Unix/Linux/macOS
        activate_script = "source venv/bin/activate"
    
    print(f"\n📋 To activate the virtual environment, run:")
    print(f"   {activate_script}")
    return True

def install_dependencies():
    """Install Python dependencies"""
    # Use the virtual environment pip
    if os.name == 'nt':  # Windows
        pip_command = "venv\\Scripts\\pip install -r requirements.txt"
    else:  # Unix/Linux/macOS
        pip_command = "venv/bin/pip install -r requirements.txt"
    
    return run_command(pip_command, "Installing Python dependencies")

def download_spacy_model():
    """Download spaCy language model"""
    if os.name == 'nt':  # Windows
        python_command = "venv\\Scripts\\python -m spacy download en_core_web_sm"
    else:  # Unix/Linux/macOS
        python_command = "venv/bin/python -m spacy download en_core_web_sm"
    
    return run_command(python_command, "Downloading spaCy English model")

def create_directories():
    """Create necessary directories"""
    directories = [
        "logs",
        "uploads",
        "temp"
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created directory: {directory}")
    
    return True

def copy_env_file():
    """Copy .env.example to .env if it doesn't exist"""
    if not Path(".env").exists():
        if Path(".env.example").exists():
            if os.name == 'nt':  # Windows
                subprocess.run("copy .env.example .env", shell=True, check=True)
            else:  # Unix/Linux/macOS
                subprocess.run("cp .env.example .env", shell=True, check=True)
            print("✅ Created .env file from .env.example")
            print("📝 Please edit .env file with your API keys")
        else:
            print("⚠️  .env.example file not found")
    else:
        print("✅ .env file already exists")
    
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up Resume Tailor Backend...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create virtual environment
    if not create_virtual_environment():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Download spaCy model
    if not download_spacy_model():
        print("⚠️  spaCy model download failed, you can install it later with:")
        if os.name == 'nt':
            print("   venv\\Scripts\\python -m spacy download en_core_web_sm")
        else:
            print("   venv/bin/python -m spacy download en_core_web_sm")
    
    # Create directories
    create_directories()
    
    # Copy environment file
    copy_env_file()
    
    # Final instructions
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Activate the virtual environment:")
    if os.name == 'nt':
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Edit .env file with your API keys")
    print("3. Start the development server:")
    print("   python main.py")
    print("\n🌐 The API will be available at: http://localhost:8000")
    print("📚 API documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
