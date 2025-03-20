// routes/index.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexHtmlPath = path.join(__dirname, '..', 'views', 'index.html');

// Render the index page
router.get('/', (req, res) => {
  try {
    const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    res.status(500).send('Error loading the page');
  }
});

export default router;