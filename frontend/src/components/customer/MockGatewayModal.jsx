import React, { useState } from 'react';
import { CreditCard, Lock, X } from 'lucide-react';
import Button from '../ui/Button';

/**
 * MockGatewayModal
 * Simulates a realistic popup overlay for a payment gateway like Stripe or Safepay.
 * Returns a mock token after simulating network delay.
 */
const MockGatewayModal = ({ isOpen, onClose, amount, onSuccess, restaurantName }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    // Formatting helpers
    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // strip non-digits
        val = val.substring(0, 16); // max 16 digits
        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setExpiry(val);
    };

    const handleCvvChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        setCvv(val.substring(0, 4));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Basic front-end validation
        if (cardNumber.replace(/\s/g, '').length < 15) {
            return setError('Please enter a valid card number.');
        }
        if (expiry.length < 5) return setError('Please enter valid expiry (MM/YY).');
        if (cvv.length < 3) return setError('Please enter CVV.');

        setIsProcessing(true);

        // Simulate 2 seconds network delay for "processing" with Gateway
        setTimeout(() => {
            setIsProcessing(false);
            
            // Randomly succeed, or just always succeed since it's a test gateway
            const mockToken = 'tok_test_' + Math.random().toString(36).substring(2, 15);
            onSuccess(mockToken);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-neutral-900 text-white p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-neutral-400 font-medium tracking-widest uppercase mb-1">Secure Checkout</p>
                        <h3 className="text-lg font-semibold">{restaurantName || 'Order Payment'}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">To Pay</p>
                        <p className="text-xl font-bold">PKR {amount}</p>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Security Notice */}
                    <div className="flex items-center gap-2 mb-6 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100 font-medium">
                        <Lock size={16} />
                        <span>256-bit Encrypted Transaction</span>
                    </div>

                    <div className="space-y-4">
                        {/* Card Number */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Card Number</label>
                            <div className="relative">
                                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    disabled={isProcessing}
                                    className="w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={handleExpiryChange}
                                    disabled={isProcessing}
                                    className="w-full px-3 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 text-center font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">CVV</label>
                                <input
                                    type="password"
                                    placeholder="•••"
                                    value={cvv}
                                    onChange={handleCvvChange}
                                    disabled={isProcessing}
                                    className="w-full px-3 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 text-center tracking-widest font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-red-600 font-medium text-center">{error}</p>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 py-3 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            isLoading={isProcessing}
                            className="flex-[2] py-3 text-base shadow-lg shadow-primary/20"
                        >
                            {isProcessing ? 'Processing...' : `Pay PKR ${amount}`}
                        </Button>
                    </div>
                </form>

                {/* Subfooter */}
                <div className="bg-neutral-50 px-6 py-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
                    <Lock size={12} />
                    <span>Test Gateway — DO NOT enter real card numbers</span>
                </div>
            </div>
        </div>
    );
};

export default MockGatewayModal;
