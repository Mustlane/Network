import axios, {isCancel, AxiosError} from 'axios';
import 'dotenv/config';

// async function getArtists(){
// const url = 'http://localhost:8686/api/v1/artist';
// const options = {
// 	headers: {
// 		'X-Api-Key': process.env.LIDARR_API,
// 	}
// };
// const artists = await got(url, options).json<any[]>();
// return artists.length;
// }

async function getArtists(){
const apiKey = process.env.LIDARR_API
const response = await axios({
	method: 'get',
	url: `http://localhost:8686/api/v1/artist`,
	responseType: 'json',
	headers: {
		'X-Api-Key': apiKey
	}
})
	const artists = response.data
	return artists.length;
}

async function getBooks(){
const apiKey = process.env.LAZYLIBRARIAN_API
const response = await axios({
	method: 'get',
	url: `http://localhost:5299/api?apikey=${apiKey}&cmd=getAllBooks`,
	responseType: 'json'
})
	const books = response.data
	return books.length;
}

async function getAuthors(){
const apiKey = process.env.LAZYLIBRARIAN_API
const response = await axios({
	method: 'get',
	url: `http://localhost:5299/api?apikey=${apiKey}&cmd=getIndex`,
	responseType: 'json'
})
	const authors = response.data
	return authors.length;
}

export {
    getArtists,
	getBooks,
	getAuthors
}