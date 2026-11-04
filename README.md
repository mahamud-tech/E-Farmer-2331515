# E-Farmer

Smart crop inventory and farm management system. FastAPI backend + Vite/React/TypeScript frontend, with crops stored in Supabase, deployed to Vercel as one project.

```
backend/    FastAPI app (routes under /api), Supabase client in database.py
frontend/   Vite + React + TypeScript CRUD UI
vercel.json Vercel setup: /api/* goes to backend, everything else to frontend
```

## API endpoints

All endpoints are under `/api/crops`. Interactive docs: http://localhost:8000/docs when running locally.

| Method | Path | Purpose | Example body |
| --- | --- | --- | --- |
| `GET` | `/api/crops` | List all crops, ordered by id | – |
| `GET` | `/api/crops/{id}` | Get one crop (404 if not found) | – |
| `POST` | `/api/crops` | Add a crop, returns the new row | `{"name": "Rice", "type": "Grain", "quantity": 120, "price": 1.5, "status": "Available"}` |
| `PUT` | `/api/crops/{id}` | Update a crop, returns the row (404 if not found) | `{"name": "Rice", "type": "Grain", "quantity": 80, "price": 1.75, "status": "Reserved"}` |
| `DELETE` | `/api/crops/{id}` | Delete a crop, returns `{"message": ...}` (404 if not found) | – |

`quantity` and `price` must be `>= 0`; `status` defaults to `"Available"`. Invalid bodies return `422`.

## Supabase setup

The backend reads and writes the `public.crops` table:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint` | identity, primary key |
| `name` | `text` | |
| `type` | `text` | category, e.g. Grain, Vegetable |
| `quantity` | `integer` | `>= 0` |
| `price` | `numeric(10,2)` | `>= 0` |
| `status` | `text` | default `'Available'` |
| `created_at` | `timestamptz` | default `now()` |

RLS policies allow the `anon` role to select, insert, update and delete.

The backend needs two environment variables (from Supabase → Project Settings → API):

- `SUPABASE_URL`: the project URL, e.g. `https://<project-ref>.supabase.co`
- `SUPABASE_KEY`: the publishable (anon) key

**Locally:** copy `backend/.env.example` to `backend/.env` and fill in the values. `.env` is gitignored.

**On Vercel:** add the same two variables under Project Settings → Environment Variables, then redeploy.

## Requirements

- [Python](https://www.python.org/downloads/) 3.10+
- [Node.js](https://nodejs.org/) 22+

> On macOS/Linux, use `python3` instead of `python`.

## Run locally

**Backend** (terminal 1):

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1      # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env          # macOS/Linux: cp .env.example .env, then fill in the values
fastapi dev main.py
```

**Frontend** (terminal 2):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite forwards `/api` requests to the backend on port 8000.

To run it the way Vercel does instead, from the project root:

```bash
npm install -g vercel
vercel dev -L
```

> Add new Python packages to `backend/requirements.txt`.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Go to https://vercel.com/new, import the repo and click **Deploy**. Keep **Root Directory** as `./`.
3. Add `SUPABASE_URL` and `SUPABASE_KEY` in Project Settings → Environment Variables and redeploy.

Every push to `main` redeploys automatically. Or deploy from your machine with `vercel --prod`.

## Troubleshooting

- **"Running scripts is disabled" in PowerShell:** run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **`fastapi` not found:** activate the virtual environment first.
- **`SUPABASE_URL and SUPABASE_KEY must be set`:** create `backend/.env` (locally) or add the variables in Vercel.
- **Red "Could not load the crop inventory" message in the app:** the backend isn't running or can't reach Supabase.
- **App at localhost:8000 shows an old version:** delete `frontend/dist`.
- **Vercel build fails:** check **Build Logs** in the Vercel dashboard, and make sure `npm run build` works in `frontend/`.
