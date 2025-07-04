import "dotenv/config";
import qs from "qs";
import qbit from "qbittorrent-api-v2";
import axios, { isCancel, AxiosError } from "axios";
let qbtClient: any;
let qbittorrentPassword: string = process.env.QBITTORRENT_PASSWORD!;
let qbitTorrentCookie: string | undefined = "";
type Torrent = { uploaded: number; size: number; ratio: number };
var torrents: Torrent[] = []

const qbitReady = qbit
  .connect("http://localhost:8080", "MustlaneSERVER", qbittorrentPassword)
  .then((qbt) => {
    qbtClient = qbt;
  });

async function login() {
  let data = {
    username: "MustlaneSERVER",
    password: qbittorrentPassword,
  };
  await axios({
    method: "post",
    url: "http://localhost:8080/api/v2/auth/login",
    headers: {
      Referer: "http://localhost:8080/",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(data),
  }).then((response) => {
    qbitTorrentCookie = response.headers["set-cookie"]?.[0];
  });
}

async function getMovies() {
  if (!qbitTorrentCookie) {
    await login();
  }
  const response = await axios({
    method: "get",
    url: `http://localhost:8080/api/v2/torrents/info?category=movies`,
    headers: {
      Cookie: qbitTorrentCookie,
    },

    responseType: "json",
  });
  const movies = response.data;
  return movies.length;
}

async function getSeries() {
  if (!qbitTorrentCookie) {
    await login();
  }
  const response = await axios({
    method: "get",
    url: `http://localhost:8080/api/v2/torrents/info?category=series`,
    headers: {
      Cookie: qbitTorrentCookie,
    },

    responseType: "json",
  });
  const series = response.data;
  return series.length;
}

async function getAlbums() {
  if (!qbitTorrentCookie) {
    await login();
  }
  const response = await axios({
    method: "get",
    url: `http://localhost:8080/api/v2/torrents/info?category=music`,
    headers: {
      Cookie: qbitTorrentCookie,
    },
    responseType: "json",
  });
  const music = response.data;
  return music.length;
}

async function getTorrents() {
  await qbitReady;
  torrents = await qbtClient.torrents();
  return Number(torrents.length);
}

async function getUploaded() {
    let uploadedTotal: number = 0;
    torrents.forEach(torrent => {
        uploadedTotal += torrent.uploaded
    })
    return uploadedTotal
}

async function getDownloaded() {
    let downloadedTotal: number = 0;
    torrents.forEach(torrent => {
        downloadedTotal += torrent.size
    })
    return downloadedTotal
}

async function getRatio() {
  let ratiosum: number = 0;
  torrents.forEach(torrent => {
    const ratio = torrent.ratio;
    ratiosum += ratio
  });
  const ratio: number = ratiosum / torrents.length
  return Number(ratio.toFixed(3))
}

async function getSnatched() {
  let snatched: number = 0;
  torrents.forEach(torrent => {
    if (torrent.ratio < 1) {
      snatched++;
    }
  });
  return snatched;
}

async function getStalled(filter = "stalled") {
  await qbitReady;
  const torrents = await qbtClient.torrents(filter);
  return torrents.length;
}

async function getSeeding(filter = "seeding") {
  await qbitReady;
  const torrents = await qbtClient.torrents(filter);
  return torrents.length;
}

export {
  getMovies,
  getSeries,
  getAlbums,
  getTorrents,
  getUploaded,
  getDownloaded,
  getRatio,
  getSnatched,
  getStalled,
  getSeeding,
};
