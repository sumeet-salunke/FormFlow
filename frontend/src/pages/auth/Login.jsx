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
          <h1 className="auth-title">Welcome Back</h1>
          <p style={{ margin: "0.35rem 0 0", fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
            Sign in to manage your forms and view responses
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
            <label htmlFor="login-email" className="form-label">
              Work Email
            </label>
            <input
              id="login-email"
              className="form-input auth-input"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={credentials.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              className="form-input auth-input"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={credentials.password}
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <p className="auth-footer" style={{ margin: 0, fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary-light)", fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;