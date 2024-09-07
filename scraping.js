const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

async function scraping() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);


    let noticias = [];

    
    $('article').each((i, element) => {
     
      const titulo = $(element).find('header a').text();
      const descripcion = $(element).find('p').text();
      const imagen = $(element).find('figure img').attr('src') || '';

     
      const noticia = {
        titulo: titulo,
        imagen: imagen,
        descripcion: descripcion,
      };

    
      noticias.push(noticia);
    });
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    console.log(noticias);
  } catch (error) {
    console.error('Error al realizar el scraping:', error.message);
  }
}


module.exports = scraping;