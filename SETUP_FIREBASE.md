# Phase 2 — Cloud Setup (one time, ~10 minutes)

This makes all 5 phones share the same tasks. It's **free** for a family.
Do it once. Until you finish, the app keeps working in "💾 Local" mode (data on one device only).

---

## Part A — Create the free Firebase database

1. Open **https://console.firebase.google.com** and sign in with your Google account (gokulam1996@gmail.com).
2. Click **"Create a project"** (or "Add project").
   - Name it: **family-tasks** → Continue.
   - Google Analytics: you can **turn it off** → Continue → **Create project** → wait → Continue.
3. On the left menu click **Build → Firestore Database**.
   - Click **Create database**.
   - Choose **Start in test mode** → Next.
   - Location: pick **asia-south1 (Mumbai)** (closest to India) → **Enable**.
   - (Test mode lets the family read/write freely for 30 days — perfect for our 2–3 day trial. We'll lock it down later.)

## Part B — Get your keys

4. Click the **⚙️ gear icon** (top-left, next to "Project Overview") → **Project settings**.
5. Scroll down to **"Your apps"** → click the **web icon `</>`**.
   - App nickname: **family-tasks-web** → **Register app**.
   - You'll see a code box with **`const firebaseConfig = { ... }`**.
   - **Copy those 6 values** (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

## Part C — Paste the keys into the app

6. Open **index.html**, find this block near the top of the script:

```js
const firebaseConfig = {
  apiKey: "PASTE_apiKey",
  ...
};
```

7. Replace each `PASTE_...` with your real value (keep the quotes). Example:

```js
const firebaseConfig = {
  apiKey: "AIzaSyB....xyz",
  authDomain: "family-tasks.firebaseapp.com",
  projectId: "family-tasks",
  storageBucket: "family-tasks.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

8. Save the file and refresh the app. The header badge should change from **💾 Local** to **🟢 Synced**.

> 👉 **Easiest option:** just paste the whole `firebaseConfig = { ... }` block you copied into our chat, and I'll put it into the file for you.

---

## Part D — Put it on the 5 phones (HTTPS link)

The app needs an https web address so phones can open it (and so the mic works).
Easiest free way, no installs:

1. Go to **https://app.netlify.com/drop**
2. **Drag the whole "Daily task" folder** onto that page.
3. It gives you a link like `https://family-tasks-xyz.netlify.app`.
4. Open that link on each phone → browser menu → **"Add to Home Screen"**.
   Now everyone has the icon and shares the same tasks.

(When we make changes during the trial, I re-give you the file and you drag it onto Netlify again to update.)

---

## Notes for the trial
- **Offline works:** the app caches tasks; changes sync when internet returns.
- **PINs:** GK 1111 · Diana 2222 · Mohan 3333 · Saras 4444 · Divya 5555 (change in `MEMBERS` in index.html).
- After 2–3 days of real use, tell me the bugs / changes and I'll fix, then we lock down security (Part: proper rules) and make it a full installable PWA (Phase 3).
