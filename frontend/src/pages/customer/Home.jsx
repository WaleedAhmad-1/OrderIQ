import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../../components/layout/Customer/CustomerLayout';
import RestaurantCard from '../../components/customer/RestaurantCard';
import DishCard from '../../components/customer/DishCard';
import { 
  QrCode, Clock, Star, MapPin, ArrowRight, 
  TrendingUp, Flame, Sparkles, ShoppingBag, Award,
  ChevronRight, Filter, Package
} from 'lucide-react';
import { CartProvider } from '../../features/customer/CartContext';

const CustomerHome = ({ isLoggedIn = true, userName = "Sam" }) => {
  const [deliveryMode, setDeliveryMode] = useState('delivery');

  // Action Cards Data
  const actionCards = [
    {
      id: 'qr',
      title: 'Scan QR for dine-in',
      description: 'Order directly from your table',
      icon: QrCode,
      color: 'bg-gradient-to-r from-accent-500 to-pink-500',
      alwaysVisible: true,
    },
    {
      id: 'reorder',
      title: 'Reorder last order',
      description: 'From Spice Symphony • 2 items',
      icon: ShoppingBag,
      color: 'bg-gradient-to-r from-primary-500 to-purple-500',
      visible: isLoggedIn,
    },
    {
      id: 'points',
      title: isLoggedIn ? '1,250 points available' : 'Sign in to earn points',
      description: isLoggedIn ? 'Redeem rewards' : 'Join our loyalty program',
      icon: Award,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      alwaysVisible: true,
    },
  ];

  // Restaurant Data for Rails
  const restaurantRails = [
    {
      id: 'recommended',
      title: 'Recommended near you',
      icon: Sparkles,
      restaurants: [
        {
          id: 1,
          name: 'Spice Symphony',
          rating: 4.8,
          cuisines: ['Indian', 'North Indian'],
          deliveryTime: '25-35 min',
          deliveryFee: '₹29',
          priceRange: '$$',
          image: 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=400&h=300&fit=crop',
          promoted: true,
        },
        {
          id: 2,
          name: 'Tokyo Sushi Bar',
          rating: 4.7,
          cuisines: ['Japanese', 'Sushi'],
          deliveryTime: '30-40 min',
          deliveryFee: '₹39',
          priceRange: '$$$',
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
          promoted: false,
        },
        {
          id: 3,
          name: 'Burger Junction',
          rating: 4.5,
          cuisines: ['American', 'Burgers'],
          deliveryTime: '20-30 min',
          deliveryFee: '₹19',
          priceRange: '$',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
          promoted: true,
        },
        {
          id: 4,
          name: 'La Pasta Fresca',
          rating: 4.6,
          cuisines: ['Italian', 'Pasta'],
          deliveryTime: '25-35 min',
          deliveryFee: '₹35',
          priceRange: '$$',
          image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
          promoted: false,
        },
      ],
    },
    {
      id: 'top-rated',
      title: 'Top rated',
      icon: Star,
      restaurants: [
        {
          id: 5,
          name: 'The Green Bowl',
          rating: 4.9,
          cuisines: ['Healthy', 'Salads'],
          deliveryTime: '15-25 min',
          deliveryFee: '₹20',
          priceRange: '$$',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
          promoted: true,
        },
        {
          id: 6,
          name: 'Mediterranean Grill',
          rating: 4.7,
          cuisines: ['Mediterranean', 'Greek'],
          deliveryTime: '30-40 min',
          deliveryFee: '₹35',
          priceRange: '$$$',
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
          promoted: false,
        },
      ],
    },
    {
      id: 'pickup',
      title: 'Great for pickup',
      icon: Package,
      restaurants: [
        {
          id: 7,
          name: 'Dragon Chinese',
          rating: 4.4,
          cuisines: ['Chinese', 'Asian'],
          pickupTime: '20-25 min',
          priceRange: '$$',
          image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
          promoted: false,
        },
        {
          id: 8,
          name: 'Mexican Fiesta',
          rating: 4.3,
          cuisines: ['Mexican', 'Tacos'],
          pickupTime: '15-20 min',
          priceRange: '$$',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
          promoted: false,
        },
      ],
    },
  ];

  // Active Order (if any)
  const statusProgressMap = {
    Placed: 20,
    Preparing: 50,
    'On the way': 80,
    Delivered: 100,
    Cancelled: 0,
  };

  const getProgressForStatus = (status) => statusProgressMap[status] ?? 0;

  const activeOrder = isLoggedIn ? {
    id: '#ORD-7890',
    restaurant: 'Spice Symphony',
    status: 'Preparing',
    estimatedTime: '25-30 min',
    items: ['Butter Chicken', 'Garlic Naan', 'Raita'],
    progress: getProgressForStatus('Preparing'),
  } : null;

  // No Address Banner (for pickup mode)
  const showNoAddressBanner = deliveryMode === 'delivery' && !isLoggedIn;

  return (
    <CustomerLayout isLoggedIn={isLoggedIn} userName={userName}>
      <div className="space-y-8">
        {/* Context Header */}
        <div className="pt-6 lg:pt-8">
          {isLoggedIn ? (
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Good evening, {userName}!
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="text-gray-600">
                  Delivery to <span className="font-medium">123 Main St, New York</span>
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Discover great food near you
              </h1>
              <p className="text-gray-600 mt-2">
                Browse freely. Sign in to checkout and earn rewards.
              </p>
            </div>
          )}
        </div>

        {/* No Address Banner */}
        {showNoAddressBanner && (
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="font-medium">Add delivery address</p>
                  <p className="text-sm opacity-90">Enter your location to see restaurants</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100">
                Add Address
              </button>
            </div>
          </div>
        )}

        {/* Active Order Tracking Card */}
        {activeOrder && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-bold text-gray-900">Active Order</h2>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    {activeOrder.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{activeOrder.restaurant} • {activeOrder.estimatedTime}</p>
              </div>
              <Link
                to={`/customer/orders/${activeOrder.id}`}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                Track <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Order placed</span>
                <span>Preparing</span>
                <span>On the way</span>
                <span>Delivered</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${activeOrder.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="font-medium text-gray-900">{activeOrder.items.join(', ')}</p>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Action Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionCards
            .filter(card => card.alwaysVisible || card.visible)
            .map((card) => (
              <div
                key={card.id}
                className={`${card.color} rounded-xl p-6 text-white`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <card.icon className="w-8 h-8 mb-3" />
                    <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                    <p className="text-sm opacity-90">{card.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            ))}
        </div>

        {/* Discovery Rails */}
        <div className="space-y-8">
          {restaurantRails.map((rail) => (
            <div key={rail.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <rail.icon className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">{rail.title}</h2>
                </div>
                
                <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  See all <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Restaurant Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rail.restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    mode={deliveryMode}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
       
        {/* Popular Dishes Section */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Popular dishes near you</h2>
              <p className="text-gray-600">Based on what others are ordering</p>
            </div>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                id: 1,
                name: 'Butter Chicken',
                description: 'Creamy tomato curry with tender chicken',
                price: '₹350',
                image: 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=400&h=300&fit=crop',
                badge: 'Bestseller',
                inCart: 2,
              },
              {
                id: 2,
                name: 'California Roll',
                description: 'Crab, avocado, cucumber',
                price: '₹280',
                image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
                badge: null,
                inCart: 0,
              },
              {
                id: 3,
                name: 'Classic Burger',
                description: 'Beef patty with cheese and veggies',
                price: '₹220',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                badge: 'New',
                inCart: 1,
              },
              {
                id: 4,
                name: 'Margherita Pizza',
                description: 'Classic tomato and mozzarella',
                price: '₹320',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
                badge: null,
                inCart: 0,
              },
            ].map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
              />
            ))}
          </div>
        </div>
     
        {/* Mobile-only QR CTA */}
        <div className="lg:hidden bg-gradient-to-r from-accent-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-4">
            <QrCode className="w-12 h-12" />
            <div>
              <h3 className="text-lg font-bold mb-1">At a restaurant?</h3>
              <p className="text-sm opacity-90">Scan the QR code to order directly from your table</p>
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-white text-accent-600 rounded-lg font-bold">
            Open Scanner
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerHome;

