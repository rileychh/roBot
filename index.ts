import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import dailyMessages from "./dailyMessages.json" with { type: "json" };

interface DailyMessageConfig {
  guild: string;
  channel: string;
  message: string;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function scheduleRandomDailyMessage() {
  const now = new Date();

  // Calculate a random time for today (if it's still possible) or tomorrow
  const targetDate = new Date();

  // Random hour between 12 AM and 12 PM
  const randomHour = Math.floor(Math.random() * 13);
  const randomMinute = Math.floor(Math.random() * 60);

  targetDate.setHours(randomHour, randomMinute, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (targetDate.getTime() <= now.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const timeUntilMessage = targetDate.getTime() - now.getTime();

  console.log(`Daily message scheduled for ${targetDate.toLocaleString()}`);

  setTimeout(() => {
    sendDailyMessages();
    // Schedule the next message after this one is sent
    scheduleRandomDailyMessage();
  }, timeUntilMessage);
}

async function sendDailyMessages() {
  const messageConfigs = dailyMessages as DailyMessageConfig[];

  for (const config of messageConfigs) {
    try {
      const guild = client.guilds.cache.get(config.guild);
      if (!guild) {
        console.error(`Guild with ID ${config.guild} not found`);
        continue;
      }

      const channel = guild.channels.cache.get(config.channel);
      if (!channel || !channel.isTextBased()) {
        console.error(
          `Text channel with ID ${config.channel} not found or is not a text channel`,
        );
        continue;
      }

      await channel.send(config.message);
      console.log(
        `Daily message sent to ${guild.name}#${channel.name} at ${new Date().toLocaleString()}`,
      );
    } catch (error) {
      console.error(
        `Failed to send message to guild ${config.guild}, channel ${config.channel}:`,
        error,
      );
    }
  }
}

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  // Start scheduling daily messages once the bot is ready
  scheduleRandomDailyMessage();
});

client.on(Events.MessageCreate, async (message) => {
  const bno = process.env.BNO;

  if (
    message.author.id !== bno ||
    !message.content.match(/(?:不是\s*|84)22/) ||
    !message.guild
  )
    return;

  const member = message.guild.members.cache.get(bno);
  if (!member) return;

  try {
    await member.timeout(22 * 1000, "你是 22！");
    console.log(`User ${member.user.tag} timed out for 22 seconds.`);

    await message.channel.send(
      `你是 22！${member.user.displayName} 被禁言了 22 秒。`,
    );
  } catch (error) {
    console.error("Failed to timeout user:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);
