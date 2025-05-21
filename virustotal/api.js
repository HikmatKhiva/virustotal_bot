import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const API_KEY = process.env.virus_total_api_key;
// get analyses data

export class VirusTotal {
  constructor(api) {
    this.url = `https://www.virustotal.com/api/v3/`;
    this.api = api;
  }
  async checkMD5HASH(hash) {
    try {
      const response = await fetch(`${this.url}/files/${hash}`, {
        method: "GET",
        headers: {
          "x-apikey": this.api,
        },
      });
      if (response.status === 404) {
        return { status: 404, message: "File not found" };
      }
      const data = await response.json();
      return { data, status: 200, message: "File found" };
    } catch (error) {
      return { status: 500, message: error.message || "API Error" };
    }
  }
  async scanFile(tempFilePath) {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempFilePath));
    try {
      const response = await fetch(`${this.url}`, {
        method: "POST",
        body: formData,
        headers: {
          "x-apikey": this.api,
          ...formData.getHeaders(),
        },
      });
      if (response.status !== 200) {
        return { status: response.status, message: "API Error" };
      }
      return { status: 404, message: "File not found" };
    } catch (error) {
      return { status: 500, message: error.message || "API Error" };
    }
  }
  async getAnalyses(scanResultId) {
    try {
      const response = await fetch(`${this.url}/analyses/${scanResultId}`, {
        method: "GET",
        headers: {
          "x-apikey": this.api,
        },
      });
      if (response.status !== 200) {
        return { status: response.status, message: "API Error" };
      }
      const data = await response.json();
      return { data, status: 200, message: "analyses found" };
    } catch (error) {
      return { status: 500, message: error.message || "API Error" };
    }
  }
}
