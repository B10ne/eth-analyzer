import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PriceChart } from '../components/charts/PriceChart';
import { useDashboardData } from '../hooks/useDashboardData';
import { TimeframeSelector, Timeframe } from '../components/dashboard/TimeframeSelector';

export default function Dashboard() {
  
  useEffect(() => {
    // Mengubah judul halaman browser saat komponen dimuat
    document.title = 'Dashboard | EthAnalyzer';
  }, []);
  
  // Mengambil data menggunakan custom hook
  const { data, loading, error } = useDashboardData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('6M');

  const filteredHistoricalData = useMemo(() => {
    // Jika data belum ada, kembalikan array kosong
    if (!data) return [];
    
    const now = new Date();
    let startDate = new Date();

    switch (selectedTimeframe) {
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
        return data.historical_data;
    }
    
    return data.historical_data.filter(d => new Date(d.date) >= startDate);
  }, [data, selectedTimeframe]);

  // ==================================================================
  // KUNCI PERBAIKAN: Menangani state sebelum data siap untuk ditampilkan
  // ==================================================================
  
  // 1. Tampilkan pesan saat data sedang dimuat
  if (loading) return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;
  
  // 2. Tampilkan pesan jika terjadi error saat fetch data
  if (error) return <div className="p-6 text-red-500">Error fetching data: {error}</div>;
  
  // 3. Jangan render apapun jika data tidak ada (pengaman terakhir)
  if (!data) return null;

  // Destructuring data dilakukan SETELAH pengecekan di atas, jadi dijamin aman
  const { live_price, best_model_info } = data;
  const isPositiveChange = live_price.change_percent >= 0;

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${live_price.price.toLocaleString()}</div>
            <p className={`text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveChange ? `+` : ``}{live_price.change.toFixed(2)} ({live_price.change_percent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Menggunakan fallback "N/A" jika data tidak ada */}
            <div className="text-2xl font-bold">{live_price.market_cap ? live_price.market_cap.toLocaleString() : "N/A"}</div>
            <p className="text-xs text-muted-foreground">in USD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{live_price.volume_24h ? live_price.volume_24h.toLocaleString() : "N/A"}</div>
            <p className="text-xs text-muted-foreground">in USD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{best_model_info.name}</div>
            <div className="text-sm text-muted-foreground">Lowest RMSE</div>
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Ethereum Price Analysis</CardTitle>
          <TimeframeSelector 
            selected={selectedTimeframe} 
            onSelect={setSelectedTimeframe} 
          />
        </CardHeader>
        <CardContent>
          <PriceChart 
            historicalData={filteredHistoricalData}
            height={500}
          />
        </CardContent>
      </Card>
    </div>
  );
}