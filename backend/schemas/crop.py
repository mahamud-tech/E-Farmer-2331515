from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class CropBase(BaseModel):
    name: str
    category: str
    quantity: float
    price_per_unit: float
    status: str = "available"

class CropCreate(CropBase):
    pass

class CropUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    price_per_unit: Optional[float] = None
    status: Optional[str] = None

class CropResponse(CropBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True