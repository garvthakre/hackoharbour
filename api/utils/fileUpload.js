// utils/fileUpload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up multer for file uploads
const configureFileUpload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
      }
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  return multer({ storage });
};

export default configureFileUpload;