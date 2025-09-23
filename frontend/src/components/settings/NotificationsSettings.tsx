import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function NotificationsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage your notification preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Alerts */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Price Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Notify me when Ethereum reaches a specific price.
            </p>
          </div>
          <Switch id="price-alerts" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price-target">Price Target ($)</Label>
          <Input id="price-target" type="number" placeholder="e.g., 5000" />
        </div>

        {/* Analysis Alerts */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Analysis Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Notify me about significant sentiment changes or technical signals.
            </p>
          </div>
          <Switch id="analysis-alerts" />
        </div>

        {/* Notification Method */}
        <div className="space-y-2">
          <Label>Notification Method</Label>
          <Textarea placeholder="Email, Push Notifications, etc." />
          <p className="text-sm text-muted-foreground">
            Fitur ini akan dikembangkan di versi mendatang.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}