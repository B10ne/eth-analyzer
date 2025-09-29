// frontend/src/components/settings/AccountSettings.tsx
import { useState } from 'react'; // <-- WAJIB: Import useState
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // Tambahkan untuk notifikasi

export function AccountSettings() {
  // 1. Definisikan state awal
  const [username, setUsername] = useState('userethanalyzer');
  const [email, setEmail] = useState('user@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = () => {
    // Implementasi logika update profil di backend
    console.log('Updating profile...', { username, email });
    toast.success("Profile updated successfully!");
  };

  const handleUpdatePassword = () => {
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }
    // Implementasi logika update password di backend
    console.log('Updating password...', { currentPassword, newPassword });
    toast.success("Password updated successfully!");
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Manage your account information and security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Management */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          {/* Hubungkan state dan handler */}
          <Input 
            id="username" 
            placeholder="Your Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled // Email seringkali di-disable setelah verifikasi
          />
        </div>
        <Button onClick={handleUpdateProfile} className="mt-4">Save Profile Changes</Button>
        
        {/* Security */}
        <div className="space-y-2 pt-4 border-t">
          <Label htmlFor="current-password">Current Password</Label>
          <Input 
            id="current-password" 
            type="password" 
            placeholder="Current Password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Label htmlFor="new-password">New Password</Label>
          <Input 
            id="new-password" 
            type="password" 
            placeholder="New Password (min 8 chars)" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleUpdatePassword} variant="outline" className="mt-2">Update Password</Button>
        </div>
        
        {/* Two-Factor Authentication (2FA) */}
        <div className="space-y-2">
          <Label htmlFor="2fa-setup">Two-Factor Authentication (2FA)</Label>
          <p className="text-sm text-muted-foreground">
            Tingkatkan keamanan akun Anda.
          </p>
          <Button variant="outline" className="mt-2">Setup 2FA</Button>
        </div>

        {/* Data Export */}
        <div className="space-y-2">
          <Label>Data Export</Label>
          <p className="text-sm text-muted-foreground">
            Unduh data historis dan prediksi Anda.
          </p>
          <Button>Export Data</Button>
        </div>
      </CardContent>
    </Card>
  );
}