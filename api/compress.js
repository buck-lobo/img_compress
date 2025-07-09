import formidable from 'formidable';
import sharp from 'sharp';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.image) {
      return res.status(400).send('Image not provided or error parsing');
    }

    try {
      const file = files.image[0];
      const inputBuffer = fs.readFileSync(file.filepath);

      const compressedBuffer = await sharp(inputBuffer)
        .resize({ width: 1200 })        // você pode ajustar isso
        .jpeg({ quality: 60 })          // controle de compressão
        .toBuffer();

      res.setHeader('Content-Type', 'image/jpeg');
      res.send(compressedBuffer);
    } catch (e) {
      res.status(500).send('Compression failed: ' + e.message);
    }
  });
}
