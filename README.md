# Vort — מערכת דיווח שעות עבודה

A simple, mobile-first employee time-tracking app.
Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase (Auth + DB).
Styled with the **Vort Brand Design Language v1.0**.

**Bilingual:** defaults to **English (LTR)** with a one-click toggle to
**Hebrew (RTL)** — the whole UI, including text direction, flips. The choice is
remembered in a cookie.

- **Everyone** logs hours (date, 24-hour start/end via HH:MM pickers,
  description), sees daily/monthly totals, and has a **"My reports"** tab to
  review any month's entries. Overlaps and future dates are rejected.
- **Admins** get all of that **plus** an **"All reports"** view of every
  employee's entries with filters (name / date range / role) and CSV export,
  and a **Users** screen to create accounts.
- **No public sign-up.** Only an admin creates accounts.

---

**User creation works entirely inside the app** — the admin's **Users** screen
creates accounts (email + password + role) via a secure, admin-only database
function (`admin_create_user`). No service-role key required; the browser only
uses the public anon key.

Follow the setup below to point it at your own Supabase project, then create
the first admin.

---

## Deploy — GitHub Pages

Live URL: **https://benihai.github.io/vort-time-tracking/**

The app is a **static client-side build** (Next.js `output: 'export'`) that
talks to Supabase directly from the browser. It deploys to GitHub Pages
automatically via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
on every push to `main`.

How it's wired:

- **Pages source:** GitHub Actions (Settings → Pages → Build: GitHub Actions).
- **Build-time config:** the two public Supabase values are stored as repo
  **Actions Variables** (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and baked into the bundle. They are safe to
  ship publicly — data is protected by Supabase **Row Level Security**.
- **basePath:** the site lives under `/vort-time-tracking`, set in
  [`next.config.js`](next.config.js).

No extra Supabase config is needed — the app uses email/password auth (no
redirect URLs), and Supabase's API accepts requests from any origin.

> Trade-off vs. a server host: there's no server-side route protection (RLS
> still fully protects the data), and the anon key ships in the client bundle
> (by design in Supabase).

---

## 1. Prerequisites

- Node.js 18.17+ and npm.
- A free [Supabase](https://supabase.com) project.

## 2. Install

```bash
npm install
```

## 3. Create the Supabase project & schema

1. Create a project at https://supabase.com.
2. Open **SQL Editor → New query** and run each migration in
   [`supabase/migrations/`](supabase/migrations/) in order (`0001` … `0003`).
   These create the `profiles` and `time_logs` tables, RLS policies, the
   no-overlap exclusion constraint, the future-date guard, the auto-profile
   trigger, and the admin-only `admin_create_user()` function.
3. **(Optional) Disable public sign-ups:** Dashboard → **Authentication →
   Providers → Email**, turn **off** "Enable Sign-ups". The app has no sign-up
   UI, and this also closes the direct GoTrue signup endpoint.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill in the two public values from
**Project Settings → API**:

```bash
cp .env.example .env.local
```

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public | public |

> No service-role key is needed. Admin user creation runs through a
> `SECURITY DEFINER` database function that is gated on the caller being an
> admin, so the browser only ever uses the public anon key.

## 5. Create the first admin

There's no admin yet to create the first one, so bootstrap one manually:

1. Dashboard → **Authentication → Users → Add user**. Enter an email + password
   and enable **Auto Confirm User**. (The trigger creates a matching profile.)
2. Promote it to admin — **SQL Editor**, replace the email, run:

   ```sql
   update public.profiles
   set role = 'admin', full_name = 'שם המנהל'
   where id = (select id from auth.users where email = 'admin@example.com');
   ```

From now on, that admin creates all other users inside the app at `/admin/users`.

## 6. Run

```bash
npm run dev
```

Open http://localhost:3000 and sign in as the admin.

---

## Project structure

```
app/
  layout.tsx                    RTL <html>, fonts, Vort tokens
  globals.css                   Vort CSS token reference (§14)
  page.tsx                      redirect to role home
  login/page.tsx                email + password sign-in
  dashboard/                    employee: log form + summaries
  admin/                        admin: timesheet + filters + CSV
  admin/users/                  admin: create users / assign roles
  api/admin/create-user/        server route using the service-role key
components/ui/                   Button, Input, Textarea, Card, Badge, Field
components/                      LogForm, LogsTable, Filters, CreateUserForm, ...
lib/supabase/                    browser / server / admin / middleware clients
lib/                            types, csv, time helpers
supabase/migrations/            0001_init.sql
```

## Validation & security notes

- **No overlaps:** guaranteed at the database via a GiST exclusion constraint —
  impossible even under concurrent requests. Also pre-checked in the server
  action for a friendly Hebrew message.
- **No future dates:** enforced by a DB trigger, the server action, and a native
  `max` on the date input.
- **RLS:** employees can read/write only their own logs; admins can read all.
  Policies use a `SECURITY DEFINER` `is_admin()` helper to avoid recursion.
- **Roles** live in `public.profiles`; the app reads them server-side on every
  protected route via `middleware.ts` + server components.
