
const {
  client,
  createTables,
  createUser,
  createCart,
  createOrder,
  createProduct,
  createCarts,
  selectProduct,
  authenticate,
  findUserWithToken,
  findCartWithToken,
  fetchUsers,
  fetchProducts,
  fetchOrder,
  deleteProduct,
  deleteUser,
  fetchProductById,
  readUser,
  readProduct,
  updateUser,
  updateCartedProduct,
  deleteCartedProduct,
  fetchUserInfo,
  Register,
  login,
  logout,
  cart_products,
  updateProduct,
  addCart,
  removeCart,
  checkout,
  fetchOrderById

} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));

const cors = require('cors');
const { register } = require('module');
 app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    withCredentials: true,
}))
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      next()
    } else {
      next(new Error("user in not admin"))
    }

  } catch (ex) {

  }
}

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch (ex) {
    next(ex);
  }
};

app.post('/api/auth/login', async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

app.post('/api/auth/logout', async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    res.send(await Register(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await findUserWithToken(req.headers.authorization));
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/user', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/user', async (req, res, next) => {
  try {
    res.send(await createOrder());
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await findCartWithToken(req.headers.authorization));
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:id/cart', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await fetchCart(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:id/order', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.send(await fetchProductById(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

app.post('/api/users/:id/cart', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(await createCarts({ user_id: req.params.id, product_id: req.body.product_id }));
  }
  catch (ex) {
    next(ex);
  }
});

app.post("/user/:userId/createOrder/:id",isLoggedIn,isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(await createOrders({ user_id: req.params.userId, order_id: req.body.order_id, qty: req.body.qty }));
  }
  catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:user_id/product/:id', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await deleteProduct({ user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:user_id/order/:id', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await deleteUser({ user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:user_id/product/:id', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await deleteOrder({ user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:user_id/product/:id', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    await deleteCart({ user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  const { id } = req.params;
  const product = await fetchProductById(id)
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'product not found' });
  }

});

app.put('/api/products', async (req, res, next) => {
  try {
    res.send(await Products());
  }
  catch (ex) {
    next(ex);
  }
});

app.put('/api/orders',  isLoggedIn,isAdmin, async (req, res, next) => {
  try {
  res.send(await orders());
  }
  catch (ex) {
    next(ex);
  }
});
app.put('/api/CreateCartProducts', async (req, res, next) => {
  try {
    res.send(await createCartProduct());
  }
  catch (ex) {
    next(ex);
  }
});


app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async () => {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');



  const user = await Promise.all([
    createUser({
      email: 'moe123@gmail.com', username: 'Moe', password: 'pass123456', payment_info: "1233887661212121", admin: true,
    }),
    createUser({
      email: 'Adam123@gmail.com', username: 'Adam', password: 'pass1234567', payment_info: "1233887661212122", admin: true,
    }),
    createUser({
      email: 'Ryan123@gmail.com', username: 'Ryan', password: 'pass12345678', payment_info: "1233887661212123", admin: true,
    }),
    createUser({
      email: 'Ahmed123@gmail.com', username: 'Ahmed', password: 'pass1234456789', payment_info: "1233887661212124", admin: false,
    }),
  ]);

  const products = await Promise.all([
    createProduct({
      name: 'sauvage', inventory: 83, price: 135.00, currency: "$", admin: true, image_url: 'https://www.sephora.com/productimages/sku/s2267797-main-zoom.jpg?imwidth=1224://www.sephora.com/productimages/sku/s1739333-main-zoom.jpg?imwidth=315',
    }),
    createProduct({
      name: ' Home Intense', inventory: 54, price: 120.00, currency: "$", admin: true, image_url: 'https://www.sephora.com/productimages/sku/s2310548-main-zoom.jpg?imwidth=1224',
    }),
    createProduct({
      name: 'No:5', inventory: 19, price: 103.00, currency: "$", admin: true, image_url: 'https://www.sephora.com/productimages/sku/s719260-main-zoom.jpg?imwidth=1224',
    }),
    createProduct({
      name: 'chance', inventory: 30, price: 172.00, currency: "$", admin: false, image_url: 'https://www.sephora.com/productimages/sku/s2170686-main-zoom.jpg?imwidth=1224',
    }),
  ]);

  console.log(user);
  console.log(products[0].name);


  const carts = await Promise.all([
    createCart({  product_id: products[0].id, user_id: user[0].id, qty: '1',
    }),
  ]);

    
    console.log(carts);
const orders = await Promise.all([
  createOrder({
    user_id: user[0].id,  product_id: products[0].id, qty: '1',
  }),
]);
console.log(orders[0].user_id);
    // console.log(await fetchFavorites(moe.id));
    // const favorite = await createFavorite({ user_id: moe.id, product_id: });
    app.listen(port, () => console.log(`listening on port ${port}`));
  };
  
  init();