import { useState } from "react";
import { getCurrentUser } from "../../services/auth.service.js";
const Dashboard = () => {
  const [user, setUser] = useState(null);
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
  return <>
    <div>
      <h1>Dashboard</h1>
      <button onClick={fetchCurrentUser}>Get Current User</button>
      {loading && <p>Loading..........</p>}
      {error && <p>{error}</p>}

      {user && (
        <div> <h2>Welcome, {user.name}</h2>
          <p>EMail: {user.email}</p>
        </div>
      )}
    </div>
  </>

};

export default Dashboard;