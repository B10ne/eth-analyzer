import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechnicalIndicatorsData } from '@/types/api';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicatorsData;
  currentPrice: number;
}

export function TechnicalIndicators({ indicators, currentPrice }: TechnicalIndicatorsProps) {
  const getSMAColor = (sma: number) => {
    if (currentPrice > sma) {
      return 'text-success border-success/20 bg-success/10';
    } else {
      return 'text-destructive border-destructive/20 bg-destructive/10';
    }
  };

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) {
      return 'text-destructive border-destructive/20 bg-destructive/10';
    } else if (rsi < 30) {
      return 'text-success border-success/20 bg-success/10';
    } else {
      return 'text-warning border-warning/20 bg-warning/10';
    }
  };

  const getSentimentIcon = () => {
    const sentiment = indicators.sentiment === 'Buy' ? 'Bullish' : indicators.sentiment === 'Sell' ? 'Bearish' : 'Neutral';

    switch (sentiment) {
      case 'Bullish':
        return <TrendingUp className="h-4 w-4" />;
      case 'Bearish':
        return <TrendingDown className="h-4 w-4" />;
      case 'Neutral':
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentColor = () => {
    const sentiment = indicators.sentiment === 'Buy' ? 'Bullish' : indicators.sentiment === 'Sell' ? 'Bearish' : 'Neutral';
    switch (sentiment) {
      case 'Bullish':
        return 'bg-success/10 text-success border-success/20';
      case 'Bearish':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Neutral':
      default:
        return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Moving Averages */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Moving Averages</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">SMA 50</span>
                <span className={cn('text-sm font-medium', getSMAColor(indicators.sma50))}>
                  ${indicators.sma50.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">SMA 200</span>
                <span className={cn('text-sm font-medium', getSMAColor(indicators.sma200))}>
                  ${indicators.sma200.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Oscillators */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Oscillators</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">RSI (14)</span>
                <span className={cn('text-sm font-medium', getRSIColor(indicators.rsi))}>
                  {indicators.rsi.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sentiment</span>
                <Badge
                  variant="secondary"
                  className={cn('text-xs flex items-center space-x-1', getSentimentColor())}
                >
                  {getSentimentIcon()}
                  <span>{indicators.sentiment === 'Buy' ? 'Bullish' : indicators.sentiment === 'Sell' ? 'Bearish' : 'Neutral'}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Signal</span>
            <Badge
              variant="secondary"
              className={cn('flex items-center space-x-1', getSentimentColor())}
            >
              {getSentimentIcon()}
              <span>{indicators.sentiment === 'Buy' ? 'Bullish' : indicators.sentiment === 'Sell' ? 'Bearish' : 'Neutral'}</span>
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on moving averages, RSI, and market sentiment analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
}