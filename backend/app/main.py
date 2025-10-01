from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# PERBAIKAN: Impor router dari endpoint.py dan berikan alias
from app.api.endpoint import router as endpoint_router
from app.api.auth import router as auth_router

app = FastAPI(title="ETH Analyzer API")

# Izinkan frontend mengakses API ini
origins = [
    "https://viqiwebsite.my.id", 
    "http://viqiwebsite.my.id",
    
    "http://localhost:8080",      
    "http://192.168.1.6:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PERBAIKAN: Gunakan nama variabel yang sudah didefinisikan
app.include_router(endpoint_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")

@app.get("/")
def read_root():
    return {"status": "API is running"} # Baris 32 ada di sini
