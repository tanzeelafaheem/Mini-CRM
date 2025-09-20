import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ logout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarStyle = {
    width: "220px",
    backgroundColor: "#FFFFFF",
    padding: "20px",
    height: "100vh",
    borderRight: "1px solid #E5E7EB", // subtle divider
  };

  const linkBaseStyle = {
    display: "block",
    padding: "10px 15px",
    margin: "8px 0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.2s ease-in-out",
  };

  const activeStyle = {
    backgroundColor: "#1E40AF",
    color: "white",
  };

  const inactiveStyle = {
    color: "#1E40AF",
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div style={sidebarStyle}>
      <div
        style={{
          ...linkBaseStyle,
          ...(location.pathname === "/dashboard" ? activeStyle : inactiveStyle),
        }}
        onClick={() => handleNavigate("/dashboard")}
      >
        Dashboard
      </div>
      <div
        style={{
          ...linkBaseStyle,
          ...(location.pathname === "/dashboard/customers"
            ? activeStyle
            : inactiveStyle),
        }}
        onClick={() => handleNavigate("/dashboard/customers")}
      >
        Customers
      </div>
      {/* Uncomment if needed */}
      {/* <div
        style={{
          ...linkBaseStyle,
          ...(location.pathname === "/dashboard/leads"
            ? activeStyle
            : inactiveStyle),
        }}
        onClick={() => handleNavigate("/dashboard/leads")}
      >
        Leads
      </div> */}
      <div
        style={{
          ...linkBaseStyle,
          color: "red",
          backgroundColor:
            location.pathname === "/logout" ? "rgba(255,0,0,0.1)" : "transparent",
        }}
        onClick={logout}
      >
        Logout
      </div>
    </div>
  );
}
