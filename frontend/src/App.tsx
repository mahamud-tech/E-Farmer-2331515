import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.PROD ? "/api/crops" : "http://127.0.0.1:8000/crops";

interface Crop {
  id: number;
  name: string;
  type: string;
  quantity: number;
  price: number;
  status?: string;
}

export default function App() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "0",
    price: "0",
    status: "Available"
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  // 1. VIEW ALL CROPS
  const fetchCrops = async () => {
    try {
      const res = await fetch(API_URL);
      const data: Crop[] = await res.json();
      setCrops(data);
    } catch (err) {
      console.error("Failed to load crops:", err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. ADD / EDIT CROP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      type: formData.type,
      quantity: parseInt(formData.quantity) || 0,
      price: parseFloat(formData.price) || 0,
      status: formData.status
    };

    if (editingId !== null) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    setFormData({ name: "", type: "", quantity: "0", price: "0", status: "Available" });
    fetchCrops();
  };

  const handleEditClick = (crop: Crop) => {
    setEditingId(crop.id);
    setFormData({
      name: crop.name,
      type: crop.type,
      quantity: String(crop.quantity),
      price: String(crop.price || 0),
      status: crop.status || "Available"
    });
  };

  // 3. DELETE CROP
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (selectedCrop?.id === id) setSelectedCrop(null);
      fetchCrops();
    }
  };

  return (
    <div style={{ backgroundColor: "#eef3ef", minHeight: "100vh", paddingBottom: "50px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      
      {/* Top Green Banner */}
      <div style={{ 
        backgroundColor: "#2e7d32", 
        color: "#ffffff", 
        textAlign: "center", 
        padding: "30px 20px", 
        borderBottomLeftRadius: "16px", 
        borderBottomRightRadius: "16px",
        boxShadow: "0 4px 10px rgba(46, 125, 50, 0.2)"
      }}>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 6px 0", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          🌱 Efarmer
        </h1>
        <p style={{ margin: 0, fontSize: "1.05rem", opacity: 0.9 }}>
          Smart Crop Inventory & Farm Management System
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "30px auto 0 auto", padding: "0 20px" }}>
        
        {/* ADD / EDIT CROP CARD */}
        <div style={cardStyle}>
          <h2 style={cardHeaderStyle}>
            🌱 {editingId !== null ? "Edit Crop Details" : "Add New Crop"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Input Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              
              <div>
                <label style={labelStyle}>Crop Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Quantity (kg)</label>
                <input
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Price / Unit ($)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            {/* Buttons Row */}
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <button type="submit" style={greenButtonStyle}>
                + {editingId !== null ? "Update Crop" : "Add Crop"}
              </button>
              {editingId !== null && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setFormData({ name: "", type: "", quantity: "0", price: "0", status: "Available" }); }}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CROP INVENTORY LIST CARD */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ ...cardHeaderStyle, margin: 0 }}>
              📦 Crop Inventory List
            </h2>
            <span style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "6px 14px", borderRadius: "20px", fontWeight: "600", fontSize: "0.9rem" }}>
              {crops.length} Total Items
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8faf9", borderBottom: "2px solid #e0e0e0" }}>
                  <th style={thStyle}>CROP NAME</th>
                  <th style={thStyle}>CATEGORY</th>
                  <th style={thStyle}>QUANTITY</th>
                  <th style={thStyle}>PRICE / UNIT</th>
                  <th style={thStyle}>STATUS</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ ...tdStyle, fontWeight: "600", color: "#2c3e50" }}>{crop.name}</td>
                    <td style={tdStyle}>{crop.type}</td>
                    <td style={tdStyle}>{crop.quantity} kg</td>
                    <td style={tdStyle}>${crop.price ? crop.price.toFixed(2) : "0.00"}</td>
                    <td style={tdStyle}>
                      <span style={{ 
                        padding: "4px 10px", 
                        borderRadius: "12px", 
                        fontSize: "0.85rem", 
                        fontWeight: "600",
                        backgroundColor: crop.status === "Out of Stock" ? "#ffebee" : "#e8f5e9",
                        color: crop.status === "Out of Stock" ? "#c62828" : "#2e7d32"
                      }}>
                        {crop.status || "Available"}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <button onClick={() => setSelectedCrop(crop)} style={actionViewStyle}>
                        👁️ View
                      </button>
                      <button onClick={() => handleEditClick(crop)} style={actionEditStyle}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(crop.id)} style={actionDeleteStyle}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {crops.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
                      No items in inventory. Use the form above to add your first crop!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SINGLE ITEM VIEW MODAL */}
      {selectedCrop && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, color: "#2e7d32", fontSize: "1.4rem" }}>🌱 Crop Details View</h3>
              <button onClick={() => setSelectedCrop(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#666" }}>✕</button>
            </div>
            <div style={{ background: "#f9fbf9", padding: "16px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
              <p style={detailRowStyle}><strong>Item ID:</strong> #{selectedCrop.id}</p>
              <p style={detailRowStyle}><strong>Crop Name:</strong> {selectedCrop.name}</p>
              <p style={detailRowStyle}><strong>Category:</strong> {selectedCrop.type}</p>
              <p style={detailRowStyle}><strong>Quantity:</strong> {selectedCrop.quantity} kg</p>
              <p style={detailRowStyle}><strong>Price / Unit:</strong> ${selectedCrop.price ? selectedCrop.price.toFixed(2) : "0.00"}</p>
              <p style={detailRowStyle}><strong>Status:</strong> {selectedCrop.status || "Available"}</p>
              <p style={detailRowStyle}><strong>Total Stock Value:</strong> ${((selectedCrop.price || 0) * selectedCrop.quantity).toFixed(2)}</p>
            </div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button onClick={() => setSelectedCrop(null)} style={greenButtonStyle}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Visual Palette & Component Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "28px",
  marginBottom: "25px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
};

const cardHeaderStyle = {
  margin: "0 0 20px 0",
  fontSize: "1.35rem",
  color: "#1b3823",
  fontWeight: "700"
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#4a5568"
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.95rem",
  outline: "none",
  backgroundColor: "#ffffff", // Pure white background
  color: "#1b3823",            // Dark visible text color
  boxSizing: "border-box" as const
};

const greenButtonStyle = {
  backgroundColor: "#2e7d32",
  color: "#ffffff",
  border: "none",
  padding: "10px 24px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "0.95rem",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(46, 125, 50, 0.2)",
  alignSelf: "flex-start"
};

const cancelButtonStyle = {
  backgroundColor: "#757575",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "0.95rem",
  cursor: "pointer"
};

const thStyle = {
  padding: "14px 16px",
  fontSize: "0.8rem",
  fontWeight: "700",
  color: "#4a5568",
  letterSpacing: "0.05em"
};

const tdStyle = {
  padding: "14px 16px",
  fontSize: "0.95rem",
  color: "#4a5568"
};

const actionViewStyle = {
  backgroundColor: "#0284c7",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  fontSize: "0.8rem",
  cursor: "pointer",
  marginRight: "6px"
};

const actionEditStyle = {
  backgroundColor: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  fontSize: "0.8rem",
  cursor: "pointer",
  marginRight: "6px"
};

const actionDeleteStyle = {
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  fontSize: "0.8rem",
  cursor: "pointer"
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContentStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "12px",
  maxWidth: "450px",
  width: "90%",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
};

const detailRowStyle = {
  margin: "10px 0",
  color: "#333",
  fontSize: "0.95rem"
};