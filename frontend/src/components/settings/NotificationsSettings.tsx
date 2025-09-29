// frontend/src/components/settings/NotificationsSettings.tsx
import { useState } from 'react'; // <-- WAJIB: Import useState
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function NotificationsSettings() {
  // 1. Definisikan state awal
  const [isPriceAlertsOn, setIsPriceAlertsOn] = useState(true);
  const [priceTarget, setPriceTarget] = useState(5000);
  const [isAnalysisAlertsOn, setIsAnalysisAlertsOn] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState('');

  return (
    <Card>
      {/* ... (CardHeader) ... */}
      <CardContent className="space-y-6">
        {/* Price Alerts */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Price Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Notify me when Ethereum reaches a specific price.
            </p>
          </div>
          {/* Hubungkan state dan handler */}
          <Switch 
            id="price-alerts" 
            checked={isPriceAlertsOn}
            onCheckedChange={setIsPriceAlertsOn} // <-- Update state saat switch berubah
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price-target">Price Target ($)</Label>
          {/* Hubungkan state dan handler */}
          <Input 
            id="price-target" 
            type="number" 
            placeholder="e.g., 5000" 
            value={priceTarget}
            onChange={(e) => setPriceTarget(Number(e.target.value))} // <-- Update state saat input berubah
            disabled={!isPriceAlertsOn} // Disable jika Price Alerts mati
          />
        </div>

        {/* Analysis Alerts */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Analysis Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Notify me about significant sentiment changes or technical signals.
            </p>
          </div>
          {/* Hubungkan state dan handler */}
          <Switch 
            id="analysis-alerts" 
            checked={isAnalysisAlertsOn}
            onCheckedChange={setIsAnalysisAlertsOn} // <-- Update state saat switch berubah
          />
        </div>

        {/* Notification Method */}
        <div className="space-y-2">
          <Label>Notification Method</Label>
          <Textarea 
            placeholder="Email, Push Notifications, etc." 
            value={notificationMethod}
            onChange={(e) => setNotificationMethod(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Fitur ini akan dikembangkan di versi mendatang.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}