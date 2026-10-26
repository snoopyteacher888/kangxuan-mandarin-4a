/* 這台裝置的狀態：設定、名冊、課文金鑰、星星、測驗分數、錯題清單 */
(function (root) {
  var H3A = root.H3A;
  var store = H3A.store;
  var lessonCache = {};

  function settings() {
    var s = store.get('settings', {});
    return { mode: s.mode === 'class' ? 'class' : 'student', student: s.student || null, auto: !!s.auto, zhuyin: s.zhuyin !== false };
  }
  function saveSettings(patch) {
    var s = settings(); Object.keys(patch).forEach(function (k) { s[k] = patch[k]; });
    store.set('settings', s); return s;
  }

  function roster() { return store.get('roster', []); }
  function refreshRoster() {
    return H3A.api.call('roster', {}).then(function (res) {
      if (res && Array.isArray(res.roster)) store.set('roster', res.roster);
      return roster();
    }, function () { return roster(); });
  }
  function studentInfo(id) {
    if (id === 'class') return { id: 'class', emoji: '👨‍👩‍👧‍👦', name: '全班' };
    var r = roster().filter(function (x) { return x.id === id; })[0];
    return r || { id: id, emoji: '🙂', name: id };
  }

  /* 理解提問錯的選項換成字詞資料裡長度差不多的（quizDistractors；老師要求：正確答案不要特別長） */
  function patch(id, lesson) {
    var w = root.H3A_WORDS && root.H3A_WORDS[id], d = w && w.quizDistractors;
    if (d && lesson && lesson.quiz) lesson.quiz.forEach(function (q) {
      var list = d[q.id];
      if (!list || list.length !== q.options.length - 1) return;
      var k = 0;
      q.options = q.options.map(function (o, i) { return i === q.answer ? o : { text: list[k++] }; });
    });
    return lesson;
  }
  /* 課文：用這台裝置記住的金鑰解密 window.ENC[id] */
  function getLesson(id) {
    if (lessonCache[id]) return Promise.resolve(lessonCache[id]);
    var box = root.ENC && root.ENC[id];
    if (!box) return Promise.reject(new Error('NO_DATA'));
    var k = store.get('key', null);
    if (!k) return Promise.reject(new Error('NEED_KEY'));
    return H3A.cryptobox.importKey(k)
      .then(function (key) { return H3A.cryptobox.decryptJson(box, key); })
      .then(function (lesson) { lessonCache[id] = patch(id, lesson); return lesson; },
        function () { store.remove('key'); throw new Error('NEED_KEY'); });
  }
  /* 用密碼解開某一課；成功才記住金鑰 */
  function unlock(id, password) {
    var box = root.ENC && root.ENC[id];
    if (!box) return Promise.reject(new Error('NO_DATA'));
    return H3A.cryptobox.deriveKey(password, root.H3A_SALT).then(function (key) {
      return H3A.cryptobox.decryptJson(box, key).then(function (lesson) {
        lessonCache[id] = patch(id, lesson);
        return H3A.cryptobox.exportKey(key).then(function (b64) { store.set('key', b64); return lesson; });
      });
    });
  }
  function lock() { store.remove('key'); lessonCache = {}; }

  function progressKey(student) { return 'progress.' + student; }
  function progress(student) { return store.get(progressKey(student), {}); }
  function saveStars(student, lessonId, activity, stars) {
    var p = progress(student); p[lessonId] = p[lessonId] || {};
    var best = (p[lessonId].stars || {});
    best[activity] = Math.max(best[activity] || 0, stars);
    p[lessonId].stars = best; store.set(progressKey(student), p);
  }
  function saveTestScore(student, lessonId, score, date) {
    var p = progress(student); p[lessonId] = p[lessonId] || {};
    var tests = (p[lessonId].tests || []).concat([{ score: score, date: date }]).slice(-3);
    p[lessonId].tests = tests; store.set(progressKey(student), p);
  }
  function reviewQueue(student) { return store.get('review.' + student, {}); }
  function saveReviewQueue(student, q) { store.set('review.' + student, q); }
  function clearDevice() {
    var keep = { settings: store.get('settings', null), roster: store.get('roster', null), key: store.get('key', null) };
    ['class'].concat(roster().map(function (r) { return r.id; })).forEach(function (id) {
      store.remove(progressKey(id)); store.remove('review.' + id);
    });
    if (keep.settings && keep.settings.student) { store.remove(progressKey(keep.settings.student)); store.remove('review.' + keep.settings.student); }
  }

  H3A.session = {
    settings: settings, saveSettings: saveSettings, roster: roster, refreshRoster: refreshRoster,
    studentInfo: studentInfo, getLesson: getLesson, unlock: unlock, lock: lock,
    progress: progress, saveStars: saveStars, saveTestScore: saveTestScore,
    reviewQueue: reviewQueue, saveReviewQueue: saveReviewQueue, clearDevice: clearDevice
  };
})(this);
