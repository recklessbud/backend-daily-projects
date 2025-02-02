const multer = require("multer");
const path = require("path");



module.exports = multer({
    //if data are not stored on local storage  so yeah empty object
  storage: multer.diskStorage({}),

  //helper function checking the filetype and ext
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".jiff" && ext !== ".JPG" && ext !== ".JPEG" && ext !== ".PNG" && ext !== ".JIFF") {
      // @ts-ignore
      cb(new Error("File type is not supported"), false);
      return; 
    }
    cb(null, true);
  },
});