import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/user/login", form);
      const { token, user } = res.data;

      if (!token || !user) throw new Error("Invalid login response");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Login failed");
    }
  };

  // Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#F9FAFB",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  };

  const inputStyle = {
    padding: "12px",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "12px",
    backgroundColor: "#1E40AF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  };

  const linkStyle = {
    color: "#1E40AF",
    cursor: "pointer",
    fontWeight: "500",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1>Our CRM</h1>
        <h2 style={{ marginBottom: "8px" }}>Welcome Back</h2>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Login to your account
        </p>

        <form style={formStyle} onSubmit={handleSubmit}>
          {error && <div style={{ color: "red", fontSize: "13px" }}>{error}</div>}
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={buttonStyle} type="submit">
            Login
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <span style={linkStyle} onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
