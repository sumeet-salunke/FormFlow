import { useState } from "react";
import { createForm } from "../../services/form.service.js";

const CreateForm = () => {

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const result = await createForm(formData);
      setMessage(result.message);
      setFormData({
        title: "",
        description: ""
      });
    } catch (err) {

      setError(err?.error?.message || "Unable to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return <>
    <div>
      <h1>Create Form</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" type="text" value={formData.title} placeholder="Title" onChange={handleChange} />

        <textarea name="description" value={formData.description} type="text" placeholder="Description" onChange={handleChange} />

        <button type="submit" disabled={loading}>{loading ? "Creating...." : "Create"}</button>

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
      </form>
    </div>
  </>


};

export default CreateForm;