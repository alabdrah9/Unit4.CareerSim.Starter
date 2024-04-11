import { useEffect, useState } from "react";
import UseToken from "../UseToken.js";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [token, setToken] = useToken();

  useEffect(() => {
    async function registerUser() { }
    registerUser();
  }, []);

  const handleChange = (e) => {
    const { email, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [email]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const registerResponse = await fetch(
        "postgres://employees_db_swda_user:CTt0i5M2hz3fUujAO37C5Gp0AoU5uJTk@dpg-cndv8aeg1b2c739ocap0-a.ohio-postgres.render.com/employees_db_swda?ssl=true/api/auth/register",
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