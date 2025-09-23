// frontend/src/components/charts/PriceChart.tsx

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { DataPoint, ForecastData } from '@/types/api';

interface PriceChartProps {
  historicalData: DataPoint[];
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
  const combinedData: any[] = useMemo(() => {
    // 1. Buat peta data historis untuk akses cepat
    const dataMap = new Map<string, any>();

    // 2. Isi peta dengan data historis
    historicalData.forEach(d => {
      dataMap.set(d.date, {
        date: d.date,
        price: d.price,
        lstm_forecast: null, // Nilai awal null agar garis prediksi tidak menyambung ke historis
        prophet_forecast: null // Nilai awal null
      });
    });

    // 3. Gabungkan data prediksi jika showForecast bernilai true
    if (showForecast) {
      forecastData.forEach(d => {
        const entry = dataMap.get(d.date);
        if (entry) {
          // Jika tanggal prediksi juga ada di data historis (titik sambung),
          // tambahkan nilai prediksi ke entri yang sudah ada.
          entry.lstm_forecast = d.lstm;
          entry.prophet_forecast = d.prophet;
        } else {
          // Jika tanggal hanya ada di prediksi, tambahkan sebagai entri baru.
          dataMap.set(d.date, {
            date: d.date,
            price: null, // Set historis ke null
            lstm_forecast: d.lstm,
            prophet_forecast: d.prophet
          });
        }
      });
    }

    // 4. Konversi peta menjadi array dan urutkan berdasarkan tanggal
    return Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [historicalData, forecastData, showForecast]);

  const yAxisDomain = [
    Math.min(...combinedData.map(d => Math.min(d.price ?? Infinity, d.lstm_forecast ?? Infinity, d.prophet_forecast ?? Infinity))),
    Math.max(...combinedData.map(d => Math.max(d.price ?? -Infinity, d.lstm_forecast ?? -Infinity, d.prophet_forecast ?? -Infinity)))
  ];

  const yDomainPadding = (yAxisDomain[1] - yAxisDomain[0]) * 0.1;

  const finalYAxisDomain = [
    yAxisDomain[0] - yDomainPadding,
    yAxisDomain[1] + yDomainPadding
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={combinedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => format(new Date(tick), 'MMM dd')}
        />
        <YAxis
          domain={finalYAxisDomain}
          tickFormatter={(tick) => tick.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        />
        <Tooltip
          labelFormatter={(label) => format(new Date(label), 'PPP')}
          formatter={(value: number, name: string) => [`${value.toFixed(2)}`, name]}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            color: '#333333'
          }}
        />
        <Legend />
        {/* Garis historis */}
        <Line
          type="monotone"
          dataKey="price" // Tetap menggunakan dataKey 'price'
          stroke="#007bff"
          strokeWidth={2}
          dot={{ fill: '#007bff', r: 1.5 }}
          activeDot={{ r: 4, stroke: '#007bff', strokeWidth: 2 }}
          name="Harga Aktual"
          connectNulls={false}
        />
        {showForecast && (
          <>
            {/* Garis prediksi LSTM dengan dataKey baru */}
            <Line
              type="monotone"
              dataKey="lstm_forecast" // Gunakan dataKey baru yang berbeda
              stroke="#ff8800"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, stroke: '#ff8800', strokeWidth: 2 }}
              name="LSTM Forecast"
              connectNulls={false}
            />
            {/* Garis prediksi Prophet dengan dataKey baru */}
            <Line
              type="monotone"
              dataKey="prophet_forecast" // Gunakan dataKey baru yang berbeda
              stroke="#00c853"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, stroke: '#00c853', strokeWidth: 2 }}
              name="Prophet Forecast"
              connectNulls={false}
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}