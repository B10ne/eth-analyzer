# backend/app/services/database.py
import mysql.connector
import os # <-- Tambahkan ini

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("MYSQL_HOST"),      # Ambil dari variabel lingkungan
            user=os.environ.get("MYSQL_USER"),      # Ambil dari variabel lingkungan
            password=os.environ.get("MYSQL_PASSWORD"),  # Ambil dari variabel lingkungan
            database=os.environ.get("MYSQL_DATABASE") # Ambil dari variabel lingkungan
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None