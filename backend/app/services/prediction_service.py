# ==================================
# backend/app/services/prediction_service.py
# (Perbaikan: Indentasi & penamaan)
# ==================================
import joblib
import json
import pandas as pd
import numpy as np
from datetime import timedelta
from prophet.diagnostics import cross_validation, performance_metrics
from tensorflow.keras.models import load_model
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
import os
import yfinance as yf
from tensorflow.keras.metrics import MeanSquaredError
from tensorflow.keras.models import load_model

def get_prophet_prediction(periods=30):
    try:
        model = joblib.load('saved_models/prophet_model.pkl')
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        prediction = forecast[['ds', 'yhat']].tail(periods)
        prediction = prediction.rename(columns={'ds': 'date'})
        prediction['date'] = prediction['date'].dt.strftime('%Y-%m-%d')
        return prediction.to_dict('records')
    except Exception as e:
        print(f"Error di get_prophet_prediction: {e}")
        return []

def get_lstm_prediction(historical_df, periods=30):
    try:
        model = load_model('saved_models/lstm_model.h5', custom_objects={'mse': MeanSquaredError()})
        scaler = joblib.load('saved_models/lstm_scaler.pkl')

        # Ambil data harga saja dari dataframe
        df = historical_df[['Close']].values
        scaled_data = scaler.transform(df)

        last_sequence = scaled_data[-60:].reshape(1, 60, 1)

        predictions = []
        for _ in range(periods):
            predicted_value = model.predict(last_sequence, verbose=0)
            predictions.append(predicted_value[0][0])
            last_sequence = np.append(last_sequence[:, 1:, :], predicted_value.reshape(1, 1, 1), axis=1)

        predicted_prices = scaler.inverse_transform(np.array(predictions).reshape(-1, 1)).flatten()
        
        # --- PERBAIKAN: Ambil tanggal terakhir dari kolom 'Date', bukan dari index ---
        last_date = pd.to_datetime(historical_df['Date'].iloc[-1])
        dates = [last_date + timedelta(days=i) for i in range(1, periods + 1)]

        return [{'date': d.strftime('%Y-%m-%d'), 'price': float(p)} for d, p in zip(dates, predicted_prices)]
    except Exception as e:
        print(f"Error di get_lstm_prediction: {e}")
        return []

# Fungsi untuk mendapatkan metrik model
def get_model_metrics():
    try:
        with open('saved_models/prophet_metrics.json', 'r') as f:
            prophet_metrics = json.load(f)
        with open('saved_models/lstm_metrics.json', 'r') as f:
            lstm_metrics = json.load(f)
        all_metrics = [prophet_metrics, lstm_metrics]

        best_model_info = min(all_metrics, key=lambda x: x.get('rmse', float('inf')))
        best_model_info['name'] = best_model_info.pop('model')
        
        return all_metrics, best_model_info
    except Exception as e:
        print(f"Error saat membaca metrik: {e}")
        return [], {"name": "N/A"}

def get_yearly_predictions():
    """Menghasilkan prediksi harga tahunan dengan penskalaan dan data historis."""
    try:
        # 1. Ambil data historis tahunan dari yfinance
        hist_df = yf.Ticker("ETH-USD").history(period="3y")
        hist_df = hist_df.reset_index()
        hist_df['year'] = hist_df['Date'].dt.year

        # 2. Hitung min, avg, max untuk data historis
        yearly_hist = hist_df.groupby('year').agg(
            min=('Close', 'min'),
            max=('Close', 'max'),
            avg=('Close', 'mean')
        ).reset_index()
        
        current_year = pd.Timestamp.now().year
        # Pastikan data historis yang ditampilkan adalah data lengkap
        yearly_hist = yearly_hist[yearly_hist['year'] < current_year]
        
        # 3. Ambil prediksi model
        model = joblib.load('saved_models/prophet_model.pkl')
        future = model.make_future_dataframe(periods=365 * 5)
        forecast = model.predict(future)
        forecast['year'] = forecast['ds'].dt.year
        
        # Hanya ambil data prediksi dari tahun saat ini dan ke depan
        yearly_preds_df = forecast[forecast['year'] >= current_year].groupby('year').agg(
            min_prophet=('yhat_lower', 'min'),
            max_prophet=('yhat_upper', 'max'),
            avg_prophet=('yhat', 'mean')
        ).reset_index()

        predictions = []
        for index, row in yearly_preds_df.iterrows():
            year = row['year']
            
            # Tentukan faktor penskalaan
            year_offset = year - current_year
            growth_factor = (1.25) ** year_offset # Asumsi pertumbuhan 25% per tahun

            # Terapkan faktor penskalaan hanya pada nilai rata-rata
            avg_scaled = float(row['avg_prophet'] * growth_factor)
            
            # Hitung rentang (min dan max) sebagai persentase dari rata-rata
            # Ini akan menjaga nilai min tetap positif
            min_scaled = avg_scaled * 0.75 # Asumsi min adalah 75% dari rata-rata
            max_scaled = avg_scaled * 1.5  # Asumsi max adalah 150% dari rata-rata
            
            predictions.append({
                "year": int(year),
                "min": min_scaled,
                "avg": avg_scaled,
                "max": max_scaled
            })

        # 4. Gabungkan data historis dan prediksi yang telah disesuaikan
        final_preds = yearly_hist.to_dict('records') + predictions
        
        return final_preds
    except Exception as e:
        print(f"Error di get_yearly_predictions: {e}")
        return []