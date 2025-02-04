import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
import { bot } from "../app.js";
import path from "path";
import validUrl from "valid-url";
import { getAnalyses, getBinCode, scanFile } from "../utils/api.helpers.js";
dotenv.config();
const FILE_SIZE_LIMIT = 30 * 1024 * 1024; // 30 MB
const __dirname = path.resolve();
const key = import.meta.bin_table_api;
const resultScan = async (msg) => {
  // get a file data
  const chatId = msg.chat.id;
  const fileId = msg.document.file_id;
  const fileLink = await bot.getFileLink(fileId);
  // before rule validations
  if (msg.document.file_size > FILE_SIZE_LIMIT)
    return bot.sendMessage(chatId, "Fayl hajmi 30 MB dan katta");
  if (!msg.document) return bot.sendMessage(chatId, "Fayl yuborilmadi");
  if (!validUrl.isUri(fileLink)) throw new Error("Invalid URL");
  // (get and write)a file path
  const tempFilePath = path.join(__dirname, "temp", msg.document.file_name);

  const response = await axios({
    method: "GET",
    url: fileLink,
    responseType: "stream",
  });

  response.data.pipe(
    fs.createWriteStream(tempFilePath).on("finish", async () => {
      // Scan the file using VirusTotal
      const scanResultId = await scanFile(tempFilePath);
      const response = await getAnalyses(scanResultId);
      fs.unlinkSync(tempFilePath);
      return bot.sendMessage(
        chatId,
        `Tekshiruv natijasida 66ta antivirusdan: \n
        zararli: <b>${response.data.attributes.stats.malicious}</b> 
        shubhali: <b>${response.data.attributes.stats.suspicious}</b>
        aniqlanmagan:<b>${response.data.attributes.stats.undetected}</b> deb topildi.
       `,
        { parse_mode: "HTML" }
      );
    })
  );
};
// Contact
async function Contact() {}
// Check Bin Code
async function checkBinCodeService(msg) {
  const chatId = msg.chat.id;
  const code = msg.text.trim();
  await bot.sendMessage(chatId, "Code muvaffaqiyatli qabul qilindi!");
  const { data } = await getBinCode(code);
  return bot.sendMessage(
    chatId,
    `Card: \n
    scheme: <b>${data.card.scheme}</b> 
    turi: <b>${data.card.type}</b>
    Mamlakat nomi:<b>${data.country.name}</b>
    Mamlakat valyutasi:<b>${data.country.currency}</b>
    Bank nomi:<b>${data.bank.name}</b>
    Bank web sayti:<b>${data.bank.website}</b>
    Bank raqami:<b>${data.bank.phone}</b>
   `,
    { parse_mode: "HTML" }
  );
}

export { resultScan, Contact, checkBinCodeService };
