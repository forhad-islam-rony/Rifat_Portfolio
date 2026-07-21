# Rifat Rafiu — Research Portfolio & Dashboard

A professional research portfolio for **Rifat Rafiu** (Materials Science & Engineering, KUET)
with a password-protected **dashboard** to manage every piece of content — publications,
profile, metrics, research areas, education, experience, skills, awards, and contact
messages — **without touching any code.**

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **Supabase**
(database + auth + file storage). Deployable to **Netlify** in a few clicks.

> The site ships with real seeded content and works **out of the box** even before
> Supabase is connected (it falls back to bundled data). Connect Supabase to unlock
> the live dashboard.

---

## ✨ Features

**Portfolio (public)**
- Elegant "modern academic" design — serif headings, navy/teal palette, animated crystal-lattice motif
- Home with hero, live citation metrics, research focus and featured publications
- About page: bio, education, experience timeline, skills, awards
- Research page: focus areas, theory-to-device methodology, current project
- Publications page: searchable & filterable list (by year, type, sort by citations)
- Contact page with a working form that saves messages to your dashboard
- Fully responsive, SEO-friendly, fast

**Dashboard (private, login-protected)**
- Overview with counts and unread-message badge
- Edit profile, bio, metrics and social links (Scholar, ResearchGate, LinkedIn, Facebook…)
- Upload profile photo and CV (PDF) to Supabase Storage
- Full add/edit/delete for publications, research areas, **peer reviews**, **certifications**, education, experience, skills, awards
- Messages inbox with read/unread and one-click reply

**Design** — a custom dark "Graphite Lab" theme (deep graphite, molten-amber + reactor-cyan accents, Space Grotesk + JetBrains Mono type) with animated counters, a scroll-progress bar, a venue marquee, spotlight-hover cards and a crystal-lattice motif.

---

## 🗂 Project structure

```
src/
├── app/
│   ├── (site)/              # Public portfolio (grouped route)
│   │   ├── layout.tsx       # Navbar + Footer
│   │   ├── page.tsx         # Home
│   │   ├── about/
│   │   ├── research/
│   │   ├── publications/
│   │   └── contact/
│   ├── dashboard/           # Protected admin area
│   │   ├── layout.tsx       # Auth guard + sidebar
│   │   ├── page.tsx         # Overview
│   │   ├── profile/  publications/  research/
│   │   ├── education/ experience/  skills/  awards/  messages/
│   ├── login/               # Dashboard sign-in
│   ├── layout.tsx           # Root (fonts, metadata)
│   └── globals.css
├── components/
│   ├── site/                # Portfolio components
│   └── dashboard/           # Dashboard components
├── lib/
│   ├── data.ts              # Data access (Supabase + static fallback)
│   ├── static-data.ts       # Seeded fallback content
│   ├── types.ts
│   └── supabase/            # Client / server / middleware helpers
└── middleware.ts            # Session refresh + /dashboard guard
supabase/
├── schema.sql               # Tables, RLS policies, storage buckets
└── seed.sql                 # Real profile + publication data
```

---

## 🚀 Quick start (local)

**Prerequisites:** Node.js 18+ (20+ recommended) and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The portfolio renders immediately using the bundled
seed data. To enable the dashboard, connect Supabase below.

---

## 🔌 Connect Supabase (5 minutes)

### 1. Create a project
1. Go to <https://supabase.com> → **New project** (the free tier is plenty).
2. Choose a name and a strong database password; wait ~1 minute for it to provision.

### 2. Create the database
1. In Supabase, open **SQL Editor → New query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. New query again → paste [`supabase/seed.sql`](supabase/seed.sql) → **Run**.
   This fills the database with the real profile and 20 publications.

### 3. Create the admin (login) user
1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter Rifat's email and a password. **Tick "Auto Confirm User"** so it can log in immediately.
3. (Recommended) Under **Authentication → Providers → Email**, turn **off**
   "Allow new users to sign up" so nobody else can register.

### 4. Get the API keys
1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.

### 5. Add environment variables
Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart `npm run dev`. Visit <http://localhost:3000/login> and sign in with the user
from step 3. You now manage everything from the dashboard. 🎉

---

## ☁️ Deploy to Netlify

1. Push this project to a **GitHub** repository.
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
3. Build settings are auto-detected from [`netlify.toml`](netlify.toml)
   (build `npm run build`, the official Next.js plugin handles the rest).
4. Under **Site settings → Environment variables**, add the same three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your final Netlify URL (e.g. `https://rifat-rafiu.netlify.app`)
5. Deploy. Add a custom domain later under **Domain settings** if desired.

> Works the same on **Vercel** — import the repo and add the env vars.

## ☁️ Deploy to Vercel

1. Push this project to a **GitHub** repository.
2. In Vercel, go to **Add New... → Project** and import the repository.
3. Vercel auto-detects this as a Next.js app, so the build settings are handled automatically.
4. Under **Project Settings → Environment Variables**, add these values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your final Vercel URL (for example, `https://your-project.vercel.app`)
5. Click **Deploy**.

> Vercel is the recommended deployment target for this Next.js app.

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
- **Fallback content** (used before Supabase is connected):
  [`src/lib/static-data.ts`](src/lib/static-data.ts).

---

## 🔒 Security notes

- The `anon` key is safe to expose in the browser — the database is protected by
  **Row Level Security**: the public can only *read* portfolio content and *submit*
  contact messages; only the authenticated admin can write.
- The `/dashboard` route is guarded both by middleware and a server-side check.
- Keep "Allow new users to sign up" disabled in Supabase so only you have an account.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint the project |

---

Built with care for a researcher's first impression. Good luck, Rifat! 🔬
