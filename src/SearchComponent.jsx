import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Added X icon

const SearchForm = ({ onSearch, searchQuery }) => {
  const handleInputChange = (e) => {
    const query = e.target.value;
    if (onSearch) onSearch(query); // Trigger parent-provided search function
  };

  const handleClearSearch = () => {
    if (onSearch) onSearch(""); // Clears the search query
  };

  return (
    <div style={styles.form}>
      <input
        type="text"
        placeholder="Search events..."
        onInput={handleInputChange} // Trigger search dynamically
        value={searchQuery}
        style={styles.input}
        aria-label="Search for events" // Accessibility improvement
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClearSearch}
          style={styles.clearButton}
        >
          <FontAwesomeIcon icon={faTimes} style={styles.icon} />
        </button>
      )}
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
  clearButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: "18px",
  },
};

// Media query for responsiveness
const mediaQueries = {
  "@media (max-width: 600px)": {
    form: {
      width: "90%",
      maxWidth: "300px", // smaller input field on mobile
    },
    input: {
      fontSize: "14px",
    },
    button: {
      fontSize: "14px",
    },
  },
};

export default SearchForm;
