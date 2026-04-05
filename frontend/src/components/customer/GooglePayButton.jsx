import React, { useEffect, useRef, useState } from 'react';

/**
 * GooglePayButton Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Integrates the Google Pay JavaScript API in TEST environment.
 * This shows a real Google Pay payment sheet, but processes NO real money.
 * The returned paymentToken is a fake test token for demo/FYP purposes.
 *
 * Usage:
 *   <GooglePayButton
 *     amount="1250"
 *     currency="PKR"
 *     label="Total"
 *     onSuccess={(paymentData) => { ... }}
 *     onError={(err) => { ... }}
 *     disabled={false}
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 */
const GooglePayButton = ({
    amount,
    currency = 'PKR',
    label = 'Total',
    onSuccess,
    onError,
    disabled = false,
}) => {
    const containerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const paymentsClientRef = useRef(null);

    // ── Google Pay configuration ─────────────────────────────────────────────

    const googlePayBaseConfig = {
        apiVersion: 2,
        apiVersionMinor: 0,
    };

    // Allowed payment methods — TEST tokenization
    const allowedPaymentMethods = [
        {
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    // Using a TEST gateway — replace with real gateway in production
                    gateway: 'example',
                    gatewayMerchantId: 'exampleGatewayMerchantId',
                },
            },
        },
    ];

    // Merchant info — TEST merchant. Replace with real info in production.
    const merchantInfo = {
        merchantName: 'OrderIQ',
        merchantId: '01234567890123456789', // TEST merchant ID
    };

    // Transaction info
    const getTransactionInfo = () => ({
        countryCode: 'PK',
        currencyCode: currency,
        totalPriceStatus: 'FINAL',
        totalPrice: String(parseFloat(amount).toFixed(2)),
        totalPriceLabel: label,
    });

    // ── Initialize Google Pay ────────────────────────────────────────────────

    const getGooglePaymentsClient = () => {
        if (!paymentsClientRef.current) {
            paymentsClientRef.current = new window.google.payments.api.PaymentsClient({
                environment: 'TEST', // ← TEST mode: no real charges
            });
        }
        return paymentsClientRef.current;
    };

    const isReadyToPayRequest = {
        ...googlePayBaseConfig,
        allowedPaymentMethods,
    };

    const buildPaymentDataRequest = () => ({
        ...googlePayBaseConfig,
        allowedPaymentMethods,
        transactionInfo: getTransactionInfo(),
        merchantInfo,
    });

    // ── Load Google Pay script dynamically ──────────────────────────────────

    useEffect(() => {
        // Check if script already loaded
        if (window.google?.payments?.api) {
            initializeGooglePay();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        script.async = true;
        script.onload = () => initializeGooglePay();
        script.onerror = () => {
            console.error('[GooglePay] Failed to load Google Pay script.');
            if (onError) onError(new Error('Failed to load Google Pay SDK.'));
        };
        document.body.appendChild(script);

        return () => {
            // Clean up script if component unmounts before load
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []); // Only run once on mount

    const initializeGooglePay = async () => {
        try {
            const paymentsClient = getGooglePaymentsClient();
            const response = await paymentsClient.isReadyToPay(isReadyToPayRequest);
            if (response.result) {
                setIsReady(true);
            } else {
                console.warn('[GooglePay] Google Pay is not available on this device/browser.');
            }
        } catch (err) {
            console.error('[GooglePay] isReadyToPay error:', err);
            if (onError) onError(err);
        }
    };

    // ── Handle payment button click ──────────────────────────────────────────

    const handlePayment = async () => {
        if (disabled || isLoading) return;

        setIsLoading(true);
        try {
            const paymentsClient = getGooglePaymentsClient();
            const paymentDataRequest = buildPaymentDataRequest();
            const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);

            // paymentData.paymentMethodData.tokenizationData.token is the payment token
            // In TEST mode this is a fake token — in production, send to your gateway
            if (onSuccess) {
                onSuccess(paymentData);
            }
        } catch (err) {
            if (err.statusCode === 'CANCELED') {
                // User dismissed the payment sheet — not an error
                console.log('[GooglePay] User cancelled payment.');
            } else {
                console.error('[GooglePay] Payment error:', err);
                if (onError) onError(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────

    if (!isReady) {
        // Show a loading skeleton while Google Pay initializes
        return (
            <div className="w-full h-14 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
                <span className="text-xs text-gray-400">Loading Google Pay...</span>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full">
            <button
                type="button"
                onClick={handlePayment}
                disabled={disabled || isLoading}
                className={`
                    w-full h-14 rounded-xl font-semibold text-white text-base
                    flex items-center justify-center gap-3
                    transition-all duration-200 select-none
                    ${disabled || isLoading
                        ? 'opacity-60 cursor-not-allowed bg-gray-800'
                        : 'bg-[#1a1a1a] hover:bg-[#2d2d2d] active:scale-[0.98] shadow-lg shadow-black/20'
                    }
                `}
                aria-label="Pay with Google Pay"
                id="google-pay-button"
            >
                {isLoading ? (
                    <>
                        {/* Spinner */}
                        <svg
                            className="w-5 h-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        {/* Google Pay "G Pay" Logo SVG */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            aria-hidden="true"
                        >
                            {/* G */}
                            <path
                                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                                fill="#fff"
                            />
                        </svg>
                        <span className="tracking-wide">Buy with</span>
                        {/* Google Pay wordmark */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 41 17"
                            height="17"
                            aria-hidden="true"
                        >
                            <path
                                d="M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.882.605-1.437 0-.544-.202-1.018-.605-1.422-.392-.413-.888-.62-1.488-.62h-2.518zm0 5.52v4.736h-1.504V1.198h3.99c1.013 0 1.873.337 2.582 1.012.72.675 1.08 1.497 1.08 2.466 0 .991-.36 1.819-1.08 2.482-.697.665-1.559.996-2.583.996h-2.485zm7.668 2.287c0 .392.166.718.499.98.332.26.722.39 1.168.39.633 0 1.196-.234 1.692-.701.497-.469.744-1.019.744-1.65-.469-.37-1.123-.555-1.962-.555-.61 0-1.12.148-1.528.442-.409.294-.613.657-.613 1.094m1.946-5.815c1.112 0 1.989.297 2.633.89.642.594.964 1.408.964 2.442v4.932h-1.439v-1.11h-.065c-.622.914-1.45 1.372-2.486 1.372-.882 0-1.621-.262-2.215-.784-.594-.523-.891-1.176-.891-1.96 0-.828.313-1.486.94-1.976s1.463-.735 2.51-.735c.892 0 1.629.163 2.206.49v-.344c0-.522-.207-.966-.621-1.33a2.132 2.132 0 0 0-1.455-.547c-.84 0-1.504.353-1.995 1.062l-1.324-.834c.73-1.045 1.81-1.568 3.238-1.568m9.558.195l-5.087 11.69H32.06l1.894-4.075-3.364-7.616h1.635l2.453 5.88h.032l2.39-5.88z"
                                fill="#fff"
                            />
                            <path
                                d="M13.448 7.134c0-.473-.04-.93-.116-1.366H6.988v2.588l3.634.001a3.145 3.145 0 0 1-1.354 2.074v1.716h2.19c1.284-1.18 2.02-2.92 2.02-5.013"
                                fill="#4285F4"
                            />
                            <path
                                d="M6.988 13.7c1.816 0 3.344-.595 4.46-1.653l-2.19-1.716c-.61.41-1.393.655-2.27.655-1.748 0-3.23-1.18-3.758-2.766H.977v1.77A6.728 6.728 0 0 0 6.988 13.7"
                                fill="#34A853"
                            />
                            <path
                                d="M3.23 8.22a4.076 4.076 0 0 1 0-2.602V3.848H.977a6.76 6.76 0 0 0 0 6.141L3.23 8.22z"
                                fill="#FABB05"
                            />
                            <path
                                d="M6.988 2.852c.983 0 1.865.338 2.56 1.001l1.93-1.93C10.325.931 8.797.272 6.988.272A6.728 6.728 0 0 0 .977 3.848L3.23 5.618c.527-1.587 2.01-2.766 3.758-2.766"
                                fill="#E94235"
                            />
                        </svg>
                    </>
                )}
            </button>

            {/* TEST MODE badge */}
            <p className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-2 font-medium">
                🧪 Test Mode — No real money charged
            </p>
        </div>
    );
};

export default GooglePayButton;
