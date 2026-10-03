import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicForm } from "../../services/publicForm.service.js";
import { submitResponse } from "../../services/response.service.js";

const PublicForm = () => {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleAnswerChange = (fieldId, value) => {
    setAnswers((previous) => ({
      ...previous,
      [fieldId]: value,
    }));
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setAnswers((previous) => {
      const currentAnswers = previous[fieldId] || [];
      if (checked) {
        return {
          ...previous,
          [fieldId]: [...currentAnswers, option],
        };
      }
      return {
        ...previous,
        [fieldId]: currentAnswers.filter(
          (currentOption) => currentOption !== option
        ),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const submissionAnswers = { ...answers };
      Object.keys(submissionAnswers).forEach((fieldId) => {
        if (submissionAnswers[fieldId] === "") {
          delete submissionAnswers[fieldId];
        }
      });
      await submitResponse(publicId, submissionAnswers);
      navigate(`/forms/public/${publicId}/submitted`);
    } catch (err) {
      setSubmitError(err?.error?.message || "Unable to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadPublicForm = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getPublicForm(publicId);
        if (isMounted) {
          setForm(result.data);
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
    loadPublicForm();
    return () => {
      isMounted = false;
    };
  }, [publicId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", color: "var(--text-muted)" }}>
        <div className="spinner" style={{ width: "28px", height: "28px", marginBottom: "1rem" }}></div>
        <p>Loading form...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "var(--bg-primary)" }}>
        <div className="card" style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "2.5rem 1.5rem" }}>
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>🔒</span>
          <h1 style={{ fontSize: "var(--font-xl)", fontWeight: "700", margin: "0 0 0.5rem" }}>
            Form Unavailable
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--font-sm)", margin: "0 0 1.5rem" }}>
            {error || "This form is no longer accepting responses or the link may be invalid."}
          </p>
          <span style={{ fontSize: "var(--font-xs)", color: "var(--text-disabled)" }}>
            Powered by FormFlow
          </span>
        </div>
      </div>
    );
  }

  const hasRequiredFields = form.fields?.some((f) => f.required);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "2.5rem 1.25rem 4rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Form Header Card */}
        <div
          className="card"
          style={{
            borderTop: "5px solid var(--primary)",
            marginBottom: "1.25rem",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "var(--font-3xl)",
              fontWeight: "800",
              margin: "0 0 0.75rem",
              color: "#ffffff",
              letterSpacing: "-0.025em",
            }}
          >
            {form.title}
          </h1>

          {form.description && (
            <p
              style={{
                fontSize: "var(--font-base)",
                color: "var(--text-secondary)",
                margin: "0 0 1rem",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
              }}
            >
              {form.description}
            </p>
          )}

          {hasRequiredFields && (
            <div
              style={{
                fontSize: "var(--font-xs)",
                color: "var(--danger-fg)",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              * Indicates required question
            </div>
          )}
        </div>

        {submitError && (
          <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
            {submitError}
          </div>
        )}

        {/* Questions Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {form.fields?.map((field, index) => (
            <div key={field._id || index} className="card">
              <label
                className="form-label"
                htmlFor={`field-${field._id}`}
                style={{
                  fontSize: "var(--font-base)",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "0.85rem",
                  display: "block",
                }}
              >
                <span>{field.label}</span>
                {field.required && (
                  <span className="form-required-star" title="Required">*</span>
                )}
              </label>

              {/* SHORT_ANSWER */}
              {field.type === "SHORT_ANSWER" && (
                <input
                  id={`field-${field._id}`}
                  type="text"
                  name={field._id}
                  className="form-input"
                  required={field.required}
                  value={answers[field._id] || ""}
                  placeholder="Your answer"
                  onChange={(event) =>
                    handleAnswerChange(field._id, event.target.value)
                  }
                />
              )}

              {/* PARAGRAPH */}
              {field.type === "PARAGRAPH" && (
                <textarea
                  id={`field-${field._id}`}
                  name={field._id}
                  className="form-textarea"
                  rows={4}
                  required={field.required}
                  value={answers[field._id] || ""}
                  placeholder="Your answer"
                  onChange={(event) =>
                    handleAnswerChange(field._id, event.target.value)
                  }
                />
              )}

              {/* NUMBER */}
              {field.type === "NUMBER" && (
                <input
                  id={`field-${field._id}`}
                  type="number"
                  name={field._id}
                  className="form-input"
                  required={field.required}
                  value={
                    answers[field._id] !== undefined &&
                    answers[field._id] !== null
                      ? answers[field._id]
                      : ""
                  }
                  placeholder="Enter a number"
                  onChange={(event) =>
                    handleAnswerChange(
                      field._id,
                      event.target.value === "" ? "" : Number(event.target.value)
                    )
                  }
                />
              )}

              {/* EMAIL */}
              {field.type === "EMAIL" && (
                <input
                  id={`field-${field._id}`}
                  type="email"
                  name={field._id}
                  className="form-input"
                  required={field.required}
                  value={answers[field._id] || ""}
                  placeholder="name@example.com"
                  onChange={(event) =>
                    handleAnswerChange(field._id, event.target.value)
                  }
                />
              )}

              {/* DATE */}
              {field.type === "DATE" && (
                <input
                  id={`field-${field._id}`}
                  type="date"
                  name={field._id}
                  className="form-input"
                  required={field.required}
                  value={answers[field._id] || ""}
                  onChange={(event) =>
                    handleAnswerChange(field._id, event.target.value)
                  }
                />
              )}

              {/* MULTIPLE_CHOICE (Radio) */}
              {field.type === "MULTIPLE_CHOICE" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {field.options?.map((option, optIdx) => (
                    <label key={optIdx} className="form-check">
                      <input
                        type="radio"
                        name={field._id}
                        className="form-check-input"
                        value={option}
                        required={field.required && !answers[field._id]}
                        checked={answers[field._id] === option}
                        onChange={(event) =>
                          handleAnswerChange(field._id, event.target.value)
                        }
                      />
                      <span className="form-check-label">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* CHECKBOXES (Multi-select) */}
              {field.type === "CHECKBOXES" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {field.options?.map((option, optIdx) => (
                    <label key={optIdx} className="form-check">
                      <input
                        type="checkbox"
                        name={field._id}
                        className="form-check-input"
                        value={option}
                        checked={(answers[field._id] || []).includes(option)}
                        onChange={(event) =>
                          handleCheckboxChange(
                            field._id,
                            option,
                            event.target.checked
                          )
                        }
                      />
                      <span className="form-check-label">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* DROPDOWN */}
              {field.type === "DROPDOWN" && (
                <select
                  id={`field-${field._id}`}
                  name={field._id}
                  className="form-select"
                  required={field.required}
                  value={answers[field._id] || ""}
                  onChange={(event) =>
                    handleAnswerChange(field._id, event.target.value)
                  }
                >
                  <option value="" disabled>
                    Choose an option...
                  </option>
                  {field.options?.map((option, optIdx) => (
                    <option key={optIdx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {/* Submission Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "0.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ minWidth: "160px" }}
            >
              {submitting ? "Submitting response..." : "Submit Response"}
            </button>

            <span style={{ fontSize: "var(--font-xs)", color: "var(--text-disabled)" }}>
              Never submit passwords through FormFlow.
            </span>
          </div>
        </form>

        {/* Footer Brand */}
        <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--text-disabled)", fontSize: "var(--font-xs)" }}>
          <span>Powered by </span>
          <strong style={{ color: "var(--text-muted)" }}>FormFlow</strong>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;