# Family Task App — Plan & Spec

_Last updated: 2026-06-14_

A simple, shared task app for the whole family (Dad, Mom, Me, Wife, Sister).
Installable on every phone like a normal app, with shared live data, voice
input in Tamil or English, priorities, and a smart "morning list".

---

## 1. What we decided

| Decision | Choice |
|---|---|
| App type | **Installable web app (PWA)** — open a link once, "Add to Home Screen", gets its own icon. Works offline. Can be wrapped into a real `.apk` later if ever needed. |
| Voice / language | **Speak in Tamil or English; store exactly what was said** (no translation, no cost, accurate). |
| First step | **This plan first**, then build. |

---

## 2. Who can do what (roles)

- **Admin (you)** — can see *everything*: all personal tasks, all common tasks, everyone's progress. Can add/edit/delete any task and manage family members.
- **Member (Dad, Mom, Wife, Sister)** — can:
  - Create tasks for themselves.
  - Assign a task to any other family member.
  - Create/see **common** tasks (e.g. "buy eggs", "ration shop").
  - See their own tasks + common tasks + tasks they assigned to others.
  - Mark tasks done.

> Privacy note: by default members see *common* tasks and *their own*. Admin sees all. We can loosen this later (e.g. "everyone sees everything") with one setting if you prefer.

---

## 3. Core features

1. **Tasks** with:
   - Title (typed or **spoken**)
   - Type: **Common** (whole family) or **Personal** (one person)
   - Assigned to: which family member
   - Created by: who added it
   - **Priority**: High / Medium / Low
   - **Severity**: Critical / Normal / Minor (how serious if missed — e.g. birth certificate = Critical)
   - Due date (optional)
   - Status: **To-Do / Done**
   - Notes (optional)
2. **Speech-to-text** — tap mic, speak Tamil or English, it becomes the task text. (Uses the phone browser's built-in voice recognition — free.)
3. **Morning smart list** — each morning the app shows a ranked list:
   *today's + overdue pending tasks, sorted by Priority then Severity then how overdue.*
   So the important things surface first, even if you forget.
4. **Done / To-Do memory** — nothing is lost. Done tasks are kept (with date completed) so you can look back. Recurring ones (ration shop every month) can repeat.
5. **Notifications (later phase)** — a morning reminder push so you see the list without opening the app.
6. **Mild, calm theme** — soft colours, large readable text, big mic button. Tamil + English labels.

### Nice additions I'd suggest (you didn't mention)
- **Recurring tasks** — "ration shop" = monthly, "mop home" = daily/alternate. Auto-reappears so you never re-add it.
- **Reminders/alarms** for time-sensitive ones (bank, appointments).
- **Quick templates** — one-tap common items (eggs, milk, vegetables).
- **"For baby" / "For parents" tags** — filter tasks by who they're about (baby's certificate, parents' medicines).
- **Simple checklist sharing** — mark "buying" so two people don't buy the same eggs.

---

## 4. How data is stored (the "memory")

Everything lives in **Firebase (Firestore)** — Google's free cloud database.
For a family of 5 this stays **completely free**.

Two collections (think of them as two notebooks):

**`users`**
```
{ id, name, role: "admin" | "member", phoneLabel }
```

**`tasks`**
```
{
  id,
  title,            // the text (Tamil or English, as spoken)
  type,             // "common" | "personal"
  assignedTo,       // user id (or "all" for common)
  createdBy,        // user id
  priority,         // "high" | "medium" | "low"
  severity,         // "critical" | "normal" | "minor"
  dueDate,          // optional
  status,           // "todo" | "done"
  completedAt,      // when marked done
  recurring,        // none | daily | weekly | monthly
  createdAt
}
```

- All phones read/write this same database, so everyone sees updates live.
- Works offline too: changes save on the phone and sync when internet returns.
- The morning list is just a filtered, sorted query on `tasks`.

---

## 5. Technology (kept simple & free)

- **Frontend:** React + Vite (a fast modern web app), styled mild/calm.
- **PWA:** installable + offline (service worker).
- **Database/Login:** Firebase Firestore + Firebase Auth (free tier).
- **Voice:** browser Web Speech API (`ta-IN` for Tamil, `en-IN` for English) — free, on-device.
- **Hosting:** Firebase Hosting (free) — gives one link to install on all 5 phones.
- **APK (optional, later):** wrap the PWA with PWABuilder/Bubblewrap into a `.apk`.

---

## 6. Build phases

**Phase 1 — Prototype (no cloud yet)**
Working app in the browser: add/list tasks, common vs personal, priority, severity, done/to-do, mic voice input, morning list. Data saved on the one device.

**Phase 2 — Family accounts + cloud sync**
Add Firebase: simple login, 5 family members, roles (admin/member), live shared data across phones.

**Phase 3 — Make it an installable app (PWA)**
Add icon, offline support, "Add to Home Screen". Share the link → install on all 5 phones.

**Phase 4 — Polish**
Recurring tasks, morning push notification, templates, Tamil labels, theme refinement.

**Phase 5 (optional) — Real APK**
Wrap the PWA into a `.apk` if you still want a downloadable file.

---

## 7. What I'll need from you (only when we reach Phase 2)

- A free Google/Firebase account (I'll guide you step by step — about 10 minutes).
- The 5 family member names.
That's it. Phase 1 needs nothing from you.

---

## 8. Open questions for later
- Should members see *everyone's* personal tasks, or only common + their own? (Default: common + own; admin sees all.)
- Do you want a 4-digit PIN per person, or full email login? (PIN is simpler for parents.)
- Morning list time (e.g. 7:00 AM)?
