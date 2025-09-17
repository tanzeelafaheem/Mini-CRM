import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomersPage from "./CustomerPage";
import LeadsPage from "./LeadPage";
import axios from "../axios";

function DashboardHome({ token }) {
  const [stats, setStats] = useState({ customers: 0, leads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const customersRes = await axios.get("/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const leadsRes = await axios.get("/leads/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          customers: Array.isArray(customersRes.data) ? customersRes.data.length : customersRes.data.customers.length,
          leads: Array.isArray(leadsRes.data) ? leadsRes.data.length : leadsRes.data.leads.length,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
      setLoading(false);
    };

    fetchStats();
  }, [token]);

  const pieData = [
    { name: "Customers", value: stats.customers },
    { name: "Leads", value: stats.leads },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  if (loading) return <p>Loading dashboard data...</p>;


  const containerStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "20px",
    maxWidth: "100%",
    boxSizing: "border-box",
  };
  const cardStyle = {
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: "1 1 250px", 
    maxWidth: "350px",
    boxSizing: "border-box",
    overflow: "hidden", 
  };
  const tableStyle = {
    width: "100%",
    maxWidth: "400px", 
    margin: "0 auto",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "0.9rem",
  };
  const thTdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        padding: "10px",
        maxHeight: "calc(100vh - 60px)", 
        overflowY: "hidden", 
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center", margin: "10px 0", fontSize: "1.4rem" }}>
        📊 Dashboard Overview
      </h2>

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h3 style={{ textAlign: "center", fontSize: "1.1rem", margin: "8px 0" }}>
            Customer vs Leads Distribution
          </h3>
          <PieChart width={250} height={250}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div style={cardStyle}>
          <h3 style={{ textAlign: "center", fontSize: "1.1rem", margin: "8px 0" }}>
            Summary Stats
          </h3>
          <BarChart width={300} height={250} data={[stats]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="customers" name="Customers" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="customers" fill="#8884d8" />
            <Bar dataKey="leads" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      <h3 style={{ textAlign: "center", margin: "10px 0", fontSize: "1.1rem" }}>
        Statistics Table
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Metric</th>
            <th style={thTdStyle}>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={thTdStyle}>Total Customers</td>
            <td style={thTdStyle}>{stats.customers}</td>
          </tr>
          <tr>
            <td style={thTdStyle}>Total Leads</td>
            <td style={thTdStyle}>{stats.leads}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, token]);

  if (!user) return null;

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

 
  const dashboardStyle = {
    display: "flex",
    maxHeight: "calc(100vh - 60px)", 
    overflowY: "hidden", 
    boxSizing: "border-box",
  };
  const mainContentStyle = {
    flex: 1,
    padding: "10px",
    maxHeight: "calc(100vh - 60px)",
    overflowY: "hidden", 
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxHeight: "100vh", overflowY: "hidden", boxSizing: "border-box" }}>
      <Navbar user={user} />
      <div style={dashboardStyle}>
        <Sidebar logout={logout} />
        <div style={mainContentStyle}>
          <Routes>
            <Route path="/" element={<DashboardHome token={token} />} />
            <Route path="customers" element={<CustomersPage setSelectedCustomer={setSelectedCustomer} />} />
            <Route path="leads" element={<LeadsPage customer={selectedCustomer} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}