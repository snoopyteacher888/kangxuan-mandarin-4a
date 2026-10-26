/* 判斷現在是誰在作答：全班模式 → class；任務連結 s= → 那位學生；否則用這台裝置記住的學生 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.identity = m; }
})(this, function () {
  function inRoster(roster, id) {
    if (!roster || !roster.length) return true; // 名冊抓不到時，相信連結或裝置的設定
    return roster.some(function (r) { return r.id === id; });
  }
  function resolveStudent(params, roster, settings) {
    if (settings && settings.mode === 'class') return { student: 'class', needPicker: false };
    if (params && params.s) {
      return inRoster(roster, params.s) ? { student: params.s, needPicker: false, remember: true }
        : { student: null, needPicker: true };
    }
    if (settings && settings.student && inRoster(roster, settings.student)) {
      return { student: settings.student, needPicker: false };
    }
    return { student: null, needPicker: true };
  }
  return { resolveStudent: resolveStudent };
});
