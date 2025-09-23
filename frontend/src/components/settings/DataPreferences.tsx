import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DataPreferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Preferences</CardTitle>
        <CardDescription>
          Customize how data is displayed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency */}
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select defaultValue="USD">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="IDR">IDR</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Refresh Interval */}
        <div className="space-y-2">
          <Label>Data Refresh Interval</Label>
          <Select defaultValue="5min">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select refresh interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1min">1 Minute</SelectItem>
              <SelectItem value="5min">5 Minutes</SelectItem>
              <SelectItem value="15min">15 Minutes</SelectItem>
              <SelectItem value="30min">30 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Default Chart View */}
        <div className="space-y-2">
          <Label>Default Chart View</Label>
          <Select defaultValue="6M">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select default view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="ALL">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}