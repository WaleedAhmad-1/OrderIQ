import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestaurantDashboard = () => {
  const navigate=useNavigate();
  const stats = [
    { label: 'Today\'s Orders', value: '24', change: '+12%', icon: <TrendingUp size={24} />, color: 'primary' },
    { label: 'Active Staff', value: '3/5', icon: <Users size={24} />, color: 'secondary' },
    { label: 'Avg Prep Time', value: '18 min', change: '-2%', icon: <Clock size={24} />, color: 'warning' },
    { label: 'Today\'s Revenue', value: '$1,245', icon: <DollarSign size={24} />, color: 'success' },
  ];

  const recentOrders = [
    { id: 'T-101', table: 'Table 5', items: 2, amount: '$45.50', status: 'Preparing' },
    { id: 'D-202', table: null, items: 3, amount: '$78.25', status: 'Pending' },
    { id: 'P-103', table: null, items: 1, amount: '$24.99', status: 'Ready' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                <div className={`text-${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              {stat.change && (
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
            <p className="text-sm text-neutral-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate("/restaurant/menu?add=1", { state: { openEditor: true, currentItem: null } })} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <div className="text-primary">+</div>
                </div>
                <div>
                  <p className="font-medium">Add Menu Item</p>
                  <p className="text-sm text-neutral-600">Create new item</p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <div className="text-secondary">🕐</div>
                </div>
                <div>
                  <p className="font-medium">Update Hours</p>
                  <p className="text-sm text-neutral-600">Change operating hours</p>
                </div>
              </div>
            </button>
            <button onClick={()=> navigate("/restaurant/team ")}className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <div className="text-success">👥</div>
                </div>
                <div>
                  <p className="font-medium">Invite Staff</p>
                  <p className="text-sm text-neutral-600">Add team member</p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <div className="text-warning">📊</div>
                </div>
                <div>
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-neutral-600">Analytics dashboard</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-800">Recent Orders</h2>
            <button onClick={ ()=>navigate("/restaurant/order-history")}  className="text-primary hover:text-primary/80 text-sm">
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-neutral-600">
                    {order.table || 'Pickup'} • {order.items} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    order.status === 'Ready' ? 'bg-success/10 text-success' :
                    order.status === 'Preparing' ? 'bg-warning/10 text-warning' :
                    'bg-neutral-100 text-neutral-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;