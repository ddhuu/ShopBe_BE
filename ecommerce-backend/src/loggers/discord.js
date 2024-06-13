"use strict";
require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged as ${client.user.tag}`);
});

const token = process.env.DISCORD_BOT_TOKEN;

client.login(token);

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "Hello") msg.reply("Hello| How can i help you today ?");
});
