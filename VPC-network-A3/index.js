const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'a3-product-db.cluster-cas3001xut7b.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'a3_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/store-products', (req, res) => {
  const products = req.body.products;

  if (!Array.isArray(products)) {
    res.status(400).send({ error: 'Invalid input.' });
    return;
  }

  const promises = products.map((product) => {
    return pool.promise().query('INSERT INTO products SET ?', product);
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).send({ message: 'Success.' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: 'Database error.' });
    });
});

app.get('/list-products', (req, res) => {
  pool.promise().query('SELECT * FROM products')
    .then(([rows, fields]) => {
      res.status(200).send({ products: rows });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: 'Database error.' });
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');

// const app = express();

// app.use(bodyParser.json());

// const pool = mysql.createPool({
//   host: 'a3-product-db.cluster-cas3001xut7b.us-east-1.rds.amazonaws.com',
//   user: 'admin',
//   password: 'admin123',
//   database: 'a3-product-db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// function createTableIfNotExists() {
//   const createTableSql = `
//     CREATE TABLE IF NOT EXISTS products (
//       name varchar(100),
//       price varchar(100),
//       availability boolean
//     );
//   `;

//   return pool.promise().query(createTableSql);
// }

// createTableIfNotExists()
//   .then(() => {
//     console.log('Table is ready.');

//     app.post('/store-products', (req, res) => {
//       const products = req.body.products;

//       if (!Array.isArray(products)) {
//         res.status(400).send({ error: 'Invalid input.' });
//         return;
//       }

//       const promises = products.map((product) => {
//         return pool.promise().query('INSERT INTO products SET ?', product);
//       });

//       Promise.all(promises)
//         .then(() => {
//           res.status(200).send({ message: 'Success.' });
//         })
//         .catch((err) => {
//           console.error(err);
//           res.status(500).send({ error: 'Database error.' });
//         });
//     });

//     app.get('/list-products', (req, res) => {
//       pool.promise().query('SELECT * FROM products')
//         .then(([rows, fields]) => {
//           res.status(200).send({ products: rows });
//         })
//         .catch((err) => {
//           console.error(err);
//           res.status(500).send({ error: 'Database error.' });
//         });
//     });

//     app.listen(3000, () => {
//       console.log('Server is running on port 3000.');
//     });

//   })
//   .catch((err) => {
//     console.error('Failed to prepare table:', err);
//   });
