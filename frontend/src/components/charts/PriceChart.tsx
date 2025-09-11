import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { PriceData, ForecastData } from '@/data/dummyData';
import { format } from 'date-fns';

interface PriceChartProps {
  historicalData: PriceData[];
  forecastData?: ForecastData[];
  showForecast?: boolean;
  height?: number;
}

export function PriceChart({ 
  historicalData, 
  forecastData = [], 
  showForecast = false,
  height = 400 
}: PriceChartProps) {
  // Combine historical and forecast data for display
  const combinedData = [
    ...historicalData.slice(-90).map(d => ({
      date: d.date,
      price: d.price,
      lstm: null,
      prophet: null,
      type: 'historical'
    })),
    ...(showForecast ? forecastData.map(d => ({
      date: d.date,
      price: null,
      lstm: d.lstm,
      prophet: d.prophet,
      type: 'forecast'
    })) : [])
  ];

  const formatTooltip = (value: any, name: string) => {
    if (value === null || value === undefined) return [null, null];
    
    const labels: { [key: string]: string } = {
      price: 'Historical Price',
      lstm: 'LSTM Forecast',
      prophet: 'Prophet Forecast'
    };
    
    return [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, labels[name] || name];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">
            {format(new Date(label), 'MMM dd, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => {
            if (entry.value !== null && entry.value !== undefined) {
              return (
                <p key={index} className="text-sm" style={{ color: entry.color }}>
                  {entry.name}: ${Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM dd');
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={combinedData} 
        margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        syncId="priceChart"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        <Line
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', r: 1.5 }}
          activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          name="Historical Price"
          connectNulls={false}
        />
        
        {showForecast && (
          <>
            <Line
              type="monotone"
              dataKey="lstm"
              stroke="hsl(var(--lstm-forecast))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--lstm-forecast))', r: 1.5 }}
              activeDot={{ r: 4, stroke: 'hsl(var(--lstm-forecast))', strokeWidth: 2 }}
              name="LSTM Forecast"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="prophet"
              stroke="hsl(var(--prophet-forecast))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--prophet-forecast))', r: 1.5 }}
              activeDot={{ r: 4, stroke: 'hsl(var(--prophet-forecast))', strokeWidth: 2 }}
              name="Prophet Forecast"
              connectNulls={false}
            />
          </>
        )}

        <Brush 
          dataKey="date" 
          height={30}
          stroke="hsl(var(--primary))"
          fill="hsl(var(--muted))"
          tickFormatter={formatDate}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}