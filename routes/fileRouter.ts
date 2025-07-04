import { Router } from "express";
import { fileController } from "../controllers/fileController";
const fileRouter = Router();
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage })

// fileRouter.post("/create/folder", fileController.folderCreate);
// fileRouter.post("/create/folder", fileController.fileCreate);

fileRouter.post('/uploads', upload.single('file'), fileController.uploadFile);

fileRouter.get('/profile/folders/:folderId', fileController.openFolder);

fileRouter.post('/profile/folders/:folderId/uploads', upload.single('file'), fileController.uploadFileToFolder);

fileRouter.post('/profile/folders/:folderId/:fileId/delete', fileController.deleteFileFromFolder);


fileRouter.post("/profile/folders/create", fileController.createFolder);

fileRouter.post("/profile/files/:fileId/delete", fileController.deleteFile);
fileRouter.post("/profile/folders/:folderId/delete", fileController.deleteFolder);

export { fileRouter };

