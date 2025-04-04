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

3. 建立 `.env` 檔案，加入以下內容：

   ```ini
   DISCORD_TOKEN=你的Discord機器人Token
   BNO=特定使用者的Discord ID
   ```

4. 建立 `dailyMessages.json` 檔案，格式如下：

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
  -v $(pwd)/dailyMessages.json:/app/dailyMessages.json \
  robot
```
