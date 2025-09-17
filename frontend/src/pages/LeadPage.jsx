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

  const formStyle = { display: "flex", gap: "10px", marginBottom: "20px" };
  const inputStyle = { padding: "5px", flex: 1 };
  const selectStyle = { padding: "5px" };
  const buttonStyle = { padding: "5px 10px", cursor: "pointer" };
  const thTdStyle = { border: "1px solid #ccc", padding: "8px" };

  if (!customer) return <p>Please select a customer first.</p>;

  return (
    <div>
      <h2>Leads for {customer.name}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

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
        <button style={buttonStyle} type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thTdStyle}>Title</th>
              <th style={thTdStyle}>Description</th>
              <th style={thTdStyle}>Status</th>
              <th style={thTdStyle}>Value</th>
              <th style={thTdStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(l => (
              <tr key={l._id}>
                <td style={thTdStyle}>{l.title}</td>
                <td style={thTdStyle}>{l.description}</td>
                <td style={thTdStyle}>{l.status}</td>
                <td style={thTdStyle}>{l.value}</td>
                <td style={thTdStyle}>
                  <button style={{ ...buttonStyle, marginRight: "5px" }} onClick={() => handleEdit(l)}>Edit</button>
                  <button style={{ ...buttonStyle, backgroundColor: "red", color: "white" }} onClick={() => handleDelete(l._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
