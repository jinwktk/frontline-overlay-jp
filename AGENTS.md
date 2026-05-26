# AGENTS.md

## 会話と作業ルール

- このプロジェクトでは常に日本語で会話する。
- README.md と AGENTS.md は、コミット前に作業内容が追えるよう更新する。
- サブ PC で利用する前提のため、変更後はコミットと push まで行う。
- TDD を原則とし、まず期待する状態を確認するテストを追加してから実装する。
- 翻訳があやふやな固有名詞、FFXIV 公式用語、ログ文言は推測で確定せず確認する。

## リポジトリ概要

- 目的: `InfSein/frontline-overlay` を元にした日本語版 `frontline-overlay-jp` を作成する。
- 作業フォルダ: `C:\Users\mlove\Documents\GitHub\frontline-overlay-jp`
- 公開先予定: `https://jinwktk.github.io/frontline-overlay-jp/`
- 元リポジトリ: `https://github.com/InfSein/frontline-overlay`
- 日本語版リポジトリ: `https://github.com/jinwktk/frontline-overlay-jp`

## リモート構成

- `origin`: `https://github.com/jinwktk/frontline-overlay-jp.git`
- `upstream`: `https://github.com/InfSein/frontline-overlay.git`
- upstream から取り込む際は、差分内のユーザー向け文言を日本語化してから日本語版へ反映する。

## フォルダ構成メモ

- `.github/workflows/`: GitHub Actions。Pages デプロイと PR チェックを配置。
- `docs/image/app_preview/`: README で使うプレビュー画像。
- `public/`: 静的ファイル、アイコン、`version.json`。
- `scripts/`: バージョン更新や日本語版チェックなどの Node.js 補助スクリプト。
- `src/components/`: オーバーレイ画面の Vue コンポーネント。
- `src/components/tabs/`: 戦況、戦績、因縁、行動記録、統計、カレンダー、情報タブ。
- `src/composables/`: ACT/OverlayPlugin ログ解析と設定更新処理。
- `src/constants/`: アプリ定数と重要アクション定義。
- `src/tools/`: 表示名、日付、クリップボード、ダメージ解析などの共通処理。
- `src/views/`: メイン画面、設定画面、更新ログ画面。

## 2026-05-26 作業ログ

- 空の作業フォルダへ `InfSein/frontline-overlay` を clone した。
- `origin` を `jinwktk/frontline-overlay-jp.git`、`upstream` を元リポジトリへ設定する方針にした。
- `gh` CLI と `omx` CLI はこの環境に存在しないことを確認した。
- 日本語版として必要な最低条件を確認する `scripts/check-jp-repo.cjs` を追加した。
- その後ユーザーが `omx setup` を実行したため、`omx` v0.18.4 が利用可能になった。
- `C:\Users\mlove\.codex\config.toml` に重複 hook trust state があり `omx` が起動できなかったため、バックアップ `config.toml.bak-20260526-frontline-overlay-jp` を作成して古い重複 2 エントリを削除した。
- `omx doctor` は 0 failed。Windows 上の explore harness、prompt/skill 数、ユーザー AGENTS の警告は残っている。
- `npm test` を実行し、`package.json` の `name` が `frontline-overlay` のままであるため失敗することを確認した。
- 日本語版実装として、`package.json` / `package-lock.json` の名称を `frontline-overlay-jp` に変更し、`src/constants/app-info.ts` の GitHub リポジトリ URL と更新履歴 URL を日本語版へ変更した。
- 主要 UI 文言、設定画面、README、CHANGELOG を日本語化した。ログ解析の中国語正規表現や内部スキル名キーは、既存動作を壊さないため原則維持した。
- `external/cactbot` サブモジュールを初期化した。型チェック時に submodule 側の type-only import で失敗したため、`tsconfig.app.json` で `verbatimModuleSyntax: false` を明示した。
- `npm test`、`npm run type-check`、`npm run build` が通過した。`npm ci` 後の監査では moderate 2 件、high 6 件の脆弱性警告が出ているが、今回は依存更新は行っていない。
- ローカル Vite 開発サーバー `http://127.0.0.1:3000/` を起動し、Playwright MCP でトップ画面の日本語表示と初期化ログのみであることを確認した。
- GitHub Pages は公式 Actions の `configure-pages` / `upload-pages-artifact` / `deploy-pages` で `dist` を公開する構成へ変更した。
