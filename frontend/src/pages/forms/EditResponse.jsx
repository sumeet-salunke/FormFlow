import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { getResponse, updateResponse } from "../../services/response.service";
import { getFormById } from "../../services/form.service";

const EditResponse = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [response, setResponse] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadResponse = async () => {
      setLoading(true);
      setError("");
      try {
        const responseResult = await getResponse(responseId);
        const responseData = responseResult.data;
        setResponse(responseData);
        const formResult = await getFormById(responseData.formId);
        setForm(formResult.data);
        const answerMap = {};
        responseData.answers.forEach((answer) => {
          answerMap[answer.fieldId] = answer.value;
        });
        setAnswers(answerMap);
      } catch (err) {
        setError(err?.error?.message || "Unable to load response.");
      } finally {
        setLoading(false);
      }
    };
    loadResponse();
  }, [responseId]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await updateResponse(responseId, answers);
      setMessage(result.message);
      navigate(`/responses/form/${form._id}`);
    } catch (err) {
      setError(err?.error?.message || "Unable to save.");
    } finally {
      setSaving(false);
    }
  };

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
        [fieldId]: currentAnswers.filter((currentOption) => currentOption !== option),
      };
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <div className="spinner" style={{ width: "32px", height: "32px", marginBottom: "1rem" }}></div>
        <p style={{ color: "var(--text-muted)" }}>Loading response details...</p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div style={{ maxWidth: "600px", margin: "3rem auto" }}>
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {error}
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  if (!form || !response) {
    return (
      <div style={{ maxWidth: "600px", margin: "3rem auto" }}>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h2 className="empty-state-title">Response not found</h2>
          <p className="empty-state-desc">The requested submission could not be located or may have been deleted.</p>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumbs">
        <Link to="/forms" className="breadcrumb-item">My Forms</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/forms/${form._id}`} className="breadcrumb-item">{form.title}</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/responses/form/${form._id}`} className="breadcrumb-item">Responses</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Edit Submission</span>
      </div>

      <div className="page-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1 className="page-title">Edit Response</h1>
          <p className="page-description">
            Update submission values for <strong>{form.title}</strong>
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/responses/form/${form._id}`)}
          >
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
          {form.fields.map((field, index) => {
            const fieldId = field._id;
            const isRequired = field.required;
            const currentValue = answers[fieldId];

            return (
              <div key={fieldId} className="card" style={{ padding: "1.35rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.85rem" }}>
                  <label htmlFor={`field-${fieldId}`} className="form-label" style={{ margin: 0, fontWeight: 600, fontSize: "var(--font-base)", color: "var(--text-primary)" }}>
                    <span style={{ color: "var(--primary-light)", marginRight: "0.5rem", fontWeight: 700 }}>
                      Q{index + 1}.
                    </span>
                    {field.label}
                    {isRequired && <span style={{ color: "var(--danger)", marginLeft: "0.35rem" }}>*</span>}
                  </label>
                  <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>
                    {field.type.replace("_", " ")}
                  </span>
                </div>

                {field.type === "SHORT_ANSWER" && (
                  <input
                    id={`field-${fieldId}`}
                    type="text"
                    className="form-input"
                    value={currentValue || ""}
                    onChange={(event) => handleAnswerChange(fieldId, event.target.value)}
                    required={isRequired}
                    placeholder="Enter answer..."
                  />
                )}

                {field.type === "PARAGRAPH" && (
                  <textarea
                    id={`field-${fieldId}`}
                    className="form-textarea"
                    rows={4}
                    value={currentValue || ""}
                    onChange={(event) => handleAnswerChange(fieldId, event.target.value)}
                    required={isRequired}
                    placeholder="Enter detailed answer..."
                  />
                )}

                {field.type === "NUMBER" && (
                  <input
                    id={`field-${fieldId}`}
                    type="number"
                    className="form-input"
                    value={currentValue === undefined || currentValue === null ? "" : currentValue}
                    onChange={(event) =>
                      handleAnswerChange(
                        fieldId,
                        event.target.value === "" ? "" : Number(event.target.value)
                      )
                    }
                    required={isRequired}
                    placeholder="e.g. 42"
                  />
                )}

                {field.type === "EMAIL" && (
                  <input
                    id={`field-${fieldId}`}
                    type="email"
                    className="form-input"
                    value={currentValue || ""}
                    onChange={(event) => handleAnswerChange(fieldId, event.target.value)}
                    required={isRequired}
                    placeholder="name@example.com"
                  />
                )}

                {field.type === "DATE" && (
                  <input
                    id={`field-${fieldId}`}
                    type="date"
                    className="form-input"
                    value={currentValue || ""}
                    onChange={(event) => handleAnswerChange(fieldId, event.target.value)}
                    required={isRequired}
                  />
                )}

                {field.type === "MULTIPLE_CHOICE" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {field.options && field.options.map((option) => (
                      <label
                        key={option}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.65rem",
                          padding: "0.6rem 0.85rem",
                          background: "var(--bg-input)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                          fontSize: "var(--font-sm)",
                          transition: "border-color 0.15s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name={`field-${fieldId}`}
                          value={option}
                          checked={currentValue === option}
                          onChange={(event) => handleAnswerChange(fieldId, event.target.value)}
                          required={isRequired && !currentValue}
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "CHECKBOXES" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {field.options && field.options.map((option) => {
                      const isChecked = (currentValue || []).includes(option);
                      return (
                        <label
                          key={option}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            padding: "0.6rem 0.85rem",
                            background: "var(--bg-input)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                            fontSize: "var(--font-sm)",
                          }}
                        >
                          <input
                            type="checkbox"
                            value={option}
                            checked={isChecked}
                            onChange={(event) =>
                              handleCheckboxChange(fieldId, option, event.target.checked)
                            }
                            style={{ accentColor: "var(--primary)" }}
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {field.type === "DROPDOWN" && (
                  <select
                    id={`field-${fieldId}`}
                    className="form-select"
                    value={currentValue || ""}
                    onChange={(event) => handleAnswerChange(fieldId, event.target.value)}
                    required={isRequired}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {field.options && field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/responses/form/${form._id}`)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ minWidth: "140px" }}
          >
            {saving ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResponse;