import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyForms } from "../../services/form.service.js";

const MyForms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, DRAFT, PUBLISHED, CLOSED
  const [copiedId, setCopiedId] = useState(null);

  const fetchForms = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyForms();
      setForms(result?.data ?? []);
    } catch (err) {
      setError(err?.error?.message || "Unable to load forms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCopyLink = (publicId) => {
    const url = `${window.location.origin}/forms/public/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredForms = forms.filter((form) => {
    if (filterStatus === "ALL") return true;
    return form.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="badge badge-published">
            <span className="badge-dot"></span>
            Published
          </span>
        );
      case "CLOSED":
        return (
          <span className="badge badge-closed">
            <span className="badge-dot"></span>
            Closed
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className="badge badge-draft">
            <span className="badge-dot"></span>
            Draft
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">My Forms</h1>
          <p className="page-subtitle">
            Create, manage, and monitor response collection across all your forms
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/forms/create")}
          >
            + Create Form
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter Tabs */}
      {!loading && forms.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {["ALL", "DRAFT", "PUBLISHED", "CLOSED"].map((status) => {
            const count =
              status === "ALL"
                ? forms.length
                : forms.filter((f) => f.status === status).length;
            const label =
              status === "ALL"
                ? "All Forms"
                : status.charAt(0) + status.slice(1).toLowerCase();

            return (
              <button
                key={status}
                type="button"
                className={`btn btn-sm ${
                  filterStatus === status ? "btn-secondary" : "btn-ghost"
                }`}
                onClick={() => setFilterStatus(status)}
                style={{
                  fontWeight: filterStatus === status ? "600" : "500",
                  color: filterStatus === status ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
          <div className="spinner" style={{ width: "24px", height: "24px", marginBottom: "1rem" }}></div>
          <p>Loading your forms...</p>
        </div>
      )}

      {/* Empty State (No forms at all) */}
      {!loading && forms.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">📝</span>
          <h2 className="empty-state-title">No forms created yet</h2>
          <p className="empty-state-desc">
            Get started by creating your first form to collect submissions and analyze responses.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/forms/create")}
          >
            + Create Your First Form
          </button>
        </div>
      )}

      {/* Empty Filter State */}
      {!loading && forms.length > 0 && filteredForms.length === 0 && (
        <div className="empty-state" style={{ padding: "2.5rem 1rem" }}>
          <p className="empty-state-title">No {filterStatus.toLowerCase()} forms found</p>
          <p className="empty-state-desc">Try selecting another filter above.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setFilterStatus("ALL")}
          >
            Show All Forms
          </button>
        </div>
      )}

      {/* Forms Grid */}
      {!loading && filteredForms.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem",
          }}
        >
          {filteredForms.map((form) => (
            <div
              key={form._id}
              className="card card-hoverable"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.35rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "var(--font-lg)",
                        fontWeight: "700",
                        color: "#ffffff",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/forms/${form._id}`)}
                    >
                      {form.title}
                    </h2>
                    {getStatusBadge(form.status)}
                  </div>

                  {form.description && (
                    <p
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "var(--font-sm)",
                        color: "var(--text-muted)",
                        lineHeight: 1.45,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {form.description}
                    </p>
                  )}

                  {/* Metadata Chips */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      fontSize: "var(--font-xs)",
                      color: "var(--text-muted)",
                      flexWrap: "wrap",
                      marginTop: "0.35rem",
                    }}
                  >
                    <span>
                      <strong>{form.fields?.length || 0}</strong>{" "}
                      {form.fields?.length === 1 ? "question" : "questions"}
                    </span>
                    <span>•</span>
                    <span>
                      {form.availability === "SCHEDULED" ? "Scheduled" : "Always Available"}
                    </span>
                    <span>•</span>
                    <span>Created {formatDate(form.createdAt)}</span>
                  </div>
                </div>

                {/* Status-specific Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {form.status === "DRAFT" && (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/forms/${form._id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/forms/${form._id}/builder`)}
                      >
                        Builder
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/forms/${form._id}`)}
                      >
                        View & Publish
                      </button>
                    </>
                  )}

                  {form.status === "PUBLISHED" && (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/responses/form/${form._id}`)}
                      >
                        Responses
                      </button>
                      {form.publicId && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCopyLink(form.publicId)}
                          title="Copy public link to clipboard"
                        >
                          {copiedId === form.publicId ? "✓ Copied" : "Copy Link"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/forms/${form._id}`)}
                      >
                        Manage
                      </button>
                    </>
                  )}

                  {form.status === "CLOSED" && (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/responses/form/${form._id}`)}
                      >
                        Responses
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/forms/${form._id}`)}
                      >
                        View & Resume
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyForms;