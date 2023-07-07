const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'product-db-cluster.cluster-cas3001xut7b.us-east-1.rds.amazonaws.com',
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

app.get('/hello',(req,res)=>{
  res.status(200).send('hello abhinav');
})

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

app.listen(80, () => {
  console.log('Server is running on port 80.');
});
