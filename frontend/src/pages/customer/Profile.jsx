import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/layout/Customer/DashboardSidebar';
import Card from '../../components/ui/Card';
import { useCart } from '../../features/customer/CartContext';


const Profile = () => {

    const navigate = useNavigate();
    const { cartItems, addToCart, updateQuantity, clearCart } = useCart();

    const recentOrders = [
        {
            id: 'ORD-7890',
            date: 'Today, 12:10 PM',
            restaurant: { id: 1, name: 'Spice Symphony' },
            items: 'Butter Chicken, Naan',
            itemsData: [
                { id: 101, name: 'Butter Chicken', price: '₹350', quantity: 1 },
                { id: 102, name: 'Garlic Naan', price: '₹115', quantity: 1 }
            ],
            total: '₹465',
            status: 'In Progress'
        },
        {
            id: 'ORD-7888',
            date: 'Yesterday, 8:45 PM',
            restaurant: { id: 2, name: 'Burger Junction' },
            items: 'Classic Burger x2',
            itemsData: [
                { id: 201, name: 'Classic Burger', price: '₹220', quantity: 2 }
            ],
            total: '₹440',
            status: 'Delivered'
        },
        {
            id: 'ORD-7812',
            date: 'Jan 15, 1:30 PM',
            restaurant: { id: 3, name: 'Tokyo Sushi' },
            items: 'California Roll',
            itemsData: [
                { id: 301, name: 'California Roll', price: '₹280', quantity: 1 }
            ],
            total: '₹280',
            status: 'Delivered'
        },
    ];

    const handleReorder = (order) => {
        if (cartItems.length > 0) {
            const ok = window.confirm('Replace your current cart with this reorder?');
            if (!ok) return;
            clearCart();
        }

        order.itemsData.forEach((item) => {
            addToCart(
                { id: item.id, name: item.name, price: item.price },
                order.restaurant
            );
            if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
            }
        });

        navigate('/customer/checkout');
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-12">
            <div className="max-w-content mx-auto px-4">
                <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Account</h1>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <DashboardSidebar userName="Sam" userRole="Customer" />

                    {/* Content Area */}
                    <div className="md:col-span-3 space-y-6">
                        {/* Orders Section */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-neutral-900 mb-4">Recent Orders</h2>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary-100 transition shadow-sm">
                                        <div className="mb-2 sm:mb-0">
                                            <div className="flex justify-between sm:justify-start sm:items-center gap-2 mb-1">
                                                <h3 className="font-bold text-neutral-900">{order.restaurant.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-neutral-500">{order.items}</p>
                                            <p className="text-xs text-neutral-400 mt-1">{order.date}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:gap-6">
                                            <span className="font-bold text-neutral-900">{order.total}</span>
                                            <button
                                                className="text-primary-600 text-sm font-medium hover:underline"
                                                onClick={() => handleReorder(order)}
                                            >
                                                Reorder
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;