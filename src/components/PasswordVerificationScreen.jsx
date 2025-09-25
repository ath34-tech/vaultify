import React, { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Shield } from 'lucide-react';

export function PasswordVerificationScreen({ user, onBack, onVerified }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate password verification process
    // In a real app, this would verify against the user's actual password
    setTimeout(() => {
      // For demo purposes, we'll accept any password that's at least 6 characters
      // In a real app, this would verify against the stored user password
      if (password.length >= 6) {
        onVerified();
      } else {
        setError('Incorrect password. Please try again.');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            disabled={isVerifying}
          >
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <h1 className="text-xl text-blue-900">Verify Password</h1>
        </div>

        {/* Security Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <h2 className="text-lg text-gray-900 mb-2">Security Verification Required</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            For your security, please enter your account password to continue editing password details.
          </p>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Enter Your Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isVerifying}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
              disabled={isVerifying}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || !password.trim()}
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-base"
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Verify Password
            </>
          )}
        </button>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-100 rounded-xl">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-900 text-sm">
                <span className="font-medium">Security Note:</span> This verification ensures that only you can modify your saved passwords, even if someone else has access to your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}