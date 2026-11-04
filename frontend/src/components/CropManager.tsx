import React, { useState, useEffect } from "react";

const API_URL = "https://e-farmer-2331515-2.onrender.com/crops";

interface Crop {
  id: number;
  name: string;
  type: string;
  quantity: number;
}

export default function CropsManager() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [form, setForm] = useState({ name: "", type: "", quantity: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCrops = async () => {
    try {
      const res = await fetch(API_URL);
      const data: Crop[] = await res.json();
      setCrops(data);
    } catch (err) {
      console.error("Failed to fetch crops:", err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      type: form.type,
      quantity: Number(form.quantity)
    };

    if (editingId !== null) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({ name: "", type: "", quantity: "" });
    fetchCrops();
  };

  const handleEditClick = (crop: Crop) => {
    setEditingId(crop.id);
    setForm({ name: crop.name, type: crop.type, quantity: String(crop.quantity) });
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchCrops();
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>🌾 Crops Management System</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Crop Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Type (e.g. Grain)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit">{editingId !== null ? "Update" : "Add"}</button>
        {editingId !== null && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", type: "", quantity: "" }); }}>
            Cancel
          </button>
        )}
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr key={crop.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{crop.id}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{crop.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{crop.type}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{crop.quantity}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button onClick={() => handleEditClick(crop)} style={{ marginRight: "5px" }}>Edit</button>
                <button onClick={() => handleDelete(crop.id)} style={{ color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
          {crops.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "10px", border: "1px solid #ccc" }}>No crops found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}