import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

# Locally the values come from backend/.env; on Vercel from Project Settings > Environment Variables.
load_dotenv(Path(__file__).parent / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set (see backend/.env.example)")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
