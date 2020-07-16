# Hello Postgre

Una API usando PostgreSQL como base de datos.

## Qué vamos a hacer

Una API (application programming interface) para comunicarnos con una base de datos de PostgreSQL. Prácticamente una copia de [hello-database](https://github.com/santiagotrini/hello-database).

El ejemplo va a ser mínimo, tenemos una base de datos con usuarios y a través de la API podemos obtener esa información en formato JSON. En la app de Express vamos a usar el paquete `pg` para conectarnos y hacer _queries_ directamente en SQL a la base de datos.

Para subir la app a Heroku vamos a usar directamente la CLI, sin necesidad de pasar por GitHub.

## Antes de empezar

Para este ejemplo necesitamos lo mismo que en `express-hello-world` y dos cosas más:

- La CLI de Heroku, la pueden bajar [acá](https://devcenter.heroku.com/articles/heroku-cli).
- El server de PostgreSQL instalado en nuestra computadora (para probar localmente). Lo consiguen en el [sitio oficial](https://www.postgresql.org/download/).



```console
$ psql -d hellodb
```

## Creando el proyecto

```console
$ mkdir hello-postgre
$ cd hello-postgre
$ git init
$ echo node_modules > .gitignore
$ npm init -y
$ npm i pg cors express
$ npm i -D nodemon
$ touch index.js
$ echo web: npm start > Procfile
$ touch populatedb.sql
```

## Mandamos JavaScript

En `index.js` empezamos a armar la app de Express.

```js
// importar libs
const express = require('express');
const cors    = require('cors');

// config vars
const port = process.env.PORT         || 3000;
const db   = process.env.DATABASE_URL || 'postgresql://localhost/hellodb';

// crear el objeto app
const app = express();

// usar cors
app.use(cors());

// rutas
// GET a /api/users
app.get('/api/users', (req, res) => {
  res.send('Todos los usuarios');
});

// GET a /api/user/id
app.get('/api/user/:id', (req, res) => {
  res.send(`El usuario con id ${req.params.id}`);
});

// listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Después volveremos a este archivo para conectarnos a la base de datos y terminar de implementar las rutas.

## Creando la base de datos

En `populatedb.sql` vamos a crear la tabla y cargar unos usuarios de prueba.

```sql
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  mail VARCHAR(60),
  birthday DATE
);

INSERT INTO users(name, mail, birthday) VALUES
  ('Juan', 'juan@mail.com', '2000-05-24'),
  ('Maria', 'maria@mail.com', '2000-02-13'),
  ('Pedro', 'pedro@mail.com', '2000-05-19'),
  ('Julia', 'julia@mail.com', '1998-03-01');
```

## Las rutas de la API

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Haciendo queries

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Creando la app desde la CLI de Heroku

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## ¿Y ahora?

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Guías, referencias y documentación

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
