// Justine: I haven't worked with middleware for awhile, here are some comments for you to review to understand how the file works

import express from 'express'
import cors from 'cors'
// HTTP requessts to external API's
import axios from 'axios'
import path from 'path'
// converts URL to file path
import { fileURLToPath } from 'url'

// get current file's path
const __filename = fileURLToPath(import.meta.url);
//get directory name from the _filepath
const __dirname = path.dirname(__filename);

const app = express();
// fix cors issues
app.use(cors());

// defin API endpoint
app.get('/api/horoscope', async (req, res) => {
  try {
    // extract the zodiac sign from query parameters
    const { sign } = req.query;
    // adding the sign to the external API URL
    const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`;
    
    // make GET request to external horoscope API
    const response = await axios.get(apiUrl);
    // send the API response data back to client as JSON - JSONify
    res.json(response.data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from 'dist' directory (look at google docs, I some notes on what 'dist' is)
app.use(express.static(path.join(__dirname, 'dist')));
// server statis assets from src/assets directory
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));

// catch-all route for Single Page Applications - serves index.html for any other route
app.get('*', (req, res) => {
  // send the main HTML file for client-side routing
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// defines port
const PORT = process.env.PORT || 3001;
// start the server on specified port
// Justine: don't check devtools, this will show up as a message in the node server
app.listen(PORT, () => {
  console.log("test test server is working");
});