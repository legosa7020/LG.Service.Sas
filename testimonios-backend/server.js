const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Configurar el puerto del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
