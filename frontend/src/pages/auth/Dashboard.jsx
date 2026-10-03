import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  editProfile,
  changePassword,
  deleteAccount,
} from "../../services/auth.service.js";
import { getMyForms } from "../../services/form.service.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [formsCount, setFormsCount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const [userResult, formsResult] = await Promise.all([
          getCurrentUser(),
          getMyForms().catch(() => ({ data: [] })),
        ]);
        if (isMounted) {
          setUser(userResult.data);
          setName(userResult.data.name);
          setFormsCount(formsResult.data?.length ?? 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.error?.message || "Failed to load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditProfile = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const result = await editProfile({ name: name.trim() });
      setUser(result.data);
      setName(result.data.name);
      setIsEditing(false);
      setMessage(result.message || "Profile updated successfully.");
    } catch (err) {
      setError(err?.error?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
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
      navigate("/register");
    } catch (err) {
      setError(err?.error?.message || "Failed to delete account.");
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
        <div className="spinner" style={{ width: "24px", height: "24px", marginBottom: "1rem" }}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="page-subtitle">
            Manage your custom forms, review incoming responses, and configure your account.
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/forms")}
          >
            My Forms
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/forms/create")}
          >
            + Create Form
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Overview Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: "var(--font-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: "700" }}>
              Forms Created
            </span>
            <span style={{ fontSize: "1.4rem" }}>📋</span>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#ffffff", lineHeight: 1 }}>
            {formsCount !== null ? formsCount : 0}
          </div>
          <p style={{ margin: "0.6rem 0 1rem", fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
            {formsCount === 1 ? "1 active form in your account" : `${formsCount || 0} total forms in your workspace`}
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/forms")}
            style={{ width: "100%" }}
          >
            View All Forms →
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: "var(--font-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: "700" }}>
              Quick Action
            </span>
            <span style={{ fontSize: "1.4rem" }}>✨</span>
          </div>
          <div style={{ fontSize: "var(--font-lg)", fontWeight: "700", color: "#ffffff", marginBottom: "0.5rem" }}>
            New Form
          </div>
          <p style={{ margin: "0 0 1.25rem", fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
            Create questions, configure availability schedules, and publish to start collecting responses.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/forms/create")}
            style={{ width: "100%" }}
          >
            + Create New Form
          </button>
        </div>
      </div>

      {/* Account & Profile Settings */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Profile Information</h2>
              <p className="card-subtitle">Your display name and registered email address</p>
            </div>
            {!isEditing && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", display: "block" }}>Full Name</span>
                <span style={{ fontSize: "var(--font-base)", fontWeight: "600", color: "#ffffff" }}>{user?.name}</span>
              </div>
              <div>
                <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", display: "block" }}>Email Address</span>
                <span style={{ fontSize: "var(--font-base)", fontWeight: "600", color: "#ffffff" }}>{user?.email}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditProfile} style={{ maxWidth: "420px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Display Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? "Saving changes..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setName(user?.name || "");
                    setIsEditing(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security / Password Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Password & Security</h2>
              <p className="card-subtitle">Ensure your account is protected with a strong password</p>
            </div>
            {!isChangingPassword && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </button>
            )}
          </div>

          {passwordMessage && <div className="alert alert-success">{passwordMessage}</div>}
          {passwordError && <div className="alert alert-error">{passwordError}</div>}

          {isChangingPassword && (
            <form onSubmit={handleChangePasswordSubmit} style={{ maxWidth: "420px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter new password (min. 8 characters)"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={changingPassword}>
                  {changingPassword ? "Updating password..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
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

        {/* Danger Zone */}
        <div className="card card-danger">
          <div className="card-header">
            <div>
              <h2 className="card-title" style={{ color: "var(--danger-fg)" }}>
                Danger Zone
              </h2>
              <p className="card-subtitle">
                Permanently delete your account, created forms, and collected responses.
              </p>
            </div>
          </div>
          <p style={{ margin: "0 0 1.25rem", fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
            Once you delete your account, all data will be permanently removed from FormFlow servers. This action is irreversible.
          </p>
          <button
            type="button"
            className="btn btn-danger-outline btn-sm"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
          >
            {deletingAccount ? "Deleting account..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;