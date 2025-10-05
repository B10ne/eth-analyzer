import pandas as pd
import numpy as np
import requests
from datetime import datetime

def get_main_dashboard_data():
    """
    PERBAIKAN FINAL: Mengambil SEMUA data (live dan historis) dari CoinGecko 
    untuk memastikan keandalan di server VPS.
    """
    try:
        # Panggil API CoinGecko untuk data historis (misal, 5 tahun terakhir untuk "ALL")
        hist_url = "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1825&interval=daily"
        hist_response = requests.get(hist_url, timeout=10) # Tambahkan timeout
        hist_response.raise_for_status()
        hist_json = hist_response.json()

        # Ubah data historis menjadi DataFrame pandas
        prices = hist_json.get('prices', [])
        if not prices:
            raise ValueError("Data harga historis tidak ditemukan dalam respons CoinGecko")
            
        hist_df = pd.DataFrame(prices, columns=['timestamp', 'Close'])
        hist_df['Date'] = pd.to_datetime(hist_df['timestamp'], unit='ms')

        # Panggil API CoinGecko untuk data live (harga, perubahan, market cap, volume)
        live_url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
        live_response = requests.get(live_url, timeout=10) # Tambahkan timeout
        live_response.raise_for_status()
        live_json = live_response.json().get('ethereum', {})

        # Gunakan data live dari CoinGecko
        price_now = live_json.get('usd')
        change_percent = live_json.get('usd_24h_change')
        
        # Pastikan data tidak None sebelum melakukan kalkulasi
        if price_now is None or change_percent is None:
            raise ValueError("Data harga live atau perubahan tidak ditemukan dalam respons CoinGecko")

        change_absolute = price_now * (change_percent / 100)

        live_price = {
            "price": price_now,
            "change": change_absolute,
            "change_percent": change_percent,
            "market_cap": live_json.get('usd_market_cap', 0),
            "volume_24h": live_json.get('usd_24h_vol', 0)
        }
        
        # Siapkan data historis untuk dikirim ke frontend
        hist_df['date'] = hist_df['Date'].dt.strftime('%Y-%m-%d')
        historical_data = hist_df[['date', 'Close']].rename(columns={'Close': 'price'}).to_dict('records')
        
        return live_price, historical_data, hist_df

    except requests.exceptions.RequestException as e:
        print(f"Error Jaringan saat mengambil data dari CoinGecko: {e}")
        return {}, [], pd.DataFrame()
    except Exception as e:
        print(f"Error di get_main_dashboard_data (CoinGecko): {e}")
        return {}, [], pd.DataFrame()

# Fungsi ini tidak lagi digunakan secara aktif oleh endpoint utama, tetapi kita biarkan saja
def get_live_market_data():
    return {}

def calculate_technical_indicators(hist_df: pd.DataFrame):
    if hist_df.empty or len(hist_df) < 200:
        return {"rsi": "N/A", "macd": "N/A", "sma50": "N/A", "sma200": "N/A", "sentiment": "Insufficient Data"}

    sma50 = hist_df['Close'].rolling(window=50).mean().iloc[-1]
    sma200 = hist_df['Close'].rolling(window=200).mean().iloc[-1]
    
    delta = hist_df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    
    if pd.isna(loss.iloc[-1]) or loss.iloc[-1] == 0:
        rsi = 100
    else:
        rs = gain.iloc[-1] / loss.iloc[-1]
        rsi = 100 - (100 / (1 + rs))

    exp12 = hist_df['Close'].ewm(span=12, adjust=False).mean()
    exp26 = hist_df['Close'].ewm(span=26, adjust=False).mean()
    macd = (exp12 - exp26).iloc[-1]
    
    sentiment = "Neutral"
    if rsi > 70: sentiment = "Overbought (Sell)"
    if rsi < 30: sentiment = "Oversold (Buy)"
    
    return {"rsi": rsi, "macd": macd, "sma50": sma50, "sma200": sma200, "sentiment": sentiment}

def generate_risk_analysis(hist_df: pd.DataFrame):
    if hist_df.empty or len(hist_df) < 30: 
        return {"level": "Unknown", "factors": ["Insufficient data."]}
    
    volatility = hist_df['Close'].tail(30).pct_change().std() * np.sqrt(365)
    
    if pd.isna(volatility):
        return {"level": "Unknown", "factors": ["Could not calculate volatility."]}

    level = "Low"
    if volatility > 0.8: level = "Medium"
    if volatility > 1.2: level = "High"
    
    factors = [f"Annualized volatility is currently at {(volatility * 100):.2f}%."]
    if level == "High": factors.append("High volatility indicates significant price swings and increased risk.")
    elif level == "Medium": factors.append("Moderate volatility suggests noticeable price changes.")
    else: factors.append("Low volatility suggests price stability.")
    
    return {"level": level, "factors": factors}
```

### Rencana Aksi (Langkah Selanjutnya)

1.  **Perbarui Kode Lokal**: Ganti seluruh isi file `backend/app/services/eth_price_service.py` di komputer lokal Anda dengan kode baru di atas.
2.  **Commit dan Push ke GitHub**:
    ```bash
    git add backend/app/services/eth_price_service.py
    git commit -m "Feat: Refactor all data fetching to CoinGecko for reliability"
    git push origin main
    ```
3.  **Update dan Restart Server VPS**:
    * Hubungkan ke VPS Anda.
    * Jalankan `git pull origin main`.
    * Jalankan `sudo systemctl restart eth_analyzer.service`.
4.  **Periksa Log Secara Real-time**:
    * Buka terminal kedua ke VPS Anda.
    * Jalankan perintah ini untuk melihat log secara langsung:
        ```bash
        sudo journalctl -u eth_analyzer.service -f
        

