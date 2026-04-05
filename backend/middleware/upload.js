const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/papers';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive:
     true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// File filter - only accept PDF files
const fileFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Middleware for single PDF upload
const uploadPaperPDF = upload.single('paperFile');


// const handleUploadError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: 'File too large. Maximum size is 10MB'
//       });
//     }
//     return res.status(400).json({
//       success: false,
//       message: 'File upload error: ' + err.message
//     });
//   } else if (err) {
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
//   next();
// };


const excelStorage = multer.memoryStorage();

const excelFilter = (req, file, cb) => {
  const allowed =
    file.mimetype.includes('spreadsheet') ||
    file.originalname.endsWith('.xlsx') ||
    file.originalname.endsWith('.xls');

  if (allowed) cb(null, true);
  else cb(new Error('Only Excel files allowed'), false);
};

const excelUpload = multer({
  storage: excelStorage,
  fileFilter: excelFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadExcel = excelUpload.single('file');


/* ===============================
   ERROR HANDLER
=================================*/

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

module.exports = {
  uploadPaperPDF,
  uploadExcel,
  handleUploadError
};