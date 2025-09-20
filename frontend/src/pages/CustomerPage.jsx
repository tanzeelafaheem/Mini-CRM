import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function CustomersPage({ setSelectedCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(Array.isArray(res.data) ? res.data : res.data.customers || []);
    } catch {
      setError("Failed to load customers");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchCustomers();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/customers/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setEditId(null);
      } else {
        await axios.post("/customers", form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ name: "", email: "", phone: "", company: "" });
      fetchCustomers();
    } catch {
      setError("Failed to save customer");
    }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company });
    setEditId(c._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/customers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCustomers();
    } catch {
      setError("Failed to delete customer");
    }
  };

  const viewLeads = (c) => {
    setSelectedCustomer(c);
    navigate("/dashboard/leads");
  };

  // Form and button styles
  const formStyle = { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" };
  const inputStyle = { padding: "8px 10px", flex: 1, borderRadius: "6px", border: "1px solid #ddd" };
  const buttonStyle = { padding: "8px 14px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };

  return (
    <div>
      <h2 style={{ color: "#1E40AF", marginBottom: "15px" }}>Customers</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Customer Form */}
      <form style={formStyle} onSubmit={handleSubmit}>
        <input style={inputStyle} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input style={inputStyle} name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input style={inputStyle} name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input style={inputStyle} name="company" placeholder="Company" value={form.company} onChange={handleChange} />
        <button style={{ ...buttonStyle, background: "#1E40AF", color: "#fff" }} type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Customers Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          {customers.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}>No customers available</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
              <thead>
                <tr style={{ background: "#f3f4f6", color: "#1E40AF", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Email</th>
                  <th style={{ padding: "12px" }}>Phone</th>
                  <th style={{ padding: "12px" }}>Company</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, index) => (
                  <tr
                    key={c._id}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      transition: "background 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#e0f2fe")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? "#ffffff" : "#f9fafb")}
                  >
                    <td style={{ padding: "12px" }}>{c.name}</td>
                    <td style={{ padding: "12px" }}>{c.email}</td>
                    <td style={{ padding: "12px" }}>{c.phone}</td>
                    <td style={{ padding: "12px" }}>{c.company}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        style={{ ...buttonStyle, marginRight: "8px", background: "#2563EB", color: "#fff" }}
                        onClick={() => viewLeads(c)}
                      >
                        View Leads
                      </button>
                      <button
                        style={{ ...buttonStyle, marginRight: "8px", background: "#177c57", color: "#fff" }}
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...buttonStyle, background: "#EF4444", color: "#fff" }}
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
