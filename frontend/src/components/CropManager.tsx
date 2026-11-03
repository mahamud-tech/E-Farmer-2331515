import React, { useState, useEffect } from 'react';
import { Crop, CropFormData } from '../types/crop';

const API_BASE_URL = "https://e-farmer-2331515-1.onrender.com";

export const CropManager: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState<CropFormData>({
    name: '',
    category: '',
    quantity: 0,
    price_per_unit: 0,
    status: 'available',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/crops/`);
      const data = await res.json();
      setCrops(data);
    } catch (err) {
      console.error('Error fetching crops:', err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchSingleCrop = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/crops/${id}`);
      const data = await res.json();
      setSelectedCrop(data);
    } catch (err) {
      console.error('Error fetching single crop:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_BASE_URL}/crops/${editingId}` : `${API_BASE_URL}/crops/`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', category: '', quantity: 0, price_per_unit: 0, status: 'available' });
        setEditingId(null);
        fetchCrops();
      }
    } catch (err) {
      console.error('Error saving crop:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/crops/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedCrop?.id === id) setSelectedCrop(null);
        fetchCrops();
      }
    } catch (err) {
      console.error('Error deleting crop:', err);
    }
  };

  const handleEditInit = (crop: Crop) => {
    setEditingId(crop.id);
    setFormData({
      name: crop.name,
      category: crop.category,
      quantity: crop.quantity,
      price_per_unit: crop.price_per_unit,
      status: crop.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'available':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' };
      case 'harvested':
        return { backgroundColor: '#fff3e0', color: '#ef6c00', border: '1px solid #ffcc80' };
      case 'sold':
        return { backgroundColor: '#eceff1', color: '#455a64', border: '1px solid #cfd8dc' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#616161', border: '1px solid #e0e0e0' };
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header Banner */}
      <div style={styles.headerBanner}>
        <h1 style={styles.appTitle}>🌿 Efarmer</h1>
        <p style={styles.appSubtitle}>Smart Crop Inventory & Farm Management System</p>
      </div>

      {/* Main Card Container */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>{editingId ? '✏️ Edit Crop Record' : '🌱 Add New Crop'}</h3>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Crop Name</label>
            <input
              type="text"
              placeholder="e.g. Organic Rice"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <input
              type="text"
              placeholder="e.g. Grains"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Quantity (kg)</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Price / Unit ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.price_per_unit}
              onChange={(e) => setFormData({ ...formData, price_per_unit: parseFloat(e.target.value) || 0 })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={styles.select}
            >
              <option value="available">Available</option>
              <option value="harvested">Harvested</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryButton}>
              {editingId ? 'Update Record' : '+ Add Crop'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', category: '', quantity: 0, price_per_unit: 0, status: 'available' });
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Inventory Table Card */}
      <div style={styles.card}>
        <div style={styles.tableHeaderContainer}>
          <h3 style={styles.sectionTitle}>📦 Crop Inventory List</h3>
          <span style={styles.countBadge}>{crops.length} Total Items</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>Crop Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Price / Unit</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyState}>
                    No crops added yet. Fill out the form above to get started! 🌾
                  </td>
                </tr>
              ) : (
                crops.map((crop, index) => (
                  <tr key={crop.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#1b5e20' }}>{crop.name}</td>
                    <td style={styles.td}>{crop.category}</td>
                    <td style={styles.td}>{crop.quantity} kg</td>
                    <td style={styles.td}>${crop.price_per_unit.toFixed(2)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...getStatusBadgeStyle(crop.status) }}>
                        {crop.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <div style={styles.actionButtonsContainer}>
                        <button onClick={() => fetchSingleCrop(crop.id)} style={styles.actionBtnView}>View</button>
                        <button onClick={() => handleEditInit(crop)} style={styles.actionBtnEdit}>Edit</button>
                        <button onClick={() => handleDelete(crop.id)} style={styles.actionBtnDelete}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Crop Detail Modal/Card */}
      {selectedCrop && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>🌾 Crop Details</h3>
            <div style={styles.modalBody}>
              <p><strong>ID Code:</strong> <span style={styles.monoText}>{selectedCrop.id}</span></p>
              <p><strong>Name:</strong> {selectedCrop.name}</p>
              <p><strong>Category:</strong> {selectedCrop.category}</p>
              <p><strong>Quantity:</strong> {selectedCrop.quantity} kg</p>
              <p><strong>Price per Unit:</strong> ${selectedCrop.price_per_unit.toFixed(2)}</p>
              <p><strong>Current Status:</strong> {selectedCrop.status}</p>
              <p><strong>Created At:</strong> {selectedCrop.created_at ? new Date(selectedCrop.created_at).toLocaleString() : 'N/A'}</p>
            </div>
            <button onClick={() => setSelectedCrop(null)} style={styles.primaryButton}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Modern Elegant Styling Dictionary with Explicit Black Input Text */
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f1',
    padding: '30px 20px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: '#333',
  },
  headerBanner: {
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
    color: '#fff',
    padding: '35px 20px',
    borderRadius: '16px',
    textAlign: 'center' as const,
    marginBottom: '25px',
    boxShadow: '0 10px 25px rgba(46, 125, 50, 0.2)',
  },
  appTitle: {
    margin: '0 0 8px 0',
    fontSize: '2.4rem',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  appSubtitle: {
    margin: 0,
    fontSize: '1.05rem',
    opacity: 0.9,
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '25px 30px',
    marginBottom: '25px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    borderBottom: '2px solid #f1f5f9',
    paddingBottom: '10px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    alignItems: 'end',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    color: '#000000', // Explicit black text for typing visibility
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: '#f8fafc',
  },
  select: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    color: '#000000', // Explicit black text for dropdown visibility
    outline: 'none',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    gridColumn: '1 / -1',
    marginTop: '10px',
  },
  primaryButton: {
    backgroundColor: '#2e7d32',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  tableHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  countBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left' as const,
  },
  tableHeadRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    padding: '14px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  td: {
    padding: '14px 16px',
    fontSize: '0.95rem',
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
  },
  trEven: {
    backgroundColor: '#ffffff',
  },
  trOdd: {
    backgroundColor: '#fafccf2',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    display: 'inline-block',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
  },
  actionBtnView: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  actionBtnEdit: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  actionBtnDelete: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    marginTop: 0,
    color: '#1e293b',
    borderBottom: '2px solid #f1f5f9',
    paddingBottom: '10px',
  },
  modalBody: {
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    fontSize: '0.95rem',
  },
  monoText: {
    fontFamily: 'monospace',
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
};