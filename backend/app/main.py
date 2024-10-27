from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router  # Import the routes

# Initialize the FastAPI app
app = FastAPI()

# Configure CORS to allow React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(router)

# Add this for debugging
@app.get("/")
async def root():
    return {"message": "API is running"}
