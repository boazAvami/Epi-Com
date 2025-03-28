import path from "path";
import fs from 'fs';
import multer from "multer";

export const deleteFile = async (filename) => {
    const filePath = path.join(__dirname, '../../public', filename);
    console.log("Deleting file at:", filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully.");
    } else {
      console.log("File not found.");
    }
  };

  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, 'public/')
      },
      filename: function (req, file, cb) {
          const ext = file.originalname.split('.')
              .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
              .slice(1)
              .join('.')
          cb(null, Date.now() + "." + ext)
      }
  })
  
  export const upload = multer({ storage: storage });