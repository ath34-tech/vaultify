import React from 'react';
import { Button } from '../ui/button';
import { Shield, Lock } from 'lucide-react';

export function WelcomeScreen({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm mx-auto text-center space-y-8">
        {/* App Logo and Name */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-blue-900 mb-2">SafeVault</h1>
            <p className="text-blue-700 text-lg">All your passwords, safe and simple.</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 py-6">
          <div className="flex items-center space-x-3 text-blue-800">
            <Lock className="w-5 h-5" />
            <span>Secure & encrypted storage</span>
          </div>
          <div className="flex items-center space-x-3 text-blue-800">
            <Shield className="w-5 h-5" />
            <span>Easy to use interface</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            Log In
          </Button>
          <Button
            onClick={onRegister}
            variant="outline"
            className="w-full h-14 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Create Account
          </Button>
        </div>

        <p className="text-sm text-blue-600 mt-8">
          Your passwords are encrypted and secure with SafeVault
        </p>
      </div>
    </div>
  );
}