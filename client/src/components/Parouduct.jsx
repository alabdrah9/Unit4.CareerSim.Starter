import { useEffect, useState } from "react";
import App from "../App.jsx";
import { Link, useNavigate } from "react-router-dom";


/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */
export default function Product() {
//   const dummydata = [{ id: 0, title: "dummy" }];
  const [Products, setProducts] = useState();
  const [filter, setFilter] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    async function getProduct() {
      try {
        await fetch(
          "postgres://employees_db_swda_user:CTt0i5M2hz3fUujAO37C5Gp0AoU5uJTk@dpg-cndv8aeg1b2c739ocap0-a.ohio-postgres.render.com/employees_db_swda?ssl=true/api/products",
          {
            method:"GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            setProducts(result.products);
            console.log(result.products);
          })
          .catch(console.error);
      } catch (error) {
        console.log(error);
      }
    }
    getProduct();
  }, []);
  function handleFilter(evt) {
    setFilter(evt.target.value)
  }
  // function handleClick(){}

  return (
    <>
      <h2>Product</h2>
      <input type="text" name="filter" value={filter} onChange={handleFilter} />
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>inventory</th>
            <th>image_url</th>
            <th>price</th>
            <th>currency</th>
          </tr>
        </thead>
        <tbody>
        <link to="./Product.jsx">{Product.name}</link>
          
        {Products.filter(product => product.name.match(filter)).map((product) => (
              <tr onClick={() => navigate("/product/" + product.id)} key={product.id}>
                <td>{product.name}</td>
                
              </tr>
            ))}
        </tbody>
      </table>
      <div />
    </>
  );
}