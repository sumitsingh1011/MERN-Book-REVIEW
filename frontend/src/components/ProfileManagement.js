import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateProfile, deleteAccount } from '../features/users/usersSlice';

const ProfileManagement = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5000000) { // 5MB limit
      setAvatar(file);
    } else {
      setError('Image size should be less than 5MB');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) formDataToSend.append(key, formData[key]);
    });
    if (avatar) formDataToSend.append('avatar', avatar);
    
    try {
      await dispatch(updateProfile(formDataToSend)).unwrap();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await dispatch(deleteAccount()).unwrap();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('avatar-upload').click()}
                >
                  Change Avatar
                </Button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input
                  name="currentPassword"
                  type="password"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input
                  name="newPassword"
                  type="password"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={status === 'loading'}
              >
                Delete Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;