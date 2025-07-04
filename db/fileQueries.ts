import { PrismaClient } from '../generated/prisma'
import fs from "fs-extra";


const prisma = new PrismaClient()

async function folderGetAll(id){
  const folderGetAll = await prisma.folder.findMany({
    where: {
      ownerId: id
    }
  })
  return folderGetAll
};

async function filesGetWithoutFolder(id){
  const filesGetWithoutFolder = await prisma.file.findMany({
    where: {
      ownerId: id,
      folderId: null
    }
  })
  return filesGetWithoutFolder
};

async function createFolder(folderName: string, ownerId: string, comment: string) {
    const createFolder = await prisma.folder.create({
        data: {
            name: folderName,
            ownerId: ownerId,
            comment: comment
        }
    })
    return createFolder;
};

async function openFolder(folderId: string) {
  const openFolder = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  });
  return openFolder;
}

async function folderChangePublic(folderId: string, isPublic: boolean) {
    if (isPublic) {
      const folderPublicize = await prisma.folder.update({
        where: {
          id: folderId
        },
        data: {
          public: true
        }
      })
      return folderPublicize
    } else {
      const folderUnpublicize = await prisma.folder.update({
        where: {
          id: folderId
        },
        data: {
          public: false
        }
      })
      return folderUnpublicize
    }
};

async function addFile(ownerId: string, fileName: string, path: string, folderId?: string) {
    const newFile = await prisma.file.create({
      data: {
        name: fileName,
        url: path,
        ownerId: ownerId,
        folderId: folderId
    }})

    if(folderId) {
        const addFileToFolder = await prisma.file.update({
            where: {
                id: newFile.id
            },
            data: {
                folderId: folderId
            }
        })
        return addFileToFolder
    }
    return newFile
};

async function deleteFile(fileId: string) {
  var success: boolean
  const deleteFile = await prisma.file.delete({
    where: {
      id: fileId
}});
    fs.unlink(`${deleteFile.url}`, (err) => {
    if (err) {
      throw err 
    }
  }); 
        return true
};

async function deleteFolder(folderId: string) {
  const deleteFolder = await prisma.folder.delete({
    where: {
      id: folderId
}});
};

async function deleteFileFromFolder(folderId: string, fileId: string) {
  const deleteFileFromFolder = await prisma.file.delete({
    where: {
      id: fileId,
      folderId: folderId,
    },
  });
  fs.unlink(`${deleteFileFromFolder.url}`, (err) => {
    if (err) {
      throw err;
    }
  });
     return true

}

export {
    folderGetAll,
    filesGetWithoutFolder,
    createFolder,
    openFolder,
    folderChangePublic,
    addFile,
    deleteFile,
    deleteFolder,
    deleteFileFromFolder
}