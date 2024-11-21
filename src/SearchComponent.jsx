import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchForm = ({ onSearch }) => {
  const handleInputChange = (e) => {
    const query = e.target.value;
    if (onSearch) onSearch(query); // Trigger parent-provided search function
  };

  return (
    <div style={styles.form}>
      <input
        type="text"
        placeholder="Search events..."
        onInput={handleInputChange} // Trigger search dynamically
        style={styles.input}
        aria-label="Search for events" // Accessibility improvement
      />
      <button type="button" style={styles.button} disabled>
        <FontAwesomeIcon icon={faSearch} style={styles.icon} />
      </button>
    </div>
  );
};

// Inline styles
const styles = {
  form: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto", // Center the form
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "25px 0 0 25px", // Rounded left
    outline: "none",
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    border: "none",
    height: "45px",
    borderRadius: "0 25px 25px 0", // Rounded right
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "not-allowed", // Disabled button appearance
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: "18px",
  },
};

export default SearchForm;
