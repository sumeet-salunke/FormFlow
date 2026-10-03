import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getFormById, updateFormStatus, publishForm } from "../../services/form.service.js";

const ViewForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getFormById(formId);
      setForm(result.data);
    } catch (err) {
      setError(err?.error?.message || "Unable to load form.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForm();
  }, [formId]);

  const handleFormStatusChange = async () => {
    if (!form || actionLoading) return;
    setError("");
    setMessage("");
    setActionLoading(true);
    const newStatus = form.status === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    try {
      const result = await updateFormStatus(formId, newStatus);
      setForm(result.data);
      setMessage(result.message || `Form status changed to ${newStatus}.`);
    } catch (err) {
      setError(err?.error?.message || "Unable to change form status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!form || actionLoading) return;
    const confirmed = window.confirm(
      "Are you sure you want to publish this form? Once published, question structure cannot be modified."
    );
    if (!confirmed) return;

    setError("");
    setMessage("");
    setActionLoading(true);
    try {
      const result = await publishForm(formId);
      setForm(result.data);
      setMessage(result.message || "Form published successfully!");
    } catch (err) {
      setError(err?.error?.message || "Unable to publish form.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!form?.publicId) return;
    const url = `${window.location.origin}/forms/public/${form.publicId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatScheduleDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
        <div className="spinner" style={{ width: "24px", height: "24px", marginBottom: "1rem" }}></div>
        <p>Loading form overview...</p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">⚠️</span>
        <h2 className="empty-state-title">Error Loading Form</h2>
        <p className="empty-state-desc">{error}</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/forms")}
        >
          ← Back to My Forms
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/forms">My Forms</Link>
        <span className="breadcrumbs-separator">/</span>
        <span>{form.title}</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <h1 className="page-title">{form.title}</h1>
            {form.status === "PUBLISHED" && (
              <span className="badge badge-published">
                <span className="badge-dot"></span>
                Published
              </span>
            )}
            {form.status === "CLOSED" && (
              <span className="badge badge-closed">
                <span className="badge-dot"></span>
                Closed
              </span>
            )}
            {form.status === "DRAFT" && (
              <span className="badge badge-draft">
                <span className="badge-dot"></span>
                Draft
              </span>
            )}
          </div>
          {form.description && (
            <p className="page-subtitle" style={{ marginTop: "0.4rem" }}>
              {form.description}
            </p>
          )}
        </div>

        {/* Action Toolbar based on Status */}
        <div className="page-actions">
          {form.status === "DRAFT" && (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/forms/${formId}/edit`)}
              >
                Edit Settings
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/forms/${formId}/builder`)}
              >
                Build Questions ({form.fields?.length || 0})
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePublish}
                disabled={actionLoading}
              >
                {actionLoading ? "Publishing..." : "Publish Form"}
              </button>
            </>
          )}

          {form.status === "PUBLISHED" && (
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(`/responses/form/${formId}`)}
              >
                View Responses
              </button>
              <button
                type="button"
                className="btn btn-danger-outline"
                onClick={handleFormStatusChange}
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Halt Form"}
              </button>
            </>
          )}

          {form.status === "CLOSED" && (
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(`/responses/form/${formId}`)}
              >
                View Responses
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleFormStatusChange}
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Resume Form"}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Public Share Box (if Published or Closed) */}
      {form.publicId && (
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 20, 34, 0.6) 100%)",
            borderColor: "var(--primary-border)",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={{ fontSize: "var(--font-xs)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--primary)" }}>
                Public Responder Link
              </span>
              <p style={{ margin: "0.25rem 0 0", fontSize: "var(--font-sm)", color: "var(--text-secondary)" }}>
                Share this link with respondents to collect submissions
              </p>
              <code
                style={{
                  display: "inline-block",
                  marginTop: "0.5rem",
                  padding: "0.35rem 0.65rem",
                  background: "rgba(0, 0, 0, 0.4)",
                  borderRadius: "var(--radius-xs)",
                  fontSize: "var(--font-xs)",
                  color: "#a5b4fc",
                }}
              >
                {window.location.origin}/forms/public/{form.publicId}
              </code>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopyLink}
              >
                {copied ? "✓ Copied" : "Copy Link"}
              </button>
              <a
                href={`/forms/public/${form.publicId}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open Form ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Form Specifications Card */}
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", display: "block" }}>
            Availability Mode
          </span>
          <span style={{ fontSize: "var(--font-base)", fontWeight: "600", color: "#ffffff" }}>
            {form.availability === "SCHEDULED" ? "Scheduled Window" : "Always Open"}
          </span>
        </div>

        {form.availability === "SCHEDULED" && (
          <>
            <div>
              <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", display: "block" }}>
                Accepting Responses From
              </span>
              <span style={{ fontSize: "var(--font-base)", fontWeight: "600", color: "#ffffff" }}>
                {formatScheduleDate(form.startDate)}
              </span>
            </div>
            <div>
              <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", display: "block" }}>
                Accepting Responses Until
              </span>
              <span style={{ fontSize: "var(--font-base)", fontWeight: "600", color: "#ffffff" }}>
                {formatScheduleDate(form.endDate)}
              </span>
            </div>
          </>
        )}

        <div>
          <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", display: "block" }}>
            Questions Count
          </span>
          <span style={{ fontSize: "var(--font-base)", fontWeight: "600", color: "#ffffff" }}>
            {form.fields?.length || 0} fields
          </span>
        </div>
      </div>

      {/* Questions Preview */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "var(--font-xl)", fontWeight: "700" }}>
            Questions Preview
          </h2>
          {form.status === "DRAFT" && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(`/forms/${formId}/builder`)}
              style={{ color: "var(--primary)" }}
            >
              Edit in Builder →
            </button>
          )}
        </div>

        {(!form.fields || form.fields.length === 0) ? (
          <div className="empty-state">
            <p className="empty-state-title">No questions configured</p>
            <p className="empty-state-desc">
              Add questions to your form before publishing.
            </p>
            {form.status === "DRAFT" && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/forms/${formId}/builder`)}
              >
                + Add Questions
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {form.fields.map((field, index) => (
              <div key={field._id || index} className="card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "var(--font-xs)", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                      QUESTION {index + 1}
                    </span>
                    <h3 style={{ margin: "0 0 0.5rem", fontSize: "var(--font-base)", fontWeight: "600", color: "#ffffff" }}>
                      {field.label}
                    </h3>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <span className="badge badge-neutral">
                      {field.type.replace(/_/g, " ")}
                    </span>
                    {field.required ? (
                      <span className="badge badge-published">Required</span>
                    ) : (
                      <span className="badge badge-neutral" style={{ opacity: 0.7 }}>Optional</span>
                    )}
                  </div>
                </div>

                {/* Options List */}
                {field.options?.length > 0 && (
                  <div style={{ marginTop: "0.75rem", paddingLeft: "0.5rem" }}>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "var(--font-sm)" }}>
                      {field.options.map((opt, i) => (
                        <li key={i} style={{ marginBottom: "0.25rem" }}>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewForm;