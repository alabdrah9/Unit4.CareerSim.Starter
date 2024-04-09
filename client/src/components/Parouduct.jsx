// import { useEffect, useState } from "react";
// import App from "../App.jsx";
// import { Link, useNavigate } from "react-router-dom";

// /* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */
// export default function Product() {
// //   const dummydata = [{ id: 0, title: "dummy" }];
//   const [Products, setProducts] = useState("");
//   const [filter, setFilter] = useState("")
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function getProduct() {
//       try {
//         await fetch(
//           "",
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         )
//           .then((response) => response.json())
//           .then((result) => {
//             setBooks(result.books);
//             console.log(result.books);
//           })
//           .catch(console.error);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     getBooks();
//   }, []);
//   function handleFilter(evt) {
//     setFilter(evt.target.value)
//   }
//   // function handleClick(){}

//   return (
//     <>
//       <h2>Books</h2>
//       <input type="text" name="filter" value={filter} onChange={handleFilter} />
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Author</th>
//             <th>Summary</th>
//             <th>coverimage</th>
//             <th>available</th>
//           </tr>
//         </thead>
//         <tbody>
//         <link to="./Books.jsx">{books.id}</link>
          
//             {books.filter(book => book.title.match(filter)).map((book) => (
//               <tr onClick={() => navigate("/books/" + book.id)} key={book.id}>
//                 <td>{book.title}</td>
//                 <td>{book.author}</td>
//                 <td>{book.description}</td>
//                 <td>{book.coverimage}</td>
//                 <td>{book.available}</td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//       <div />
//     </>
//   );
// }