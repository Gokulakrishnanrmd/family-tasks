/* Sends notifications for: (1) a task newly assigned to someone, (2) a task marked done (tells the creator).
   Runs every ~20 min from GitHub Actions. Dedupes using flags written back to each task doc.
   Needs env SA_JSON (Firebase service account JSON). */
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.SA_JSON)) });
const db = admin.firestore();

const NAMES = { gk: 'GK', diana: 'Diana', mohan: 'Mohan', saras: 'Saras', divya: 'Divya' };
const nameOf = id => NAMES[id] || 'Someone';

async function tokensFor(userId) {
  const snap = await db.collection('pushTokens').where('userId', '==', userId).get();
  return snap.docs.map(d => d.data().token);
}

async function notify(userId, title, body) {
  const tokens = await tokensFor(userId);
  if (!tokens.length) return 0;
  const res = await admin.messaging().sendEachForMulticast({ tokens, notification: { title, body } });
  res.responses.forEach((r, i) => {
    if (!r.success && /not-registered|invalid-argument/.test((r.error && r.error.code) || '')) {
      db.collection('pushTokens').doc(tokens[i]).delete().catch(() => {});
    }
  });
  return res.successCount;
}

async function main() {
  const tasks = (await db.collection('tasks').get()).docs.map(d => ({ id: d.id, ...d.data() }));
  for (const t of tasks) {
    // (1) newly assigned personal task -> notify assignees (except the creator)
    if (!t.notifiedAssign && t.type === 'personal') {
      const recipients = (t.assignees || []).filter(uid => uid !== t.createdBy);
      for (const uid of recipients) {
        await notify(uid, '📌 New task for you', `${t.title}\n— assigned by ${nameOf(t.createdBy)}`);
      }
      await db.collection('tasks').doc(t.id).update({ notifiedAssign: true });
    }
    // (2) task completed -> notify the creator (unless they completed it themselves)
    if (t.status === 'done' && !t.notifiedDone) {
      if (t.completedBy && t.completedBy !== t.createdBy) {
        await notify(t.createdBy, '✅ Task completed', `${nameOf(t.completedBy)} finished: ${t.title}`);
      }
      await db.collection('tasks').doc(t.id).update({ notifiedDone: true });
    }
    // reset done-flag if it was reopened (e.g. recurring) so next completion notifies again
    if (t.status === 'todo' && t.notifiedDone) {
      await db.collection('tasks').doc(t.id).update({ notifiedDone: false });
    }
  }
  console.log('event notifier done');
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
