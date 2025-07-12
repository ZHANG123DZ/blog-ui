import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "../../components";
import styles from "./ForgotPassword.module.scss";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
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
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock successful submission
            console.log("Password reset email sent to:", formData.email);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Failed to send reset email:", error);
            setErrors({
                submit: "Failed to send reset email. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendEmail = async () => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Reset email resent to:", formData.email);
        } catch (error) {
            console.error("Failed to resend email:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={styles.successContent}>
                {/* Success Icon */}
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

                {/* Success Message */}
                <div className={styles.successMessage}>
                    <h1 className={styles.successTitle}>Check Your Email</h1>
                    <p className={styles.successDescription}>
                        We&apos;ve sent a password reset link to{" "}
                        <strong>{formData.email}</strong>
                    </p>
                    <div className={styles.emailInstructions}>
                        <p>
                            Please check your email and click the link to reset
                            your password.
                        </p>
                        <p>
                            If you don&apos;t see the email, check your spam
                            folder.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.successActions}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isSubmitting}
                        onClick={handleResendEmail}
                    >
                        {isSubmitting ? "Sending..." : "Resend Email"}
                    </Button>

                    <Link to="/login" className={styles.backToLogin}>
                        ← Back to Sign In
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
                            d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21ZM23 15V13C23 12.45 22.55 12 22 12H16C15.45 12 15 12.45 15 13V15H14V17H15V21H17V17H21V21H23V17H24V15H23ZM17 15V14H21V15H17Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
                <h1 className={styles.title}>Forgot Your Password?</h1>
                <p className={styles.subtitle}>
                    No worries! Enter your email address and we&apos;ll send you
                    a link to reset your password.
                </p>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="Enter your email address"
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
                    {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
            </form>

            {/* Footer */}
            <div className={styles.footer}>
                <Link to="/login" className={styles.backLink}>
                    ← Back to Sign In
                </Link>

                <div className={styles.helpText}>
                    <p>
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className={styles.registerLink}>
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
