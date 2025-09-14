'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveUserToStorage, getDashboardUrl } from '@/lib/auth';
import { User } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [providerType, setProviderType] = useState<'hospital' | 'insurance'>('hospital');
  const [formData, setFormData] = useState({
    facilityName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    verificationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProviderTypeChange = (type: 'hospital' | 'insurance') => {
    setProviderType(type);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock credentials
    const providerId = `PROV-${Date.now()}`;
    const username = formData.facilityName.toLowerCase().replace(/\s+/g, '');
    const password = 'TempPass123!';

    const user: User = {
      providerType,
      providerId,
      providerName: formData.facilityName,
      loginTime: new Date().toISOString()
    };

    // Save registration data
    if (typeof window !== 'undefined') {
      localStorage.setItem('newRegistration', JSON.stringify({
        providerId,
        username,
        password,
        facilityName: formData.facilityName,
        providerType
      }));
    }

    saveUserToStorage(user);
    router.push(getDashboardUrl(user));
    setLoading(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleProviderTypeChange('hospital')}
                  className={`p-6 border-2 rounded-lg text-center transition-all duration-200 ${
                    providerType === 'hospital'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-3">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="font-semibold text-lg">Hospital</div>
                  <div className="text-sm text-gray-500 mt-1">Healthcare Provider</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleProviderTypeChange('insurance')}
                  className={`p-6 border-2 rounded-lg text-center transition-all duration-200 ${
                    providerType === 'insurance'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-3">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-lg">Insurance</div>
                  <div className="text-sm text-gray-500 mt-1">Insurance Provider</div>
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Facility Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="facilityName" className="form-label">
                    Facility Name
                  </label>
                  <input
                    id="facilityName"
                    name="facilityName"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter facility name"
                    value={formData.facilityName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson" className="form-label">
                    Contact Person
                  </label>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter contact person name"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="form-input"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    className="form-input"
                    rows={3}
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="form-label">
                    License Number
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter license number"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verification</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="verificationCode" className="form-label">
                    Verification Code
                  </label>
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter verification code"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter any 6-digit code for demo purposes
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Healthcare Provider
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the NAMASTE healthcare network
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card">
            {renderStep()}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
