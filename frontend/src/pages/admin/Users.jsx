import React, { useMemo, useState } from 'react';
import { Search, Filter, Shield, User, Mail, Calendar, X, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import { isDateInRange, useAdminFilters } from '../../features/admin/AdminFiltersContext';

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState('customers');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const { searchQuery, setSearchQuery, dateRange } = useAdminFilters();

    // Mock Data
    const users = [
        { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', status: 'Active', joined: 'Jan 12, 2024', joinedDate: '2024-01-12', lastActive: '2h ago', orders: 12 },
        { id: 2, name: 'Rahul Kumar', email: 'rahul@spicesymphony.com', role: 'owner', status: 'Active', joined: 'Dec 05, 2023', joinedDate: '2023-12-05', lastActive: '5m ago', restaurant: 'Spice Symphony' },
        { id: 3, name: 'Sarah Miller', email: 'sarah@example.com', role: 'customer', status: 'Blocked', joined: 'Feb 20, 2024', joinedDate: '2024-02-20', lastActive: '3d ago', orders: 4 },
        { id: 4, name: 'Admin User', email: 'admin@orderiq.com', role: 'admin', status: 'Active', joined: 'Nov 01, 2023', joinedDate: '2023-11-01', lastActive: 'Now', permissions: 'Super Admin' },
    ];

    const filteredUsers = useMemo(() => {
        const search = searchQuery.trim().toLowerCase();
        return users.filter(u => {
            const matchesRole = u.role === activeTab;
            const matchesSearch = !search
                || u.name.toLowerCase().includes(search)
                || u.email.toLowerCase().includes(search);
            const matchesDate = isDateInRange(u.joinedDate, dateRange);
            const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
            return matchesRole && matchesSearch && matchesDate && matchesStatus;
        });
    }, [users, activeTab, searchQuery, dateRange, statusFilter]);

    const tabs = [
        { id: 'customers', label: 'Customers', icon: User },
        { id: 'owner', label: 'Restaurant Owners', icon: Shield },
        { id: 'admin', label: 'Admins', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Button variant="outline" icon={Filter} onClick={() => setShowFilters(prev => !prev)}>
                            Filters
                        </Button>
                        {showFilters && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</div>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Active', 'Blocked'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-2.5 py-1 rounded text-xs ${statusFilter === status ? 'bg-neutral-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {activeTab === 'admin' && <Button icon={User}>Invite Admin</Button>}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-neutral-900 text-neutral-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card className="overflow-hidden shadow-sm border border-gray-200">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-white border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">{activeTab === 'owner' ? 'Restaurant' : 'Activity'}</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                            <th className="p-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-sm text-gray-500">
                                    No users found for this segment yet. Adjust filters or invite new users.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="hover:bg-gray-50 cursor-pointer group transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.status === 'Active' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                Blocked
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {activeTab === 'owner' ? user.restaurant : (
                                            activeTab === 'admin' ? user.permissions : `${user.orders} Orders`
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{user.joined}</td>
                                    <td className="p-4 text-right">
                                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">View</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            {/* User Detail Drawer */}
            <Drawer
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title="User Profile"
                footer={
                    <div className="flex gap-3">
                        <Button
                            className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            onClick={() => setShowSuspendModal(true)}
                        >
                            Suspend User
                        </Button>
                    </div>
                }
            >
                {selectedUser && (
                    <div className="space-y-8">
                        {/* Header Profile */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {selectedUser.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    Joined {selectedUser.joined}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <p className="text-xs text-uppercase text-gray-500 font-semibold">Status</p>
                                <p className={`text-lg font-bold ${selectedUser.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedUser.status}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                <p className="text-xs text-uppercase text-gray-500 font-semibold">Last Active</p>
                                <p className="text-lg font-bold text-gray-900">{selectedUser.lastActive}</p>
                            </div>
                        </div>

                        {/* Activity Feed Placeholder */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Recent Activity
                            </h4>
                            <div className="border-l-2 border-gray-100 pl-4 space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-300 border-2 border-white"></div>
                                        <p className="text-sm font-medium text-gray-900">Placed an order at Spice Symphony</p>
                                        <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default UsersPage;
