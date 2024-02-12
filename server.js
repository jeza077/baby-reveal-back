// Importa los módulos necesarios
const express = require('express');
const cors = require('cors');
const mysql2 = require('mysql2');

// Crea una instancia de la aplicación Express
const app = express();

app.use(cors({
    // origin: 'http://localhost:5173', // Reemplaza esto con la URL de tu aplicación React
    origin: 'https://gabyandalex-babyreveal.onrender.com', // Reemplaza esto con la URL de tu aplicación React
    methods: ['GET', 'PUT'], // Ajusta los métodos que deseas permitir
    allowedHeaders: ['Content-Type'], // Permite el encabezado Content-Type
  }));

app.use(express.json());

// Configura la conexión a la base de datos MySQL
const connection = mysql2.createConnection({
  host: 'roundhouse.proxy.rlwy.net',
  user: 'root',
  password: '5d3F5d3bEFhF3aBeFgceaGcbbf3aba1G',
  database: 'railway',
  port: 12909
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Define un endpoint para obtener todas las personas
app.get('/api/people', (req, res) => {
  const query = 'SELECT * FROM people WHERE status = 0';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log(results)
    res.json(results);
  });
});

// Define una nueva ruta para actualizar el estado de una persona por su ID
app.put('/api/people/:id/status', (req, res) => {
    // Obtiene el ID de la persona y el nuevo estado del cuerpo de la solicitud
    console.log(req.body)
    // return
    const { id } = req.params;
    const { status } = req.body;
  
    // Verifica si el estado es válido
    if (typeof status !== 'number' || !(status === 1 || status === 2)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    // Define la consulta SQL para actualizar el estado de la persona
    const query = 'UPDATE people SET status = ? WHERE id = ?';
    
    // Ejecuta la consulta SQL con los parámetros proporcionados
    connection.query(query, [status, id], (error, result) => {
      if (error) {
        console.error('Error updating database:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      // Verifica si se actualizó correctamente
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Person not found' });
      }
  
      // Envía una respuesta exitosa
      res.json({ message: 'Person status updated successfully' });
    });
  });

// Define el puerto en el que escuchará el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
