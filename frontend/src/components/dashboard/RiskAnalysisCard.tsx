import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskAnalysisCardProps {
  level: 'Low' | 'Medium' | 'High';
  factors: string[];
}

export function RiskAnalysisCard({ level, factors }: RiskAnalysisCardProps) {
  const getRiskIcon = () => {
    switch (level) {
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'Medium':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'High':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getRiskColor = () => {
    switch (level) {
      case 'Low':
        return 'text-success border-success/20 bg-success/10';
      case 'Medium':
        return 'text-warning border-warning/20 bg-warning/10';
      case 'High':
        return 'text-destructive border-destructive/20 bg-destructive/10';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          {getRiskIcon()}
          <span>Risk Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Badge 
            variant="secondary" 
            className={cn('text-sm font-medium', getRiskColor())}
          >
            {level} Risk
          </Badge>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Key Factors:</h4>
            <ul className="space-y-1">
              {factors.map((factor, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}