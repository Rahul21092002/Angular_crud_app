const multer = require('multer');
const fs = require('fs');  // Add this line to use the file system module

// Create the 'uploads' directory if it doesn't exist
const uploadDirectory = './uploads';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 6000000 },
  });

module.exports = upload;
