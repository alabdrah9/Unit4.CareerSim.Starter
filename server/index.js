
const  {
  client,
  createTables,
  createUser,
  createCart,
  createProduct,
  authenticate,
  findUserWithToken,
  fetchUsers,
  fetchProducts,
  deleteProduct,
  fetchProductById,
  selectOrder,
  readUser,
  readProduct,
  selectProduct,
  updateUser,
  updateCartedProduct,
  fetchOrder,
  deleteUser,
  deleteCartedProduct,
  fetchUserInfo,
  singUp,
  login,
  logout,
  cart_products,
  updateProduct, 
  addCart,
  removeCart,
  checkout
  
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

const isAdmin = async(req,res,next) =>{
  try{
    if(req.user.isAdmin){
      next()
    }else{
      next(new Error("user in not admin"))
    }

  }catch (ex){

  }
}

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

app.get('/api/auth/me', isLoggedIn,isAdmin, async(req, res, next)=> {
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

app.get('/api/users/:id/cart',isLoggedIn,isAdmin, async(req, res, next)=> {
  try {
    res.send(await fetchCart(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/users/:id/cart', isLoggedIn,isAdmin, async(req, res, next)=> {
  try {
    res.status(201).send(await createCart({ user_id: req.params.id, product_id: req.body.product_id}));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:user_id/product/:id', isLoggedIn,isAdmin, async(req, res, next)=> {
  try {
    await deleteProduct({user_id: req.params.user_id, id: req.params.id });
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

app.get('/api/products/:id', async(req, res, next)=> {
  const { id } = req.params;
  const product= await fetchProductById(id)
  if (product){
    res.json(product);
  }else{
    res.status(404).json({ message: 'product not found'});
  }
  
});


app.put('/api/products', async(req, res, next)=> {
  try {
    res.send(await Products());
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
      username: 'Moe', password: 'm_pw', payment_info: "1233887661212121",admin: true,
    }),
    createUser({
      username: 'Adam', password: 'm_ab', payment_info: "1233887661212122",admin: true,
    }),
    createUser({
      username: 'Ryan', password: 'm_cd', payment_info: "1233887661212123", admin: true,
    }),
    createUser({
      username: 'Ahmed', password: 'm_ef', payment_info: "1233887661212124", admin: false,
    }),
  ]);

  const products = await Promise.all([
    createProduct({
      name: 'sauvage', inventory: 83, price: 135.00, currency: "$", admin: true, image_url:'https://www.sephora.com/productimages/sku/s2267797-main-zoom.jpg?imwidth=1224://www.sephora.com/productimages/sku/s1739333-main-zoom.jpg?imwidth=315',
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
  const cart_products = await Promise.all([
    createProduct({
      name: 'Moe', inventory: 83, price: 135.00, currency: "$",
    }),
    createProduct({
      name: ' Adam ', inventory: 54, price: 120.00, currency: "$",
    }),
    createProduct({
      name: 'Ryan', inventory: 19, price: 103.00, currency: "$",
    }),
    createProduct({
      name: 'Ahmed', inventory: 30, price: 172.00, currency: "$",
    }),
  ]);

  console.log( user);
  console.log( products);

  // console.log(await fetchFavorites(moe.id));
  // const favorite = await createFavorite({ user_id: moe.id, product_id: });
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();