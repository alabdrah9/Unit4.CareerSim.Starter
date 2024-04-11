// /* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
import { useState, useEffect } from "react";
import useToken from "../useToken.js";
import Books from "./Books.jsx";

export function Account() {
  const [successMessage, setSuccessMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [account, setAccount] = useState();
  const [token] = useToken();
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(
          "https://unit4-careersim-starter.onrender.com/api/user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setProducts(result.products);
        setAccount(result.email);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchUserData();
  }, []);
  return (
    <>
      <h1>Product in my cart</h1>
      <thead>
        <tr>
          <th>name</th>
          <th>Account</th>
        </tr>
      </thead>
      {products.map((product) => {
        return (
          <tr key={product.id}>
            <td>{product.name}</td>
            {/* <button onClick={async() => await deleteCheckOuts(product.id)}>
                    Return
                </button> */}
          </tr>
        );
      })}
      <div>
        <label>Account:</label>
    <h2>{account}</h2>
      </div>
    </>
  );
}