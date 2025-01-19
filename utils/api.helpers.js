import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
dotenv.config();
// get analyses data
export async function getAnalyses(scanResultId) {
  const result = await axios.get(
    "https://www.virustotal.com/api/v3/analyses/" + scanResultId?.data?.id,
    {
      headers: {
        "x-apikey": process.env.virus_total_api_key,
      },
    }
  );
  return result.data;
}
// scan file
export async function scanFile(filePath) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  try {
    const response = await axios.post(
      "https://www.virustotal.com/api/v3/files",
      formData,
      {
        headers: {
          "x-apikey": process.env.virus_total_api_key, // Correctly set the API key
          ...formData.getHeaders(), // Automatically set the correct headers for FormData
        },
      }
    );
    // Check for errors in the response
    if (response.data.error) {
      console.error("API Error:", response.data.error.message);
      throw Error(response.data.error.message);
    }

    return response.data;
  } catch (err) {
    console.error(
      "Error occurred while scanning file:",
      err.response ? err.response.data : err.message
    );
    throw Error(err?.message || "Error occurred while scanning file");
  }
}
