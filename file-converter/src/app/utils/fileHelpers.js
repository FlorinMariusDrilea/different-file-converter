import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import fs from "fs";

/**
 * Convert an image to the specified format (webp, png, jpeg).
 * @param {string} filePath - Path to the uploaded file.
 * @param {string} format - Target format (webp, png, jpeg, pdf).
 * @returns {Promise<Buffer>} - Converted file buffer.
 */
export async function convertImage(filePath, format) {
  const mimeType = getFileMimeType(filePath);

  if (!mimeType.startsWith("image/")) {
    throw new Error("Unsupported file type. Only images are allowed.");
  }

  let outputBuffer;

  if (format === "webp") {
    outputBuffer = await sharp(filePath).webp().toBuffer();
  } else if (format === "png") {
    outputBuffer = await sharp(filePath).png().toBuffer();
  } else if (format === "jpeg" || format === "jpg") {
    outputBuffer = await sharp(filePath).jpeg().toBuffer();
  } else if (format === "pdf") {
    // Convert Image to PDF
    const pdfDoc = await PDFDocument.create();
    const imageBytes = fs.readFileSync(filePath);
    const image = await pdfDoc.embedPng(imageBytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    outputBuffer = await pdfDoc.save();
  } else {
    throw new Error("Unsupported format.");
  }

  return outputBuffer;
}

/**
 * Get MIME type of a file based on its extension.
 * @param {string} filePath - Path to the file.
 * @returns {string} - MIME type.
 */
export function getFileMimeType(filePath) {
  const extension = filePath.split(".").pop().toLowerCase();
  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  return mimeTypes[extension] || "application/octet-stream";
}
