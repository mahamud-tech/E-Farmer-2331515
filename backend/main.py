from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.crops import router as crops_router

app = FastAPI(title="E-Farmer Local API", version="1.0")

# Enable CORS so your React frontend can communicate with FastAPI locally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the crop CRUD router
app.include_router(crops_router, prefix="/api")  # Vercel forwards /api/... unchanged

@app.get("/")
def read_root():
    return {"message": "E-Farmer Backend is running successfully!"}