const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { locate } = require('../../assets/core/locate.js');
const lesson = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/fake06.plain.json'), 'utf8'));

test('finds paragraph and sentence of evidence', () => {
  assert.deepEqual(locate(lesson, '水杯可以裝水。'), { paras: [1], sentIds: ['p1s2'] });
});
test('evidence across paragraphs', () => {
  assert.deepEqual(locate(lesson, '水杯可以裝水。先把沙子燒熱，再吹成杯子。'), { paras: [1, 2], sentIds: ['p1s2', 'p2s1'] });
});
test('unknown evidence', () => { assert.deepEqual(locate(lesson, '沒有這句'), { paras: [], sentIds: [] }); });
