import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.image) {
      return res.status(400).json({ error: 'Invalid image' });
    }

    const imagePath = files.image.filepath;

    try {
      const compressedBuffer = await sharp(imagePath)
        .resize(1024) // largura máxima
        .jpeg({ quality: 70 }) // compressão
        .toBuffer();

      res.setHeader('Content-Type', 'image/jpeg');
      res.send(compressedBuffer);
    } catch (err) {
      res.status(500).json({ error: 'Compression failed' });
    }
  });
}
