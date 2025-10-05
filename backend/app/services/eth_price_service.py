import yfinance as yf
import pandas as pd
import numpy as np
import requests
from datetime import datetime

def get_main_dashboard_data():
    """
    PERBAIKAN: Mengambil data harga live dan historis dari CoinGecko, 
    bukan yfinance, untuk menghindari blokir dari server.
    """
    try:
        # Panggil API CoinGecko untuk data historis (misal, 1 tahun terakhir)
        hist_url = "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=365&interval=daily"
        hist_response = requests.get(hist_url)
        hist_response.raise_for_status()
        hist_json = hist_response.json()

        # Ubah data historis menjadi DataFrame pandas
        prices = hist_json['prices']
        hist_df = pd.DataFrame(prices, columns=['timestamp', 'Close'])
        hist_df['Date'] = pd.to_datetime(hist_df['timestamp'], unit='ms')

        # Panggil API CoinGecko untuk data live (harga, perubahan, market cap, volume)
        live_url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
        live_response = requests.get(live_url)
        live_response.raise_for_status()
        live_json = live_response.json().get('ethereum', {})

        # Ambil data terbaru dari historis untuk menghitung perubahan harian jika tidak tersedia di live data
        latest = hist_df.iloc[-1]
        previous = hist_df.iloc[-2]
        
        # Gunakan perubahan 24 jam dari CoinGecko jika tersedia, jika tidak hitung manual
        change_percent = live_json.get('usd_24h_change', 0)
        price_now = live_json.get('usd', latest['Close'])
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

    except Exception as e:
        print(f"Error in get_main_dashboard_data (CoinGecko): {e}")
        # Kembalikan struktur kosong jika gagal
        return {}, [], pd.DataFrame()

# Fungsi get_live_market_data() sekarang tidak diperlukan karena datanya sudah digabung di atas.
# Kita bisa membiarkannya atau menghapusnya. Untuk saat ini, kita biarkan saja.
def get_live_market_data():
    return {}


def calculate_technical_indicators(hist_df: pd.DataFrame):
    if hist_df.empty: return {"rsi": 0, "macd": 0, "sma50": 0, "sma200": 0, "sentiment": "Unknown"}
    
    # Pastikan data cukup untuk kalkulasi
    if len(hist_df) < 200:
        return {"rsi": "N/A", "macd": "N/A", "sma50": "N/A", "sma200": "N/A", "sentiment": "Insufficient Data"}

    sma50 = hist_df['Close'].rolling(window=50).mean().iloc[-1]
    sma200 = hist_df['Close'].rolling(window=200).mean().iloc[-1]
    
    delta = hist_df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    
    # Hindari pembagian dengan nol
    if loss.iloc[-1] == 0:
        rsi = 100
    else:
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs)).iloc[-1]

    exp12 = hist_df['Close'].ewm(span=12, adjust=False).mean()
    exp26 = hist_df['Close'].ewm(span=26, adjust=False).mean()
    macd = (exp12 - exp26).iloc[-1]
    
    sentiment = "Neutral"
    if rsi > 70: sentiment = "Overbought (Sell)"
    if rsi < 30: sentiment = "Oversold (Buy)"
    
    return {"rsi": rsi, "macd": macd, "sma50": sma50, "sma200": sma200, "sentiment": sentiment}

def generate_risk_analysis(hist_df: pd.DataFrame):
    if hist_df.empty or len(hist_df) < 30: return {"level": "Unknown", "factors": ["Insufficient data."]}
    
    volatility = hist_df['Close'].tail(30).pct_change().std() * np.sqrt(365)
    
    level = "Low"
    if volatility > 0.8: level = "Medium"
    if volatility > 1.2: level = "High"
    
    factors = [f"Annualized volatility is currently at {(volatility * 100):.2f}%."]
    if level == "High": factors.append("High volatility indicates significant price swings and increased risk.")
    elif level == "Medium": factors.append("Moderate volatility suggests noticeable price changes.")
    else: factors.append("Low volatility suggests price stability.")
    
    return {"level": level, "factors": factors}

