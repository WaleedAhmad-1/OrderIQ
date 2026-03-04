import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase } from 'lucide-react';
import DashboardSidebar from '../../components/layout/Customer/DashboardSidebar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Addresses = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        fullAddress: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
    });

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            label: 'Home',
            icon: Home,
            fullAddress: '123 Main Street, Apartment 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            phone: '+1 234 567 8900',
            isDefault: true,
        },
        {
            id: 2,
            label: 'Work',
            icon: Briefcase,
            fullAddress: 'Floor 4, Tech Park, Sector 42',
            city: 'Gurugram',
            state: 'HR',
            zip: '122002',
            phone: '+91 98765 43210',
            isDefault: false,
        },
    ]);

    const handleSetDefault = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const handleDelete = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const handleEdit = (address) => {
        setIsEditing(true);
        setCurrentAddressId(address.id);
        setFormData({
            label: address.label,
            fullAddress: address.fullAddress,
            city: address.city,
            state: address.state,
            zip: address.zip,
            phone: address.phone,
        });
        setShowAddModal(true);
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setCurrentAddressId(null);
        setFormData({
            label: '',
            fullAddress: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
        });
        setShowAddModal(true);
    };

    const handleSave = () => {
        if (isEditing) {
            setAddresses(addresses.map(addr =>
                addr.id === currentAddressId
                    ? { ...addr, ...formData }
                    : addr
            ));
        } else {
            const newAddress = {
                id: addresses.length + 1,
                ...formData,
                icon: formData.label.toLowerCase().includes('work') ? Briefcase : Home,
                isDefault: addresses.length === 0,
            };
            setAddresses([...addresses, newAddress]);
        }
        setShowAddModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                        {/* Addresses Section */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-neutral-900">Saved Addresses</h2>
                                <Button
                                    onClick={handleOpenAddModal}
                                    className="flex items-center gap-2"
                                    variant="primary"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New Address
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className="border border-gray-100 rounded-xl p-5 hover:border-primary-100 transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4 flex-1">
                                                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                                                    <address.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-neutral-900">{address.label}</h3>
                                                        {address.isDefault && (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-neutral-600">{address.fullAddress}</p>
                                                    <p className="text-sm text-neutral-600">
                                                        {address.city}, {address.state} {address.zip}
                                                    </p>
                                                    <p className="text-sm text-neutral-500 mt-1">{address.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(address)}
                                                    className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(address.id)}
                                                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(address.id)}
                                                className="mt-3 text-sm text-primary-600 font-medium hover:underline"
                                            >
                                                Set as default
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {addresses.length === 0 && (
                                <div className="text-center py-12">
                                    <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">No addresses saved</h3>
                                    <p className="text-neutral-500 mb-4">Add your first delivery address</p>
                                    <Button onClick={handleOpenAddModal}>
                                        Add Address
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add/Edit Address Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-neutral-900 mb-4">
                            {isEditing ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="label"
                                value={formData.label}
                                onChange={handleInputChange}
                                placeholder="Label (e.g., Home, Work)"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <input
                                type="text"
                                name="fullAddress"
                                value={formData.fullAddress}
                                onChange={handleInputChange}
                                placeholder="Full Address"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="State"
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleInputChange}
                                placeholder="Zip Code"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 text-neutral-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                {isEditing ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Addresses;
