import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  deleteAllResponses,
  deleteResponse,
  getFormResponses,
} from "../../services/response.service.js";
import { getFormById } from "../../services/form.service.js";

const FormResponses = () => {
  const navigate = useNavigate();
  const { formId } = useParams();

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadFormAndResponses = async () => {
      setLoading(true);
      setError("");
      try {
        const [formResult, responsesResult] = await Promise.all([
          getFormById(formId),
          getFormResponses(formId),
        ]);
        if (isMounted) {
          setForm(formResult.data);
          setResponses(responsesResult.data ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.error?.message || "Unable to load form responses.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadFormAndResponses();
    return () => {
      isMounted = false;
    };
  }, [formId]);

  const handleDeleteResponse = async (responseId) => {
    const confirmed = window.confirm("Are you sure you want to delete this response?");
    if (!confirmed) return;

    setDeletingId(responseId);
    setError("");
    try {
      await deleteResponse(responseId);
      setResponses((previous) =>
        previous.filter((response) => response._id !== responseId)
      );
    } catch (err) {
      setError(err?.error?.message || "Unable to delete response.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAllResponses = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL responses for this form? This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");
    try {
      await deleteAllResponses(formId);
      setResponses([]);
    } catch (err) {
      setError(err?.error?.message || "Unable to delete responses.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
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
        <p>Loading responses...</p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">⚠️</span>
        <h2 className="empty-state-title">Error Loading Responses</h2>
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
        <Link to={`/forms/${formId}`}>{form?.title || "Form"}</Link>
        <span className="breadcrumbs-separator">/</span>
        <span>Responses</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <h1 className="page-title">Form Responses</h1>
            <span className="badge badge-neutral">
              {responses.length} {responses.length === 1 ? "response" : "responses"}
            </span>
          </div>
          <p className="page-subtitle">
            Viewing collected answers for {form?.title}
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/forms/${formId}`)}
          >
            ← Back to Form
          </button>

          {responses.length > 0 && (
            <button
              type="button"
              className="btn btn-danger-outline"
              disabled={deleting}
              onClick={handleDeleteAllResponses}
            >
              {deleting ? "Deleting all..." : "Delete All Responses"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Empty State */}
      {responses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <h2 className="empty-state-title">No responses recorded yet</h2>
          <p className="empty-state-desc">
            Once respondents complete and submit your public form, their submissions will appear here.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/forms/${formId}`)}
          >
            View Form Details & Share
          </button>
        </div>
      ) : (
        <div>
          {/* Desktop Data Table */}
          <div className="table-container responses-desktop-view">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  {form.fields?.map((field) => (
                    <th key={field._id} title={field.label}>
                      {field.label}
                    </th>
                  ))}
                  <th style={{ width: "160px" }}>Submitted At</th>
                  <th style={{ width: "130px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, rIndex) => (
                  <tr key={response._id}>
                    <td style={{ color: "var(--text-muted)", fontWeight: "600" }}>
                      {rIndex + 1}
                    </td>

                    {form.fields?.map((field) => {
                      const answer = response.answers?.find(
                        (a) => a.fieldId?.toString() === field._id?.toString()
                      );
                      const displayVal = Array.isArray(answer?.value)
                        ? answer.value.join(", ")
                        : answer?.value !== undefined && answer?.value !== null
                        ? String(answer.value)
                        : "-";

                      return (
                        <td key={field._id} style={{ maxWidth: "220px", wordBreak: "break-word" }}>
                          {displayVal}
                        </td>
                      );
                    })}

                    <td style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {formatDate(response.submittedAt)}
                    </td>

                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/responses/${response._id}/edit`)}
                          title="Edit response"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: "var(--danger-fg)" }}
                          disabled={deletingId === response._id}
                          onClick={() => handleDeleteResponse(response._id)}
                          title="Delete response"
                        >
                          {deletingId === response._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responses Card List (Screen width <= 768px) */}
          <div className="responses-mobile-view" style={{ display: "none", flexDirection: "column", gap: "1rem" }}>
            {responses.map((response, rIndex) => (
              <div key={response._id} className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "var(--font-xs)", fontWeight: "700", color: "var(--primary)" }}>
                    RESPONSE #{rIndex + 1}
                  </span>
                  <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
                    {formatDate(response.submittedAt)}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
                  {form.fields?.map((field) => {
                    const answer = response.answers?.find(
                      (a) => a.fieldId?.toString() === field._id?.toString()
                    );
                    const displayVal = Array.isArray(answer?.value)
                      ? answer.value.join(", ")
                      : answer?.value !== undefined && answer?.value !== null
                      ? String(answer.value)
                      : "-";

                    return (
                      <div key={field._id}>
                        <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", display: "block" }}>
                          {field.label}
                        </span>
                        <span style={{ fontSize: "var(--font-sm)", color: "#ffffff", fontWeight: "500" }}>
                          {displayVal}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/responses/${response._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    style={{ flex: 1 }}
                    disabled={deletingId === response._id}
                    onClick={() => handleDeleteResponse(response._id)}
                  >
                    {deletingId === response._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponses;