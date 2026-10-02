import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFormById, updateForm } from "../../services/form.service.js";


const FormBuilder = () => {
  const { formId } = useParams();

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await updateForm(formId, {
        fields
      });
      setMessage(result.message);
      navigate(`/forms/${formId}/edit`);
    } catch (err) {
      setError(err?.error?.message || "Unable to save questions.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const loadForm = async () => {
      try {
        const result = await getFormById(formId);
        setFields(result?.data?.fields ?? []);
      } catch (err) {
        setError(err?.error?.message || "Unable to load form.");
      }
      finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [formId]);

  const handleAddField = () => {
    const newField = {
      type: "SHORT_ANSWER",
      label: "",
      required: false,
      options: [],
    };

    setFields((previous) => [
      ...previous,
      newField,
    ]);
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
          return {
            ...field,
            [property]: value,
          };
        }

        return field;
      })
    );
  };

  const handleAddOption = (fieldIndex) => {
    setFields((previous) =>
      previous.map((field, index) => {
        if (index === fieldIndex) {
          return {
            ...field,
            options: [...field.options, ""],
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
          (_, currentOptionIndex) =>
            currentOptionIndex !== optionIndex
        );

        return {
          ...field,
          options: updatedOptions,
        };
      })
    );
  };

  const handleOptionChange = (
    fieldIndex,
    optionIndex,
    value
  ) => {
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
    return <p>Loading form builder...</p>
  }
  if (error) {
    return <p>{error}</p>
  }


  return (
    <div>
      <h1>Form Builder</h1>

      <button
        type="button"
        onClick={handleAddField}
      >
        + Add Question
      </button>
      <button type="button" onClick={handleSave} disabled={saving}>{saving ? "Saving..."
        : "Save Questions"}</button>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {fields.map((field, index) => (
        <div key={index}>
          <h3>Question {index + 1}</h3>

          <input
            type="text"
            value={field.label}
            placeholder="Question"
            onChange={(event) =>
              handleFieldChange(
                index,
                "label",
                event.target.value
              )
            }
          />

          <select
            value={field.type}
            onChange={(event) =>
              handleFieldChange(
                index,
                "type",
                event.target.value
              )
            }
          >
            <option value="SHORT_ANSWER">
              Short Answer
            </option>

            <option value="PARAGRAPH">
              Paragraph
            </option>

            <option value="NUMBER">
              Number
            </option>

            <option value="EMAIL">
              Email
            </option>

            <option value="DATE">
              Date
            </option>

            <option value="MULTIPLE_CHOICE">
              Multiple Choice
            </option>

            <option value="CHECKBOXES">
              Checkboxes
            </option>

            <option value="DROPDOWN">
              Dropdown
            </option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(event) =>
                handleFieldChange(
                  index,
                  "required",
                  event.target.checked
                )
              }
            />

            Required
          </label>

          <button
            type="button"
            onClick={() => handleDeleteField(index)}
          >
            Delete Question
          </button>

          {[
            "MULTIPLE_CHOICE",
            "CHECKBOXES",
            "DROPDOWN",
          ].includes(field.type) && (
              <div>
                <h4>Options</h4>

                {field.options.map(
                  (option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="text"
                        value={option}
                        placeholder={`Option ${optionIndex + 1
                          }`}
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
                        onClick={() =>
                          handleDeleteOption(
                            index,
                            optionIndex
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )
                )}

                <button
                  type="button"
                  onClick={() => handleAddOption(index)}
                >
                  + Add Option
                </button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default FormBuilder;

