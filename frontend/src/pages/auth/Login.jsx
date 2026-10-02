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
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="email"
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Logging in....." : "Login"}
          </button>
        </form>
        {message && <p className="auth-message auth-success">{message}</p>}

        {error && <p className="auth-message auth-error">{error}</p>}
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;