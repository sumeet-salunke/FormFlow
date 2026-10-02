import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/auth.service.js";
import "../../css/Register.css";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
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
      const result = await registerUser(formData);
      setMessage(result.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (error) {
      setError(error?.error?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Creating account....." : "Create Account"}
          </button>
        </form>
        {message && <p className="auth-message auth-success">{message}</p>}

        {error && <p className="auth-message auth-error">{error}</p>}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;