import { bot } from "../app.js";
import { replyOptions, menuOptions } from "../options/index.js";
export const startCommand = async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Assalomu Alaykum Cyber Security Botga Xush Kelibsiz \n Siz bu bot orqali 30mb fayllarni tekshirishingiz mumkin",
    replyOptions
  );
};
export const menuCommand = async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Xizmat turini tanlang",
    menuOptions
  );
};