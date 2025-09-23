# train_lstm.py

import numpy as np
import tensorflow as tf
import json
import joblib
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
import os
import pandas as pd # Tambahkan impor pandas
from datetime import timedelta

def run():
    # Load data
    X_train = np.load("saved_models/X_train.npy")
    y_train = np.load("saved_models/y_train.npy")
    X_test = np.load("saved_models/X_test.npy")
    y_test = np.load("saved_models/y_test.npy")

    # Model LSTM
    model = tf.keras.Sequential([
        # Lapisan LSTM pertama (return_sequences=True)
        tf.keras.layers.LSTM(128, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
        tf.keras.layers.Dropout(0.2), # Lapisan Dropout untuk mencegah overfitting
        
        # Lapisan LSTM kedua (tidak perlu return_sequences=True)
        tf.keras.layers.LSTM(64),
        
        # Lapisan Dense (output)
        tf.keras.layers.Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    
    print("Training LSTM model...")
    # --- PERUBAHAN: Meningkatkan epochs dari 20 menjadi 100 ---
    model.fit(X_train, y_train, epochs=100, batch_size=32)
    
    # Simpan model
    model.save("saved_models/lstm_model.h5")
    
    # Prediksi untuk 5 tahun ke depan (1826 hari)
    # --- PERUBAHAN: Gunakan iterative prediction untuk prediksi jangka panjang ---
    
    # Load scaler dan data historis terakhir
    scaler = joblib.load("saved_models/lstm_scaler.pkl")
    df_full = pd.read_csv('saved_models/series_close.csv')
    last_window_scaled = np.array(df_full['y'].values[-60:]).reshape(-1, 1)
    last_window_scaled = scaler.transform(last_window_scaled).reshape(1, 60, 1)

    future_predictions_scaled = []
    current_input = last_window_scaled
    
    for _ in range(1826): # Prediksi 1826 hari (5 tahun)
        next_pred_scaled = model.predict(current_input)[0]
        future_predictions_scaled.append(next_pred_scaled)
        
        # Perbarui input dengan memindahkan window ke depan
        new_input_scaled = np.append(current_input[:, 1:, :], [[next_pred_scaled]], axis=1)
        current_input = new_input_scaled
        
    y_pred_unscaled = scaler.inverse_transform(np.array(future_predictions_scaled).reshape(-1, 1))
    
    # Prediksi pada test set untuk metrik
    y_pred_test_scaled = model.predict(X_test)
    y_test_unscaled = scaler.inverse_transform(y_test)
    y_pred_test_unscaled = scaler.inverse_transform(y_pred_test_scaled)

    # Kalkulasi metrik
    rmse = np.sqrt(mean_squared_error(y_test_unscaled, y_pred_test_unscaled))
    mae = mean_absolute_error(y_test_unscaled, y_pred_test_unscaled)
    mape = np.mean(np.abs((y_test_unscaled - y_pred_test_unscaled) / y_test_unscaled)) * 100

    metrics = {
        "model": "LSTM",
        "rmse": rmse,
        "mae": mae,
        "mape": mape
    }
    
    metrics_path = "saved_models/lstm_metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=4)
    print(f"LSTM metrics saved to {metrics_path}")

# Tambahan: Pastikan untuk mengimpor pandas dan timedelta di awal file.