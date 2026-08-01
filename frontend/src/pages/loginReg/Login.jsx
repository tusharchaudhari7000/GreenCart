import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import "./Login.css";

export default function Login() {
  // Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { isAuthenticated, role, loading, error } = useSelector(
    (state) => state.auth
  );

  // Handle form submit
  const handleLogin = (e) => {
    e.preventDefault();
    setLocalError("");

    // Frontend validation
    if (!username || !password) {
      setLocalError("Please enter username and password");
      return;
    }

    if (username.length < 5 || username.length > 20) {
      setLocalError("Username must be between 5 and 20 characters");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setLocalError("Password must be between 8 and 16 characters");
      return;
    }

    // Dispatch Redux async thunk
    dispatch(login({ username, password }));
  };

  // Redirect after successful login
  useEffect(() => {
    console.log("🔄 Login redirect useEffect triggered:", { isAuthenticated, role });

    if (isAuthenticated && role) {
      console.log(`✅ Authenticated as ${role}, navigating...`);
      switch (role) {
        case "ADMIN":
          console.log("→ Navigating to /admin");
          navigate("/admin");
          break;
        case "FARMER":
          console.log("→ Navigating to /farmer");
          navigate("/farmer");
          break;
        case "BUYER":
          console.log("→ Navigating to /buyer/home");
          navigate("/buyer/home");
          break;
        default:
          console.log("→ Unknown role, navigating to /");
          navigate("/");
      }
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <div className="login-header">
          <div className="header-icon">🥗</div>
          <h1 className="header-title">Welcome Back</h1>
          <p className="header-subtitle">Sign in to your GreenCart account</p>
        </div>

        {/* Username */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {/* Frontend validation error */}
        {localError && (
          <div className="error-message local">
            <span>⚠️</span> {localError}
          </div>
        )}

        {/* Backend / Redux error */}
        {error && (
          <div className="error-message server">
            <span>🚫</span>
            {error === "ACCOUNT_NOT_VERIFIED"
              ? "Your account is not yet verified by admin. Please wait for approval."
              : error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Sign In"}
        </button>

        {/* Forgot password */}
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2e7d32', fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
