import { useNavigate, useParams } from "react-router-dom";

const ResponseSubmitted = () => {
  const navigate = useNavigate();
  const { publicId } = useParams();
  const handleSubmitAnother = () => {
    navigate(`/forms/public/${publicId}`);
  }
  return (
    <div>
      <h1>Response submitted</h1>

      <p>
        Your response has been submitted successfully.
      </p>

      <button type="button" onClick={handleSubmitAnother}>
        Submit another response
      </button>
    </div>
  )

}
export default ResponseSubmitted;