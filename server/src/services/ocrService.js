import Tesseract from "tesseract.js";

export async function extractTextFromImage(buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return data.text;
}
