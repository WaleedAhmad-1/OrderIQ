import { useRef, useState, useEffect } from 'react';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Bell,
  CreditCard,
  Puzzle,
  LifeBuoy,
  Upload,
  Save,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useRestaurant } from '../../features/restaurant/RestaurantContext';
import { restaurantService } from '../../services/restaurant.service';
import { uploadService } from '../../services/upload.service';
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

  // Sync from context once loaded
  useEffect(() => {
    if (restaurant) {
      setRestaurantData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        // Phone and email are on the owner User record, not the restaurant
        phone: profile?.phone || '',
        email: profile?.email || '',
        cuisine: restaurant.cuisineTypes || [],
        logo: restaurant.logo || '',  // schema field is 'logo'
        coverImage: restaurant.coverImage || '',
        prepTime: restaurant.prepTime || 20,
        deliveryFee: restaurant.deliveryFee || 0,
      });
    }
  }, [restaurant, profile]);

  const [notifications, setNotifications] = useState({
    newOrderSound: true,
    browserNotifications: false,
    emailSummaries: true,
  });

  const tabs = [
    { id: 'profile', label: 'Restaurant Profile', icon: <Building size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'payments', label: 'Payment & Fees', icon: <CreditCard size={16} /> },
    { id: 'integrations', label: 'Integrations', icon: <Puzzle size={16} /> },
    { id: 'support', label: 'Support', icon: <LifeBuoy size={16} /> },
  ];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const setLoading = type === 'logo' ? setLogoLoading : setCoverLoading;
    const field = type === 'logo' ? 'logo' : 'coverImage';

    try {
      setLoading(true);
      const { url } = await uploadService.uploadImage(file);
      setRestaurantData(prev => ({ ...prev, [field]: url }));
      toast.success(`${type === 'logo' ? 'Logo' : 'Cover image'} uploaded!`);
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!restaurant?.id) { toast.error('Restaurant info not loaded'); return; }
    setSaving(true);
    try {
      // Only send actual Restaurant model fields
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

  const handleSupportAction = (action) => {
    window.alert(`${action} (demo action).`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Cover Image Section */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Cover Image</h3>
              <div className="relative group">
                <div className="w-full h-48 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                  {coverLoading && (
                    <div className="absolute inset-0 z-10 bg-black/20 flex items-center justify-center">
                      <RefreshCw className="text-white animate-spin" size={32} />
                    </div>
                  )}
                  {restaurantData.coverImage ? (
                    <img src={restaurantData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                      <Building size={48} className="mb-2 opacity-20" />
                      <p className="text-sm">Default cover being used</p>
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                  />
                  <button
                    onClick={handleCoverClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur shadow-sm border border-neutral-200 rounded-lg text-neutral-700 hover:bg-white transition-all font-medium"
                  >
                    <Upload size={16} />
                    {restaurantData.coverImage ? 'Change Cover' : 'Upload Cover'}
                  </button>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mt-2">Recommended: 1600 × 400px. High resolution food or ambiance shot.</p>
            </div>

            {/* Logo Section */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Restaurant Logo</h3>
              <div className="flex items-start gap-6">
                <div className="relative w-32 h-32 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                  {logoLoading && (
                    <div className="absolute inset-0 z-10 bg-black/20 flex items-center justify-center">
                      <RefreshCw className="text-white animate-spin" size={24} />
                    </div>
                  )}
                  {restaurantData.logo ? (
                    <img src={restaurantData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building size={32} className="text-neutral-400" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                  />
                  <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center gap-2 mb-2 font-medium"
                  >
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
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={restaurantData.name}
                  onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                <div className="flex gap-2">
                  <MapPin className="text-neutral-400 mt-3" size={16} />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={restaurantData.address}
                    onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                  <div className="flex gap-2">
                    <Phone className="text-neutral-400 mt-3" size={16} />
                    <input
                      type="tel"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={restaurantData.phone}
                      onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <div className="flex gap-2">
                    <Mail className="text-neutral-400 mt-3" size={16} />
                    <input
                      type="email"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={restaurantData.email}
                      onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
                    />
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
                <input
                  type="text"
                  placeholder="Add cuisine type"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setRestaurantData({
                        ...restaurantData,
                        cuisine: [...restaurantData.cuisine, e.target.value.trim()]
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              {/* Service Parameters Section */}
              <div className="pt-6 border-t border-neutral-100">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Service & Delivery</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Avg. Prep Time (minutes)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        type="number"
                        min="1"
                        max="120"
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={restaurantData.prepTime}
                        onChange={(e) => setRestaurantData({ ...restaurantData, prepTime: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Shown to customers as a ±5 min range.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Delivery Fee (PKR)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">PKR</div>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                        value={restaurantData.deliveryFee}
                        onChange={(e) => setRestaurantData({ ...restaurantData, deliveryFee: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Set to 0 for Free Delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">New Order Sound</p>
                  <p className="text-sm text-neutral-600">Play sound when new order arrives</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, newOrderSound: !notifications.newOrderSound })}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications.newOrderSound ? 'bg-primary' : 'bg-neutral-300'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${notifications.newOrderSound ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">Browser Notifications</p>
                  <p className="text-sm text-neutral-600">Desktop notifications for new orders</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, browserNotifications: !notifications.browserNotifications })}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications.browserNotifications ? 'bg-primary' : 'bg-neutral-300'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${notifications.browserNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">Email Summaries</p>
                  <p className="text-sm text-neutral-600">Daily sales reports via email</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, emailSummaries: !notifications.emailSummaries })}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications.emailSummaries ? 'bg-primary' : 'bg-neutral-300'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${notifications.emailSummaries ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Payment Settings</h3>
              <p className="text-neutral-600">Configure payment processors and fees</p>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Puzzle size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Integrations</h3>
              <p className="text-neutral-600">Connect third-party services and tools</p>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Need Help?</h3>
              <p className="text-neutral-600 mb-4">We're here to support you</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleSupportAction('Open Help Center')}
                  className="w-full p-4 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left"
                >
                  <p className="font-medium">Help Center</p>
                  <p className="text-sm text-neutral-600">Browse articles and guides</p>
                </button>
                <button
                  onClick={() => handleSupportAction('Contact Support')}
                  className="w-full p-4 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left"
                >
                  <p className="font-medium">Contact Support</p>
                  <p className="text-sm text-neutral-600">Email our support team</p>
                </button>
                <button
                  onClick={() => handleSupportAction('Report Issue')}
                  className="w-full p-4 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left"
                >
                  <p className="font-medium">Report Issue</p>
                  <p className="text-sm text-neutral-600">Submit bug reports or feedback</p>
                </button>
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
        <div className="w-64">
          <div className="bg-white rounded-xl border border-neutral-200">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
