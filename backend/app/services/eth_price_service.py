import yfinance as yf
import pandas as pd
import numpy as np
import requests

def get_main_dashboard_data():
    try:
        hist_df = yf.Ticker("ETH-USD").history(period="max")
        hist_df = hist_df.reset_index()
        latest = hist_df.iloc[-1]
        previous = hist_df.iloc[-2]
        change = latest['Close'] - previous['Close']
        change_percent = (change / previous['Close']) * 100 if previous['Close'] else 0
        live_price = {
            "price": latest['Close'],
            "change": change,
            "change_percent": change_percent
        }
        hist_df['Date'] = hist_df['Date'].dt.strftime('%Y-%m-%d')
        historical_data = hist_df[['Date', 'Close']].rename(columns={'Date': 'date', 'Close': 'price'}).to_dict('records')
        return live_price, historical_data, hist_df
    except Exception as e:
        print(f"Error in get_main_dashboard_data: {e}")
        return {}, [], pd.DataFrame()

def get_live_market_data():
    """Mengambil data pasar lengkap (termasuk market cap & vol) dari CoinGecko."""
    try:
        url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
        response = requests.get(url)
        response.raise_for_status()
        eth_data = response.json().get('ethereum', {})
        return {
            "market_cap": f"${eth_data.get('usd_market_cap', 0):,.0f}",
            "volume_24h": f"${eth_data.get('usd_24h_vol', 0):,.0f}"
        }
    except Exception as e:
        print(f"Error fetching live market data: {e}")
        return {}

def calculate_technical_indicators(hist_df: pd.DataFrame):
    if hist_df.empty: return {"rsi": 0, "macd": 0, "sma50": 0, "sma200": 0}
    sma50 = hist_df['Close'].rolling(window=50).mean().iloc[-1]
    sma200 = hist_df['Close'].rolling(window=200).mean().iloc[-1]
    delta = hist_df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs)).iloc[-1]
    exp12 = hist_df['Close'].ewm(span=12, adjust=False).mean()
    exp26 = hist_df['Close'].ewm(span=26, adjust=False).mean()
    macd = (exp12 - exp26).iloc[-1]
    sentiment = "Neutral"
    if rsi > 70: sentiment = "Sell"
    if rsi < 30: sentiment = "Buy"
    return {"rsi": rsi, "macd": macd, "sma50": sma50, "sma200": sma200, "sentiment": sentiment}

def generate_risk_analysis(hist_df: pd.DataFrame):
    if hist_df.empty: return {"level": "Unknown", "factors": ["Insufficient data."]}
    volatility = hist_df['Close'].tail(30).pct_change().std() * np.sqrt(365)
    level = "Low"
    if volatility > 0.8: level = "Medium"
    if volatility > 1.2: level = "High"
    factors = [f"Annualized volatility is currently at {(volatility * 100):.2f}%."]
    if level == "High": factors.append("High volatility indicates significant price swings and increased risk.")
    elif level == "Medium": factors.append("Moderate volatility suggests noticeable price changes.")
    else: factors.append("Low volatility suggests price stability.")
    return {"level": level, "factors": factors}