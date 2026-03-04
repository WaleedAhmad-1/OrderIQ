import React, { useMemo } from 'react';
import { TrendingUp, Users, Store, DollarSign, Activity, AlertCircle, ShoppingBag, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { DATE_RANGE_OPTIONS, getDateRangeLabel, useAdminFilters } from '../../features/admin/AdminFiltersContext';

const Dashboard = () => {
    const { dateRange, setDateRange } = useAdminFilters();

    const analytics = useMemo(() => {
        const byRange = {
            last_7_days: {
                kpis: [
                    { label: 'GMV', value: '$45,230', change: '+12.5%', icon: DollarSign, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Orders', value: '1,245', change: '+8%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Restaurants', value: '128', change: '+3', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'New Restaurants', value: '12', change: '+4', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Payment Failures', value: '23', change: '-2%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Cancel Rate', value: '1.2%', change: '+0.1%', icon: XCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                ],
                status: { delivered: 65, preparing: 25, out: 10 },
                pending: [
                    { id: 1, name: 'Taco Fiesta', location: 'Brooklyn, NY', applied: '2h ago' },
                    { id: 2, name: 'Greenbowl Direct', location: 'Austin, TX', applied: '5h ago' },
                    { id: 3, name: 'Sushi Express', location: 'San Jose, CA', applied: '1d ago' },
                ],
                highCancel: [
                    { id: 4, name: 'Burger King #420', rate: '5.2%', reason: 'Staff unavailable' },
                    { id: 5, name: 'Pizza Hut #10', rate: '4.8%', reason: 'Inventory sync' },
                ],
            },
            last_30_days: {
                kpis: [
                    { label: 'GMV', value: '$186,410', change: '+9.1%', icon: DollarSign, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Orders', value: '5,420', change: '+6%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Restaurants', value: '132', change: '+8', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'New Restaurants', value: '41', change: '+12', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Payment Failures', value: '77', change: '+3%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Cancel Rate', value: '1.4%', change: '+0.2%', icon: XCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                ],
                status: { delivered: 62, preparing: 28, out: 10 },
                pending: [
                    { id: 1, name: 'Taco Fiesta', location: 'Brooklyn, NY', applied: '3d ago' },
                    { id: 2, name: 'Greenbowl Direct', location: 'Austin, TX', applied: '6d ago' },
                    { id: 3, name: 'Sushi Express', location: 'San Jose, CA', applied: '8d ago' },
                    { id: 4, name: 'Curry Hub', location: 'Seattle, WA', applied: '10d ago' },
                ],
                highCancel: [
                    { id: 4, name: 'Burger King #420', rate: '5.2%', reason: 'Staff unavailable' },
                    { id: 6, name: 'Deli Express', rate: '4.9%', reason: 'Late prep' },
                ],
            },
            this_month: {
                kpis: [
                    { label: 'GMV', value: '$92,800', change: '+4.8%', icon: DollarSign, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Orders', value: '2,640', change: '+3%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Restaurants', value: '129', change: '+4', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'New Restaurants', value: '19', change: '+5', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Payment Failures', value: '39', change: '-1%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Cancel Rate', value: '1.1%', change: '-0.1%', icon: XCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                ],
                status: { delivered: 67, preparing: 23, out: 10 },
                pending: [
                    { id: 1, name: 'Taco Fiesta', location: 'Brooklyn, NY', applied: '4d ago' },
                    { id: 2, name: 'Greenbowl Direct', location: 'Austin, TX', applied: '6d ago' },
                ],
                highCancel: [
                    { id: 5, name: 'Pizza Hut #10', rate: '4.8%', reason: 'Inventory sync' },
                ],
            },
            last_month: {
                kpis: [
                    { label: 'GMV', value: '$173,900', change: '+2.2%', icon: DollarSign, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Orders', value: '5,010', change: '+1%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Restaurants', value: '124', change: '+2', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'New Restaurants', value: '28', change: '+3', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Payment Failures', value: '84', change: '+6%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Cancel Rate', value: '1.6%', change: '+0.3%', icon: XCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                ],
                status: { delivered: 61, preparing: 27, out: 12 },
                pending: [
                    { id: 3, name: 'Sushi Express', location: 'San Jose, CA', applied: '11d ago' },
                    { id: 7, name: 'Urban Wok', location: 'Dallas, TX', applied: '14d ago' },
                ],
                highCancel: [
                    { id: 8, name: 'Burger Barn', rate: '5.5%', reason: 'Driver shortages' },
                    { id: 5, name: 'Pizza Hut #10', rate: '4.8%', reason: 'Inventory sync' },
                ],
            },
            all_time: {
                kpis: [
                    { label: 'GMV', value: '$1.96M', change: '+18%', icon: DollarSign, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Orders', value: '58,420', change: '+12%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Restaurants', value: '152', change: '+28', icon: Store, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'New Restaurants', value: '412', change: '+64', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Payment Failures', value: '860', change: '+9%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Cancel Rate', value: '1.3%', change: '+0.1%', icon: XCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
                ],
                status: { delivered: 64, preparing: 26, out: 10 },
                pending: [
                    { id: 1, name: 'Taco Fiesta', location: 'Brooklyn, NY', applied: '2w ago' },
                    { id: 2, name: 'Greenbowl Direct', location: 'Austin, TX', applied: '3w ago' },
                    { id: 7, name: 'Urban Wok', location: 'Dallas, TX', applied: '1mo ago' },
                ],
                highCancel: [
                    { id: 4, name: 'Burger King #420', rate: '5.2%', reason: 'Staff unavailable' },
                    { id: 8, name: 'Burger Barn', rate: '5.5%', reason: 'Driver shortages' },
                ],
            },
        };

        return byRange[dateRange] || byRange.last_7_days;
    }, [dateRange]);

    const kpis = analytics.kpis;
    const pendingRestaurants = analytics.pending;
    const highCancelRestaurants = analytics.highCancel;
    const statusBreakdown = analytics.status;

    const chartData = useMemo(() => {
        const presets = {
            last_7_days: [40, 60, 45, 70, 50, 65, 80],
            last_30_days: [30, 45, 40, 55, 50, 60, 70, 65, 75, 80, 60, 85],
            this_month: [55, 48, 60, 52, 68, 74, 66, 70, 62, 78, 80, 72],
            last_month: [42, 50, 38, 46, 58, 62, 54, 60, 52, 65, 70, 64],
            all_time: [25, 35, 30, 45, 50, 40, 55, 60, 50, 65, 70, 60, 75, 80],
        };
        return presets[dateRange] || presets.last_7_days;
    }, [dateRange]);

    return (
        <div className="space-y-6">
            {/* Row 1: KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpis.map((kpi, idx) => (
                    <Card key={idx} className="p-4 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${kpi.bg}`}>
                                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                            </div>
                            <span className={`text-xs font-semibold ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {kpi.change}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{kpi.value}</h3>
                            <p className="text-xs text-gray-500 font-medium">{kpi.label}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Row 2: Charts Placeholder */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 min-h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Orders Over Time ({getDateRangeLabel(dateRange)})</h3>
                        <select
                            className="text-sm border-gray-200 rounded-lg p-1 text-gray-600"
                            value={dateRange}
                            onChange={(event) => setDateRange(event.target.value)}
                        >
                            {DATE_RANGE_OPTIONS.map(option => (
                                <option key={option.id} value={option.id}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    {/* Placeholder Chart */}
                    <div className="h-64 flex items-end gap-2 px-4 pb-4 border-b border-l border-gray-100 relative">
                        {chartData.map((h, i) => (
                            <div key={i} className="flex-1 bg-primary-100 hover:bg-primary-200 rounded-t transition-all relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h * 10} Orders
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="font-bold text-gray-900 mb-6">Order Status Breakdown ({getDateRangeLabel(dateRange)})</h3>
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-40 h-40 rounded-full border-8 border-gray-100 border-l-primary-500 border-t-green-500 border-b-blue-500 rotate-45 mb-6"></div>
                        <div className="w-full space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Delivered</span>
                                <span className="font-semibold">{statusBreakdown.delivered}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary-500"></div> Preparing</span>
                                <span className="font-semibold">{statusBreakdown.preparing}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Out for Delivery</span>
                                <span className="font-semibold">{statusBreakdown.out}%</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Row 3: Attention Queues */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Pending Approvals */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <h3 className="font-bold text-gray-900 text-sm">Pending Approvals</h3>
                        </div>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{pendingRestaurants.length} New</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {pendingRestaurants.map(r => (
                            <div key={r.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                                    <p className="text-xs text-gray-500">{r.location} • Applied {r.applied}</p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs h-8">Review</Button>
                            </div>
                        ))}
                        <div className="p-3 text-center border-t border-gray-100">
                            <button className="text-xs font-medium text-primary-600 hover:text-primary-700">View All Pending</button>
                        </div>
                    </div>
                </Card>

                {/* High Cancellations */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <h3 className="font-bold text-gray-900 text-sm">High Cancellation Rate</h3>
                        </div>
                        <span className="text-xs text-gray-500">{getDateRangeLabel(dateRange)}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {highCancelRestaurants.map(r => (
                            <div key={r.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                                    <p className="text-xs text-gray-500">{r.reason}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-red-600">{r.rate}</span>
                                    <div className="text-xs text-primary-600 hover:underline cursor-pointer">View</div>
                                </div>
                            </div>
                        ))}
                        <div className="p-3 text-center border-t border-gray-100">
                            <button className="text-xs font-medium text-primary-600 hover:text-primary-700">View All</button>
                        </div>
                    </div>
                </Card>

                {/* Payment Failures */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <h3 className="font-bold text-gray-900 text-sm">Payment Failures</h3>
                        </div>
                        <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">High Alert</span>
                    </div>
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <CheckCircle className="w-10 h-10 text-green-500 mb-3 opacity-20" />
                        <p className="text-gray-900 font-medium">No active spikes</p>
                        <p className="text-sm text-gray-500">System is processing payments normally.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
