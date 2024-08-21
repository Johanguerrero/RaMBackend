
---

# Proyecto Rick and Morty API

## Descripción del Proyecto

Este proyecto es una aplicación web que permite a los usuarios buscar, crear y modificar personajes del universo de *Rick and Morty*. La aplicación utiliza una API externa que solo permite operaciones de lectura, por lo que las operaciones de creación y actualización se simulan con almacenamiento en memoria en un entorno de ejemplo. Sin embargo, en un entorno de producción, estas operaciones se conectarían a una base de datos MongoDB.

## Funcionalidades

1. **Filtrar Personajes:**
   - Permite buscar personajes según el estado (`status`), especie (`species`) y género (`gender`).
   - Realiza una llamada real GET a la API externa para obtener los personajes que coinciden con los filtros especificados.

2. **Crear Nuevo Personaje:**
   - Permite crear un nuevo personaje mediante un formulario.
   - La creación se simula con `localStorage` en un entorno de ejemplo.

3. **Modificar Personaje Existente:**
   - Permite modificar los datos de un personaje existente mediante un formulario.
   - La modificación se simula con `localStorage` en un entorno de ejemplo.

## Tecnologías Utilizadas

- **Frontend:**
  - HTML
  - CSS (Bootstrap 5 para estilos)
  - JavaScript (para la lógica de la aplicación)

- **Backend:**
  - **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
  - **Express.js**: Framework de Node.js para gestionar rutas y manejar solicitudes HTTP.
  - **axios**: Biblioteca para realizar solicitudes HTTP desde el backend.
  - **MongoDB**: Base de datos NoSQL para almacenar personajes.
  - **Mongoose**: Biblioteca para modelar datos de MongoDB con Node.js.
  - **localStorage**: Simula la persistencia de datos en el navegador para las operaciones de creación y actualización en el entorno de ejemplo.

## Estructura del Proyecto

- `index.html`: Página principal del proyecto.
- `buscarPersonaje.html`: Página para buscar, crear y modificar personajes.
- `css/styles.css`: Estilos personalizados para la aplicación.
- `js/main.js`: Lógica de la aplicación, incluyendo simulación de almacenamiento local y llamadas a la API.
- `server.js`: Archivo del servidor en Node.js que maneja las solicitudes HTTP para la creación y modificación de personajes con MongoDB.

## Detalles de Implementación

### Método GET

El método GET se utiliza para realizar una búsqueda de personajes en la API externa de *Rick and Morty*. Cuando el usuario envía el formulario de búsqueda, se realiza una solicitud GET para obtener los personajes que coinciden con los filtros especificados. La respuesta se procesa y se muestra en la interfaz de usuario.

```javascript
const response = await fetch(`${backendUrl}/characters?status=${status}&species=${species}&gender=${gender}`);
const characters = await response.json();
```

### Métodos POST y PUT

**Nota:** En un entorno de producción, las operaciones POST y PUT se conectarían a una base de datos MongoDB. A continuación, se muestra cómo se implementarían estas operaciones en el backend utilizando MongoDB y Mongoose.

**Código del Backend (`server.js`):**

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuración de la aplicación
const app = express();
const PORT = 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/rickandmorty', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Esquema y modelo de Mongoose
const characterSchema = new mongoose.Schema({
    name: String,
    status: String,
    species: String,
    gender: String
});
const Character = mongoose.model('Character', characterSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Habilitar CORS para todas las solicitudes
app.use(express.static('public'));  // Servir archivos estáticos desde la carpeta public

// Ruta para filtrar personajes
app.get('/characters', async (req, res) => {
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

// Ruta para crear un nuevo personaje (con MongoDB)
app.post('/characters', async (req, res) => {
    const newCharacter = new Character(req.body);
    try {
        await newCharacter.save();
        res.status(201).json({ message: 'Personaje creado exitosamente', character: newCharacter });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el personaje', error: error.message });
    }
});

// Ruta para modificar un personaje existente (con MongoDB)
app.put('/characters/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCharacter = await Character.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedCharacter) {
            res.json({ message: 'Personaje actualizado exitosamente', character: updatedCharacter });
        } else {
            res.status(404).json({ error: 'Personaje no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el personaje', error: error.message });
    }
});

// Ruta para mostrar todos los personajes (con MongoDB)
app.get('/api/personajes', async (req, res) => {
    try {
        const personajes = await Character.find();
        res.json(personajes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los personajes', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/buscarPersonaje.html`);
});
```

**Código de Frontend (`main.js`):**

Para el frontend, no hay cambios en cómo se envían las solicitudes POST y PUT. Aquí está el código que maneja esas solicitudes:

```javascript
// Crear un nuevo personaje (POST)
document.getElementById('create-character-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const newCharacter = {
        name: document.getElementById('name').value,
        status: document.getElementById('status').value,
        species: document.getElementById('species').value,
        gender: document.getElementById('gender').value
    };

    fetch('http://localhost:3000/characters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCharacter)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('create-response').textContent = 'Personaje creado: ' + JSON.stringify(data);
    })
    .catch(error => console.error('Error:', error));
});

// Modificar un personaje existente (PUT)
document.getElementById('update-character-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const characterId = document.getElementById('character-id').value;
    const updatedCharacter = {
        name: document.getElementById('update-name').value,
        status: document.getElementById('update-status').value,
        species: document.getElementById('update-species').value,
        gender: document.getElementById('update-gender').value
    };

    fetch(`http://localhost:3000/characters/${characterId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCharacter)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('update-response').textContent = 'Personaje modificado: ' + JSON.stringify(data);
    })
    .catch(error => console.error('Error:', error));
});
```

## Cómo Ejecutar el Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/rick-and-morty-api.git
   ```

2. **Navegar al directorio del proyecto:**
   ```bash
   cd rick-and-morty-api
   ```

3. **Instalar las dependencias del backend:**
   ```bash
   npm install
   ```

4. **Abrir `index.html` o `buscarPersonaje.html` en un navegador web para ver la aplicación en acción.**

5. **Para ejecutar el servidor backend:**
   - Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
   - Ejecuta el servidor con:
     ```bash
     node server.js
     ```

6. **Asegúrate de tener MongoDB instalado y en funcionamiento. La conexión en `server.js` está configurada para una base de datos local.**

