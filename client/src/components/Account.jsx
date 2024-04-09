// // /* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
// import { useState, useEffect } from "react";
// import useToken from "../useToken.js";
// import Books from "./Books.jsx";

// export function Account() {
//   const [successMessage, setSuccessMessage] = useState("");
//   const [books, setBooks] = useState([]);
//   const [account, setAccount] = useState();
//   const [token] = useToken();
//   useEffect(() => {
//     async function fetchUserData() {
//       try {
//         const response = await fetch(
//           "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const result = await response.json();
//         setBooks(result.books);
//         setAccount(result.email);
//       } catch (error) {
//         console.error(error.message);
//       }
//     }
//     fetchUserData();
//   }, []);
//   return (
//     <>
//       <h1>Books in My Box</h1>
//       <thead>
//         <tr>
//           <th>name</th>
//           <th>Account</th>
//         </tr>
//       </thead>
//       {books.map((book) => {
//         return (
//           <tr key={book.id}>
//             <td>{book.title}</td>
//             {/* <button onClick={async() => await deleteCheckOuts(book.id)}>
//                     Return
//                 </button> */}
//           </tr>
//         );
//       })}
//       <div>
//         <label>Account:</label>
//     <h2>{account}</h2>
//       </div>
//     </>
//   );
// }