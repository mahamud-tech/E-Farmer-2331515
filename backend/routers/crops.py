from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from supabase import create_client, Client

router = APIRouter(prefix="/crops", tags=["crops"])

# Your Supabase credentials
SUPABASE_URL = "https://lezjqsiulosnefjsfaaw.supabase.co"
SUPABASE_KEY = "sb_publishable_n2sXekte2ZoyMafhdrO6tQ_KdT35xzZ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class CropCreate(BaseModel):
    name: str
    category: str
    quantity: float
    price_per_unit: float
    status: Optional[str] = "available"

class Crop(CropCreate):
    id: str
    created_at: Optional[str] = None

@router.get("/", response_model=List[Crop])
def get_crops():
    response = supabase.table("crops").select("*").execute()
    return response.data

@router.post("/", response_model=Crop)
def create_crop(crop: CropCreate):
    data = {
        "name": crop.name,
        "category": crop.category,
        "quantity": crop.quantity,
        "price_per_unit": crop.price_per_unit,
        "status": crop.status
    }
    response = supabase.table("crops").insert(data).execute()
    if response.data:
        return response.data[0]
    raise HTTPException(status_code=400, detail="Failed to create crop")

@router.get("/{crop_id}", response_model=Crop)
def get_crop(crop_id: str):
    response = supabase.table("crops").select("*").eq("id", crop_id).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    raise HTTPException(status_status=404, detail="Crop not found")

@router.delete("/{crop_id}")
def delete_crop(crop_id: str):
    response = supabase.table("crops").delete().eq("id", crop_id).execute()
    return {"message": "Deleted successfully"}

@router.put("/{crop_id}", response_model=Crop)
def update_crop(crop_id: str, crop: CropCreate):
    try:
        data = {
            "name": crop.name,
            "category": crop.category,
            "quantity": crop.quantity,
            "price_per_unit": crop.price_per_unit,
            "status": crop.status
        }
        response = supabase.table("crops").update(data).eq("id", crop_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        raise HTTPException(status_code=404, detail="Crop not found or update failed")
    except Exception as e:
        print(f"Error updating crop: {e}")
        raise HTTPException(status_code=500, detail=str(e))