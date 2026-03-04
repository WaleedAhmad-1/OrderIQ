import React, { useState } from 'react';
import { Star, Clock, MapPin, Check, Truck, Package, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantGrid = () => {
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: 'Spice Symphony',
      cuisine: ['Indian', 'North Indian', 'Biryani'],
      rating: 4.8,
      reviewCount: 1245,
      deliveryTime: '25-35 min',
      pickupTime: '15-20 min',
      deliveryFee: '₹29',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=400&h=300&fit=crop',
      modes: ['delivery', 'pickup', 'dinein'],
      promoted: true,
    },
    {
      id: 2,
      name: 'Tokyo Sushi Bar',
      cuisine: ['Japanese', 'Sushi', 'Asian'],
      rating: 4.7,
      reviewCount: 892,
      deliveryTime: '30-40 min',
      pickupTime: '20-25 min',
      deliveryFee: '₹39',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      modes: ['delivery', 'pickup'],
      promoted: false,
    },
    {
      id: 3,
      name: 'Burger Junction',
      cuisine: ['American', 'Burgers', 'Fast Food'],
      rating: 4.5,
      reviewCount: 1567,
      deliveryTime: '20-30 min',
      pickupTime: '10-15 min',
      deliveryFee: '₹19',
      priceRange: '$',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      modes: ['delivery', 'pickup'],
      promoted: true,
    },
    {
      id: 4,
      name: 'La Pasta Fresca',
      cuisine: ['Italian', 'Pasta', 'Mediterranean'],
      rating: 4.6,
      reviewCount: 734,
      deliveryTime: '25-35 min',
      pickupTime: '15-20 min',
      deliveryFee: '₹35',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
      modes: ['delivery', 'dinein'],
      promoted: false,
    },
    {
      id: 5,
      name: 'Dragon Chinese',
      cuisine: ['Chinese', 'Asian', 'Szechuan'],
      rating: 4.4,
      reviewCount: 983,
      deliveryTime: '30-40 min',
      pickupTime: '20-25 min',
      deliveryFee: '₹25',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
      modes: ['delivery', 'pickup'],
      promoted: false,
    },
    {
      id: 6,
      name: 'The Green Bowl',
      cuisine: ['Healthy', 'Salads', 'Vegetarian'],
      rating: 4.9,
      reviewCount: 567,
      deliveryTime: '15-25 min',
      pickupTime: '5-10 min',
      deliveryFee: '₹20',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      modes: ['delivery', 'pickup', 'dinein'],
      promoted: true,
    },
    {
      id: 7,
      name: 'Mexican Fiesta',
      cuisine: ['Mexican', 'Tacos', 'Burritos'],
      rating: 4.3,
      reviewCount: 654,
      deliveryTime: '25-35 min',
      pickupTime: '15-20 min',
      deliveryFee: '₹30',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      modes: ['delivery'],
      promoted: false,
    },
    {
      id: 8,
      name: 'Mediterranean Grill',
      cuisine: ['Mediterranean', 'Greek', 'Healthy'],
      rating: 4.7,
      reviewCount: 432,
      deliveryTime: '30-40 min',
      pickupTime: '20-25 min',
      deliveryFee: '₹35',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
      modes: ['delivery', 'dinein'],
      promoted: true,
    },
  ]);

  const [showMapView, setShowMapView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock loading state
  const handleFilterChange = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const modeIcons = {
    delivery: { icon: Truck, label: 'Delivery' },
    pickup: { icon: Package, label: 'Pickup' },
    dinein: { icon: Utensils, label: 'Dine-in' },
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-content mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Restaurants near you
            </h2>
            <p className="text-neutral-500 mt-2">
              Delivery • Showing {restaurants.length} results
            </p>
          </div>
          
          <button
            onClick={() => setShowMapView(!showMapView)}
            className="mt-4 md:mt-0 px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-400 text-neutral-700"
          >
            {showMapView ? 'List view' : 'Map view'}
          </button>
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white border border-neutral-200 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded"></div>
                  <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Promoted Badge */}
                  {restaurant.promoted && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-semibold rounded-full">
                        PROMOTED
                      </span>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-sm font-semibold rounded">
                      {restaurant.priceRange}
                    </span>
                  </div>

                  {/* View Menu Button (on hover) */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="px-4 py-2 bg-white text-primary-600 font-semibold rounded-lg shadow-lg hover:bg-primary-50">
                      View menu
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 truncate">
                        {restaurant.name}
                      </h3>
                      
                      {/* Cuisine Chips */}
                      <div className="flex items-center gap-1 mt-2">
                        {restaurant.cuisine.slice(0, 2).map((cuisine, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                          >
                            {cuisine}
                          </span>
                        ))}
                        {restaurant.cuisine.length > 2 && (
                          <span className="text-xs text-neutral-400">
                            +{restaurant.cuisine.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-green-600 fill-current" />
                      <span className="ml-1 font-bold text-green-700">{restaurant.rating}</span>
                      <span className="ml-1 text-xs text-neutral-500">({restaurant.reviewCount})</span>
                    </div>
                  </div>

                  {/* Mode Availability */}
                  <div className="flex items-center gap-2 mb-4">
                    {restaurant.modes.map((mode) => {
                      const ModeIcon = modeIcons[mode].icon;
                      return (
                        <span
                          key={mode}
                          className="flex items-center gap-1 px-2 py-1 bg-neutral-50 text-neutral-600 text-xs rounded"
                        >
                          <ModeIcon className="w-3 h-3" />
                          {modeIcons[mode].label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Service Info */}
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {restaurant.deliveryTime}
                    </div>
                    <div className="text-neutral-500">
                      {restaurant.deliveryFee} delivery fee
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No restaurants match your filters
            </h3>
            <p className="text-neutral-500 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={handleFilterChange}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantGrid;