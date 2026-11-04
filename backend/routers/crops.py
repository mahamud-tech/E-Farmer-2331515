from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from database import supabase

router = APIRouter(prefix="/crops", tags=["crops"])

TABLE = "crops"


# Shape of the data the React form sends
class CropSchema(BaseModel):
    name: str
    type: str
    quantity: int = Field(ge=0)
    price: float = Field(ge=0)
    status: str = "Available"


# 1. READ ALL (View All Crops)
@router.get("")
def get_crops():
    return supabase.table(TABLE).select("*").order("id").execute().data


# 2. READ ONE (View Single Crop Details by ID)
@router.get("/{crop_id}")
def get_crop(crop_id: int):
    rows = supabase.table(TABLE).select("*").eq("id", crop_id).execute().data
    if not rows:
        raise HTTPException(status_code=404, detail="Crop not found")
    return rows[0]


# 3. CREATE (Add New Crop)
@router.post("")
def add_crop(crop: CropSchema):
    rows = supabase.table(TABLE).insert(crop.model_dump()).execute().data
    return rows[0]


# 4. UPDATE (Edit Existing Crop)
@router.put("/{crop_id}")
def update_crop(crop_id: int, updated: CropSchema):
    rows = supabase.table(TABLE).update(updated.model_dump()).eq("id", crop_id).execute().data
    if not rows:
        raise HTTPException(status_code=404, detail="Crop not found")
    return rows[0]


# 5. DELETE (Remove Crop)
@router.delete("/{crop_id}")
def delete_crop(crop_id: int):
    rows = supabase.table(TABLE).delete().eq("id", crop_id).execute().data
    if not rows:
        raise HTTPException(status_code=404, detail="Crop not found")
    return {"message": f"Crop #{crop_id} deleted successfully"}
