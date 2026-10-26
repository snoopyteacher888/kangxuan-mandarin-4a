/* 檢查課次原稿格式，回傳錯誤訊息清單（空陣列代表沒問題） */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.lessonschema = m; }
})(this, function () {
  function nonEmpty(s) { return typeof s === 'string' && s.trim().length > 0; }
  function validateLesson(l) {
    var errs = [];
    if (!l || typeof l !== 'object') return ['不是有效的課次資料'];
    ['id', 'title'].forEach(function (k) { if (!nonEmpty(l[k])) errs.push('缺少 ' + k); });
    ['paragraphs', 'vocab', 'quiz', 'testExtra'].forEach(function (k) {
      if (!Array.isArray(l[k])) errs.push('缺少 ' + k);
    });
    if (errs.length) return errs;
    var seen = {};
    function useId(id, where) {
      if (!nonEmpty(id)) { errs.push(where + ' 缺少 id'); return; }
      if (seen[id]) errs.push('id 重複：' + id);
      seen[id] = true;
    }
    l.paragraphs.forEach(function (p, i) {
      if (!Array.isArray(p.sentences) || !p.sentences.length) errs.push('第 ' + (i + 1) + ' 段沒有句子');
      else p.sentences.forEach(function (s) {
        useId(s.id, '第 ' + (i + 1) + ' 段');
        if (!nonEmpty(s.text)) errs.push(s.id + ' 沒有文字');
      });
    });
    l.vocab.forEach(function (v, i) {
      if (!nonEmpty(v.word) || !nonEmpty(v.meaning)) errs.push('語詞 ' + (i + 1) + ' 缺少 word 或 meaning');
    });
    var map = l.storyMap;
    var questions = l.quiz.concat(l.testExtra);
    if (!map || map.type !== 'fishbone') errs.push('storyMap 要是 fishbone（魚骨圖）');
    else {
      if (!map.head || !nonEmpty(map.head.text)) errs.push('魚骨圖缺少魚頭');
      if (!Array.isArray(map.bones) || !map.bones.length) errs.push('魚骨圖沒有骨頭');
      else map.bones.forEach(function (b, i) {
        useId(b.id, '第 ' + (i + 1) + ' 根骨頭');
        if (!nonEmpty(b.title) || !nonEmpty(b.prompt)) errs.push(b.id + ' 缺少名稱或問題');
        if (!nonEmpty(b.evidence)) errs.push(b.id + ' 缺少依據句');
        if (!Array.isArray(b.cards) || !b.cards.length) errs.push(b.id + ' 沒有圖卡');
        else b.cards.forEach(function (c) { useId(c.id, b.id + ' 的圖卡'); if (!nonEmpty(c.text)) errs.push(c.id + ' 沒有文字'); });
      });
      (map.decoys || []).forEach(function (c) { useId(c.id, '陷阱卡'); if (!nonEmpty(c.text)) errs.push(c.id + ' 沒有文字'); });
      if (!map.tail) errs.push('魚骨圖缺少魚尾');
      else questions = questions.concat([map.tail]);
    }
    questions.forEach(function (q, i) {
      useId(q.id, '題目 ' + (i + 1));
      if (!nonEmpty(q.prompt)) errs.push(q.id + ' 沒有題目');
      if (!nonEmpty(q.evidence)) errs.push(q.id + ' 缺少依據句');
      if (!Array.isArray(q.options) || q.options.length !== 4) errs.push(q.id + ' 要剛好 4 個選項');
      else q.options.forEach(function (o, j) { if (!nonEmpty(o.text)) errs.push(q.id + ' 選項 ' + (j + 1) + ' 沒有文字'); });
      if (!(q.answer >= 0 && q.answer <= 3 && q.answer === Math.floor(q.answer))) errs.push(q.id + ' 的答案編號不對');
    });
    /* 說說你的想法（🎤 自由回答，老師批改）：可以沒有 */
    if (l.talk !== undefined && !Array.isArray(l.talk)) errs.push('talk 要是清單');
    else (l.talk || []).forEach(function (t, i) {
      useId(t.id, '說說看 ' + (i + 1));
      if (!nonEmpty(t.prompt) || !nonEmpty(t.model) || !nonEmpty(t.clue)) errs.push((t.id || '說說看 ' + (i + 1)) + ' 要有 prompt、model、clue');
    });
    return errs;
  }
  return { validateLesson: validateLesson };
});
