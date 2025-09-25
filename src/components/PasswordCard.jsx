import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, EyeOff, Edit, Trash2, Copy, Mail, User, Phone, Calendar, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function PasswordCard({ password, onView, onEdit, onDelete }) {
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
      month: 'short', 
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

  return (
    <Card 
      className="bg-white shadow-sm border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onView}
    >
      <CardHeader className="pb-3">
        {/* Platform Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">{password.icon || '🔐'}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-blue-900 font-medium text-lg">{password.platform}</h3>
              <p className="text-blue-600 text-sm">
                {password.email || password.username || password.mobile || 'Account'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Stored Information Summary */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
            <Shield className="w-3 h-3 mr-1" />
            {getStoredFieldsCount()} fields stored
          </Badge>
          {password.createdAt && (
            <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
              <Calendar className="w-3 h-3 mr-1" />
              Added {formatDate(password.createdAt)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Stored Information Label */}
          <div className="border-t border-blue-100 pt-3">
            <h4 className="text-blue-800 font-medium text-sm mb-3">Stored Login Details:</h4>
          </div>

          {/* Account Details */}
          <div className="space-y-3">
            {password.email && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 text-sm">Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-900 text-sm">{password.email}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(password.email, 'Email');
                    }}
                    className="w-6 h-6 text-blue-600"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {password.username && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 text-sm">Username</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-900 text-sm">{password.username}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(password.username, 'Username');
                    }}
                    className="w-6 h-6 text-blue-600"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {password.mobile && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 text-sm">Mobile</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-900 text-sm">{password.mobile}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(password.mobile, 'Mobile');
                    }}
                    className="w-6 h-6 text-blue-600"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-green-800 text-sm">Password</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-900 text-sm font-mono">
                  {showPassword ? password.password : maskText(password.password)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="w-6 h-6 text-green-600"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(password.password, 'Password');
                  }}
                  className="w-6 h-6 text-green-600"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Timestamp Information */}
          {(password.createdAt || password.updatedAt) && (
            <div className="border-t border-blue-100 pt-3 mt-4">
              <div className="grid grid-cols-1 gap-2 text-xs text-blue-600">
                {password.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(password.createdAt)}</span>
                  </div>
                )}
                {password.updatedAt && password.updatedAt !== password.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Updated: {formatDate(password.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}