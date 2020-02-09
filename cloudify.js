const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: 'hooptime',
  api_key: '963389889361786',
  api_secret: 'sAX5Q0o5g-Ef-ahJjlBJrN4ERbk'
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "profile images",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

exports.parser = multer({ storage: storage });

exports.cloudinary = cloudinary
