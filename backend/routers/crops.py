from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/crops", tags=["crops"])

# Pydantic Schema including price
class CropSchema(BaseModel):
    name: str
    type: str
    quantity: int
    price: float

# Initial in-memory data store for local testing
crops_db = [
    {"id": 1, "name": "Rice", "type": "Grain", "quantity": 100, "price": 2.50},
    {"id": 2, "name": "Wheat", "type": "Grain", "quantity": 50, "price": 1.80}
]

# 1. READ ALL (View All Crops)
@router.get("/", response_model=List[dict])
def get_crops():
    return crops_db

# 2. READ ONE (View Single Crop Details by ID)
@router.get("/{crop_id}")
def get_crop(crop_id: int):
    for crop in crops_db:
        if crop["id"] == crop_id:
            return crop
    raise HTTPException(status_code=404, detail="Crop not found")

# 3. CREATE (Add New Crop)
@router.post("/")
def add_crop(crop: CropSchema):
    new_id = len(crops_db) + 1 if crops_db else 1
    new_item = {"id": new_id, **crop.model_dump()}
    crops_db.append(new_item)
    return new_item

# 4. UPDATE (Edit Existing Crop)
@router.put("/{crop_id}")
def update_crop(crop_id: int, updated: CropSchema):
    for crop in crops_db:
        if crop["id"] == crop_id:
            crop.update(updated.model_dump())
            return crop
    raise HTTPException(status_code=404, detail="Crop not found")

# 5. DELETE (Remove Crop)
@router.delete("/{crop_id}")
def delete_crop(crop_id: int):
    global crops_db
    for crop in crops_db:
        if crop["id"] == crop_id:
            crops_db = [c for c in crops_db if c["id"] != crop_id]
            return {"message": f"Crop #{crop_id} deleted successfully"}
    raise HTTPException(status_code=404, detail="Crop not found")