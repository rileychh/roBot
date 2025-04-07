import type { Client } from "discord.js";
import type { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import dailyMessages from "../data/dailyMessages.json" with { type: "json" };

interface DailyMessageConfig {
  guild: string;
  channel: string;
  message: string;
}

interface Database {
  scheduledMessages: Record<string, string>;
}

let db: Low<Database>;

// Create a unique ID for each message configuration
function createMessageId(config: DailyMessageConfig): string {
  return `${config.guild}-${config.channel}-${config.message.substring(0, 10)}`;
}

export async function initializeDailyMessages(client: Client) {
  db = await JSONFilePreset<Database>("data/db.json", {
    scheduledMessages: {},
  });

  for (const config of dailyMessages as DailyMessageConfig[]) {
    await scheduleMessage(client, config);
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

    await channel.send({
      content: config.message,
      options: { allowedMentions: { parse: [] } },
    });

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

export async function scheduleMessage(
  client: Client,
  config: DailyMessageConfig,
) {
  const now = new Date();
  const messageId = createMessageId(config);

  // Try to find an existing scheduled date in the database
  await db.read();
  const existingSchedule = db.data.scheduledMessages[messageId] ?? null;

  let targetDate = new Date();

  if (existingSchedule && new Date(existingSchedule) > now) {
    // Use the stored date if it's in the future
    targetDate = new Date(existingSchedule);

    console.log(
      `Message "${messageId}" reusing existing schedule for ${targetDate.toISOString()}`,
    );
  } else {
    // Calculate a new random time
    // Random hour between 12 PM and 12 AM
    const randomHour = Math.floor(Math.random() * 12) + 12;
    const randomMinute = Math.floor(Math.random() * 60);

    targetDate.setHours(randomHour, randomMinute, 0, 0);

    // If the time is in less than 12 hours, schedule for tomorrow
    if (targetDate.getTime() - now.getTime() < 12 * 60 * 60 * 1000) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    // Store the new schedule in the database
    await db.update(({ scheduledMessages }) => {
      scheduledMessages[messageId] = targetDate.toISOString();
    });

    console.log(
      `Message "${messageId}" newly scheduled for ${targetDate.toISOString()}`,
    );
  }

  const timeUntilMessage = targetDate.getTime() - now.getTime();

  setTimeout(() => {
    sendDailyMessage(client, config);
    // Schedule the next message after this one is sent
    scheduleMessage(client, config);
  }, timeUntilMessage);
}
