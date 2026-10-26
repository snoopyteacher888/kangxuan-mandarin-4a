const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveStudent } = require('../../assets/core/identity.js');
const roster = [{ id: 'bear', emoji: '🐻', name: '小熊' }, { id: 'cat', emoji: '🐱', name: '小貓' }];

test('class mode always class', () => {
  assert.deepEqual(resolveStudent({ s: 'bear' }, roster, { mode: 'class' }), { student: 'class', needPicker: false });
});
test('link student in roster is used and remembered', () => {
  assert.deepEqual(resolveStudent({ s: 'bear' }, roster, {}), { student: 'bear', needPicker: false, remember: true });
});
test('unknown student id shows picker', () => {
  assert.equal(resolveStudent({ s: 'ghost' }, roster, {}).needPicker, true);
});
test('link student trusted when roster unavailable', () => {
  assert.deepEqual(resolveStudent({ s: 'bear' }, [], {}), { student: 'bear', needPicker: false, remember: true });
});
test('remembered student used without link', () => {
  assert.deepEqual(resolveStudent({}, roster, { student: 'cat' }), { student: 'cat', needPicker: false });
});
test('remembered student removed from roster -> picker', () => {
  assert.equal(resolveStudent({}, roster, { student: 'ghost' }).needPicker, true);
});
test('nothing known -> picker', () => {
  assert.equal(resolveStudent({}, [], {}).needPicker, true);
});
