import { useRef, useState, useEffect } from 'react';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  LifeBuoy,
  Upload,
  Save,
  RefreshCw,
  Clock,
  Wallet,
  Info,
  Landmark,
  Smartphone,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRestaurant } from '../../features/restaurant/RestaurantContext';
import { restaurantService } from '../../services/restaurant.service';
import { uploadService } from '../../services/upload.service';
import { paymentService } from '../../services/payment.service';
import { useAuth } from '../../features/auth/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { restaurant, refetch } = useRestaurant();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisine: [],
    logo: '',
    coverImage: '',
    prepTime: 20,
    deliveryFee: 0,
  });

  // Full payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    // Toggles
    cashEnabled: true,
    googlePayEnabled: true,
    cardEnabled: false,
    // Branding
    merchantName: '',
    merchantNote: '',
    // Digital wallet
    googlePayMerchantId: '',
    jazzCashNumber: '',
    easyPaisaNumber: '',
    // Bank account
    bankAccountTitle: '',
    bankAccountNumber: '',
    bankName: '',
    bankIBAN: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSaving, setPaymentSaving] = useState(false);
  // Which account sections are expanded
  const [expanded, setExpanded] = useState({ gpay: true, bank: true });

  // Sync restaurant profile from context
  useEffect(() => {
    if (restaurant) {
      setRestaurantData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        cuisine: restaurant.cuisineTypes || [],
        logo: restaurant.logo || '',
        coverImage: restaurant.coverImage || '',
        prepTime: restaurant.prepTime || 20,
        deliveryFee: restaurant.deliveryFee || 0,
      });
    }
  }, [restaurant, profile]);

  // Fetch payment settings when payment tab is opened
  useEffect(() => {
    if (activeTab !== 'payments' || !restaurant?.id) return;
    const fetchPaymentSettings = async () => {
      setPaymentLoading(true);
      try {
        const res = await paymentService.getRestaurantPaymentSettings(restaurant.id);
        if (res?.data) {
          const d = res.data;
          setPaymentSettings({
            cashEnabled:         d.cashEnabled        ?? true,
            googlePayEnabled:    d.googlePayEnabled   ?? true,
            cardEnabled:         d.cardEnabled        ?? false,
            merchantName:        d.merchantName       || '',
            merchantNote:        d.merchantNote       || '',
            googlePayMerchantId: d.googlePayMerchantId || '',
            jazzCashNumber:      d.jazzCashNumber     || '',
            easyPaisaNumber:     d.easyPaisaNumber    || '',
            bankAccountTitle:    d.bankAccountTitle   || '',
            bankAccountNumber:   d.bankAccountNumber  || '',
            bankName:            d.bankName           || '',
            bankIBAN:            d.bankIBAN           || '',
          });
        }
      } catch (err) {
        console.error('Failed to load payment settings:', err);
        toast.error('Could not load payment settings');
      } finally {
        setPaymentLoading(false);
      }
    };
    fetchPaymentSettings();
  }, [activeTab, restaurant?.id]);

  const tabs = [
    { id: 'profile',   label: 'Restaurant Profile', icon: <Building size={16} /> },
    { id: 'payments',  label: 'Payment & Fees',      icon: <CreditCard size={16} /> },
    { id: 'support',   label: 'Support',             icon: <LifeBuoy size={16} /> },
  ];

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleCoverClick  = () => coverInputRef.current?.click();

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image size must be less than 2MB'); return; }
    const setLoading = type === 'logo' ? setLogoLoading : setCoverLoading;
    const field      = type === 'logo' ? 'logo' : 'coverImage';
    try {
      setLoading(true);
      const { url } = await uploadService.uploadImage(file);
      setRestaurantData(prev => ({ ...prev, [field]: url }));
      toast.success(`${type === 'logo' ? 'Logo' : 'Cover image'} uploaded!`);
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!restaurant?.id) { toast.error('Restaurant info not loaded'); return; }
    setSaving(true);
    try {
      await restaurantService.updateRestaurant(restaurant.id, {
        name: restaurantData.name,
        address: restaurantData.address,
        cuisineTypes: restaurantData.cuisine,
        logo: restaurantData.logo,
        coverImage: restaurantData.coverImage,
        prepTime: restaurantData.prepTime,
        deliveryFee: restaurantData.deliveryFee,
      });
      toast.success('Settings saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    if (!restaurant?.id) return;
    if (!paymentSettings.cashEnabled && !paymentSettings.googlePayEnabled && !paymentSettings.cardEnabled) {
      toast.error('At least one payment method must be enabled.');
      return;
    }
    setPaymentSaving(true);
    try {
      await paymentService.updatePaymentSettings(restaurant.id, paymentSettings);
      toast.success('Payment settings saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save payment settings');
    } finally {
      setPaymentSaving(false);
    }
  };

  const set = (key, val) => setPaymentSettings(p => ({ ...p, [key]: val }));
  const toggleExpand = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  const handleSupportAction = (action) => window.alert(`${action} (demo action).`);

  // ─── Reusable components ───────────────────────────────────────────────────

  const Toggle = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${enabled ? 'bg-primary' : 'bg-neutral-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const Field = ({ label, placeholder, value, onChange, type = 'text', hint, maxLength }) => (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
    </div>
  );

  // ─── Account config completeness checker ──────────────────────────────────

  const gpayConfigured = paymentSettings.googlePayMerchantId && paymentSettings.googlePayMerchantId.trim() !== "";
  const cardConfigured = paymentSettings.gatewayPublicKey && paymentSettings.gatewayPublicKey.trim() !== "" && paymentSettings.gatewaySecretKey && paymentSettings.gatewaySecretKey.trim() !== "";

  // Check if current settings are valid for saving
  const isValid = (!paymentSettings.googlePayEnabled || gpayConfigured) && 
                  (!paymentSettings.cardEnabled || cardConfigured) &&
                  (paymentSettings.cashEnabled || paymentSettings.googlePayEnabled || paymentSettings.cardEnabled);

  const ConfigBadge = ({ ok, label }) => ok ? (
    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
      <CheckCircle2 size={12} /> {label}
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
      <AlertCircle size={12} /> Not configured
    </span>
  );

  // ─── Payment method block ──────────────────────────────────────────────────

  const MethodBlock = ({ icon, label, description, badge, enabled, onToggle, configuredLabel, isConfigured, expandKey, children }) => (
    <div className={`rounded-xl border-2 transition-all overflow-hidden ${enabled ? 'border-primary/30' : 'border-neutral-200'}`}>
      {/* Header row */}
      <div className={`flex items-center justify-between p-4 ${enabled ? 'bg-primary/5' : 'bg-white'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-primary/10' : 'bg-neutral-100'}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-neutral-800">{label}</p>
              {badge && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">{badge}</span>}
              {enabled && configuredLabel && <ConfigBadge ok={isConfigured} label={configuredLabel} />}
            </div>
            <p className="text-xs text-neutral-500 truncate">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
          <Toggle enabled={enabled} onChange={onToggle} />
          {expandKey && enabled && children && (
            <button type="button" onClick={() => toggleExpand(expandKey)}
              className="text-neutral-400 hover:text-neutral-600">
              {expanded[expandKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>
      {/* Expandable account config */}
      {expandKey && enabled && expanded[expandKey] && children && (
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {

      // ── Profile ────────────────────────────────────────────────────────────
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Cover Image */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Cover Image</h3>
              <div className="relative group">
                <div className="w-full h-48 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                  {coverLoading && (
                    <div className="absolute inset-0 z-10 bg-black/20 flex items-center justify-center">
                      <RefreshCw className="text-white animate-spin" size={32} />
                    </div>
                  )}
                  {restaurantData.coverImage
                    ? <img src={restaurantData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                        <Building size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">Default cover being used</p>
                      </div>
                  }
                </div>
                <div className="absolute top-4 right-4">
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageUpload(e, 'cover')} />
                  <button onClick={handleCoverClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur shadow-sm border border-neutral-200 rounded-lg text-neutral-700 hover:bg-white transition-all font-medium">
                    <Upload size={16} />
                    {restaurantData.coverImage ? 'Change Cover' : 'Upload Cover'}
                  </button>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mt-2">Recommended: 1600 × 400px.</p>
            </div>

            {/* Logo */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Restaurant Logo</h3>
              <div className="flex items-start gap-6">
                <div className="relative w-32 h-32 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                  {logoLoading && (
                    <div className="absolute inset-0 z-10 bg-black/20 flex items-center justify-center">
                      <RefreshCw className="text-white animate-spin" size={24} />
                    </div>
                  )}
                  {restaurantData.logo
                    ? <img src={restaurantData.logo} alt="Logo" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <Building size={32} className="text-neutral-400" />
                      </div>
                  }
                </div>
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageUpload(e, 'logo')} />
                  <button onClick={handleUploadClick}
                    className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center gap-2 mb-2 font-medium">
                    <Upload size={16} />
                    {restaurantData.logo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  <p className="text-sm text-neutral-500">Recommended: 400 × 400px, PNG or JPG</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Restaurant Name</label>
                <input type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={restaurantData.name}
                  onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                <div className="flex gap-2">
                  <MapPin className="text-neutral-400 mt-3" size={16} />
                  <input type="text"
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={restaurantData.address}
                    onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                  <div className="flex gap-2">
                    <Phone className="text-neutral-400 mt-3" size={16} />
                    <input type="tel"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={restaurantData.phone}
                      onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <div className="flex gap-2">
                    <Mail className="text-neutral-400 mt-3" size={16} />
                    <input type="email"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={restaurantData.email}
                      onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Cuisine Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {restaurantData.cuisine.map((tag) => (
                    <div key={tag} className="px-3 py-1 bg-neutral-100 rounded-full">
                      <span className="text-sm">{tag}</span>
                    </div>
                  ))}
                </div>
                <input type="text" placeholder="Add cuisine type (press Enter)"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setRestaurantData({ ...restaurantData, cuisine: [...restaurantData.cuisine, e.target.value.trim()] });
                      e.target.value = '';
                    }
                  }} />
              </div>
              <div className="pt-6 border-t border-neutral-100">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Service & Delivery</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Avg. Prep Time (minutes)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                      <input type="number" min="1" max="120"
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={restaurantData.prepTime}
                        onChange={(e) => setRestaurantData({ ...restaurantData, prepTime: parseInt(e.target.value) || 0 })} />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Shown to customers as a ±5 min range.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Delivery Fee (PKR)</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">PKR</div>
                      <input type="number" min="0" step="10"
                        className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                        value={restaurantData.deliveryFee}
                        onChange={(e) => setRestaurantData({ ...restaurantData, deliveryFee: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Set to 0 for Free Delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60">
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        );

      // ── Payments ───────────────────────────────────────────────────────────
      case 'payments':
        return (
          <div className="space-y-6">

            {/* Page header */}
            <div>
              <h3 className="text-xl font-bold text-neutral-800">Payment Configuration</h3>
              <p className="text-sm text-neutral-500 mt-1">
                Enable payment methods and configure the account details where you want to receive money.
                Each restaurant manages this independently.
              </p>
            </div>

            {paymentLoading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <>
                {/* ── 1. Google Pay ────────────────────────────────────────── */}
                <MethodBlock
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                        fill={paymentSettings.googlePayEnabled ? '#6c63ff' : '#9ca3af'} />
                    </svg>
                  }
                  label="Google Pay"
                  description="Receive automated payments via Google Pay"
                  enabled={paymentSettings.googlePayEnabled}
                  onToggle={(val) => set('googlePayEnabled', val)}
                  configuredLabel="Merchant ID set"
                  isConfigured={!!gpayConfigured}
                  expandKey="gpay"
                >
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Google Merchant Configuration
                  </p>

                  <Field
                    label="Google Pay Merchant ID (optional)"
                    placeholder="e.g. BCR2DN4T..."
                    value={paymentSettings.googlePayMerchantId}
                    onChange={(v) => set('googlePayMerchantId', v)}
                    hint="Your Google Pay / Google Business merchant identifier (used for automated payment routing)"
                  />

                  {!gpayConfigured && paymentSettings.googlePayEnabled && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs mb-4">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>Merchant ID is required to enable Google Pay.</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                    <Info size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Your Merchant ID is required to process automated Google Pay transactions.</span>
                  </div>
                </MethodBlock>

                {/* ── 2. Cash on Delivery ─────────────────────────── */}
                <MethodBlock
                  icon={<Wallet size={22} className={paymentSettings.cashEnabled ? 'text-primary' : 'text-neutral-400'} />}
                  label="Cash on Delivery"
                  description="Customers pay in cash when the order is delivered"
                  enabled={paymentSettings.cashEnabled}
                  onToggle={(val) => set('cashEnabled', val)}
                />

                {/* ── 3. Credit / Debit Card ─────────────────────────────────── */}
                <MethodBlock
                  icon={<CreditCard size={22} className={paymentSettings.cardEnabled ? 'text-primary' : 'text-neutral-400'} />}
                  label="Credit / Debit Card"
                  description="Secure card gateway (e.g. Stripe, Safepay)"
                  enabled={paymentSettings.cardEnabled}
                  onToggle={(val) => set('cardEnabled', val)}
                  configuredLabel="Gateway keys set"
                  isConfigured={!!cardConfigured}
                  expandKey="card"
                >
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Gateway Configuration
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Gateway Public Key"
                      placeholder="pk_test_..."
                      value={paymentSettings.gatewayPublicKey}
                      onChange={(v) => set('gatewayPublicKey', v)}
                    />
                    <Field
                      label="Gateway Secret Key"
                      placeholder="sk_test_..."
                      value={paymentSettings.gatewaySecretKey}
                      onChange={(v) => set('gatewaySecretKey', v)}
                      type="password"
                    />
                  </div>
                  
                  {!cardConfigured && paymentSettings.cardEnabled && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs mt-4">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>Both Public and Secret keys are required to enable Card payments.</span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs mt-4">
                    <Info size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Customers will be able to pay securely using their Visa or Mastercard directly on checkout.</span>
                  </div>
                </MethodBlock>

                {/* ── Validation alert ────────────────────────────────────────── */}
                {!paymentSettings.cashEnabled && !paymentSettings.googlePayEnabled && !paymentSettings.cardEnabled && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <Info size={16} className="mt-0.5 flex-shrink-0" />
                    <span>At least one payment method must be enabled so customers can place orders.</span>
                  </div>
                )}

                {/* ── Merchant note ─────────────────────────────────────────── */}
                <div className="border-t border-neutral-100 pt-6 space-y-4">
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Payment Note for Customers (optional)
                  </h4>
                  <textarea
                    placeholder="e.g. Please mention your building/floor number for faster delivery."
                    rows={3}
                    maxLength={250}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                    value={paymentSettings.merchantNote}
                    onChange={(e) => set('merchantNote', e.target.value)}
                  />
                  <p className="text-xs text-neutral-400">This message is shown to customers on the checkout page.</p>
                </div>

                {/* ── Save button ────────────────────────────────────── */}
                <button
                  onClick={handleSavePayment}
                  disabled={paymentSaving || !isValid}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                >
                  {paymentSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  {paymentSaving ? 'Saving...' : 'Save Payment Settings'}
                </button>
              </>
            )}
          </div>
        );

      // ── Support ────────────────────────────────────────────────────────────
      case 'support':
        return (
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Need Help?</h3>
              <p className="text-neutral-600 mb-4">We're here to support you</p>
              <div className="space-y-3">
                {['Help Center', 'Contact Support', 'Report Issue'].map(action => (
                  <button key={action} onClick={() => handleSupportAction(action)}
                    className="w-full p-4 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
                    <p className="font-medium">{action}</p>
                    <p className="text-sm text-neutral-600">{action === 'Help Center' ? 'Browse articles and guides' : action === 'Contact Support' ? 'Email our support team' : 'Submit bug reports or feedback'}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800">Settings</h1>

      <div className="flex gap-6">
        {/* Tabs Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-neutral-200">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-1 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}>
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
