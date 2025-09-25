import React, { useState } from 'react';
import { userAPI } from '../api';
import { Button } from '../frontpart/button';
import { Input } from '../frontpart/input';
import { Label } from '../frontpart/label';
import { Card, CardContent, CardHeader, CardTitle } from '../frontpart/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../frontpart/tabs';
import { ArrowLeft, Mail, Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function LoginScreen({ onLogin, onOTPLogin, onBack, loading }) {
  const [emailData, setEmailData] = useState({ email: '', password: '', useOtp: false });
  const [phoneData, setPhoneData] = useState({ phone: '', password: '' });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (emailData.useOtp && !emailOtpSent) {
      // Request OTP
      try {
        setOtpLoading(true);
        await userAPI.requestOTP(emailData.email);
        setEmailOtpSent(true);
        toast.success('OTP sent to your email!');
      } catch (error) {
        toast.error(error.message || 'Failed to send OTP');
      } finally {
        setOtpLoading(false);
      }
      return;
    }

    if (emailData.useOtp && emailOtpSent) {
      // Verify OTP
      if (!emailOtp.trim()) {
        toast.error('Please enter the OTP');
        return;
      }
      await onOTPLogin(emailData.email, emailOtp);
    } else {
      // Regular password login
      if (!emailData.password.trim()) {
        toast.error('Please enter your password');
        return;
      }
      await onLogin({
        email: emailData.email,
        password: emailData.password
      });
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    
    if (!phoneData.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    await onLogin({
      mobile_number: phoneData.phone,
      password: phoneData.password
    });
  };

  const handleSendEmailOtp = async () => {
    if (!emailData.email.trim()) {
      toast.error('Please enter your email first');
      return;
    }
    
    try {
      setOtpLoading(true);
      await userAPI.requestOTP(emailData.email);
      setEmailData(prev => ({ ...prev, useOtp: true }));
      setEmailOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2" disabled={loading}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-blue-900">Welcome Back</h1>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-blue-900">Sign In</CardTitle>
            <p className="text-blue-600">Access your secure vault</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-100">
                <TabsTrigger 
                  value="email" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-900"
                >
                  Email
                </TabsTrigger>
                <TabsTrigger 
                  value="phone"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-900"
                >
                  Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-blue-800">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailData.email}
                      onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                      disabled={loading || otpLoading}
                    />
                  </div>

                  {!emailData.useOtp ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email-password" className="flex items-center gap-2 text-blue-800">
                          <Lock className="w-4 h-4" />
                          Password
                        </Label>
                        <Input
                          id="email-password"
                          type="password"
                          value={emailData.password}
                          onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                          placeholder="Enter your password"
                          disabled={loading || otpLoading}
                        />
                      </div>

                      <div className="space-y-3">
                        <Button
                          type="submit"
                          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={loading || otpLoading}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Signing In...
                            </>
                          ) : (
                            'Login with Password'
                          )}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendEmailOtp}
                          className="w-full h-14 border-green-600 text-green-600 hover:bg-green-50"
                          disabled={loading || otpLoading}
                        >
                          {otpLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                              Sending OTP...
                            </>
                          ) : (
                            'Login with OTP'
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {emailOtpSent && (
                        <div className="space-y-2">
                          <Label htmlFor="email-otp" className="flex items-center gap-2 text-blue-800">
                            <Lock className="w-4 h-4" />
                            Enter OTP
                          </Label>
                          <Input
                            id="email-otp"
                            type="text"
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value)}
                            className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            required
                            disabled={loading}
                          />
                          <p className="text-sm text-blue-600">
                            OTP sent to {emailData.email}
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Button
                          type="submit"
                          className="w-full h-14 bg-green-600 hover:bg-green-700 text-white"
                          disabled={loading || !emailOtp.trim()}
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Verifying...
                            </>
                          ) : (
                            'Verify OTP'
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendEmailOtp}
                          className="w-full h-12 border-blue-600 text-blue-600 hover:bg-blue-50"
                          disabled={loading || otpLoading}
                        >
                          {otpLoading ? 'Sending...' : 'Resend OTP'}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-blue-800">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneData.phone}
                      onChange={(e) => setPhoneData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                      placeholder="Enter your phone number"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-password" className="flex items-center gap-2 text-blue-800">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="phone-password"
                      type="password"
                      value={phoneData.password}
                      onChange={(e) => setPhoneData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </>
                    ) : (
                      'Login with Phone'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}