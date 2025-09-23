# backend/app/api/endpoints.py

from fastapi import APIRouter
from app.services import prediction_service, eth_price_service
import pandas as pd
from datetime import datetime

router = APIRouter()

@router.get("/main-dashboard")
async def main_dashboard_data():
    """
    Menggabungkan semua data dinamis untuk frontend dalam satu endpoint.
    """
    try:
        # 1. Ambil data harga dasar & historis
        live_price, historical_data, historical_df = eth_price_service.get_main_dashboard_data()

        # 2. Ambil data pasar live (market cap & vol)
        live_market_data = eth_price_service.get_live_market_data()
        
        # --- PERBAIKAN: Masukkan data live market ke dalam objek live_price ---
        live_price["volume_24h"] = live_market_data.get("volume_24h", "N/A")
        live_price["market_cap"] = live_market_data.get("market_cap", "N/A")

        # 3. Ambil prediksi jangka pendek
        prophet_pred = prediction_service.get_prophet_prediction()
        # PENTING: Meneruskan historical_df ke fungsi prediksi LSTM
        lstm_pred = prediction_service.get_lstm_prediction(historical_df)

        # 4. Hitung indikator teknis
        tech_indicators = eth_price_service.calculate_technical_indicators(historical_df)

        # 5. Buat analisis risiko
        risk_analysis = eth_price_service.generate_risk_analysis(historical_df)

        # 6. Baca metrik & tentukan model terbaik.
        model_metrics, best_model_info = prediction_service.get_model_metrics()
        
        # 7. Buat prediksi tahunan
        yearly_preds = prediction_service.get_yearly_predictions()

        # 8. Gabungkan semua hasil
        return {
            "live_price": live_price,
            "historical_data": historical_data,
            "lstm_prediction": lstm_pred,
            "prophet_prediction": prophet_pred,
            "technical_indicators": tech_indicators,
            "risk_analysis": risk_analysis,
            "model_metrics": model_metrics,
            "best_model_info": best_model_info,
            "yearly_predictions": yearly_preds
        }
    except Exception as e:
        print(f"Error di endpoint /main-dashboard: {e}")
        return {
            "live_price": {},
            "historical_data": [],
            "lstm_prediction": [],
            "prophet_prediction": [],
            "technical_indicators": {},
            "risk_analysis": {"level": "Unknown", "factors": ["Gagal mengambil data."]},
            "model_metrics": [],
            "best_model_info": {"name": "N/A"},
            "yearly_predictions": []
        }

@router.get("/chart-data")
async def get_chart_data():
    """
    Endpoint khusus untuk pembaruan grafik real-time.
    """
    try:
        # Panggil fungsi yang sudah ada untuk mendapatkan data terbaru
        live_price, historical_data, _ = eth_price_service.get_main_dashboard_data()
        
        # Ambil data terbaru dari historical_data (data terbaru adalah yang terakhir)
        latest_data = historical_data[-1]

        # Gabungkan data harga live ke dalam format yang sesuai dengan frontend
        # Asumsikan live_price adalah data yang paling real-time
        live_data_point = {
            "time": datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
            "price": live_price.get("price", 0)
        }
        
        # Kembalikan data historis terbaru dan data live
        # Ini menyimulasikan pembaruan real-time pada grafik
        return [
            {"time": latest_data["date"] + "T00:00:00", "price": latest_data["price"]},
            live_data_point
        ]
    except Exception as e:
        print(f"Error di endpoint /chart-data: {e}")
        return []