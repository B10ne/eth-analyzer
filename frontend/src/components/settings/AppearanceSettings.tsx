import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Definisi warna aksen yang tersedia
const accentColors = [
  'blue',
  'green',
  'purple',
  'red',
  'yellow',
];

export function AppearanceSettings() {

  const handleAccentChange = (color: string) => {
    // Implementasi logika untuk mengubah warna aksen
    // Ini mungkin memerlukan modifikasi pada file CSS atau skrip tema Anda
    console.log(`Mengubah aksen warna ke: ${color}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Accent Color */}
        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="flex space-x-2">
            {accentColors.map((color) => (
              <Button
                key={color}
                onClick={() => handleAccentChange(color)}
                className={`w-8 h-8 rounded-full border-2 ${color === 'blue' ? 'border-primary' : 'border-transparent'}`}
                style={{ backgroundColor: `var(--color-${color})` }}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Aksen warna dapat mengubah skema warna grafik dan tombol.
          </p>
        </div>

        {/* Font Size Scale */}
        <div className="space-y-2">
          <Label>Font Size Scale</Label>
          <Select defaultValue="normal">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Mengatur ukuran teks di seluruh dasbor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}