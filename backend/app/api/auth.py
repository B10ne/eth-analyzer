# backend/app/api/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
import bcrypt
import mysql.connector
from app.services.database import get_db_connection

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Fungsi untuk hash password
def hash_password(password: str) -> str:
    # 8 karakter min, jadi kita bisa langsung hash
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Fungsi untuk verifikasi password
def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/register")
def register_user(user: UserCreate):
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    cursor = conn.cursor()
    hashed_pw = hash_password(user.password)
    
    try:
        cursor.execute("INSERT INTO users (email, password_hash) VALUES (%s, %s)", (user.email, hashed_pw))
        conn.commit()
        return {"message": "User registered successfully."}
    except mysql.connector.Error as err:
        if err.errno == 1062: # Duplicate entry
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
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
    db_user = cursor.fetchone()
    
    cursor.close()
    conn.close()

    if not db_user or not verify_password(user.password, db_user['password_hash']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    
    # 💡 Lanjutkan dengan pembuatan token JWT atau sesi di sini.
    # Untuk contoh ini, kita hanya mengembalikan pesan sukses.
    return {"message": "Login successful."}