// app.js - Main application setup
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import apiRoutes from './routes/api.js';
import indexRoute from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import spaceRoutes from './routes/spaceRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import queryRoutes from './routes/queryRoutes.js'; // Add this import
// ...
 
// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', queryRoutes); // Add this line for query routes
app.use('/api', apiRoutes);
app.use('/', indexRoute);

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

export default app;