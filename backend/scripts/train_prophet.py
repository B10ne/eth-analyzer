# train_prophet.py

import pandas as pd
import numpy as np
from prophet import Prophet
import joblib
import json
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from prophet.diagnostics import cross_validation, performance_metrics
import os

# Fungsi tambahan untuk prediksi tahunan
def generate_yearly_predictions(model, num_years=5):
    """
    Menghasilkan prediksi tahunan berdasarkan model Prophet.
    """
    try:
        future = model.make_future_dataframe(periods=365 * num_years, freq='D')
        forecast = model.predict(future)
        
        # Saring data prediksi hanya untuk masa depan
        future_forecast = forecast[forecast['ds'] > pd.to_datetime('today').normalize()]
        
        # Tambahkan kolom tahun
        future_forecast['year'] = future_forecast['ds'].dt.year

        # Kelompokkan berdasarkan tahun untuk mendapatkan rentang min, avg, dan max
        yearly_preds_df = future_forecast.groupby('year').agg(
            min_prophet=('yhat_lower', 'min'),
            max_prophet=('yhat_upper', 'max'),
            avg_prophet=('yhat', 'mean')
        ).reset_index()

        predictions = []
        for index, row in yearly_preds_df.iterrows():
            predictions.append({
                "year": int(row['year']),
                "min": float(row['min_prophet']),
                "avg": float(row['avg_prophet']),
                "max": float(row['max_prophet'])
            })
        
        return predictions

    except Exception as e:
        print(f"Error saat membuat prediksi tahunan: {e}")
        return []

def run(csv_path):
    """
    Melatih model Prophet dan menyimpan model, metrik, serta prediksi tahunan.
    """
    try:
        df = pd.read_csv(csv_path)
        df.columns = ['ds', 'y']
        df['ds'] = pd.to_datetime(df['ds']).dt.tz_localize(None)

        # Inisialisasi model Prophet dengan parameter yang disesuaikan
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.1,
            seasonality_mode='multiplicative'
        )
        model.fit(df)
        
        model_path = "saved_models/prophet_model.pkl"
        joblib.dump(model, model_path)
        print(f"Prophet model saved to {model_path}")

        # --- LANGKAH BARU: GENERATE PREDIKSI TAHUNAN ---
        yearly_predictions = generate_yearly_predictions(model, num_years=5)

        # Simpan prediksi tahunan ke file JSON
        predictions_path = "saved_models/yearly_predictions.json"
        with open(predictions_path, "w") as f:
            json.dump(yearly_predictions, f, indent=4)
        print(f"Yearly predictions saved to {predictions_path}")
        
        # --- PERBAIKAN: Evaluasi dengan cross-validation untuk metrik yang lebih andal ---
        # Jalankan cross-validation pada data historis
        df_cv = cross_validation(model=model, initial='365 days', period='90 days', horizon='180 days')
        df_p = performance_metrics(df_cv, rolling_window=1)
        
        rmse = df_p['rmse'].mean()
        mae = df_p['mae'].mean()
        mape = df_p['mape'].mean() * 100

        metrics = {
            "model": "Prophet",
            "rmse": rmse,
            "mae": mae,
            "mape": mape
        }
        
        metrics_path = "saved_models/prophet_metrics.json"
        with open(metrics_path, "w") as f:
            json.dump(metrics, f, indent=4)
        print(f"Prophet metrics saved to {metrics_path}")

    except Exception as e:
        print(f"Error in train_prophet: {e}")