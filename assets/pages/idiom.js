/* 生字變成語：分步驟——學成語（兩個一組：成語卡→排字→放進句子）、看情境選成語、連連看 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h; var F = H3A.ui.flow, Q = H3A.wordq;
  var GROUP = 2;

  function hl(text, ch) {
    return text.split(ch).reduce(function (acc, part, i) { if (i) acc.push(h('span', { class: 'char-mark' }, ch)); if (part) acc.push(part); return acc; }, []);
  }
  function learnSlide(list) {
    return F.learn('認識成語：' + list.map(function (x) { return x.idiom; }).join('、'), function () {
      return h('div', { class: 'idiom-list' }, list.map(function (x) {
        return h('div', { class: 'idiom-card' },
          h('div', { class: 'idiom-head' }, h('span', { class: 'idiom-word' }, hl(x.idiom, x.char)), H3A.ui.speaker(x.idiom, null),
            h('span', { class: 'idiom-from' }, '生字「' + x.char + '」')),
          H3A.ui.infoLine('意思：', x.meaning, x.meaning),
          H3A.ui.infoLine('💬 ', hl(x.example, x.idiom), x.example, '例句'));
      }));
    }, list.map(function (x) { return x.idiom + '。意思是：' + x.meaning + '例如：' + x.example; }).join(''));
  }

  /* 放進句子：把成語拖到適合的那一句 */
  function fillQ(x, r) {
    var q = Q.idiomFillQuestion(x, r);
    q.dragChip = x.idiom;
    q.prompt = '把「' + x.idiom + '」拖到適合的句子裡。';
    q.say = '把' + x.idiom + '拖到適合的句子裡。';
    return q;
  }
  H3A.pages.idiom = function run(main, ctx) {
    var list = ctx.words && ctx.words.idioms; if (!list) return F.missing(main);
    H3A.ui.runSteps(main, ctx, 'idiom', [
      /* 每讀完兩個成語，就馬上排字、放進句子（老師要求三件事放在同一步） */
      { key: 'learn', name: '學成語', say: '每讀完兩個成語，就把字排成成語，再把成語放進句子裡。', make: function (r) {
        var qs = [];
        for (var i = 0; i < list.length; i += GROUP) {
          var part = list.slice(i, i + GROUP);
          qs.push(learnSlide(part));
          part.forEach(function (x) { qs.push(Q.idiomOrderQuestion(x, r)); });
          part.forEach(function (x) { if (x.fill) qs.push(fillQ(x, r)); });
        }
        return qs;
      } },
      { key: 'situation', name: '看情境選成語', say: '看圖和句子，選出正確的成語。', make: function (r) {
        return H3A.quizgen.shuffle(list, r).map(function (x) { return Q.idiomSituationQuestion(x, list, r); });
      } },
      /* 連連看：成語連到用得上它的句子，句子裡成語的地方挖空（老師要求） */
      { key: 'match', name: '連連看', say: '從成語拉一條線，連到可以放進去的句子。', make: function (r) {
        return F.matchRounds('im', '連連看：從成語拉一條線，連到可以放進去的句子', H3A.quizgen.shuffle(list, r), 3, function (x) {
          var blank = x.example.replace(x.idiom, '＿＿＿＿');
          return { id: 'is-' + x.idiom, left: { text: x.idiom }, right: { text: blank, say: blank.replace(/＿+/, '什麼'), full: x.example }, say: x.idiom };
        });
      } }
    ], function () { run(main, ctx); });
  };
})(this);
