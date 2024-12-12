import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const SearchForm = ({ onSearch, searchQuery, onReset }) => {
  const handleInputChange = (e) => {
    const query = e.target.value;
    if (onSearch) onSearch(query);
  };

  const handleClearSearch = () => {
    if (onReset) onReset(); // Trigger the reset handler
  };

  return (
    <div style={styles.form}>
      <input
        type="text"
        placeholder="Search events..."
        onInput={handleInputChange}
        value={searchQuery}
        style={styles.input}
        aria-label="Search for events"
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

const styles = {
  form: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "25px 0 0 25px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    border: "none",
    height: "45px",
    borderRadius: "0 25px 25px 0",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "not-allowed",
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

export default SearchForm;
