// importar libs
const express = require('express');
const cors = require('cors');

// config vars
const port = process.env.PORT || 3000;
const db = process.env.DATABASE_URL || 'postgresql://localhost/hellodb';

// crear el objeto app
const app = express();

// conexion a la base de datos
const { Client } = require('pg');
const client = new Client({
  connectionString: db
});
client
  .connect()
  .then(() => console.log(`DB connected @ ${db}`))
  .catch(err => console.error('Connection error', err.stack));

// usar cors
app.use(cors());

// rutas
// GET a /api/users
app.get('/api/users', (req, res) => {
  client.query('SELECT * FROM users', (err, users) => {
    res.status(200).json(users.rows);
  });
});

// GET a /api/user/id
app.get('/api/user/:id', (req, res) => {
  const queryString = 'SELECT * FROM users WHERE id = $1';
  client.query(queryString, [req.params.id], (err, user) => {
    res.status(200).json(user.rows);
  });
});

// listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
