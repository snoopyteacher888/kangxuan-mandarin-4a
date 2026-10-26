/* 生字卡、語詞卡：格狀排列，點一張放大看細節 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  /* 教育部筆順學習網：網址的 ID 就是這個字的 Unicode 編碼（十進位） */
  function strokeUrl(ch) { return 'https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=' + ch.codePointAt(0) + '&la=0'; }
  function popup(box) {
    var pop = h('div', { class: 'vocab-pop', role: 'dialog', onclick: function (e) { if (e.target === pop) pop.remove(); } }, box);
    /* 右上角的叉叉關掉（老師要求，不放「關閉」按鈕） */
    box.insertBefore(h('button', { type: 'button', class: 'pop-x', 'aria-label': '關閉', onclick: function () { pop.remove(); } }, '✕'), box.firstChild);
    document.body.appendChild(pop);
  }
  /* 一段：小標題＋一句話＋🔊 */
  function section(label, text, extra) {
    return h('div', { class: 'card-sec' }, h('p', { class: 'card-label' }, label),
      extra || null, text ? h('p', { class: 'card-line' }, h('span', {}, text), H3A.ui.speaker(text, null)) : null);
  }
  /* 把句子裡的語詞標顏色 */
  function hl(sentence, word) {
    return sentence.split(word).reduce(function (acc, part, i) {
      if (i) acc.push(h('span', { class: 'char-mark' }, word));
      if (part) acc.push(part);
      return acc;
    }, []);
  }
  function hanziDetail(item) {
    var box = h('div', { class: 'vocab-box hanzi-detail' },
      h('div', { class: 'hanzi-head' },
        h('div', { class: 'hanzi-big' }, item.char),
        h('div', {}, h('div', { class: 'zhuyin' }, item.zhuyin), h('p', { class: 'small' }, '部首：' + item.radical + '　' + item.strokes + ' 畫'))),
      section('📚 常用語詞', null, h('p', { class: 'hanzi-words' }, item.words.map(function (w) { return h('span', {}, w, H3A.ui.speaker(w, null)); }))),
      item.sentence ? h('div', { class: 'card-sec' }, h('p', { class: 'card-label', 'aria-label': '例句' }, '💬'),
        h('p', { class: 'card-line' }, h('span', {}, hl(item.sentence, item.char)), H3A.ui.speaker(item.sentence, null))) : null,
      h('div', { class: 'result-actions' },
        H3A.ui.speaker(item.say, null, '念出：' + item.say),
        h('a', { class: 'btn-secondary stroke-link', href: strokeUrl(item.char), target: '_blank', rel: 'noopener' }, '✍️ 看筆順')));
    popup(box);
    H3A.tts.speak(item.say);
  }
  /* 一行：標籤＋內容＋🔊 */
  function infoLine(label, content, say, aria) {
    return h('p', { class: 'info-line' }, h('span', {}, h('span', { class: 'info-label', 'aria-label': aria || null }, label), content), H3A.ui.speaker(say, null));
  }
  H3A.ui.infoLine = infoLine;
  function vocabDetail(lessonId, item) {
    var sentence = item.example ? item.example.replace(/＿+/, item.word) : '';
    /* 寬的字卡：左邊圖，右邊語詞、意思、例句（「意思：」和解釋同一行） */
    var box = h('div', { class: 'vocab-box wide' },
      h('div', { class: 'vd-row' },
        h('div', { class: 'vd-pic' }, H3A.ui.picture(lessonId, item.img, item.word)),
        h('div', { class: 'vd-text' },
          h('h3', {}, item.word, H3A.ui.speaker(item.word, null)),
          infoLine('意思：', item.meaning, item.meaning),
          item.also ? infoLine('也可以說：', item.also, '也可以說' + item.also) : null,
          sentence ? infoLine('💬 ', hl(sentence, item.word), sentence, '例句') : null)));
    popup(box);
    H3A.tts.speak(item.word);
  }
  /* 生字學習卡：左邊是組成（綠：表示意思、藍：念法像），右邊是大字；點卡片任何地方就念，念過打勾 */
  var PART_SAY = { '艹': '草字頭', '氵': '三點水', '阝': '耳朵旁', '刂': '立刀旁', '扌': '提手旁' };
  function cardSay(item) {
    var c = item.combo || {}, out = [item.say];
    if (c.pict) out.push(c.pict);
    (c.parts || []).forEach(function (x) {
      var name = PART_SAY[x[0]] || x[0];
      if (x[1] === 'm') out.push(name + '，表示' + x[2]);
      else if (x[1] === 's') out.push(name + '，念法像' + x[0]);
    });
    out.push('部首是' + item.radical + '，' + item.strokes + '畫');
    out.push('語詞有：' + item.words.join('、'));
    return out.join('。') + '。';
  }
  function hanziLearnCard(lessonId, item, onHeard) {
    var c = item.combo || {};
    var hasSound = (c.parts || []).some(function (x) { return x[1] === 's'; });
    var parts = c.parts ? h('div', { class: 'hl-parts ' + (c.layout || 'lr') }, c.parts.map(function (x, i) {
      return [i ? h('span', { class: 'hl-op' }, '＋') : null,
        h('span', { class: 'hl-chip ' + x[1] + (x[0].length > 1 ? ' long' : '') },
          h('span', { class: 'hl-part' }, x[0]),
          x[1] === 'm' ? h('span', { class: 'hl-note' }, x[2]) : x[1] === 's' ? h('span', { class: 'hl-note' }, '念法像「' + x[0] + '」') : null)];
    })) : h('div', { class: 'hl-pictbox' },
      c.img ? h('div', { class: 'hl-pic' }, H3A.ui.picture(lessonId, c.img, item.char)) : null,
      h('p', { class: 'hl-pict' }, c.pict || ''));
    var card = h('button', { type: 'button', class: 'hl-card', 'data-id': item.id },
      c.type || hasSound ? h('span', { class: 'hl-tag' }, c.type || '形聲字') : null,
      h('span', { class: 'hl-check', 'aria-hidden': 'true' }, '✔'),
      h('div', { class: 'hl-main' }, parts, h('span', { class: 'hl-op arrow' }, '→'), h('span', { class: 'hl-char' }, item.char)),
      h('div', { class: 'hl-info' }, '部首 ', h('strong', {}, item.radical), '　筆畫 ', h('strong', {}, String(item.strokes))),
      h('div', { class: 'hl-words' }, item.words.join('、')));
    card.onclick = function () {
      H3A.tts.speak(cardSay(item));
      if (!card.classList.contains('heard')) { card.classList.add('heard'); if (onHeard) onHeard(item); }
    };
    return card;
  }
  H3A.ui.hanziLearnCard = hanziLearnCard;
  H3A.ui.hanziCardSay = cardSay;

  H3A.ui.hanziCards = function (items) {
    return h('div', { class: 'word-grid' }, items.map(function (it) {
      return h('button', { type: 'button', class: 'word-card hanzi-card', 'data-id': it.id, onclick: function () { hanziDetail(it); } },
        h('span', { class: 'hanzi-mid' }, it.char), h('span', { class: 'zhuyin small' }, it.zhuyin));
    }));
  };
  /* onAllSeen：每一張都點開過才呼叫（點過的卡片打勾） */
  H3A.ui.vocabCards = function (lessonId, items, onAllSeen) {
    var seen = {};
    return h('div', { class: 'word-grid vocab-grid' }, items.map(function (it) {
      var card = h('button', { type: 'button', class: 'word-card', 'data-id': it.id, onclick: function () {
        vocabDetail(lessonId, it);
        if (seen[it.id]) return;
        seen[it.id] = true; card.classList.add('seen');
        if (onAllSeen && Object.keys(seen).length === items.length) onAllSeen();
      } }, h('span', { class: 'seen-check', 'aria-hidden': 'true' }, '✔'),
        H3A.ui.picture(lessonId, it.img, it.word), h('span', { class: 'option-text' }, it.word));
      return card;
    }));
  };
})(this);
