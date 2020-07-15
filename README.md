# Hello Postgre

Una API usando PostgreSQL como base de datos.

## Qué vamos a hacer

Una API (application programming interface) para comunicarnos con una base de datos de PostgreSQL. Prácticamente una copia de [hello-database](https://github.com/santiagotrini/hello-database).

El ejemplo va a ser mínimo, tenemos una base de datos con usuarios y a través de la API podemos obtener esa información en formato JSON. En la app de Express vamos a usar el paquete `pg` para conectarnos y hacer _queries_ directamente en SQL a la base de datos.

Para subir la app a Heroku vamos a usar directamente la CLI, sin necesidad de pasar por GitHub.

## Antes de empezar

Para este ejemplo necesitamos lo mismo que en [express-hello-world](https://github.com/santiagotrini/express-hello-world) y dos cosas más:

- La CLI de Heroku, la pueden bajar [acá](https://devcenter.heroku.com/articles/heroku-cli).
- El server de PostgreSQL instalado en nuestra computadora (para probar localmente). Lo consiguen en el [sitio oficial](https://www.postgresql.org/download/).

Los pasos para chequear que ande todo antes de arrancar van a ser distintos en función del sistema operativo.
Asumo que tienen Windows 10. Cuando ejecuten el instalador de Postgre pueden destildar las _checkboxes_ 2 y 3 de los componentes que van a instalar, solo necesitamos el server y las herramientas de línea de comandos. Tienen que elegir un password para el usuario `postgres`, recuérdenlo.

Cuando terminan de instalar abran una terminal para logearse por primera vez a la _shell_ de Postgre. Vamos a crear un usuario para nuestra base de datos.

```console
$ psql -U postgres
postgres=# CREATE USER usuario WITH PASSWORD 'password' SUPERUSER;
postgres=# \q
$ createdb -U usuario hellodb
$ psql -U usuario -d hellodb
hellodb=# \q   
```

Reemplacen `usuario` por el nombre de usuario que quieran y `password` por alguna contraseña que recuerden. Ojo con las comillas simples en `password`, el _password_ va dentro de las comillas. Ya tenemos la base de datos pero todavía no tiene ninguna tabla con los datos de los usuarios.

## Creando el proyecto

Creamos el directorio del proyecto, inicializamos el repo y el `package.json` y todo lo de siempre.

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

En el `package.json` mandamos los _scripts_ usuales.

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
},
```

## Mandamos JavaScript

En `index.js` empezamos a armar la app de Express.

En `const db` vamos a poner el _connection string_ de Postgre. En mi caso quedó `postgresql://localhost/hellodb` pero puede ser que en Windows necesiten algunos datos más, la estructura del _string_ es `postgresql://<user>:<password>@<server>:<port>/<db>`.

En la _connection string_ local el server es `localhost` y el puerto casi seguro 5432. El nombre de la base datos (`hellodb`) va en `<db>`. Reemplacen sin los `<>` por supuesto.

En Heroku se va a conectar a lo que sea que valga `DATABASE_URL`.

Lo demás ya lo conocen, ponemos las rutas directamente en `index.js` y dejamos la implementación para después.

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

Después volveremos a este archivo para conectarnos a la base de datos y terminar de implementar las rutas. Ejecuten `npm run dev` y dejen esa terminal abierta si quieren para ir viendo los cambios a medida que avanzamos.

## Creando la tabla de usuarios

En `populatedb.sql` vamos a crear la tabla y cargar unos usuarios de prueba. Un script de SQL muy sencillo:

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

En la terminal, parados en el mismo directorio que este archivo ejecutamos lo siguiente.

```console
$ psql -U usuario -d hellodb -a -f populatedb.sql
```

Ya deberíamos tener nuestra base de datos local lista. Ahora volvemos a `index.js` para conectarnos usando `pg`.

## Conexión a PostgreSQL desde la app

En `index.js` debajo de `const app = express()` usamos el siguiente _snippet_ para conectarnos.

```js
// conexion a la base de datos
const { Client } = require('pg');
const client = new Client({
  connectionString: db
});
client
  .connect()
  .then(() => console.log(`DB connected @ ${db}`))
  .catch(err => console.error('Connection error', err.stack));
```

Deberíamos ver el mensaje `DB connected @ ...` en la consola si todo anda bien. Si no revisen el _string_ de conexión o que puedan logearse desde la _shell_ a esa base de datos.

## Haciendo queries

Solo falta terminar de implementar las rutas, es decir hacer las _queries_ y devolver el resultado como JSON. Las _queries_ las hacemos directamente en SQL, a diferencia de Mongoose el paquete `pg` no nos da un ORM (_object relational mapper_). Hablamos con la base de datos directamente en su lenguaje.

La primera ruta quedaría así.

```js
// GET a /api/users
app.get('/api/users', (req, res) => {
  client.query('SELECT * FROM users', (err, users) => {
    // pueden mirar la pinta que tiene la respuesta con
    // console.log(users);
    res.status(200).json(users.rows);
  });
});
```

El resultado de la _query_ está disponible en el segundo argumento de la _callback_ de `client.query()`. Si hubiera errores estarían en el primer argumento claro.

La segunda ruta tiene la complicación de usar un parámetro (el ID).

```js
// GET a /api/user/id
app.get('/api/user/:id', (req, res) => {
  const queryString = 'SELECT * FROM users WHERE id = $1';
  client.query(queryString, [req.params.id], (err, user) => {
    res.status(200).json(user.rows);
  });
});
```

El `$1` en `... WHERE id = $1` se reemplaza por el primer objeto del array que contiene a `req.params.id`, osea el segundo argumento de `client.query()`. Si hubiera más parámetros serían `$2`, `$3`, etc. En ese mismo orden tendrían que aparecer los valores a reemplazar en el array.

Y con eso terminamos la versión local de la API. Ahora hay que subir esto a Heroku.


## Creando la app desde la CLI de Heroku

Lo primero es chequear que tengamos la CLI de Heroku instalada correctamente. Todos los comandos que siguen los hacemos desde la carpeta del proyecto.

```console
$ heroku -v
heroku/7.41.1 ...
```

Primero nos logeamos a Heroku desde la CLI.

```console
$ heroku login
heroku: Press any key to open up the browser to login or q to exit:
Opening browser to https://cli-auth.heroku.com/...
Logging in... done
Logged in as ...
```

Tocamos alguna tecla para abrir el navegador web y nos logeamos. Creamos la app con `heroku create nombre-de-la-app`. Después de crear la app chequeamos que se haya creado un _remote_ de Git llamado `heroku`.

```console
$ heroku create hello-postgre
$ git remote -v
heroku	https://git.heroku.com/hello-postgre.git (fetch)
heroku	https://git.heroku.com/hello-postgre.git (push)
```

Ahora pusheamos nuestro código a ese remoto, si todavía no commitearon los cambios es un buen momento.

```console
$ git push heroku master
```

Pero por ahora va a dar error cuando quiera conectarse a la base de datos, porque no hay ninguna. La podemos crear desde la CLI. Para el segundo comando tenemos que tener instalado Postgre localmente en nuestra computadora.

```console
$ heroku addons:create heroku-postgresql:hobby-dev
$ heroku pg:psql < populatedb.sql
$ heroku ps:restart web
```

El primer comando agrega una base de datos de PostgreSQL directamente hosteada en Heroku con el plan `hobby-dev`, osea gratis.
El segundo comando ejecuta el _script_ `populatedb.sql` en esta base de datos.
El tercer comando solo restartea la app en Heroku por si había crasheado y se había quedado colgada.

Y listo, API terminada, pueden verla funcionando en [http://hello-postgre.herokuapp.com/api/users](http://hello-postgre.herokuapp.com/api/users) o en la terminal con `heroku open` cuando terminen la suya.

## ¿Y ahora?

Ahora podemos dejar de lado las bases de datos y explorar las posibilidades de los WebSockets haciendo una simple app de chat en [hello-websockets](https://github.com/santiagotrini/hello-websockets).

También podemos continuar con el stack MERN en [hello-crud](https://github.com/santiagotrini/hello-crud).

## Guías, referencias y documentación

Las fuentes de esta guía (en inglés) y otros links útiles.

- La [documentación oficial](https://www.postgresql.org/docs/current/app-psql.html) de `psql`, la _shell_ de PostgreSQL.
- La [guía oficial](https://node-postgres.com/features/queries) del paquete `pg`.
- La [guía introductoria de Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database) para aplicaciones de NodeJS donde se muestra como utilizar el _plugin_ provisto por Heroku de PostgreSQL.
- Curso básico de SQL en [Khan Academy](https://es.khanacademy.org/computing/computer-programming/sql).
