import { useState } from "react";
import { getCurrentUser, logoutUser } from "../../services/auth.service.js";
import "../../css/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getCurrentUser();
      setUser(result.data);
    } catch (err) {
      setError(err?.error?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }
  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await logoutUser();
      setMessage(result.message);
      setUser(null);

    } catch (err) {
      setError(err?.error?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  }

  return <>
    <div>
      <h1>Dashboard</h1>
      <button onClick={fetchCurrentUser}>Get Current User</button>

      {loading && <p>Loading..........</p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      {user && (
        <div> <h2>Welcome, {user.name}</h2>
          <p>EMail: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>

      )}

    </div>
  </>

};

export default Dashboard;