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
        <h2>Login</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <input style={inputStyle} type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input style={inputStyle} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button style={buttonStyle} type="submit">Login</button>
        <p>
          Don't have an account? <span style={{ color: "#1E40AF", cursor: "pointer" }} onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}
