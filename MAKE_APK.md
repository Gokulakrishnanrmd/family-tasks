# How to get the installable .APK

The app is now a full PWA (manifest + icon + service worker). To turn it into a
real `.apk` you can sideload, we use **PWABuilder** (free, cloud — no Android Studio needed).

There are **two steps**: (1) put the app online, (2) generate the APK from that link.

---

## Step 1 — Put the app online (free, ~2 min)

1. Open **https://app.netlify.com/drop**
2. In File Explorer open the **`publish`** folder (inside "Daily task").
3. **Drag the `publish` folder** onto the Netlify Drop box.
4. You get a link like **`https://abc123.netlify.app`**.
   - (Sign in with Google to keep it permanent; you can rename the site to e.g. `gk-family-tasks` in Site settings → Change site name.)
5. Open the link once on your computer to confirm the app loads and shows **🟢 Synced**.

---

## Step 2 — Generate the APK with PWABuilder (~5 min)

1. Open **https://www.pwabuilder.com**
2. Paste your Netlify link in the box → **Start** / **Analyze**.
   - It will show green checks for Manifest, Service Worker, and Icons. ✅
3. Click **Package for stores** → choose the **Android** card.
4. Click **Generate Package**.
   - In the options, the simplest is to keep defaults. Under signing, choose
     **"Use a new signing key"** (PWABuilder makes one and includes it in the zip — keep the zip safe).
5. Download the **`.zip`**. Inside you'll find:
   - **`app-release-signed.apk`**  ← this is the file to install on phones.
   - a `signing.keystore` + a `assetlinks` file — keep these (needed for future updates / Play Store).

---

## Step 3 — Install the APK on a phone

1. Copy `app-release-signed.apk` to the phone (WhatsApp to yourself, USB, or Google Drive).
2. Tap it on the phone → Android asks to allow **"Install unknown apps"** for that app (Files/Chrome) → allow → Install.
3. Open **Family Tasks** from the app drawer. Everyone logs in with their PIN.

> Note: a PWABuilder Android app is a **Trusted Web Activity** — it loads your Netlify
> link inside a real app shell. So the phone needs internet the first time; after that
> the service worker caches it and basic use works offline. Keep the Netlify link alive.

---

## Updating later
When I make changes during the trial:
1. I update the files → you re-drag the `publish` folder onto Netlify (same site = "Deploys" → drag to update).
2. The installed APK auto-loads the new version (no re-install needed, since it loads the live link).
   You only re-make the APK if the icon/name/manifest changes.

---

### Don't want an APK after all?
You don't actually need the APK to use it — after Step 1, just open the Netlify link
on each phone → browser menu → **"Add to Home Screen"**. That gives an app icon that
opens fullscreen, looks and works like an installed app. The APK is only nicer if you
want a true installable file / future Play Store listing.
