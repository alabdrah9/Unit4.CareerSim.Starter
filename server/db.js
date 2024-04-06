const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS carts CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(50),
      password VARCHAR(60) NOT NULL,
      payment_info VARCHAR(16),
      is_admin BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(20) UNIQUE NOT NULL,
      inventory NUMERIC,
      image_url VARCHAR(255),
      price NUMERIC(9,2),
      currency TEXT
    );

    CREATE TABLE orders(
     id UUID PRIMARY KEY,
     user_id UUID REFERENCES users(id) NOT NULL,
     product_id UUID REFERENCES products(id) NOT NULL,
     qty INTEGER DEFAULT 1
     );
  
    CREATE TABLE carts(
      id UUID PRIMARY KEY,
      product_id UUID REFERENCES products(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      amount NUMERIC DEFAULT 0,
      qty INTEGER DEFAULT 1,
      CONSTRAINT unique_user_id_product_id UNIQUE (product_id,user_id)
    );
  `;
  await client.query(SQL);
};

const createUser = async ({ username, email, password }) => {
  const SQL = `
    INSERT INTO users(id, username, email, password ) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, email, await bcrypt.hash(password, 5)]);
  return response.rows[0]
};

const createOrder = async ({ user_id, product_id, qty }) => {
  const SQL = `
    INSERT INTO orders(id, user_id, product_id, qty) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const result = await client.query(SQL, [uuid.v4(),user_id, product_id, qty] );
  console.log(result)
  return result.rows[0];
};


// there is how can defined  the carts.
const createCart = async ({ product_id, user_id, qty, }) => {
  const SQL = `
    INSERT INTO carts(id, product_id, user_id, qty) VALUES($1, $2, $3, $4 ) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), product_id, user_id, qty]);
  return response.rows[0];
};

const createProduct = async ({ name, inventory, price, currency, image_url }) => {
  const SQL = `
    INSERT INTO products(id, name, inventory, price, currency, image_url) VALUES($1, $2, $3, $4, $5, $6 ) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, inventory, price, currency, image_url]);
  return response.rows[0];
};
const selectOrder = async ({ username, selectOrder }) => {
  const SQL = `
    INSERT INTO select_orders(id, select_order username,) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, selectOrder]);
  return response.rows[0];
};

const readUser = async ({ user_id, }) => {
  const SQL = `
    INSERT INTO users(user_id, username,) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), users_id,]);
  return response.rows[0];
};

//readCartedProduct
const readProduct = async ({ product_id, }) => {
  const SQL = `
    INSERT INTO products(product_id, cart_id,) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), users_id, product_id]);
  return response.rows[0];
};

const selectProduct = async ({ cart_id, product_id, }) => {
  const SQL = `
    INSERT INTO product(carted_id, product_id, ) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), cart_id, product_id,]);
  return response.rows[0];
};
const updateCartedProduct = async ({ cart_id, product_id, }) => {
  const SQL = `
    INSERT INTO carted(carted_id, product_id, ) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), cart_id, product_id,]);
  return response.rows[0];
};
const updateUser = async ({ user_id, username, }) => {
  const SQL = `
    INSERT INTO users(user_id, username, ) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, username,]);
  return response.rows[0];
};
const updateProduct = async ({ product_id, }) => {
  const SQL = `
    INSERT INTO product(product_id, ) VALUES($1 RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), product_id,]);
  return response.rows[0];
};


const deleteUser = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM users WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const deleteProduct = async ({ product_id, id }) => {
  const SQL = `
    DELETE FROM products WHERE product_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const deleteCartedProduct = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM carts WHERE cart_id=$1 AND id=$2
    DELETE FROM products WHERE product_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password, username 
    FROM users 
    WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if ((!response.rows.length || await bcrypt.compare(password, response.rows[0].password)) === false) {
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return { token: token };
};

const findUserWithToken = async (token) => {
  let id;
  console.log("insidefinduserwithtoken")
  console.log("passed token " + token)
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error('not authorized');
    error.status = 401;
    throw error;

  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const findCartWithToken = async (token) => {
  let id;
  console.log("insidefindcartwithtoken")
  console.log("passed token " + token)
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error('not authorized');
    error.status = 401;
    throw error;

  }
  const SQL = `
    SELECT id, cart FROM cart WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchOrderById = async (user_id) => {
  const SQL = `
    SELECT * FROM orders where order_id = $1
  `;
  const response = await client.query(SQL, [order_id]);
  return response.rows;
};

const fetchProductById = async (id) => {
  const SQL = `
    SELECT * FROM products where id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = {
  client,
  createTables,
  createUser,
  createCart,
  createProduct,
  createOrder,
  selectOrder,
  readUser,
  readProduct,
  updateUser,
  updateCartedProduct,
  updateProduct,
  fetchUsers,
  fetchProducts,
  fetchOrderById,
  fetchProductById,
  deleteUser,
  deleteProduct,
  deleteCartedProduct,
  authenticate,
  findUserWithToken,
  findCartWithToken
};