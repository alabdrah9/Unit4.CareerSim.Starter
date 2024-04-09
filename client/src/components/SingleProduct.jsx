import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useToken from "../useToken";
import Product from "././Parouduct.jsx"

export default function SingleProduct() {
  const [produc, setProduct] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState();
  const [token] = useToken();

  const { productId } = useParams();

  useEffect(() => {
    async function fetchSingleProduct(bookId) {
      try {
        const response = await fetch(
          `https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${bookId}`);
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
        "https://unit4-careersim-starter.onrender.com/api/products",
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
      <h1>{product.image_url}</h1>
      <p>{product.currency}</p>
      <p>{successMessage}</p>
      <p color="red">{error}</p>
      <button onClick={async () => await handleClick(productId)}>Check Out</button>
    </>
  )

}