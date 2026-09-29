import { useState, useEffect } from "react";
import { getMyForms } from "../../services/form.service.js";
import { useNavigate } from "react-router-dom";



const MyForms = () => {
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetForms = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyForms();
      setForms(result?.data ?? []);
    } catch (err) {
      setError(err?.error?.message || "Unable to get forms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetForms();
  }, []);

  const handleCreateForm = () => {
    navigate("/forms/create");
  }
  return (
    <div>
      <header>
        <h1>My Forms</h1>

        <button type="button" onClick={handleCreateForm}>+ Create Form</button>

      </header>

      <main>
        {loading && <p>Loading......</p>}

        {error && <p>{error}</p>}

        {!loading && !error && forms.length == 0 && (
          <div>
            <p>You haven't created any forms yet.</p>
            <button type="button" onClick={handleCreateForm}>Create Your First Form</button>
          </div>
        )}
        {!loading && !error && forms.length > 0 && (
          <div>
            {forms.map((form) => (
              <div key={form._id}>
                <h2>{form.title}</h2>

                {form.description && (
                  <p>{form.description}</p>
                )}

                <p>Status: {form.status}</p>

                <p>
                  Availability: {form.availability}
                </p>

                <p>
                  Fields: {form.fields?.length || 0}
                </p>

                <p>
                  Created:{" "}
                  {new Date(form.createdAt).toLocaleDateString()}
                </p>

                <button type="button" onClick={() => navigate(`/forms/${form._id}`)}>
                  View
                </button>

                <button type="button" onClick={() => navigate(`/forms/${form._id}/edit`)}>
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
export default MyForms;