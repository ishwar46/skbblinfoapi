const multer = require("multer")
const path = require("path")
const crypto = require("crypto")


//Defining Storage to upload images 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;

        switch (file.fieldname) {
            case "portfolioimage":
                uploadPath = "public/uploads/portfolioimage";
                break;
            case "trustedimage":
                uploadPath = "public/uploads/trustedimage";
                break;
            case "staffimage":
                uploadPath = "public/uploads/staffimage";
                break;
            case "technologyimage":
                uploadPath = "public/uploads/technologyimage";
                break;
            case "lottieFile":
                uploadPath = "public/uploads/lottieFile";
                break;
            default:
                uploadPath = "public/uploads/others"
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const randomString = crypto.randomBytes(8).toString("hex");
        const prefix = file.fieldname;
        cb(null, `${prefix}-${Date.now()}-${randomString}${ext}`)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/json"
    ];
    if (!allowedFileTypes) {
        return cb(new Error("File Format Not Supported"), false)
    }
    cb(null, true)
}

const storageConfig = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fieldSize: 10 * 1024 * 1024 }
})

const upload = storageConfig.fields([
    { name: "portfolioimage", maxCount: 1 },
    { name: "trustedimage", maxCount: 1 },
    { name: "staffimage", maxCount: 1 },
    { name: "technologyimage", maxCount: 1 },
    { name: "lottieFile", maxCount: 1 },
])

module.exports = upload;