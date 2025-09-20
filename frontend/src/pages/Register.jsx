import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/user/register", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
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
        <h2 style={{ marginBottom: "8px" }}>Get Started</h2>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Create an account to continue
        </p>

        <form style={formStyle} onSubmit={handleSubmit}>
          {error && <div style={{ color: "red", fontSize: "13px" }}>{error}</div>}
          <input
            style={inputStyle}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span style={linkStyle} onClick={() => navigate("/login")}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
