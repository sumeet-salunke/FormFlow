import { useState } from "react";
import { registerUser } from "../../services/auth.service.js";

const Register = () => {
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
      })
    } catch (error) {
      setError(error?.error?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} />

        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />

        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />

        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account....." : "Create Account"}
        </button>

      </form>
      {message && <p>{message}</p>}

      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;