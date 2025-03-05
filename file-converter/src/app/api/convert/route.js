import fs from "fs";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to handle file upload manually
  },
};

export async function POST(req) {
  // Create a new instance of formidable
  const form = formidable({
    uploadDir: "./", // Specify where to upload the files
    keepExtensions: true, // Keep file extensions
    maxFileSize: 10 * 1024 * 1024, // Max file size limit (optional, adjust as needed)
  });

  // Handle the form parsing using a promise
  const formParse = new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(NextResponse.json({ error: "File processing error" }, { status: 500 }));
      }

      const file = files.file[0];
      const filePath = file.filepath;
      const mimeType = file.mimetype;

      try {
        let outputBuffer;

        // Check if the file is an image
        if (mimeType.startsWith("image/")) {
          // Perform image conversion based on the requested format
          if (fields.format === "webp") {
            outputBuffer = await sharp(filePath).webp().toBuffer();
          } else if (fields.format === "png") {
            outputBuffer = await sharp(filePath).png().toBuffer();
          } else if (fields.format === "jpeg" || fields.format === "jpg") {
            outputBuffer = await sharp(filePath).jpeg().toBuffer();
          } else if (fields.format === "pdf") {
            // Convert the image to PDF
            const pdfDoc = await PDFDocument.create();
            const imageBytes = fs.readFileSync(filePath); // Read the file as bytes
            const image = await pdfDoc.embedPng(imageBytes); // Embed the image into the PDF
            const page = pdfDoc.addPage([image.width, image.height]); // Add a page based on the image size
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            outputBuffer = await pdfDoc.save(); // Save the PDF as a buffer
          } else {
            return reject(
              NextResponse.json({ error: "Unsupported format" }, { status: 400 })
            );
          }
        } else {
          return reject(
            NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
          );
        }

        // Return the converted file as a response
        return resolve(
          new NextResponse(outputBuffer, {
            headers: {
              "Content-Type": mimeType,
              "Content-Disposition": `attachment; filename=converted.${fields.format}`,
            },
          })
        );
      } catch (error) {
        return reject(NextResponse.json({ error: "Conversion failed" }, { status: 500 }));
      }
    });
  });

  return formParse;
}
