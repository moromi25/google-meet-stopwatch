# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

#

## chrome.storage に繋がない状態での開発

1. `npm run build`でビルド
1. Chrome 拡張機能のページ（chrome://extensions/）にビルドされたフォルダ（`google-meet-stopwatch`ディレクトリ）をドラッグ＆ドロップ
   - デフォルトは`dist`というディレクトリ名になっているが、vite.config.js で変更している

## chrome.storage に繋いだ状態での開発
