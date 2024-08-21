const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());  // Habilitar CORS para todas las solicitudes
app.use(express.static('public'));  // Servir archivos estáticos desde la carpeta public

let personajes = []; // Array para simular la base de datos en memoria

// Ruta para filtrar personajes
app.get('/api/characters', async (req, res) => {
    const { status, species, gender } = req.query;
    try {
        const response = await axios.get('https://rickandmortyapi.com/api/character', {
            params: { status, species, gender }
        });
        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los personajes', error: error.message });
    }
});

// Ruta para crear un nuevo personaje (simulado)
app.post('/api/personajes', (req, res) => {
    const newCharacter = {
        id: personajes.length + 1,
        ...req.body
    };
    personajes.push(newCharacter);
    res.status(201).json(newCharacter);
});

// Ruta para modificar un personaje (simulado)
app.put('/api/personajes/:id', (req, res) => {
    const characterId = parseInt(req.params.id);
    let character = personajes.find(p => p.id === characterId);

    if (character) {
        character = { ...character, ...req.body };
        personajes = personajes.map(p => (p.id === characterId ? character : p));
        res.json(character);
    } else {
        res.status(404).json({ error: 'Personaje no encontrado' });
    }
});

// Ruta GET para mostrar todos los personajes (para verificar)
app.get('/api/personajes', (req, res) => {
    res.json(personajes);
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/buscarPersonaje.html`);
});
