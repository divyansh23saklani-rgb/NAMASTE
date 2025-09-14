'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveUserToStorage, getDashboardUrl } from '@/lib/auth';
import { User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [providerType, setProviderType] = useState<'hospital' | 'insurance'>('hospital');
  const [formData, setFormData] = useState({
    providerId: '',
    username: '',
    password: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - in real app, this would be an API call
    if (formData.providerId && formData.username && formData.password) {
      const user: User = {
        providerType,
        providerId: formData.providerId,
        providerName: providerType === 'hospital' ? 'Apollo Hospital' : 'Health Insurance Co.',
        loginTime: new Date().toISOString()
      };

      saveUserToStorage(user);
      router.push(getDashboardUrl(user));
    } else {
      setError('Please fill in all fields');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Healthcare Provider Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your NAMASTE healthcare portal
          </p>
        </div>

        {/* Provider Type Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Provider Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleProviderTypeChange('hospital')}
              className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                providerType === 'hospital'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="font-semibold">Hospital</div>
              <div className="text-xs text-gray-500">Healthcare Provider</div>
            </button>

            <button
              type="button"
              onClick={() => handleProviderTypeChange('insurance')}
              className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                providerType === 'insurance'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="font-semibold">Insurance</div>
              <div className="text-xs text-gray-500">Insurance Provider</div>
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="providerId" className="form-label">
                Provider ID
              </label>
              <input
                id="providerId"
                name="providerId"
                type="text"
                required
                className="form-input"
                placeholder="Enter your provider ID"
                value={formData.providerId}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="form-input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
