import { useNavigate, useParams } from "react-router-dom";

const ResponseSubmitted = () => {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const handleSubmitAnother = () => {
    navigate(`/forms/public/${publicId}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "var(--bg-primary)",
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          padding: "3rem 2rem",
          borderTop: "5px solid var(--success)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--radius-full)",
            background: "var(--success-subtle)",
            color: "var(--success-fg)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            marginBottom: "1.25rem",
            border: "1px solid var(--success-border)",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize: "var(--font-2xl)",
            fontWeight: "800",
            margin: "0 0 0.5rem",
            color: "#ffffff",
          }}
        >
          Response Submitted!
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "var(--font-base)",
            margin: "0 0 2rem",
            lineHeight: 1.5,
          }}
        >
          Thank you. Your response has been recorded successfully.
        </p>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSubmitAnother}
          style={{ width: "100%", maxWidth: "240px", margin: "0 auto" }}
        >
          Submit Another Response
        </button>

        <div style={{ marginTop: "2.5rem", color: "var(--text-disabled)", fontSize: "var(--font-xs)" }}>
          Powered by <strong style={{ color: "var(--text-muted)" }}>FormFlow</strong>
        </div>
      </div>
    </div>
  );
};

export default ResponseSubmitted;