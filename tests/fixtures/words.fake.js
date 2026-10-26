module.exports = {
  hanzi: [{ id: 'h-杯', char: '杯', zhuyin: 'ㄅㄟ', radical: '木', strokes: 8, words: ['杯子', '水杯'], say: '杯，杯子的杯', cloze: '＿子', img: 'cup.png', options: ['杯', '盃', '背', '悲'], clue: '這個字跟木頭有關', explain: '答案是「杯」，以前的杯子用木頭做，所以左邊是「木」。' }],
  vocab: [{ id: 'v-玻璃', word: '玻璃', meaning: '透明、容易破的材料。', example: '窗戶是用＿＿做的。', img: 'glass.png', options: ['玻璃', '木頭', '紙', '布'] }],
  similar: [{ id: 's1', sentence: '我用＿子喝水。', options: ['杯', '盃'], answer: '杯', clue: '提示：裝水的東西，跟木頭有關。', explain: '答案是「杯」，「杯子」的杯左邊是木。' }],
  listen: [{ id: 'l1', text: '我用杯子裝水。', options: [{ text: '杯子', img: 'cup.png' }, { text: '鉛筆', img: 'pencil.png' }, { text: '橡皮擦', img: 'eraser.png' }, { text: '木頭', img: 'wood.png' }], answer: 0 }],
  phrase: {
    intro: { example: '亮晶晶的杯子', parts: [{ text: '亮晶晶', role: '怎麼樣' }, { text: '的' }, { text: '杯子', role: '東西' }], img: 'cup.png' },
    pick: [{ id: 'ph1', img: 'cup.png', noun: '杯子', options: ['亮晶晶', '黑漆漆', '綠油油', '灰濛濛'], clue: '提示：杯子乾淨得會發光。', explain: '答案是「亮晶晶」，乾淨的杯子會發光。' }],
    say: [{ id: 'ps1', img: 'cup.png', noun: '杯子', accept: ['亮晶晶的杯子'], clue: '提示：杯子乾淨得會發光，用三個字說說看。', model: '亮晶晶的杯子' }],
    words: [{ word: '裝滿', meaning: '放到滿出來。', img: 'cup.png' }],
    choose: [{ id: 'pw1', word: '裝滿', options: ['杯子裡裝滿了水。', '我裝滿了一首歌。'], clue: '提示：「裝滿」的東西要放得進容器裡。', explain: '第一句對，水可以放進杯子裡。' }],
    make: [{ id: 'pm1', word: '裝滿', clue: '提示：想想看，什麼東西可以放進杯子、盒子或書包裡？', model: '我把書包裝滿了課本。' }]
  },
  pattern: [{ key: 'zhiyao', id: 'zy', title: '只要……就……', img: 'cup.png', meaning: '只要做到前面的事，就會有後面的結果。',
    examples: ['只要把杯子洗乾淨，就能裝水。'],
    match: [{ id: 'pt-zy-m1', front: '只要你把杯子洗乾淨，', options: ['就能裝果汁了。', '天空就會下雨。', '小狗就會飛。'], clue: '提示：洗乾淨的杯子可以拿來做什麼？', explain: '答案是「就能裝果汁了」，杯子洗乾淨就能用。' }],
    conj: [{ id: 'pt-zy-c1', sentence: '＿＿你按一下，燈＿＿會亮。', options: ['只要……就……', '如果……不但……還……', '因為……所以……'], clue: '提示：按一下是條件，燈亮是結果。', explain: '答案是「只要……就……」：只要按一下，燈就會亮。' }],
    half: [{ id: 'pt-zy-h1', front: '只要我每天練習，', clue: '提示：每天練習以後，會變得怎麼樣？', model: '就會越來越厲害' }],
    whole: [{ id: 'pt-zy-w1', clue: '提示：先說要做什麼事，再說會有什麼好結果。', model: '只要我早點睡覺，就能早點起床。' }] }],
  rhetoric: {
    cards: [{ key: 'personify', name: '擬人', meaning: '意思', example: '例子', show: { sentence: '例句', img: 'cup.png' }, yesno: [{ id: 'rh-pe-y1', sentence: '杯子笑了。', answer: true, clue: '提示：想一想。', explain: '是。' }, { id: 'rh-pe-y2', sentence: '杯子破了。', answer: false, clue: '提示：再想想。', explain: '不是。' }], pick: [{ id: 'rh-pe-p1', options: ['杯子張開嘴巴喝水。', '杯子裡有水。'], clue: '提示：哪一句的東西做了人做的事？', explain: '第一句是擬人。' }] }, { key: 'simile', name: '譬喻', meaning: '意思', example: '例子', show: { sentence: '例句', img: 'cup.png' }, yesno: [{ id: 'rh-si-y1', sentence: '杯子像月亮。', answer: true, clue: '提示：想一想。', explain: '是。' }, { id: 'rh-si-y2', sentence: '杯子很大。', answer: false, clue: '提示：再想想。', explain: '不是。' }], pick: [] }, { key: 'redup', name: '疊字', meaning: '意思', example: '例子', show: { sentence: '例句', img: 'cup.png' }, yesno: [{ id: 'rh-re-y1', sentence: '杯子亮亮的。', answer: true, clue: '提示：想一想。', explain: '是。' }, { id: 'rh-re-y2', sentence: '杯子很大。', answer: false, clue: '提示：再想想。', explain: '不是。' }], pick: [] }, { key: 'question', name: '設問', meaning: '意思', example: '例子', show: { sentence: '例句', img: 'cup.png' }, yesno: [{ id: 'rh-qu-y1', sentence: '杯子在哪裡？在桌上。', answer: true, clue: '提示：想一想。', explain: '是。' }, { id: 'rh-qu-y2', sentence: '杯子很大。', answer: false, clue: '提示：再想想。', explain: '不是。' }], pick: [] }],
    quiz: [{ id: 'rh1', sentence: '小杯子笑著說：「快來喝水吧！」', answer: '擬人', clue: '提示：杯子會不會笑、會不會說話？', explain: '答案是「擬人」，杯子不會笑也不會說話，這句把杯子寫得像人一樣。' }]
  }
};
