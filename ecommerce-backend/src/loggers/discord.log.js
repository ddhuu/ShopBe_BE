"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_CHANNEL_ID, DISCORD_BOT_TOKEN } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = DISCORD_CHANNEL_ID;

    this.client.on("ready", () => {
      console.log(`Logged as ${this.client.user.tag}`);
    });

    this.client.login(DISCORD_BOT_TOKEN);
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some addtional information about the code",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("0000ff", 16),
          title,
          description: "``` json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.log("Channel not found");
      return;
    }

    channel.send(message).catch((e) => console.error(e));
  }
}

const loggerService = new LoggerService();

module.exports = loggerService;
