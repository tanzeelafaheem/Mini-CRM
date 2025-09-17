import { useNavigate, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// Dummy pages for nested routes
function DashboardHome() {
  return <h2>Welcome to your Dashboard!</h2>;
}

function CustomersPage() {
  return <h2>Customers Page</h2>;
}

function LeadsPage() {
  return <h2>Leads Page</h2>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check auth on mount
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token || !storedUser) {
    navigate("/login");
  } else {
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (!parsedUser) throw new Error("No user found");
      setUser(parsedUser);
    } catch (err) {
      console.error("Failed to parse user:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
}, [navigate]);

  if (!user) return null; // wait until user is loaded

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Layout styles
  const dashboardStyle = {
    display: "flex",
    height: "100vh",
  };

  const mainContentStyle = {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  };

  return (
    <div>
      <Navbar user={user} />
      <div style={dashboardStyle}>
        <Sidebar logout={logout} />
        <div style={mainContentStyle}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="leads" element={<LeadsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
