import { useState } from 'react';
import { TrendingUp, DollarSign, Clock, PieChart } from 'lucide-react';

const Analytics = () => {
  const [range, setRange] = useState('7d');
  const [mode, setMode] = useState('all');
  const kpis = [
    { label: 'Orders', value: '1,234', change: '+12%', icon: <TrendingUp size={24} />, color: 'primary' },
    { label: 'Revenue', value: '$24,568', change: '+8%', icon: <DollarSign size={24} />, color: 'success' },
    { label: 'Avg Prep Time', value: '18 min', change: '-2%', icon: <Clock size={24} />, color: 'warning' },
    { label: 'Mode Share', value: '45% Dine-in', icon: <PieChart size={24} />, color: 'secondary' },
  ];

  const topItems = [
    { name: 'Truffle Pasta', qty: 156, revenue: '$3,894' },
    { name: 'Caesar Salad', qty: 128, revenue: '$2,112' },
    { name: 'Chocolate Lava', qty: 89, revenue: '$1,156' },
    { name: 'Margarita Pizza', qty: 76, revenue: '$1,064' },
    { name: 'Garlic Bread', qty: 203, revenue: '$812' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800">Analytics</h1>

      {/* Filters Row */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {['Today', '7d', '30d', 'Custom'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 rounded-lg ${
                  range === '7d'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <select className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option>All Modes</option>
            <option>Delivery</option>
            <option>Pickup</option>
            <option>Dine-in</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${kpi.color}/10`}>
                <div className={`text-${kpi.color}`}>
                  {kpi.icon}
                </div>
              </div>
              <span className={`text-sm font-medium ${kpi.change?.startsWith('+') ? 'text-success' : 'text-error'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{kpi.value}</p>
            <p className="text-sm text-neutral-600">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Line Chart Placeholder */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-800 mb-4">Orders Over Time</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-40 bg-gradient-to-t from-primary/10 to-transparent rounded-lg mb-4" />
              <p className="text-neutral-500">Orders by day visualization</p>
            </div>
          </div>
        </div>

        {/* Donut Chart Placeholder */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-800 mb-4">Orders by Mode</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 rounded-full border-8 border-primary border-t-secondary border-r-accent border-b-success mx-auto mb-4" />
              <p className="text-neutral-500">Mode distribution pie chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Items Table */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-800">Top Selling Items</h3>
            <button className="text-primary hover:text-primary/80 text-sm">
              View all →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left p-3 text-sm font-medium text-neutral-600">Item</th>
                  <th className="text-left p-3 text-sm font-medium text-neutral-600">Qty Sold</th>
                  <th className="text-left p-3 text-sm font-medium text-neutral-600">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, index) => (
                  <tr key={index} className="border-b border-neutral-100">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{item.qty}</td>
                    <td className="p-3 font-medium">{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Peak Hours Heatmap */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-800 mb-4">Peak Hours</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded ${
                    i % 7 === 3 ? 'bg-primary' : 
                    i % 7 === 2 ? 'bg-primary/60' : 
                    i % 7 === 4 ? 'bg-primary/40' : 
                    'bg-neutral-100'
                  }`} />
                ))}
              </div>
              <p className="text-neutral-500">Hourly order volume heatmap</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
