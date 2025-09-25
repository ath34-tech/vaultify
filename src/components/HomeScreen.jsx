import React, { useState } from 'react';
import { Button } from '../frontpart/button';
import { Input } from '../frontpart/input';
import { Card, CardContent } from '../frontpart/card';
import { Avatar, AvatarImage, AvatarFallback } from '../frontpart/avatar';
import { Plus, Search } from 'lucide-react';
import { PasswordCard } from './PasswordCard';

export function HomeScreen({ 
  user, 
  passwords, 
  onAddPassword, 
  onViewPassword,
  onEditPassword, 
  onDeletePassword, 
  onProfile 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPasswords = passwords.filter(password =>
    password.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    password.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    password.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-blue-900">Welcome, {user.name}</h2>
            <p className="text-blue-600 text-sm">Your secure password vault</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfile}
            className="w-10 h-10 rounded-full"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white border-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Add New Password Button */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardContent className="p-4">
            <Button
              onClick={onAddPassword}
              className="w-full h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3"
            >
              <Plus className="w-6 h-6" />
              Add New Password
            </Button>
          </CardContent>
        </Card>

        {/* Password List */}
        <div className="space-y-4">
          {filteredPasswords.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <div className="text-blue-400 mb-2">🔒</div>
                <p className="text-blue-600">
                  {searchQuery ? 'No passwords found matching your search.' : 'No passwords saved yet.'}
                </p>
                {!searchQuery && (
                  <p className="text-blue-500 text-sm mt-2">
                    Tap "Add New Password" to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPasswords.map((password) => (
              <PasswordCard
                key={password.id}
                password={password}
                onView={() => onViewPassword(password)}
                onEdit={() => onEditPassword(password)}
                onDelete={() => onDeletePassword(password.id)}
              />
            ))
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}