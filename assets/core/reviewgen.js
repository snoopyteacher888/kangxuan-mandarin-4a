/* 錯題複習：把要複習的題號變成題目（魚骨圖的骨頭轉成選擇題） */
(function (root, factory) {
  var m = factory(root.H3A && root.H3A.quizgen || (typeof require === 'function' ? require('./quizgen.js') : null),
    root.H3A && root.H3A.fishbone || (typeof require === 'function' ? require('./fishbone.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.reviewgen = m; }
})(this, function (quizgen, fishbone) {
  function buildReviewQuestions(lesson, ids, r) {
    var out = [];
    ids.forEach(function (id) {
      var map = lesson.storyMap;
      var pool = lesson.quiz.concat(lesson.testExtra).concat(map && map.tail ? [map.tail] : []);
      var q = pool.filter(function (x) { return x.id === id; })[0];
      if (q) { out.push(quizgen.prepare(q, r)); return; }
      if (map && fishbone.bone(map, id)) out.push(fishbone.boneQuestion(map, id, r));
    });
    return out;
  }
  return { buildReviewQuestions: buildReviewQuestions };
});
