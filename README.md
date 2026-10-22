# HireSphere – Labour–Recruiter Job Portal

React + Vite + Tailwind frontend (project root) and Node.js + Express + MongoDB + JWT backend (`/backend`).

## Prerequisites
Node.js 18+ and a MongoDB database (local install **or** a free MongoDB Atlas cluster).

## 1. Start the backend
```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
```
Edit `backend/.env`:
- `MONGODB_URI` – e.g. `mongodb://127.0.0.1:27017/hiresphere` or your Atlas URI
- `JWT_SECRET` – a long random string. Generate one with:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `CLIENT_URL` – the frontend origin allowed by CORS (default `http://localhost:5173`)

```bash
npm run seed    # optional: loads demo users, jobs and applications (WIPES existing data)
npm run dev     # API on http://localhost:5000/api  (use `npm start` in production)
```

## 2. Start the frontend (second terminal, project root)
```bash
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

Demo logins after seeding (password `Demo@123`): `worker@demo.com` · `recruiter@demo.com`.
You can also sign up normally; no seed is required.

## How it fits together
- The UI still talks only to `useStore()` (`src/utils/store.jsx`), which now calls the API through `src/utils/api.js`. `src/utils/mappers.js` converts API documents to the shapes the pages use.
- `localStorage` stores **only** the JWT (`hiresphere_token`) to keep you logged in. All business data comes from MongoDB.
- Worker and recruiter dashboards re-sync every 20 s and when the browser tab regains focus, so status changes appear on the other side without a manual reload.
- Passwords are hashed with bcrypt (cost 12, via `bcryptjs`); API responses never include them.

## API (all under `/api`, JSON `{success,data,message?,meta?}`; errors `{success:false,message,errors?}`)
| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` · `GET /auth/me` |
| Profiles | `GET/PUT /workers/profile` (worker) · `GET/PUT /recruiters/profile` (recruiter) |
| Jobs | `GET /jobs?q&category&location&jobType&status&minSalary&sort&page&limit` · `GET /jobs/:id` · `GET /jobs/mine` · `POST /jobs` · `PUT /jobs/:id` · `PATCH /jobs/:id/status` · `DELETE /jobs/:id` |
| Applications | `POST /applications` · `GET /applications/mine` · `GET /applications/recruiter?jobId=` · `GET /applications/:id` · `PATCH /applications/:id/status` · `DELETE /applications/:id` (withdraw pending) |
| Dashboards | `GET /dashboard/worker` · `GET /dashboard/recruiter` |
| Notifications | `GET /notifications` · `PATCH /notifications/read-all` · `PATCH /notifications/:id/read` |

Protected routes need `Authorization: Bearer <token>`. Role rules: only workers apply/withdraw; only the owning recruiter edits, closes or deletes a job or accepts/rejects its applicants. A unique index on (job, worker) prevents duplicate applications.

## Known limitations
- **Forgot Password** and **Contact Us** are still UI-only (no email service is configured), so they do not send anything.
- The job list is loaded once (up to 200 jobs) and filtered in the browser; the API also supports server-side filters and pagination.
- Dashboard numbers in the UI are computed from the synced data; `/dashboard/*` returns the same stats for API consumers.
- Backend request/response paths were smoke-tested without a database (auth, validation, 404s); run the seed and click through both roles on your machine to confirm the full flow against your MongoDB.
