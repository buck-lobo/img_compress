import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/compress', upload.single('image'), async (req, res) => {
  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1200 }) // redimensiona se quiser
      .jpeg({ quality: 60 })   // compressão jpeg
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(compressedBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Compression failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Compressor running on port ${PORT}`);
});
