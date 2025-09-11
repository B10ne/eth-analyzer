import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TechnicalIndicators as TechnicalIndicatorsType } from '@/data/dummyData';
import { cn } from '@/lib/utils';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicatorsType;
  currentPrice: number;
}

export function TechnicalIndicators({ indicators, currentPrice }: TechnicalIndicatorsProps) {
  const getSentimentIcon = () => {
    switch (indicators.sentiment) {
      case 'Bullish':
        return <TrendingUp className="h-4 w-4" />;
      case 'Bearish':
        return <TrendingDown className="h-4 w-4" />;
      case 'Neutral':
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentColor = () => {
    switch (indicators.sentiment) {
      case 'Bullish':
        return 'text-success border-success/20 bg-success/10';
      case 'Bearish':
        return 'text-destructive border-destructive/20 bg-destructive/10';
      case 'Neutral':
        return 'text-muted-foreground border-muted/20 bg-muted/10';
    }
  };

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-destructive';
    if (rsi < 30) return 'text-success';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Moving Averages */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Moving Averages</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">50-day SMA</span>
                <span className={cn(
                  'text-sm font-medium',
                  currentPrice > indicators.sma50 ? 'text-success' : 'text-destructive'
                )}>
                  ${indicators.sma50.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">200-day SMA</span>
                <span className={cn(
                  'text-sm font-medium',
                  currentPrice > indicators.sma200 ? 'text-success' : 'text-destructive'
                )}>
                  ${indicators.sma200.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* RSI & Sentiment */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Momentum</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">RSI (14)</span>
                <span className={cn('text-sm font-medium', getRSIColor(indicators.rsi))}>
                  {indicators.rsi}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sentiment</span>
                <Badge 
                  variant="secondary" 
                  className={cn('text-xs flex items-center space-x-1', getSentimentColor())}
                >
                  {getSentimentIcon()}
                  <span>{indicators.sentiment}</span>
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
              <span>{indicators.sentiment}</span>
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