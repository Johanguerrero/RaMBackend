const backendUrl = 'http://localhost:3000';  // URL del backend

// Cargar personajes desde el localStorage
function loadCharacters() {
    const storedCharacters = localStorage.getItem('characters');
    return storedCharacters ? JSON.parse(storedCharacters) : [];
}

// Guardar personajes en el localStorage
function saveCharacters(characters) {
    localStorage.setItem('characters', JSON.stringify(characters));
}

// Filtrar personajes
document.getElementById('filter-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const status = document.getElementById('status').value;
    const species = document.getElementById('species').value;
    const gender = document.getElementById('gender').value;

    try {
        const response = await fetch(`${backendUrl}/api/characters?status=${status}&species=${species}&gender=${gender}`);
        if (!response.ok) {
            throw new Error('Error al obtener los personajes');
        }
        const characters = await response.json();

        const characterContainer = document.getElementById('character-container');
        characterContainer.innerHTML = ''; // Limpiar resultados previos

        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'col-md-4 mb-3';
            characterCard.innerHTML = `
                <div class="card">
                    <img src="${character.image}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                        <p class="card-text">Species: ${character.species}</p>
                        <p class="card-text">Gender: ${character.gender}</p>
                        <p class="card-text">Status: ${character.status}</p>
                    </div>
                </div>
            `;
            characterContainer.appendChild(characterCard);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

// Crear un nuevo personaje (POST)
document.getElementById('create-character-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const newCharacter = {
        id: Date.now(),  // Usar un timestamp como ID único
        name: document.getElementById('name').value,
        status: document.getElementById('status').value,
        species: document.getElementById('species').value,
        gender: document.getElementById('gender').value
    };

    const characters = loadCharacters();
    characters.push(newCharacter);
    saveCharacters(characters);

    document.getElementById('create-response').textContent = 'Personaje creado: ' + JSON.stringify(newCharacter);
});

// Modificar un personaje existente (PUT)
document.getElementById('update-character-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const characterId = parseInt(document.getElementById('character-id').value);
    const updatedCharacter = {
        name: document.getElementById('update-name').value,
        status: document.getElementById('update-status').value,
        species: document.getElementById('update-species').value,
        gender: document.getElementById('update-gender').value
    };

    const characters = loadCharacters();
    const characterIndex = characters.findIndex(p => p.id === characterId);

    if (characterIndex !== -1) {
        characters[characterIndex] = { id: characterId, ...updatedCharacter };
        saveCharacters(characters);
        document.getElementById('update-response').textContent = 'Personaje modificado: ' + JSON.stringify(characters[characterIndex]);
    } else {
        document.getElementById('update-response').textContent = 'Personaje no encontrado';
    }
});

// Inicializar los personajes en el localStorage (opcional, solo para pruebas)
if (!localStorage.getItem('characters')) {
    saveCharacters([
        { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', gender: 'Male' },
        { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', gender: 'Male' }
    ]);
}
