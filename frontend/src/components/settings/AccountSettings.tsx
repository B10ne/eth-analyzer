import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function AccountSettings() {
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
          <Input id="username" placeholder="Your Username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>

        {/* Security */}
        <div className="space-y-2">
          <Label htmlFor="password">Change Password</Label>
          <Input id="password" type="password" placeholder="New Password" />
          <Button variant="outline" className="mt-2">Update Password</Button>
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