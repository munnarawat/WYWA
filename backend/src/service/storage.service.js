const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

function uploadFile(file, folderName = "MYWA") {
  return new Promise((res, rej) => {
    try {
      if (!file) {
        return rej(new Error("No file Provided for upload"));
      }
      const ext = path.extname(file.originalname);
      const cleanFileName = `${uuidv4()}${ext}`;

      //   buffer convert to base64;
      const fileBase64 = file.buffer.toString("base64");
      imagekit.upload(
        {
          file: fileBase64,
          fileName: cleanFileName,
          folder: folderName,
        },
        (error, result) => {
          if (error) {
            rej(error);
          } else {
            res(result);
          }
        },
      );
    } catch (error) {
      rej(error);
    }
  });
}

function deleteFile(fileId) {
  return new Promise((resolve, reject) => {
    if (!fileId) return resolve();
    imagekit.deleteFile(fileId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

module.exports = { uploadFile, deleteFile };
