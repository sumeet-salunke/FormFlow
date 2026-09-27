import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/auth.service.js";
import "../../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(credentials);
      setMessage(result.message);
      setCredentials({
        email: "",
        password: "",
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error?.error?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>

        <input name="email" type="email" placeholder="Email" value={credentials.email} onChange={handleChange} />

        <input name="password" type="password" placeholder="Password" value={credentials.password} onChange={handleChange} />


        <button type="submit" disabled={loading}>
          {loading ? "Logging in....." : "Login"}
        </button>

      </form>
      {message && <p>{message}</p>}

      {error && <p>{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;