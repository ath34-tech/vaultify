import React, { useState } from 'react';
import { userAPI } from '../api';
import { Button } from '../frontpart/button';
import { Input } from '../frontpart/input';
import { Label } from '../frontpart/label';
import { Card, CardContent, CardHeader, CardTitle } from '../frontpart/card';
import { Avatar, AvatarImage, AvatarFallback } from '../frontpart/avatar';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export function ProfileScreen({
  user,
  onBack,
  onLogout,
  onUpdateProfile,
  loading
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
    setShowPasswordFields(false);
  };

  const handleSave = async () => {
    try {
      if (showPasswordFields) {
        // Change password flow
        if (!formData.currentPassword) {
          toast.error('Current password is required');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        if (formData.newPassword.length < 6) {
          toast.error('New password must be at least 6 characters');
          return;
        }
        setPasswordLoading(true);
        await userAPI.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        toast.success('Password updated successfully');
        setShowPasswordFields(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        // Profile update flow (requires old password)
        if (!formData.currentPassword) {
          toast.error('Old password is required to update profile');
          return;
        }
        await onUpdateProfile({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          oldPassword: formData.currentPassword,
                    newPassword: formData.currentPassword

        });
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.message || 'Update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            disabled={loading || passwordLoading}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-blue-900">Profile & Settings</h1>
          {!isEditing && !showPasswordFields && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              <Edit2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader className="text-center pb-4">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage />
              <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-blue-900">{user.name}</CardTitle>
            <p className="text-blue-600">SafeVault User</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-800 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                disabled={!isEditing || loading}
                className="h-12"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                disabled={!isEditing || loading}
                className="h-12"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-blue-800 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Mobile Number
              </Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={e => handleChange('mobile', e.target.value)}
                disabled={!isEditing || loading}
                className="h-12"
              />
            </div>

            {/* Current Password for profile update */}
            {isEditing && !showPasswordFields && (
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-blue-800 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={e => handleChange('currentPassword', e.target.value)}
                  disabled={loading}
                  className="h-12"
                  placeholder="Enter your current password"
                />
              </div>
            )}

            {/* Action buttons */}
            {isEditing && !showPasswordFields && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Lock className="w-5 h-5" /> Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Toggle password change form */}
            {!showPasswordFields ? (
              <Button
                variant="outline"
                onClick={() => setShowPasswordFields(true)}
                disabled={loading || passwordLoading}
                className="w-full h-12"
              >
                Change Password
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-blue-800">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={e => handleChange('newPassword', e.target.value)}
                    disabled={passwordLoading}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-800">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    disabled={passwordLoading}
                    className="h-12"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} disabled={passwordLoading}>
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordFields(false)}
                    disabled={passwordLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4">
            <Button
              variant="destructive"
              onClick={onLogout}
              disabled={loading || isEditing || showPasswordFields}
              className="w-full h-12"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-blue-600 text-sm mt-6">
          <p>SafeVault v1.0</p>
          <p>Your passwords are encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
