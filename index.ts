import { Client, Events, GatewayIntentBits } from "discord.js";
import dailyMessages from "./dailyMessages.json" with { type: "json" };
import { containsBunny } from "./matcher";

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

function scheduleMessage(config: DailyMessageConfig) {
  const now = new Date();

  // Calculate a random time for today (if it's still possible) or tomorrow
  const targetDate = new Date();

  // Random hour between 12 PM and 12 AM
  const randomHour = Math.floor(Math.random() * 12) + 12;
  const randomMinute = Math.floor(Math.random() * 60);

  targetDate.setHours(randomHour, randomMinute, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (targetDate.getTime() <= now.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const timeUntilMessage = targetDate.getTime() - now.getTime();

  // Truncate message for logging if it's too long
  const truncatedMessage =
    config.message.length > 20
      ? `${config.message.substring(0, 19)}…`
      : config.message;

  console.log(
    `Message scheduled for ${targetDate.toISOString()}: "${truncatedMessage}"`,
  );

  setTimeout(() => {
    sendDailyMessage(config);
    // Schedule the next message after this one is sent
    scheduleMessage(config);
  }, timeUntilMessage);
}

async function sendDailyMessage(config: DailyMessageConfig) {
  try {
    const guild = client.guilds.cache.get(config.guild);
    if (!guild) {
      console.error(`Guild with ID ${config.guild} not found`);
      return;
    }

    const channel = guild.channels.cache.get(config.channel);
    if (!channel || !channel.isTextBased()) {
      console.error(
        `Text channel with ID ${config.channel} not found or is not a text channel`,
      );
      return;
    }

    await channel.send(config.message);
    console.log(
      `Daily message sent to ${guild.name}#${channel.name} at ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error(
      `Failed to send message to ${config.guild}#${config.channel}:`,
      error,
    );
  }
}

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  const messageConfigs = dailyMessages as DailyMessageConfig[];

  // Schedule each message separately with its own random time
  for (const config of messageConfigs) {
    scheduleMessage(config);
  }
});

client.on(Events.MessageCreate, async (message) => {
  const bno = process.env.BNO;

  if (
    message.author.id !== bno ||
    !containsBunny(message.content) ||
    !message.guild
  )
    return;

  const member = message.guild.members.cache.get(bno);
  if (!member) return;

  try {
    await member.timeout(22 * 100, "你是 22！");
    console.log(`User ${member.user.tag} timed out for 2.2 seconds.`);

    await message.channel.send(
      `你是 22！${member.user.displayName} 被禁言了 2.2 秒。`,
    );
  } catch (error) {
    console.error("Failed to timeout user:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);
