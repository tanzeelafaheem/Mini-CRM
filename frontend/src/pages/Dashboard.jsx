import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CustomersPage from "./CustomerPage";
import LeadsPage from "./LeadPage";

function DashboardHome() {
  return <h2>Welcome to your Dashboard!</h2>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

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
  }, [navigate]);

  if (!user) return null;

 const logout = () => {
  if (window.confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
};


  const dashboardStyle = { display: "flex", height: "100vh" };
  const mainContentStyle = { flex: 1, padding: "20px", overflowY: "auto" };

  return (
    <div>
      <Navbar user={user} />
      <div style={dashboardStyle}>
        <Sidebar logout={logout} />
        <div style={mainContentStyle}>
          <Routes>
        <Route 
          path="customers" 
          element={<CustomersPage setSelectedCustomer={setSelectedCustomer} />} 
        />
        <Route 
          path="leads" 
          element={<LeadsPage customer={selectedCustomer} />} 
        />
      </Routes>
        </div>
      </div>
    </div>
  );
}
