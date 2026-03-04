import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, Copy, Filter, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';

const MenuManagement = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  useEffect(() => {
    const shouldOpenFromState = location.state?.openEditor;
    const shouldOpenFromQuery = searchParams.get('add') === '1';
    if (shouldOpenFromState || shouldOpenFromQuery) {
      setCurrentItem(location.state?.currentItem ?? null);
      setEditorOpen(true);
    }
  }, [location.state, searchParams]);

  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Appetizers', count: 12, visible: true },
    { id: 2, name: 'Main Course', count: 24, visible: true },
    { id: 3, name: 'Desserts', count: 8, visible: true },
    { id: 4, name: 'Drinks', count: 15, visible: true },
    { id: 5, name: 'Specials', count: 5, visible: false },
  ]);

 
  const [items, setItems] = useState([
    { id: 1, name: 'Margherita Pizza', category: 'Main Course', price: 12.99, inStock: true, delivery: true, pickup: true, dineIn: true, image: null, description: 'Classic tomato and mozzarella' },
    { id: 2, name: 'Caesar Salad', category: 'Appetizers', price: 8.99, inStock: true, delivery: true, pickup: true, dineIn: true, image: null, description: 'Fresh romaine with Caesar dressing' },
    { id: 3, name: 'Chocolate Lava Cake', category: 'Desserts', price: 6.99, inStock: false, delivery: true, pickup: true, dineIn: true, image: null, description: 'Warm chocolate cake with molten center' },
    { id: 4, name: 'Craft Cocktail', category: 'Drinks', price: 9.99, inStock: true, delivery: false, pickup: false, dineIn: true, image: null, description: 'Signature cocktail' },
  ]);

  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setEditorOpen(true);
  };

  const handleAddCategory = () => {
    const name = window.prompt('Category name');
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories(prev => {
      const exists = prev.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
      if (exists) return prev;
      const nextId = prev.length ? Math.max(...prev.map(c => c.id)) + 1 : 1;
      return [...prev, { id: nextId, name: trimmed, count: 0, visible: true }];
    });
  };

  const handleSaveItem = () => {
    setEditorOpen(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'in' && item.inStock) ||
      (stockFilter === 'out' && !item.inStock);
    // Note: simplified logic for mode filter for demo
    const matchesMode = modeFilter === 'all' || item[modeFilter];
    const matchesCategory = selectedCategory === 'all' ||
      item.category === categories.find(c => c.id === selectedCategory)?.name;
    return matchesSearch && matchesStock && matchesMode && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <div className="hidden md:flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
            {['all', 'in', 'out'].map(filter => (
              <button
                key={filter}
                onClick={() => setStockFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${stockFilter === filter ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                {filter === 'all' ? 'All' : filter === 'in' ? 'In Stock' : 'Out of Stock'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={Plus} onClick={handleAddCategory}>Add Category</Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => { setCurrentItem(null); setEditorOpen(true); }}>Add Item</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
          <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900">Categories</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <span>All Items</span>
              <span className="bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'}`}
              >
                <span>{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">{cat.count}</span>
                  <span className={`w-2 h-2 rounded-full ${cat.visible ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedItems.length > 0 && (
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-primary-700">{selectedItems.length} items selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs bg-white">Mark Out of Stock</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-white text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Item</th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-neutral-500">
                      No menu items match the current filters. Adjust filters or add a new item.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors group">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
                            {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-lg" /> : <ImageIcon size={16} />}
                          </div>
                          <div>
                            <div className="font-medium text-neutral-900">{item.name}</div>
                            <div className="text-xs text-neutral-500 truncate max-w-[200px]">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-neutral-900">₹{item.price}</td>
                      <td className="p-4 text-sm text-neutral-600">{item.category}</td>
                      <td className="p-4">
                        <button className={`px-2 py-1 rounded-full text-xs font-medium border ${item.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditItem(item)} className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                          <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded"><Copy size={16} /></button>
                          <button className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editor Drawer (Overlay) */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setEditorOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="font-bold text-lg text-neutral-900">{currentItem ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={() => setEditorOpen(false)} className="text-neutral-500 hover:text-neutral-900">Close</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Item Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" defaultValue={currentItem?.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea rows={3} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" defaultValue={currentItem?.description}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price (₹)</label>
                    <input type="number" className="w-full px-3 py-2 border border-neutral-300 rounded-lg outline-none" defaultValue={currentItem?.price} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                    <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg outline-none">
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Toggles 
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h4 className="font-medium text-neutral-900">Availability</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Available for Delivery</span>
                  <input type="checkbox" className="toggle" defaultChecked={currentItem?.delivery ?? true} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Available for Pickup</span>
                  <input type="checkbox" className="toggle" defaultChecked={currentItem?.pickup ?? true} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">In Stock</span>
                  <input type="checkbox" className="toggle" defaultChecked={currentItem?.inStock ?? true} />
                </div>

              </div>
            */}
            
            </div>

            <div className="p-4 border-t border-neutral-200 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleSaveItem}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
