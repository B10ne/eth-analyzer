// frontend/src/pages/Predictions.tsx

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PriceChart } from '@/components/charts/PriceChart';
import { YearlyPredictionsChart } from '@/components/predictions/YearlyPredictionsChart';
import { TechnicalIndicators } from '@/components/predictions/TechnicalIndicators';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Disclaimer } from '@/components/common/Disclaimer';

// --- TAMBAHAN: Import TimeframeSelector dan tipe datanya ---
import { TimeframeSelector, Timeframe } from '@/components/dashboard/TimeframeSelector';

export default function Predictions() {
  useEffect(() => {
    // Mengubah judul halaman browser
    document.title = 'Predictions | EthAnalyzer';
  }, []);
  
  const { data, loading, error } = useDashboardData();

  // --- TAMBAHAN: Inisialisasi state untuk timeframe ---
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('6M');

  const forecastData = useMemo(() => {
    if (!data || !data.lstm_prediction || !data.prophet_prediction) return [];

    const combinedMap = new Map();

    // Tambahkan data LSTM ke map
    data.lstm_prediction.forEach(p => {
        combinedMap.set(p.date, { date: p.date, lstm: p.price, prophet: null });
    });

    // Tambahkan data Prophet ke map dan gabungkan dengan LSTM jika tanggalnya sama
    data.prophet_prediction.forEach(p => {
        if (combinedMap.has(p.date)) {
            const entry = combinedMap.get(p.date);
            entry.prophet = p.yhat;
        } else {
            combinedMap.set(p.date, { date: p.date, lstm: null, prophet: p.yhat });
        }
    });

    // Urutkan data berdasarkan tanggal
    return Array.from(combinedMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);
  
  // --- TAMBAHAN: Filter data historis berdasarkan timeframe ---
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


  const hasForecastData = forecastData && forecastData.length > 0;

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error: {error}</div>;

  const { live_price, technical_indicators, yearly_predictions } = data;
  const hasYearlyPredictions = yearly_predictions && yearly_predictions.length > 0;
  const isPositiveChange = live_price.change_percent >= 0;

  return (
    <div className="space-y-6">
      {/* Current Price & Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Live Price */}
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <span>Ethereum (ETH)</span>
              {isPositiveChange ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold">${live_price.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <p className="text-sm text-muted-foreground flex items-center">
                <span className={isPositiveChange ? 'text-success' : 'text-destructive'}>
                  {isPositiveChange ? '+' : ''}{live_price.change_percent.toFixed(2)}%
                </span>
                <span className="ml-1">last 24h</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Card 2: Technical Indicators */}
        <TechnicalIndicators indicators={technical_indicators} currentPrice={live_price.price} />

        {/* Card 3: Model Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>About the Models</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {/* ... (kode yang sudah ada) ... */}
            <h4 className="text-foreground font-medium mt-4">Long-term Outlook</h4>
            <p>
              Long-term projections indicate significant growth potential, with average prices potentially reaching 
              **${(yearly_predictions[yearly_predictions.length - 1].avg / 1000).toFixed(1)}K** by {yearly_predictions[yearly_predictions.length - 1].year}. However, investors should consider the high 
              volatility range, with maximum predictions reaching **${(yearly_predictions[yearly_predictions.length - 1].max / 1000).toFixed(1)}K** in optimistic scenarios.
            </p>
          </CardContent>
        </Card>
      </div>

    {/* Price Chart (dengan forecast) */}
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Ethereum Price & Forecast</CardTitle>
          {/* --- TAMBAHAN: Tampilkan komponen TimeframeSelector --- */}
          <TimeframeSelector 
            selected={selectedTimeframe} 
            onSelect={setSelectedTimeframe} 
          />
        </CardHeader>
        <CardContent>
          <PriceChart
            // --- PERBAIKAN: Gunakan data yang sudah difilter ---
            historicalData={filteredHistoricalData}
            forecastData={forecastData}
            showForecast={true}
            height={400}
          />
        </CardContent>
      </Card>

      {/* Yearly Projections Section */}
      {hasYearlyPredictions && (
        <Card>
          <CardHeader>
            <CardTitle>Yearly Projections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <YearlyPredictionsChart data={yearly_predictions} />
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Minimum</TableHead>
                  <TableHead>Average</TableHead>
                  <TableHead>Maximum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearly_predictions.map((pred) => (
                  <TableRow key={pred.year}>
                    <TableCell className="font-medium">{pred.year}</TableCell>
                    <TableCell>${pred.min.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell className="font-medium">${pred.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell>${pred.max.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* --- TAMBAHAN: Tempatkan komponen Disclaimer di sini --- */}
            <Disclaimer />
          </CardContent>
        </Card>
      )}
    </div>
  );
}