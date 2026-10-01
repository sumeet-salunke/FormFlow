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
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleAnswerChange = (fieldId, value) => {
    setAnswers((previous) => ({
      ...previous,
      [fieldId]: value,
    }));

  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setAnswers((previous) => {
      const currentAnwers = previous[fieldId] || [];
      if (checked) {
        return {
          ...previous,
          [fieldId]: [...currentAnwers, option],
        };
      }
      return {
        ...previous,
        [fieldId]: currentAnwers.filter(
          (currentOption) => currentOption !== option
        ),
      };
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");
    try {

      const result = await submitResponse(publicId, answers);
      navigate(`/forms/public/${publicId}/submitted`);
      setSubmitMessage(result.message);
    } catch (err) {
      setSubmitError(err?.error?.message || "Unable to submit response.");
    } finally {
      setSubmitting(false);
    }

  }

  useEffect(() => {
    const loadPublicForm = async () => {
      try {
        const result = await getPublicForm(publicId);
        setForm(result.data);

      } catch (err) {
        setError(err?.error?.message || "Unable to load form.");

      } finally {
        setLoading(false);
      }
    }
    loadPublicForm();
  }, [publicId]);
  if (loading) {
    return <p>Loading form....</p>
  }
  if (error) {
    return <p>{error}</p>
  }
  if (!form) {
    return <p>Form not found.</p>
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>{form.title}</h1>
        {form.description && (
          <p>{form.description}</p>

        )}
        <div>
          {
            form.fields.map((field) => (
              <div key={field._id}>
                <label>
                  {field.label}
                  {field.required && "*"}
                </label>

                {field.type === "SHORT_ANSWER" && (
                  <input type="text"
                    name={field._id}
                    required={field.required}
                    value={answers[field._id] || ""}
                    onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
                )}

                {field.type === "PARAGRAPH" && (
                  <textarea name={field._id} required={field.required}
                    value={answers[field._id] || ""}
                    onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
                )}

                {field.type === "NUMBER" && (
                  <input type="number" name={field._id} required={field.required}
                    value={answers[field._id] || ""}
                    onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
                )}

                {field.type === "EMAIL" && (
                  <input type="email" name={field._id} required={field.required}
                    value={answers[field._id] || ""}
                    onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
                )}

                {
                  field.type === "DATE" && (
                    <input
                      type="date"
                      name={field._id}
                      required={form.required}
                      value={answers[field._id] || ""}
                      onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
                  )
                }

                {field.type === "MULTIPLE_CHOICE" && (
                  <div>
                    {field.options.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name={field._id}
                          value={option}
                          checked={answers[field._id] === option}
                          onChange={(event) => handleAnswerChange(field._id, event.target.value)}

                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "CHECKBOXES" && (
                  <div>
                    {field.options.map((option) => (
                      <label key={option}>
                        <input type="checkbox"
                          name={field._id}
                          value={option}
                          checked={(answers[field._id] || []).includes(option)}
                          onChange={(event) =>
                            handleCheckboxChange(field._id, option, event.target.checked)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "DROPDOWN" && (
                  <div>
                    <select name={field._id}
                      required={field.required}
                      value={answers[field._id] || ""}
                      onChange={(event) => handleAnswerChange(field._id, event.target.value)}
                    >
                      <option value="" disabled>Select an option

                      </option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))
          }
        </div>
        {submitMessage && <p>{submitMessage}</p>}
        {submitError && <p>{submitError}</p>}
        <button type="submit" disabled={submitting}>{submitting ? "Submitting......." : "Submit Response"}</button>
      </form>
    </div>
  )
}

export default PublicForm;