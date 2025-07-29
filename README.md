# ChatGPT Model Selector

ChatGPTで使用するモデルを自動的に選択するChrome拡張機能

## 機能

- ChatGPT (chatgpt.com) にアクセスした際、URLに自動的にモデルパラメータを追加
- デフォルトモデルを設定画面から選択可能
- 対応モデル: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, o1, o1-preview, o1-mini, o3, o3-mini

## インストール方法

### 開発版として使用

1. このリポジトリをクローン
2. Chrome で `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」をONにする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. このリポジトリのフォルダを選択

### Chrome Web Store から（準備中）

近日公開予定

## 使い方

1. 拡張機能のアイコンをクリック
2. ドロップダウンからデフォルトモデルを選択
3. 「設定を保存」をクリック
4. ChatGPTにアクセスすると、選択したモデルが自動的に使用される

## 開発者向け

### ビルド方法

Chrome Web Store に提出するためのパッケージを作成：

```bash
./build.sh
```

これにより以下のファイルが生成されます：
- `chatgpt-force-model-submission.zip` - Chrome Web Store にアップロードするファイル
- `chatgpt-force-model-source.zip` - ソースコードアーカイブ

### Chrome Web Store への申請フロー

1. ビルドスクリプトを実行
   ```bash
   ./build.sh
   ```

2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/) にアクセス

3. 「新しいアイテム」をクリック

4. `chatgpt-force-model-submission.zip` をアップロード

5. 以下の情報を入力：
   - **名前**: ChatGPT Model Selector
   - **概要**: ChatGPTで使用するモデルを自動的に選択
   - **カテゴリ**: 生産性向上
   - **言語**: 日本語
   - **説明文**: 詳細な説明を記入
   - **スクリーンショット**: 最低1枚（1280x800 or 640x400）
   - **アイコン**: 128x128（既に含まれている）
   - **プライバシーポリシー**: 必須

6. プライバシーポリシーの例：
   ```
   本拡張機能はユーザーの選択したモデル設定のみをブラウザのローカルストレージに保存します。
   個人情報の収集、外部サーバーへの送信は一切行いません。
   ```

7. 審査に提出（通常1-3営業日）

### ファイル構成

```
chatgpt-force-model/
├── manifest.json      # 拡張機能のマニフェスト
├── content.js         # メインロジック
├── options.html       # 設定画面
├── options.js         # 設定画面のロジック
├── icon16.png         # 16x16 アイコン
├── icon48.png         # 48x48 アイコン
├── icon128.png        # 128x128 アイコン
├── build.sh           # ビルドスクリプト
├── .gitignore         # Git除外設定
└── README.md          # このファイル
```

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照