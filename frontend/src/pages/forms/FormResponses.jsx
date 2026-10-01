import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteAllResponses, deleteResponse, getFormResponses } from "../../services/response.service.js";
import { getFormById } from "../../services/form.service.js";

const FormResponses = () => {
  const navigate = useNavigate();
  const { formId } = useParams();

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadFormAndResponses = async () => {
      setLoading(true);
      setError("");
      try {
        const [formResult, responsesResult] = await Promise.all([getFormById(formId), getFormResponses(formId)]);
        setForm(formResult.data);
        setResponses(responsesResult.data);
      } catch (err) {
        setError(err?.error?.message || " Unable to load form and responses");
      } finally {
        setLoading(false);
      }
    }
    loadFormAndResponses();
  }, [formId]);

  const handleDeleteResponse = async (responseId) => {
    const confirmed = window.confirm("Are you sure want to delete this response?");
    if (!confirmed) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await deleteResponse(responseId);
      setResponses((previous) =>
        previous.filter((response) => response._id !== responseId));
    } catch (err) {
      console.log("Delete Response Error: ", err);

      setError(err?.error?.message || "Unable to delete");
    } finally {
      setDeleting(false);
    }
  }

  const handleDeleteAllResponses = async (formId) => {
    setDeleting(true);
    setError("");
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete ALL responses for this form?"
      );
      if (!confirmed) return;
      await deleteAllResponses(formId);
      setResponses([]);

    } catch (err) {
      setError(err?.error?.message || "Unable to delete responses");
    } finally {
      setDeleting(false);
    }

  }

  if (loading) {
    return <p>Loading responses.....</p>
  }
  if (error) {
    return <p>{error}</p>
  }
  if (!form) {
    return <p>Form not found.</p>
  }

  return (
    <div>

      <h1>{form.title} - Responses</h1>

      {responses.length === 0 ? <p>No responses recorded yet</p> : (
        <div>
          <button disabled={deleting} type="button" onClick={() => handleDeleteAllResponses(formId)}>{deleting ? "Deleting all responses..." : "Delete All Responses"}</button>


          <table>
            <thead>
              <tr>
                {form.fields.map((field) => (
                  <th key={field._id}>{field.label}</th>
                ))}
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response._id}>
                  {form.fields.map((field) => {
                    const answer = response.answers.find(
                      (answer) => answer.fieldId.toString() === field._id.toString()
                    );
                    return (
                      <td key={field._id}>
                        {Array.isArray(answer?.value) ? answer.value.join(",") : answer?.value ?? "-"}
                      </td>
                    )
                  })}
                  <td>{new Date(response.submittedAt).toLocaleString()}</td>
                  <td>
                    <button type="button"
                      onClick={() => navigate(`/responses/${response._id}/edit`)}>
                      Edit
                    </button>
                    <button type="button"
                      onClick={() => handleDeleteResponse(response._id)} disabled={deleting}
                    >{deleting ? "Deleting Response....." : "Delete"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      <button type="button" onClick={() => navigate(`/forms/${formId}`)}>Back</button>
    </div>
  )


};

export default FormResponses;