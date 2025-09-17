import { useNavigate } from "react-router-dom";

export default function Sidebar({ logout }) {
  const navigate = useNavigate();

  const sidebarStyle = {
    width: "200px",
    backgroundColor: "#F3F4F6", // light gray
    padding: "20px",
    height: "100vh",
  };

  const linkStyle = {
    display: "block",
    margin: "10px 0",
    cursor: "pointer",
    color: "#1E40AF",
    fontWeight: "bold",
  };

  return (
    <div style={sidebarStyle}>
      <div style={linkStyle} onClick={() => navigate("/dashboard")}>Dashboard</div>
      <div style={linkStyle} onClick={() => navigate("/dashboard/customers")}>Customers</div>
      {/* <div style={linkStyle} onClick={() => navigate("/dashboard/leads")}>Leads</div> */}
      <div style={{ ...linkStyle, color: "red" }} onClick={logout}>Logout</div>
    </div>
  );
}
