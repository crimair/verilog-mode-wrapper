# verilog-mode-wrapper README (日本語版)

## 概要

この拡張機能は、Emacs の verilog-mode の自動機能を VS Code で使用するためにラップし、Verilog ファイルに特化したバッチ処理コマンドを提供します。この拡張機能の実行には Emacs が必要です。

この拡張機能を使用すると、Emacs の verilog-mode が持つ強力な Verilog 編集機能を VS Code 内で直接活用できます。

## 要件

- emacs
- この拡張機能は Linux 環境でテストされています。

## 使用方法

この拡張機能は、Verilog ファイルをバッチ処理するためのいくつかのコマンドを提供します。これらのコマンドには、コマンドパレット (Ctrl+Shift+P または Cmd+Shift+P) からアクセスできます。

**注意:** この拡張機能が提供するコマンドには、デフォルトのキーボードショートカットは割り当てられていません。VS Code のキーボードショートカット設定から、お好みのショートカットを割り当ててください。

## 設定

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

**お楽しみください！**
