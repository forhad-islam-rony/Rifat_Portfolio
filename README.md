# Rifat Rafiu — Research Portfolio & Dashboard

A professional research portfolio for **Rifat Rafiu** (Materials Science & Engineering, KUET)
with a password-protected **dashboard** to manage every piece of content — publications,
profile, metrics, research areas, education, experience, skills, awards, and contact
messages — **without touching any code.**

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **MongoDB**
(MongoDB Atlas free tier works). Deployable to **Netlify** or **Vercel**.

---

## ⚠️ What changed (November 2026) — and why

The first version used **Supabase** for the database *and* the login. Two problems
caused "I can't log in and my edits are gone":

1. **Supabase free projects are paused after ~1 week of low activity.** Once paused,
   the login (which ran through Supabase) failed, and the site quietly switched to the
   built-in default content — so it looked like the edits were lost. They were in the
   paused project the whole time.
2. **The public pages were pre-rendered at build time**, so even while Supabase was
   working, dashboard edits only appeared on the live site after a redeploy.

The new version fixes both:

- **MongoDB** stores all content, messages, and uploaded photo/CV (GridFS).
- **The admin login is defined in environment variables**, not in the database, so you
  can always sign in — even when the database is down.
- **Public pages render on every request**, so edits show up immediately.
- **A daily keep-alive** (`netlify/functions/keepalive.mts` / `vercel.json` cron) pings
  the database so a free Atlas cluster is never idle long enough to be paused.
- **One-click backups** (Dashboard → Overview → *Backup & restore*) plus `npm run backup`.
- If the database ever can't be reached, the dashboard shows a clear red banner
  explaining why, instead of failing silently.

---

## 🚀 Setup

### 1. Create a free MongoDB Atlas database (≈5 minutes)

1. Sign up at **https://www.mongodb.com/cloud/atlas/register** and create a **Free** cluster.
2. **Database Access** → *Add New Database User* → username + password
   (role: *Read and write to any database*). Avoid `@ : / ?` in the password, or
   URL-encode them.
3. **Network Access** → *Add IP Address* → **Allow access from anywhere (`0.0.0.0/0`)**.
   This is required for Netlify/Vercel, whose server IPs change.
4. **Clusters** → *Connect* → *Drivers* → copy the connection string, e.g.
   `mongodb+srv://USER:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   and replace `<db_password>` with the real password.

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill it in:

| Variable | What it is |
|---|---|
| `MONGODB_URI` | The Atlas connection string from step 1 |
| `MONGODB_DB` | Database name (default `portfolio`) |
| `ADMIN_EMAIL` | The email you will log in with |
| `ADMIN_PASSWORD` | The dashboard password (change it any time, then restart/redeploy) |
| `AUTH_SECRET` | Long random string that signs the login cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | Your public URL (e.g. `https://rifat.netlify.app`) |

Write each one as `KEY=value`, with no spaces around `=`.

### 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and sign in at http://localhost:3000/login.
On the **first** connection the app automatically copies the built-in content
(`src/lib/static-data.ts`) into the empty database, so the dashboard starts full.
After that, MongoDB is the only source of truth.

### 4. (Optional) Bring back the old Supabase data

1. Go to https://supabase.com/dashboard and open the old project.
   - If it shows **Restore project**, click it and wait until it's running.
   - If it says it has been paused for more than 90 days, download the database
     backup from there instead. That file is a Postgres dump; ask for help converting it.
2. Add `SUPABASE_URL` and `SUPABASE_KEY` (and optionally the old `SUPABASE_EMAIL` /
   `SUPABASE_PASSWORD`, which are needed to copy contact messages) to `.env.local`.
3. Run `npm run import:supabase`. This **replaces** the MongoDB content with the Supabase
   data, copies the photo/CV out of Supabase Storage, and saves a raw copy in `backups/`.

---

## ☁️ Deploy

### Netlify
1. Push to GitHub, then on Netlify choose *Add new site → Import from Git*.
2. Build command `npm run build`, publish directory `.next` (already set in `netlify.toml`).
3. **Site configuration → Environment variables**: add every variable from step 2.
   Remove the old `NEXT_PUBLIC_SUPABASE_*` variables.
4. Deploy. The daily keep-alive function in `netlify/functions/` is picked up automatically.

### Vercel
Import the repo and add the same environment variables. The `vercel.json` cron pings
`/api/health` daily.

After deploying, open `https://your-site/api/health`. It should show `{"db":"ok",...}`.

---

## 💾 Backups (so data is never lost)

- **Dashboard → Overview → Download backup** gives you a single `.json` file with all
  content, messages, and uploaded files. Keep one after big edits (e.g. in Google Drive).
- **Restore** on the same panel loads a backup file back in.
- From the command line: `npm run backup` writes to `backups/` (ignored by git).
- Free Atlas clusters have no automatic backups, so these copies are your safety net.

Note: hosting providers limit request size (about 4.5 MB on Vercel and 6 MB on Netlify). If a
backup with large files is too big to restore through the dashboard, restore it locally
(`npm run dev` with the production `MONGODB_URI`).

---

## 🩺 Troubleshooting

| Symptom | Fix |
|---|---|
| Login page says "Admin login not configured" | `ADMIN_EMAIL`, `ADMIN_PASSWORD` or `AUTH_SECRET` is missing, or `AUTH_SECRET` is shorter than 16 characters. Add them and redeploy. |
| "Invalid email or password" | The values must match the env vars exactly (the email is case-insensitive). On Netlify, redeploy after changing variables. |
| Red "Database not connected" banner | Read the message. Usually: Network Access is missing `0.0.0.0/0`, the password in `MONGODB_URI` is wrong or not URL-encoded, or the Atlas cluster is paused (click **Resume** in Atlas). |
| Public site shows old default content | The database is unreachable; the dashboard banner will say why. |

---

## 🛠 Managing content

Everything is editable at `/dashboard`:

| Section | What it controls |
|---|---|
| **Profile** | Name, headline, tagline, bio, photo, CV, citation metrics, all social links |
| **Publications** | Add/edit/remove papers; mark "Featured" to show on the home page |
| **Peer Reviews** | Journals reviewed for (the Elsevier reviewer highlight) |
| **Certifications** | Courses, training, conference presentations & recognitions |
| **Research Areas** | The cards on the home & research pages (with icon choice) |
| **Education / Experience** | Timeline entries on the About page |
| **Skills** | Grouped skill chips (comma-separated) |
| **Awards** | Honors and scholarships |
| **Messages** | Enquiries from the contact form |

**Updating citation metrics:** edit them on the **Profile** page (Scholar doesn't
provide a free live API). Takes 10 seconds whenever they change.

---

## 🎨 Customising the look

- **Colors / fonts:** [`tailwind.config.ts`](tailwind.config.ts) (palette) and
  [`src/app/layout.tsx`](src/app/layout.tsx) (Google Fonts: Inter + Fraunces).
- **Global styles:** [`src/app/globals.css`](src/app/globals.css).
- **Fallback content** (copied into the database on first run, and shown if the database is unreachable):
  [`src/lib/static-data.ts`](src/lib/static-data.ts).

---

## 🔒 Security notes

- The admin password and database URI live only in server-side environment variables;
  nothing secret is sent to the browser.
- Login sets an **httpOnly, signed (HS256) cookie** valid for 7 days. After 5 wrong
  attempts from the same IP there is a 60-second lockout.
- `/dashboard` and every `/api/admin/*` route check the session (in middleware *and*
  in the route itself).
- All writes are filtered against a per-collection field whitelist
  (`src/lib/server/collections.ts`), so arbitrary fields and Mongo operators are dropped.
- Uploads: images (PNG/JPG/WEBP/GIF) and PDF only, max 4 MB.
- The contact form has length limits and a hidden honeypot field against spam bots.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run backup` | Download a full JSON backup to `backups/` |
| `npm run import:supabase` | One-time copy of the old Supabase data into MongoDB |

---

Built with care for a researcher's first impression. Good luck, Rifat! 🔬
