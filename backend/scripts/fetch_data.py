# fetch_data.py

import yfinance as yf
import pandas as pd
import os

def fetch_eth_history(save_path, period="max"):
    """
    Mengambil data historis ETH dan menyimpannya ke jalur yang diberikan.
    """
    eth = yf.Ticker("ETH-USD")
    hist = eth.history(period=period)
    
    df = hist.reset_index()[["Date", "Close"]]
    df.columns = ["ds", "y"]
    
    df.to_csv(save_path, index=False)
    print(f"ETH price data saved to {save_path}")

if __name__ == "__main__":
    parent_dir = os.path.dirname(os.path.dirname(__file__))
    save_path = os.path.join(parent_dir, 'saved_models', 'series_close.csv')
    fetch_eth_history(save_path)