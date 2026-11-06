/* 成語小動畫（老師要求：認識成語那一頁用動畫解釋）：用表情符號當演員，一句旁白一段動作，邊演邊念。
   資料寫在字詞資料的 idioms[].anim：
     bg：背景（room 室內、school 教室、park 戶外、home 家、sky 天空、night 晚上、farm 田野、sea 海邊、snow 雪地、desk 桌面）
     a：演員 { 名字: [表情符號, x%, y%, 大小(畫面寬的%), 'h' 一開始藏起來, 'f' 左右翻面, 'as:別的演員' 穿一樣的衣服] }
       人物的臉（🧒👩😠…）會自動加上衣服和手腳
     s：一段一段 [[旁白, [[動作, 演員, 參數], ...]], ...]
       動作：in 出現、out 消失、mv 移到 [x, y]、jump 跳、shake 搖、wig 晃、bob 上下飄、pop 放大一下、spin 轉一圈、grow 變大 [倍數]、bow 鞠躬、fall 倒下
   最後一段念完，畫面下方出現成語和意思。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var STEP = 1800; /* 一段最少演多久（毫秒）；有語音時等念完 */
  /* 人物：表情符號的臉在每台裝置長得不一樣、只有頭很可怕（老師要求），改成自己畫的小人：
     圓臉、頭髮、脖子、衣服、手腳。哪一種人看表情符號決定，換表情的符號（🤐😠😢…）用 'as:' 那個人的樣子 */
  var KIND = { '🧒': 'kid', '👦': 'boy', '👧': 'girl', '👩': 'woman', '👨': 'man', '🧑': 'teen', '👶': 'baby', '👴': 'grandpa', '👵': 'grandma', '🧓': 'grandpa', '👱': 'man', '👲': 'boy', '🧔': 'man' };
  var FACE = { '🤐': 'zip', '😠': 'angry', '😡': 'angry', '😢': 'cry', '😭': 'cry', '😊': 'happy', '😄': 'happy', '🙂': 'happy', '🥰': 'happy', '😎': 'happy',
    '😮': 'wow', '😳': 'wow', '😨': 'wow', '😴': 'sleep', '🤔': 'think', '😋': 'happy', '🥵': 'tired', '😵': 'tired', '😟': 'sad' };
  var FACES = Object.keys(KIND).concat(Object.keys(FACE));
  var SHIRTS = ['#E0603A', '#3A86C8', '#F2B233', '#5BAA5B', '#9A6BC4', '#E07AA8', '#2E9E9A'];
  var PANTS = ['#3B4A6B', '#6B4E3B', '#4A4A4A', '#2F5D8A'];
  var SKIN = '#FBD9B9', HAIR = '#4A3222', GREY = '#C9C9C9', INK = '#3A2A22';
  function hash(k) { var n = 0; for (var i = 0; i < k.length; i++) n = (n * 31 + k.charCodeAt(i)) % 997; return n; }
  function hair(kind) {
    var c = kind === 'grandpa' || kind === 'grandma' ? GREY : HAIR;
    switch (kind) {
      case 'girl': return '<circle cx="18" cy="40" r="11" fill="' + c + '"/><circle cx="82" cy="40" r="11" fill="' + c + '"/>' +
        '<path d="M20 44 Q20 12 50 12 Q80 12 80 44 Q70 26 50 27 Q30 26 20 44Z" fill="' + c + '"/>';
      case 'woman': return '<path d="M18 46 Q16 10 50 10 Q84 10 82 46 L84 82 L16 82Z" fill="' + c + '"/>';
      case 'grandma': return '<circle cx="50" cy="12" r="10" fill="' + c + '"/><path d="M20 44 Q20 14 50 14 Q80 14 80 44 Q68 28 50 28 Q32 28 20 44Z" fill="' + c + '"/>';
      case 'grandpa': return '<path d="M20 50 Q18 30 28 26 L30 44Z M80 50 Q82 30 72 26 L70 44Z" fill="' + c + '"/>';
      case 'man': return '<path d="M21 42 Q20 12 50 12 Q80 12 79 42 Q76 26 50 25 Q24 26 21 42Z" fill="' + c + '"/>';
      case 'baby': return '<path d="M46 16 Q50 6 56 14" stroke="' + c + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
      default: return '<path d="M20 44 Q18 12 50 12 Q82 12 80 44 Q74 24 58 26 Q50 34 38 26 Q26 28 20 44Z" fill="' + c + '"/>';
    }
  }
  function face(mood) {
    var eyes = '<circle cx="39" cy="46" r="3.6" fill="' + INK + '"/><circle cx="61" cy="46" r="3.6" fill="' + INK + '"/>';
    var cheeks = '<circle cx="31" cy="56" r="4.5" fill="#F6A7A0" opacity=".7"/><circle cx="69" cy="56" r="4.5" fill="#F6A7A0" opacity=".7"/>';
    var line = 'stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"';
    var mouth = '<path d="M42 58 Q50 65 58 58" ' + line + '/>';
    var extra = '';
    switch (mood) {
      case 'happy': eyes = '<path d="M34 47 Q39 41 44 47 M56 47 Q61 41 66 47" ' + line + '/>'; mouth = '<path d="M40 56 Q50 68 60 56Z" fill="#C0504D"/>'; break;
      case 'angry': extra = '<path d="M32 38 L45 42 M68 38 L55 42" ' + line + '/>'; mouth = '<path d="M42 62 Q50 57 58 62" ' + line + '/>'; cheeks = '<circle cx="31" cy="56" r="5" fill="#F07070" opacity=".8"/><circle cx="69" cy="56" r="5" fill="#F07070" opacity=".8"/>'; break;
      case 'cry': extra = '<path d="M36 52 Q34 60 36 64 Q39 60 36 52Z M64 52 Q62 60 64 64 Q67 60 64 52Z" fill="#6EC1F0"/>'; mouth = '<path d="M42 63 Q50 56 58 63" ' + line + '/>'; break;
      case 'sad': extra = '<path d="M33 40 L44 37 M67 40 L56 37" ' + line + '/>'; mouth = '<path d="M43 62 Q50 57 57 62" ' + line + '/>'; break;
      case 'zip': mouth = '<path d="M38 60 L62 60" ' + line + '/><path d="M42 56 L42 64 M47 56 L47 64 M52 56 L52 64 M57 56 L57 64" stroke="' + INK + '" stroke-width="2"/>'; break;
      case 'wow': mouth = '<ellipse cx="50" cy="61" rx="5" ry="6" fill="#C0504D"/>'; break;
      case 'sleep': eyes = '<path d="M34 46 Q39 50 44 46 M56 46 Q61 50 66 46" ' + line + '/>'; mouth = '<path d="M46 60 L54 60" ' + line + '/>'; break;
      case 'think': extra = '<path d="M56 38 L67 36" ' + line + '/>'; mouth = '<path d="M44 61 L56 59" ' + line + '/>'; break;
      case 'tired': eyes = '<path d="M35 43 L43 49 M43 43 L35 49 M57 43 L65 49 M65 43 L57 49" ' + line + '/>'; mouth = '<path d="M42 62 Q46 58 50 62 Q54 66 58 62" ' + line + '/>'; extra = '<path d="M78 30 Q74 38 78 42 Q82 38 78 30Z" fill="#6EC1F0"/>'; break;
    }
    return eyes + cheeks + mouth + extra;
  }
  function person(kind, mood, shirt, pants) {
    var baby = kind === 'baby', old = kind === 'grandpa' || kind === 'grandma';
    var legs = baby ? '<rect x="38" y="148" width="10" height="14" rx="5" fill="' + pants + '"/><rect x="52" y="148" width="10" height="14" rx="5" fill="' + pants + '"/>'
      : '<rect x="37" y="146" width="11" height="40" rx="4" fill="' + pants + '"/><rect x="52" y="146" width="11" height="40" rx="4" fill="' + pants + '"/>' +
        '<ellipse cx="40" cy="188" rx="9" ry="5" fill="#3A2E28"/><ellipse cx="60" cy="188" rx="9" ry="5" fill="#3A2E28"/>';
    var skirt = kind === 'girl' || kind === 'woman' || kind === 'grandma';
    var body = skirt ? '<path d="M32 96 Q50 88 68 96 L76 150 L24 150Z" fill="' + shirt + '"/>' : '<rect x="30" y="92" width="40" height="58" rx="14" fill="' + shirt + '"/>';
    var arms = '<rect x="18" y="96" width="11" height="44" rx="5.5" fill="' + shirt + '" transform="rotate(14 23 96)"/>' +
      '<rect x="71" y="96" width="11" height="44" rx="5.5" fill="' + shirt + '" transform="rotate(-14 77 96)"/>' +
      '<circle cx="14" cy="140" r="6" fill="' + SKIN + '"/><circle cx="86" cy="140" r="6" fill="' + SKIN + '"/>';
    var back = kind === 'woman' ? hair(kind) : '';
    var front = kind === 'woman' ? '<path d="M22 42 Q22 16 50 16 Q78 16 78 42 Q66 26 50 27 Q34 26 22 42Z" fill="' + HAIR + '"/>' : hair(kind);
    var glasses = old ? '<circle cx="39" cy="46" r="7" fill="none" stroke="#555" stroke-width="2"/><circle cx="61" cy="46" r="7" fill="none" stroke="#555" stroke-width="2"/><path d="M46 46 L54 46" stroke="#555" stroke-width="2"/>' : '';
    return '<svg viewBox="0 0 100 ' + (baby ? 166 : 196) + '" width="100%" height="100%" aria-hidden="true">' + back + legs + arms + body +
      '<rect x="43" y="74" width="14" height="22" rx="5" fill="' + SKIN + '"/>' +
      '<circle cx="50" cy="46" r="30" fill="' + SKIN + '"/>' + front + face(mood) + glasses + '</svg>';
  }
  /* k：演員名（決定衣服顏色）；base：這個人原本的表情符號（換表情時用來決定是哪一種人） */
  function figure(k, emoji, base) {
    if (FACES.indexOf(emoji) < 0) return h('span', { class: 'ia-actor', 'aria-hidden': 'true' }, emoji);
    var n = hash(k), kind = KIND[emoji] || KIND[base] || 'kid', mood = FACE[emoji] || '';
    var el = h('span', { class: 'ia-actor ia-person' + (kind === 'baby' ? ' ia-baby' : ''), 'aria-hidden': 'true' });
    el.innerHTML = person(kind, mood, SHIRTS[n % SHIRTS.length], PANTS[n % PANTS.length]);
    return el;
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function anim(el, frames, ms, keep) {
    if (!el.animate) return Promise.resolve();
    var a = el.animate(frames, { duration: ms, easing: 'ease-in-out', fill: keep ? 'forwards' : 'none' });
    return new Promise(function (r) { a.onfinish = r; a.oncancel = r; });
  }

  function build(x) {
    var A = x.anim;
    var stage = h('div', { class: 'ia-stage ia-' + (A.bg || 'room'), role: 'img', 'aria-label': x.idiom + '的動畫' });
    var cap = h('div', { class: 'ia-cap', 'aria-live': 'polite' });
    var end = h('div', { class: 'ia-end', hidden: true }, h('strong', {}, x.idiom), h('span', {}, x.meaning));
    var actors = {};
    function place() {
      var w = stage.clientWidth || 480;
      Object.keys(actors).forEach(function (k) { actors[k].el.style.fontSize = Math.round(w * actors[k].size / 100) + 'px'; });
    }
    function reset() {
      Object.keys(A.a).forEach(function (k) {
        var d = A.a[k], o = actors[k];
        /* 有身體的人物整個比較高，字小一點，才不會太大 */
        /* 'as:演員名'：換表情時穿一樣的衣服（例如小明變成 🤐） */
        var same = d.slice(4).filter(function (v) { return /^as:/.test(v); })[0];
        if (!o) { var ck = same ? same.slice(3) : k; o = actors[k] = { el: figure(ck, d[0], (A.a[ck] || [])[0]), size: d[3] }; stage.appendChild(o.el); }
        o.el.getAnimations && o.el.getAnimations().forEach(function (an) { an.cancel(); });
        o.x = d[1]; o.y = d[2];
        o.flip = d.indexOf('f', 4) >= 4;
        o.el.style.left = o.x + '%'; o.el.style.top = o.y + '%';
        o.el.style.transform = 'translate(-50%, -50%)' + (o.flip ? ' scaleX(-1)' : '');
        o.el.style.opacity = d.indexOf('h', 4) >= 4 ? '0' : '1';
      });
      cap.textContent = ''; end.hidden = true;
      place();
    }
    function base(o) { return 'translate(-50%, -50%)' + (o.flip ? ' scaleX(-1)' : ''); }
    function act(step) {
      var o = actors[step[1]]; if (!o) return Promise.resolve();
      var el = o.el, b = base(o), arg = step[2];
      switch (step[0]) {
        case 'in': return anim(el, [{ opacity: 0, transform: b + ' scale(.3)' }, { opacity: 1, transform: b + ' scale(1)' }], 500, true).then(function () { el.style.opacity = '1'; });
        case 'out': return anim(el, [{ opacity: 1 }, { opacity: 0 }], 500, true).then(function () { el.style.opacity = '0'; });
        case 'mv':
          var from = { left: o.x + '%', top: o.y + '%' }, to = { left: arg[0] + '%', top: arg[1] + '%' };
          o.x = arg[0]; o.y = arg[1];
          return anim(el, [from, to], arg[2] || 1200, true).then(function () { el.style.left = to.left; el.style.top = to.top; });
        case 'jump': return anim(el, [{ transform: b }, { transform: b + ' translateY(-30%)' }, { transform: b }, { transform: b + ' translateY(-30%)' }, { transform: b }], 900);
        case 'shake': return anim(el, [{ transform: b }, { transform: b + ' translateX(-8%)' }, { transform: b + ' translateX(8%)' }, { transform: b + ' translateX(-8%)' }, { transform: b }], 600);
        case 'wig': return anim(el, [{ transform: b }, { transform: b + ' rotate(-15deg)' }, { transform: b + ' rotate(15deg)' }, { transform: b + ' rotate(-15deg)' }, { transform: b }], 900);
        case 'bob': return anim(el, [{ transform: b }, { transform: b + ' translateY(-15%)' }, { transform: b }, { transform: b + ' translateY(-15%)' }, { transform: b }], 1400);
        case 'pop': return anim(el, [{ transform: b }, { transform: b + ' scale(1.4)' }, { transform: b }], 600);
        case 'spin': return anim(el, [{ transform: b + ' rotate(0)' }, { transform: b + ' rotate(360deg)' }], 900);
        case 'bow': return anim(el, [{ transform: b }, { transform: b + ' rotate(18deg)' }, { transform: b + ' rotate(18deg)' }, { transform: b }], 1200);
        case 'fall': return anim(el, [{ transform: b }, { transform: b + ' rotate(85deg) translateX(20%)' }], 700, true);
        case 'grow': return anim(el, [{ transform: b }, { transform: b + ' scale(' + (arg || 1.6) + ')' }], 700, true);
      }
      return Promise.resolve();
    }
    var token = 0;
    function play() {
      var my = ++token;
      reset();
      btn.textContent = '⏹ 停止';
      var chain = Promise.resolve();
      A.s.forEach(function (seg) {
        chain = chain.then(function () {
          if (my !== token) return;
          cap.textContent = seg[0];
          var acts = (seg[1] || []).map(act);
          return Promise.all([Promise.all(acts), wait(STEP), H3A.tts.speak(seg[0])]);
        });
      });
      return chain.then(function () {
        if (my !== token) return;
        end.hidden = false; cap.textContent = '';
        return H3A.tts.speak(x.idiom + '。' + x.meaning);
      }).then(function () { if (my === token) btn.textContent = '▶ 再看一次'; });
    }
    function stop() { token++; H3A.tts.stop(); btn.textContent = '▶ 看動畫'; }
    var btn = h('button', { type: 'button', class: 'btn-secondary ia-play', onclick: function () { if (btn.textContent === '⏹ 停止') stop(); else play(); } }, '▶ 看動畫');
    var box = h('div', { class: 'ia-box' }, stage, cap, end, btn);
    reset();
    if (root.addEventListener) root.addEventListener('resize', place);
    setTimeout(place, 0);
    box.play = play;
    return box;
  }

  H3A.ui.idiomAnim = function (x) { return x && x.anim && x.anim.s ? build(x) : null; };
})(this);
