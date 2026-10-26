const test = require('node:test');
const assert = require('node:assert/strict');
const { deriveKey, encryptJson, decryptJson, exportKey, importKey, toEncFile } = require('../../assets/core/cryptobox.js');
const SALT = 'AAECAwQFBgcICQoLDA0ODw==';

test('round trip', async () => {
  const k = await deriveKey('pw-一二三', SALT); const box = await encryptJson({ a: '鉛筆' }, k);
  assert.equal(box.v, 1); assert.deepEqual(await decryptJson(box, k), { a: '鉛筆' });
});
test('wrong password -> BAD_KEY', async () => {
  const box = await encryptJson({ a: 1 }, await deriveKey('right', SALT));
  await assert.rejects(decryptJson(box, await deriveKey('wrong', SALT)), /BAD_KEY/);
});
test('exported key still decrypts', async () => {
  const k = await deriveKey('pw', SALT); const box = await encryptJson({ a: 1 }, k);
  assert.deepEqual(await decryptJson(box, await importKey(await exportKey(k))), { a: 1 });
});
test('fresh iv each time', async () => {
  const k = await deriveKey('pw', SALT);
  assert.notEqual((await encryptJson({}, k)).iv, (await encryptJson({}, k)).iv);
});
test('ciphertext does not contain plaintext', async () => {
  const box = await encryptJson({ t: 'pencil-secret' }, await deriveKey('pw', SALT));
  assert.ok(!JSON.stringify(box).includes('pencil'));
});
test('toEncFile defines ENC entry', () => {
  const src = toEncFile('L06', { v: 1, iv: 'i', ct: 'c' });
  const window = {}; new Function('window', src)(window);
  assert.deepEqual(window.ENC.L06, { v: 1, iv: 'i', ct: 'c' });
});
