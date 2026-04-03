import { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Plus,
  Download,
  Printer,
  Trash2,
  Users,
  ToggleLeft,
  ToggleRight,
  X,
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRestaurant } from '../../features/restaurant/RestaurantContext';
import { tableService } from '../../services/table.service';
import toast from 'react-hot-toast';

const QRCodeManagement = () => {
  const { restaurant } = useRestaurant();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTable, setNewTable] = useState({ label: '', capacity: 4 });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const qrRefs = useRef({});

  // Build the base URL for QR codes
  const baseUrl = window.location.origin;

  useEffect(() => {
    if (restaurant?.id) fetchTables();
  }, [restaurant]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await tableService.getTables(restaurant.id);
      setTables(res.data || []);
    } catch (err) {
      toast.error('Failed to load tables');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!newTable.label.trim()) {
      toast.error('Table label is required');
      return;
    }
    setCreating(true);
    try {
      await tableService.createTable(restaurant.id, newTable);
      toast.success(`Table "${newTable.label}" created!`);
      setNewTable({ label: '', capacity: 4 });
      setShowAddModal(false);
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create table');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (table) => {
    try {
      await tableService.updateTable(restaurant.id, table.id, { isActive: !table.isActive });
      toast.success(`Table "${table.label}" ${table.isActive ? 'deactivated' : 'activated'}`);
      fetchTables();
    } catch (err) {
      toast.error('Failed to update table');
    }
  };

  const handleDelete = async (table) => {
    if (!window.confirm(`Delete table "${table.label}"? This cannot be undone.`)) return;
    try {
      await tableService.deleteTable(restaurant.id, table.id);
      toast.success(`Table "${table.label}" deleted`);
      fetchTables();
    } catch (err) {
      toast.error('Failed to delete table');
    }
  };

  const handleStartEdit = (table) => {
    setEditingId(table.id);
    setEditData({ label: table.label, capacity: table.capacity });
  };

  const handleSaveEdit = async (tableId) => {
    try {
      await tableService.updateTable(restaurant.id, tableId, editData);
      toast.success('Table updated!');
      setEditingId(null);
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update table');
    }
  };

  const handleDownloadQR = (table) => {
    const canvas = qrRefs.current[table.id]?.querySelector('canvas');
    if (!canvas) return;

    // Create a new canvas with padding and label
    const padding = 40;
    const labelHeight = 60;
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width + padding * 2;
    newCanvas.height = canvas.height + padding * 2 + labelHeight;
    const ctx = newCanvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw QR
    ctx.drawImage(canvas, padding, padding);

    // Draw label text
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(table.label, newCanvas.width / 2, canvas.height + padding + 30);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#666666';
    ctx.fillText(restaurant.name, newCanvas.width / 2, canvas.height + padding + 52);

    const url = newCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `QR-${restaurant.name}-${table.label}.png`;
    link.href = url;
    link.click();
  };

  const handlePrintQR = (table) => {
    const canvas = qrRefs.current[table.id]?.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head><title>QR Code — ${table.label}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:Arial,sans-serif;">
          <img src="${dataUrl}" style="width:300px;height:300px;" />
          <h2 style="margin-top:20px;color:#1a1a1a;">${table.label}</h2>
          <p style="color:#666;margin-top:4px;">${restaurant.name}</p>
          <p style="color:#999;font-size:12px;margin-top:12px;">Scan to view menu & order</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  const getQRUrl = (table) => {
    return `${baseUrl}/menu/${restaurant.id}?table=${encodeURIComponent(table.label)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-800">QR Codes & Tables</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">QR Codes & Tables</h1>
          <p className="text-neutral-500 mt-1">Generate QR codes for dine-in table ordering</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
        >
          <Plus size={18} />
          Add Table
        </button>
      </div>

      {/* Info Banner */}
      {tables.length === 0 ? (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-8 text-center">
          <QrCode className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Tables Yet</h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            Create tables and generate QR codes. Customers scan the QR code to view your menu and place dine-in orders directly from their phone.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
          >
            Create Your First Table
          </button>
        </div>
      ) : (
        <>
          {/* How it works */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-neutral-800">How it works</p>
                <p className="text-sm text-neutral-600 mt-1">
                  Print or display the QR code at each table. Customers scan it with their phone camera → your menu opens → they order and pay directly.
                </p>
              </div>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`bg-white rounded-xl border-2 transition-all overflow-hidden ${
                  table.isActive ? 'border-neutral-200 hover:border-primary-200' : 'border-neutral-100 opacity-60'
                }`}
              >
                {/* QR Code Section */}
                <div className="p-6 flex flex-col items-center border-b border-neutral-100 bg-neutral-50/50">
                  <div ref={(el) => (qrRefs.current[table.id] = el)}>
                    <QRCodeCanvas
                      value={getQRUrl(table)}
                      size={180}
                      level="H"
                      includeMargin={true}
                      bgColor="#ffffff"
                      fgColor="#1a1a1a"
                    />
                  </div>
                </div>

                {/* Table Info */}
                <div className="p-5">
                  {editingId === table.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editData.label}
                        onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Table label"
                      />
                      <input
                        type="number"
                        value={editData.capacity}
                        onChange={(e) => setEditData({ ...editData, capacity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="1"
                        placeholder="Capacity"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(table.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                          <Check size={14} /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-neutral-900">{table.label}</h3>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            table.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {table.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                        <Users size={14} />
                        <span>Capacity: {table.capacity}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={() => handleDownloadQR(table)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition"
                        >
                          <Download size={14} /> Download
                        </button>
                        <button
                          onClick={() => handlePrintQR(table)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200 transition"
                        >
                          <Printer size={14} /> Print
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                        <button
                          onClick={() => handleStartEdit(table)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(table)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition"
                        >
                          {table.isActive ? <ToggleRight size={14} className="text-green-600" /> : <ToggleLeft size={14} />}
                          {table.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDelete(table)}
                          className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">Add New Table</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTable} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Table Label *</label>
                <input
                  type="text"
                  value={newTable.label}
                  onChange={(e) => setNewTable({ ...newTable, label: e.target.value })}
                  placeholder='e.g., "T1", "Table 5", "Patio-A"'
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Seating Capacity</label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-neutral-300 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeManagement;
