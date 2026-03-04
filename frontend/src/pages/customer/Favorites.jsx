import React, { use } from 'react';
import { Heart, Star, Clock, MapPin, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/layout/Customer/DashboardSidebar';
import Card from '../../components/ui/Card';

const Favorites = () => {
    const navigate=useNavigate();
    const favoriteRestaurants = [
        {
            id: 1,
            name: 'Spice Symphony',
            rating: 4.8,
            cuisines: ['Indian', 'North Indian'],
            deliveryTime: '25-35 min',
            image: 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=400&h=300&fit=crop',
        },
        {
            id: 2,
            name: 'Tokyo Sushi Bar',
            rating: 4.7,
            cuisines: ['Japanese', 'Sushi'],
            deliveryTime: '30-40 min',
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        },
        {
            id: 3,
            name: 'Burger Junction',
            rating: 4.5,
            cuisines: ['American', 'Burgers'],
            deliveryTime: '20-30 min',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        },
        {
            id: 4,
            name: 'La Pasta Fresca',
            rating: 4.6,
            cuisines: ['Italian', 'Pasta'],
            deliveryTime: '25-35 min',
            image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
        },
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
                        {/* Favorites Section */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-neutral-900">Favorite Restaurants</h2>
                                <span className="text-sm text-neutral-500">{favoriteRestaurants.length} favorites</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {favoriteRestaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.id}
                                        className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                                    >
                                        <div className="relative h-40">
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition">
                                                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-neutral-900 mb-1">{restaurant.name}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-medium">{restaurant.rating}</span>
                                                </div>
                                                <span className="text-neutral-400">•</span>
                                                <span className="text-sm text-neutral-500">{restaurant.cuisines.join(', ')}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-neutral-500 mb-3">
                                                <Clock className="w-4 h-4" />
                                                {restaurant.deliveryTime}
                                            </div>
                                            <button onClick={()=> navigate(`/customer/restaurant/${restaurant.id}`)} 
                                                 className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {favoriteRestaurants.length === 0 && (
                                <div className="text-center py-12">
                                    <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">No favorites yet</h3>
                                    <p className="text-neutral-500">Start adding your favorite restaurants!</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
