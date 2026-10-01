import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        const responseDate = responseResult.data;
        setResponse(responseDate);
        const formResult = await getFormById(responseDate.formId);
        setForm(formResult.data);
        const answerMap = {};
        responseDate.answers.forEach((answer) => {
          answerMap[answer.fieldId] = answer.value;
        });
        setAnswers(answerMap);
      } catch (err) {
        setError(err?.error?.message || "Unable to load response.");
      } finally {
        setLoading(false);
      }
    }
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
      setError(err?.error?.message || "Unable to save.")
    } finally {
      setSaving(false);
    }
  }

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
          [fieldId]: [...currentAnwers, option]
        }
      }
      return {
        ...previous,
        [fieldId]: currentAnwers.filter(
          (currentOption) => currentOption !== option,
        ),
      };
    });
  };


  if (loading) {
    return <p>Loading response....</p>
  }
  if (error) {
    return <p>{error}</p>
  }
  if (!form || !response) {
    return <p>Response not found.</p>
  }
  return (
    <div>
      <h1>Edit Response</h1>
      <h2>{form.title}</h2>

      <form onSubmit={handleSave}>
        {form.fields.map((field) => (
          <div key={field._id}>
            <label>
              {field.label}
              {field.required && "*"}
            </label>
            {field.type === "SHORT_ANSWER" && (
              <input type="text"
                value={answers[field._id] || ""}
                onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
            )}

            {field.type === "PARAGRAPH" && (
              <textarea value={answers[field._id] || ""}
                onChange={(event) => {
                  handleAnswerChange(field._id, event.target.value)
                }} />
            )}

            {field.type === "NUMBER" && (
              <input type="number" value={answers[field._id] || ""}
                onChange={(event) => handleAnswerChange(field._id, event.target.value === "" ? "" : Number(event.target.value))} />
            )}

            {field.type === "EMAIL" && (
              <input type="email"
                value={answers[field._id] || ""}
                onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
            )}
            {field.type === "DATE" && (
              <input type="date"
                value={answers[field._id] || ""}
                onChange={(event) => handleAnswerChange(field._id, event.target.value)} />
            )}
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
                    <input
                      type="checkbox"
                      name={field._id}
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
                    {option}
                  </label>
                ))}
              </div>
            )}


            {field.type === "DROPDOWN" && (
              <select
                value={answers[field._id] || ""}
                onChange={(event) =>
                  handleAnswerChange(
                    field._id,
                    event.target.value
                  )
                }
              >
                <option value="" disabled>
                  Select an option
                </option>

                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}


          </div>
        ))}
        <button type="submit" disabled={saving}>{saving ? "Saving....." : "Save Changes"}</button>
      </form>

      <button type="button" onClick={() => navigate(`/responses/form/${form._id}`)}>Back</button>
    </div>
  )
};

export default EditResponse;