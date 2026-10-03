import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { updateForm, getFormById } from "../../services/form.service.js";

const toDatetimeLocal = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const fromDatetimeLocal = (localString) => {
  if (!localString) return null;
  const date = new Date(localString);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
};

const EditForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    availability: "ALWAYS",
    startDate: "",
    endDate: "",
    fields: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";

  useEffect(() => {
    let isMounted = true;
    const loadForm = async () => {
      try {
        const result = await getFormById(formId);
        const form = result.data;
        if (isMounted) {
          setFormData({
            title: form.title || "",
            description: form.description || "",
            availability: form.availability || "ALWAYS",
            startDate: toDatetimeLocal(form.startDate),
            endDate: toDatetimeLocal(form.endDate),
            fields: form.fields ?? [],
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.error?.message || "Unable to load form.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadForm();
    return () => {
      isMounted = false;
    };
  }, [formId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError("Form title cannot be empty.");
      return;
    }

    setError("");
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description ? formData.description.trim() : "",
        availability: formData.availability,
        fields: formData.fields,
        startDate:
          formData.availability === "SCHEDULED" && formData.startDate
            ? fromDatetimeLocal(formData.startDate)
            : null,
        endDate:
          formData.availability === "SCHEDULED" && formData.endDate
            ? fromDatetimeLocal(formData.endDate)
            : null,
      };
      const result = await updateForm(formId, payload);
      setMessage(result.message || "Form updated successfully.");
      navigate(`/forms/${formId}`);
    } catch (err) {
      setError(err?.error?.message || "Unable to update form.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
        <div className="spinner" style={{ width: "24px", height: "24px", marginBottom: "1rem" }}></div>
        <p>Loading form details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "var(--form-card-max-width)", margin: "0 auto" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/forms">My Forms</Link>
        <span className="breadcrumbs-separator">/</span>
        <Link to={`/forms/${formId}`}>{formData.title || "Form"}</Link>
        <span className="breadcrumbs-separator">/</span>
        <span>Settings</span>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: "1.5rem" }}>
          <div>
            <h1 className="card-title" style={{ fontSize: "var(--font-2xl)" }}>
              Edit Form Settings
            </h1>
            <p className="card-subtitle">
              Configure basic information and response schedule
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/forms/${formId}/builder`)}
          >
            Questions Builder ({formData.fields?.length || 0}) →
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSave}>
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
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Form Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="availability">
              Availability Schedule
            </label>
            <select
              id="availability"
              name="availability"
              className="form-select"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="ALWAYS">Always Available (Open indefinitely)</option>
              <option value="SCHEDULED">Scheduled (Open during specific date/time window)</option>
            </select>
          </div>

          {formData.availability === "SCHEDULED" && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="startDate">
                    <span>Start Date & Time</span>
                    <span className="form-required-star">*</span>
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    className="form-input"
                    value={formData.startDate}
                    onChange={handleChange}
                    required={formData.availability === "SCHEDULED"}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="endDate">
                    <span>End Date & Time</span>
                    <span className="form-required-star">*</span>
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    className="form-input"
                    value={formData.endDate}
                    onChange={handleChange}
                    required={formData.availability === "SCHEDULED"}
                  />
                </div>
              </div>
              <span className="form-hint" style={{ display: "block", marginTop: "0.75rem" }}>
                Dates are in your local timezone ({userTimeZone}).
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/forms/${formId}`)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;