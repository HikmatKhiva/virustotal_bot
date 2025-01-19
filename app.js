import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { startCommand, menuCommand } from "./command/index.js";
import { checkFileHandler } from "./handler/index.js";
dotenv.config();
const token = process.env.BOT_TOKEN; // Ensure the environment variable name matches
export const bot = new TelegramBot(token, {
  polling: true,
  request: {
    agentOptions: {
      family: 4,
    },
  },
});
// Start command
bot.onText(/\/start/, startCommand);
// Menu command
bot.onText(/\/menu/, menuCommand);
// Handle callback queries
bot.on("callback_query", async (callback) => {
  const chatId = callback.message.chat.id;
  const data = callback.data;
  switch (data) {
    case "checkFile": {
      bot.sendMessage(chatId, "Faylni yuboring!");
      await checkFileHandler();
      break;
    }
    default:
      await bot.sendMessage(chatId, "Noto'g'ri xizmat turni tanlandi.");
  }
});
bot.on("polling_error", (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});

console.log("Bot is running");
