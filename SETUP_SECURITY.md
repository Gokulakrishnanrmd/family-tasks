# Lock down the database (do these IN ORDER — ~5 min)

The app now signs in **anonymously** so the database can require authentication and
block strangers. Follow this order so the app never breaks during the switch.

---

## STEP 1 — Enable Anonymous sign-in  (DO THIS FIRST)
1. **https://console.firebase.google.com** → **family-task** project.
2. Left menu → **Build → Authentication** → **Get started** (if first time).
3. **Sign-in method** tab → click **Anonymous** → toggle **Enable** → **Save**.

> Until this is on, the v2.0 app shows "🔴 Sign-in" and no tasks. So this comes first.

## STEP 2 — Update everyone to v2.0
- **Web/home-screen:** drag the `publish` folder onto Netlify.
- **APK:** install the new `FamilyTasks.apk` on each phone (over the old one).
- Open the app — the badge should now show **🟢 Synced** (tasks load as normal).
  (At this point the database is still open, but every app is now signing in.)

## STEP 3 — Publish the security rules  (DO THIS LAST)
1. Firebase console → **Build → Firestore Database** → **Rules** tab.
2. Delete what's there and paste the contents of **`firestore.rules`** (in this folder):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /tasks/{taskId}      { allow read, write: if request.auth != null; }
       match /pushTokens/{tokenId}{ allow read, write: if request.auth != null; }
     }
   }
   ```
3. Click **Publish**.

Done. Now only your app (signed-in users) can read/write — random visitors are blocked,
and the 30-day test-mode expiry is gone.

---

## What this protects (and what it doesn't)
- ✅ Blocks anonymous internet scripts/crawlers from reading or trashing your data.
- ✅ Removes the test-mode auto-expiry that would have broken the app.
- ✅ Your GitHub sender keeps working (it uses the admin service account, which bypasses rules).
- ⚠️ Honest limit: anyone with your public config *could* also do an anonymous sign-in.
  For a private family app with an obscure project this is a fine, standard level.
  If you ever go commercial/public, upgrade to real per-user login + App Check (later phase).

## If something looks wrong
- App stuck on "🔴 Sign-in" → Step 1 not done (or not saved).
- Tasks vanish after Step 3 → an app instance is still on the old version; reload/reinstall v2.0.
