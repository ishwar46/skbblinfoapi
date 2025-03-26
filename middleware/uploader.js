const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createUploader(subfolderName) {
    const uploadPath = path.join(__dirname, "..", "uploads", subfolderName);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext);
            const uniqueSuffix = Date.now();
            const fileName = `${baseName}-${uniqueSuffix}${ext}`;
            req.fileRelativePath = `/uploads/${subfolderName}/${fileName}`;
            cb(null, fileName);
        },
    });


    return multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
        fileFilter: (req, file, cb) => {
            // Allow image files and PDF files
            if (
                file.mimetype.startsWith("image/") ||
                file.mimetype === "application/pdf"
            ) {
                cb(null, true);
            } else {
                cb(new Error("Only image and PDF files are allowed!"), false);
            }
        },
    });
}

module.exports = createUploader;