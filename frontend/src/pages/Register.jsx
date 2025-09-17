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

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  };

  const inputStyle = { padding: "8px" };
  const buttonStyle = { padding: "10px", backgroundColor: "#1E40AF", color: "white", border: "none", cursor: "pointer" };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <input style={inputStyle} type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input style={inputStyle} type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input style={inputStyle} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button style={buttonStyle} type="submit">Register</button>
        <p>
          Already a member? <span style={{ color: "#1E40AF", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
