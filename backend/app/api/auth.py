# backend/app/api/auth.py (Kembali ke MySQL/TiDB)
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import bcrypt
# KEMBALIKAN: Menggunakan driver MySQL
import mysql.connector 
from app.services.database import get_db_connection

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Fungsi untuk hash password (TETAP SAMA)
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Fungsi untuk verifikasi password (TETAP SAMA)
def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/register")
def register_user(user: UserCreate):
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    # Cursor MySQL/TiDB
    cursor = conn.cursor()
    hashed_pw = hash_password(user.password)
    
    try:
        # Perintah SQL menggunakan placeholder %s (berlaku untuk MySQL juga)
        cursor.execute("INSERT INTO users (email, password_hash) VALUES (%s, %s)", (user.email, hashed_pw))
        conn.commit()
        return {"message": "User registered successfully."}
    
    # KEMBALIKAN: Penanganan error duplikasi MySQL (Error Code 1062)
    except mysql.connector.Error as err:
        if err.errno == 1062: # Duplicate entry for MySQL/TiDB
            raise HTTPException(status_code=409, detail="Email already registered.")
        else:
            raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()

@router.post("/login")
def login_user(user: UserLogin):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    # KEMBALIKAN: Menggunakan cursor dictionary=True untuk hasil berbasis kolom
    cursor = conn.cursor(dictionary=True) 
    # KEMBALIKAN: Menggunakan SELECT * (seperti kode awal Anda)
    cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
    db_user = cursor.fetchone()
    
    cursor.close()
    conn.close()

    if not db_user or not verify_password(user.password, db_user['password_hash']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    
    # Anda mungkin harus mengembalikan JWT di sini
    return {"message": "Login successful."}