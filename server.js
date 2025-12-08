// server.js - ADD THESE LINES at the top after imports:
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... your existing cors, express.json() setup ...

// ✅ ADD THIS LINE - Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// ... your /api/horoscope route ...

// ✅ ADD THIS LINE AT THE END - Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});