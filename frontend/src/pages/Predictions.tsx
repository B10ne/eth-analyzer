import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PriceChart } from '@/components/charts/PriceChart';
import { YearlyPredictionsChart } from '@/components/predictions/YearlyPredictionsChart';
import { TechnicalIndicators } from '@/components/predictions/TechnicalIndicators';
import { 
  currentETH, 
  forecastData, 
  historicalData, 
  yearlyPredictions, 
  technicalIndicators 
} from '@/data/dummyData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Predictions() {
  const isPositiveChange = currentETH.changePercent >= 0;

  return (
    <div className="space-y-6">
      {/* Current Price Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="text-4xl font-bold">${currentETH.price.toLocaleString()}</div>
              <div className={`flex items-center space-x-2 text-lg ${
                isPositiveChange ? 'text-success' : 'text-destructive'
              }`}>
                <span>{isPositiveChange ? '+' : ''}${currentETH.change24h}</span>
                <span>({isPositiveChange ? '+' : ''}{currentETH.changePercent}%)</span>
              </div>
              <div className="text-sm text-muted-foreground">24h Change</div>
            </div>
          </CardContent>
        </Card>

        <TechnicalIndicators 
          indicators={technicalIndicators}
          currentPrice={currentETH.price}
        />
      </div>

      {/* Short-term Predictions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Short-term Price Predictions (30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChart 
            historicalData={historicalData.slice(-30)}
            forecastData={forecastData}
            showForecast={true}
            height={400}
          />
        </CardContent>
      </Card>

      {/* Long-term Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yearly Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Long-term Yearly Predictions (2025-2034)</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyPredictionsChart data={yearlyPredictions} />
          </CardContent>
        </Card>

        {/* Yearly Predictions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Yearly Price Ranges</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Min</TableHead>
                  <TableHead>Avg</TableHead>
                  <TableHead>Max</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlyPredictions.slice(0, 6).map((prediction) => (
                  <TableRow key={prediction.year}>
                    <TableCell className="font-medium">{prediction.year}</TableCell>
                    <TableCell className="text-sm">
                      ${(prediction.min / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell className="text-sm font-medium text-primary">
                      ${(prediction.avg / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell className="text-sm">
                      ${(prediction.max / 1000).toFixed(1)}K
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis & Forecast Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <h4 className="text-foreground font-medium">Technical Analysis</h4>
            <p>
              Ethereum currently trades at ${currentETH.price.toLocaleString()}, showing {isPositiveChange ? 'positive' : 'negative'} momentum 
              with a {Math.abs(currentETH.changePercent)}% change in the last 24 hours. The 50-day SMA at 
              ${technicalIndicators.sma50.toLocaleString()} is {currentETH.price > technicalIndicators.sma50 ? 'below' : 'above'} 
              current price levels, while the 200-day SMA sits at ${technicalIndicators.sma200.toLocaleString()}.
            </p>
            
            <h4 className="text-foreground font-medium mt-4">Model Predictions</h4>
            <p>
              Our LSTM model projects near-term price movements with higher accuracy based on historical patterns, 
              while the Prophet model captures seasonal trends effectively. Both models suggest continued volatility 
              with potential upward momentum in the medium term.
            </p>
            
            <h4 className="text-foreground font-medium mt-4">Long-term Outlook</h4>
            <p>
              Long-term projections indicate significant growth potential, with average prices potentially reaching 
              ${(yearlyPredictions[4].avg / 1000).toFixed(1)}K by 2029. However, investors should consider the high 
              volatility range, with maximum predictions reaching ${(yearlyPredictions[4].max / 1000).toFixed(1)}K 
              in optimistic scenarios.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}