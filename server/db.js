const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS cart_products CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      payment_info VARCHAR(16),
      is_admin BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(20) UNIQUE NOT NULL,
      inventory NUMERIC,
      price NUMERIC(9,2),
      currency TEXT
    );

    CREATE TABLE cart_products(
      id UUID PRIMARY KEY,
      product_id UUID REFERENCES products(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      amount NUMERIC DEFAULT 0,
      CONSTRAINT unique_user_id_product_id UNIQUE (product_id,user_id)
    );
  `;
  await client.query(SQL);
};

const createUser = async({ username, password})=> {
  const SQL = `
    INSERT INTO users(id, username, password ) VALUES($1, $2, $3 ) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};

const createCart = async({ name })=> {
  const SQL = `
    INSERT INTO carts(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createProduct = async({ name, inventory, price, currency })=> {
  const SQL = `
    INSERT INTO products(id, name, inventory, price, currency) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, inventory, price, currency]);
  return response.rows[0];
};
const selectOrder = async({  order_id, })=> {
  const SQL = `
    INSERT INTO select_orders(id, select_order username,) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), selectOrder]);
  return response.rows[0];
};
const readUser = async({  user_id, })=> {
  const SQL = `
    INSERT INTO users(user_id, username,) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), users_id,]);
  return response.rows[0];
};
const readProduct = async({  product_id, })=> {
  const SQL = `
    INSERT INTO products(product_id, cart_id,) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), users_id,]);
  return response.rows[0];
};
//readCartedProduct
const selectProduct  = async({ cart_id, product_id, })=> {
  const SQL = `
    INSERT INTO product(carted_id, product_id, ) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), cart_id, product_id,]);
  return response.rows[0];
};
const updateCartedProduct = async({ cart_id, product_id, })=> {
  const SQL = `
    INSERT INTO carted(carted_id, product_id, ) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), cart_id, product_id,]);
  return response.rows[0];
};
const updateUser = async({ user_id, username, })=> {
  const SQL = `
    INSERT INTO users(user_id, username, ) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, username,]);
  return response.rows[0];
};
const updateProduct = async({ product_id, })=> {
  const SQL = `
    INSERT INTO product(product_id, ) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), product_id,]);
  return response.rows[0];
};


const deleteUser = async({ user_id, id })=> {
  const SQL = `
    DELETE FROM users WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const deleteProduct = async({ product_id, id })=> {
  const SQL = `
    DELETE FROM products WHERE product_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const deleteCartedProduct = async({ user_id, id })=> {
  const SQL = `
    DELETE FROM carts WHERE cart_id=$1 AND id=$2
    DELETE FROM products WHERE product_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, password, username 
    FROM users 
    WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if((!response.rows.length || await bcrypt.compare(password, response.rows[0].password))===false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token: token };
};

const findUserWithToken = async(token)=> {
  let id;
  console.log("insidefinduserwithtoken")
  console.log("passed token " + token)
  try{
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;

  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async()=> {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchOrder = async(user_id)=> {
  const SQL = `
    SELECT * FROM orders where order_id = $1
  `;
  const response = await client.query(SQL, [order_id]);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  createCart,
  createProduct,
  selectOrder,
  readUser,
  readProduct,
  selectProduct,
  updateUser,
  updateCartedProduct,
  updateProduct,
  fetchUsers,
  fetchProducts,
  deleteUser,
  deleteProduct,
  deleteCartedProduct,
  authenticate,
  findUserWithToken
};