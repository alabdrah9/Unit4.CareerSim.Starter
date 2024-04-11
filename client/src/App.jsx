
// import bookLogo from "./assets/books.png";
import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import { Navigation } from "./components/Navigation.jsx";
import { TokenContext } from "./TokenContext.jsx";
import UseToken from "./UseToken.js"
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import Product from "./components/Parouduct.jsx";

function App() {
  const [token, setToken] = useState(null);

  return (

    <>
      <div>
        <h1>
          {/* <img id="logo-image" src={bookLogo} alt="Book Logo" /> */}
          Library App
        </h1>

      </div>
      <TokenContext.Provider value={[token, setToken]}>

        <Navigation />

        <div id="main-section">
          <Routes>
            <Route path="/" element={<Product />} />
            {/* <Route path="/books/:bookId" element={<SingleProduct />} />
            <Route path="/account" element={<Account/>} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
          </Routes>
        </div>
      </TokenContext.Provider>
    </>
  );
}

export default App