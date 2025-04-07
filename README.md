# Ro嗶ot

![22](22.webp)

一隻設計來把[嗶諾](https://x.com/bnoecho030220)搞瘋的 Discord 機器人。

## 功能特色

- 🕒 **每日提醒**：每晚找個良辰吉時傳訊息到指定頻道，可以用來洗腦嗶諾他是兔兔。
- 🐰 **是兔兔！**：每當嗶諾不承認自己是兔兔時，提醒嗶諾他是兔兔並給他短暫的時間反省。

## 技術規格

- 使用 Discord.js v14 開發
- 需要 Node.js 22 以上版本
- 採用 TypeScript 開發，使用 Biome 進行代碼檢查和格式化

## 設定方式

1. 複製專案

   ```bash
   git clone https://github.com/rileychh/roBot.git
   cd roBot
   ```

2. 安裝依賴

   ```bash
   pnpm install
   ```

3. 根據 `.env.example` 建立 `.env` 檔案。

4. 建立 `data/dailyMessages.json` 檔案，格式如下：

   ```json
   [
     {
       "guild": "Discord伺服器ID",
       "channel": "頻道ID",
       "message": "要傳送的訊息"
     }
   ]
   ```

5. 啟動機器人

   ```bash
   pnpm run dev
   ```

## Docker 部署

```bash
docker buildx build -t robot .
docker run -d --name robot \
  -e DISCORD_TOKEN=你的_Discord_機器人_Token \
  -e BNO=BNO_的_Discord_ID \
  -e OLLAMA_PROTOCOL=https \
  -e OLLAMA_HOST=你的_Ollama_伺服器網址 \
  -e OLLAMA_MODEL=gemma3:4b \
  -v $(pwd)/data:/app/data \
  robot
```
