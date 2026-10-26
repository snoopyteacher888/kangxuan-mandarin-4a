/* 錯題複習：答錯馬上記下來，馬上就可以複習；在複習中連續 2 次第一次就答對才移除。
   每個學生各自一份（存在自己的裝置上）。題目 id 前面加課次（L07|h-鹹），不同課的 id 才不會撞在一起；
   舊資料沒有課次的，當作第 6 課 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.review = m; }
})(this, function () {
  var REMOVE_AFTER = 2;
  function copy(q) { var o = {}; for (var k in q) if (Object.prototype.hasOwnProperty.call(q, k)) o[k] = q[k]; return o; }
  function addMiss(queue, qid, today) {
    var q = copy(queue); q[qid] = { last: today, streak: 0 }; return q;
  }
  function due(queue, today) {
    return Object.keys(queue).filter(function (k) { return queue[k].last < today; });
  }
  function recordReview(queue, qid, firstTry, today) {
    var q = copy(queue);
    var prev = q[qid] || { last: today, streak: 0 };
    var streak = firstTry ? prev.streak + 1 : 0;
    if (streak >= REMOVE_AFTER) delete q[qid];
    else q[qid] = { last: today, streak: streak };
    return q;
  }
  function key(lessonId, qid) { return lessonId + '|' + qid; }
  /* 這一課要複習的題目：回傳 [{ key, q }] */
  function forLesson(queue, lessonId) {
    return Object.keys(queue).map(function (k) {
      var at = k.indexOf('|');
      return at < 0 ? { key: k, lesson: 'L06', q: k } : { key: k, lesson: k.slice(0, at), q: k.slice(at + 1) };
    }).filter(function (x) { return x.lesson === lessonId; });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  return { addMiss: addMiss, due: due, key: key, forLesson: forLesson, recordReview: recordReview, todayStr: todayStr };
});
