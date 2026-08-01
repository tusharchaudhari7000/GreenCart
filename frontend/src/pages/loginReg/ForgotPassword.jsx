import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserSecurityQuestion,
  verifySecurityAnswer,
  resetPassword
} from "../../services/authService";
import "./ForgotPassword.css";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch security question for the given email
  const fetchUserQuestion = async () => {
    if (!email) return;
    setError("");

    try {
      const res = await getUserSecurityQuestion(email);
      setQuestion(res.data.question);
      setQuestionId(res.data.questionId);
    } catch (err) {
      setError(err.response?.data || "User not found or account not active");
      setQuestion("");
      setQuestionId(null);
    }
  };

  // Verify answer
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !questionId || !answer) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await verifySecurityAnswer({
        email,
        questionId,
        answer
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    // Password validation: 8 to 16 characters
    if (newPassword.length < 8 || newPassword.length > 16) {
      setError("Password must be between 8 and 16 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        email,
        newPassword
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={step === 1 ? handleVerify : handleReset} className="forgot-password-form">
        <div className="forgot-password-header">
          <div className="header-icon">{step === 1 ? "🔓" : "🔒"}</div>
          <h1 className="header-title">{step === 1 ? "Forgot Password" : "Reset Password"}</h1>
          <p className="header-subtitle">
            {step === 1
              ? "Verify your security question to reset password"
              : "Choose a strong new password for your account"}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {step === 1 ? (
          <div className="form-fields">
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={fetchUserQuestion}
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="question">Security Question</label>
              <input
                id="question"
                type="text"
                value={question || "Enter email to see question"}
                readOnly
              />
            </div>

            <div className="input-field">
              <label htmlFor="answer">Answer</label>
              <input
                id="answer"
                type="text"
                placeholder="Enter your answer"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                required
              />
              <span className="helper-text">Answers are case sensitive</span>
            </div>

            <button type="submit" className="action-button" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Identity"}
            </button>
          </div>
        ) : (
          <div className="form-fields">
            <div className="input-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="8-16 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="action-button" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        <div className="form-footer">
          <Link to="/login" className="back-link">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
