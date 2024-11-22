import multer from "multer";

// Set up storage configuration for Multer
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        // Set file name to original file name
        callback(null, file.originalname);
    }
});

// Create upload middleware
const upload = multer({ storage: storage });

export default upload;

