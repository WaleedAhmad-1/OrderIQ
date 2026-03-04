import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Info, Search, ChevronLeft } from 'lucide-react';
import cartBG from "../../assets/cartBG.png";
import DishCard from '../../components/customer/DishCard';

// Mock Data (In a real app, fetch by ID)
const MOCK_RESTAURANT = {
    id: 1,
    name: 'Spice Symphony',
    rating: 4.8,
    reviewCount: 1245,
    cuisine: 'Indian • North Indian',
    location: 'Connaught Place, New Delhi',
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop', // Banner
    categories: ['Recommended', 'Starters', 'Main Course', 'Breads', 'Desserts'],
    menu: [
        {
            id: 101,
            name: 'Butter Chicken',
            description: 'Tender chicken in a rich tomato and butter gravy.',
            price: '₹350',
            image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',
            category: 'Recommended',
            badge: 'Bestseller'
        },
        {
            id: 102,
            name: 'Paneer Tikka',
            description: 'Cottage cheese marinated in spices and grilled.',
            price: '₹280',
            image: 'https://images.unsplash.com/photo-1567188040754-5835e546db44?w=400&h=300&fit=crop',
            category: 'Starters',
            badge: null
        },
        {
            id: 103,
            name: 'Garlic Naan',
            description: 'Soft indian bread topped with garlic and butter.',
            price: '₹40',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
            category: 'Breads',
            badge: null
        },
        {
            id: 104,
            name: 'Dal Makhani',
            description: 'Black lentils cooked overnight with cream and butter.',
            price: '₹220',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
            category: 'Main Course',
            badge: 'Bestseller'
        }
    ]
};

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('Recommended');
    const restaurant = MOCK_RESTAURANT; // In real app, find by id

    const scrollToCategory = (category) => {
        setActiveCategory(category);
        const element = document.getElementById(category);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Banner Image */}
            <div className="relative h-64 md:h-80 w-full">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                    >
                        <ChevronLeft className="w-6 h-6 text-neutral-900" />
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
                    <p className="text-lg opacity-90">{restaurant.cuisine}</p>
                </div>
            </div>

            <div className="max-w-content mx-auto px-4 py-8">
                {/* Info Strip */}
                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base border-b border-neutral-100 pb-6 mb-8">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-green-600 fill-current" />
                        <span className="font-bold text-neutral-900">{restaurant.rating}</span>
                        <span className="text-neutral-500">({restaurant.reviewCount}+ ratings)</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                        <Clock className="w-5 h-5" />
                        <span>{restaurant.deliveryTime} delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                        <Info className="w-5 h-5" />
                        <span>{restaurant.location}</span>
                    </div>
                </div>

                {/* Menu Navigation (Sticky) */}
                <div className="sticky top-20 z-20 bg-white py-4 border-b border-neutral-100 mb-8 overflow-x-auto no-scrollbar">
                    <div className="flex gap-4">
                        {restaurant.categories.map((cat, idx) => (
                            <button
                                key={`${cat}-${idx}`}
                                onClick={() => scrollToCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${activeCategory === cat
                                        ? 'bg-neutral-900 text-white'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Menu Sections */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Menu */}
                    <div className="flex-1 space-y-12">
                        {restaurant.categories.map((category, catIdx) => {
                            const items = restaurant.menu.filter(m => m.category === category);
                            if (items.length === 0) return null;

                            return (
                                  
                                <div key={`${category}-${catIdx}`} id={category} className="scroll-mt-40">
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">{category}</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {items.map((dish, dishIdx) => (
                                            <DishCard
                                                key={`${category}-${dish.id ?? dish.name ?? dishIdx}`}
                                                dish={{ ...dish, inCart: 0 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                
                            );
                        })}
                    </div>
                  
                    {/* Right: Cart Summary (Deskop) - Placeholder for now, can implement a sticky mini-cart */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-40 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4">Cart Empty</h3>
                            <div className="text-center py-8">
                                <img src={cartBG} alt="Empty" className="w-32 h-32 mx-auto object-contain opacity-50" />
                                <p className="text-neutral-500 mt-2">Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
    );
};

export default RestaurantDetails;
