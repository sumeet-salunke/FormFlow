import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFormById, updateFormStatus } from "../../services/form.service.js";

const ViewForm = () => {

  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFrom = async () => {
      try {
        const result = await getFormById(formId);
        setForm(result.data);
      } catch (err) {
        setError(err?.error?.message || "Unable to load form.");
      } finally {
        setLoading(false);
      }
    };
    loadFrom();
  }, [formId]);

  const handleFormStatusChange = async () => {
    setError("");
    const newStatus = form.status === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    try {
      const result = await updateFormStatus(formId, newStatus);
      setForm(result.data);
      navigate("/forms");

    } catch (err) {
      setError(err?.error?.message || "Unable to change status.")
    }
  }

  if (loading) {
    return <p>Loading form....</p>
  }
  if (error) {
    return <p>{error}</p>
  }
  return (
    <div>
      <header>
        <h1>{form.title}</h1>
        {form.description && <p>{form.description}</p>}

        <p>Status: {form.status}</p>

        <p>Availability: {form.availability}</p>

        <button type="button" onClick={() => navigate(`/forms/${formId}/edit`)}>Edit</button>

        <button type="button" onClick={() => navigate("/forms")}>Back to My forms</button>

        <button type="button" onClick={() => navigate(`/responses/form/${formId}`)}>Responses</button>

        {form.status === "PUBLISHED" && (
          <button onClick={handleFormStatusChange}>Halt Form</button>
        )}

        {form.status === "CLOSED" && (
          <button onClick={handleFormStatusChange}>Resume Form</button>
        )}

      </header>
      <main>
        <h2>
          Questions
        </h2>
        {form.fields?.length === 0 && (
          <p>No question have been added yet.</p>
        )}
        {form.fields?.map((field, index) => (
          <div key={field._id}>
            <p><strong>{index + 1}. {field.label}</strong></p>
            <p>Type: {field.type}</p>
            <p>{field.required ? "Required" : "Optional"}</p>
            {field.options?.length > 0 && (
              <ul>
                {field.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}

export default ViewForm;