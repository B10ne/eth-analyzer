import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <Card className="border-warning/20 bg-warning/10 text-warning">
      <CardContent className="p-4 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-semibold mb-1">Important Disclaimer</h4>
          <p>
          The price projections shown here are generated using Machine Learning models (LSTM & Prophet) based on historical data.
            These models do not take into account external factors that may affect the market, such as regulatory changes, market sentiment, or global economic events.
            These predictions should be considered **analytical tools and not guarantees of investment results**. Always conduct your own research before making investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}