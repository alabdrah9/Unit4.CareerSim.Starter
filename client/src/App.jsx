
// import bookLogo from "./assets/books.png";
import { useState } from "react";
import Login from "./components/Login.jsx";
import { Navigation } from "./components/Navigation.jsx";
import { TokenContext } from "./TokenContext.jsx";
import UseToken from "./UseToken.js"
import SingleProduct from "./components/SingleProduct.jsx";
import Product from "./components/Parouduct.jsx"
import { Routes, Route, BrowserRouter } from "react-router-dom";

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
            {/* <Route path="/" element={<Books />} />
            <Route path="/books/:bookId" element={<SingleBook />} />
            <Route path="/account" element={<Account />} /> */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
          </Routes>
        </div>
      </TokenContext.Provider>
    </>
  );
}

export default App