// frontend/src/components/settings/AppearanceSettings.tsx
import { useState } from 'react'; // <-- WAJIB: Import useState
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Definisi warna aksen yang tersedia
const accentColors = ['blue', 'green', 'purple', 'red', 'yellow'];

export function AppearanceSettings() {
  // 1. Definisikan state awal
  const [selectedAccent, setSelectedAccent] = useState('blue');
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [selectedFont, setSelectedFont] = useState('normal');

  const handleAccentChange = (color: string) => {
    setSelectedAccent(color); // <-- Set state warna saat diklik
    // Di sini Anda akan mengimplementasikan modifikasi class/CSS theme
    console.log(`Mengubah aksen warna ke: ${color}`);
  };

  return (
    <Card>
      {/* ... (CardHeader) ... */}
      <CardContent className="space-y-6">
        {/* Accent Color */}
        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="flex space-x-2">
            {accentColors.map((color) => (
              <Button
                key={color}
                onClick={() => handleAccentChange(color)}
                // UBAH: Gunakan selectedAccent untuk indikator aktif
                className={`w-8 h-8 rounded-full border-2 ${selectedAccent === color ? 'border-primary' : 'border-transparent'}`}
                style={{ backgroundColor: `var(--color-${color})` }}
              />
            ))}
          </div>
          {/* ... (Deskripsi) ... */}
        </div>

        {/* Mode */}
        <div className="space-y-2">
          <Label>Mode</Label>
          {/* Hubungkan state dan handler */}
          <RadioGroup 
            value={selectedTheme} // <-- Gunakan state sebagai value
            onValueChange={setSelectedTheme} // <-- Update state saat nilai radio berubah
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Font Size Scale */}
        <div className="space-y-2">
          <Label>Font Size Scale</Label>
          {/* Hubungkan state dan handler */}
          <Select 
            value={selectedFont} // <-- Gunakan state sebagai value
            onValueChange={setSelectedFont} // <-- Update state saat select berubah
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
          {/* ... (Deskripsi) ... */}
        </div>
      </CardContent>
    </Card>
  );
}