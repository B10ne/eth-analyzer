// frontend/src/types/api.ts

// Tipe untuk level risiko
export type RiskLevel = "Low" | "Medium" | "High";

// Tipe untuk satu titik data di grafik (digunakan untuk data historis & prediksi LSTM)
export interface DataPoint { 
  date: string; 
  price: number; 
}

// --- PERBAIKAN: Definisikan tipe data untuk prediksi Prophet ---
// Backend Anda sekarang mengirimkan data ini dengan properti 'yhat'
export interface ProphetDataPoint {
  date: string;
  yhat: number;
}

// Tipe untuk forecast (prediksi) yang digabungkan untuk grafik
export interface ForecastData {
  date: string;
  lstm: number | null;
  prophet: number | null;
}

// Tipe untuk metrik performa model
export interface ModelMetric {
  model: string;
  rmse: number;
  mae: number;
  mape: number;
}
  
// Tipe untuk Indikator Teknis
export interface TechnicalIndicatorsData {
  rsi: number;
  macd: number;
  sma50: number;
  sma200: number;
  sentiment: 'Buy' | 'Sell' | 'Neutral';
}

// Tipe untuk Prediksi Tahunan
export interface YearlyPrediction {
  year: number;
  min: number;
  avg: number;
  max: number;
}
  
// Tipe untuk keseluruhan data dari endpoint /api/main-dashboard
export interface DashboardData {
  live_price: {
    price: number;
    change: number;
    change_percent: number;
    volume_24h?: string;
    market_cap?: string;
  };
  historical_data: DataPoint[];
  lstm_prediction: DataPoint[];
  // --- PERBAIKAN: Gunakan tipe baru untuk prediksi Prophet ---
  prophet_prediction: ProphetDataPoint[];
  risk_analysis: {
    level: RiskLevel;
    factors: string[];
  };
  technical_indicators: TechnicalIndicatorsData;
  model_metrics: ModelMetric[];
  best_model_info: {
    name: string;
    // --- PERBAIKAN: Tambahkan metrik ke best_model_info ---
    rmse?: number;
    mae?: number;
  };
  yearly_predictions: YearlyPrediction[];
}

/**
 * Tipe data untuk pembaruan chart secara berkala.
 * endpoint: /api/chart-data
 */
export interface ChartUpdateDataPoint {
  time: string;
  price: number;
}