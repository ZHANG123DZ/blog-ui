import { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./ErrorBoundary.module.scss";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorIcon}>
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle cx="12" cy="12" r="10" fill="#ef4444" />
                                <path
                                    d="M12 8v5M12 16v.01"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h1 className={styles.errorTitle}>
                            Something Went Wrong
                        </h1>

                        <p className={styles.errorDescription}>
                            We&apos;re sorry, but something unexpected happened.
                            Our team has been notified.
                        </p>

                        <div className={styles.errorActions}>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </Button>

                            <Link to="/">
                                <Button variant="secondary" size="lg">
                                    Go to Home
                                </Button>
                            </Link>
                        </div>

                        {this.props.showDetails && this.state.error && (
                            <div className={styles.errorDetails}>
                                <h3>Error Details</h3>
                                <p className={styles.errorMessage}>
                                    {this.state.error.toString()}
                                </p>
                                <details className={styles.errorStack}>
                                    <summary>Stack Trace</summary>
                                    <pre>
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    showDetails: PropTypes.bool,
};

ErrorBoundary.defaultProps = {
    showDetails: false,
};

export default ErrorBoundary;
