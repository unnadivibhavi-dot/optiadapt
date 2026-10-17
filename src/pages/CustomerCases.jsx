
import { useEffect, useState } from "react";
import {
  addCustomerCase,
  getCustomerCases,
} from "../services/caseService";

function CustomerCases() {
  const [customerName, setCustomerName] = useState("");
  const [lensType, setLensType] = useState("PAL");

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch cases from Firebase
  const loadCases = async () => {
    setFetching(true);
    setError("");

    try {
      const data = await getCustomerCases();
      setCases(data);
    } catch (err) {
      console.error("Error fetching cases:", err);
      setError("Failed to load customer cases.");
    } finally {
      setFetching(false);
    }
  };

  // Load data when page opens
  useEffect(() => {
    loadCases();
  }, []);

  // Save a customer case
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await addCustomerCase({
        customerName,
        lensType,
      });

      setMessage("Customer case saved successfully!");
      setCustomerName("");
      setLensType("PAL");

    } catch (err) {
      console.error("Error saving case:", err);
      setError("Failed to save customer case.");
      setLoading(false);
      return;
    }

    setLoading(false);

    // Refresh list after saving
    await loadCases();
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        <div style={styles.heading}>
          <p style={styles.label}>
            OPTIADAPT CASE MANAGEMENT
          </p>

          <h1 style={styles.title}>
            Customer Cases
          </h1>

          <p style={styles.description}>
            Manage optical cases and monitor
            progressive lens adaptation.
          </p>
        </div>

        {/* Add Customer Case */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            + Add New Customer Case
          </h2>

          <form onSubmit={handleSubmit}>

            <label htmlFor="customerName">
              Customer Name
            </label>

            <input
              id="customerName"
              type="text"
              placeholder="Enter demo customer name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              style={styles.input}
              required
            />

            <label htmlFor="lensType">
              Lens Type
            </label>

            <select
              id="lensType"
              value={lensType}
              onChange={(e) =>
                setLensType(e.target.value)
              }
              style={styles.input}
            >
              <option value="PAL">PAL</option>
              <option value="Bifocal">Bifocal</option>
              <option value="Single Vision">
                Single Vision
              </option>
            </select>

            <button
              type="submit"
              disabled={loading}
              style={styles.button}
            >
              {loading
                ? "Saving..."
                : "Save Customer Case"}
            </button>

          </form>

          {message && (
            <p role="status" style={styles.success}>
              {message}
            </p>
          )}

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}
        </section>

        {/* Customer Cases List */}
        <section style={styles.card}>

          <div style={styles.listHeader}>
            <h2 style={styles.sectionTitle}>
              Saved Customer Cases
            </h2>

            <button
              type="button"
              onClick={loadCases}
              disabled={fetching}
              style={styles.refreshButton}
            >
              Refresh
            </button>
          </div>

          {fetching ? (
            <p style={styles.description}>
              Loading cases...
            </p>
          ) : cases.length === 0 ? (
            <p style={styles.description}>
              No customer cases found.
            </p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      Customer Name
                    </th>
                    <th style={styles.th}>
                      Lens Type
                    </th>
                    <th style={styles.th}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cases.map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>
                        {item.customerName}
                      </td>

                      <td style={styles.td}>
                        {item.lensType}
                      </td>

                      <td style={styles.td}>
                        <span style={styles.status}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#081426",
    color: "#f1f7ff",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },

  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  heading: {
    marginBottom: "35px",
  },

  label: {
    color: "#42e5e8",
    fontSize: "12px",
    letterSpacing: "3px",
  },

  title: {
    fontSize: "36px",
    margin: "15px 0",
  },

  description: {
    color: "#a9bfd0",
    lineHeight: 1.7,
  },

  card: {
    background: "#132743",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #28506a",
    marginBottom: "25px",
  },

  sectionTitle: {
    color: "#42e5e8",
    fontSize: "21px",
    marginBottom: "22px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginTop: "8px",
    marginBottom: "20px",
    borderRadius: "8px",
    background: "#081426",
    border: "1px solid #456078",
    color: "#ffffff",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "#42e5e8",
    color: "#081426",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },

  refreshButton: {
    background: "#233c57",
    color: "#42e5e8",
    border: "1px solid #42e5e8",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "480px",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    color: "#42e5e8",
    borderBottom: "1px solid #34516a",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #254360",
    color: "#e0eaf4",
  },

  status: {
    color: "#4ade80",
    background: "#143f36",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  success: {
    color: "#4ade80",
    marginTop: "16px",
  },

  error: {
    color: "#ff9292",
    marginTop: "16px",
  },
};

export default CustomerCases;
