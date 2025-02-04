import { bot } from "../app.js";
import { checkBinCodeService, resultScan } from "../services/index.js";
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
export const checkBankBinCode = async () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const code = msg.text;
    try {
      // Validate BIN code (must be 6 digits)
      if (!/^\d{6}$/.test(code)) {
        return bot.sendMessage(
          chatId,
          "Iltimos, 6 xonali BIN kodini kiriting."
        );
      }
      await checkBinCodeService(msg);
    } catch (error) {
      console.error("Error processing document:", error);
      await bot.sendMessage(
        chatId,
        "Codeni qayta yuboring, xatolik yuz berdi."
      );
    }
  });
};
// export const handleMessage = async () => {
//   bot.on("message", async (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;

//     if (text && text.startsWith("/checkbin")) {
//       const binCode = text.split(" ")[1];
//       if (binCode) {
//         try {
//           await bot.sendMessage(chatId, "Bin code qabul qilindi, tekshirilmoqda...");
//           const result = await checkBinCodeService({ binCode });
//           await bot.sendMessage(chatId, `Tekshiruv natijasi: ${result}`);
//         } catch (error) {
//           console.error("Error processing bin code:", error);
//           await bot.sendMessage(chatId, "Codeni qayta yuboring, xatolik yuz berdi.");
//         }
//       } else {
//         await bot.sendMessage(chatId, "Iltimos, bin kodni kiriting. Misol: /checkbin 123456");
//       }
//     }
//   });
// };
