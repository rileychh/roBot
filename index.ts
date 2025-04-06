import { Client, Events, GatewayIntentBits } from "discord.js";
import { handleBunnyDenial } from "./bunnyDenial.ts";
import { initializeDailyMessages } from "./dailyMessage.ts";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  initializeDailyMessages(client);
});

client.on(Events.MessageCreate, handleBunnyDenial);

client.login(process.env.DISCORD_TOKEN);
