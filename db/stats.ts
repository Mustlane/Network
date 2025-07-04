import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import * as prismaQueries from "../db/prismaQueries";
import * as arrQueries from "../db/arrQueries";
import * as qbittorrentQueries from "../db/qbittorrentQueries";
import * as fsQueries from "../db/fs";
import * as statsQueries from "../db/stats";
import * as fileQueries from "../db/fileQueries";
const db = {
  ...prismaQueries,
  ...arrQueries,
  ...qbittorrentQueries,
  ...fsQueries,
  ...statsQueries,
  ...fileQueries,
};

const prisma = new PrismaClient();

async function updateStats(
  enabledUsers = db.getEnabledUsers,
  thisDayUsers = db.getThisDayUsers,
  thisWeekUsers = db.getThisWeekUsers,
  thisMonthUsers = db.getThisMonthUsers,
  requests = db.getRequests,
  requestsDone = db.getDoneRequests,
  movies = db.getMovies,
  series = db.getSeries,
  artists = db.getArtists,
  albums = db.getAlbums,
  authors = db.getAuthors,
  books = db.getBooks,
  qbitTorrents = db.getTorrents,
  qbitDownloaded = db.getDownloaded,
  qbitUploaded = db.getUploaded,
  qbitSnatched = db.getSnatched,
  qbitStalled = db.getStalled,
  qbitSeeding = db.getSeeding,
  qbitRatio = db.getRatio,
  spaceTaken = db.getSize,
) {

  await prisma.stats.update({
    where: {
      id: 1,
    },
    data: {
      enabledUsers: await enabledUsers(),
      thisDayUsers: await thisDayUsers(),
      thisWeekUsers: await thisWeekUsers(),
      thisMonthUsers: await thisMonthUsers(),
      requests: await requests(),
      requestsDone: await requestsDone(),
      movies: await movies(),
      series: await series(),
      artists: await artists(),
      albums: await albums(),
      authors: await authors(),
      books: await books(),
      qbitTorrents: await qbitTorrents(),
      qbitUploadedSize: await qbitUploaded(),
      qbitDownloadedSize: await qbitDownloaded(),
      qbitSnatched: await qbitSnatched(),
      qbitStalled: await qbitStalled(),
      qbitSeeding: await qbitSeeding(),
      qbitRatio: await qbitRatio(),
      qbitRatioAbsolute: await qbitRatio(),
      spaceTaken: await spaceTaken(),
    },
  });
}

async function getStats() {
  const stats = await prisma.stats.findFirst({
    where:{
      id: 1
    }
  })
  return stats
}

// updateStats()

export {
  updateStats,
  getStats
}