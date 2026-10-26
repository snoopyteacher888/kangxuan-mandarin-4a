/* 理解提問：照課本學習單的分類分步驟——提取訊息 → 推論訊息 → 詮釋整合 → 比較評估。
   每題屬於哪一類寫在字詞資料的 quizLevels（只有題號）；「說說看」改成選選看（talkChoices），放在它所屬的那一類。
   課文理解不要口頭回答（老師要求） */
(function (root) {
  var H3A = root.H3A;
  /* 「說說看」：字詞資料有 talkChoices 的，改成選選看（老師要求：直接說太難）。
     兩個合理的想法選哪一個都對；答錯給想一想的線索，第二次錯老師教你說明為什麼合理 */
  function talkQ(t, words, r) {
    var c = words && words.talkChoices && words.talkChoices[t.id];
    /* 課文理解不要口頭回答（老師要求）：沒有選項的說說看就不出 */
    if (!c) return null;
    var all = c.good.concat(c.bad);
    var order = H3A.quizgen.shuffle(all.map(function (_, i) { return i; }), r || Math.random);
    var prompt = t.prompt.replace(/^說說看：/, '選選看：');
    return { id: t.id, prompt: prompt, say: prompt, list: true,
      ask: '👉 有兩個想法是合理的，選一個你覺得說得通的。',
      options: order.map(function (i) { return { text: all[i] }; }),
      answer: order.indexOf(0), alsoRight: [order.indexOf(1)],
      hints: { h1: { text: '想一想：哪一個想法說得通？跟課文、跟生活裡的事對得上嗎？' }, h2: { text: t.clue },
        teach: { text: '這兩個想法都很合理：「' + c.good[0] + '」和「' + c.good[1] + '」。' + c.why } } };
  }
  var LEVELS = [
    /* 小標用孩子聽得懂的說法（老師要求：學生不懂「提取訊息、推論訊息、詮釋整合、比較評估」） */
    { key: 'extract', name: '找答案', say: '答案就寫在課文裡，回去課文找一找。' },
    { key: 'infer', name: '動動腦', say: '課文沒有直接寫出來，要動動腦想一想。' },
    { key: 'interpret', name: '前後連起來', say: '把課文前面和後面連起來，想一想整課在說什麼。' },
    { key: 'evaluate', name: '我的看法', say: '說說你自己的想法和看法。' }
  ];
  H3A.pages.quiz = function run(main, ctx) {
    var talk = ctx.lesson.talk || [];
    var retry = ctx.params && ctx.params.retry;
    var t = talk.filter(function (x) { return x.id === retry; })[0];
    var tq = t && talkQ(t, ctx.words);
    if (tq) return H3A.ui.flow.retry(main, ctx, tq);
    var levels = (ctx.words && ctx.words.quizLevels) || {};
    function lv(id, fallback) { return levels[id] || fallback; }
    function prep(q, r) {
      var x = H3A.quizgen.prepare(q, r);
      /* 選項不放圖，一個選項一行比較好讀 */
      x.list = true;
      return x;
    }
    var steps = LEVELS.map(function (L) {
      var qs = ctx.lesson.quiz.filter(function (q) { return lv(q.id, 'extract') === L.key; });
      var choices = (ctx.words && ctx.words.talkChoices) || {};
      var ts = talk.filter(function (x) { return choices[x.id] && lv(x.id, 'evaluate') === L.key; });
      if (!qs.length && !ts.length) return {};
      return { key: L.key, name: L.name, say: L.say, make: function (r) { return qs.map(function (q) { return prep(q, r); }).concat(ts.map(function (x) { return talkQ(x, ctx.words, r); }).filter(Boolean)); } };
    });
    H3A.ui.runSteps(main, ctx, 'quiz', steps, function () { run(main, ctx); });
  };
})(this);
