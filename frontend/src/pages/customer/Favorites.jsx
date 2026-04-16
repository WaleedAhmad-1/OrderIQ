import React from 'react';
import { Heart, Star, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardSidebar from '../../components/layout/Customer/DashboardSidebar';
import Card from '../../components/ui/Card';
import { useFavorites } from '../../features/customer/FavoritesContext';

const Favorites = () => {
    const navigate = useNavigate();
    const { favorites, loading, toggleFavorite } = useFavorites();

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-12">
            <div className="max-w-content mx-auto px-4">
                <Link to="/customer/home" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 mb-3 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Account</h1>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <DashboardSidebar />

                    {/* Content Area */}
                    <div className="md:col-span-3 space-y-6">
                        {/* Favorites Section */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-neutral-900">Favorite Restaurants</h2>
                                <span className="text-sm text-neutral-500">{favorites.length} favorites</span>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-neutral-500">Loading your favorites...</div>
                            ) : favorites.length === 0 ? (
                                <div className="text-center py-12">
                                    <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">No favorites yet</h3>
                                    <p className="text-neutral-500">Start adding your favorite restaurants!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {favorites.map((fav) => {
                                        const restaurant = fav.restaurant || fav;
                                        return (
                                            <div
                                                key={restaurant.id}
                                                className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                                            >
                                                <div className="relative h-40">
                                                    <img
                                                        src={restaurant.coverImage || restaurant.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}
                                                        alt={restaurant.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => toggleFavorite(restaurant.id)}
                                                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition"
                                                    >
                                                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-neutral-900 mb-1">{restaurant.name}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                            <span className="text-sm font-medium">{restaurant.rating || 4.5}</span>
                                                        </div>
                                                        <span className="text-neutral-400">•</span>
                                                        <span className="text-sm text-neutral-500">{(restaurant.cuisineTypes || []).join(', ') || 'Various'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-neutral-500 mb-3">
                                                        <Clock className="w-4 h-4" />
                                                        {restaurant.deliveryTime || '30-45 min'}
                                                    </div>
                                                    <button onClick={() => navigate(`/customer/restaurant/${restaurant.id}`)}
                                                        className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">
                                                        Order Now
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
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
