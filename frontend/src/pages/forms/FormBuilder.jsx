import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getFormById, updateForm } from "../../services/form.service.js";

const FormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await updateForm(formId, {
        fields,
      });
      setMessage(result.message || "Questions saved successfully.");
      navigate(`/forms/${formId}/edit`);
    } catch (err) {
      setError(err?.error?.message || "Unable to save questions.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadForm = async () => {
      try {
        const result = await getFormById(formId);
        if (isMounted) {
          setFormTitle(result?.data?.title || "");
          setFields(result?.data?.fields ?? []);
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

  const handleAddField = () => {
    const newField = {
      type: "SHORT_ANSWER",
      label: "",
      required: false,
      options: [],
    };

    setFields((previous) => [...previous, newField]);
  };

  const handleDeleteField = (fieldIndex) => {
    setFields((previous) =>
      previous.filter((_, index) => index !== fieldIndex)
    );
  };

  const handleFieldChange = (index, property, value) => {
    setFields((previous) =>
      previous.map((field, fieldIndex) => {
        if (fieldIndex === index) {
          const updated = {
            ...field,
            [property]: value,
          };
          // If changing to choice type and options is empty, add initial option
          if (
            property === "type" &&
            ["MULTIPLE_CHOICE", "CHECKBOXES", "DROPDOWN"].includes(value) &&
            (!updated.options || updated.options.length === 0)
          ) {
            updated.options = ["Option 1"];
          }
          return updated;
        }
        return field;
      })
    );
  };

  const handleAddOption = (fieldIndex) => {
    setFields((previous) =>
      previous.map((field, index) => {
        if (index === fieldIndex) {
          const currentOptions = field.options || [];
          return {
            ...field,
            options: [...currentOptions, `Option ${currentOptions.length + 1}`],
          };
        }
        return field;
      })
    );
  };

  const handleDeleteOption = (fieldIndex, optionIndex) => {
    setFields((previous) =>
      previous.map((field, index) => {
        if (index !== fieldIndex) {
          return field;
        }

        const updatedOptions = field.options.filter(
          (_, currentOptionIndex) => currentOptionIndex !== optionIndex
        );

        return {
          ...field,
          options: updatedOptions,
        };
      })
    );
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    setFields((previous) =>
      previous.map((field, index) => {
        if (index !== fieldIndex) {
          return field;
        }

        const updatedOptions = field.options.map(
          (option, currentOptionIndex) => {
            if (currentOptionIndex === optionIndex) {
              return value;
            }
            return option;
          }
        );

        return {
          ...field,
          options: updatedOptions,
        };
      })
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
        <div className="spinner" style={{ width: "24px", height: "24px", marginBottom: "1rem" }}></div>
        <p>Loading questions builder...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/forms">My Forms</Link>
        <span className="breadcrumbs-separator">/</span>
        <Link to={`/forms/${formId}`}>{formTitle || "Form"}</Link>
        <span className="breadcrumbs-separator">/</span>
        <span>Question Builder</span>
      </div>

      {/* Header with Title and Actions */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h1 className="page-title">Question Builder</h1>
            <span className="badge badge-neutral">
              {fields.length} {fields.length === 1 ? "question" : "questions"}
            </span>
          </div>
          <p className="page-subtitle">
            Add questions, customize input types, and configure response options for {formTitle || "your form"}
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddField}
          >
            + Add Question
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Questions"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">➕</span>
          <h2 className="empty-state-title">No questions yet</h2>
          <p className="empty-state-desc">
            Forms need at least one question before they can be published. Click the button below to add your first field.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddField}
          >
            + Add First Question
          </button>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {fields.map((field, index) => (
          <div
            key={index}
            className="card"
            style={{
              borderLeft: "4px solid var(--primary)",
              position: "relative",
            }}
          >
            {/* Question Card Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--border-subtle)",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "var(--primary-subtle)",
                    color: "var(--primary-fg)",
                    fontSize: "var(--font-xs)",
                    fontWeight: "800",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  Q{index + 1}
                </span>

                {/* Field Type Select */}
                <select
                  value={field.type}
                  className="form-select"
                  style={{ width: "auto", minWidth: "160px", padding: "0.45rem 0.75rem", fontSize: "var(--font-xs)" }}
                  onChange={(event) =>
                    handleFieldChange(index, "type", event.target.value)
                  }
                >
                  <option value="SHORT_ANSWER">Short Answer</option>
                  <option value="PARAGRAPH">Paragraph Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="EMAIL">Email Address</option>
                  <option value="DATE">Date Picker</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice (Radio)</option>
                  <option value="CHECKBOXES">Checkboxes (Multi-select)</option>
                  <option value="DROPDOWN">Dropdown Menu</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* Required Toggle */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "var(--font-xs)",
                    color: field.required ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(event) =>
                      handleFieldChange(index, "required", event.target.checked)
                    }
                    style={{ accentColor: "var(--primary)", width: "15px", height: "15px" }}
                  />
                  <span>Required</span>
                </label>

                {/* Delete Question */}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--danger-fg)" }}
                  onClick={() => handleDeleteField(index)}
                  title="Delete question"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Question Label Input */}
            <div className="form-group">
              <label className="form-label" htmlFor={`question-label-${index}`}>
                Question Title / Prompt
                {field.required && <span className="form-required-star">*</span>}
              </label>
              <input
                id={`question-label-${index}`}
                type="text"
                className="form-input"
                style={{ fontSize: "var(--font-base)", fontWeight: "500" }}
                value={field.label}
                placeholder="e.g., What is your primary feedback?..."
                onChange={(event) =>
                  handleFieldChange(index, "label", event.target.value)
                }
              />
            </div>

            {/* Options Management for Choice Types */}
            {["MULTIPLE_CHOICE", "CHECKBOXES", "DROPDOWN"].includes(
              field.type
            ) && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.15rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "var(--font-xs)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                    Options ({field.options?.length || 0})
                  </span>
                  <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
                    {field.type === "MULTIPLE_CHOICE" && "Respondents pick one"}
                    {field.type === "CHECKBOXES" && "Respondents can pick multiple"}
                    {field.type === "DROPDOWN" && "Single select dropdown"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(field.options || []).map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                          width: "20px",
                          textAlign: "center",
                        }}
                      >
                        {field.type === "CHECKBOXES" ? "☐" : "○"}
                      </span>

                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: "0.45rem 0.75rem", fontSize: "var(--font-sm)" }}
                        value={option}
                        placeholder={`Option ${optionIndex + 1}`}
                        onChange={(event) =>
                          handleOptionChange(
                            index,
                            optionIndex,
                            event.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "0.35rem 0.55rem", color: "var(--text-muted)" }}
                        onClick={() => handleDeleteOption(index, optionIndex)}
                        title="Remove option"
                        disabled={field.options.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: "0.75rem", color: "var(--primary)" }}
                  onClick={() => handleAddOption(index)}
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Sticky-style Actions Bar */}
      {fields.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddField}
          >
            + Add Another Question
          </button>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(`/forms/${formId}/edit`)}
            >
              Back to Settings
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Questions"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
