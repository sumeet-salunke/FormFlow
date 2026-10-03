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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "var(--primary)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "1.25rem",
              marginBottom: "1rem",
              boxShadow: "0 8px 16px rgba(99, 102, 241, 0.35)",
            }}
          >
            F
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p style={{ margin: "0.35rem 0 0", fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
            Get started building and publishing smart forms
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success" style={{ marginBottom: "1.25rem" }}>
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="reg-name" className="form-label">
              Full Name
            </label>
            <input
              id="reg-name"
              className="form-input auth-input"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="reg-email" className="form-label">
              Work Email
            </label>
            <input
              id="reg-email"
              className="form-input auth-input"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label htmlFor="reg-password" className="form-label">
              Password
            </label>
            <input
              id="reg-password"
              className="form-input auth-input"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="reg-confirm-password" className="form-label">
              Confirm Password
            </label>
            <input
              id="reg-confirm-password"
              className="form-input auth-input"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-primary auth-button"
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem 1rem", fontSize: "var(--font-base)", justifyContent: "center" }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              "Get Started Free"
            )}
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <p className="auth-footer" style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary-light)", fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;