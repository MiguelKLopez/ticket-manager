const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001;

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware para analizar JSON
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'itsncg'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Fallo de conexión con la base de datos:', err.message);
    return;
  }
  console.log('Conexión con la base de datos exitosa');
});

// Login
app.post('/login', (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({ error: 'Información faltante' });
  }

  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contraseñan = ?';
  db.query(query, [usuario, contraseña], (err, results) => {
    if (err) {
      console.error('Consulta fallida:', err.message);
      res.status(500).json({ error: 'Conexión fallida' });
      return;
    }
    if (results.length === 1) {
      res.status(200).json({ message: 'Login correcto' });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  });
});

// CRUD de usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al obtener usuarios' });
      return;
    }
    res.send(result);
  });
});

app.post('/usuarios', (req, res) => {
  const { usuario, contraseña, nombre_completo, rol, area_procedencia } = req.body;
  const query = 'INSERT INTO usuarios (usuario, contraseña, nombre_completo, rol, area_procedencia) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [usuario, contraseña, nombre_completo, rol, area_procedencia], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al agregar usuario' });
      return;
    }
    res.send('Usuario agregado');
  });
});

app.put('/usuarios/:id', (req, res) => {
  const { usuario, contraseña, nombre_completo, rol, area_procedencia } = req.body;
  const id = req.params.id;
  const query = 'UPDATE usuarios SET usuario=?, contraseña=?, nombre_completo=?, rol=?, area_procedencia=? WHERE id=?';
  db.query(query, [usuario, contraseña, nombre_completo, rol, area_procedencia, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al actualizar usuario' });
      return;
    }
    if (result.affectedRows > 0) {
      res.send('Usuario actualizado');
    } else {
      res.status(404).send({ error: 'Usuario no encontrado' });
    }
  });
});

app.delete('/usuarios/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM usuarios WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error(err); 
      res.status(500).send({ error: 'Error al eliminar usuario' });
      return;
    }
    if (result.affectedRows > 0) {
      res.send('Usuario eliminado correctamente');
    } else {
      res.status(404).send({ error: 'Usuario no encontrado' });
    }
  });
});

// CRUD de tickets
app.get('/tickets', (req, res) => {
  db.query('SELECT * FROM tickets', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al obtener tickets' });
      return;
    }
    res.send(result);
  });
});

app.post('/tickets', (req, res) => {
  const { asunto, fecha, descripcion, correo, area_procedencia, categoria } = req.body;
  const query = 'INSERT INTO tickets (asunto, fecha, descripcion, correo, area_procedencia, categoria) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [asunto, fecha, descripcion, correo, area_procedencia, categoria], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al agregar ticket' });
      return;
    }
    res.send('Ticket agregado');
  });
});

app.put('/tickets/:id', (req, res) => {
  const { asunto, fecha, descripcion, correo, area_procedencia, categoria } = req.body;
  const id = req.params.id;
  const query = 'UPDATE tickets SET asunto=?, fecha=?, descripcion=?, correo=?, area_procedencia=?, categoria=? WHERE id=?';
  db.query(query, [asunto, fecha, descripcion, correo, area_procedencia, categoria, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Error al actualizar ticket' });
      return;
    }
    if (result.affectedRows > 0) {
      res.send('Ticket actualizado');
    } else {
      res.status(404).send({ error: 'Ticket no encontrado' });
    }
  });
});

app.delete('/tickets/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tickets WHERE id = ?', id, (err, result) => {
    if (err) {
      console.error(err); 
      res.status(500).send({ error: 'Error al eliminar ticket' });
      return;
    }
    if (result.affectedRows > 0) {
      res.send('Ticket eliminado correctamente');
    } else {
      res.status(404).send({ error: 'Ticket no encontrado' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});