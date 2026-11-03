import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from mangum import Mangum

# Initialize FastAPI app
app = FastAPI(title="Efarmer API", version="1.0.0")

# Configure CORS so your frontend can connect without blocking
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin (or replace with your Vercel URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Supabase configuration (reads from environment variables)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Pydantic model for incoming crop data
class CropCreate(BaseModel):
    name: str
    category: str
    quantity: float
    price_per_unit: float
    status: str

@app.get("/")
def read_root():
    return {"message": "Efarmer Backend is running successfully!"}

@app.get("/crops/")
def get_crops():
    try:
        response = supabase.table("crops").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/crops/")
def create_crop(crop: CropCreate):
    try:
        data = {
            "name": crop.name,
            "category": crop.category,
            "quantity": crop.quantity,
            "price_per_unit": crop.price_per_unit,
            "status": crop.status
        }
        response = supabase.table("crops").insert(data).execute()
        return response.data[0] if response.data else {"message": "Crop added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mangum handler wrapper for Vercel serverless deployment
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)