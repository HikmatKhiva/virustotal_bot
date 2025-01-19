import { bot } from "../app.js";
import { resultScan } from "../services/index.js";
export const checkFileHandler = async () => {
  bot.on("document", async (msg) => {
    const chatId = msg.chat.id;
    try {
      await bot.sendMessage(chatId, "Fayl muvaffaqiyatli qabul qilindi!");
      await resultScan(msg);
    } catch (error) {
      console.error("Error processing document:", error);
      await bot.sendMessage(
        chatId,
        "Faylni qayta yuboring, xatolik yuz berdi."
      );
    }
  });
};
