import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Info, Minus, Plus, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import DishCard from '../../components/customer/DishCard';
import { restaurantService } from '../../services/restaurant.service';
import { menuService } from '../../services/menu.service';
import { useCart } from '../../features/customer/CartContext';

const QRMenuPage = () => {
    const { restaurantId } = useParams();
    const [searchParams] = useSearchParams();
    const tableLabel = searchParams.get('table') || '';
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState({ categories: [], items: [] });
    const [activeCategory, setActiveCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const { cartItems, cartTotal, updateQuantity, removeFromCart, setDineIn } = useCart();

    useEffect(() => {
        // Set dine-in mode with table info when page loads
        if (tableLabel) {
            setDineIn(tableLabel, restaurantId);
        }
    }, [tableLabel, restaurantId]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const [restRes, menuRes] = await Promise.all([
                    restaurantService.getRestaurantById(restaurantId),
                    menuService.getMenuByRestaurantId(restaurantId)
                ]);

                const rData = restRes.data;
                if (!rData.imageUrl && !rData.coverImage) {
                    rData.imageUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop';
                }
                setRestaurant(rData);

                const cData = menuRes.data || [];
                const parsedCats = cData.map(c => c.name);
                const parsedItems = cData.flatMap(c => (c.menuItems || []).map(item => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: `PKR ${item.price}`,
                    rawPrice: item.price,
                    image: item.image || item.imageUrl || null,
                    category: c.name,
                    badge: null
                })));

                setMenu({ categories: parsedCats, items: parsedItems });
                if (parsedCats.length > 0) setActiveCategory(parsedCats[0]);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [restaurantId]);

    const scrollToCategory = (category) => {
        setActiveCategory(category);
        const element = document.getElementById(`qr-cat-${category}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-neutral-500">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <UtensilsCrossed className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Restaurant Not Found</h2>
                    <p className="text-neutral-500">This QR code may be invalid or expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Dine-In Banner */}
            {tableLabel && (
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 text-center sticky top-0 z-30 shadow-lg">
                    <div className="flex items-center justify-center gap-2">
                        <UtensilsCrossed className="w-5 h-5" />
                        <span className="font-semibold">Dine-In at {tableLabel}</span>
                        <span className="text-primary-200">•</span>
                        <span className="text-primary-100 text-sm">{restaurant.name}</span>
                    </div>
                </div>
            )}

            {/* Restaurant Banner */}
            <div className="relative h-48 md:h-64 w-full">
                <img
                    src={restaurant.coverImage || restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 text-white">
                    <h1 className="text-2xl md:text-4xl font-bold mb-1">{restaurant.name}</h1>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                        {restaurant.cuisineTypes && (
                            <span>{restaurant.cuisineTypes.join(' • ')}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Strip */}
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex flex-wrap items-center gap-4 text-sm border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-green-600 fill-current" />
                        <span className="font-bold">{restaurant.rating || 4.5}</span>
                        <span className="text-neutral-500">({restaurant.reviewCount || 0} ratings)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600">
                        <Info className="w-4 h-4" />
                        <span>{restaurant.address}</span>
                    </div>
                </div>
            </div>

            {/* Category Nav (Sticky) */}
            <div className="sticky top-0 z-20 bg-white border-b border-neutral-100 shadow-sm" style={{ top: tableLabel ? '44px' : '0' }}>
                <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar">
                    <div className="flex gap-3">
                        {menu.categories.map((cat, idx) => (
                            <button
                                key={`qr-nav-${cat}-${idx}`}
                                onClick={() => scrollToCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-all ${
                                    activeCategory === cat
                                        ? 'bg-neutral-900 text-white'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
                {menu.categories.map((category, catIdx) => {
                    const items = menu.items.filter(m => m.category === category);
                    if (items.length === 0) return null;

                    return (
                        <div key={`qr-sec-${category}-${catIdx}`} id={`qr-cat-${category}`} className="scroll-mt-32">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">{category}</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {items.map((dish) => (
                                    <DishCard
                                        key={`qr-dish-${dish.id}`}
                                        dish={{ ...dish, inCart: 0 }}
                                        restaurantId={restaurant.id}
                                        restaurantName={restaurant.name}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Cart Bar */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-2xl px-4 py-3">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => navigate('/customer/checkout')}
                            className="w-full flex items-center justify-between bg-primary-600 text-white rounded-xl px-6 py-4 hover:bg-primary-700 transition shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-lg px-2.5 py-1 font-bold text-sm">
                                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                                </div>
                                <span className="font-semibold">View Cart</span>
                            </div>
                            <span className="font-bold text-lg">PKR {cartTotal}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRMenuPage;
