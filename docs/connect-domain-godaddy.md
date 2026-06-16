# Connecting your GoDaddy domain to Vercel

A plain-English, step-by-step guide. You'll bounce between two browser tabs:
**Vercel** (where the site lives) and **GoDaddy** (where the domain lives).

Total time: ~10 minutes of clicking, then up to a couple hours of waiting for DNS to "propagate."

> **Important:** Domains are **not** configured in any file in this project.
> There's nothing to code. It's all done in the two dashboards below.

---

## Before you start

Have these two tabs open and logged in:

- **Vercel:** https://vercel.com/dashboard → click into the **xndr** project
- **GoDaddy:** https://dcc.godaddy.com/control/portfolio (your domain list)

---

## Step 1 — Tell Vercel about your domain

1. In Vercel, open your **xndr** project.
2. Top menu: click **Settings**.
3. Left sidebar: click **Domains**.
4. In the text box, type your domain (e.g. `yourdomain.com` — no `https://`, no `www`).
5. Click **Add**.

✅ Vercel now shows you a set of **DNS records** to create.
**Keep this screen open** — you'll copy the exact values from here in Step 3.

It will look something like this (your numbers may differ — **always use what YOUR screen shows**):

| Type    | Name  | Value                     |
|---------|-------|---------------------------|
| `A`     | `@`   | `76.76.21.21`             |
| `CNAME` | `www` | `cname.vercel-dns.com`    |

---

## Step 2 — Open the DNS settings in GoDaddy

1. Go to GoDaddy and sign in.
2. Click your name / **profile icon** (top right) → **My Products**.
   - Or go straight to: https://dcc.godaddy.com/control/portfolio
3. Find your domain in the list.
4. Click the **three dots ( ⋯ )** next to it → choose **Edit DNS**.
   - (On some accounts it's a **DNS** button, or **Manage DNS**.)

✅ You're now on the **DNS Management** page. You'll see a table of records.

---

## Step 3 — Add the records GoDaddy needs

You're copying the values **from the Vercel tab (Step 1)** into GoDaddy here.

### 3a. The `A` record (your bare domain, e.g. `yourdomain.com`)

First, **check for an existing `A` record** with Name `@`:
- GoDaddy usually creates a default one pointing at a "parked" page.
- If one exists → click the **pencil / Edit** icon on it and change its value.
- If none exists → click **Add** / **Add New Record**.

Set it to:

| Field | What to enter                                  |
|-------|------------------------------------------------|
| Type  | `A`                                            |
| Name  | `@`                                            |
| Value | the IP Vercel showed you (e.g. `76.76.21.21`)  |
| TTL   | leave default (1 hour) — or `600 seconds`      |

Click **Save**.

### 3b. The `CNAME` record (the `www` version)

- Look for an existing `CNAME` with Name `www`. Edit it if it's there, otherwise **Add** a new one.

Set it to:

| Field | What to enter                                       |
|-------|-----------------------------------------------------|
| Type  | `CNAME`                                             |
| Name  | `www`                                               |
| Value | the value Vercel showed (e.g. `cname.vercel-dns.com`) |
| TTL   | leave default                                       |

Click **Save**.

### 3c. Remove conflicts

- If GoDaddy left a **"Parked"** / **"Forwarding"** record, or any **other `A` record on `@`**, delete it.
- You should end up with **exactly one** `A` record on `@` and **one** `CNAME` on `www`.

---

## Step 4 — Wait, then confirm

1. Go back to the **Vercel** tab → **Settings → Domains**.
2. Refresh. The domain status will change from "Invalid Configuration" to a green
   **"Valid Configuration"** once GoDaddy's changes spread across the internet.
   - This can take **a few minutes up to ~2 hours** (occasionally longer).
3. Vercel **automatically** sets up the HTTPS / SSL certificate — you don't do anything for this. The little padlock appears on its own.

✅ When it's green, visit `https://yourdomain.com` — your site should load.

---

## Step 5 — Pick your "main" address (optional but recommended)

Vercel will list both `yourdomain.com` and `www.yourdomain.com`.

- Click the **⋯** next to the one you want as primary → **Set as Primary Domain**.
- Most people choose the short one: `yourdomain.com`.
- Vercel then auto-redirects the other one to it, so both links always work.

---

## Quick troubleshooting

| Problem                                   | Fix                                                                 |
|-------------------------------------------|---------------------------------------------------------------------|
| Still "Invalid Configuration" after hours | Re-check the `A`/`CNAME` values match Vercel **exactly**. Typos are the #1 cause. |
| Site loads on `www` but not bare domain   | Your `A` record on `@` is missing or wrong.                         |
| Bare domain works, `www` doesn't          | Your `CNAME` on `www` is missing or wrong.                          |
| "Too many redirects"                      | Make sure you only set one primary domain in Vercel (Step 5).       |
| Old parking page still shows              | A leftover GoDaddy `A`/forwarding record — delete it (Step 3c). DNS may also just be cached; wait. |

---

## Cheat sheet

1. **Vercel:** Project → Settings → Domains → add domain → copy the records it gives you.
2. **GoDaddy:** Domain → ⋯ → Edit DNS → add/edit the `A` (`@`) and `CNAME` (`www`) records.
3. **Delete** any leftover GoDaddy parking records.
4. **Wait** for Vercel to go green; SSL is automatic.
5. **Set primary** domain in Vercel.
