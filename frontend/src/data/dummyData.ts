// Dummy data for Ethereum price analysis and forecasting

export interface PriceData {
  date: string;
  price: number;
  volume?: number;
}

export interface ForecastData {
  date: string;
  lstm: number;
  prophet: number;
}

export interface ModelMetrics {
  model: string;
  mae: number;
  rmse: number;
  mse: number;
  mape: number;
}

export interface TechnicalIndicators {
  sma50: number;
  sma200: number;
  rsi: number;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
}

export interface YearlyPrediction {
  year: number;
  min: number;
  avg: number;
  max: number;
}

// Generate historical Ethereum price data (last 2 years)
export const generateHistoricalData = (): PriceData[] => {
  const data: PriceData[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date();
  
  let currentPrice = 1200; // Starting price
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Simulate price movement with some randomness and trends
    const dayOfYear = d.getTime() - startDate.getTime();
    const trend = Math.sin(dayOfYear / (1000 * 60 * 60 * 24 * 30)) * 200; // Monthly cycles
    const volatility = (Math.random() - 0.5) * 100;
    
    currentPrice = Math.max(500, currentPrice + trend * 0.1 + volatility);
    
    data.push({
      date: d.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.random() * 1000000000
    });
  }
  
  return data;
};

// Generate forecast data for next 30 days
export const generateForecastData = (): ForecastData[] => {
  const data: ForecastData[] = [];
  const startDate = new Date();
  const lastPrice = 2400; // Current ETH price
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // LSTM tends to be more conservative
    const lstmPrice = lastPrice + (Math.random() - 0.4) * 100 * i * 0.5;
    // Prophet captures seasonality better
    const prophetPrice = lastPrice + Math.sin(i / 7) * 50 + (Math.random() - 0.45) * 80 * i * 0.6;
    
    data.push({
      date: date.toISOString().split('T')[0],
      lstm: Math.max(1000, Math.round(lstmPrice * 100) / 100),
      prophet: Math.max(1000, Math.round(prophetPrice * 100) / 100)
    });
  }
  
  return data;
};

export const historicalData = generateHistoricalData();
export const forecastData = generateForecastData();

export const modelMetrics: ModelMetrics[] = [
  {
    model: 'LSTM',
    mae: 89.23,
    rmse: 156.78,
    mse: 24580.14,
    mape: 3.71
  },
  {
    model: 'Prophet',
    mae: 112.45,
    rmse: 198.32,
    mse: 39330.82,
    mape: 4.68
  }
];

export const currentETH = {
  price: 2456.78,
  change24h: 3.45,
  changePercent: 0.14
};

export const technicalIndicators: TechnicalIndicators = {
  sma50: 2398.45,
  sma200: 2234.67,
  rsi: 58.2,
  sentiment: 'Bullish' as const
};

export const yearlyPredictions: YearlyPrediction[] = [
  { year: 2025, min: 2800, avg: 4200, max: 6500 },
  { year: 2026, min: 3200, avg: 5100, max: 8200 },
  { year: 2027, min: 3800, avg: 6200, max: 10500 },
  { year: 2028, min: 4500, avg: 7800, max: 13200 },
  { year: 2029, min: 5200, avg: 9500, max: 16800 },
  { year: 2030, min: 6100, avg: 11800, max: 21500 },
  { year: 2031, min: 7200, avg: 14500, max: 27200 },
  { year: 2032, min: 8500, avg: 17800, max: 34500 },
  { year: 2033, min: 10200, avg: 22100, max: 43800 },
  { year: 2034, min: 12400, avg: 27600, max: 55600 }
];

export const riskAnalysis = {
  level: 'Medium' as 'Low' | 'Medium' | 'High',
  factors: [
    'Market volatility within normal ranges',
    'Technical indicators show mixed signals',
    'Regulatory environment remains uncertain'
  ]
};

export const bestModel = {
  name: 'LSTM',
  reason: 'Lower RMSE (156.78 vs 198.32) indicates better prediction accuracy'
};