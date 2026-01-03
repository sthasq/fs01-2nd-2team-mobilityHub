const containerStyles = {
  simple: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    backgroundColor: "#fff",
    padding: "8px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  wide: {
    backgroundColor: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
};

const backButtonStyles = {
  simple: {
    padding: "4px 8px",
  },
  card: {
    padding: "4px 8px",
  },
  wide: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
  },
};

export default function UserHeader({
  label,
  value,
  onBack,
  backText = "< Back",
  variant = "card",
}) {
  const containerStyle = containerStyles[variant] || containerStyles.card;
  const backButtonStyle = backButtonStyles[variant] || backButtonStyles.card;

  return (
    <div style={containerStyle}>
      {onBack && (
        <button onClick={onBack} style={backButtonStyle}>
          {backText}
        </button>
      )}
      <div>
        {label && <div style={{ fontSize: "12px", color: "#6b7280" }}>{label}</div>}
        <div>{value}</div>
      </div>
    </div>
  );
}
