import { useEffect, useState } from "react";
import axios from "../axios";

export default function LeadsPage({ customer }) {
  const token = localStorage.getItem("token");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", status: "New", value: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    if (!customer) return;
    setLoading(true);
    try {
      const res = await axios.get(`/leads/${customer._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(Array.isArray(res.data) ? res.data : res.data.leads || []);
    } catch {
      setError("Failed to load leads");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [customer]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer) return;

    try {
      if (editId) {
        await axios.put(`/leads/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setEditId(null);
      } else {
        await axios.post(`/leads/customer/${customer._id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ title: "", description: "", status: "New", value: "" });
      fetchLeads();
    } catch {
      setError("Failed to save lead");
    }
  };

  const handleEdit = (lead) => {
    setForm({ title: lead.title, description: lead.description, status: lead.status, value: lead.value });
    setEditId(lead._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchLeads();
    } catch {
      setError("Failed to delete lead");
    }
  };

  const formStyle = { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" };
  const inputStyle = { padding: "8px 10px", flex: 1, borderRadius: "6px", border: "1px solid #ddd" };
  const selectStyle = { padding: "8px 10px", borderRadius: "6px", border: "1px solid #ddd" };
  const buttonStyle = { padding: "8px 14px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };

  if (!customer) return <p>Please select a customer first.</p>;

  return (
    <div>
      <h2 style={{ color: "#1E40AF", marginBottom: "15px" }}>Leads for {customer.name}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lead Form */}
      <form style={formStyle} onSubmit={handleSubmit}>
        <input style={inputStyle} name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input style={inputStyle} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input style={inputStyle} name="value" placeholder="Value" value={form.value} onChange={handleChange} />
        <select style={selectStyle} name="status" value={form.status} onChange={handleChange}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
        <button style={{ ...buttonStyle, background: "#1E40AF", color: "#fff" }} type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Leads Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          {leads.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#6B7280" }}>No leads available</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
              <thead>
                <tr style={{ background: "#f3f4f6", color: "#1E40AF", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Title</th>
                  <th style={{ padding: "12px" }}>Description</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px" }}>Value</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l, index) => (
                  <tr
                    key={l._id}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      transition: "background 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#e0f2fe")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? "#ffffff" : "#f9fafb")}
                  >
                    <td style={{ padding: "12px" }}>{l.title}</td>
                    <td style={{ padding: "12px" }}>{l.description}</td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>{l.status}</td>
                    <td style={{ padding: "12px" }}>{l.value}</td>
                    <td style={{ padding: "12px" }}>
                      <button style={{ ...buttonStyle, marginRight: "8px", background: "#2563EB", color: "#fff" }} onClick={() => handleEdit(l)}>Edit</button>
                      <button style={{ ...buttonStyle, background: "#EF4444", color: "#fff" }} onClick={() => handleDelete(l._id)}>Delete</button>
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
