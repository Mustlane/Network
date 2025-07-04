import { render } from "ejs";
const fileController: { [key: string]: any } = {};

import * as prismaQueries from "../db/prismaQueries";
import * as arrQueries from "../db/arrQueries";
import * as qbittorrentQueries from "../db/qbittorrentQueries";
import * as fileQueries from "../db/fileQueries";
const db = {
  ...prismaQueries,
  ...arrQueries,
  ...qbittorrentQueries,
  ...fileQueries,
};


fileController.uploadFile = async (req, res) => {
  const file = req.file;
  const userId = req.user.id;
  const folderId = req.folder?.id || null;
  const addFile = await db.addFile(userId, file.originalname, file.path, folderId);
  res.redirect("/profile");
};

fileController.openFolder = async (req, res) => {
  const folderId = req.params.folderId;
  const openFolder = await db.openFolder(folderId);
  const files = openFolder;
  res.render("folder", {
    files: files,
    folderId: folderId
  })
};

fileController.uploadFileToFolder = async (req, res) => {
  const file = req.file;
  const userId = req.user.id;
  const folderId = req.params.folderId;
  const addFile = await db.addFile(userId, file.originalname, file.path, folderId);
  res.redirect(`/profile/folders/${folderId}`);
};

fileController.deleteFileFromFolder = async (req, res) => {
  const folderId = req.params.folderId
  const fileId = req.params.fileId;
  const success = await db.deleteFileFromFolder(folderId, fileId);
  if (success) {
    res.redirect(`/profile/folders/${folderId}`);
  } else {
    res.status(500).send("500: Internal Server error");
  }
};


fileController.createFolder = async (req, res) => {
  const folderName = req.body.folderName;
  const comment = req.body.comment;
  const ownerId = req.user.id;
  const createFolder = await db.createFolder(folderName, ownerId, comment);
  res.redirect("/profile");
};

fileController.deleteFile = async (req, res) => {
  const fileId = req.params.fileId;
  const success = await db.deleteFile(fileId);
  if (success) {
    res.redirect("/profile");
  } else {
    res.status(500).send("500: Internal Server error");
  }
};

fileController.deleteFolder = async (req, res) => {
  const folderId = req.params.folderId;
  const deleteFolder = await db.deleteFolder(folderId);
  res.redirect("/profile")
  // --------- LEMME FIGURE THINGS OUT FIRST ---------
  // console.log(`${deleteFolder.url} was deleted`);
  // if (deleteFolder) {
  //   res.redirect("/profile");
  // } else {
  //   res.status(500).send("500: Internal Server error");
  // }
  // --------- LEMME FIGURE THINGS OUT FIRST ---------
};


export { fileController };