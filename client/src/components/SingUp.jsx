import { useEffect, useState } from "react";
import useToken from "../useToken.js";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [token, setToken] = useToken();

  useEffect(() => {
    async function registerUser() { }
    registerUser();
  }, []);

  //   async function getRegister() {
  //     try {
  //       const response = await fetch(
  //         "",{
  //         {
  //           method: "POST",
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             firstname: 'Sam',
  //             lastname: 'Smith',
  //             email: 'ssmith@example.com',
  //             password: 'sam345'
  //           })
  //         }).then(response => response.json())
  //           .then(result => {
  //             console.log(result);
  //           })
  //           .catch(console.error);

  //     }

  //   getRegister();

  // }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const registerResponse = await fetch(
        "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const userResult = await registerResponse.json();
      console.log({ userResult });
      setToken(userResult.token);
    } catch (e) {
      console.error(e);
    }
    console.log("Registration form submitted:", formData);
    setFormData({ username: "", email: "", password: "" });
  };
  console.log(formData);
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}