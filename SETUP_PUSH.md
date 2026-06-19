# Notifications Setup (free, no credit card)

You'll get three kinds of notifications:
- 📌 **New task assigned to you** (within ~20 min)
- ✅ **Your task was completed** — tells the person who created it (within ~20 min)
- ☀️ **Daily 6am** morning task list

We use **GitHub Actions** (free) to send them. Four parts:
**(1) notification key, (2) service account, (3) GitHub repo + secret, (4) everyone taps 🔔.**

---

## PART 1 — Notification key (VAPID) — 2 min
1. **https://console.firebase.google.com** → your **family-task** project.
2. ⚙️ **Project settings** → tab **Cloud Messaging** → **Web Push certificates** → **Generate key pair**.
3. Copy the key → **paste it to me in chat** (I'll put it in the app), or edit `index.html`:
   ```js
   const VAPID_KEY = "PASTE_VAPID_KEY";
   ```
4. Re-deploy to Netlify (drag the `publish` folder).

## PART 2 — Service account — 2 min
1. **Project settings** → tab **Service accounts** → **Generate new private key** → a **.json** downloads.
2. Keep it private (it's like a password — goes into a GitHub *secret*, never into code).

## PART 3 — GitHub (the free sender) — 12 min
1. Sign up at **https://github.com** (free).
2. **New repository** → name `family-tasks` → **Public** (public repos get unlimited free Actions minutes) → **Create**.
3. **Add file → Upload files** → drag in the **`push`** folder → **Commit**.
4. Create the two schedules:
   - **Add file → Create new file**, name: `.github/workflows/morning.yml`, paste our `morning.yml` contents → Commit.
   - **Add file → Create new file**, name: `.github/workflows/notify.yml`, paste our `notify.yml` contents → Commit.
5. **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `FIREBASE_SA`
   - Value: paste the entire contents of the `.json` from Part 2 → **Add secret**.
6. **Actions** tab → enable workflows if asked. Click **Event Notifier → Run workflow** to test, and **Morning Task Push → Run workflow** to test.

> Prefer git over the web uploads? Ask me and I'll give you the exact commands.

## PART 4 — Everyone turns on alerts
On each phone: open the app → log in → tap the **🔔 bell** (top bar) → **Allow**.
- **Android:** works in Chrome and the installed app.
- **iPhone:** Add to Home Screen first, open from there, then tap 🔔 (iOS 16.4+).

---

## How it runs
- **Event Notifier** runs every ~20 min: finds tasks newly assigned (→ alerts the assignee) and tasks newly completed (→ alerts the creator). It marks each task so nobody gets the same alert twice.
- **Morning Task Push** runs daily at 6am IST with each person's task list.
- GitHub's free scheduler can run a few minutes late — fine here. If the repo is untouched for 60 days, GitHub pauses schedules; one manual "Run workflow" re-arms them.

## Note on the APK
The PWABuilder APK (Android) supports these web-push notifications. Make the APK from the live Netlify link as in `MAKE_APK.md` after Part 1 is deployed.
