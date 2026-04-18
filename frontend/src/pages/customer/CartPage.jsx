import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    ArrowLeft, Trash2, ChevronRight, ShoppingBag,
    MapPin, UtensilsCrossed, Wallet, CheckCircle2, LogIn, CreditCard
} from 'lucide-react';
import { useCart } from '../../features/customer/CartContext';
import { useAuth } from '../../features/auth/AuthContext';
import Button from '../../components/ui/Button';
import GooglePayButton from '../../components/customer/GooglePayButton';
import MockGatewayModal from '../../components/customer/MockGatewayModal';
import { paymentService } from '../../services/payment.service';
import { orderService } from '../../services/order.service';
import { userService } from '../../services/user.service';
import LoginModal from '../../components/auth/LoginModal';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';

const CartPage = () => {

    const {
        cartItems, removeFromCart, updateQuantity,
        cartTotal, restaurant, clearCart,
        orderType, setOrderType, tableLabel, setTableLabel
    } = useCart();

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    // Derive available payment methods and account details from this restaurant's settings.
    // Instead of relying on the cached localStorage restaurant object, we will fetch the live settings.
    const [livePaySettings, setLivePaySettings] = useState(restaurant?.paymentSettings || null);
    const [isFetchingPay, setIsFetchingPay] = useState(false);

    useEffect(() => {
        if (restaurant?.id) {
            setIsFetchingPay(true);
            paymentService.getRestaurantPaymentSettings(restaurant.id)
                .then(res => {
                    if (res?.data) {
                        setLivePaySettings(res.data);
                    }
                })
                .catch(err => console.error("Failed to load live payment settings", err))
                .finally(() => setIsFetchingPay(false));
        }
    }, [restaurant?.id]);

    const cashEnabled   = livePaySettings ? livePaySettings.cashEnabled      : true;
    const gpayEnabled   = livePaySettings ? livePaySettings.googlePayEnabled : true;
    const cardEnabled   = livePaySettings?.cardEnabled || false;
    const merchantNote    = livePaySettings?.merchantNote || null;

    // Payout account details
    const googlePayMerchantId = livePaySettings?.googlePayMerchantId || null;
    const gatewayPublicKey = livePaySettings?.gatewayPublicKey || null;

    // Determine if digital wallets are actually configured to receive money
    const gpayConfigured = !!(googlePayMerchantId && googlePayMerchantId.trim() !== "");
    const cardConfigured = !!(gatewayPublicKey && gatewayPublicKey.trim() !== "" && livePaySettings?.gatewaySecretKey && livePaySettings.gatewaySecretKey.trim() !== "");
    
    // Only available if both enabled AND configured
    const gpayAvailable = gpayEnabled && gpayConfigured;
    const cardAvailable = cardEnabled && cardConfigured;
    const cashAvailable = cashEnabled; // Cash doesn't strictly need a bank account

    // Default to card if available, else gpay, else cash
    const defaultMethod = cardAvailable ? 'card' : gpayAvailable ? 'gpay' : cashAvailable ? 'cash' : 'none';
    const [selectedMethod, setSelectedMethod] = useState(defaultMethod);

    // Sync selected method if availability changes after fetch
    useEffect(() => {
        if (!isFetchingPay) {
            if (cardAvailable && selectedMethod === 'none') setSelectedMethod('card');
            else if (!cardAvailable && gpayAvailable && selectedMethod === 'card') setSelectedMethod('gpay');
            else if (!gpayAvailable && cashAvailable && selectedMethod === 'gpay') setSelectedMethod('cash');
        }
    }, [cardAvailable, gpayAvailable, cashAvailable, isFetchingPay]);


    // API Data
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [instructions, setInstructions] = useState('');

    // Modal state
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const handleOpenLogin = () => {
        setIsForgotOpen(false);
        setIsLoginOpen(true);
    };

    const handleOpenForgot = () => {
        setIsLoginOpen(false);
        setIsForgotOpen(true);
    };

    // Only fetch addresses if user is authenticated
    React.useEffect(() => {
        if (!isAuthenticated) return;

        const fetchAddresses = async () => {
            try {
                const res = await userService.getAddresses();
                const fetchedAddresses = res.data || [];
                setAddresses(fetchedAddresses);
                if (fetchedAddresses.length > 0) {
                    setSelectedAddress(fetchedAddresses[0]);
                }
            } catch (err) {
                console.error('Failed to load addresses:', err);
            }
        };
        fetchAddresses();
    }, [isAuthenticated]);

    // Tax & Fees
    const deliveryFee = orderType === 'DELIVERY' ? 35 : 0;
    const taxes = Math.round(cartTotal * 0.05);// 5% tax
    const platformFee = 5;
    const grandTotal = cartTotal + deliveryFee + taxes + platformFee;

    // ─── Build shared order payload ────────────────────────────────────────────

    const buildOrderPayload = () => {
        const formattedItems = cartItems.map(item => ({
            menuItemId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.rawPrice || String(item.price).replace(/[^0-9.]/g, '') || 0)
        }));

        return {
            restaurantId: restaurant.id,
            type: orderType,
            table: orderType === 'DINEIN' ? tableLabel : null,
            items: formattedItems,
            subtotal: cartTotal,
            deliveryFee,
            taxes,
            platformFee,
            total: grandTotal,
            deliveryAddress: orderType === 'DELIVERY' && selectedAddress ? {
                label: selectedAddress.label || 'Saved Address',
                street: selectedAddress.street,
                city: selectedAddress.city
            } : null,
            customerNotes: instructions,
        };
    };

    // ─── Validate before payment ───────────────────────────────────────────────

    const validateOrder = () => {
        if (!restaurant || !restaurant.id) {
            setPaymentError('Restaurant context lost. Please clear cart and try again.');
            toast.error('Restaurant information missing');
            return false;
        }

        if (orderType === 'DELIVERY' && !selectedAddress) {
            setPaymentError('Please add a delivery address.');
            toast.error('No delivery address selected');
            return false;
        }

        if (orderType === 'DINEIN') {
            const trimmed = tableLabel.trim();
            if (!trimmed) {
                setPaymentError('Please enter a table number for Dine-In.');
                toast.error('Table number is required for Dine-In.');
                return false;
            }
            // Must contain at least one digit — prevents pure alphabets like 'abc'
            if (!/\d/.test(trimmed)) {
                setPaymentError('Table number must include at least one digit (e.g., T1, Table 5).');
                toast.error('Invalid table number — must include a number.');
                return false;
            }
        }

        setPaymentError('');
        return true;
    };

    // ─── Google Pay success callback ───────────────────────────────────────────

    const handleGooglePaySuccess = async (paymentData) => {
        if (!validateOrder()) return;

        setIsProcessing(true);
        try {
            const token = paymentData?.paymentMethodData?.tokenizationData?.token || 'TEST_TOKEN';
            const orderPayload = buildOrderPayload();

            const response = await paymentService.processGooglePay({
                paymentToken: token,
                orderPayload
            });

            toast.success('🎉 Payment Successful! Order placed.');
            clearCart();
            const newOrderId = response.data?.id;
            navigate(`/customer/orders/${newOrderId}`);
        } catch (error) {
            console.error('Google Pay checkout failed:', error);
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
            setPaymentError('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ─── Google Pay error callback ─────────────────────────────────────────────

    const handleGooglePayError = (err) => {
        console.error('Google Pay error:', err);
        setPaymentError('Google Pay encountered an error. Try another payment method.');
        toast.error('Google Pay error. Please try again.');
    };

    // ─── Cash on Delivery checkout ─────────────────────────────────────────────

    const handleCashCheckout = async () => {
        if (!validateOrder()) return;

        setIsProcessing(true);
        try {
            const payload = {
                ...buildOrderPayload(),
                paymentMethod: 'CASH'
            };
            const response = await orderService.createOrder(payload);
            toast.success('Order Placed Successfully!');
            clearCart();
            const newOrderId = response.data?.id;
            navigate(`/customer/orders/${newOrderId}`);
        } catch (error) {
            console.error('Cash checkout failed:', error);
            toast.error(error.response?.data?.message || 'Failed to place order.');
            setPaymentError('Checkout failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ─── Card checkout handlers ───────────────────────────────────────────────

    const handleCardCheckout = () => {
        if (!validateOrder()) return;
        setIsCardModalOpen(true);
    };

    const handleCardSuccess = async (paymentToken) => {
        setIsCardModalOpen(false);
        setIsProcessing(true);
        try {
            const orderPayload = buildOrderPayload();
            const response = await paymentService.processCardPayment({
                paymentToken,
                orderPayload
            });

            toast.success('🎉 Card Payment Successful! Order placed.');
            clearCart();
            const newOrderId = response.data?.id;
            navigate(`/customer/orders/${newOrderId}`);
        } catch (error) {
            console.error('Card checkout failed:', error);
            toast.error(error.response?.data?.message || 'Card payment failed. Please try again.');
            setPaymentError('Card payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ─── Login required gate ───────────────────────────────────────────────────

    if (!isAuthenticated) {
        return (
            <>
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={() => setIsLoginOpen(false)}
                    onForgotPassword={handleOpenForgot}
                />
                <ForgotPasswordModal
                    isOpen={isForgotOpen}
                    onClose={() => setIsForgotOpen(false)}
                    onSwitchToLogin={handleOpenLogin}
                />
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LogIn className="w-10 h-10 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Login Required</h2>
                        <p className="text-neutral-500 mb-6">
                            Please log in to your account first before placing an order. You can browse the menu, but adding items to cart and checkout require authentication.
                        </p>
                        <Button onClick={handleOpenLogin} className="w-full mb-3">
                            Go to Login
                        </Button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            Browse Restaurants Instead
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // ─── Empty cart state ──────────────────────────────────────────────────────

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
                    <p className="text-neutral-500 mb-6">Looks like you haven't added anything yet.</p>
                    <Button onClick={() => navigate('/customer/home')} className="w-full">
                        Browse Restaurants
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">

            {/* ── Header ── */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-content mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-neutral-900">Checkout</h1>
                        <p className="text-xs text-neutral-500">{restaurant?.name}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-content mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">

                {/* ── Left Col ─ Order Details ── */}
                <div className="md:col-span-2 space-y-6">

                    {/* Order Type Toggle */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                        <h3 className="font-bold text-neutral-900 mb-3">Order Type</h3>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setOrderType('DELIVERY'); setTableLabel(''); }}
                                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${orderType === 'DELIVERY'
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                                    }`}
                            >
                                🚚 Delivery
                            </button>
                            <button
                                type="button"
                                onClick={() => { setOrderType('PICKUP'); setTableLabel(''); }}
                                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${orderType === 'PICKUP'
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                                    }`}
                            >
                                🏃 Pickup
                            </button>
                            <button
                                type="button"
                                onClick={() => setOrderType('DINEIN')}
                                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${orderType === 'DINEIN'
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                                    }`}
                            >
                                🍽️ Dine-In
                            </button>
                        </div>
                    </div>

                    {/* Address Card — only for delivery */}
                    {orderType === 'DELIVERY' && (
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary-600" />
                                    Delivery Address
                                </h3>
                                <button className="text-primary-600 text-sm font-medium">Change</button>
                            </div>
                            <div className="ml-6">
                                {selectedAddress ? (
                                    <>
                                        <p className="font-medium text-neutral-900">{selectedAddress.label || 'Saved Address'}</p>
                                        <p className="text-sm text-neutral-500">{selectedAddress.street}, {selectedAddress.city}</p>
                                        <p className="text-sm text-neutral-500 mt-1">30-40 mins • Delivery to Door</p>
                                    </>
                                ) : (
                                    <p className="text-sm text-neutral-500">No address saved. Please add one in profile.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dine-In Table Info */}
                    {orderType === 'DINEIN' && (
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-primary-100 bg-gradient-to-r from-primary-50/50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <UtensilsCrossed className="w-6 h-6 text-primary-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-neutral-900">Dine-In Order</h3>
                                    <p className="text-xs text-neutral-400 mb-2">e.g. T1, T2, Table 5</p>
                                    <input
                                        type="text"
                                        value={tableLabel}
                                        onChange={(e) => {
                                            // Only allow alphanumeric chars + spaces + hyphens
                                            const cleaned = e.target.value.replace(/[^a-zA-Z0-9\s\-]/g, '');
                                            setTableLabel(cleaned);
                                        }}
                                        placeholder="Enter table number (e.g., T1)"
                                        maxLength={20}
                                        className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                            tableLabel.trim() && !/\d/.test(tableLabel)
                                                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                                                : tableLabel.trim() && /\d/.test(tableLabel)
                                                ? 'border-green-400 focus:ring-green-300 bg-green-50'
                                                : 'border-neutral-300 focus:ring-primary-300'
                                        }`}
                                    />
                                    {tableLabel.trim() && !/\d/.test(tableLabel) && (
                                        <p className="text-xs text-red-500 mt-1">
                                            ⚠ Must include at least one number (e.g., T1, Table 5)
                                        </p>
                                    )}
                                    {tableLabel.trim() && /\d/.test(tableLabel) && (
                                        <p className="text-xs text-green-600 mt-1">✓ Valid table number</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cart Items */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                        <h3 className="font-bold text-neutral-900 mb-4">Items Added</h3>
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const itemPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
                                return (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-neutral-900">{item.name}</h4>
                                            <p className="text-sm text-neutral-500">PKR {itemPrice} x {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-neutral-50 rounded-lg p-1">
                                            <button
                                                onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-neutral-600 hover:text-red-500"
                                            >
                                                {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : '-'}
                                            </button>
                                            <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-green-600"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="w-16 text-right font-medium text-neutral-900">
                                            PKR {itemPrice * item.quantity}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cooking Instructions */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                        <h3 className="font-bold text-neutral-900 mb-2">Cooking Instructions</h3>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="e.g. Less spicy, no cutlery needed..."
                            className="w-full border border-neutral-200 rounded-lg p-3 text-sm focus:ring-primary-500 focus:border-primary-500"
                            rows="2"
                        />
                    </div>
                </div>

                {/* ── Right Col ─ Bill & Payment ── */}
                <div className="space-y-6">

                    {/* Bill Details */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                        <h3 className="font-bold text-neutral-900 mb-4">Bill Details</h3>
                        <div className="space-y-2 text-sm text-neutral-600 border-b border-neutral-100 pb-4">
                            <div className="flex justify-between">
                                <span>Item Total</span>
                                <span>PKR {cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee > 0 ? `PKR ${deliveryFee}` : 'FREE'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes (5%)</span>
                                <span>PKR {taxes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>PKR {platformFee}</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-neutral-900 pt-4">
                            <span>To Pay</span>
                            <span>PKR {grandTotal}</span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-100">
                        <h3 className="font-bold text-neutral-900 mb-3">Payment Method</h3>

                        {/* Merchant payment note */}
                        {merchantNote && (
                            <div className="mb-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                                <span>📋</span>
                                <span>{merchantNote}</span>
                            </div>
                        )}

                        {/* No payment methods configured edge case */}
                        {!cashAvailable && !gpayAvailable && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-3">
                                {!cashEnabled && !gpayEnabled 
                                    ? "This restaurant has not enabled any payment methods yet. Please contact the restaurant."
                                    : "This restaurant has enabled digital payments but hasn't configured an account to receive them. Please select cash or contact the restaurant."
                                }
                            </div>
                        )}

                        {/* If GPay is enabled but not configured, show a warning if they don't have other options or if we just want to let them know */}
                        {gpayEnabled && !gpayConfigured && selectedMethod === 'none' && (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm mb-3">
                                Digital payments are currently unavailable as the restaurant has not set up their receiving account.
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* Google Pay Option — only if restaurant enabled it AND configured it */}
                            {gpayAvailable && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedMethod('gpay')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedMethod === 'gpay'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-neutral-200 hover:border-primary-300 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#fff" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sm text-neutral-900">Google Pay</p>
                                            <p className="text-xs text-neutral-500">Fast &amp; Secure digital payment</p>
                                        </div>
                                    </div>
                                    {selectedMethod === 'gpay'
                                        ? <CheckCircle2 className="w-5 h-5 text-primary-600" />
                                        : <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    }
                                </button>
                            )}

                            {/* Cash on Delivery Option — only if restaurant enabled it */}
                            {cashAvailable && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedMethod('cash')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedMethod === 'cash'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-neutral-200 hover:border-primary-300 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Wallet className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sm text-neutral-900">Cash on Delivery</p>
                                            <p className="text-xs text-neutral-500">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                    {selectedMethod === 'cash'
                                        ? <CheckCircle2 className="w-5 h-5 text-primary-600" />
                                        : <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    }
                                </button>
                            )}

                            {/* Credit / Debit Card Option — only if restaurant enabled it AND configured it */}
                            {cardAvailable && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedMethod('card')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedMethod === 'card'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-neutral-200 hover:border-primary-300 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sm text-neutral-900">Credit / Debit Card</p>
                                            <p className="text-xs text-neutral-500">Pay via secure gateway</p>
                                        </div>
                                    </div>
                                    {selectedMethod === 'card'
                                        ? <CheckCircle2 className="w-5 h-5 text-primary-600" />
                                        : <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    }
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {paymentError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {paymentError}
                        </div>
                    )}

                    {/* ── Payment Action ── */}
                    {selectedMethod === 'gpay' && gpayAvailable ? (
                        <div className="space-y-3">
                            {/* Simplified Google Pay Option Panel */}
                            <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#fff" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900 text-sm">Pay via Google Pay</p>
                                        <p className="text-xs text-neutral-500">Secure, one-tap payment</p>
                                    </div>
                                </div>
                            </div>

                            {gpayConfigured ? (
                                <GooglePayButton
                                    amount={grandTotal}
                                    currency="PKR"
                                    label={`Order from ${restaurant?.name || 'Restaurant'}`}
                                    onSuccess={handleGooglePaySuccess}
                                    onError={handleGooglePayError}
                                    disabled={isProcessing}
                                />
                            ) : (
                                <div className="w-full text-center text-red-500 py-3 font-medium bg-red-50 rounded-lg border border-red-100">
                                    Google Pay not fully configured by restaurant.
                                </div>
                            )}
                        </div>
                    ) : selectedMethod === 'cash' && cashAvailable ? (
                        <div className="space-y-3">
                            <Button
                                onClick={handleCashCheckout}
                                className="w-full py-4 text-lg shadow-xl shadow-primary-500/20"
                                isLoading={isProcessing}
                            >
                                Place Order • PKR {grandTotal}
                            </Button>
                        </div>
                    ) : selectedMethod === 'card' && cardAvailable ? (
                        <div className="space-y-3">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">💳 Secure Card Payment</p>
                                <p className="text-sm text-neutral-600">You will be redirected to our secure mock gateway to complete your payment.</p>
                            </div>
                            <Button
                                onClick={handleCardCheckout}
                                className="w-full py-4 text-lg shadow-xl shadow-primary-500/20"
                                isLoading={isProcessing}
                            >
                                Pay with Card • PKR {grandTotal}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onForgotPassword={handleOpenForgot}
            />
            <ForgotPasswordModal
                isOpen={isForgotOpen}
                onClose={() => setIsForgotOpen(false)}
                onSwitchToLogin={handleOpenLogin}
            />
            <MockGatewayModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                amount={grandTotal}
                restaurantName={restaurant?.name}
                onSuccess={handleCardSuccess}
            />
        </div>
    );
};

export default CartPage;
