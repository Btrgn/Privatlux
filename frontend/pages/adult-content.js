import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AlertTriangle, Shield, Users, Eye, CheckCircle } from 'lucide-react';

const AdultContent = () => {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleConfirm = () => {
    setHasConfirmed(true);
    // Store confirmation in localStorage
    localStorage.setItem('adultContentConfirmed', 'true');
  };

  if (hasConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Confirmed</h2>
          <p className="text-gray-600 mb-6">You have confirmed that you meet the age requirements.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to PrivatLux
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Adult Content Warning - PrivatLux</title>
        <meta name="description" content="Adult Content Warning - Age verification required" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Warning Header */}
        <div className="text-center mb-8">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Adult Content Warning</h1>
          <p className="text-xl text-gray-600">This website contains adult content and is intended for individuals aged 18 and above.</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          
          {/* Service Description */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About PrivatLux</h2>
            <p className="text-gray-700 leading-relaxed">
              PrivatLux provides advertising space for individuals offering adult sexual services, adult content, and companionship. 
              PrivatLux is not an escort agency and does not play any part in the booking of services advertised.
            </p>
          </div>

          {/* Age Verification Requirements */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Age Verification Required
            </h3>
            <p className="text-yellow-700 mb-4">
              To access this category, you confirm that you:
            </p>
            <ul className="space-y-2 text-yellow-700">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Are aged 18 or above, or of legal age as defined by the country or state from where you are accessing the Site, whichever is higher.
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Understand that this part of the Site contains age-restricted explicit content, including nudity and other adult sexual imagery.
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Will not copy, modify, or distribute any images on the Site without explicit permissions/consent from the owner.
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Are accessing the Site from a country or state where it is legal to access adult websites and view sexually explicit material.
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Will not permit any person(s) under the age of 18 to access this part of the Site.
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Have read and agree to the Terms and Conditions and Privacy Policy.
              </li>
            </ul>
          </div>

          {/* Legal Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Legal Notice
            </h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              By proceeding, you acknowledge that you are of legal age and that viewing adult content is legal in your jurisdiction. 
              You also agree to comply with all applicable laws and regulations regarding adult content and services.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-5 h-5" />
              I Confirm I Am 18+ and Want to Continue
            </button>
            
            <Link 
              href="https://www.google.com"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              I Am Under 18 - Leave This Site
            </Link>
          </div>

          {/* Additional Links */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                Terms and Conditions
              </Link>
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            This warning is displayed in compliance with legal requirements for adult content websites.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdultContent; 