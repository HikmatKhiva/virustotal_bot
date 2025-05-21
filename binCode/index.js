import dotenv from "dotenv";
dotenv.config();
// get response bin code
export async function getBinCode(code) {
  const result = await fetch(
    `https://api.bintable.com/v1/${code}?api_key=${process.env.bin_table_api}`
  );
  if (!result.ok) return { status: result.status, message: "API Error" };
  const data = await result.json();
  return { data, status: result.status };
}