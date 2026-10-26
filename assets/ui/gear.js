/* ⚙️：長按 2 秒 → 答對乘法題 → 進入老師設定（學生不容易誤入） */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var HOLD_MS = 2000;
  function gatePass() { try { root.sessionStorage.setItem('k4a.gate', '1'); } catch (e) { H3A.gateMem = true; } }
  H3A.ui.gateOk = function () { try { return root.sessionStorage.getItem('k4a.gate') === '1' || !!H3A.gateMem; } catch (e) { return !!H3A.gateMem; } };

  function askMath() {
    var a = 2 + Math.floor(Math.random() * 8), b = 2 + Math.floor(Math.random() * 8);
    var input = h('input', { type: 'number', inputmode: 'numeric', class: 'big-input', 'aria-label': '答案' });
    var msg = h('p', { class: 'error' });
    var pop = h('div', { class: 'vocab-pop', role: 'dialog' },
      h('form', { class: 'vocab-box', onsubmit: function (e) {
        e.preventDefault();
        if (Number(input.value) === a * b) { pop.remove(); gatePass(); H3A.router.go('#/settings'); }
        else { msg.textContent = '答案不對'; input.value = ''; }
      } },
        h('h3', {}, '老師設定'), h('p', {}, a + ' × ' + b + ' = ?'), input, msg,
        h('div', { class: 'result-actions' },
          h('button', { type: 'button', class: 'btn-secondary', onclick: function () { pop.remove(); } }, '取消'),
          h('button', { type: 'submit', class: 'btn-primary' }, '確定'))));
    document.body.appendChild(pop);
    input.focus();
  }

  H3A.ui.gear = function () {
    var timer = null;
    var btn = h('button', { type: 'button', class: 'gear', 'aria-label': '老師設定（長按 2 秒）', title: '老師設定：長按 2 秒' },
      h('span', { class: 'gear-ring', 'aria-hidden': 'true' }), '⚙️');
    function cancel() { clearTimeout(timer); timer = null; btn.classList.remove('holding'); }
    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault(); btn.classList.add('holding');
      timer = setTimeout(function () { cancel(); askMath(); }, HOLD_MS);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { btn.addEventListener(ev, cancel); });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    return btn;
  };
})(this);
