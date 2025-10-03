import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PriceChart } from '../components/charts/PriceChart';
import { RiskAnalysisCard } from '../components/dashboard/RiskAnalysisCard';
import { MetricsTable } from '../components/dashboard/MetricsTable';
import { TechnicalIndicators } from '../components/predictions/TechnicalIndicators';
import { useDashboardData } from '../hooks/useDashboardData';
import { TimeframeSelector, Timeframe } from '../components/dashboard/TimeframeSelector';
import { DataPoint } from '../types/api';

export default function Dashboard() {
  
  useEffect(() => {
    // Mengubah judul halaman browser
    document.title = 'Dashboard | EthAnalyzer';
  }, []);
  
  const { data, loading, error } = useDashboardData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('6M');

  const filteredHistoricalData = useMemo(() => {
    // PERBAIKAN 1: Gunakan optional chaining (?.) untuk akses yang aman.
    // Jika 'data' atau 'historical_data' tidak ada, ia akan berhenti dan mengembalikan array kosong.
    if (!data?.historical_data) return [];
    
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
    
    return data.historical_data.filter((d: any) => new Date(d.date) >= startDate);
  }, [data, selectedTimeframe]);

  const formatNumber = (value: any, options: Intl.NumberFormatOptions = {}) => {
    if (typeof value !== 'number') {
        return "N/A";
    }
    return value.toLocaleString('en-US', options);
}

if (loading) return <div className="p-6 text-center text-white">Loading Dashboard Data...</div>;
if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
if (!data) return <div className="p-6 text-center text-gray-400">No data available from the server.</div>;

// PERBAIKAN: Kalkulasi yang aman menggunakan optional chaining dan nullish coalescing.
// Jika properti tidak ada, ia akan menggunakan 0 sebagai nilai default untuk perbandingan.
const isPositiveChange = (data?.live_price?.change_percent ?? 0) >= 0;

return (
  <div className="flex flex-col space-y-6 p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Price</CardTitle>
        </CardHeader>
        <CardContent>
          {/* PERBAIKAN: Gunakan optional chaining (?.) untuk semua akses data. */}
          <div className="text-2xl font-bold">{formatNumber(data?.live_price?.price, { style: 'currency', currency: 'USD' })}</div>
          <p className={`text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveChange ? `+` : ``}{formatNumber(data?.live_price?.change, { minimumFractionDigits: 2 })} 
            ({formatNumber(data?.live_price?.change_percent, { minimumFractionDigits: 2 })}%)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(data?.live_price?.market_cap, { style: 'currency', currency: 'USD', notation: 'compact' })}</div>
          <p className="text-xs text-muted-foreground">in USD</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(data?.live_price?.volume_24h, { style: 'currency', currency: 'USD', notation: 'compact' })}</div>
          <p className="text-xs text-muted-foreground">in USD</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Model</CardTitle>
        </CardHeader>
        <CardContent>
          {/* PERBAIKAN: Gunakan nullish coalescing (??) untuk nilai default string. */}
          <div className="text-2xl font-bold text-primary">{data?.best_model_info?.name ?? 'N/A'}</div>
          <div className="text-sm text-muted-foreground">Lowest RMSE</div>
        </CardContent>
      </Card>
    </div>

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