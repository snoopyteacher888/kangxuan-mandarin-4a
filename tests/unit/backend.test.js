const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../../backend/Code.gs');

const rec = (o = {}) => Object.assign({ id: 'r1', ts: '2026-10-21T11:00:00.000Z', student: 'bear', place: 'home', lesson: 'L06', activity: 'quiz',
  items: [{ q: 'q1', result: 'first', wrong: [] }], firstTryRate: 1, score: null, stars: 3, durationSec: 60 }, o);

test('valid record passes', () => { assert.equal(B.validateRecord(rec()), null); });
test('invalid activity rejected', () => { assert.ok(B.validateRecord(rec({ activity: 'x<script>' }))); });
test('long student rejected', () => { assert.ok(B.validateRecord(rec({ student: 'x'.repeat(21) }))); });
test('too many items rejected', () => { assert.ok(B.validateRecord(rec({ items: new Array(51).fill({ q: 'q1', result: 'first', wrong: [] }) }))); });
test('missing id rejected', () => { assert.ok(B.validateRecord(rec({ id: '' }))); });

test('locks after 5 failures for 15 minutes', () => {
  let p = { fails: 0, lockedUntil: 0 }; const now = 1000000;
  for (let i = 0; i < 4; i++) p = B.registerFail(p, now);
  assert.equal(B.lockState(p, now).locked, false);
  p = B.registerFail(p, now);
  assert.equal(B.lockState(p, now).locked, true);
  assert.equal(B.lockState(p, now + 15 * 60 * 1000 - 1).locked, true);
  assert.equal(B.lockState(p, now + 15 * 60 * 1000).locked, false);
});

function fakeSheet() { const rows = []; return { rows, ids: () => rows.map(r => r[0]), append: r => rows.push(r) }; }
test('submit is idempotent by id', () => {
  const s = fakeSheet();
  assert.deepEqual(B.submitRecord(s, rec()), { ok: true });
  assert.deepEqual(B.submitRecord(s, rec()), { ok: true, dup: true });
  assert.equal(s.rows.length, 1);
});
test('row round trip', () => { assert.deepEqual(B.fromRow(B.toRow(rec())), rec()); });

test('filterRecords by student, activity, since', () => {
  const rows = [rec({ id: 'a', ts: '2026-10-01T00:00:00Z' }), rec({ id: 'b', student: 'cat' }), rec({ id: 'c', activity: 'map' })];
  assert.deepEqual(B.filterRecords(rows, { student: 'bear' }).map(r => r.id).sort(), ['a', 'c']);
  assert.deepEqual(B.filterRecords(rows, { activity: 'map' }).map(r => r.id), ['c']);
  assert.deepEqual(B.filterRecords(rows, { since: '2026-10-20T00:00:00Z' }).map(r => r.id).sort(), ['b', 'c']);
});
test('validateRoster', () => {
  assert.equal(B.validateRoster([{ id: 'bear', emoji: '🐻', name: '小熊' }]), null);
  assert.ok(B.validateRoster([{ id: 'Bad Id!', emoji: '🐻', name: '小熊' }]));
  assert.ok(B.validateRoster([{ id: 'a', emoji: '🐻', name: 'x' }, { id: 'a', emoji: '🐱', name: 'y' }]));
});
test('any lowercase activity accepted', () => { assert.equal(B.validateRecord(rec({ activity: 'hanzi' })), null); });
test('activity with symbols rejected', () => { assert.ok(B.validateRecord(rec({ activity: 'Han-zi' }))); assert.ok(B.validateRecord(rec({ activity: 'a' }))); });

const sp = (o = {}) => Object.assign({ id: 'sp1', ts: '2026-10-23T01:00:00.000Z', student: 'bear', place: 'school', lesson: 'L06', activity: 'pattern',
  qid: 'pt-zy-w1', prompt: '用「只要……就……」說一句話', said: '只要我練習就會進步', status: 'pending' }, o);
test('speech record validated', () => {
  assert.equal(B.validateSpeech(sp()), null);
  assert.ok(B.validateSpeech(sp({ said: '' })));
  assert.ok(B.validateSpeech(sp({ said: 'x'.repeat(201) })));
  assert.ok(B.validateSpeech(sp({ status: 'ok' })));
  assert.ok(B.validateSpeech(sp({ qid: '' })));
  assert.equal(B.validateSpeech(sp({ status: 'auto' })), null);
});
test('speech row round trip', () => {
  const r = B.speechFromRow(B.speechToRow(sp()));
  assert.equal(r.said, '只要我練習就會進步'); assert.equal(r.teacherNote, ''); assert.equal(r.status, 'pending');
});
test('grade sets status note and time', () => {
  const r = B.applyGrade(B.speechFromRow(B.speechToRow(sp())), { grade: 'ok', note: '很棒！' }, '2026-10-23T02:00:00.000Z');
  assert.equal(r.status, 'ok'); assert.equal(r.teacherNote, '很棒！'); assert.equal(r.gradedAt, '2026-10-23T02:00:00.000Z');
});
test('grade rejects unknown grade', () => {
  assert.equal(B.applyGrade(sp(), { grade: 'auto', note: '' }, 'x'), null);
  assert.equal(B.applyGrade(sp(), { grade: 'ok', note: 'x'.repeat(101) }, 'x'), null);
});
test('filter speech by student and status', () => {
  const rows = [sp(), sp({ id: 'sp2', student: 'cat' }), sp({ id: 'sp3', status: 'ok' })];
  assert.deepEqual(B.filterSpeech(rows, { student: 'bear', status: 'pending' }).map(r => r.id), ['sp1']);
  assert.equal(B.filterSpeech(rows, {}).length, 3);
});
test('feedback returns only that student without names', () => {
  const rows = [sp({ status: 'ok', teacherNote: '好' }), sp({ id: 'sp2', student: 'cat', status: 'ok' }), sp({ id: 'sp3' }), sp({ id: 'sp4', status: 'redo' })];
  const f = B.feedbackFor(rows, 'bear');
  assert.deepEqual(f.map(x => x.id), ['sp1', 'sp4']);
  f.forEach(x => { assert.ok(!('student' in x)); assert.ok(!('name' in x)); });
  assert.equal(f[0].teacherNote, '好');
});
test('speech row escapes formula-like text', () => {
  const row = B.speechToRow(sp({ said: '=IMPORTXML("http://x","//a")', prompt: '+1', teacherNote: '@x' }));
  const i = n => B.SPEECH_COLUMNS.indexOf(n);
  assert.equal(row[i('said')], "'=IMPORTXML(\"http://x\",\"//a\")");
  assert.equal(row[i('prompt')], "'+1");
  assert.equal(row[i('teacherNote')], "'@x");
  assert.equal(B.speechToRow(sp())[i('said')], '只要我練習就會進步');
});
