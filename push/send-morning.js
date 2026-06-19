/* Sends each family member their personalized morning task list via FCM.
   Runs daily from GitHub Actions at 6am IST. Needs env SA_JSON (Firebase service account JSON). */
const admin = require('firebase-admin');

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.SA_JSON)) });
const db = admin.firestore();

// today's date in IST (YYYY-MM-DD)
function istToday() {
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  return ist.toISOString().slice(0, 10);
}

async function main() {
  const today = istToday();
  const tasks = (await db.collection('tasks').get()).docs.map(d => ({ id: d.id, ...d.data() }));
  const tokenDocs = (await db.collection('pushTokens').get()).docs.map(d => d.data());

  // group tokens by user
  const byUser = {};
  tokenDocs.forEach(t => { (byUser[t.userId] = byUser[t.userId] || []).push(t.token); });

  for (const userId of Object.keys(byUser)) {
    // a user's "today" list: their personal + common tasks, still to-do, due today/overdue or daily routines
    const mine = tasks.filter(t =>
      t.status === 'todo' &&
      (t.type === 'common' || (t.assignees || []).includes(userId)) &&
      (t.dueDate ? t.dueDate <= today : (t.repeat || 'none') === 'daily')
    );
    const count = mine.length;
    const body = count
      ? mine.slice(0, 6).map(t => '• ' + (t.title || '')).join('\n') + (count > 6 ? `\n…and ${count - 6} more` : '')
      : 'No tasks for today 🌿 Have a calm day.';

    const tokens = byUser[userId];
    try {
      const res = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title: `☀️ Good morning — ${count} task${count === 1 ? '' : 's'} today`, body }
      });
      // clean up dead tokens
      res.responses.forEach((r, i) => {
        if (!r.success && r.error && /registration-token-not-registered|invalid-argument/.test(r.error.code || '')) {
          db.collection('pushTokens').doc(tokens[i]).delete().catch(() => {});
        }
      });
      console.log(`${userId}: sent ${res.successCount}/${tokens.length} (${count} tasks)`);
    } catch (e) {
      console.error(`${userId}: send failed`, e.message);
    }
  }
  console.log('Done for', today);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
