import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
import { bot, virustotal } from "../app.js";
import path from "path";
import { extractDataMD5, messageTypes } from "../utils/helper.js";
import validUrl from "valid-url";
import { calculateMD5 } from "../utils/readMD5.js";
import { getBinCode } from "../binCode/index.js";
dotenv.config();
const FILE_SIZE_LIMIT = 30 * 1024 * 1024; // 30 MB
const __dirname = path.resolve();
const resultScan = async (msg) => {
  const chatId = msg.chat.id;
  // First check if document exists
  if (!msg.document) {
    return bot.sendMessage(chatId, "Fayl yuborilmadi");
  }

  // Then check file size
  if (msg.document.file_size > FILE_SIZE_LIMIT) {
    return bot.sendMessage(chatId, "Fayl hajmi 30 MB dan katta");
  }

  // Create temp file path outside try block so it's available in finally
  const tempFilePath = path.join(__dirname, "temp", msg.document.file_name);

  try {
    // Get file data
    const fileId = msg.document.file_id;
    const fileLink = await bot.getFileLink(fileId);

    // Validate URL
    if (!validUrl.isUri(fileLink)) {
      throw new Error("Invalid URL");
    }

    // Download the file
    const response = await axios({
      method: "GET",
      url: fileLink,
      responseType: "stream",
    });

    // Create a promise to handle the file writing process
    await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(tempFilePath);
      response.data.pipe(fileStream);
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });
    const md5 = await calculateMD5(tempFilePath);
    // Check if file has already been scanned (MD5 hash check)
    const hashCheckResult = await virustotal.checkMD5HASH(md5);
    if (hashCheckResult.status === 404) {
      // If not found in database, scan the file
      await virustotal.scanFile(tempFilePath);
      setTimeout(async () => {
        const hashResult = await virustotal.checkMD5HASH(md5);
        // If found in database, extract data and return results
        const res = await extractDataMD5(hashResult.data);
        // Send message before cleaning up the file
        await bot.sendMessage(chatId, messageTypes.checkFile(res), {
          parse_mode: "HTML",
        });
      }, 10000);
      await bot.sendMessage(
        chatId,
        "Sizning fayl bazada topilmadi uni tekshirib 2-3 daqiqadan keyin natijasi sizga yuboriladi."
      );
      return true; // Indicate successful completion
    } else {
      // If found in database, extract data and return results
      const res = await extractDataMD5(hashCheckResult.data);
      // Send message before cleaning up the file
      await bot.sendMessage(chatId, messageTypes.checkFile(res), {
        parse_mode: "HTML",
      });

      return true; // Indicate successful completion
    }
  } catch (error) {
    console.error("Error processing file:", error);
    await bot.sendMessage(
      chatId,
      "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
    );
    return false; // Indicate error
  } finally {
    // Always clean up the temp file, regardless of success or failure
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log(`Temporary file deleted: ${tempFilePath}`);
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
  }
};
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
export { resultScan, checkBinCodeService };
