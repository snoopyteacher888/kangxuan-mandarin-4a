const test = require('node:test');
const assert = require('node:assert/strict');
const { firstTryRate, starsFor, testScore } = require('../../assets/core/scoring.js');

test('stars thresholds', () => {
  assert.equal(starsFor(0.8), 3); assert.equal(starsFor(0.79), 2);
  assert.equal(starsFor(0.5), 2); assert.equal(starsFor(0.49), 1); assert.equal(starsFor(0), 1);
});
test('firstTryRate', () => {
  assert.equal(firstTryRate(['first', 'hint1', 'first', 'hint2']), 0.5);
  assert.equal(firstTryRate([]), 0);
});
test('testScore', () => { assert.equal(testScore(5, 8), 63); assert.equal(testScore(0, 0), 0); });
test('pending excluded from first try rate', () => {
  assert.equal(firstTryRate(['first', 'pending', 'hint1']), 0.5);
  assert.equal(firstTryRate(['pending', 'pending']), 0);
});
