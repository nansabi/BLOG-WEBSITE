const multer = require("multer");

// Store file temporarily in memory (for cloud upload later)
const storage = multer.memoryStorage();

// Allow ONLY image files
const fileFilter = (req, file, cb) => {
  // file example:
  // {
  //   originalname: "photo.png",
  //   mimetype: "image/png",
  //   size: 23456
  // }

  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // ✅ ACCEPT file
  } else {
    cb(new Error("Only image files are allowed"), false); // ❌ REJECT
  }
};

// Multer config
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter,
});

module.exports = upload;
