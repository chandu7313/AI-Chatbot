import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.post('/api/command', async (req, res) => {
    try {
        const { command } = req.body;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: command }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('API Response:', response.data);

        res.json({ response: response.data?.candidates?.[0]?.content?.parts?.map(part => part.text).join(" ") || "No response from AI" });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to process command' });
    }
});

// ✅ Vercel handles `app.listen`, so export `app` instead
export default app;
