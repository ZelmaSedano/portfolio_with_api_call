// justine: I haven't used express since the bootcamp, gonna add comments for myself
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initiate that app using express
const app = express();


// middleware
app.use(cors());
// parses the incoming JSON data
app.use(express.json());

// serve static files from dist folder
// dist === distribution file for deployment
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint
app.get('/api/horoscope', async (req, res) => {
  console.log('hi there I am the horoscope')
  try {
    const { sign } = req.query;
    if (!sign) {
      return res.status(400).json({ error: 'Sign parameter is required' });
    }
    const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`;
    
    const response = await axios.get(apiUrl);
    res.json(response.data);
    
  } catch (error) {
    console.error('Horoscope API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch horoscope',
      details: error.message 
    });
  }
});

// wildcard route
// client-side routes like /about, /profile, /settings
// fall here and get the SPA's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// local development - set the port location
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;