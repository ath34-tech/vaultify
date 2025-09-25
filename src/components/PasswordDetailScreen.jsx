import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ArrowLeft, Eye, EyeOff, Copy, Mail, User, Phone, Calendar, Shield, Edit, Trash2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function PasswordDetailScreen({ password, onBack, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const maskText = (text) => {
    return '•'.repeat(text.length);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStoredFieldsCount = () => {
    let count = 1; // password is always stored
    if (password.email) count++;
    if (password.username) count++;
    if (password.mobile) count++;
    return count;
  };

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    
    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password.password);

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-blue-900 font-medium">Password Details</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline" 
              size="icon"
              onClick={onEdit}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon" 
              onClick={onDelete}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">{password.icon || '🔐'}</span>
            </div>
            <CardTitle className="text-blue-900 text-2xl">{password.platform}</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Shield className="w-3 h-3 mr-1" />
                {getStoredFieldsCount()} fields stored
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stored Login Information */}
            <div>
              <h3 className="text-blue-800 font-medium mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Stored Login Information
              </h3>
              <div className="space-y-3">
                {password.email && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-blue-800 font-medium text-sm">Email Address</p>
                        <p className="text-blue-900">{password.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(password.email, 'Email')}
                      className="text-blue-600 hover:bg-blue-100"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {password.username && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-blue-800 font-medium text-sm">Username</p>
                        <p className="text-blue-900">{password.username}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(password.username, 'Username')}
                      className="text-blue-600 hover:bg-blue-100"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {password.mobile && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-blue-800 font-medium text-sm">Mobile Number</p>
                        <p className="text-blue-900">{password.mobile}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(password.mobile, 'Mobile')}
                      className="text-blue-600 hover:bg-blue-100"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Password Field */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-green-800 font-medium text-sm">Password</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${passwordStrength.color}`}></div>
                          <span className="text-green-700 text-xs">{passwordStrength.label} strength</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-green-600 hover:bg-green-100"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(password.password, 'Password')}
                        className="text-green-600 hover:bg-green-100"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-green-900 font-mono text-lg pl-8">
                    {showPassword ? password.password : maskText(password.password)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-blue-100" />

            {/* Timestamp Information */}
            <div>
              <h3 className="text-blue-800 font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline
              </h3>
              <div className="space-y-3">
                {password.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-blue-800 font-medium text-sm">Created</p>
                      <p className="text-blue-600 text-sm">{formatDate(password.createdAt)}</p>
                    </div>
                  </div>
                )}
                {password.updatedAt && password.updatedAt !== password.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-blue-800 font-medium text-sm">Last Updated</p>
                      <p className="text-blue-600 text-sm">{formatDate(password.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Information */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-blue-800 font-medium text-sm mb-2">Security Information</h4>
              <div className="space-y-1 text-xs text-blue-600">
                <p>• Password length: {password.password.length} characters</p>
                <p>• Stored securely with encryption</p>
                <p>• Only visible when you choose to show it</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={onEdit}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Password
          </Button>
          <Button
            variant="outline"
            onClick={onDelete}
            className="w-full h-12 border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Password
          </Button>
        </div>
      </div>
    </div>
  );
}