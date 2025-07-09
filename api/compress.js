import sharp from "sharp";
import formidable from "formidable-serverless";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err || !files.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    try {
      const imagePath = files.image.filepath;
      const buffer = await sharp(imagePath)
        .resize({ width: 1200 }) // opcional: redimensiona para largura máxima
        .jpeg({ quality: 60 }) // compressão JPEG
        .toBuffer();

      res.setHeader("Content-Type", "image/jpeg");
      res.send(buffer);
    } catch (error) {
      console.error("Compression error:", error);
      res.status(500).json({ error: "Compression failed" });
    }
  });
}
