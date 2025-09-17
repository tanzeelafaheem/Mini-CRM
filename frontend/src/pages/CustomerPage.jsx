import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function CustomersPage({setSelectedCustomer}) {
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


  const formStyle = { display: "flex", gap: "10px", marginBottom: "20px" };
  const inputStyle = { padding: "5px", flex: 1 };
  const buttonStyle = { padding: "5px 10px", cursor: "pointer" };
  const thTdStyle = { border: "1px solid #ccc", padding: "8px" };

  return (
    <div>
      <h2>Customers</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form style={formStyle} onSubmit={handleSubmit}>
        <input style={inputStyle} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input style={inputStyle} name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input style={inputStyle} name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input style={inputStyle} name="company" placeholder="Company" value={form.company} onChange={handleChange} />
        <button style={buttonStyle} type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thTdStyle}>Name</th>
              <th style={thTdStyle}>Email</th>
              <th style={thTdStyle}>Phone</th>
              <th style={thTdStyle}>Company</th>
              <th style={thTdStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c._id}>
                <td style={thTdStyle}>{c.name}</td>
                <td style={thTdStyle}>{c.email}</td>
                <td style={thTdStyle}>{c.phone}</td>
                <td style={thTdStyle}>{c.company}</td>
                <td style={thTdStyle}>
                  <button style={{ ...buttonStyle, marginRight: "5px" }} onClick={() => viewLeads(c)}>View Leads</button>
                  <button style={{ ...buttonStyle, marginRight: "5px" }} onClick={() => handleEdit(c)}>Edit</button>
                  <button style={{ ...buttonStyle, backgroundColor: "red", color: "white" }} onClick={() => handleDelete(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
