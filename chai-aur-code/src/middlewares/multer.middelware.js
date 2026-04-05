// 
import multer from "multer";
import fs from "fs";
import path from "path";

const tempDir = path.join(process.cwd(), "public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "videofile") {
    const allowed = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only MP4, MOV, AVI, MKV, WEBM videos are allowed"), false);
    }
  }
  if (file.fieldname === "thumbnail" || file.fieldname === "avatar" || file.fieldname === "coverImage") {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
    }
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 80 * 1024 * 1024, // 80MB
  },
});

// ✅ Add this after upload.fields() in every route that handles files
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File too large. Maximum upload size is 80MB.",
      });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message || "File upload failed" });
  }
  next();
};