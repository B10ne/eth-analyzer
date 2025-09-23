# run_pipeline.py

import os
import fetch_data
import preprocess_data
import train_prophet
import train_lstm

# Skrip ini akan membuat folder yang dibutuhkan
if not os.path.exists('saved_models'):
    os.makedirs('saved_models')

print("--- MEMULAI PIPELINE TRAINING ---")

# Tentukan jalur penyimpanan file di dalam saved_models/
csv_path = 'saved_models/series_close.csv'

# Menjalankan setiap langkah pipeline secara berurutan
fetch_data.fetch_eth_history(save_path=csv_path)
preprocess_data.run(csv_path)
train_prophet.run(csv_path)
train_lstm.run()

print("--- PIPELINE TRAINING SELESAI ---")