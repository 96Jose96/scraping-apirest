const express = require('express');
const fs = require('fs');
const { scraping } = require('./scraping');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noticias = [];


function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}


function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

// Rutas CRUD

//Obtener todas las noticias
app.get('/noticias', (req, res) => {
  leerDatos();
  res.json(noticias);
});

//Obtener una noticia por índice
app.get('/noticias/:index', (req, res) => {
  const index = parseInt(req.params.index);
  leerDatos();
  if (index >= 0 && index < noticias.length) {
    res.json(noticias[index]);
  } else {
    res.status(404).send('Noticia no encontrada');
  }
});

//Crear una nueva noticia
app.post('/noticias', (req, res) => {
  const nuevaNoticia = req.body;
  leerDatos();
  noticias.push(nuevaNoticia);
  guardarDatos();
  res.status(201).json(nuevaNoticia);
});

//Actualizar una noticia por su indice
app.put('/noticias/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const noticiaActualizada = req.body;
  leerDatos();

  if (index >= 0 && index < noticias.length) {
    noticias[index] = noticiaActualizada;
    guardarDatos();
    res.json(noticiaActualizada);
  } else {
    res.status(404).send('Noticia no encontrada');
  }
});

//Eliminar una noticia por su indice
app.delete('/noticias/:index', (req, res) => {
  const index = parseInt(req.params.index);
  leerDatos();

  if (index >= 0 && index < noticias.length) {
    noticias.splice(index, 1);
    guardarDatos();
    res.status(204).send();
  } else {
    res.status(404).send('Noticia no encontrada');
  }
});

//Endpoint para el scraping
app.get('/scraping', async (req, res) => {
  await scrapingNoticias();
  res.send('Scraping completado y noticias guardadas en noticias.json');
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});