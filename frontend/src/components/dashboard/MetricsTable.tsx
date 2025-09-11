import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ModelMetrics } from '@/data/dummyData';

interface MetricsTableProps {
  metrics: ModelMetrics[];
  bestModel: string;
}

export function MetricsTable({ metrics, bestModel }: MetricsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>MAE</TableHead>
              <TableHead>RMSE</TableHead>
              <TableHead>MSE</TableHead>
              <TableHead>MAPE (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.model}>
                <TableCell className="font-medium flex items-center space-x-2">
                  <span>{metric.model}</span>
                  {metric.model === bestModel && (
                    <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                      Best
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{metric.mae.toFixed(2)}</TableCell>
                <TableCell className="font-medium">{metric.rmse.toFixed(2)}</TableCell>
                <TableCell>{metric.mse.toFixed(2)}</TableCell>
                <TableCell>{metric.mape.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 rounded-lg bg-secondary/50 p-3">
          <h4 className="text-sm font-medium mb-1">Model Recommendation</h4>
          <p className="text-sm text-muted-foreground">
            <strong>{bestModel}</strong> shows superior performance with lower RMSE, 
            indicating better prediction accuracy for Ethereum price forecasting.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}