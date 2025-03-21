// index.js - Entry point
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});