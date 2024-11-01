import React from "react";

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
        <div style={{
            maxWidth:'400px',
            width:'300px'
        }}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.subheading}>Page Not Found</p>
        </div>
    
    </div>
  );
};

// CSS-in-JS styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
  
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#282c34",
    color: "#fff",
    animation: "floatAnimation 3s ease-in-out infinite",
  },
  heading: {
    fontSize: "6rem",
    fontWeight: "bold",
    margin: 0,
    color: "#ff4757",
  },
  subheading: {
    fontSize: "1.5rem",
    color: "#ced6e0",
    marginTop: "0.5rem",
  },
};

// Adding keyframes for the floating animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes floatAnimation {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`, styleSheet.cssRules.length);

export default NotFoundPage;
