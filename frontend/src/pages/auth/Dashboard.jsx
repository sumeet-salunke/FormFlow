import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, editProfile } from "../../services/auth.service.js";
import "../../css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getCurrentUser();
      setUser(result.data);
      setName(result.data.name);
    } catch (err) {
      setError(err?.error?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleMyforms = () => {
    navigate("/forms")
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");
    try {
      const result = await logoutUser();
      setMessage(result.message);
      setUser(null);
      navigate("/login");


    } catch (err) {
      setError(err?.error?.message || "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  }
  const handleEditProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const result = await editProfile({ name });
      setUser(result.data);
      setName(result.data.name);
      setIsEditing(false);
      setMessage(result.message);
    } catch (err) {
      setError(err?.error?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }
  const handleEditClickButton = () => {
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleCancelEdit = () => {
    setName(user.name);
    setIsEditing(false);
    setMessage("");
    setError("");
  };
  const handleNavigation = () => {
    navigate("/forms/create");
  }
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return <>
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>{loggingOut ? "logging out......" : "Logout"}</button>

      <button onClick={handleNavigation}>Create Forms</button>

      <button onClick={handleMyforms}>My forms</button>


      {loading && <p>Loading..........</p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      {user && (
        <div> <h2>Welcome, {user.name}</h2>
        </div>
      )}
      {user && (
        <div>
          <h2>Profile</h2>
          <p>
            <strong>Email: </strong> {user.email}
          </p>
          {
            !isEditing ? (<>
              <p><strong>Name: </strong>{user.name}</p>
              <button onClick={handleEditClickButton}>Edit</button></>) : (<>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} />

                <button onClick={handleEditProfile}
                  disabled={saving}>{saving ? "Saving changes...." : "Save Changes"}</button>
                <button onClick={handleCancelEdit}
                  disabled={saving}>Cancel</button>

              </>)
          }

        </div>
      )}

    </div>
  </>

};

export default Dashboard;