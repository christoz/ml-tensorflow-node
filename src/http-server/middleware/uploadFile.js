import multer from '@koa/multer';
import path from 'path';

// Upload File Storage Path and File Naming
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(path.dirname(require.main.filename), '../uploads'));
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

// File upload restrictions
const limits = {
  fields: 1,
  fileSize: 50 * 1000 * 1024, // max 50 mb
  files: 1,
};

export default multer({storage, limits}).single('file');
