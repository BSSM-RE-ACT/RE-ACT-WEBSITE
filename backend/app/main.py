import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import Base, SessionLocal, engine
from .routers import api_router
from .seed import run_seed

Base.metadata.create_all(bind=engine)
os.makedirs(settings.upload_dir, exist_ok=True)

with SessionLocal() as db:
    run_seed(db)

app = FastAPI(title="RE:ACT Club API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
app.include_router(api_router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
