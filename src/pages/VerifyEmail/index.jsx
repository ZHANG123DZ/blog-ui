import authService from "@/services/auth/auth.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Không tìm thấy token xác thực.");
      return;
    }

    const verify = async () => {
      try {
        const res = await authService.verifyEmail(token);

        if (!res.success) {
          throw new Error(
            !res?.message || "Token không hợp lệ hoặc đã hết hạn."
          );
        }

        setStatus("success");
        setMessage("Email của bạn đã được xác thực thành công!");
        window.location.href = "http://localhost:5173";
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    verify();
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "loading" && <p>Đang xác thực email...</p>}
        {status === "success" && (
          <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
        )}
        {status === "error" && (
          <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f9fc",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
  },
};

export default VerifyEmail;
