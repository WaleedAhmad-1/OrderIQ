import React from 'react';
import { Gift, Star, TrendingUp, Award, ChevronRight } from 'lucide-react';
import DashboardSidebar from '../../components/layout/Customer/DashboardSidebar';
import Card from '../../components/ui/Card';

const Rewards = () => {
    const rewardsBalance = 1250;
    const nextRewardPoints = 2000;
    const progressPercentage = (rewardsBalance / nextRewardPoints) * 100;

    const availableRewards = [
        {
            id: 1,
            title: '₹100 Off on orders above ₹500',
            pointsCost: 500,
            validity: 'Valid for 30 days',
            type: 'discount',
        },
        {
            id: 2,
            title: 'Free Delivery on 3 orders',
            pointsCost: 800,
            validity: 'Valid for 15 days',
            type: 'delivery',
        },
        {
            id: 3,
            title: '20% Off on any restaurant',
            pointsCost: 1200,
            validity: 'Valid for 7 days',
            type: 'discount',
        },
        {
            id: 4,
            title: 'Free Dessert with any order',
            pointsCost: 600,
            validity: 'Valid for 10 days',
            type: 'freebie',
        },
    ];

    const rewardHistory = [
        { id: 1, date: 'Jan 20, 2026', description: 'Order completed', points: '+50', type: 'earn' },
        { id: 2, date: 'Jan 18, 2026', description: 'Redeemed: Free Delivery', points: '-500', type: 'redeem' },
        { id: 3, date: 'Jan 15, 2026', description: 'Order completed', points: '+100', type: 'earn' },
        { id: 4, date: 'Jan 12, 2026', description: 'Referral bonus', points: '+200', type: 'earn' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-12">
            <div className="max-w-content mx-auto px-4">
                <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Account</h1>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <DashboardSidebar userName="Sam" userRole="Customer" />

                    {/* Content Area */}
                    <div className="md:col-span-3 space-y-6">
                        {/* Rewards Balance Card */}
                        <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-8 text-white">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-primary-100 mb-2">Your Rewards Balance</p>
                                    <h2 className="text-4xl font-bold">{rewardsBalance} Points</h2>
                                </div>
                                <Award className="w-16 h-16 text-white/20" />
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>{rewardsBalance} pts</span>
                                    <span>{nextRewardPoints} pts (Next Reward)</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-3">
                                    <div
                                        className="bg-white rounded-full h-3 transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-sm text-primary-100">
                                Earn {nextRewardPoints - rewardsBalance} more points to unlock your next reward!
                            </p>
                        </div>

                        {/* Available Rewards */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-neutral-900">Available Rewards</h2>
                                <button className="text-primary-600 text-sm font-medium hover:underline">
                                    View All
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {availableRewards.map((reward) => (
                                    <div
                                        key={reward.id}
                                        className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                                <Gift className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full">
                                                {reward.pointsCost} pts
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-neutral-900 mb-2">{reward.title}</h3>
                                        <p className="text-sm text-neutral-500 mb-4">{reward.validity}</p>
                                        <button
                                            disabled={rewardsBalance < reward.pointsCost}
                                            className={`w-full py-2 rounded-lg font-medium transition ${rewardsBalance >= reward.pointsCost
                                                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {rewardsBalance >= reward.pointsCost ? 'Redeem' : 'Insufficient Points'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* How to Earn Points */}
                        <Card className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 border-primary-100">
                            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary-600" />
                                How to Earn More Points
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                        <Star className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h4 className="font-bold text-neutral-900 mb-1">Complete Orders</h4>
                                    <p className="text-sm text-neutral-600">Earn 50 points per order</p>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                        <Award className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-bold text-neutral-900 mb-1">Write Reviews</h4>
                                    <p className="text-sm text-neutral-600">Earn 25 points per review</p>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                                        <Gift className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h4 className="font-bold text-neutral-900 mb-1">Refer Friends</h4>
                                    <p className="text-sm text-neutral-600">Earn 200 points per referral</p>
                                </div>
                            </div>
                        </Card>

                        {/* Rewards History */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-neutral-900 mb-4">Points History</h2>
                            <div className="space-y-3">
                                {rewardHistory.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium text-neutral-900">{transaction.description}</p>
                                            <p className="text-sm text-neutral-500">{transaction.date}</p>
                                        </div>
                                        <span
                                            className={`font-bold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                                                }`}
                                        >
                                            {transaction.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition">
                                View Full History
                            </button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
