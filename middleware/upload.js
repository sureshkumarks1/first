const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  fileFilter: function (req, file, cb) {

    let filetypes = /jpeg|jpg|png/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
   cb(new Error("File upload only supports the following filetypes - " + filetypes));
  },
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // cb(null, Date.now() + '-' + file.originalname);
    cb(null, Date.now() + '.jpg');
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;