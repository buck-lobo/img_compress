import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Envie uma imagem JPEG, PNG ou WEBP.'));
    }
  }
});

app.use(cors());

app.post('/compress', upload.single('image'), async (req, res) => {
  try {
    // Se não há arquivo enviado
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado. Certifique-se de enviar uma imagem válida.' });
    }

    const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1200 }) // opcional: redimensiona a largura
      .jpeg({ quality: 60 })   // compressão para JPEG
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(compressedBuffer);

  } catch (err) {
    console.error('[Erro na compressão]:', err.message);

    // Se o erro for por tipo de arquivo rejeitado
    if (err.message.includes('Tipo de arquivo não suportado')) {
      return res.status(415).json({ error: err.message });
    }

    res.status(500).json({ error: 'Falha ao processar a imagem. Tente novamente.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Compressor running on port ${PORT}`);
});
