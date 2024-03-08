const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).fields([
  { name: 'profilImg', maxCount: 1 },
  { name: 'picture1', maxCount: 1 },
  { name: 'picture2', maxCount: 1 },
  { name: 'picture3', maxCount: 1 },
  { name: 'picture4', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]);