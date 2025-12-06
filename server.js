import express from 'express'
import cors from 'cors'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express();
app.use(cors());

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API endpoint
app.get('/api/horoscope', async (req, res) => {
  try {
    const { sign } = req.query;
    const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`;
    
    const response = await axios.get(apiUrl);
    res.json(response.data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the dist directory (built frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// For any other route, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Combined server running on http://localhost:${PORT}`);
});