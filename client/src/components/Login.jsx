import { useState } from "react";
import useToken from "../UseToken.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [token, setToken] = useToken();


  const handleSubmit = async (e) => {
   e.preventDefault()
    try {
      const response = await fetch(
        "https://unit4-careersim-starter.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email, password}),
        }
      );
      const result = await response.json();
      console.log({result});
      if (result.token) {
        setToken(result.token);
      } else {
        setError(result.message);
      }

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <h1>Login</h1>
      {error && <h2>{error}</h2>}
      <form onSubmit={handleSubmit}
      >
        <label htmlFor="email" />
        Email:{""}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" />
        Password:{""}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
                <button type="submit">Log In</button>

      </form>
    </div>
  );

  
}