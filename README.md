# README

このアプリケーションのローカルでの動作確認手順です。

動作環境として **GitHub Codespaces** を想定しています。

## GitHub Codespacesでの起動手順

1. GitHub リポジトリのページから **Code** ボタンをクリックし、**Codespaces** タブを選択します。
2. **Create codespace on main** (または該当ブランチ) をクリックしてCodespaceを起動します。
3. Codespaceが起動すると、自動的に `.devcontainer/devcontainer.json` の設定が読み込まれ、環境が構築されます。
   - `bin/setup --skip-server` が自動的に実行され、依存関係(`bundle install`)の解決とデータベースのセットアップ(`bin/rails db:prepare`)が行われます。
4. ターミナルで以下のコマンドを実行し、Railsサーバーを起動します。

```bash
bin/dev
```

5. サーバーが起動すると、VS Codeの右下に「ポート 3000 番でアプリケーションが利用可能です」という通知が表示されます。**ブラウザで開く (Open in Browser)** ボタンをクリックして動作を確認してください。

※ 通知が出ない場合は、VS Codeの **Ports (ポート)** パネルを開き、ポート `3000` に設定されているリンクをクリックしてアクセスできます。
