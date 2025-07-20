import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Terms and Conditions - PrivatLux</title>
        <meta name="description" content="Terms and Conditions for PrivatLux - Adult Services Platform" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              PrivatLux provides advertising space for individuals offering adult sexual services, adult content, and companionship. 
              PrivatLux is not an escort agency and does not play any part in the booking of services advertised.
            </p>
          </section>

          {/* Age Verification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Age Verification and Access</h2>
            <p className="text-gray-700 mb-4">
              To access this category, you confirm that you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Are aged 18 or above, or of legal age as defined by the country or state from where you are accessing the Site, whichever is higher.</li>
              <li>Understand that this part of the Site contains age-restricted explicit content, including nudity and other adult sexual imagery.</li>
              <li>Will not copy, modify, or distribute any images on the Site without explicit permissions/consent from the owner.</li>
              <li>Are accessing the Site from a country or state where it is legal to access adult websites and view sexually explicit material.</li>
              <li>Will not permit any person(s) under the age of 18 to access this part of the Site.</li>
              <li>Have read and agree to the Terms and Conditions and Privacy Policy.</li>
            </ul>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              PrivatLux operates as an advertising platform that allows individuals to promote adult services, companionship, and related content. 
              We provide the technical infrastructure and advertising space but do not participate in, facilitate, or arrange any services between users.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Legal Compliance</h3>
                <p className="text-gray-700">
                  Users must ensure that all activities conducted through our platform comply with local, state, and federal laws. 
                  It is the user's responsibility to verify the legality of their activities in their jurisdiction.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Content Accuracy</h3>
                <p className="text-gray-700">
                  All content posted by users must be accurate, truthful, and not misleading. 
                  Users are responsible for the accuracy of all information they provide.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">4.3 Prohibited Activities</h3>
                <p className="text-gray-700">
                  Users are prohibited from engaging in any illegal activities, including but not limited to human trafficking, 
                  exploitation of minors, or any form of coercion or force.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to protecting your privacy. Please review our Privacy Policy for detailed information about 
              how we collect, use, and protect your personal information.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimers</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                PrivatLux provides this platform "as is" without any warranties. We do not guarantee the accuracy, 
                completeness, or usefulness of any information on the platform.
              </p>
              <p className="text-gray-700">
                We are not responsible for any arrangements, agreements, or transactions made between users outside of our platform.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              PrivatLux shall not be liable for any direct, indirect, incidental, special, or consequential damages 
              arising from the use of our platform or any services advertised thereon.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Continued use of the platform constitutes acceptance of any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us through our platform.
            </p>
          </section>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              By using PrivatLux, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 