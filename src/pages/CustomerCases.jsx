
import { useEffect, useState } from "react";

import {
  addCustomerCase,
  getCustomerCases,
  updateCustomerCase,
  deleteCustomerCase,
} from "../services/caseService";

function CustomerCases() {
  // Add form
  const [customerName, setCustomerName] = useState("");
  const [lensType, setLensType] = useState("PAL");

  // Customer data
  const [cases, setCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  // Edit form
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLensType, setEditLensType] = useState("PAL");

  // Delete confirmation
  const [caseToDelete, setCaseToDelete] = useState(null);

  // Load customer cases
  const loadCases = async () => {
    setFetching(true);
    setLoadError("");

    try {
      const data = await getCustomerCases();
      setCases(data);
    } catch (err) {
      console.error("Loading error:", err);
      setLoadError("Failed to load customer cases.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  // Add case
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await addCustomerCase({
        customerName,
        lensType,
      });

      setCustomerName("");
      setLensType("PAL");
      setMessage("Customer case saved successfully!");

      await loadCases();
    } catch (err) {
      console.error("Add error:", err);
      setError("Failed to save customer case.");
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.customerName || "");
    setEditLensType(item.lensType || "PAL");
    setMessage("");
    setError("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditLensType("PAL");
    setError("");
  };

  // Update case
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editingId) return;

    setSavingEdit(true);
    setMessage("");
    setError("");

    try {
      await updateCustomerCase(editingId, {
        customerName: editName,
        lensType: editLensType,
      });

      handleCancelEdit();
      setMessage("Customer case updated successfully!");

      await loadCases();
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update customer case.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (item) => {
    setCaseToDelete(item);
    setMessage("");
    setError("");
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    if (deletingId) return;
    setCaseToDelete(null);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!caseToDelete || deletingId) return;

    const caseId = caseToDelete.id;

    setDeletingId(caseId);
    setMessage("");
    setError("");

    try {
      await deleteCustomerCase(caseId);

      if (editingId === caseId) {
        handleCancelEdit();
      }

      setCaseToDelete(null);
      setMessage("Customer case deleted successfully!");

      await loadCases();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete customer case.");
      setCaseToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  // Search by customer name
  const filteredCases = cases.filter((item) => {
    const name = (item.customerName || "").toLowerCase();
    const search = searchQuery.trim().toLowerCase();

    return name.includes(search);
  });

  return (
    <main style={styles.container}>
      <div style={styles.wrapper}>

        {/* Page Header */}
        <header style={styles.heading}>
          <p style={styles.label}>
            OPTIADAPT CASE MANAGEMENT
          </p>

          <h1 style={styles.title}>Customer Cases</h1>

          <p style={styles.description}>
            Manage optical customer cases and
            monitor progressive lens adaptation.
          </p>
        </header>

        {/* Add Customer Case */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            + Add New Customer Case
          </h2>

          <form onSubmit={handleAdd}>
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
              style={styles.primaryButton}
            >
              {loading
                ? "Saving..."
                : "Save Customer Case"}
            </button>
          </form>
        </section>

        {/* Saved Cases */}
        <section style={styles.card}>

          <div style={styles.listHeader}>
            <h2 style={styles.sectionTitle}>
              Saved Customer Cases
            </h2>

            <button
              type="button"
              onClick={loadCases}
              disabled={fetching || savingEdit || !!deletingId}
              style={styles.refreshButton}
            >
              {fetching ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Search */}
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>
              🔍
            </span>

            <input
              type="search"
              placeholder="Search customer by name..."
              aria-label="Search customer by name"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              style={styles.searchInput}
            />
          </div>

          {/* Feedback Messages */}
          {message && (
            <p role="status" style={styles.success}>
              ✓ {message}
            </p>
          )}

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}

          {loadError && (
            <p role="alert" style={styles.error}>
              {loadError}
            </p>
          )}

          {!fetching && !loadError && (
            <p style={styles.resultCount}>
              Showing {filteredCases.length} of{" "}
              {cases.length} cases
            </p>
          )}

          {/* Table */}
          {fetching ? (
            <p style={styles.description}>
              Loading customer cases...
            </p>
          ) : loadError ? (
            <p style={styles.description}>
              Please try the Refresh button.
            </p>
          ) : cases.length === 0 ? (
            <p style={styles.description}>
              No customer cases found.
            </p>
          ) : filteredCases.length === 0 ? (
            <p style={styles.description}>
              No matching customers found.
            </p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Customer Name</th>
                    <th style={styles.th}>Lens Type</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCases.map((item) => (
                    <tr key={item.id}>

                      {editingId === item.id ? (
                        <>
                          <td style={styles.td}>
                            <input
                              form="editCaseForm"
                              type="text"
                              aria-label="Edit customer name"
                              value={editName}
                              onChange={(e) =>
                                setEditName(e.target.value)
                              }
                              style={styles.editInput}
                              required
                            />
                          </td>

                          <td style={styles.td}>
                            <select
                              form="editCaseForm"
                              aria-label="Edit lens type"
                              value={editLensType}
                              onChange={(e) =>
                                setEditLensType(e.target.value)
                              }
                              style={styles.editInput}
                            >
                              <option value="PAL">PAL</option>
                              <option value="Bifocal">
                                Bifocal
                              </option>
                              <option value="Single Vision">
                                Single Vision
                              </option>
                            </select>
                          </td>

                          <td style={styles.td}>
                            <span style={styles.status}>
                              {item.status}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <form
                              id="editCaseForm"
                              onSubmit={handleSaveEdit}
                              style={styles.actionGroup}
                            >
                              <button
                                type="submit"
                                disabled={
                                  savingEdit ||
                                  !editName.trim()
                                }
                                style={styles.saveButton}
                              >
                                {savingEdit
                                  ? "Saving..."
                                  : "Save"}
                              </button>

                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={savingEdit}
                                style={styles.cancelButton}
                              >
                                Cancel
                              </button>
                            </form>
                          </td>
                        </>
                      ) : (
                        <>
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

                          <td style={styles.td}>
                            <div style={styles.actionGroup}>
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                disabled={
                                  savingEdit || !!deletingId
                                }
                                style={styles.editButton}
                              >
                                ✏️ Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteClick(item)
                                }
                                disabled={
                                  savingEdit || !!deletingId
                                }
                                style={styles.deleteButton}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      {caseToDelete && (
        <div style={styles.modalOverlay}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            style={styles.modal}
          >
            <h2
              id="delete-title"
              style={styles.modalTitle}
            >
              Delete Customer Case?
            </h2>

            <p
              id="delete-description"
              style={styles.description}
            >
              Are you sure you want to delete{" "}
              <strong>{caseToDelete.customerName}</strong>?
              <br />
              This action cannot be undone.
            </p>

            <div style={styles.modalButtons}>
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={!!deletingId}
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!!deletingId}
                style={styles.deleteButton}
              >
                {deletingId
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
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
    marginBottom: "15px",
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
    boxSizing: "border-box",
  },

  primaryButton: {
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
    marginBottom: "12px",
  },

  refreshButton: {
    background: "#233c57",
    color: "#42e5e8",
    border: "1px solid #42e5e8",
    borderRadius: "8px",
    padding: "10px 18px",
    cursor: "pointer",
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    background: "#081426",
    border: "1px solid #34516a",
    borderRadius: "10px",
    padding: "0 14px",
    marginBottom: "15px",
  },

  searchIcon: {
    marginRight: "10px",
    fontSize: "18px",
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    padding: "16px 5px",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "14px",
  },

  resultCount: {
    color: "#a9bfd0",
    fontSize: "13px",
    marginBottom: "20px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "760px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "16px",
    textAlign: "left",
    color: "#42e5e8",
    borderBottom: "1px solid #34516a",
  },

  td: {
    padding: "16px",
    color: "#e0eaf4",
    borderBottom: "1px solid #254360",
  },

  status: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#143f36",
    color: "#4ade80",
    fontSize: "12px",
  },

  actionGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  editButton: {
    background: "#42e5e8",
    color: "#081426",
    border: "none",
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteButton: {
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  editInput: {
    width: "100%",
    minWidth: "120px",
    background: "#081426",
    color: "#ffffff",
    padding: "10px",
    border: "1px solid #42e5e8",
    borderRadius: "7px",
  },

  saveButton: {
    background: "#4ade80",
    color: "#081426",
    border: "none",
    borderRadius: "7px",
    padding: "9px 14px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  cancelButton: {
    background: "#233c57",
    color: "#ffffff",
    border: "1px solid #456078",
    borderRadius: "7px",
    padding: "9px 14px",
    cursor: "pointer",
  },

  success: {
    color: "#4ade80",
    marginBottom: "16px",
  },

  error: {
    color: "#ff9292",
    marginBottom: "16px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    background: "#132743",
    border: "1px solid #456078",
    borderRadius: "16px",
    padding: "30px",
    width: "100%",
    maxWidth: "430px",
  },

  modalTitle: {
    color: "#ff9292",
    fontSize: "22px",
    marginBottom: "18px",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "25px",
  },
};

export default CustomerCases;
