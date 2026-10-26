/* 生字語詞：每個生字再學一個語詞。分步驟——翻翻卡、拖詞填空、意思連連看 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h; var F = H3A.ui.flow;
  var HALF = 7;

  function backSay(c) { return c.word + '：' + c.meaning + (c.charMeaning ? c.char + '：' + c.charMeaning : ''); }
  /* 翻翻卡：正面是圖、生字、語詞；點一下翻到背面看意思。每張都翻過才出現「下一步」 */
  function learnSlide(ctx, list, n) {
    return F.learn('認識生字語詞（' + n + '）：點卡片翻翻看', function (ready) {
      var seen = {};
      return h('div', { class: 'flip-grid' }, list.map(function (c) {
        var card = h('button', { type: 'button', class: 'flip-card', 'data-id': c.id, 'aria-label': c.word + '，點一下翻面' },
          h('span', { class: 'flip-inner' },
            h('span', { class: 'flip-front' },
              h('span', { class: 'flip-pic' }, H3A.ui.picture(ctx.lessonId, c.img, c.word)),
              h('span', { class: 'flip-char' }, c.char),
              h('span', { class: 'flip-word' }, c.word)),
            h('span', { class: 'flip-back' },
              h('span', { class: 'flip-word' }, c.word),
              h('span', { class: 'flip-mean' }, c.meaning),
              c.charMeaning ? h('span', { class: 'flip-charmean' }, h('span', { class: 'char-mark' }, c.char), '：' + c.charMeaning) : null)));
        card.onclick = function () {
          var back = !card.classList.contains('flipped');
          card.classList.toggle('flipped', back);
          H3A.tts.speak(back ? backSay(c) : c.char + '，' + c.word);
          if (back && !seen[c.id]) {
            seen[c.id] = true;
            if (Object.keys(seen).length === list.length) ready();
          }
        };
        return h('div', { class: 'flip-wrap' }, card, H3A.ui.speaker(c.word, null));
      }));
    }, '點一點卡片，翻過來看看意思。每一張都翻過，就可以按下一步。', null, true);
  }

  H3A.pages.charword = function run(main, ctx) {
    var list = ctx.words && ctx.words.charwords; if (!list) return F.missing(main);
    var chars = ctx.words.hanzi.map(function (x) { return x.char; });
    H3A.ui.runSteps(main, ctx, 'charword', [
      { key: 'cards', name: '翻翻卡', say: '點卡片翻過來，看看語詞的意思。', make: function () {
        var qs = [];
        for (var i = 0; i < list.length; i += HALF) qs.push(learnSlide(ctx, list.slice(i, i + HALF), i / HALF + 1));
        return qs;
      } },
      { key: 'choose', name: '拖詞填空', say: '把正確的語詞拖到句子的空格裡。', make: function (r) {
        return H3A.quizgen.shuffle(list, r).map(function (c) { return F.dragify(H3A.wordq.charWordQuestion(c, r, chars)); });
      } },
      { key: 'meaning', name: '意思連連看', say: '從語詞拉一條線，連到它的意思。', make: function (r) {
        return F.matchRounds('cm', '連連看：從語詞拉一條線，連到它的意思', H3A.quizgen.shuffle(list, r), 4, function (c) {
          return { id: c.id, left: { text: c.word }, right: { text: c.meaning }, say: c.word };
        });
      } }
    ], function () { run(main, ctx); });
  };
})(this);
