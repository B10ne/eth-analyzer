import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceChart } from '@/components/charts/PriceChart';
import { RiskAnalysisCard } from '@/components/dashboard/RiskAnalysisCard';
import { MetricsTable } from '@/components/dashboard/MetricsTable';
import { TechnicalIndicators } from '@/components/predictions/TechnicalIndicators';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TimeframeSelector, Timeframe } from '@/components/dashboard/TimeframeSelector';
import { DataPoint } from '@/types/api';

export default function Dashboard() {
  
  useEffect(() => {
    // Mengubah judul halaman browser
    document.title = 'Analytics | EthAnalyzer';
  }, []);
  
  const { data, loading, error } = useDashboardData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('6M');

  const filteredHistoricalData = useMemo(() => {
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

  // Tampilkan pesan saat loading atau error
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!data) return null;

  const { live_price, historical_data, risk_analysis, model_metrics, best_model_info, technical_indicators } = data;
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
            <div className="text-2xl font-bold">{live_price.market_cap || "N/A"}</div>
            <p className="text-xs text-muted-foreground">in USD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{live_price.volume_24h || "N/A"}</div>
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

          {/* Bottom Grid yang Dirapikan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Risk Analysis & Technical Indicators */}
        <div className="space-y-6">
          <RiskAnalysisCard
            level={risk_analysis.level}
            factors={risk_analysis.factors}
          />
          <TechnicalIndicators
            indicators={technical_indicators}
            currentPrice={live_price.price}
          />
        </div>

        {/* Kolom Kanan: Metrics Table */}
        <div>
          <MetricsTable
            metrics={model_metrics}
            bestModel={best_model_info.name}
          />
        </div>
      </div>
    </div>
  );
}