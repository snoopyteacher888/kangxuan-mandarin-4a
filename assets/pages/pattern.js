/* 句型：先選句型，再分五步：認識句型 → 前後配對 → 拼句子 → 說後半句 → 自己說一句 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h; var F = H3A.ui.flow, Q = H3A.wordq;

  function halfQ(pt, x) { return Q.speakQuestion(x, { kind: 'pattern', key: pt.key, front: x.front }, '說說看：把句子說完'); }
  /* 自己說一句的鷹架（老師要求）：按第一下 💡 給一張圖、說可以怎麼造句；第二下 💡 或說錯，就給前半句，讓孩子自己說後半句。
     圖和前半句用「前後配對」最後一題的（同一個句型） */
  function wholeQ(pt, x) {
    var q = Q.speakQuestion(x, { kind: 'pattern', key: pt.key }, '用「' + pt.title + '」說一句話');
    var m = pt.match && pt.match[pt.match.length - 1];
    if (m && m.img && m.front) {
      q.scaffold = { front: m.front };
      q.hints.h1 = { text: x.clue.split('想想看')[0] + '看看這張圖，可以怎麼說？', img: m.img };
      q.hints.h2 = { text: '老師幫你說好前半句了，換你把後半句說完。' };
    }
    return q;
  }

  /* 句型公式：🟧關聯詞、🟦條件（假設）、🟩結果 */
  var FORMULA = {
    zhiyao: [['只要', 'conj'], ['要做到的事', 'cond'], ['就', 'conj'], ['會有的結果', 'res1']],
    ruguo: [['如果', 'conj'], ['假設做了什麼事', 'cond'], ['不但', 'conj'], ['第一個結果', 'res1'], ['還', 'conj'], ['第二個結果', 'res2']],
    yinwei: [['因為', 'conj'], ['什麼原因', 'cond'], ['誰', 'res1'], ['只能', 'conj'], ['只好怎麼做', 'res1']],
    jingran: [['發生了什麼事', 'cond'], ['竟然', 'conj'], ['想不到的結果', 'res1']],
    cai: [['先做到什麼事', 'cond'], ['才', 'conj'], ['接著發生的事', 'res1']],
    yibian: [['什麼東西', 'cond'], ['一邊', 'conj'], ['這一邊有什麼', 'cond'], ['一邊', 'conj'], ['另一邊有什麼', 'res1']],
    xianzai: [['什麼時候', 'cond'], ['誰', 'res1'], ['先', 'conj'], ['第一件事', 'res1'], ['再', 'conj'], ['第二件事', 'res2']],
    chule: [['做什麼事', 'cond'], ['除了', 'conj'], ['第一個好處', 'res1'], ['還', 'conj'], ['第二個好處', 'res2']],
    youren: [['什麼地方', 'cond'], ['有人', 'conj'], ['做什麼', 'cond'], ['有人', 'conj'], ['做什麼', 'res1'], ['大家怎麼了', 'res2']],
    caineng: [['要先做到的事', 'cond'], ['才能', 'conj'], ['會有的結果', 'res1']],
    meixiangdao: [['本來以為的事', 'cond'], ['沒想到', 'conj'], ['想不到的結果', 'res1']],
    jiu: [['先發生的事', 'cond'], ['就', 'conj'], ['馬上跟著的結果', 'res1']],
    yihuier: [['誰或什麼東西', 'cond'], ['一會兒', 'conj'], ['第一種樣子', 'res1'], ['一會兒', 'conj'], ['第二種樣子', 'res2']],
    weile: [['為了', 'conj'], ['想做到的事', 'cond'], ['誰做了什麼', 'res1']],
    erqie: [['誰或什麼東西', 'cond'], ['第一個好地方', 'res1'], ['而且', 'conj'], ['更進一步的好地方', 'res2']],
    rang: [['先發生的事', 'cond'], ['讓', 'conj'], ['接著出現的情形', 'res1']],
    yinsuo: [['因為', 'conj'], ['什麼原因', 'cond'], ['所以', 'conj'], ['有什麼結果', 'res1']],
    dang: [['當', 'conj'], ['先發生的事', 'cond'], ['接著發生的事', 'res1']],
    keshi: [['做了什麼事', 'cond'], ['可是', 'conj'], ['跟想的不一樣的結果', 'res1']],
    buzhi: [['做什麼事', 'cond'], ['不只', 'conj'], ['要做的一件事', 'res1'], ['還', 'conj'], ['更進一步的事', 'res2']],
    /* 四上的句型 */
    youshi: [['什麼時候、誰', 'cond'], ['有時', 'conj'], ['第一種情形', 'res1'], ['有時', 'conj'], ['第二種情形', 'res1'], ['有時', 'conj'], ['第三種情形', 'res2']],
    buguan: [['不管', 'conj'], ['不一樣的情況', 'cond'], ['都', 'conj'], ['不會改變的結果', 'res1']],
    bulun: [['不論', 'conj'], ['不一樣的情況', 'cond'], ['總', 'conj'], ['不會改變的結果', 'res1']],
    dangjiu: [['當', 'conj'], ['先發生的事', 'cond'], ['就', 'conj'], ['接著發生的事', 'res1']],
    budanhai: [['不但', 'conj'], ['第一件事', 'cond'], ['還', 'conj'], ['更進一步的事', 'res1']],
    chulehai: [['除了', 'conj'], ['第一件事', 'cond'], ['還', 'conj'], ['另外更多的事', 'res1']],
    ye: [['第一件事', 'cond'], ['也', 'conj'], ['一樣的第二件事', 'res1']],
    ruguo1: [['如果', 'conj'], ['假設的事', 'cond'], ['會怎麼樣', 'res1']],
    shiyeshi: [['誰', 'cond'], ['是', 'conj'], ['第一個身分', 'res1'], ['也是', 'conj'], ['第二個身分', 'res2']],
    shihaishi: [['是', 'conj'], ['第一個選擇', 'cond'], ['還是', 'conj'], ['第二個選擇', 'res1']],
    wulun: [['無論', 'conj'], ['不一樣的情況', 'cond'], ['始終', 'conj'], ['一直不變的事', 'res1']],
    meijing: [['沒想到', 'conj'], ['什麼事', 'cond'], ['竟然', 'conj'], ['想不到的結果', 'res1']],
    jiaru: [['假如', 'conj'], ['假設的事', 'cond'], ['會怎麼樣', 'res1']],
    budangeng: [['不但', 'conj'], ['第一件事', 'cond'], ['更', 'conj'], ['程度更高的事', 'res1']],
    suoyi: [['什麼原因', 'cond'], ['所以', 'conj'], ['有什麼結果', 'res1']],
    ruguojiu: [['如果', 'conj'], ['假設的事', 'cond'], ['就', 'conj'], ['會有的結果', 'res1']],
    yimian: [['要做的事', 'cond'], ['以免', 'conj'], ['不想發生的事', 'res1']],
    youyu: [['由於', 'conj'], ['什麼原因', 'cond'], ['因此', 'conj'], ['有什麼結果', 'res1']],
    suiran: [['雖然', 'conj'], ['一件事', 'cond'], ['卻', 'conj'], ['相反的結果', 'res1']],
    bushi: [['不是', 'conj'], ['第一個選擇', 'cond'], ['就是', 'conj'], ['第二個選擇', 'res1']],
    yuqi: [['與其', 'conj'], ['不想選的事', 'cond'], ['不如', 'conj'], ['比較好的選擇', 'res1']]
  };
  var LABEL = { zhiyao: { cond: '條件', res1: '結果' }, ruguo: { cond: '假設', res1: '結果一', res2: '結果二' }, yinwei: { cond: '原因', res1: '結果' }, jingran: { cond: '發生的事', res1: '想不到的結果' }, cai: { cond: '先做到的事', res1: '接著發生的事' }, yibian: { cond: '這一邊', res1: '另一邊' }, xianzai: { cond: '什麼時候', res1: '第一件事', res2: '第二件事' }, chule: { cond: '做什麼事', res1: '第一個好處', res2: '第二個好處' }, youren: { cond: '有人做這個', res1: '有人做那個', res2: '大家怎麼了' }, caineng: { cond: '要先做到的事', res1: '會有的結果' }, meixiangdao: { cond: '本來以為', res1: '想不到的結果' }, jiu: { cond: '先發生的事', res1: '馬上跟著的結果' }, yihuier: { cond: '誰或什麼東西', res1: '第一種樣子', res2: '第二種樣子' }, weile: { cond: '想做到的事', res1: '做了什麼' }, erqie: { cond: '誰或什麼東西', res1: '第一個好地方', res2: '更進一步的好地方' }, rang: { cond: '先發生的事', res1: '接著出現的情形' }, yinsuo: { cond: '原因', res1: '結果' }, dang: { cond: '先發生的事', res1: '接著發生的事' }, keshi: { cond: '做了什麼事', res1: '不一樣的結果' }, buzhi: { cond: '做什麼事', res1: '要做的一件事', res2: '更進一步的事' },
    youshi: { cond: '什麼時候、誰', res1: '第一種情形', res2: '其他情形' }, buguan: { cond: '不一樣的情況', res1: '不變的結果' }, bulun: { cond: '不一樣的情況', res1: '不變的結果' }, dangjiu: { cond: '先發生的事', res1: '接著發生的事' }, budanhai: { cond: '第一件事', res1: '更進一步的事' }, chulehai: { cond: '第一件事', res1: '另外更多的事' }, ye: { cond: '第一件事', res1: '第二件事' }, ruguo1: { cond: '假設', res1: '會怎麼樣' }, shiyeshi: { cond: '誰', res1: '第一個', res2: '第二個' }, shihaishi: { cond: '第一個選擇', res1: '第二個選擇' }, wulun: { cond: '不一樣的情況', res1: '一直不變的事' }, meijing: { cond: '什麼事', res1: '想不到的結果' }, jiaru: { cond: '假設', res1: '會怎麼樣' }, budangeng: { cond: '第一件事', res1: '程度更高的事' }, suoyi: { cond: '原因', res1: '結果' }, ruguojiu: { cond: '假設', res1: '結果' }, yimian: { cond: '要做的事', res1: '不想發生的事' }, youyu: { cond: '原因', res1: '結果' }, suiran: { cond: '一件事', res1: '相反的結果' }, bushi: { cond: '第一個選擇', res1: '第二個選擇' }, yuqi: { cond: '不想選的', res1: '比較好的選擇' } };

  function formulaRow(key) {
    return h('div', { class: 'pt-formula' }, FORMULA[key].map(function (f) {
      return h('span', { class: 'pt-chip ' + f[1] }, f[0]);
    }));
  }
  /* 例句：跟「拼句子」做完的樣子一樣——關聯詞是淡橘色字，其他每一塊放在框裡，
     條件（要做到的事）藍框、結果一綠框、結果二藍綠框，標點放在框外（老師要求）。
     一行放不下就變成一個分句一行，靠左排 */
  function clauseBlocks(text, key) {
    var clauses = Q.patternClauses(text, key);
    function conj(t) { return h('span', { class: 'conj-word fill-conj' }, t); }
    function part(kind, t) {
      var m = /^(.*?)([，。！？、]*)$/.exec(t), out = [];
      if (m[1]) out.push(h('span', { class: 'fill-part role-' + kind }, m[1]));
      if (m[2]) out.push(h('span', { class: 'fill-punct' }, m[2]));
      return out;
    }
    var flat = h('div', { class: 'pt-flat fill-sentence' }), grid = h('div', { class: 'pt-grid fill-sentence' });
    function add(el, nodes) { [].concat(nodes).forEach(function (n) { el.appendChild(n); }); }
    /* 放不下一行時：一個分句一行、靠左排（老師要求：關聯詞上下對齊的排法看起來很怪） */
    clauses.forEach(function (c) {
      var row = h('div', { class: 'pt-row' });
      c.parts.forEach(function (p) { var n = p.conj ? conj(p.text) : part(c.kind, p.text); add(flat, n); add(row, p.conj ? conj(p.text) : part(c.kind, p.text)); });
      grid.appendChild(row);
    });
    var box = h('div', { class: 'pt-sentence pt-example' }, flat, grid, H3A.ui.speaker(text, null));
    function fit() {
      if (!box.isConnected) return;
      box.classList.remove('stacked');
      /* 差幾個像素是小數點誤差，不算放不下 */
      if (flat.scrollWidth > flat.clientWidth + 6) box.classList.add('stacked');
    }
    setTimeout(fit, 0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    root.addEventListener('resize', fit);
    return box;
  }

  function introSlide(ctx, pt) {
    return F.learn('認識句型：' + pt.title, function () {
      return h('div', { class: 'learn-box' },
        formulaRow(pt.key),
        h('div', { class: 'prompt-img' }, H3A.ui.picture(ctx.lessonId, pt.img, pt.title)),
        F.sayLine(pt.meaning),
        h('p', { class: 'learn-label' }, '📝 例句'),
        pt.examples.map(function (e) { return clauseBlocks(e, pt.key); }));
    }, pt.title.replace(/…+/g, '，') + '。' + pt.meaning + '例如：' + pt.examples.join(''), pt.title);
  }

  function choose(main, ctx, list) {
    var say = '你想練習哪一個句型？';
    main.appendChild(h('div', { class: 'prompt' }, H3A.ui.sayable(h('h2', {}, say), say)));
    main.appendChild(h('div', { class: 'activity-grid' }, list.map(function (pt) {
      return h('div', { class: 'activity-card' },
        h('button', { type: 'button', class: 'activity-main', 'data-pattern': pt.key, onclick: function () { ctx.go('#/' + ctx.lessonId + '/pattern?p=' + pt.key); } },
          H3A.ui.activityIcon('pattern', '🧩'), h('span', { class: 'activity-name' }, pt.title)),
        H3A.ui.speaker(pt.title, pt.title.replace(/…+/g, '，')));
    })));
    if (ctx.auto) H3A.tts.speak(say);
  }

  H3A.pages.pattern = function run(main, ctx) {
    var list = ctx.words && ctx.words.pattern; if (!list) return F.missing(main);
    var params = ctx.params || {};
    if (params.retry) {
      for (var i = 0; i < list.length; i++) {
        var pt0 = list[i];
        var x = pt0.half.filter(function (y) { return y.id === params.retry; })[0];
        if (x) return F.retry(main, ctx, halfQ(pt0, x));
        x = pt0.whole.filter(function (y) { return y.id === params.retry; })[0];
        if (x) return F.retry(main, ctx, wholeQ(pt0, x));
      }
    }
    var pt = list.filter(function (y) { return y.key === params.p; })[0];
    if (!pt) return choose(main, ctx, list);
    var S = H3A.quizgen.shuffle;
    H3A.ui.runSteps(main, ctx, 'pattern', [
      { key: 'intro', name: '認識句型', say: '看一看「' + pt.title + '」怎麼用。', make: function () { return [introSlide(ctx, pt)]; } },
      { key: 'match', name: '前後配對', say: '看圖，選出接在後面最合理的句子。', make: function (r) { return S(pt.match, r).map(function (y) { return Q.matchQuestion(y, r, pt.key); }); } },
      { key: 'fill', name: '拼句子', say: '把句子的每一塊拖到對的空格裡。', make: function (r) {
        return S(pt.conj, r).map(function (y) { return y.full ? Q.patternFillQuestion(y, pt.key, r) : Q.conjQuestion(y, r); });
      } },
      { key: 'half', name: '說後半句', say: '前半句已經說好了，把後半句說完。', make: function () { return pt.half.map(function (y) { return halfQ(pt, y); }); } },
      { key: 'whole', name: '自己說一句', say: '用「' + pt.title + '」自己說一句話。', make: function () { return pt.whole.map(function (y) { return wholeQ(pt, y); }); } }
    ], function () { run(main, ctx); }, { backHash: '#/' + ctx.lessonId + '/pattern', backText: '回到句型' });
  };
})(this);
