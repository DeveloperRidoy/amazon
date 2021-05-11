const multer = require("multer");
const { FaLessThanEqual } = require("react-icons/fa");
const sharp = require('sharp');
const AppError = require('../controllers/appError');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) =>
//     cb(null, 'public/img/users'),
//   filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}.${file.mimetype.split('/')[1]}`),
// });
const storage = multer.memoryStorage();

// filter
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) return cb(new Error('Not an image'), false);
  cb(null, true);
};

//limits 
const limits = { fileSize: 5 * 1024 * 1024 }; //5MB

const upload = multer({ storage, fileFilter, limits }); 

// single upload
exports.uploadPhoto = (req, res, next) => upload.single("photo")(req, res, err => {
  // check if photo is uploaded
  if (!req.file) return next();

  // return error response
  if (err instanceof multer.MulterError) return next(new AppError(400, error.message));
  
  next();
}) 

// multiple photos
exports.uploadPhotos = (req, res, next) => upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  {name: 'photos', maxCount: 3}
])(req, res, err => {
  // parse data if stringified
  try {
    Object.keys(req.body).forEach(
      (key) => (req.body[key] = JSON.parse(req.body[key]))
    );
  } catch (error) {}

  // check if photos were provided
  if (!req.files || Object.keys(req.files).length === 0) return next();

  // return error response if error
  if (err instanceof multer.MulterError)
    return next(new AppError(400, err.message));
  next();
})
  
// resize photo 
exports.resizePhoto = (height = 100, width = 100) => async (req, res, next) => {
  if (!req.file) return next();

  // set photo name
  req.body.photo = `user-${req.user._id}-${Date.now()}.jpeg`;

  try {    
    await sharp(req.file.buffer)
      .resize(height, width)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`public/img/users/${req.body.photo}`);

    next();
  } catch (error) {
    return next(new AppError(400, error.message));
  }
}

// resize photos
exports.resizePhotos = (height = 300, width = 300) => async (req, res, next) => {
  
  // check if photos were provided
  if (!req.files || Object.keys(req.files).length === 0) return next();
  try {

    // process coverPhoto
    if (req.files.coverPhoto) {
      req.body.coverPhoto = `${req.body.name}-${Date.now()}-cover.jpeg`;
      // resize cover photo
      await sharp(req.files.coverPhoto[0].buffer)
        .resize(height, width)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(`public/img/products/${req.body.coverPhoto}`);
   }
    
    // process photos
    if (req.files.photos) {
      // resize photos
      req.body.photos = [];
      for (let i = 0; i <= req.files.photos.length - 1; i++) {
        let name = `${req.body.name}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(req.files.photos[i].buffer)
          .resize(height, width)
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`public/img/products/${name}`);
        req.body.photos.push(name);
      }
    }
    next();
    
  } catch (error) {
    return next(new AppError(400, error.message));  
  } 
}