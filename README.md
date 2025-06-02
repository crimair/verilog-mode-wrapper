# verilog-mode-wrapper README

## Description

This extension wraps Emacs' verilog-mode auto functions for use in VS Code, providing batch processing commands tailored for Verilog files. Emacs is required to run this extension.

This extension allows you to leverage the powerful Verilog editing features of Emacs' verilog-mode directly within VS Code.

## Requirements

- Emacs
- This extension has been tested on Linux and Windows environments.

## Usage

This extension provides several commands for batch processing Verilog files. You can access these commands via the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).

**Note:** Default keyboard shortcuts are not assigned to the commands provided by this extension. Please assign your own preferred shortcuts via VS Code's Keyboard Shortcuts settings.

## Installation and Setup

### Windows

1. **Install Emacs using winget:**
   ```
   winget install GNU.Emacs
   ```

2. **Configure Emacs path in VS Code settings:**
   - Open VS Code settings (File > Preferences > Settings)
   - Search for "verilog-mode-wrapper"
   - Set the "Emacs Path" to: `C:\Program Files\Emacs\emacs-30.1\bin\emacs.exe`
   - **Note:** The version number (30.1) may vary depending on your Emacs installation. Adjust the path accordingly.

### Linux/macOS

- Emacs should be available in your PATH (e.g., installed via package manager)
- If Emacs is installed in a custom location, you can specify the path in the "Emacs Path" setting

## Configuration

### Emacs Path

The `emacsPath` setting allows you to specify a custom path to the Emacs executable. If left empty, the extension will use `emacs` from your system PATH.

Examples:
- Windows: `C:\Program Files\Emacs\emacs-30.1\bin\emacs.exe`
- Linux: `/usr/local/bin/emacs`
- macOS: `/opt/homebrew/bin/emacs`

### evalArgs

The `evalArgs` setting allows you to control variables passed to Emacs' verilog-mode. For detailed information on available variables and their effects, please refer to the official Emacs verilog-mode documentation.

Representative initial values are provided in the default settings. You can customize these arguments to suit your project's specific needs by editing the extension's settings in VS Code.

## Known Issues

## Release Notes

### 0.0.1

Add support
* verilog-batch-auto
* verilog-batch-delete

### 0.0.2

Add support
* verilog-batch-diff-auto
* verilog-batch-inject-auto
* verilog-batch-indent
* verilog-batch-delete-trailing-whitespace
* eval args

### 0.0.3

Add support
* batch-execute-func verilog-pretty-declarations
* batch-execute-func verilog-pretty-expr
* batch-execute-func verilog-expand-vector
* batch-execute-func verilog-label-be
* batch-execute-func verilog-auto-star-implicit

### 0.0.4

Add support for Windows:
* Added `emacsPath` configuration setting to specify custom Emacs executable path
* Windows installation and setup instructions
* Cross-platform path support

**Enjoy!**
