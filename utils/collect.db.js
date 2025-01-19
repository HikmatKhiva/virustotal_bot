import fs from "fs";
import { calculateMD5 } from "./readMD5.js";
import path from "path";
const __dirname = path.resolve();
const pathDB = path.join(__dirname, "database", "db.json");
// read database json
function readDataField() {
  try {
    const db = fs.readFileSync(pathDB, "utf8");
    return JSON.parse(db);
  } catch (error) {}
}
//
function writeDataToFile(data) {
  if (!Array.isArray(data)) return;
  const jsonData = JSON.stringify(data, null, 2);
  if (!jsonData) return;
  fs.writeFileSync(pathDB, jsonData, "utf-8");
}
// Function to add a new data
async function addData({ data, meta }) {
  const db = readDataField();
  const exist = db.find(
    (item) => item.meta.file_info.md5 === meta.file_info.md5
  );
  if (exist) return;
  const newData = {
    id: db?.length + 1,
    stats: data.attributes.stats,
    meta: meta,
  };
  // Add the new data to the array
  db?.push(newData);
  // Write updated data back to the file
  writeDataToFile(db);
}
export async function checkLocalDatabase(filePath) {
  if (!fs.existsSync(filePath)) return;
  const db = readDataField();
  if (!Array.isArray(db)) return;
  const md5Hash = await calculateMD5(filePath);
  const data = db.find((item) => item.meta.file_info.md5 === md5Hash);
  console.log("it's checked local db");
  return { exist: true, data };
}
export default addData;
