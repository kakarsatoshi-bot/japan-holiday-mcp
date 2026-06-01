# MCP Server Template (Minimal)

> DBなしで始められる、最小構成のMCPサーバーテンプレートです。

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](https://github.com/kakarsatoshi-bot/mcp-template/generate)

## 概要 / Overview

**Supabase不要。** Cloudflare Workers + TypeScript だけで動くMCPサーバーの最小構成テンプレートです。

This is a minimal MCP server template that runs on Cloudflare Workers + TypeScript. **No Supabase required.**

**含まれるもの / Includes:**

- ✅ TypeScript + Cloudflare Workers の設定済み構成
- ✅ ping ツール（接続テスト用）
- ✅ サンプルツール（カスタマイズ用）
- ✅ Cloudflare Workers Logs によるクエリログ
- ✅ 日本語＋英語セットアップガイド

**向いている用途 / Good for:**

- 計算・変換ツール
- 外部APIをラップするツール
- 静的データを返すツール
- まずMCPサーバーの仕組みを学びたい人

**DBありの構成が必要な場合 / Need database?**

→ [mcp-template-with-db](https://github.com/kakarsatoshi-bot/mcp-template-with-db) を使ってください。

## 詳細ガイド / Complete Guide

セットアップの詳細手順・詰まりポイント集・Smithery登録手順をまとめた完全ガイドを販売中です。

🛒 **[完全ガイドを購入する（$29）](https://tsukuras.gumroad.com/l/mcp-template)**

Purchase the complete setup guide with detailed instructions, troubleshooting tips, and Smithery registration steps.

---

## クイックスタート / Quick Start

### 1. テンプレートを使用 / Use this template

上の「Use this template」ボタンをクリック。

### 2. インストール / Install

```bash
npm install
```

### 3. デプロイ / Deploy

```bash
npx wrangler login
npx wrangler deploy
```

## セットアップ詳細 / Detailed Setup

- 🇯🇵 [日本語ガイド](docs/SETUP_JA.md)
- 🇬🇧 [English Guide](docs/SETUP_EN.md)

## 技術スタック / Tech Stack

| | |
|---|---|
| Runtime | Cloudflare Workers |
| Language | TypeScript |
| MCP SDK | `agents` + `@modelcontextprotocol/sdk` |

## 作成者 / Author

[Tsukuras](https://tsukuras.jp)

## ライセンス / License

MIT


## 🔗 Related MCPs (Japan Data Series)

| MCP | Description |
|---|---|
| [japan-holiday-mcp](https://github.com/kakarsatoshi-bot/japan-holiday-mcp) | Japanese national holidays |
| [japan-weather-mcp](https://github.com/kakarsatoshi-bot/japan-weather-mcp) | Japan weather forecast (JMA) |
| [japan-realestate-mcp](https://github.com/kakarsatoshi-bot/japan-realestate-mcp) | Japan real estate transaction prices (MLIT) |