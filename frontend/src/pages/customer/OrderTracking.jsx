import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Clock, MapPin, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const OrderTracking = () => {
    const { id } = useParams();

    // Mock Data
    const order = {
        id: id || 'ORD-7890',
        restaurant: 'Spice Symphony',
        status: 'Preparing',
        estimatedTime: '12:45 PM',
        items: [
            { name: 'Butter Chicken', qty: 1, price: 350 },
            { name: 'Garlic Naan', qty: 2, price: 80 }
        ],
        total: 465,
        driver: {
            name: 'Michael',
            phone: '+91 98765 43210',
            rating: 4.8
        },
        timeline: [
            { status: 'Order Placed', time: '12:10 PM', completed: true },
            { status: 'Confirmed', time: '12:12 PM', completed: true },
            { status: 'Preparing', time: '12:15 PM', completed: true },
            { status: 'On the way', time: '', completed: false },
            { status: 'Delivered', time: '', completed: false },
        ]
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm py-4">
                <div className="max-w-content mx-auto px-4">
                    <Link to="/customer/home" className="text-sm text-neutral-500 hover:text-primary-600 mb-2 inline-flex items-center">
                        &larr; Back to Home
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-900">Track Order</h1>
                    <p className="text-neutral-500">Order #{order.id}</p>
                </div>
            </div>

            <div className="max-w-content mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                {/* Left Col: Status & Map */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 mb-1">Estimated Arrival</h2>
                                <p className="text-3xl font-bold text-primary-600">{order.estimatedTime}</p>
                            </div>
                            <div className="text-right">
                                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 font-semibold rounded-full inline-block">
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative mb-8">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>

                            <div className="relative flex justify-between">
                                {order.timeline.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 
                                        ${step.completed ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}>
                                            {step.completed ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${step.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                            {step.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center border border-gray-200">
                            <div className="text-center">
                                <MapPin className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                                <p className="text-neutral-500 font-medium">Live Map View</p>
                                <p className="text-xs text-neutral-400">(Integration pending)</p>
                            </div>
                        </div>
                    </Card>

                    {/* Driver Info */}
                    <Card className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="Driver" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900">{order.driver.name}</h3>
                                <p className="text-sm text-neutral-500">Your Delivery Partner • ⭐ {order.driver.rating}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <a href={`tel:${order.driver.phone}`} className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-neutral-600">
                                <Phone className="w-5 h-5" />
                            </a>
                            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-neutral-600">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Col: Order Details */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-neutral-900 mb-4">Order Details</h3>
                        <div className="space-y-4 mb-4 border-b border-gray-100 pb-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-neutral-600">
                                        <span className="font-bold text-neutral-900">{item.qty}x</span> {item.name}
                                    </span>
                                    <span className="font-medium text-neutral-900">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between font-bold text-lg text-neutral-900">
                            <span>Total</span>
                            <span>₹{order.total}</span>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <Button variant="outline" className="w-full text-sm">Download Invoice</Button>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-100">
                        <h3 className="font-bold text-primary-900 mb-2">Need Help?</h3>
                        <p className="text-sm text-primary-700 mb-4">Having trouble with your order? Our support team is here to help.</p>
                        <button className="text-primary-700 font-semibold text-sm hover:underline">Contact Support</button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
