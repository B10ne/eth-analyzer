import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceChart } from '@/components/charts/PriceChart';
import { TimeframeSelector, Timeframe } from '@/components/dashboard/TimeframeSelector';
import { RiskAnalysisCard } from '@/components/dashboard/RiskAnalysisCard';
import { MetricsTable } from '@/components/dashboard/MetricsTable';
import { 
  historicalData, 
  forecastData, 
  modelMetrics, 
  riskAnalysis, 
  bestModel 
} from '@/data/dummyData';

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('6M');

  // Filter historical data based on timeframe
  const getFilteredData = () => {
    const now = new Date();
    const daysMap: { [key in Timeframe]: number } = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      'ALL': historicalData.length
    };
    
    const daysToShow = daysMap[selectedTimeframe];
    return historicalData.slice(-daysToShow);
  };

  const filteredData = getFilteredData();
  const latestPrice = historicalData[historicalData.length - 1]?.price || 0;
  const previousPrice = historicalData[historicalData.length - 2]?.price || 0;
  const priceChange = latestPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${latestPrice.toLocaleString()}</div>
            <div className={`text-sm ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} 
              ({priceChangePercent.toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              24h Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.4B</div>
            <div className="text-sm text-muted-foreground">+5.2% from yesterday</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$295.8B</div>
            <div className="text-sm text-muted-foreground">Rank #2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{bestModel.name}</div>
            <div className="text-sm text-muted-foreground">Lowest RMSE</div>
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ethereum Price Analysis & Forecast</CardTitle>
          <TimeframeSelector 
            selected={selectedTimeframe}
            onSelect={setSelectedTimeframe}
          />
        </CardHeader>
        <CardContent>
          <PriceChart 
            historicalData={filteredData}
            forecastData={forecastData}
            showForecast={true}
            height={500}
          />
        </CardContent>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Analysis */}
        <RiskAnalysisCard 
          level={riskAnalysis.level}
          factors={riskAnalysis.factors}
        />

        {/* Model Metrics - spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <MetricsTable 
            metrics={modelMetrics}
            bestModel={bestModel.name}
          />
        </div>
      </div>
    </div>
  );
}