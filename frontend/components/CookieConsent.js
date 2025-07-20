import { useState, useEffect } from 'react';
import { X, Settings, Check } from 'lucide-react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setShowConsent(false);
    // Here you can add logic to enable all cookies
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setShowConsent(false);
    // Here you can add logic to enable only necessary cookies
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowConsent(false);
    setShowSettings(false);
    // Here you can add logic to enable selected cookies
  };

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Necessary cookies can't be disabled
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {!showSettings ? (
          // Main consent view
          <>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
              <button
                onClick={() => setShowConsent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              We use strictly necessary cookies on our website. We would also like to use additional cookies but we need your consent to do this. We will only set additional cookies if you agree.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Settings size={16} />
                Manage
              </button>
              
              <button
                onClick={handleAcceptNecessary}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Accept Necessary Only
              </button>
              
              <button
                onClick={handleAcceptAll}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </>
        ) : (
          // Settings view
          <>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cookie Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Necessary Cookies</h4>
                  <p className="text-sm text-gray-600">Required for the website to function properly</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how visitors interact with our website</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Used to track visitors across websites for marketing purposes</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                  <p className="text-sm text-gray-600">Enable enhanced functionality and personalization</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={() => handlePreferenceChange('functional')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSavePreferences}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
              
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CookieConsent; 