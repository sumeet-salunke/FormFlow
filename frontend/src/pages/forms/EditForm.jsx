import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateForm, getFormById } from "../../services/form.service.js";

const EditForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    availability: "ALWAYS",
    startDate: "",
    endDate: "",
    fields: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //fetch the existing form when the page loads.
  useEffect(() => {
    const loadForm = async () => {
      try {
        const result = await getFormById(formId);
        const form = result.data;
        setFormData({
          title: form.title,
          description: form.description,
          availability: form.availability,
          startDate: form.startDate ? form.startDate.slice(0, 16) : "",
          endDate: form.endDate ? form.endDate.slice(0, 16) : "",
          fields: form.fields ?? [],
        });
      } catch (err) {
        setError(err?.error?.message || "Unable to load form");
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [formId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    setMessage("");
    try {
      const result = await updateForm(formId, formData);
      setMessage(result.message);
      navigate(`/forms/${formId}`);
    } catch (err) {
      setError(err?.error?.message || "Unable to update form");
    }
    finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <p>Loading form....</p>
  }
  return (
    <div>
      <header>
        <h1>Edit form</h1>
        <button type="button"
          onClick={() => navigate(`/forms/${formId}/builder`)}
        >Build Questions</button>
      </header>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSave}>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="availability">Avaliability</label>
          <select
            id="availability" name="availability" value={formData.availability} onChange={handleChange} >
            <option value="ALWAYS">Always</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
          {formData.availability === "SCHEDULED" && (
            <div>
              <div>
                <label htmlFor="startDate">
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="endDate">
                  End Date
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>
        <button type="submit" disabled={saving}>{saving ? "Saving....." : "Save Changes"}</button>
        <button type="button" onClick={() => navigate("/forms")}>Cancel</button>
      </form>
    </div>
  )

}

export default EditForm;