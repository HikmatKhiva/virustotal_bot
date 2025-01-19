import crypto from "crypto";
import fs from "fs";

export function calculateMD5(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => {
      hash.update(chunk);
    });
    stream.on("end", () => {
      const md5checksum = hash.digest("hex");
      resolve(md5checksum);
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
}