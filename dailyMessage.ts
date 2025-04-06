import type { Client } from "discord.js";
import dailyMessages from "./dailyMessages.json" with { type: "json" };

interface DailyMessageConfig {
  guild: string;
  channel: string;
  message: string;
}

export function initializeDailyMessages(client: Client) {
  for (const config of dailyMessages as DailyMessageConfig[]) {
    scheduleMessage(client, config);
  }
}

export async function sendDailyMessage(
  client: Client,
  config: DailyMessageConfig,
) {
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
      `Daily message sent to ${guild.name}#${
        channel.name
      } at ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error(
      `Failed to send message to ${config.guild}#${config.channel}:`,
      error,
    );
  }
}

export function scheduleMessage(client: Client, config: DailyMessageConfig) {
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
    sendDailyMessage(client, config);
    // Schedule the next message after this one is sent
    scheduleMessage(client, config);
  }, timeUntilMessage);
}
