import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/auth.service.js";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        if (isMounted) {
          setUser(result?.data || null);
        }
      } catch {
        // ProtectedRoute handles redirection if unauthenticated
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUser();
      navigate("/login");
    } catch {
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="app-shell">
      <header className="app-navbar">
        <div className="navbar-container">
          <div className="navbar-brand-group">
            <NavLink to="/dashboard" className="navbar-brand">
              <span className="navbar-logo-icon">F</span>
              <span>FormFlow</span>
            </NavLink>

            <nav className="navbar-nav desktop-nav">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? "active" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/forms"
                end
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? "active" : ""}`
                }
              >
                My Forms
              </NavLink>
              <NavLink
                to="/forms/create"
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? "active" : ""}`
                }
              >
                + New Form
              </NavLink>
            </nav>
          </div>

          <div className="navbar-actions">
            {user && (
              <div
                className="navbar-user-chip"
                onClick={() => navigate("/dashboard")}
                title={`Signed in as ${user.email}`}
                style={{ cursor: "pointer" }}
              >
                <div className="navbar-user-avatar">
                  {getInitials(user.name)}
                </div>
                <span className="navbar-user-name">{user.name}</span>
              </div>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="btn btn-ghost btn-sm mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/forms"
              end
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              My Forms
            </NavLink>
            <NavLink
              to="/forms/create"
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              + Create Form
            </NavLink>
          </div>
        )}
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
