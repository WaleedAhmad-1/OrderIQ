import React, { useState, useEffect } from 'react';

import {
  Search, Filter, Clock, Package, Truck, Utensils,
  CheckCircle, XCircle, AlertCircle, Printer,
  MessageSquare, User, MapPin, ChevronRight,
  MoreVertical, RefreshCw, Download, Upload, ShoppingBag
} from 'lucide-react';

const LiveOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [countdowns, setCountdowns] = useState({});

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'dinein', label: 'Dine-in' },
  ];

  const statusChips = [
    { id: 'new', label: 'New', count: 3, color: 'bg-primary-500' },
    { id: 'accepted', label: 'Accepted', count: 2, color: 'bg-secondary-500' },
    { id: 'preparing', label: 'Preparing', count: 4, color: 'bg-warning' },
    { id: 'ready', label: 'Ready', count: 2, color: 'bg-success' },
  ];

  const orders = [
    {
      id: 1,
      orderNumber: '#T-105',
      type: 'dinein',
      table: 'Table 12',
      items: 6,
      total: 42.90,
      time: '2:14 PM',
      elapsed: '+06:12',
      status: 'new',
      customerName: 'Alex Johnson',
      customerNotes: 'Extra spicy, no onions',
      itemsList: [
        { name: 'Butter Chicken', quantity: 2, modifiers: 'Spicy', price: 14.00 },
        { name: 'Garlic Naan', quantity: 2, price: 4.50 },
        { name: 'Vegetable Biryani', quantity: 1, price: 12.00 },
        { name: 'Mango Lassi', quantity: 1, price: 3.90 },
      ],
      prepTime: 25,
    },
    {
      id: 2,
      orderNumber: '#D-108',
      type: 'delivery',
      address: '123 Main St, Apt 4B',
      items: 3,
      total: 28.50,
      time: '2:10 PM',
      elapsed: '+10:05',
      status: 'accepted',
      customerName: 'Sarah Miller',
      customerNotes: 'Leave at door, no contact',
      itemsList: [
        { name: 'Chicken Tikka Masala', quantity: 1, price: 15.00 },
        { name: 'Basmati Rice', quantity: 1, price: 4.50 },
        { name: 'Samosa (2pc)', quantity: 1, price: 9.00 },
      ],
      prepTime: 20,
    },
    {
      id: 3,
      orderNumber: '#P-112',
      type: 'pickup',
      pickupName: 'Michael Chen',
      items: 2,
      total: 18.75,
      time: '1:45 PM',
      elapsed: '+45:30',
      status: 'preparing',
      customerName: 'Michael Chen',
      itemsList: [
        { name: 'Paneer Butter Masala', quantity: 1, price: 13.75 },
        { name: 'Plain Naan', quantity: 1, price: 5.00 },
      ],
      prepTime: 15,
    },
    {
      id: 4,
      orderNumber: '#T-107',
      type: 'dinein',
      table: 'Table 8',
      items: 4,
      total: 35.25,
      time: '1:30 PM',
      elapsed: '+60:15',
      status: 'ready',
      customerName: 'David Wilson',
      itemsList: [
        { name: 'Lamb Rogan Josh', quantity: 1, price: 18.50 },
        { name: 'Vegetable Korma', quantity: 1, price: 14.75 },
        { name: 'Onion Kulcha', quantity: 1, price: 5.00 },
        { name: 'Water Bottle', quantity: 1, price: 2.00 },
      ],
      prepTime: 30,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.type === activeTab;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const search = searchQuery.trim().toLowerCase();
    const matchesSearch = !search ||
      order.orderNumber.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      (order.table && order.table.toLowerCase().includes(search)) ||
      (order.address && order.address.toLowerCase().includes(search));
    return matchesTab && matchesStatus && matchesSearch;
  });

  const selectedOrderData = filteredOrders.find(order => order.id === selectedOrder) || filteredOrders[0] || orders[0];

  // Countdown timer for ready orders
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const newCountdowns = { ...prev };
        orders.forEach(order => {
          if (order.status === 'ready') {
            // Simulate countdown from 5:00
            const elapsedSeconds = Math.floor((Date.now() / 1000) % 300);
            const remaining = 300 - elapsedSeconds;
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            newCountdowns[order.id] = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          }
        });
        return newCountdowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'new':
        return { color: 'bg-primary-500', text: 'New' };
      case 'accepted':
        return { color: 'bg-secondary-500', text: 'Accepted' };
      case 'preparing':
        return { color: 'bg-warning', text: 'Preparing' };
      case 'ready':
        return { color: 'bg-success', text: 'Ready' };
      default:
        return { color: 'bg-neutral-400', text: 'Unknown' };
    }
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-4 h-4" />;
      case 'pickup':
        return <Package className="w-4 h-4" />;
      case 'dinein':
        return <Utensils className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Controls Strip (56px height) */}
      <div className="h-14 mb-6 flex items-center justify-between">
        {/* Left: Tabs */}
        <div className="flex items-center space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-8 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Middle: Status Chips */}
        <div className="flex items-center space-x-2">
          {statusChips.map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id === statusFilter ? 'all' : status.id)}
              className={`h-8 px-3 rounded-full text-sm font-medium flex items-center space-x-2 ${statusFilter === status.id
                ? `${status.color} text-white`
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
            >
              <span>{status.label}</span>
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${statusFilter === status.id ? 'bg-white/30' : 'bg-neutral-300'
                }`}>
                {status.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Search & Filters */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-56 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <Filter className="w-5 h-5 text-neutral-600" />
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg p-2 z-20">
                <div className="text-xs font-semibold text-neutral-500 px-2 py-1">Status</div>
                {['all', 'new', 'accepted', 'preparing', 'ready'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md ${
                      statusFilter === status ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
                <div className="border-t border-neutral-100 my-1"></div>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                    setShowFilters(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm rounded-md text-neutral-700 hover:bg-neutral-50"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-Panel Grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Panel 1: Queue (Left - 360px) */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-lg border border-neutral-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Queue</h2>
              <span className="text-sm text-neutral-500">{filteredOrders.length} orders</span>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 overflow-y-auto flex-1">
            {filteredOrders.length === 0 ? (
              <div className="p-6 text-sm text-neutral-500">No orders match the current filters.</div>
            ) : filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isSelected = selectedOrder === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order.id)}
                  className={`
                    p-3 cursor-pointer transition-colors relative
                    ${isSelected
                      ? 'bg-primary-50 border-l-3 border-primary-500'
                      : 'hover:bg-neutral-50'
                    }
                  `}
                >
                  {/* Title Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getOrderTypeIcon(order.type)}
                      <span className="text-sm font-semibold text-neutral-900">
                        {order.type === 'dinein' ? `${order.table}` : `#${order.orderNumber}`}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Meta Row */}
                  <div className="text-xs text-neutral-500 mb-2">
                    {order.items} item{order.items !== 1 ? 's' : ''}
                  </div>

                  {/* Time/Status Row */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">
                      {order.time} • {order.status === 'ready' ? 'Auto-archives in' : order.elapsed}
                      {order.status === 'ready' && countdowns[order.id] && (
                        <span className="font-medium ml-1">{countdowns[order.id]}</span>
                      )}
                    </div>
                    <div className={`h-6 px-2 rounded-full text-xs font-semibold flex items-center ${statusConfig.color} text-white`}>
                      {statusConfig.text}
                    </div>
                  </div>

                  {/* New Order Highlight */}
                  {order.status === 'new' && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Detail (Center) */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-lg border border-neutral-200 flex flex-col overflow-hidden">
          {/* Detail Header (72px) */}
          <div className="p-4 border-b border-neutral-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-base font-semibold text-neutral-900">
                    {selectedOrderData.type === 'dinein'
                      ? `${selectedOrderData.table} • Order ${selectedOrderData.orderNumber}`
                      : `Order ${selectedOrderData.orderNumber}`
                    }
                  </h2>
                  <div className={`h-6 px-2 rounded-full text-xs font-semibold flex items-center ${getStatusConfig(selectedOrderData.status).color} text-white`}>
                    {getStatusConfig(selectedOrderData.status).text}
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mt-1">
                  Received {selectedOrderData.time}
                  {selectedOrderData.status === 'ready' && countdowns[selectedOrderData.id] && (
                    <span className="ml-4 font-medium">
                      Auto-archives in {countdowns[selectedOrderData.id]}
                    </span>
                  )}
                </p>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View in History
              </button>
            </div>
          </div>

          {/* Context Block */}
          <div className="p-4 border-b border-neutral-200 flex-shrink-0">
            {selectedOrderData.type === 'dinein' ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-semibold text-neutral-900">{selectedOrderData.table}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                      Dine-in
                    </div>
                    <div className="text-sm text-neutral-600">
                      Customer: {selectedOrderData.customerName}
                    </div>
                  </div>
                </div>
                <button className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                  <MoreVertical className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            ) : selectedOrderData.type === 'delivery' ? (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Truck className="w-5 h-5 text-primary-600" />
                  <span className="font-medium">Delivery</span>
                </div>
                <div className="text-sm text-neutral-900 mb-1">{selectedOrderData.address}</div>
                <div className="text-sm text-neutral-600">Customer: {selectedOrderData.customerName}</div>
                <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  View Instructions
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Package className="w-5 h-5 text-secondary-600" />
                  <span className="font-medium">Pickup</span>
                </div>
                <div className="text-sm text-neutral-900 mb-1">Name: {selectedOrderData.pickupName}</div>
                <div className="text-sm text-neutral-600">Ready for pickup</div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="p-4 overflow-y-auto flex-1">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Items</h3>
            <div className="space-y-4">
              {selectedOrderData.itemsList.map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                        {item.modifiers && (
                          <p className="text-xs text-neutral-500 mt-1">{item.modifiers}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    ${item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}
                  </span>
                </div>
              ))}
            </div>

            {/* Customer Notes */}
            {selectedOrderData.customerNotes && (
              <div className="mt-6 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 mb-1">Customer Notes</p>
                    <p className="text-sm text-neutral-700">{selectedOrderData.customerNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prep Time Chips */}
          <div className="p-4 border-t border-neutral-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-3">Prep time</p>
                <div className="flex items-center space-x-2">
                  {[15, 20, 25, 30].map((minutes) => (
                    <button
                      key={minutes}
                      className={`h-8 px-3 rounded-lg text-sm font-medium ${selectedOrderData.prepTime === minutes
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                    >
                      {minutes} min
                    </button>
                  ))}
                  <button className="h-8 px-3 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200">
                    Custom
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar (72px) */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                Est. prep: {selectedOrderData.prepTime} minutes
              </div>
              <div className="flex items-center space-x-3">
                {selectedOrderData.status === 'new' && (
                  <>
                    <button className="h-10 px-4 bg-error/10 text-error rounded-lg font-medium hover:bg-error/20">
                      Reject
                    </button>
                    <button className="h-10 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                      Accept Order
                    </button>
                  </>
                )}
                {selectedOrderData.status === 'accepted' && (
                  <button className="h-10 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                    Mark Preparing
                  </button>
                )}
                {selectedOrderData.status === 'preparing' && (
                  <button className="h-10 px-4 bg-success text-white rounded-lg font-medium hover:bg-success/90">
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Operational Notes (Right - 320px) */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Customer Notes Card */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Customer Notes</h3>
            {selectedOrderData.customerNotes ? (
              <p className="text-sm text-neutral-700">{selectedOrderData.customerNotes}</p>
            ) : (
              <p className="text-sm text-neutral-400">No notes from customer</p>
            )}
          </div>

          {/* Allergens/Dietary */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Allergens & Dietary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Gluten-free</span>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Vegetarian</span>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Nut Allergy</span>
                <XCircle className="w-4 h-4 text-neutral-300" />
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Internal Notes</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Edit
              </button>
            </div>
            <textarea
              placeholder="Add internal notes here..."
              className="w-full h-24 p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
              defaultValue="Table 12 requested extra napkins"
            />
          </div>

          {/* Print Placeholder */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center space-x-3">
              <Printer className="w-5 h-5 text-neutral-600" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Print Receipt</p>
                <p className="text-xs text-neutral-500">Print kitchen ticket or customer receipt</p>
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200">
              Print Now
            </button>
          </div>

          {/* Support Link */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <button className="w-full flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Contact Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification (Bottom Right) */}
      <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 p-4 transform animate-fade-in-up">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">New Order Received</p>
            <p className="text-sm text-neutral-500">Table 5 • 3 items</p>
            <p className="text-xs text-neutral-400 mt-1">Just now</p>
          </div>
          <button className="ml-auto text-neutral-400 hover:text-neutral-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveOrders;
