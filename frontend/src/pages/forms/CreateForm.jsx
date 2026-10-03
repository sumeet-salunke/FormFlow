import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createForm } from "../../services/form.service.js";

const CreateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError("Please provide a title for your form.");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);
    try {
      const result = await createForm({
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      const createdId = result?.data?._id;
      if (createdId) {
        navigate(`/forms/${createdId}/builder`);
      } else {
        setMessage(result.message || "Form created successfully.");
        setFormData({ title: "", description: "" });
      }
    } catch (err) {
      setError(err?.error?.message || "Unable to create form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "var(--form-card-max-width)", margin: "0 auto" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/forms">My Forms</Link>
        <span className="breadcrumbs-separator">/</span>
        <span>Create New Form</span>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: "1.5rem" }}>
          <div>
            <h1 className="card-title" style={{ fontSize: "var(--font-2xl)" }}>
              Create New Form
            </h1>
            <p className="card-subtitle">
              Start by entering the title and an optional description for your respondents.
            </p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              <span>Form Title</span>
              <span className="form-required-star">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              value={formData.title}
              placeholder="e.g., Customer Feedback Survey, Event RSVP..."
              onChange={handleChange}
              required
              autoFocus
            />
            <span className="form-hint">A clear, descriptive title helps respondents understand your form.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Form Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              placeholder="Provide instructions, context, or notes for respondents..."
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/forms")}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating form..." : "Continue to Question Builder →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;