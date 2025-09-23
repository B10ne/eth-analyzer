# preprocess_data.py

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

def run(csv_path):
    """
    Memproses data untuk model LSTM.
    """
    try:
        df = pd.read_csv(csv_path)
        
        df.columns = ['ds', 'y'] 
        prices = df["y"].values.reshape(-1, 1)

        scaler = MinMaxScaler()
        prices_scaled = scaler.fit_transform(prices)
        
        scaler_path = "saved_models/lstm_scaler.pkl"
        joblib.dump(scaler, scaler_path)
        print(f"Scaler saved to {scaler_path}")

        def create_dataset(data, window=60):
            X, y = [], []
            for i in range(len(data)-window):
                X.append(data[i:i+window])
                y.append(data[i+window])
            return np.array(X), np.array(y)
        
        X, y = create_dataset(prices_scaled)
        
        if len(X) == 0:
            print("Tidak cukup data untuk membuat dataset LSTM. Perlu lebih dari 60 hari.")
            return

        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]
        
        np.save("saved_models/X_train.npy", X_train)
        np.save("saved_models/X_test.npy", X_test)
        np.save("saved_models/y_train.npy", y_train)
        np.save("saved_models/y_test.npy", y_test)
        
        print("Preprocessing done.")

    except Exception as e:
        print(f"Error di preprocess_data.py: {e}")

if __name__ == "__main__":
    csv_path_main = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'saved_models', 'series_close.csv')
    run(csv_path_main)