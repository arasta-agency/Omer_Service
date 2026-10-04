import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// License plate OCR endpoint powered by Gemini 3.8 Flash
app.post('/api/ocr-plate', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are a precision vehicle license plate scanner.
Examine this image carefully and extract the vehicle license plate (especially Kurdistan Region and Iraqi plates).

Official number plates in Iraq and the Kurdistan Region:
Kurdistan Region plates feature an additional "KR" mark:
- 21: Sulaymaniyah / سلێمانی (features "KR" mark)
- 22: Erbil / هەولێر (features "KR" mark)
- 23: Halabja / هەڵەبجە (features "KR" mark)
- 24: Duhok / دهۆک (features "KR" mark)

Federal Iraqi plates:
- 11: Baghdad / بەغداد
- 12: Nineveh / نەینەوا (مووسڵ)
- 13: Maysan / میسان
- 14: Basra / بەسرە
- 15: Anbar / ئەنبار
- 16: Qadissiyyah (Diwaniyah) / قادسیە (دیوانیە)
- 17: Muthanna / موسەننا
- 18: Babylon / بابل
- 19: Karbala / کەربەلا
- 20: Diyala / دیالە

Standard Plate Format:
- Two-digit province code (e.g. 21, 22, 23, 24, 11, 14, etc.)
- Followed by single letter: A, B, C, D, E, F, G, H, J, K, L, M, N, P, R, S, T, U, V, W, X, Y, Z.
- Followed by numbers: e.g. 11111, 45892, 77123, 11840, 90812.
- Typical standard output example: "21 H 11111" or "22 A 45892" or "23 B 12048" or "24 A 77123".

Non-registered cars (called "علوج" / Alooj in Kurdistan):
- These vehicles DO NOT follow the 21 H or 22 A format; they have no governorate code and no letter, only numbers (e.g. "84920" or "51293").
- If the plate or car has only numbers or is an unregistered vehicle (علوج), set plateNumber to just those numbers (e.g. "84920") and set city to "علوج".

Numerals and City Matching:
- If written in Eastern Arabic numerals or Kurdish characters (like ۲۱ هـ ۱۱۱۱۱ or ٨٤٩٢٠), convert them to standard numerals: "21 H 11111" or "84920".
- Match city accurately based on the 2-digit code:
  21 -> "سلێمانی", 22 -> "هەولێر", 23 -> "هەڵەبجە", 24 -> "دهۆک", 11 -> "بەغداد", 12 -> "نەینەوا", 13 -> "میسان", 14 -> "بەسرە", 15 -> "ئەنبار", 16 -> "قادسیە", 17 -> "موسەننا", 18 -> "بابل", 19 -> "کەربەلا", 20 -> "دیالە", or "علوج".
- If the vehicle's make/brand (e.g. Toyota, Nissan, Ford, Hyundai, Kia, Chevrolet, BMW, Mercedes) and model are visible, extract them too.
Return strict JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        prompt,
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plateNumber: {
              type: Type.STRING,
              description: 'Standard plate number format, e.g. "21 H 11111" or "22 A 45892"',
            },
            city: {
              type: Type.STRING,
              description: 'City in Kurdish: سلێمانی, هەولێر, دهۆک, کەرکووک, or بەغداد',
            },
            make: {
              type: Type.STRING,
              description: 'Car brand/make if visible or empty string',
            },
            model: {
              type: Type.STRING,
              description: 'Car model if visible or empty string',
            },
          },
          required: ['plateNumber', 'city'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error scanning license plate:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze license plate',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
