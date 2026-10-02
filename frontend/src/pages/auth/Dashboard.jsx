import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, editProfile, changePassword, deleteAccount } from "../../services/auth.service.js";
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

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

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    setChangingPassword(true);
    setPasswordError("");
    setPasswordMessage("");
    try {
      const result = await changePassword(passwordData);
      setPasswordMessage(result.message || "Password changed successfully.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (err) {
      setPasswordError(err?.error?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account and all associated forms and responses? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingAccount(true);
    setError("");
    try {
      await deleteAccount();
      setUser(null);
      navigate("/register");
    } catch (err) {
      setError(err?.error?.message || "Failed to delete account.");
      setDeletingAccount(false);
    }
  };

  const handleNavigation = () => {
    navigate("/forms/create");
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-actions">
          <button className="dashboard-btn" onClick={handleLogout}>{loggingOut ? "logging out......" : "Logout"}</button>
          <button className="dashboard-btn" onClick={handleNavigation}>Create Forms</button>
          <button className="dashboard-btn" onClick={handleMyforms}>My forms</button>
        </div>

        {loading && <p className="dashboard-status">Loading..........</p>}
        {message && <p className="dashboard-message dashboard-success">{message}</p>}
        {error && <p className="dashboard-message dashboard-error">{error}</p>}

        {user && (
          <div className="dashboard-section">
            <h2>Welcome, {user.name}</h2>
          </div>
        )}
        {user && (
          <div className="dashboard-section">
            <h2>Profile</h2>
            <p>
              <strong>Email: </strong> {user.email}
            </p>
            {
              !isEditing ? (<>
                <p><strong>Name: </strong>{user.name}</p>
                <button className="dashboard-btn dashboard-btn-secondary" onClick={handleEditClickButton}>Edit</button></>) : (<>
                  <label htmlFor="name">Name</label>
                  <input className="dashboard-input" id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} />

                  <div className="dashboard-btn-group">
                    <button className="dashboard-btn" onClick={handleEditProfile}
                      disabled={saving}>{saving ? "Saving changes...." : "Save Changes"}</button>
                    <button className="dashboard-btn dashboard-btn-secondary" onClick={handleCancelEdit}
                      disabled={saving}>Cancel</button>
                  </div>
                </>)
            }

          </div>
        )}

        {user && (
          <div className="dashboard-section">
            <h2>Change Password</h2>
            {passwordMessage && <p className="dashboard-message dashboard-success">{passwordMessage}</p>}
            {passwordError && <p className="dashboard-message dashboard-error">{passwordError}</p>}
            {!isChangingPassword ? (
              <button className="dashboard-btn dashboard-btn-secondary" type="button" onClick={() => setIsChangingPassword(true)}>
                Change Password
              </button>
            ) : (
              <form className="dashboard-form" onSubmit={handleChangePasswordSubmit}>
                <div>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    className="dashboard-input"
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    className="dashboard-input"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    className="dashboard-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                <div className="dashboard-btn-group">
                  <button className="dashboard-btn" type="submit" disabled={changingPassword}>
                    {changingPassword ? "Updating password..." : "Update Password"}
                  </button>
                  <button
                    className="dashboard-btn dashboard-btn-secondary"
                    type="button"
                    disabled={changingPassword}
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError("");
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {user && (
          <div className="dashboard-section dashboard-danger-zone">
            <h2>Delete Account</h2>
            <p>
              Permanently delete your account along with all your created forms and collected responses.
            </p>
            <button
              className="dashboard-btn dashboard-btn-danger"
              type="button"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Deleting account..." : "Delete Account"}
            </button>
          </div>
        )}

      </div>
    </div>
  );

};

export default Dashboard;