
const  {
  client,
  createTables,
  fetchUserInfo,
  singUp,
  login,
  logout,
  createProduct, //admin only
  updateProduct, // admin only
  deleteProduct, // admin only
  addCart,
  removeCart,
  checkout,
  authenticate,
  findUserWithToken,
  createUser
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

const isLoggedIn = async(req, res, next)=> {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch(ex){
    next(ex);
  }
};

app.post('/api/auth/login', async(req, res, next)=> {
  try {
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/auth/register', async(req, res, next)=> {
  try {
    res.send(await createProduct(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await findUserWithToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/user', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    res.send(await fetchFavorites(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/users/:id/favorites', isLoggedIn, async(req, res, next)=> {
  try {
    res.status(201).send(await createFavorite({ user_id: req.params.id, product_id: req.body.product_id}));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:user_id/favorites/:id', isLoggedIn, async(req, res, next)=> {
  try {
    await deleteProducts({user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/products', async(req, res, next)=> {
  try {
    res.send(await fetchProducts());
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async()=> {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');




  const user = await Promise.all([
    createUser({
      username: 'Moe', password: 'm_pw', payment_info: "1233887661212121",
    }),
    createUser({
      username: 'Adam', password: 'm_ab', payment_info: "1233887661212122",
    }),
    createUser({
      username: 'Ryan', password: 'm_cd', payment_info: "1233887661212123",
    }),
    createUser({
      username: 'Ahmed', password: 'm_ef', payment_info: "1233887661212124",
    }),
  ]);

  const products = await Promise.all([
    createProduct({
      name: 'sauvage', inventory: 83, price: 135.00, currency: "$",
    }),
    createProduct({
      name: ' Home Intense', inventory: 54, price: 120.00, currency: "$",
    }),
    createProduct({
      name: 'No:5', inventory: 19, price: 103.00, currency: "$",
    }),
    createProduct({
      name: 'chance', inventory: 30, price: 172.00, currency: "$",
    }),
  ]);

  console.log( user);
  console.log( products);

  // console.log(await fetchFavorites(moe.id));
  // const favorite = await createFavorite({ user_id: moe.id, product_id: foo.id });
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();