
const Avatar = ({ name = "", src = "", size = 40, color = "#2563EB", className = "" }) => {
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    backgroundColor: color,
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: `${size * 0.38}px`,
    userSelect: "none",
    border: "2px solid var(--border-color)",
    overflow: "hidden"
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--border-color)"
        }}
      />
    );
  }

  return (
    <div style={avatarStyle} className={className}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
