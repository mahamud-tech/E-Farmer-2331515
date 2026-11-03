from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import crops

app = FastAPI()

# Add CORS middleware to allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crops.router)

@app.get("/")
def read_root():
    return {"message": "Efarmer MVP Backend Running"}