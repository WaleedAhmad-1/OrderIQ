import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Camera, Save } from 'lucide-react';
import DashboardSidebar from '../../components/layout/Customer/DashboardSidebar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ProfileSettings = () => {
    const [formData, setFormData] = useState({
        fullName: 'Sam',
        email: 'sam@example.com',
        phone: '+91 98765 43210',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = () => {
        // Add save logic here
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
                        {/* Profile Settings Section */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-neutral-900 mb-6">Profile Settings</h2>

                            {/* Profile Photo */}
                            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl">
                                        S
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-bold text-neutral-900 mb-1">Profile Photo</h3>
                                    <p className="text-sm text-neutral-500 mb-2">Update your profile picture</p>
                                    <button className="text-sm text-primary-600 font-medium hover:underline">
                                        Upload new photo
                                    </button>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-5">
                                <h3 className="font-bold text-neutral-900">Basic Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mt-8 pt-8">
                                <h3 className="font-bold text-neutral-900 mb-5">Change Password</h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                placeholder="Enter current password"
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                placeholder="Enter new password"
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm new password"
                                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8">
                                <button className="px-6 py-3 border border-gray-200 text-neutral-700 rounded-lg hover:bg-gray-50 font-medium">
                                    Cancel
                                </button>
                                <Button
                                    onClick={handleSaveProfile}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
