/* 第 10 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 三段是並列的三樣寶物，故事地圖改畫成樹狀圖 */
    mapLayout: 'tree',
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qb: 'extract', qc: 'extract', qd: 'extract', qf: 'extract', qg: 'extract', qe: 'interpret', qh: 'interpret', qi: 'interpret',
      qj: 'interpret', k1: 'evaluate', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qe: { think: ['走進洞裡看到一大片黃金，貪心的人心裡會想什麼？', '如果想拿太多，洞穴會怎麼對付他？'], why: '「貪念」就是太貪心，想要更多。詩裡的洞穴說：如果起了貪心，想拿更多黃金，就會被關在洞裡出不來。' },
      qh: { think: ['開頭的「轉轉轉」說的是哪些方向？結尾說的又是什麼？', '故事轉了又轉、變了又變，有沒有傳到更多地方、更久以後？'], why: '開頭說上下左右、東西南北，是說故事傳到各個地方；結尾說前後古今、分秒時刻，是說故事流傳了很久很久。' },
      qi: { think: ['詩裡一直說「我」，這個「我」是誰？', '魔毯、洞穴、油燈真的會說話嗎？為什麼要這樣寫？'], why: '詩裡的「我」就是魔毯、洞穴和油燈，它們像人一樣自己介紹自己，讓詩讀起來更有趣、更生動。' },
      qj: { think: ['一開始說中東很遠，最後為什麼說不遠了？', '最後一句說，是什麼傳遍了？'], why: '一千零一夜的故事傳遍了全世界，大家都聽過，所以中東好像不再那麼遙遠。不是中東真的搬家了。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我想坐魔毯去南極看企鵝，因為我從來沒看過。', '我想坐魔毯去外婆家，因為我很想念她。'], bad: ['我不想坐，因為我不喜歡吃魚。', '魔毯是紅色的。'], why: '題目要你說想坐魔毯去哪裡，還要說原因。去南極、去外婆家，都說了地方和原因。不喜歡吃魚跟魔毯沒有關係；說魔毯的顏色，也沒有回答問題。' },
      k2: { good: ['我希望全家人都健康，因為家人最重要。', '我希望把壞掉的玩具變好，送給沒有玩具的小朋友。'], bad: ['我希望可以有一百個願望。', '我昨天去公園玩。'], why: '題目要你說一個願望和原因。全家健康、幫助別人，都是好願望，也說了原因。要一百個願望是在耍賴；去公園玩不是願望。' }
    },
    hanzi: [
      { id: 'h-幻', combo: { type: '指事字', pict: '「幻」是把「予」（給）反過來寫。給了又好像沒給，看得到又抓不到，就是「幻」。' }, char: '幻', zhuyin: 'ㄏㄨㄢˋ', radical: '幺', strokes: 4, words: ['奇幻', '幻想'], say: '幻，幻想的幻', cloze: '＿想', img: 'cw-daydream.png', options: ['幻', '幼', '幺', '約'], clue: '這個字的右邊是一個彎鉤，不是「力」。', explain: '答案是「幻」；「幼」的右邊是「力」，「約」的左邊是絲線。', parts: ['幺', '𠃌'], story: '「幻」是把「予」反過來寫，看起來有、其實沒有。不是真的、在腦袋裡想像出來的，就是「幻想」。', sentence: '弟弟常常幻想自己是超人。' },
      { id: 'h-旋', combo: { type: '會意字', pict: '左上是「方」，上面像一面旗子，下面像一隻腳。拿著旗子繞著走，就是「旋」，有轉圈圈的意思。' }, char: '旋', zhuyin: 'ㄒㄩㄢˊ', radical: '方', strokes: 11, words: ['旋律', '旋轉'], say: '旋，旋轉的旋', cloze: '＿轉', img: 'cw-merry-go-round.png', options: ['旋', '施', '族', '旅'], clue: '這個字的右下角像一隻腳。', explain: '答案是「旋」；「施」的右下角是「也」，「族」的右下角是「矢」，「旅」的右下角像兩個人。', parts: ['方', '𠂉', '疋'], story: '「旋」像拿著旗子、用腳繞著走。繞著圈圈轉，就是「旋轉」；音樂高高低低轉來轉去，就是「旋律」。', sentence: '遊樂園的木馬一直旋轉。' },
      { id: 'h-扁', combo: { type: '會意字', pict: '上面是「戶」，是門；下面是「冊」，是竹片。在門上掛一塊又平又薄的牌子，就是「扁」。' }, char: '扁', zhuyin: 'ㄅㄧㄢˇ', radical: '戶', strokes: 9, words: ['扁', '扁食'], say: '扁，扁食的扁', cloze: '＿食', img: 'cw-wonton.png', options: ['扁', '偏', '編', '篇'], clue: '這個字的上面是「戶」，下面是「冊」。', explain: '答案是「扁」；「偏」多了單人旁，「編」多了絲線，「篇」多了竹字頭。', parts: ['戶', '冊'], story: '上面是門，下面是竹片。掛在門上又平又薄的牌子，所以「扁」是又平又薄的樣子。', sentence: '媽媽煮了一碗熱騰騰的扁食湯。' },
      { id: 'h-瞬', combo: { layout: 'lr', parts: [['目', 'm', '眼睛'], ['舜', 's', '']] }, char: '瞬', zhuyin: 'ㄕㄨㄣˋ', radical: '目', strokes: 17, words: ['一瞬間', '瞬間'], say: '瞬，瞬間的瞬', cloze: '＿間', img: 'cw-lightning.png', options: ['瞬', '舜', '瞭', '瞪'], clue: '這個字的右邊是「舜」，左邊和眼睛有關。', explain: '答案是「瞬」，左邊是目字旁；「舜」沒有目，「瞭」的右邊是「尞」，「瞪」的右邊是「登」。', parts: ['目', '舜'], story: '左邊是眼睛，右邊的「舜」念起來像「瞬」。眼睛眨一下，那麼短的時間，就是「瞬間」。', sentence: '閃電一瞬間就不見了。', build: { layout: 'lr', show: ['？', '舜'], answer: '目', options: ['目', '日', '口', '月'], clue: '想一想：一眨眼就過去了，左邊和眼睛有關。' } },
      { id: 'h-驗', combo: { layout: 'lr', parts: [['馬', 'm', '馬'], ['僉', 's', '']] }, char: '驗', zhuyin: 'ㄧㄢˋ', radical: '馬', strokes: 23, words: ['體驗', '實驗'], say: '驗，實驗的驗', cloze: '實＿', img: 'cw-experiment.png', options: ['驗', '險', '檢', '臉'], clue: '這個字的右邊是「僉」，左邊是一種動物。', explain: '答案是「驗」，左邊是「馬」；「險」的左邊是耳朵旁，「檢」的左邊是木字旁，「臉」的左邊是「月」。', parts: ['馬', '僉'], story: '左邊是馬，右邊的「僉」念起來有點像「驗」。很久以前要騎騎看，試試這匹馬好不好，就是「驗」；動手試試看，就是「實驗」。', sentence: '我們在自然課做了一個有趣的實驗。', build: { layout: 'lr', show: ['？', '僉'], answer: '馬', options: ['馬', '阝', '木', '月'], clue: '想一想：很久以前要試試一匹動物好不好騎，左邊放那種動物。' } },
      { id: 'h-牙', combo: { type: '象形字', pict: '很久以前的「牙」，像上下兩排牙齒咬在一起的樣子。' }, char: '牙', zhuyin: 'ㄧㄚˊ', radical: '牙', strokes: 4, words: ['牙', '牙刷'], say: '牙，牙刷的牙', cloze: '＿刷', img: 'cw-toothbrush.png', options: ['牙', '芽', '呀', '鴉'], clue: '這個字只有四畫，像上下兩排咬東西的部分合在一起。', explain: '答案是「牙」；「芽」多了草字頭，「呀」多了口字旁，「鴉」多了「鳥」。', parts: ['牙'], story: '「牙」像上下兩排牙齒咬在一起。嘴巴裡用來咬東西的，就是「牙」。', sentence: '睡覺前，我拿起牙刷把嘴巴清乾淨。' },
      { id: 'h-芝', combo: { layout: 'tb', parts: [['艹', 'm', '草'], ['之', 's', '']] }, char: '芝', zhuyin: 'ㄓ', radical: '艸', strokes: 8, words: ['芝麻', '靈芝'], say: '芝，靈芝的芝', cloze: '靈＿', img: 'cw-lingzhi.png', options: ['芝', '之', '乏', '泛'], clue: '這個字的下面是「之」，上面和植物有關。', explain: '答案是「芝」，上面有草字頭；「之」沒有草字頭，「乏」的上面是一撇。', parts: ['艹', '之'], story: '上面是草字頭，下面的「之」念起來像「芝」。芝麻、靈芝都是植物，所以有草字頭。', sentence: '樹幹上長了一朵靈芝。', build: { layout: 'tb', show: ['？', '之'], answer: '艹', options: ['艹', '竹', '雨', '穴'], clue: '想一想：芝麻、靈芝都是植物，上面放什麼？' } },
      { id: 'h-盜', combo: { type: '會意字', pict: '上面的「次」像一個人張大嘴巴流口水，下面是「皿」，是碗。看著別人碗裡的東西流口水，想偷拿，就是「盜」。' }, char: '盜', zhuyin: 'ㄉㄠˋ', radical: '皿', strokes: 12, words: ['大盜', '強盜'], say: '盜，強盜的盜', cloze: '強＿', img: 'cw-police-catch.png', options: ['盜', '盞', '盛', '盔'], clue: '這個字的下面是「皿」，上面是「次」。', explain: '答案是「盜」；「盞」的上面是兩個「戈」，「盛」的上面是「成」，「盔」的上面是「灰」。', parts: ['次', '皿'], story: '上面像一個人流口水，下面是碗。看著別人的東西流口水、偷偷拿走，就是「盜」；搶東西的壞人叫「強盜」。', sentence: '警察抓住了搶包包的強盜。' },
      { id: 'h-邁', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的「萬」念起來像「邁」。跨出大步往前走，就是「邁」。' }, char: '邁', zhuyin: 'ㄇㄞˋ', radical: '辵', strokes: 17, words: ['邁開', '邁步'], say: '邁，邁步的邁', cloze: '＿步', img: 'cw-first-steps.png', options: ['邁', '萬', '遇', '過'], clue: '這個字有辵字旁，裡面是「萬」。', explain: '答案是「邁」；「萬」沒有辵字旁，「遇」的裡面是「禺」，「過」的裡面是「咼」。', parts: ['辶', '萬'], story: '辵字旁和走路有關，裡面的「萬」念起來像「邁」。跨出大大的腳步，就是「邁步」。', sentence: '小寶寶勇敢的邁步往前走。' },
      { id: 'h-困', combo: { type: '會意字', pict: '外面是一個大框框，裡面是一棵「木」。樹被圍在框框裡，長不出去，就是「困」。' }, char: '困', zhuyin: 'ㄎㄨㄣˋ', radical: '囗', strokes: 7, words: ['困', '困難'], say: '困，困難的困', cloze: '＿難', img: 'cw-hard-puzzle.png', options: ['困', '因', '囚', '固'], clue: '這個字的框框裡是一棵樹。', explain: '答案是「困」，框框裡是「木」；「因」裡面是「大」，「囚」裡面是「人」，「固」裡面是「古」。', parts: ['囗', '木'], story: '樹被圍在框框裡，長不出去，就是「困」。被關住出不去，或事情很難，都叫「困」。', sentence: '遇到困難不要放棄。' },
      { id: 'h-龐', combo: { type: '形聲字', pict: '外面的「广」像一間大房子，裡面是「龍」，念起來像「龐」。房子裡住著一條龍，好大好大，就是「龐大」。' }, char: '龐', zhuyin: 'ㄆㄤˊ', radical: '龍', strokes: 19, words: ['臉龐', '龐大'], say: '龐，龐大的龐', cloze: '＿大', img: 'cw-whale.png', options: ['龐', '寵', '龍', '籠'], clue: '這個字的外面是「广」，裡面是「龍」。', explain: '答案是「龐」；「寵」的上面是寶蓋頭，「龍」的外面沒有广，「籠」的上面是竹字頭。', parts: ['广', '龍'], story: '外面的「广」像大房子，裡面住著一條龍，一定好大，所以「龐」是很大的意思。臉的樣子也叫「臉龐」。', sentence: '鯨魚的身體非常龐大。' },
      { id: 'h-搓', combo: { layout: 'lr', parts: [['扌', 'm', '手'], ['差', 's', '']] }, char: '搓', zhuyin: 'ㄘㄨㄛ', radical: '手', strokes: 13, words: ['搓', '搓湯圓'], say: '搓，搓湯圓的搓', cloze: '＿湯圓', img: 'cw-tangyuan.png', options: ['搓', '差', '磋', '蹉'], clue: '這個字的右邊是「差」，左邊和手有關。', explain: '答案是「搓」，左邊是提手旁；「差」沒有提手旁，「磋」的左邊是石字旁，「蹉」的左邊是足字旁。', parts: ['扌', '差'], story: '左邊是手，右邊的「差」念起來有點像「搓」。兩隻手來回的摩擦，就是「搓」。', sentence: '冬至的時候，全家一起搓湯圓。', build: { layout: 'lr', show: ['？', '差'], answer: '扌', options: ['扌', '石', '足', '口'], clue: '想一想：把麵團放在手心滾一滾，左邊放什麼？' } },
      { id: 'h-榮', combo: { type: '形聲字', pict: '下面是「木」，上面像兩把火在燒。樹上的花開得像火一樣旺，就是「榮」，有茂盛、光彩的意思。' }, char: '榮', zhuyin: 'ㄖㄨㄥˊ', radical: '木', strokes: 14, words: ['榮華富貴', '光榮'], say: '榮，光榮的榮', cloze: '光＿', img: 'cw-medal.png', options: ['榮', '勞', '營', '螢'], clue: '這個字的下面是「木」。', explain: '答案是「榮」，下面是木；「勞」的下面是「力」，「營」的下面是「呂」，「螢」的下面是「虫」。', parts: ['火', '火', '冖', '木'], story: '下面是樹，上面像兩把火。花開得像火一樣旺盛，就是「榮」；表現好被大家稱讚，就是「光榮」。', sentence: '拿到冠軍，全班都覺得很光榮。' },
      { id: 'h-富', combo: { layout: 'tb', parts: [['宀', 'm', '房子'], ['畐', 's', '']] }, char: '富', zhuyin: 'ㄈㄨˋ', radical: '宀', strokes: 12, words: ['榮華富貴', '豐富'], say: '富，豐富的富', cloze: '豐＿', img: 'cw-rich-meal.png', options: ['富', '福', '副', '幅'], clue: '這個字的下面是「畐」，上面是寶蓋頭。', explain: '答案是「富」，上面是寶蓋頭；「福」的左邊是示字旁，「副」的右邊是立刀旁，「幅」的左邊是巾字旁。', parts: ['宀', '畐'], story: '上面的寶蓋頭像房子，下面的「畐」像裝滿東西的罈子。家裡東西裝得滿滿的，就是「富」。', sentence: '今天的晚餐好豐富。', build: { layout: 'tb', show: ['？', '畐'], answer: '宀', options: ['宀', '穴', '艹', '雨'], clue: '想一想：家裡東西很多，上面放代表房子的部件。' } },
      { id: 'h-遍', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的「扁」念起來像「遍」。每個地方都走到了，就是「遍」。' }, char: '遍', zhuyin: 'ㄅㄧㄢˋ', radical: '辵', strokes: 13, words: ['傳遍', '遍地'], say: '遍，遍地的遍', cloze: '＿地', img: 'cw-flowers-everywhere.png', options: ['遍', '編', '篇', '騙'], clue: '這個字有辵字旁，裡面是「扁」。', explain: '答案是「遍」，有辵字旁；「編」的左邊是絲線，「篇」的上面是竹字頭，「騙」的左邊是「馬」。', parts: ['辶', '扁'], story: '辵字旁和走路有關，裡面的「扁」念起來像「遍」。走到每一個地方，就是「遍」；到處都是，叫「遍地」。', sentence: '春天到了，山坡上遍地開滿小花。' }
    ],
    vocab: [
      { id: 'v-天馬行空', cloze: true, clozeOptions: ['天馬行空', '一板一眼', '死板無趣', '照本宣科'], word: '天馬行空', meaning: '想像力很豐富，自由自在，什麼都想得到。', example: '弟弟的故事＿＿＿＿，一下飛上月亮，一下鑽進海底。', img: 'flying-horse.png', options: ['天馬行空', '榮華富貴', '一瞬間', '奇幻'] },
      { id: 'v-奇幻', cloze: true, clozeOptions: ['奇幻', '普通', '無聊', '真實'], word: '奇幻', meaning: '非常神祕、好像在做夢一樣。', example: '這本書充滿＿＿的冒險故事。', img: 'magic-sparkle.png', options: ['奇幻', '旋律', '芝麻', '傳遍'] },
      { id: 'v-旋律', cloze: true, clozeOptions: ['旋律', '顏色', '味道', '形狀'], word: '旋律', meaning: '一首歌高高低低、好聽的音調。', example: '這首歌的＿＿很好聽，我一聽就會唱。', img: 'music-notes.png', options: ['旋律', '體驗', '大盜', '臉龐'] },
      { id: 'v-扁', cloze: true, clozeOptions: ['扁', '圓', '高', '胖'], word: '扁', meaning: '又平又薄的樣子。', example: '氣球洩了氣，變得＿＿的。', img: 'flat-carpet.png', options: ['扁', '牙', '困', '搓'] },
      { id: 'v-一瞬間', cloze: true, clozeOptions: ['一瞬間', '一整天', '一整年', '一輩子'], word: '一瞬間', meaning: '非常非常短，眨個眼就過去了。', example: '煙火在天空綻開，＿＿＿就消失了。', img: 'blink.png', options: ['一瞬間', '天馬行空', '旋律', '邁開'] },
      { id: 'v-體驗', cloze: true, clozeOptions: ['體驗', '忘記', '放棄', '錯過'], word: '體驗', meaning: '自己親自去做、去感受。', example: '我們到農場＿＿擠牛奶。', img: 'try-pottery.png', options: ['體驗', '奇幻', '傳遍', '芝麻'] },
      { id: 'v-牙', cloze: true, clozeOptions: ['牙', '腳', '耳', '手'], word: '牙', meaning: '嘴巴裡用來咬東西的部分。', example: '吃完糖要記得刷＿。', img: 'teeth.png', options: ['牙', '扁', '搓', '困'] },
      { id: 'v-芝麻', cloze: true, clozeOptions: ['芝麻', '西瓜', '南瓜', '蘋果'], word: '芝麻', meaning: '黑色或白色的小小種子，可以吃。', example: '湯圓裡包著黑＿＿餡。', img: 'sesame.png', options: ['芝麻', '大盜', '臉龐', '旋律'] },
      { id: 'v-大盜', cloze: true, clozeOptions: ['大盜', '警察', '英雄', '醫生'], word: '大盜', meaning: '搶別人財物的壞人。', example: '故事裡的＿＿把寶物藏在山洞裡。', img: 'bandit.png', options: ['大盜', '芝麻', '體驗', '一瞬間'] },
      { id: 'v-邁開', cloze: true, clozeOptions: ['邁開', '停下', '縮回', '躲起'], word: '邁開', meaning: '跨出腳步。', example: '他＿＿大步，往終點跑去。', img: 'big-step.png', options: ['邁開', '搓', '傳遍', '奇幻'] },
      { id: 'v-困', cloze: true, clozeOptions: ['困', '玩', '飛', '跳'], word: '困', meaning: '被關住，出不去。', example: '小貓被＿在樹上，下不來。', img: 'trapped.png', options: ['困', '牙', '扁', '邁開'] },
      { id: 'v-臉龐', cloze: true, clozeOptions: ['臉龐', '手掌', '腳底', '背部'], word: '臉龐', meaning: '頭的前面，有眼睛、鼻子和嘴巴的地方。', example: '寶寶圓圓的＿＿好可愛。', img: 'round-face.png', options: ['臉龐', '大盜', '旋律', '體驗'] },
      { id: 'v-搓', cloze: true, clozeOptions: ['搓', '踢', '跳', '咬'], word: '搓', meaning: '用手來回的摩擦。', example: '天氣好冷，我＿著雙手取暖。', img: 'rub-hands.png', options: ['搓', '困', '牙', '扁'] },
      { id: 'v-榮華富貴', cloze: true, clozeOptions: ['榮華富貴', '窮困潦倒', '一貧如洗', '兩手空空'], word: '榮華富貴', meaning: '又有錢、又有地位。', example: '故事裡的國王擁有＿＿＿＿，卻一點也不快樂。', img: 'treasure.png', options: ['榮華富貴', '天馬行空', '芝麻', '臉龐'] },
      { id: 'v-傳遍', cloze: true, clozeOptions: ['傳遍', '藏起', '忘記', '丟掉'], word: '傳遍', meaning: '讓每一個地方都知道。', example: '好消息很快就＿＿了整個學校。', img: 'spread-world.png', options: ['傳遍', '邁開', '奇幻', '大盜'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-幻', char: '幻', img: 'cw-daydream.png', charMeaning: '不是真的，想像出來的。', word: '幻想', meaning: '想像不是真的事情。', example: '弟弟常常＿＿自己是超人。', options: ['幻想', '旋轉', '牙刷', '龐大'] },
      { id: 'cw-旋', char: '旋', img: 'cw-merry-go-round.png', charMeaning: '轉圈圈。', word: '旋轉', meaning: '繞著一個中心轉圈圈。', example: '遊樂園的木馬一直＿＿。', options: ['旋轉', '實驗', '光榮', '遍地'] },
      { id: 'cw-扁', char: '扁', img: 'cw-wonton.png', charMeaning: '又平又薄。', word: '扁食', meaning: '用薄薄的麵皮包肉做成的小點心，像餛飩。', example: '媽媽煮了一碗熱騰騰的＿＿湯。', options: ['扁食', '幻想', '強盜', '豐富'] },
      { id: 'cw-瞬', char: '瞬', img: 'cw-lightning.png', charMeaning: '眨一下眼睛那麼短的時間。', word: '瞬間', meaning: '非常非常短的時間。', example: '閃電＿＿就不見了。', options: ['瞬間', '困難', '靈芝', '邁步'] },
      { id: 'cw-驗', char: '驗', img: 'cw-experiment.png', charMeaning: '試試看。', word: '實驗', meaning: '動手試試看，看看會有什麼結果。', example: '我們在自然課做了一個有趣的＿＿。', options: ['實驗', '扁食', '光榮', '旋轉'] },
      { id: 'cw-牙', char: '牙', img: 'cw-toothbrush.png', charMeaning: '嘴巴裡咬東西的部分。', word: '牙刷', meaning: '用來清潔牙齒的小刷子。', example: '睡覺前，我拿起＿＿把嘴巴清乾淨。', options: ['牙刷', '瞬間', '豐富', '強盜'] },
      { id: 'cw-芝', char: '芝', img: 'cw-lingzhi.png', charMeaning: '植物的名字。', word: '靈芝', meaning: '一種長在樹上的菇，可以做藥。', example: '樹幹上長了一朵紅褐色的＿＿。', options: ['靈芝', '幻想', '遍地', '實驗'] },
      { id: 'cw-盜', char: '盜', img: 'cw-police-catch.png', charMeaning: '偷、搶別人的東西。', word: '強盜', meaning: '用力氣搶別人東西的壞人。', example: '警察抓住了搶包包的＿＿。', options: ['強盜', '牙刷', '龐大', '旋轉'] },
      { id: 'cw-邁', char: '邁', img: 'cw-first-steps.png', charMeaning: '跨出大步。', word: '邁步', meaning: '跨出腳步往前走。', example: '小寶寶勇敢的＿＿往前走。', options: ['邁步', '靈芝', '光榮', '扁食'] },
      { id: 'cw-困', char: '困', img: 'cw-hard-puzzle.png', charMeaning: '被圍住；很難。', word: '困難', meaning: '很難解決的事。', example: '遇到＿＿不要放棄，想想辦法。', options: ['困難', '實驗', '搓湯圓', '幻想'] },
      { id: 'cw-龐', char: '龐', img: 'cw-whale.png', charMeaning: '很大。', word: '龐大', meaning: '又大又多。', example: '鯨魚的身體非常＿＿。', options: ['龐大', '邁步', '瞬間', '牙刷'] },
      { id: 'cw-搓', char: '搓', img: 'cw-tangyuan.png', charMeaning: '用手來回摩擦。', word: '搓湯圓', meaning: '把糯米糰放在手心，滾成一顆顆圓球。', example: '冬至的時候，全家一起＿＿＿。', options: ['搓湯圓', '困難', '旋轉', '靈芝'] },
      { id: 'cw-榮', char: '榮', img: 'cw-medal.png', charMeaning: '茂盛；有光彩。', word: '光榮', meaning: '因為表現好，被大家稱讚，覺得很驕傲。', example: '拿到冠軍，全班都覺得很＿＿。', options: ['光榮', '強盜', '扁食', '龐大'] },
      { id: 'cw-富', char: '富', img: 'cw-rich-meal.png', charMeaning: '東西很多。', word: '豐富', meaning: '又多又好，種類很多。', example: '今天的晚餐好＿＿，有魚有肉還有湯。', options: ['豐富', '邁步', '牙刷', '困難'] },
      { id: 'cw-遍', char: '遍', img: 'cw-flowers-everywhere.png', charMeaning: '每一個地方都到了。', word: '遍地', meaning: '到處都是。', example: '春天到了，山坡上＿＿開滿小花。', options: ['遍地', '光榮', '瞬間', '搓湯圓'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-咬牙切齒', situationImg: 'id-angry-teeth.png', idiom: '咬牙切齒', char: '牙', meaning: '非常生氣，氣得把牙齒咬得緊緊的。', example: '看到有人欺負小狗，他氣得咬牙切齒。', situation: '弟弟辛苦堆好的積木被人推倒了，他氣得握緊拳頭，牙齒咬得緊緊的。',
        fill: { options: ['看到有人把垃圾倒進河裡，大家都氣得＿＿＿＿。', '收到生日禮物，他開心得＿＿＿＿。'], clue: '提示：哪一句是非常生氣？', explain: '第一句用得對：看到有人亂倒垃圾，大家很生氣。收到禮物很開心，就不是這個意思。' } },
      { id: 'i-拾人牙慧', situationImg: 'id-copy-words.png', idiom: '拾人牙慧', char: '牙', meaning: '只會學別人說過的話，自己沒有新想法。', example: '寫作文要說自己的想法，不要拾人牙慧。', situation: '一隻鸚鵡站在旁邊，別人說什麼，牠就照著說什麼，一個字都不差。',
        fill: { options: ['他的報告都是學別人說過的話，只是＿＿＿＿。', '他想出了一個大家都沒想過的好點子，真是＿＿＿＿。'], clue: '提示：哪一句是只會學別人說過的話？', explain: '第一句用得對：報告都是學別人的。想出新點子，剛好相反。' } },
      { id: 'i-掩耳盜鈴', situationImg: 'id-cover-ears.png', idiom: '掩耳盜鈴', char: '盜', meaning: '自己騙自己，以為別人不會知道。', example: '把考壞的考卷藏起來，以為爸媽不會知道，根本是掩耳盜鈴。', situation: '一個小偷摀住自己的耳朵去偷鈴鐺，以為自己聽不到，別人也就聽不到。',
        fill: { options: ['他把打破的花瓶藏到床底下，以為媽媽不會發現，真是＿＿＿＿。', '他打破花瓶，馬上跟媽媽說對不起，這是＿＿＿＿。'], clue: '提示：哪一句是自己騙自己，以為別人不知道？', explain: '第一句用得對：把花瓶藏起來，以為媽媽不會發現。馬上道歉是誠實，不是這個意思。' } },
      { id: 'i-困獸猶鬥', situationImg: 'id-crab-fight.png', idiom: '困獸猶鬥', char: '困', meaning: '被困住了，還是拚命的抵抗。', example: '比賽只剩最後一分鐘，落後的球隊困獸猶鬥，拚到最後。', situation: '一隻小螃蟹被困在石頭角落，還是舉起大螯，用力的抵抗。',
        fill: { options: ['被困在角落的小貓＿＿＿＿，對著大狗弓起背來。', '球隊領先很多分，輕輕鬆鬆，真是＿＿＿＿。'], clue: '提示：哪一句是被困住了還在拚命抵抗？', explain: '第一句用得對：小貓被困住，還勇敢的抵抗。球隊領先很輕鬆，沒有被困住。' } },
      { id: 'i-欣欣向榮', situationImg: 'id-spring-garden.png', idiom: '欣欣向榮', char: '榮', meaning: '花草樹木長得很茂盛；也可以說事情越來越好。', example: '春天到了，花園裡欣欣向榮。', situation: '春天的花園裡，植物長得又綠又茂盛，花朵一朵接著一朵的開。',
        fill: { options: ['春雨過後，田裡的稻子長得＿＿＿＿。', '冬天的樹葉都掉光了，真是＿＿＿＿。'], clue: '提示：哪一句是植物長得很茂盛？', explain: '第一句用得對：稻子長得很好。樹葉掉光了，剛好相反。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-幻', char: '幻', wrong: '幼', sentence: '弟弟常常幻想自己是超人。', options: ['幻', '幼', '幺'], clue: '這裡是說想像不是真的事，跟幼稚園沒有關係。', explain: '要改成「幻」。想像不是真的事是「幻想」；「幼」是幼稚園的幼。' },
      { id: 'fx-旋', char: '旋', wrong: '施', sentence: '遊樂園的木馬一直旋轉。', options: ['旋', '施', '族'], clue: '這裡是說轉圈圈，想一想，哪一個字的右下角像一隻腳？', explain: '要改成「旋」。轉圈圈是「旋轉」；「施」是施工的施。' },
      { id: 'fx-扁', char: '扁', wrong: '偏', sentence: '媽媽煮了一碗熱騰騰的扁食湯。', options: ['扁', '偏', '編'], clue: '這裡說的是包肉的小點心，跟偏心沒有關係。', explain: '要改成「扁」。包肉的小點心是「扁食」；「偏」是偏心的偏。' },
      { id: 'fx-瞬', char: '瞬', wrong: '舜', sentence: '閃電一瞬間就不見了。', options: ['瞬', '舜', '瞭'], clue: '這裡是說眨一下眼睛那麼短，想一想，哪一個字有目字旁？', explain: '要改成「瞬」。很短的時間是「瞬間」，有目字旁；「舜」少了目。' },
      { id: 'fx-驗', char: '驗', wrong: '險', sentence: '我們在自然課做了一個有趣的實驗。', options: ['驗', '險', '檢'], clue: '這裡是說動手試試看，跟危險沒有關係。', explain: '要改成「驗」。動手試試看是「實驗」，左邊是馬；「險」是危險的險。' },
      { id: 'fx-牙', char: '牙', wrong: '芽', sentence: '睡覺前，我拿起牙刷把嘴巴清乾淨。', options: ['牙', '芽', '鴉'], clue: '這裡說的是清潔嘴巴的刷子，跟發芽沒有關係。', explain: '要改成「牙」。清潔牙齒的刷子是「牙刷」；「芽」是發芽的芽。' },
      { id: 'fx-芝', char: '芝', wrong: '之', sentence: '樹幹上長了一朵靈芝。', options: ['芝', '之', '乏'], clue: '這裡說的是長在樹上的菇，想一想，哪一個字有草字頭？', explain: '要改成「芝」。長在樹上的菇是「靈芝」，有草字頭；「之」沒有草字頭。' },
      { id: 'fx-盜', char: '盜', wrong: '道', sentence: '警察抓住了搶包包的強盜。', options: ['盜', '道', '盞'], clue: '這裡說的是搶東西的壞人，跟道路沒有關係。', explain: '要改成「盜」。搶東西的壞人是「強盜」，下面是皿；「道」是道路的道。' },
      { id: 'fx-邁', char: '邁', wrong: '萬', sentence: '小寶寶勇敢的邁步往前走。', options: ['邁', '萬', '遇'], clue: '這裡是說跨出腳步，跟一萬元沒有關係。', explain: '要改成「邁」。跨出腳步是「邁步」，有辵字旁；「萬」是一萬的萬。' },
      { id: 'fx-困', char: '困', wrong: '因', sentence: '遇到困難不要放棄。', options: ['困', '因', '固'], clue: '這裡是說很難解決，想一想，哪一個字的框框裡是一棵樹？', explain: '要改成「困」。很難解決是「困難」，裡面是木；「因」裡面是大。' },
      { id: 'fx-龐', char: '龐', wrong: '寵', sentence: '鯨魚的身體非常龐大。', options: ['龐', '寵', '龍'], clue: '這裡是說又大又多，跟寵物沒有關係。', explain: '要改成「龐」。又大又多是「龐大」，外面是广；「寵」是寵物的寵。' },
      { id: 'fx-搓', char: '搓', wrong: '差', sentence: '冬至的時候，全家一起搓湯圓。', options: ['搓', '差', '磋'], clue: '這裡是說用手滾一滾，想一想，哪一個字有提手旁？', explain: '要改成「搓」。用手滾湯圓是「搓湯圓」，有提手旁；「差」是差不多的差。' },
      { id: 'fx-榮', char: '榮', wrong: '營', sentence: '拿到冠軍，全班都覺得很光榮。', options: ['榮', '營', '螢'], clue: '這裡是說覺得很驕傲，跟露營沒有關係。', explain: '要改成「榮」。覺得很驕傲是「光榮」，下面是木；「營」是露營的營。' },
      { id: 'fx-富', char: '富', wrong: '福', sentence: '今天的晚餐好豐富。', options: ['富', '福', '副'], clue: '這裡是說又多又好，想一想，哪一個字的上面是寶蓋頭？', explain: '要改成「富」。又多又好是「豐富」，上面是寶蓋頭；「福」是幸福的福。' },
      { id: 'fx-遍', char: '遍', wrong: '編', sentence: '春天到了，山坡上遍地開滿小花。', options: ['遍', '編', '篇'], clue: '這裡是說到處都是，想一想，哪一個字有辵字旁？', explain: '要改成「遍」。到處都是是「遍地」，有辵字旁；「編」是編織的編。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿兒園」是小小孩上學的地方。', sentence: '妹妹今年上＿兒園了。', frame: '＿兒園', options: ['幼', '幻'], answer: '幼', clue: '提示：這個字的右邊是「力」。', explain: '答案是「幼」；「幻」是幻想的幻。' },
      { id: 's2', meaning: '「＿行」是出門到別的地方玩。', sentence: '暑假我們全家去＿行。', frame: '＿行', options: ['旅', '旋'], answer: '旅', clue: '提示：這個字的右下角像兩個人。', explain: '答案是「旅」；「旋」是旋轉的旋。' },
      { id: 's3', meaning: '「＿心」是對某個人特別好、不公平。', sentence: '媽媽說她對我和弟弟都一樣，不會＿心。', frame: '＿心', options: ['偏', '扁'], answer: '偏', clue: '提示：這個字的左邊是單人旁。', explain: '答案是「偏」；「扁」是扁食的扁。' },
      { id: 's4', meaning: '「危＿」是很可能會受傷。', sentence: '在馬路上玩很危＿。', frame: '危＿', options: ['險', '驗'], answer: '險', clue: '提示：這個字的左邊是耳朵旁。', explain: '答案是「險」；「驗」是實驗的驗。' },
      { id: 's5', meaning: '「發＿」是種子長出小小的嫩葉。', sentence: '種子發＿了，冒出綠綠的小葉子。', frame: '發＿', options: ['芽', '牙'], answer: '芽', clue: '提示：這個字有草字頭。', explain: '答案是「芽」；「牙」是牙刷的牙。' },
      { id: 's6', meaning: '「一＿燈」是一個燈。', sentence: '書桌上有一＿檯燈。', frame: '一＿', options: ['盞', '盜'], answer: '盞', clue: '提示：這個字的上面是兩個「戈」。', explain: '答案是「盞」；「盜」是強盜的盜。' },
      { id: 's7', meaning: '「＿見」是碰到。', sentence: '我在路上＿見了老師。', frame: '＿見', options: ['遇', '邁'], answer: '遇', clue: '提示：這個字的裡面是「禺」。', explain: '答案是「遇」；「邁」是邁步的邁。' },
      { id: 's8', meaning: '「原＿」是為什麼會這樣。', sentence: '你知道他哭的原＿嗎？', frame: '原＿', options: ['因', '困'], answer: '因', clue: '提示：這個字的框框裡是「大」。', explain: '答案是「因」；「困」是困難的困。' },
      { id: 's9', meaning: '「＿物」是養在家裡的小動物。', sentence: '小狗是我最愛的＿物。', frame: '＿物', options: ['寵', '龐'], answer: '寵', clue: '提示：這個字的上面是寶蓋頭。', explain: '答案是「寵」；「龐」是龐大的龐。' },
      { id: 's10', meaning: '「＿火蟲」是晚上會發光的小蟲。', sentence: '夏天的晚上，草叢裡有好多＿火蟲。', frame: '＿火蟲', options: ['螢', '榮'], answer: '螢', clue: '提示：這個字的下面是「虫」。', explain: '答案是「螢」；「榮」是光榮的榮。' },
      { id: 's11', meaning: '「幸＿」是生活很快樂、很滿足。', sentence: '一家人在一起，好幸＿。', frame: '幸＿', options: ['福', '富'], answer: '福', clue: '提示：這個字的左邊是示字旁。', explain: '答案是「福」；「富」是豐富的富。' },
      { id: 's12', meaning: '「一＿」是用來數文章的詞。', sentence: '我寫了一＿作文。', frame: '一＿', options: ['篇', '遍'], answer: '篇', clue: '提示：這個字的上面是竹字頭。', explain: '答案是「篇」；「遍」是遍地的遍。' },
      { id: 's13', meaning: '「欺＿」是說假話，讓別人上當。', sentence: '說謊欺＿別人是不對的。', frame: '欺＿', options: ['騙', '遍'], answer: '騙', clue: '提示：這個字的左邊是「馬」。', explain: '答案是「騙」；「遍」是遍地的遍。' }
    ],
    listen: [
      { id: 'l1', text: '一匹有翅膀的馬在天上飛，想像力好豐富。', answer: 0, options: [{ text: '天馬行空', img: 'flying-horse.png' }, { text: '臉龐', img: 'round-face.png' }, { text: '芝麻', img: 'sesame.png' }, { text: '搓', img: 'rub-hands.png' }] },
      { id: 'l2', text: '眨一下眼睛，蝴蝶就飛走了。', answer: 0, options: [{ text: '一瞬間', img: 'blink.png' }, { text: '旋律', img: 'music-notes.png' }, { text: '大盜', img: 'bandit.png' }, { text: '扁', img: 'flat-carpet.png' }] },
      { id: 'l3', text: '黑色或白色的小小種子，可以做湯圓餡。', answer: 0, options: [{ text: '芝麻', img: 'sesame.png' }, { text: '牙', img: 'teeth.png' }, { text: '困', img: 'trapped.png' }, { text: '傳遍', img: 'spread-world.png' }] },
      { id: 'l4', text: '蒙著臉、搶別人寶物的壞人。', answer: 0, options: [{ text: '大盜', img: 'bandit.png' }, { text: '邁開', img: 'big-step.png' }, { text: '奇幻', img: 'magic-sparkle.png' }, { text: '臉龐', img: 'round-face.png' }] },
      { id: 'l5', text: '雙手來回摩擦，讓手變暖。', answer: 0, options: [{ text: '搓', img: 'rub-hands.png' }, { text: '扁', img: 'flat-carpet.png' }, { text: '體驗', img: 'try-pottery.png' }, { text: '一瞬間', img: 'blink.png' }] },
      { id: 'l6', text: '一串高高低低的音符，好好聽。', answer: 0, options: [{ text: '旋律', img: 'music-notes.png' }, { text: '榮華富貴', img: 'treasure.png' }, { text: '芝麻', img: 'sesame.png' }, { text: '困', img: 'trapped.png' }] },
      { id: 'l7', text: '自己捏陶土，親手做做看。', answer: 0, options: [{ text: '體驗', img: 'try-pottery.png' }, { text: '傳遍', img: 'spread-world.png' }, { text: '牙', img: 'teeth.png' }, { text: '大盜', img: 'bandit.png' }] },
      { id: 'l8', text: '一首歌傳到世界的每一個角落。', answer: 0, options: [{ text: '傳遍', img: 'spread-world.png' }, { text: '天馬行空', img: 'flying-horse.png' }, { text: '邁開', img: 'big-step.png' }, { text: '旋律', img: 'music-notes.png' }] }
    ],
    /* ---------- 短語、造句、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看是什麼東西在哪裡。',
      /* 短語：怎麼樣＋什麼＋在＋哪裡（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '彩色風箏在天上', img: 'pr-kite.png',
        parts: [{ text: '彩色', role: '怎麼樣' }, { text: '風箏', role: '什麼' }, { text: '在' }, { text: '天上', role: '哪裡' }],
        explain: '先說它怎麼樣，再說是什麼，最後用「在」說它在哪裡。' },
      pick: [
        { id: 'ph1', img: 'pr-fish-pond.png', before: '', join: '', noun: '小魚在池裡', ask: '什麼樣的小魚在池裡', look: '再看看圖片，小魚在做什麼？', options: ['可愛', '苦澀', '冰冷', '吵鬧'], clue: '提示：小金魚搖著尾巴游來游去，好討人喜歡。', explain: '答案是「可愛」，完整的短語是「可愛小魚在池裡」。' },
        { id: 'ph2', img: 'pr-bird-nest.png', before: '', join: '', noun: '鳥蛋在窩裡', ask: '什麼樣的鳥蛋在窩裡', look: '再看看圖片，鳥蛋有多大？', options: ['小巧', '巨大', '方形', '滾燙'], clue: '提示：每一顆蛋都只有手指頭那麼大。', explain: '答案是「小巧」，完整的短語是「小巧鳥蛋在窩裡」。' },
        { id: 'ph3', img: 'pr-shell-beach.png', before: '', join: '', noun: '貝殼在沙灘', ask: '什麼樣的貝殼在沙灘', look: '再看看圖片，貝殼上有什麼？', options: ['漂亮', '骯髒', '冰冷', '吵鬧'], clue: '提示：上面有彎彎的花紋，大家都想撿回家。', explain: '答案是「漂亮」，完整的短語是「漂亮貝殼在沙灘」。' },
        { id: 'ph4', img: 'pr-cookie-jar.png', before: '', join: '', noun: '餅乾在罐裡', ask: '什麼樣的餅乾在罐裡', look: '再看看圖片，罐子裡的餅乾看起來怎麼樣？', options: ['香甜', '苦澀', '冰冷', '吵鬧'], clue: '提示：聞起來有奶油和糖的味道。', explain: '答案是「香甜」，完整的短語是「香甜餅乾在罐裡」。' },
        { id: 'ph5', img: 'pr-comic-shelf.png', before: '', join: '', noun: '漫畫在架上', ask: '什麼樣的漫畫在架上', look: '再看看圖片，架上排了好多什麼書？', options: ['有趣', '無聊', '苦澀', '冰冷'], clue: '提示：看了會一直笑，停不下來。', explain: '答案是「有趣」，完整的短語是「有趣漫畫在架上」。' },
        { id: 'ph6', img: 'pr-cat-sofa.png', before: '', join: '', noun: '花貓在沙發', ask: '什麼樣的花貓在沙發', look: '再看看圖片，花貓在做什麼？', options: ['慵懶', '忙碌', '苦澀', '吵鬧'], clue: '提示：牠伸展身體，打個哈欠，一動也不想動。', explain: '答案是「慵懶」，完整的短語是「慵懶花貓在沙發」。' }
      ],
      /* 拼短語：自己切好每一塊（每格說明用上面 intro 的每一塊） */
      fill: [
        { id: 'pf1', img: 'pr-fish-pond.png', parts: ['可愛', '小魚', '在', '池裡'] },
        { id: 'pf2', img: 'pr-bird-nest.png', parts: ['小巧', '鳥蛋', '在', '窩裡'] },
        { id: 'pf3', img: 'pr-shell-beach.png', parts: ['漂亮', '貝殼', '在', '沙灘'] },
        { id: 'pf4', img: 'pr-cookie-jar.png', parts: ['香甜', '餅乾', '在', '罐裡'] },
        { id: 'pf5', img: 'pr-comic-shelf.png', parts: ['有趣', '漫畫', '在', '架上'] }
      ],
      say: [],
      words: [
        { word: '天馬行空', meaning: '想像力很豐富，自由自在，什麼都想得到。', img: 'flying-horse.png' },
        { word: '一轉眼', meaning: '很短的時間，一轉頭就變了。', img: 'wd-quick-change.png' },
        { word: '一瞬間', meaning: '非常非常短的時間。', img: 'blink.png' },
        { word: '千山萬水', meaning: '很多的山和河，路又遠又難走。', img: 'wd-far-journey.png' },
        { word: '山珍海味', meaning: '山上和海裡來的好吃東西，很豐盛的菜。', img: 'wd-feast.png' }
      ],
      choose: [
        { id: 'pw1', word: '天馬行空', options: ['妹妹的畫天馬行空，有會飛的大象和會游泳的房子。', '他的作文照著課本一字一字抄，真是天馬行空。'], clue: '提示：想一想，「天馬行空」是想像力很豐富，還是照著抄？', explain: '第一句用得對：會飛的大象，想像力很豐富。照著課本抄，剛好相反。' },
        { id: 'pw2', word: '一轉眼', options: ['一轉眼，桌上的餅乾就被小狗叼走了。', '我等了一整個下午，一轉眼才等到。'], clue: '提示：想一想，「一轉眼」是很短，還是很長的時間？', explain: '第一句用得對：一轉頭餅乾就不見了，時間很短。等了一整個下午，時間很長。' },
        { id: 'pw3', word: '一瞬間', options: ['煙火在天空綻開，一瞬間就消失了。', '這部電影演了三個小時，一瞬間才結束。'], clue: '提示：想一想，「一瞬間」是很短，還是很長的時間？', explain: '第一句用得對：煙火很快就消失了。三個小時很長，不是一瞬間。' },
        { id: 'pw4', word: '千山萬水', options: ['叔叔走過千山萬水，終於回到家鄉。', '學校就在隔壁，我走過千山萬水才到。'], clue: '提示：想一想，「千山萬水」是很遠，還是很近？', explain: '第一句用得對：叔叔走了很遠的路才回家。學校在隔壁很近，剛好相反。' },
        { id: 'pw5', word: '山珍海味', options: ['過年時，桌上有雞、有魚，滿滿的山珍海味。', '我早餐只吃了一片吐司，真是山珍海味。'], clue: '提示：想一想，「山珍海味」是很豐盛的菜，還是很簡單的一點點？', explain: '第一句用得對：過年的菜很豐盛。只吃一片吐司，很簡單。' }
      ],
      make: [
        { id: 'pm1', word: '天馬行空', clue: '提示：想想看，誰的想法很特別、什麼都想得到？', model: '他的想法天馬行空，常常想出有趣的點子。' },
        { id: 'pm2', word: '一轉眼', clue: '提示：想想看，什麼時間過得特別快？', model: '一轉眼，暑假就過完了。' },
        { id: 'pm3', word: '一瞬間', clue: '提示：想想看，什麼東西一下子就消失了？', model: '彩虹一瞬間就不見了。' },
        { id: 'pm4', word: '千山萬水', clue: '提示：想想看，誰走了很遠很遠的路？', model: '候鳥飛越千山萬水，來到臺灣過冬。' },
        { id: 'pm5', word: '山珍海味', clue: '提示：想想看，什麼時候會吃到很豐盛的菜？', model: '奶奶生日那天，我們吃了一頓山珍海味。' }
      ]
    },
    /* 這一課沒有句型練習 */
    pattern: [],
    rhetoric: {
      cards: [
        { key: 'redup', name: '疊字', meaning: '同一個字連在一起重複用，讀起來更好聽，也更生動。', example: '詩裡的「尖尖」、「圓圓」、「硬硬」，都是把同一個字連著說。',
          show: { sentence: '小狗的尾巴搖呀搖，毛軟軟的。' },
          yesno: [
            { id: 'rh-re-y1', sentence: '小狗的鼻子溼溼的。', answer: true, clue: '提示：形容鼻子的字裡，有沒有同一個字連在一起？', explain: '是疊字：「溼溼」把「溼」重複說了。' },
            { id: 'rh-re-y2', sentence: '小狗的鼻子很溼。', answer: false, clue: '提示：仔細聽，有沒有同一個字連在一起？', explain: '不是疊字：這句話沒有重複的字。' }
          ],
          pick: [
            { id: 'rh-re-p1', options: ['魔毯軟軟的。', '魔毯很軟。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「軟軟」是疊字：「軟」重複了。' },
            { id: 'rh-re-p2', options: ['寶石亮晶晶的。', '寶石很亮。'], clue: '提示：仔細聽，哪一句多了重複的字？', explain: '「晶晶」是疊字：「晶」重複了。' },
            { id: 'rh-re-p3', options: ['巨人的手大大的。', '巨人的手很大。', '巨人的手像一把扇子。'], clue: '提示：哪一句有同一個字連在一起？', explain: '「大大」是疊字：「大」重複了。' },
            { id: 'rh-re-p4', options: ['金幣閃閃發亮。', '金幣很亮。', '金幣像小太陽。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「閃閃」是疊字：「閃」重複了。' },
            { id: 'rh-re-p5', options: ['洞裡黑黑的，好可怕。', '洞裡很暗。', '洞口像一張大嘴。', '洞裡有寶藏。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「黑黑」是疊字：「黑」重複了。' },
            { id: 'rh-re-p6', options: ['神燈舊舊的，沾滿灰塵。', '神燈很舊。', '神燈在睡覺。', '神燈像一隻茶壺。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「舊舊」是疊字：「舊」重複了。' }
          ] },
        { key: 'personify', name: '轉化', meaning: '把東西或動物寫得像人一樣，會說話、會想事情、會做人做的事，也叫「擬人」。', example: '詩裡的魔毯、洞穴和油燈，都像人一樣開口介紹自己。',
          show: { sentence: '魔毯笑著說：「快坐上來吧！」', mark: ['笑著說'] },
          yesno: [
            { id: 'rh-pe-y1', sentence: '月亮躲進雲裡睡覺了。', answer: true, mark: ['躲進雲裡睡覺'], clue: '提示：這句話有沒有把月亮寫得像人一樣？', explain: '是轉化：月亮像人一樣會躲起來睡覺。' },
            { id: 'rh-pe-y2', sentence: '月亮被雲遮住了。', answer: false, clue: '提示：這句話裡的月亮，有沒有做人做的事？', explain: '不是轉化：這句話只是說雲遮住了月亮。' }
          ],
          pick: [
            { id: 'rh-pe-p1', mark: ['向我招手'], options: ['大樹向我招手。', '大樹長得很高。'], clue: '提示：哪一句把大樹寫得像人一樣？', explain: '「大樹向我招手」是轉化。' },
            { id: 'rh-pe-p2', mark: ['伸懶腰'], options: ['小草在陽光下伸懶腰。', '小草長出來了。'], clue: '提示：哪一句的小草像人一樣會動？', explain: '「小草伸懶腰」是轉化。' },
            { id: 'rh-pe-p3', mark: ['唱著歌'], options: ['小河唱著歌流過村莊。', '小河流過村莊。', '小河像一條絲帶。'], clue: '提示：哪一句的小河像人一樣會唱歌？', explain: '「小河唱著歌」是轉化。' },
            { id: 'rh-pe-p4', mark: ['生氣的打起雷來'], options: ['烏雲生氣的打起雷來。', '天空打雷了。', '烏雲很黑。'], clue: '提示：哪一句的烏雲像人一樣會生氣？', explain: '「烏雲生氣」是轉化。' },
            { id: 'rh-pe-p5', mark: ['眨著眼睛跟我說晚安'], options: ['小燈籠眨著眼睛跟我說晚安。', '天上有很多亮點。', '夜空像黑色的布。', '夜空很亮。'], clue: '提示：哪一句的小燈籠像人一樣會說話？', explain: '「小燈籠跟我說晚安」是轉化。' },
            { id: 'rh-pe-p6', mark: ['打了個大哈欠'], options: ['神燈打了個大哈欠。', '神燈放在桌上。', '神燈很舊。', '神燈像一隻茶壺。'], clue: '提示：哪一句的神燈像人一樣會打哈欠？', explain: '「神燈打哈欠」是轉化。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '貓咪的毛軟綿綿的。', answer: '疊字', clue: '提示：形容貓毛的字裡，有沒有同一個字連在一起？', explain: '答案是「疊字」：「綿綿」把「綿」連著說了兩次。' },
        { id: 'rh2', sentence: '屋簷下的燈籠閃閃發光。', answer: '疊字', clue: '提示：仔細聽，有沒有同一個字連著說？', explain: '答案是「疊字」：「閃閃」把「閃」連著說了兩次。' },
        { id: 'rh3', sentence: '風在窗外敲門。', answer: '轉化', mark: ['敲門'], clue: '提示：風會不會像人一樣做事？', explain: '答案是「轉化」：風像人一樣會敲門。' },
        { id: 'rh4', sentence: '花朵對著太陽微笑。', answer: '轉化', mark: ['微笑'], clue: '提示：這句話有沒有把花朵寫得像人？', explain: '答案是「轉化」：花朵像人一樣會微笑。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L10 = d; }
})(this);
