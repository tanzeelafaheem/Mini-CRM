export default function Navbar({ user }) {
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#1E40AF",
    color: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const brandStyle = {
    fontWeight: "bold",
    fontSize: "22px",
    letterSpacing: "0.5px",
    cursor: "pointer",
  };

  const userInfoStyle = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    fontSize: "14px",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "6px 12px",
    borderRadius: "20px",
  };

  const roleStyle = {
    fontSize: "13px",
    opacity: 0.9,
  };

  return (
    <div style={navbarStyle}>
      <div style={brandStyle}>MiniCRM</div>
      <div style={userInfoStyle}>
        <span>{user?.name}</span>
        <span style={roleStyle}>({user?.role})</span>
      </div>
    </div>
  );
}
