export default function Navbar({ user }) {
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#1E40AF", // blue
    color: "white",
  };

  const userInfoStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  };

  return (
    <div style={navbarStyle}>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>MiniCRM</div>
      <div style={userInfoStyle}>
        <span>{user.name}</span>
        <span>({user.role})</span>
      </div>
    </div>
  );
}
