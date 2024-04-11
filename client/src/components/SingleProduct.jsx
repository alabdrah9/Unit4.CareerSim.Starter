import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useToken from "../UseToken";
import Product from "./Product.jsx";

export default function SingleProduct() {
  const [product, setProduct] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState();
  const [token] = useToken();

  const { productId } = useParams();

  useEffect(() => {
    async function fetchSingleProduct(productId) {
      try {
        const response = await fetch(
          `https://unit4-careersim-starter.onrender.com/api/product/${productId}`);
        const result = await response.json();
        setProduct(result.book);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSingleProduct(productId);
  }, [])

  async function handleClick() {
    try {
      console.log(token);

      const response = await fetch(
        "https://unit4-careersim-starter.onrender.com/api/product",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            available: false
          })
        })
      const result = await response.json();
      setSuccessMessage(result.message);
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <>
    name, inventory, price, currency, image_url
      <h1>{product.name}</h1>
      {/* <h1>{product.image_url}</h1>
      <p>{product.currency}</p>
      <p>{successMessage}</p> */}
      <p color="red">{error}</p>
      <button onClick={async () => await handleClick(productId)}>Check Out</button>
    </>
  )

}