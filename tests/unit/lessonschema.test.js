const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateLesson } = require('../../assets/core/lessonschema.js');

const fixture = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/fake06.plain.json'), 'utf8'));

test('fixture is valid', () => { assert.deepEqual(validateLesson(fixture()), []); });
test('quiz must have 4 options', () => {
  const l = fixture(); l.quiz[0].options.pop();
  assert.ok(validateLesson(l).some(e => e.includes(l.quiz[0].id)));
});
test('answer out of range', () => {
  const l = fixture(); l.quiz[0].answer = 4; assert.ok(validateLesson(l).length > 0);
});
test('duplicate ids rejected', () => {
  const l = fixture(); l.quiz[1].id = l.quiz[0].id; assert.ok(validateLesson(l).some(e => e.includes('重複')));
});
test('empty evidence rejected', () => {
  const l = fixture(); l.storyMap.bones[0].evidence = ''; assert.ok(validateLesson(l).length > 0);
});
test('missing paragraphs rejected', () => {
  const l = fixture(); delete l.paragraphs; assert.ok(validateLesson(l).length > 0);
});
/* 本機有課文明文時（不進版控），每課都要通過檢查 */
const contentDir = path.join(__dirname, '../../content');
(fs.existsSync(contentDir) ? fs.readdirSync(contentDir) : []).filter(f => /^lesson\d\d\.plain\.json$/.test(f)).forEach(f => {
  test('real ' + f + ' is valid', () => {
    const l = JSON.parse(fs.readFileSync(path.join(contentDir, f), 'utf8'));
    assert.deepEqual(validateLesson(l), []);
    /* 沒有自己寫提示的題目，依據句一定要找得到課文句子（提示才會亮起來） */
    const { locate } = require('../../assets/core/locate.js');
    l.quiz.concat(l.testExtra || []).filter(q => !q.hints).forEach(q => assert.ok(locate(l, q.evidence).sentIds.length, f + ' ' + q.id + ' 的依據句找不到'));
  });
});

test('fishbone bone needs cards', () => {
  const l = fixture(); l.storyMap.bones[0].cards = []; assert.ok(validateLesson(l).some(e => e.includes('b1')));
});
test('unknown storyMap type rejected', () => {
  const l = fixture(); l.storyMap.type = 'spiral'; assert.ok(validateLesson(l).length > 0);
});
test('duplicate card id rejected', () => {
  const l = fixture(); l.storyMap.decoys[0].id = 'c-sand'; assert.ok(validateLesson(l).some(e => e.includes('重複')));
});

test('talk（說說你的想法）可有可無，有的話要有 prompt、model、clue', () => {
  const l = fixture();
  l.talk = [{ id: 'k1', prompt: '說說看', model: '我會愛惜鉛筆。', clue: '想一想' }];
  assert.deepEqual(validateLesson(l), []);
  l.talk = [{ id: 'k1', prompt: '說說看' }];
  assert.ok(validateLesson(l).some(e => e.includes('k1')));
});
