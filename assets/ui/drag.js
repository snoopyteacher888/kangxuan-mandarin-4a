/* 拖拉：按住一張卡拖到目標上放開。只點一下也算（手不方便拖的學生可以直接點）。
   dragTo(el, targets, onDrop, onTap)：targets() 回傳目前可以放的元素；onDrop(target) 放到哪一個 */
(function (root) {
  var H3A = root.H3A;
  var MOVE = 8;
  function hit(targets, x, y) {
    var list = targets();
    for (var i = 0; i < list.length; i++) {
      var r = list[i].getBoundingClientRect();
      if (x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 12 && y <= r.bottom + 12) return list[i];
    }
    return null;
  }
  /* opts.line：不拖分身，改成畫線（連連看）；opts.onMove(x, y)／opts.onEnd() 讓呼叫的地方畫線 */
  function dragTo(el, targets, onDrop, onTap, opts) {
    opts = opts || {};
    var start = null, ghost = null, over = null, moving = false;
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', function (e) {
      if (el.disabled || e.button > 0) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });
    el.addEventListener('pointermove', function (e) {
      if (!start || e.pointerId !== start.id) return;
      if (!moving) {
        if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) < MOVE) return;
        moving = true;
        el.classList.add('dragging');
      }
      if (opts.line) { if (opts.onMove) opts.onMove(e.clientX, e.clientY); }
      else if (!ghost) {
        var r = el.getBoundingClientRect();
        ghost = el.cloneNode(true);
        ghost.classList.add('drag-ghost');
        ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px';
        ghost.dx = start.x - r.left; ghost.dy = start.y - r.top;
        document.body.appendChild(ghost);
      }
      if (ghost) { ghost.style.left = (e.clientX - ghost.dx) + 'px'; ghost.style.top = (e.clientY - ghost.dy) + 'px'; }
      var t = hit(targets, e.clientX, e.clientY);
      if (t !== over) { if (over) over.classList.remove('drop-over'); over = t; if (t) t.classList.add('drop-over'); }
    });
    function end(e, cancel) {
      if (!start || e.pointerId !== start.id) return;
      var moved = moving;
      moving = false;
      if (ghost) { ghost.remove(); ghost = null; }
      if (opts.onEnd) opts.onEnd();
      el.classList.remove('dragging');
      if (over) over.classList.remove('drop-over');
      over = null; start = null;
      if (cancel) return;
      if (moved) { var t = hit(targets, e.clientX, e.clientY); if (t) onDrop(t); }
      else if (onTap) onTap();
    }
    el.addEventListener('pointerup', function (e) { end(e, false); });
    el.addEventListener('pointercancel', function (e) { end(e, true); });
    /* 鍵盤（Enter／空白鍵）也能用 */
    el.addEventListener('click', function (e) { if (e.detail === 0 && onTap) onTap(); });
  }
  H3A.ui.dragTo = dragTo;
})(this);
