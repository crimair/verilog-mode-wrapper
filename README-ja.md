# verilog-mode-wrapper README (日本語版)

## 概要

この拡張機能は、Emacs の verilog-mode の自動機能を VS Code で使用するためにラップし、Verilog ファイルに特化したバッチ処理コマンドを提供します。この拡張機能の実行には Emacs が必要です。

この拡張機能を使用すると、Emacs の verilog-mode が持つ強力な Verilog 編集機能を VS Code 内で直接活用できます。

## 要件

- Emacs
- この拡張機能は Linux と Windows 環境でテストされています。

## 使用方法

この拡張機能は、Verilog ファイルをバッチ処理するためのいくつかのコマンドを提供します。これらのコマンドには、コマンドパレット (Ctrl+Shift+P または Cmd+Shift+P) からアクセスできます。

**注意:** この拡張機能が提供するコマンドには、デフォルトのキーボードショートカットは割り当てられていません。VS Code のキーボードショートカット設定から、お好みのショートカットを割り当ててください。

## インストールとセットアップ

### Windows

1. **winget を使用して Emacs をインストール:**
   ```
   winget install GNU.Emacs
   ```

2. **VS Code 設定で Emacs パスを設定:**
   - VS Code 設定を開く (ファイル > 設定 > 設定)
   - "verilog-mode-wrapper" を検索
   - "Emacs Path" に次のパスを設定: `C:\Program Files\Emacs\emacs-30.1\bin\emacs.exe`
   - **注意:** バージョン番号 (30.1) は Emacs のインストールに応じて変わる場合があります。パスを適切に調整してください。

### Linux/macOS

- Emacs が PATH で利用可能である必要があります（パッケージマネージャーでインストールなど）
- Emacs がカスタムの場所にインストールされている場合は、"Emacs Path" 設定でパスを指定できます

## 設定

### Emacs Path

`emacsPath` 設定を使用すると、Emacs 実行ファイルへのカスタムパスを指定できます。空のままにすると、拡張機能はシステムの PATH から `emacs` を使用します。

例:
- Windows: `C:\Program Files\Emacs\emacs-30.1\bin\emacs.exe`
- Linux: `/usr/local/bin/emacs`
- macOS: `/opt/homebrew/bin/emacs`

### evalArgs

`evalArgs` 設定を使用すると、Emacs の verilog-mode に渡される変数を制御できます。利用可能な変数とその効果に関する詳細については、Emacs verilog-mode の公式ドキュメントを参照してください。

代表的な初期値がデフォルト設定に記載されています。プロジェクト固有のニーズに合わせて、VS Code の拡張機能設定でこれらの引数をカスタマイズできます。

## 既知の問題

## リリースノート

### 0.0.1

サポート追加
* verilog-batch-auto
* verilog-batch-delete

### 0.0.2

サポート追加
* verilog-batch-diff-auto
* verilog-batch-inject-auto
* verilog-batch-indent
* verilog-batch-delete-trailing-whitespace
* eval args

### 0.0.3

サポート追加
* batch-execute-func verilog-pretty-declarations
* batch-execute-func verilog-pretty-expr
* batch-execute-func verilog-expand-vector
* batch-execute-func verilog-label-be
* batch-execute-func verilog-auto-star-implicit

### 0.0.4

Windows サポート追加:
* `emacsPath` 設定でカスタム Emacs 実行ファイルパスを指定可能
* Windows インストールおよびセットアップ手順
* クロスプラットフォームパスサポート

**お楽しみください！**
