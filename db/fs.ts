import du from 'du';

async function getSize(){
let size = await du('/home/MustlaneUSER/data')
return BigInt(size);
}
export {
    getSize
}