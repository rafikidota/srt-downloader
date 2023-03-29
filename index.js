const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const url_base = 'https://example.com/subtitles';

axios.get(url_base)
    .then((response) => {
        const $ = cheerio.load(response.data);
        const links = $('a[href$=".srt"]');
        links.each((i, link) => {
            const url = $(link).attr('href');
            console.log();
            const encode_name = url.substring(url.lastIndexOf('/') + 1);
            const filename = decodeURIComponent(encode_name);
            axios({
                method: 'get',
                url: `${url_base}/${url}`,
                responseType: 'stream'
            })
                .then((response) => {
                    response.data.pipe(fs.createWriteStream(`downloads/${filename}`));
                    console.log(`File ${filename} downloaded successfully`);
                })
                .catch((err) => {
                    console.error(`Error downloading file ${filename}: ${err}`);
                });
        });
    })
    .catch((err) => {
        console.error(`Error al obtener la página web: ${err}`);
    });