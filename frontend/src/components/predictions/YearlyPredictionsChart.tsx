import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { YearlyPrediction } from '@/data/dummyData';

interface YearlyPredictionsChartProps {
  data: YearlyPrediction[];
  height?: number;
}

export function YearlyPredictionsChart({ data, height = 350 }: YearlyPredictionsChartProps) {
  // Generate colors for bars based on growth
  const getBarColor = (index: number) => {
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--lstm-forecast))', 
      'hsl(var(--prophet-forecast))',
      'hsl(var(--accent))'
    ];
    return colors[index % colors.length];
  };

  const formatTooltip = (value: any, name: string) => {
    const labels: { [key: string]: string } = {
      min: 'Minimum Price',
      avg: 'Average Price', 
      max: 'Maximum Price'
    };
    
    return [`$${value.toLocaleString()}`, labels[name] || name];
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="year" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000)}K`}
        />
        <Tooltip 
          formatter={formatTooltip}
          labelFormatter={(label) => `Year ${label}`}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))'
          }}
        />
        
        <Bar dataKey="min" name="Minimum" fill="hsl(var(--muted))" opacity={0.7} />
        <Bar dataKey="avg" name="Average" fill="hsl(var(--primary))" />
        <Bar dataKey="max" name="Maximum" fill="hsl(var(--accent))" opacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}