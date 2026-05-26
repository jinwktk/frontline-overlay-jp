# FFXIV PvP オーバーレイ 日本語版

[![GitHub Release](https://img.shields.io/github/v/release/jinwktk/frontline-overlay-jp?style=flat&logo=github)](https://github.com/jinwktk/frontline-overlay-jp/releases)
<br>
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite)
![Vue3](https://img.shields.io/badge/Vue-3.5.25-4FC08D?style=flat&logo=vue.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-06b6d4?logo=tailwindcss)

`InfSein/frontline-overlay` をベースにした、ファイナルファンタジーXIV PvP 向け ACT OverlayPlugin オーバーレイの日本語版です。

公開 URL:

```text
https://jinwktk.github.io/frontline-overlay-jp/
```

> [!TIP]
> 初期移植では UI とドキュメントの日本語化を優先しています。  
> ACT ログ解析は元リポジトリの中国語クライアント向け実装を含むため、日本語クライアントの公式ログ文言へ完全対応するには追加確認が必要です。

## 元リポジトリとの関係

- 元リポジトリ: `https://github.com/InfSein/frontline-overlay`
- 日本語版リポジトリ: `https://github.com/jinwktk/frontline-overlay-jp`
- `upstream` に元リポジトリを追加し、更新を取り込める構成にしています。
- upstream から更新を取り込む場合は、ユーザー向け文言を日本語へ変換してから反映します。

## 対応状況

この進捗は「戦況」パネルの解析対応状況です。  
「戦績」「因縁」「統計」パネルは、元実装の範囲でフロントライン／ライバルウィングズ／クリスタルコンフリクトの解析に対応しています。

| コンテンツ | 対応 |
| :-- | :--: |
| 外縁遺跡群（制圧戦） | :white_check_mark: |
| シールロック（争奪戦） | :white_check_mark: |
| フィールド・オブ・グローリー（砕氷戦） | :black_square_button: |
| オンサル・ハカイル（終節戦） | :white_check_mark: |
| ウォーコー・チーテー（演習戦） | :white_check_mark: |
| ライバルウィングズ | :black_square_button: |
| クリスタルコンフリクト | :black_square_button: |

## 主な機能

「戦況」タブでは、現在試合の残りポイント、拠点状況、K/D、K/D比、与ダメージを確認できます。

<table>
  <tr>
    <th colspan="2"><strong>現在の拠点状況と残りポイント予測をリアルタイム表示</strong></th>
  </tr>
  <tr>
    <td><img alt="App Preview: Situation 1" src="./docs/image/app_preview/situation_1.jpg" /></td>
    <td><img alt="App Preview: Situation 2" src="./docs/image/app_preview/situation_2.jpg" /></td>
  </tr>
  <tr>
    <th><strong>ノックアウト詳細を記録</strong></th>
    <th><strong>戦闘不能詳細を記録</strong></th>
  </tr>
  <tr>
    <td><img alt="App Preview: Knockout" src="./docs/image/app_preview/knockout.jpg" /></td>
    <td><img alt="App Preview: Death" src="./docs/image/app_preview/death.jpg" /></td>
  </tr>
  <tr>
    <th><strong>受けた重要支援スキルを記録</strong></th>
    <th><strong>受けた重要妨害スキルを記録</strong></th>
  </tr>
  <tr>
    <td><img alt="App Preview: Support" src="./docs/image/app_preview/goodboy.jpg" /></td>
    <td><img alt="App Preview: Interference" src="./docs/image/app_preview/badboy.jpg" /></td>
  </tr>
  <tr>
    <th><strong>自分が使用した重要スキルを記録</strong></th>
    <th><strong>当日の戦績を記録・集計・分析</strong></th>
  </tr>
  <tr>
    <td><img alt="App Preview: Important Action Log" src="./docs/image/app_preview/iar.png" /></td>
    <td><img alt="App Preview: Statistics" src="./docs/image/app_preview/statistics.jpg" /></td>
  </tr>
  <tr>
    <th><strong>現在と今後のフロントラインを表示</strong></th>
    <th><strong>折りたたんで表示領域を節約</strong></th>
  </tr>
  <tr>
    <td><img alt="App Preview: Calendar" src="./docs/image/app_preview/calendar.jpg" /></td>
    <td><img alt="App Preview: Folded" src="./docs/image/app_preview/folded.jpg" /></td>
  </tr>
</table>

## 使い方

1. `OverlayPlugin` で新しいオーバーレイを作成し、種類に `MiniParse` またはカスタムオーバーレイを選択します。
2. オーバーレイ URL に `https://jinwktk.github.io/frontline-overlay-jp/` を設定します。
3. 好みに合わせて位置、サイズ、拡大率を調整します。
4. 右上の設定ボタンから必要な項目を調整します。
5. 新しいバージョンが公開された場合は「情報」タブから確認・更新します。

### ローカル開発

```bash
npm ci
npm run dev
```

ローカルで確認する場合は、オーバーレイ URL を `http://localhost:3000` に設定します。

### 検証

```bash
npm test
npm run type-check
npm run build
```

### GitHub Pages のルーティング

`/config` や `/changelog` へ直接アクセスした場合は、`public/404.html` が `frontline-overlay-jp` のベースパスへ戻してからアプリ内ルーターに渡します。

### 日本語クライアントのログ解析

初期対応として、日本語クライアントのフロントライン参加ログと、シールロック（争奪戦）のアラガントームリス出現・占拠・中立化・枯渇ログを解析します。

### カレンダー

フロントラインのカレンダーは日本時間（JST）の24時、つまり翌日0時をリセット基準にします。

## ライセンス

元リポジトリには明示的なオープンソースライセンスが設定されていません。  
本リポジトリも安全性確認と個人利用を目的とした日本語化フォークとして扱います。

> [!CAUTION]
> 商用利用は禁止です。
