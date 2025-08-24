// // routes/api.js
// import express from 'express';
// import { uploadDocument, getAllDocuments } from '../controllers/documentController.js';
// import { queryDocument } from '../controllers/queryController.js';
// import configureFileUpload from '../utils/fileUpload.js';
// import { login, signup } from '../controllers/authController.js';

// const upload = configureFileUpload();
// const router = express.Router();

// // Document routes
// router.post('/upload', upload.single('pdf'), uploadDocument);
// router.get('/documents', getAllDocuments);

// // Auth Route
// router.post('/signup', signup);
// router.post('/login', login);

// // Query route
// router.post('/query', queryDocument);

// export default router;

// routes/api.js
import express from 'express';
import { uploadDocument, getAllDocuments } from '../controllers/documentController.js';
import { queryDocument } from '../controllers/queryController.js';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { signup } from '../controllers/authController.js';
import { login } from '../controllers/authController.js';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Document routes
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/documents', getAllDocuments);
// // Auth Route
 router.post('/signup', signup);
 router.post('/login', login);
// Query route
router.post('/query', queryDocument);

export default router;