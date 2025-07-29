import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input, Button } from "../../components";
import styles from "./ResetPassword.module.scss";
import authService from "@/services/auth/auth.service";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        // Simulate API call to validate token
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock token validation (in real app, this would be an API call)
        const isValid = token.length > 10; // Simple mock validation
        setIsTokenValid(isValid);
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call

      await authService.resetPassword({ password: formData.password, token });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrors({
        submit: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = ["", "#ef4444", "#f59e0b", "#10b981", "#059669", "#047857"];

    return {
      strength: Math.min(strength, 5),
      label: labels[Math.min(strength, 5)],
      color: colors[Math.min(strength, 5)],
    };
  };

  const passwordStrength = getPasswordStrength();

  // Loading state while validating token
  if (isTokenValid === null) {
    return (
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}>
          <svg width="48" height="48" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 31.416;15.708 15.708;0 31.416;15.708 15.708;0 31.416"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-15.708;-31.416;-47.124;-62.832"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
        <h2>Validating reset link...</h2>
      </div>
    );
  }

  // Invalid token state
  if (isTokenValid === false) {
    return (
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#ef4444" />
            <path
              d="M15 9l-6 6M9 9l6 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={styles.errorMessage}>
          <h1 className={styles.errorTitle}>Invalid or Expired Link</h1>
          <p className={styles.errorDescription}>
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>

        <div className={styles.errorActions}>
          <Link to="/forgot-password">
            <Button variant="primary" size="lg" fullWidth>
              Request New Link
            </Button>
          </Link>
          <Link to="/login" className={styles.backToLogin}>
            ← Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className={styles.successContent}>
        <div className={styles.successIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#10b981" />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={styles.successMessage}>
          <h1 className={styles.successTitle}>Password Reset Successfully!</h1>
          <p className={styles.successDescription}>
            Your password has been updated. You can now sign in with your new
            password.
          </p>
        </div>

        <div className={styles.successActions}>
          <Link to="/login">
            <Button variant="primary" size="lg" fullWidth>
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.4 7 14.8 8.6 14.8 10V11H15.5C16.3 11 17 11.7 17 12.5V16.5C17 17.3 16.3 18 15.5 18H8.5C7.7 18 7 17.3 7 16.5V12.5C7 11.7 7.7 11 8.5 11H9.2V10C9.2 8.6 10.6 7 12 7ZM12 8.2C11.2 8.2 10.4 8.7 10.4 10V11H13.6V10C13.6 8.7 12.8 8.2 12 8.2Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Set New Password</h1>
        <p className={styles.subtitle}>Please enter your new password below.</p>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* New Password */}
        <div className={styles.passwordField}>
          <Input
            label="New Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Enter your new password"
            required
          />
          {formData.password && (
            <div
              className={styles.passwordStrength}
              style={{
                "--strength-width": `${(passwordStrength.strength / 5) * 100}%`,
                "--strength-color": passwordStrength.color,
              }}
            >
              <div className={styles.strengthBar}>
                <div className={styles.strengthFill} />
              </div>
              <span className={styles.strengthLabel}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          placeholder="Confirm your new password"
          required
        />

        {/* Submit Error */}
        {errors.submit && (
          <div className={styles.submitError}>{errors.submit}</div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </>
  );
};

export default ResetPassword;
