/* 第 9 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 四段是並列的四個國家，故事地圖改畫成樹狀圖 */
    mapLayout: 'tree',
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qb: 'extract', qc: 'extract', qe: 'extract', qg: 'extract', qd: 'infer', qf: 'infer', qh: 'interpret', qi: 'interpret',
      qj: 'evaluate', k1: 'interpret', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qh: { think: ['每一段的開頭和結尾，是不是都說了一樣的話？', '每一段介紹的國家一樣嗎？都在介紹什麼？'], why: '四段都用一樣的話開頭和結尾，每一段介紹一個不同的國家和它的特色，最後都邀請大家去玩。' },
      qi: { think: ['一個人可以同時住在泰國、埃及、荷蘭和奧地利嗎？', '作者為什麼要假裝成當地的人來說話？'], why: '一個人不可能同時有四個家鄉。作者是假裝成這四個國家的人，熱情的邀請大家，讓讀的人好像聽到當地人在介紹自己的家鄉。' },
      qj: { think: ['四個國家的生活、建築、特產一樣嗎？', '別人的文化跟我們不一樣時，我們應該取笑，還是去認識？'], why: '每個國家都有自己的特色和文化。我們要好好認識，也尊重和自己不一樣的文化。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我住在臺南，這裡有好吃的小吃，還有古老的廟。', '我住在宜蘭，這裡有溫泉，也有河可以划船。'], bad: ['我住的地方一點都不好玩，不要來。', '我昨天吃了一碗麵。'], why: '題目要你介紹自己住的地方，說出那裡的特色，邀請別人來玩。說不好玩、不要來，沒有介紹特色；吃麵跟介紹家鄉沒有關係。' },
      k2: { good: ['我最想去荷蘭，因為想看一大片的鬱金香。', '我最想去埃及，因為想看看金字塔有多高。'], bad: ['我最想去日本，因為有好吃的壽司。', '我哪裡都不想去，也不知道為什麼。'], why: '題目問的是課文裡的四個國家。荷蘭、埃及都是課文裡的國家，也說了原因。日本不是課文裡的國家；不說原因，就沒有回答完整。' }
    },
    hanzi: [
      { id: 'h-佛', combo: { layout: 'lr', parts: [['亻', 'm', '人'], ['弗', 's', '']] }, char: '佛', zhuyin: 'ㄈㄛˊ', radical: '人', strokes: 7, words: ['千佛之國', '佛像'], say: '佛，佛像的佛', cloze: '＿像', img: 'cw-buddha-statue.png', options: ['佛', '拂', '沸', '費'], clue: '這個字的右邊是「弗」，左邊和人有關。', explain: '答案是「佛」，左邊是單人旁；「拂」的左邊是提手旁，「沸」的左邊是三點水。', parts: ['亻', '弗'], story: '左邊是人，右邊的「弗」念起來有點像「佛」。佛教裡修行得很好的人叫「佛」，照著佛的樣子做成的雕像叫「佛像」。', sentence: '廟裡有一尊微笑的佛像。', build: { layout: 'lr', show: ['？', '弗'], answer: '亻', options: ['亻', '扌', '氵', '彳'], clue: '想一想：佛像的樣子像一個人，左邊放什麼？' } },
      { id: 'h-泰', combo: { type: '形聲字', pict: '「泰」的下面像水，上面念起來有點像「泰」。水很大很平穩，所以「泰」有平安、很大的意思。' }, char: '泰', zhuyin: 'ㄊㄞˋ', radical: '水', strokes: 10, words: ['泰國', '泰雅族'], say: '泰，泰雅族的泰', cloze: '＿雅族', img: 'cw-atayal.png', options: ['泰', '奏', '秦', '春'], clue: '這個字的下面像「水」。', explain: '答案是「泰」；「奏」的下面是「天」，「秦」的下面是「禾」，「春」的下面是「日」。', parts: ['三', '人', '氺'], story: '「泰」的下面像水。水又大又平穩，所以「泰」有平安的意思。臺灣的原住民族「泰雅族」，也用這個字。', sentence: '泰雅族的阿姨很會織布。' },
      { id: 'h-廟', combo: { type: '形聲字', pict: '外面是「广」，像一間有屋頂的房子；裡面的「朝」念起來有點像「廟」。拜神、拜佛的房子，就是「廟」。' }, char: '廟', zhuyin: 'ㄇㄧㄠˋ', radical: '广', strokes: 15, words: ['廟', '廟會'], say: '廟，廟會的廟', cloze: '＿會', img: 'cw-temple-fair.png', options: ['廟', '朝', '潮', '嘲'], clue: '這個字的外面是「广」。', explain: '答案是「廟」，外面是「广」；「朝」沒有广，「潮」多了三點水，「嘲」多了口字旁。', parts: ['广', '朝'], story: '外面的「广」像房子，裡面的「朝」念起來有點像「廟」。大家去拜拜的房子，就是「廟」。', sentence: '過年時，廟會好熱鬧。' },
      { id: 'h-華', combo: { type: '象形字', pict: '很久以前的「華」，像一棵開滿花的植物，花朵垂下來。所以「華」有漂亮、熱鬧的意思。' }, char: '華', zhuyin: 'ㄏㄨㄚˊ', radical: '艸', strokes: 12, words: ['華麗', '繁華'], say: '華，繁華的華', cloze: '繁＿', img: 'cw-busy-city.png', options: ['華', '嘩', '畢', '曄'], clue: '這個字的上面是草字頭，沒有口字旁。', explain: '答案是「華」；「嘩」多了口字旁，「畢」的上面是「田」。', parts: ['艹', '華'], story: '「華」像一棵開滿花的植物。開滿花又漂亮又熱鬧，所以有「華麗」、「繁華」。', sentence: '晚上的大街燈火明亮，非常繁華。' },
      { id: 'h-尚', combo: { type: '形聲字', pict: '「尚」的上面像三道往上冒的氣，下面是「向」。氣往上冒，有「往上、很好」的意思。' }, char: '尚', zhuyin: 'ㄕㄤˋ', radical: '小', strokes: 8, words: ['和尚', '時尚'], say: '尚，時尚的尚', cloze: '時＿', img: 'cw-fashion.png', options: ['尚', '常', '堂', '當'], clue: '這個字的下面是「冋」，沒有「巾」、「土」、「田」。', explain: '答案是「尚」；「常」的下面是「巾」，「堂」的下面是「土」，「當」的下面是「田」。', parts: ['⺌', '冋'], story: '「尚」的上面像往上冒的氣，有往上、很好的意思。跟得上流行，就是「時尚」。', sentence: '姐姐穿得很時尚。' },
      { id: 'h-逛', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的「狂」念起來有點像「逛」。到處走走看看，就是「逛」。' }, char: '逛', zhuyin: 'ㄍㄨㄤˋ', radical: '辵', strokes: 11, words: ['逛逛', '逛街'], say: '逛，逛街的逛', cloze: '＿街', img: 'cw-shopping.png', options: ['逛', '狂', '誑', '往'], clue: '這個字有辵字旁。', explain: '答案是「逛」，有辵字旁；「狂」沒有辵字旁，「往」的左邊是雙人旁。', parts: ['辶', '狂'], story: '辵字旁和走路有關，裡面的「狂」念起來有點像「逛」。在街上走走看看，就是「逛街」。', sentence: '星期天，媽媽帶我去逛街。' },
      { id: 'h-埃', combo: { layout: 'lr', parts: [['土', 'm', '泥土'], ['矣', 's', '']] }, char: '埃', zhuyin: 'ㄞ', radical: '土', strokes: 10, words: ['埃及', '塵埃'], say: '埃，塵埃的埃', cloze: '塵＿', img: 'cw-dust.png', options: ['埃', '挨', '唉', '矣'], clue: '這個字的右邊是「矣」，左邊和泥沙有關。', explain: '答案是「埃」，左邊是土字旁；「挨」的左邊是提手旁，「唉」的左邊是口字旁。', parts: ['土', '矣'], story: '左邊是土，右邊的「矣」念起來像「埃」。很細很細的泥沙灰塵，就是「塵埃」。', sentence: '陽光照進來，看得到空中飄著塵埃。', build: { layout: 'lr', show: ['？', '矣'], answer: '土', options: ['土', '扌', '口', '亻'], clue: '想一想：灰塵是細細的泥沙，左邊放什麼？' } },
      { id: 'h-羅', combo: { type: '會意字', pict: '上面的「罒」是網子，下面是絲線和一隻鳥。用網子捕鳥，就是「羅」。' }, char: '羅', zhuyin: 'ㄌㄨㄛˊ', radical: '网', strokes: 19, words: ['開羅', '羅盤'], say: '羅，羅盤的羅', cloze: '＿盤', img: 'cw-compass.png', options: ['羅', '蘿', '邏', '籮'], clue: '這個字的上面是「罒」，像一張網子。', explain: '答案是「羅」；「蘿」多了草字頭，「邏」多了辵字旁，「籮」多了竹字頭。', parts: ['罒', '糸', '隹'], story: '上面是網子，下面是絲線和鳥。用網子捕鳥叫「羅」。現在也用在名字和工具上，像找方向的「羅盤」。', sentence: '以前的人用羅盤找方向。' },
      { id: 'h-勢', combo: { layout: 'tb', parts: [['埶', 's', ''], ['力', 'm', '力氣']] }, char: '勢', zhuyin: 'ㄕˋ', radical: '力', strokes: 13, words: ['地勢', '手勢'], say: '勢，手勢的勢', cloze: '手＿', img: 'cw-hand-sign.png', options: ['勢', '熱', '藝', '執'], clue: '這個字的上面是「埶」。', explain: '答案是「勢」，下面是「力」；「熱」的下面是四點，「藝」的上面是草字頭。', parts: ['埶', '力'], story: '上面的「埶」念起來有點像「勢」，下面是力。力量的樣子叫「勢」，地面高低的樣子叫「地勢」，用手比的樣子叫「手勢」。', sentence: '警察舉手比出停下來的手勢。', build: { layout: 'tb', show: ['埶', '？'], answer: '力', options: ['力', '灬', '心', '土'], clue: '想一想：「熱」的下面是四點，這個字的下面是表示很有勁的部件。' } },
      { id: 'h-窪', combo: { layout: 'tb', parts: [['穴', 'm', '洞'], ['洼', 's', '']] }, char: '窪', zhuyin: 'ㄨㄚ', radical: '穴', strokes: 14, words: ['低窪', '水窪'], say: '窪，水窪的窪', cloze: '水＿', img: 'cw-puddle.png', options: ['窪', '洼', '蛙', '娃'], clue: '這個字的上面是穴字頭。', explain: '答案是「窪」，上面是穴字頭；「蛙」的左邊是虫字旁，「娃」的左邊是女字旁。', parts: ['穴', '洼'], story: '上面的「穴」是洞，下面的「洼」念起來像「窪」。地上凹下去、積了水的小坑，就是「水窪」。', sentence: '下過雨，路上有好多小水窪。', build: { layout: 'tb', show: ['？', '洼'], answer: '穴', options: ['穴', '宀', '艹', '雨'], clue: '想一想：凹下去像洞的地方，上面放和洞有關的部件。' } },
      { id: 'h-堤', combo: { layout: 'lr', parts: [['土', 'm', '泥土'], ['是', 's', '']] }, char: '堤', zhuyin: 'ㄉㄧ', radical: '土', strokes: 12, words: ['築堤', '河堤'], say: '堤，河堤的堤', cloze: '河＿', img: 'cw-riverbank.png', options: ['堤', '提', '題', '隄'], clue: '這個字的右邊是「是」，左邊和堆起來的泥巴有關。', explain: '答案是「堤」，左邊是土字旁；「提」的左邊是提手旁，「題」的右邊是「頁」。', parts: ['土', '是'], story: '左邊是土，右邊的「是」念起來有點像「堤」。用泥土堆成、擋住河水的長牆，就是「河堤」。', sentence: '傍晚，我們在河堤上騎腳踏車。', build: { layout: 'lr', show: ['？', '是'], answer: '土', options: ['土', '扌', '頁', '亻'], clue: '想一想：擋水的長牆是用泥巴和石頭堆起來的。' } },
      { id: 'h-防', combo: { layout: 'lr', parts: [['阝', 'm', '土堤'], ['方', 's', '']] }, char: '防', zhuyin: 'ㄈㄤˊ', radical: '阜', strokes: 7, words: ['防潮', '消防'], say: '防，消防的防', cloze: '消＿', img: 'cw-firefighter.png', options: ['防', '放', '房', '訪'], clue: '這個字的右邊是「方」，左邊是耳朵旁。', explain: '答案是「防」，左邊是耳朵旁；「放」的右邊是「攵」，「房」的上面是「戶」，「訪」的左邊是言字旁。', parts: ['阝', '方'], story: '左邊的耳朵旁在這裡是土堤，右邊的「方」念起來像「防」。用土堤擋住大水，就是「防」，有保護、擋住的意思。', sentence: '消防員勇敢的去救火。', build: { layout: 'lr', show: ['？', '方'], answer: '阝', options: ['阝', '攵', '戶', '言'], clue: '想一想：擋住大水的是土堤，左邊是耳朵旁。' } },
      { id: 'h-潮', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['朝', 's', '']] }, char: '潮', zhuyin: 'ㄔㄠˊ', radical: '水', strokes: 15, words: ['防潮', '潮水'], say: '潮，潮水的潮', cloze: '＿水', img: 'cw-tide.png', options: ['潮', '朝', '廟', '嘲'], clue: '這個字的右邊是「朝」，左邊和海水有關。', explain: '答案是「潮」，左邊是三點水；「朝」沒有三點水，「廟」的外面是「广」。', parts: ['氵', '朝'], story: '左邊是水，右邊的「朝」是早上。海水每天早晚漲起來又退下去，就是「潮水」。', sentence: '海邊的潮水一波一波湧上來。', build: { layout: 'lr', show: ['？', '朝'], answer: '氵', options: ['氵', '口', '广', '木'], clue: '想一想：海水漲起來又退下去，左邊放和海有關的部首。' } },
      { id: 'h-鬱', combo: { type: '會意字', pict: '「鬱」的筆畫非常多，上面像兩棵樹中間夾著罐子，下面有香草和花紋。很多東西擠在一起、悶悶的，就是「鬱」。' }, char: '鬱', zhuyin: 'ㄩˋ', radical: '鬯', strokes: 29, words: ['鬱金香', '憂鬱'], say: '鬱，憂鬱的鬱', cloze: '憂＿', img: 'cw-sad-rain.png', options: ['鬱', '鬯', '爵', '鬢'], clue: '這個字的筆畫非常多，上面兩邊各有一個「木」。', explain: '答案是「鬱」；「鬯」只是它下面的一部分，「爵」的上面是「爫」。', parts: ['林', '缶', '冖', '鬯', '彡'], story: '「鬱」的筆畫有二十九畫，好多東西擠在一起，看起來悶悶的。心裡悶悶不開心，就是「憂鬱」；也用在花的名字「鬱金香」。', sentence: '下雨天，弟弟的心情有點憂鬱。' },
      { id: 'h-划', combo: { layout: 'lr', parts: [['戈', 's', ''], ['刂', 'm', '刀']] }, char: '划', zhuyin: 'ㄏㄨㄚˊ', radical: '刀', strokes: 6, words: ['划船', '划算'], say: '划，划算的划', cloze: '＿算', img: 'cw-sale.png', options: ['划', '劃', '化', '畫'], clue: '這個字的左邊是「戈」，右邊是立刀旁。', explain: '答案是「划」；「劃」的左邊是「畫」，「化」的左邊是單人旁。', parts: ['戈', '刂'], story: '左邊是「戈」，右邊是立刀旁，像拿著工具用力撥。用槳撥水叫「划船」；花得少、得到的多叫「划算」。', sentence: '買一送一好划算！', build: { layout: 'lr', show: ['戈', '？'], answer: '刂', options: ['刂', '力', '攵', '欠'], clue: '想一想：右邊是立刀旁。' } }
    ],
    vocab: [
      { id: 'v-千佛之國', word: '千佛之國', meaning: '有很多很多佛像和寺廟的國家，說的是泰國。', example: '泰國被稱為「＿＿＿＿」。', img: 'temple.png', options: ['千佛之國', '泰國', '埃及', '開羅'] },
      { id: 'v-泰國', word: '泰國', meaning: '在東南亞的一個國家，到處都有寺廟。', example: '＿＿的水上市場很有名。', img: 'thailand.png', options: ['泰國', '埃及', '千佛之國', '和尚'] },
      { id: 'v-廟', cloze: true, clozeOptions: ['廟', '車站', '超市', '學校'], word: '廟', meaning: '拜神、拜佛的地方。', example: '過年的時候，我們去＿裡拜拜。', img: 'temple.png', options: ['廟', '和尚', '地勢', '划船'] },
      { id: 'v-華麗', cloze: true, clozeOptions: ['華麗', '破舊', '簡單', '骯髒'], word: '華麗', meaning: '又漂亮、又閃亮，裝飾很多。', example: '公主穿著一件＿＿的禮服。', img: 'golden-temple.png', options: ['華麗', '低窪', '氣息', '逛逛'] },
      { id: 'v-和尚', cloze: true, clozeOptions: ['和尚', '警察', '廚師', '司機'], word: '和尚', meaning: '出家修行的男生。', example: '廟裡的＿＿每天早上都在念經。', img: 'monk.png', options: ['和尚', '廟', '築堤', '鬱金香'] },
      { id: 'v-逛逛', cloze: true, clozeOptions: ['逛逛', '躲起來', '睡大覺', '發脾氣'], word: '逛逛', meaning: '隨意走走看看。', example: '週末，我們去夜市＿＿。', img: 'float-market.png', options: ['逛逛', '划船', '防潮', '華麗'] },
      { id: 'v-埃及', word: '埃及', meaning: '在非洲東北部的國家，有很多沙漠和金字塔。', example: '去＿＿可以看到高高的金字塔。', img: 'pyramid.png', options: ['埃及', '泰國', '開羅', '千佛之國'] },
      { id: 'v-開羅', word: '開羅', meaning: '埃及的首都。', example: '＿＿就在一條大河的旁邊。', img: 'cairo.png', options: ['開羅', '埃及', '泰國', '廟'] },
      { id: 'v-地勢', cloze: true, clozeOptions: ['地勢', '天氣', '聲音', '味道'], word: '地勢', meaning: '路面和山坡高高低低的樣子。', example: '這裡的＿＿很高，可以看到整座城市。', img: 'terrain.png', options: ['地勢', '低窪', '築堤', '氣息'] },
      { id: 'v-低窪', cloze: true, clozeOptions: ['低窪', '高聳', '平坦', '陡峭'], word: '低窪', meaning: '比四周還要凹下去的地方。', example: '下大雨時，＿＿的地方容易淹水。', img: 'low-land.png', options: ['低窪', '地勢', '華麗', '逛逛'] },
      { id: 'v-築堤', cloze: true, clozeOptions: ['築堤', '種花', '釣魚', '游泳'], word: '築堤', meaning: '蓋起擋水的長牆。', example: '為了不讓海水淹進來，人們在海邊＿＿。', img: 'dike.png', options: ['築堤', '防潮', '划船', '和尚'] },
      { id: 'v-防潮', cloze: true, clozeOptions: ['防潮', '開窗', '洗澡', '玩水'], word: '防潮', meaning: '不讓海水或溼氣跑進來。', example: '這個箱子可以＿＿，衣服放在裡面不會發霉。', img: 'dike.png', options: ['防潮', '築堤', '地勢', '廟'] },
      { id: 'v-鬱金香', cloze: true, clozeOptions: ['鬱金香', '向日葵', '蒲公英', '牽牛花'], word: '鬱金香', meaning: '一種花，花朵像杯子，有紅、黃、粉紅等顏色。', example: '公園裡開滿了紅色的＿＿＿。', img: 'tulip.png', options: ['鬱金香', '華麗', '和尚', '低窪'] },
      { id: 'v-划船', cloze: true, clozeOptions: ['划船', '游泳', '滑雪', '騎車'], word: '划船', meaning: '用槳撥水，讓小舟往前走。', example: '我們在湖上＿＿，好涼快。', img: 'rowing.png', options: ['划船', '逛逛', '鬱金香', '築堤'] },
      { id: 'v-氣息', cloze: true, clozeOptions: ['氣息', '垃圾', '灰塵', '噪音'], word: '氣息', meaning: '讓人感覺到的味道或氛圍。', example: '春天到了，到處都是花香的＿＿。', img: 'music-town.png', options: ['氣息', '地勢', '防潮', '逛逛'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-佛', char: '佛', img: 'cw-buddha-statue.png', charMeaning: '佛教裡修行得很好的人。', word: '佛像', meaning: '寺廟裡拜的、安詳微笑的雕像。', example: '廟裡有一尊微笑的＿＿。', options: ['佛像', '廟會', '逛街', '羅盤'] },
      { id: 'cw-泰', char: '泰', img: 'cw-atayal.png', charMeaning: '平安；也用在名字裡。', word: '泰雅族', meaning: '住在臺灣北部山區的一個原住民族。', example: '＿＿＿的阿姨很會織布。', options: ['泰雅族', '佛像', '繁華', '水窪'] },
      { id: 'cw-廟', char: '廟', img: 'cw-temple-fair.png', charMeaning: '拜神、拜佛的地方。', word: '廟會', meaning: '在廟前舉辦的熱鬧活動，有表演和小吃。', example: '過年時的＿＿好熱鬧。', options: ['廟會', '時尚', '塵埃', '河堤'] },
      { id: 'cw-華', char: '華', img: 'cw-busy-city.png', charMeaning: '漂亮、熱鬧。', word: '繁華', meaning: '熱鬧、人很多、商店很多。', example: '晚上的大街燈火明亮，非常＿＿。', options: ['繁華', '手勢', '消防', '佛像'] },
      { id: 'cw-尚', char: '尚', img: 'cw-fashion.png', charMeaning: '往上、很好；流行。', word: '時尚', meaning: '跟得上流行，很好看。', example: '姐姐穿得很＿＿。', options: ['時尚', '潮水', '划算', '廟會'] },
      { id: 'cw-逛', char: '逛', img: 'cw-shopping.png', charMeaning: '到處走走看看。', word: '逛街', meaning: '在街上走走看看、買東西。', example: '星期天，媽媽帶我去＿＿。', options: ['逛街', '憂鬱', '羅盤', '泰雅族'] },
      { id: 'cw-埃', char: '埃', img: 'cw-dust.png', charMeaning: '細細的灰塵。', word: '塵埃', meaning: '很小很小的灰塵。', example: '陽光照進來，看得到空中飄著＿＿。', options: ['塵埃', '繁華', '河堤', '時尚'] },
      { id: 'cw-羅', char: '羅', img: 'cw-compass.png', charMeaning: '網子；也用在名字裡。', word: '羅盤', meaning: '可以指出方向的工具。', example: '以前的人用＿＿找方向。', options: ['羅盤', '水窪', '消防', '逛街'] },
      { id: 'cw-勢', char: '勢', img: 'cw-hand-sign.png', charMeaning: '樣子、力量。', word: '手勢', meaning: '用手比出來的動作，表示一個意思。', example: '警察舉手比出停下來的＿＿。', options: ['手勢', '塵埃', '廟會', '划算'] },
      { id: 'cw-窪', char: '窪', img: 'cw-puddle.png', charMeaning: '凹下去的地方。', word: '水窪', meaning: '地上積了水的小坑。', example: '下過雨，路上有好多小＿＿。', options: ['水窪', '時尚', '佛像', '潮水'] },
      { id: 'cw-堤', char: '堤', img: 'cw-riverbank.png', charMeaning: '擋水的長牆。', word: '河堤', meaning: '河邊擋水的長長土牆。', example: '傍晚，我們在＿＿上騎腳踏車。', options: ['河堤', '手勢', '憂鬱', '繁華'] },
      { id: 'cw-防', char: '防', img: 'cw-firefighter.png', charMeaning: '保護、擋住。', word: '消防', meaning: '救火、不讓火災發生。', example: '＿＿員勇敢的去救火。', options: ['消防', '羅盤', '逛街', '水窪'] },
      { id: 'cw-潮', char: '潮', img: 'cw-tide.png', charMeaning: '海水漲起來又退下去。', word: '潮水', meaning: '海邊一波一波漲起來又退下去的海水。', example: '海邊的＿＿一波一波湧上來。', options: ['潮水', '河堤', '泰雅族', '手勢'] },
      { id: 'cw-鬱', char: '鬱', img: 'cw-sad-rain.png', charMeaning: '悶悶的。', word: '憂鬱', meaning: '心裡悶悶的、不開心。', example: '下雨天，弟弟的心情有點＿＿。', options: ['憂鬱', '消防', '塵埃', '時尚'] },
      { id: 'cw-划', char: '划', img: 'cw-sale.png', charMeaning: '用槳撥水；值得。', word: '划算', meaning: '花得少、得到的多，很值得。', example: '買一送一好＿＿！', options: ['划算', '潮水', '佛像', '羅盤'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-否極泰來', situationImg: 'id-rainbow-after.png', idiom: '否極泰來', char: '泰', meaning: '倒楣的事到了最壞，就會慢慢變好。', example: '連輸了好幾場，球隊終於否極泰來，贏得冠軍。', situation: '小美感冒又跌倒，倒楣了好幾天。這天雨停了、出了彩虹，她還收到好朋友送的禮物。',
        fill: { options: ['輸了好多場比賽以後，球隊終於＿＿＿＿，贏了一場。', '他每天都很順利，從來沒有不好的事，一直＿＿＿＿。'], clue: '提示：哪一句是壞事過去，好事來了？', explain: '第一句用得對：輸了很多場以後終於贏了。每天都很順利，沒有壞事過去，就不是這個意思。' } },
      { id: 'i-門可羅雀', situationImg: 'id-empty-shop.png', idiom: '門可羅雀', char: '羅', meaning: '門口冷冷清清，客人很少。', example: '下大雨的晚上，夜市門可羅雀。', situation: '一家小店開在很偏僻的地方，一整天都沒有客人，只有麻雀在門口跳來跳去。',
        fill: { options: ['這家餐廳的菜不好吃，一直＿＿＿＿。', '這家店大排長龍，真是＿＿＿＿。'], clue: '提示：哪一句是客人很少、很冷清？', explain: '第一句用得對：菜不好吃，沒有客人。大排長龍，剛好相反。' } },
      { id: 'i-勢均力敵', situationImg: 'id-tug-war.png', idiom: '勢均力敵', char: '勢', meaning: '兩邊的力氣一樣大，分不出誰比較強。', example: '兩隊勢均力敵，比到最後一刻才分出輸贏。', situation: '兩班拔河，繩子中間的紅布一直停在正中間，誰也拉不動誰。',
        fill: { options: ['兩個選手＿＿＿＿，比了好久都不分上下。', '我們贏了二十分，兩隊真是＿＿＿＿。'], clue: '提示：哪一句是兩邊一樣強？', explain: '第一句用得對：比了好久分不出輸贏。贏了二十分，相差很多，就不是這個意思。' } },
      { id: 'i-防微杜漸', situationImg: 'id-small-crack.png', idiom: '防微杜漸', char: '防', meaning: '壞事剛開始一點點的時候，就趕快擋住，免得越變越大。', example: '弟弟第一次說謊，媽媽就好好跟他說，防微杜漸。', situation: '小安發現牆上有一條小小的裂縫，馬上請爸爸把它補好，免得越裂越大。',
        fill: { options: ['牙齒一有小蛀洞就去看醫生，這是＿＿＿＿。', '等牙齒痛得受不了才去看醫生，真是＿＿＿＿。'], clue: '提示：哪一句是在壞事還很小的時候，就趕快處理？', explain: '第一句用得對：小蛀洞就去看醫生，及早處理。等到很痛才去，剛好相反。' } },
      { id: 'i-心血來潮', situationImg: 'id-sudden-idea.png', idiom: '心血來潮', char: '潮', meaning: '突然想到要做一件事。', example: '爸爸心血來潮，晚上帶我們去吃冰。', situation: '小明正在吃飯，突然想到要畫一張卡片送媽媽，馬上跑去拿彩色筆。',
        fill: { options: ['姐姐＿＿＿＿，突然說要學彈吉他。', '他計畫了好幾個月才去旅行，真是＿＿＿＿。'], clue: '提示：哪一句是突然想到要做什麼？', explain: '第一句用得對：姐姐突然想學吉他。計畫了好幾個月，不是突然想到的。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-佛', char: '佛', wrong: '拂', sentence: '廟裡有一尊微笑的佛像。', options: ['佛', '拂', '沸'], clue: '這裡說的是寺廟裡拜的雕像，想一想，哪一個字有單人旁？', explain: '要改成「佛」。寺廟裡的雕像是「佛像」，有單人旁；「拂」的左邊是提手旁。' },
      { id: 'fx-泰', char: '泰', wrong: '秦', sentence: '泰雅族的阿姨很會織布。', options: ['泰', '秦', '奏'], clue: '這裡說的是一個原住民族，想一想，哪一個字的下面像「水」？', explain: '要改成「泰」。原住民族是「泰雅族」；「秦」的下面是「禾」。' },
      { id: 'fx-廟', char: '廟', wrong: '朝', sentence: '過年時，廟會好熱鬧。', options: ['廟', '朝', '潮'], clue: '這裡說的是拜拜的地方，想一想，哪一個字的外面是「广」？', explain: '要改成「廟」。拜拜的地方是「廟」，外面是广；「朝」是朝陽的朝。' },
      { id: 'fx-華', char: '華', wrong: '嘩', sentence: '晚上的大街燈火明亮，非常繁華。', options: ['華', '嘩', '畢'], clue: '這裡是說很熱鬧，想一想，哪一個字沒有口字旁？', explain: '要改成「華」。很熱鬧是「繁華」；「嘩」多了口字旁。' },
      { id: 'fx-尚', char: '尚', wrong: '常', sentence: '姐姐穿得很時尚。', options: ['尚', '常', '堂'], clue: '這裡是說跟得上流行，跟常常沒有關係。', explain: '要改成「尚」。跟得上流行是「時尚」；「常」是常常的常。' },
      { id: 'fx-逛', char: '逛', wrong: '狂', sentence: '星期天，媽媽帶我去逛街。', options: ['逛', '狂', '往'], clue: '這裡是說走走看看，想一想，哪一個字有辵字旁？', explain: '要改成「逛」。走走看看是「逛街」，有辵字旁；「狂」是瘋狂的狂。' },
      { id: 'fx-埃', char: '埃', wrong: '挨', sentence: '陽光照進來，看得到空中飄著塵埃。', options: ['埃', '挨', '唉'], clue: '這裡說的是小小的灰塵，想一想，哪一個字的左邊是土字旁？', explain: '要改成「埃」。小小的灰塵是「塵埃」，左邊是土；「挨」的左邊是提手旁。' },
      { id: 'fx-羅', char: '羅', wrong: '蘿', sentence: '以前的人用羅盤找方向。', options: ['羅', '蘿', '籮'], clue: '這裡說的是找方向的工具，跟蘿蔔沒有關係。', explain: '要改成「羅」。找方向的工具是「羅盤」；「蘿」是蘿蔔的蘿。' },
      { id: 'fx-勢', char: '勢', wrong: '熱', sentence: '警察舉手比出停下來的手勢。', options: ['勢', '熱', '藝'], clue: '這裡是說用手比的動作，想一想，哪一個字的下面是「力」？', explain: '要改成「勢」。用手比的動作是「手勢」，下面是力；「熱」的下面是四點。' },
      { id: 'fx-窪', char: '窪', wrong: '蛙', sentence: '下過雨，路上有好多小水窪。', options: ['窪', '蛙', '娃'], clue: '這裡說的是積了水的小坑，跟青蛙沒有關係。', explain: '要改成「窪」。積水的小坑是「水窪」，上面是穴字頭；「蛙」是青蛙的蛙。' },
      { id: 'fx-堤', char: '堤', wrong: '提', sentence: '傍晚，我們在河堤上騎腳踏車。', options: ['堤', '提', '題'], clue: '這裡說的是河邊擋水的長牆，想一想，哪一個字的左邊是土字旁？', explain: '要改成「堤」。河邊的長牆是「河堤」，左邊是土；「提」的左邊是提手旁。' },
      { id: 'fx-防', char: '防', wrong: '房', sentence: '消防員勇敢的去救火。', options: ['防', '房', '放'], clue: '這裡是說救火、不讓火災發生，跟房間沒有關係。', explain: '要改成「防」。救火是「消防」；「房」是房間的房。' },
      { id: 'fx-潮', char: '潮', wrong: '朝', sentence: '海邊的潮水一波一波湧上來。', options: ['潮', '朝', '嘲'], clue: '這裡說的是海水漲起來，想一想，哪一個字有三點水？', explain: '要改成「潮」。漲起來的海水是「潮水」，有三點水；「朝」是朝陽的朝。' },
      { id: 'fx-鬱', char: '鬱', wrong: '郁', sentence: '下雨天，弟弟的心情有點憂鬱。', options: ['鬱', '郁', '育'], clue: '這裡是說心裡悶悶的，想一想，哪一個字的筆畫特別多？', explain: '要改成「鬱」。心裡悶悶的是「憂鬱」；「郁」是濃郁的郁。' },
      { id: 'fx-划', char: '划', wrong: '化', sentence: '買一送一好划算！', options: ['划', '化', '劃'], clue: '這裡是說很值得，想一想，哪一個字的左邊是「戈」？', explain: '要改成「划」。很值得是「划算」，左邊是戈；「化」是變化的化。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿騰」是水燒開了、一直冒泡泡。', sentence: '水壺裡的水＿騰了。', frame: '＿騰', options: ['沸', '佛'], answer: '沸', clue: '提示：這個字的左邊是三點水。', explain: '答案是「沸」；「佛」是佛像的佛，有單人旁。' },
      { id: 's2', meaning: '「演＿」是用樂器表演音樂。', sentence: '姐姐在臺上演＿小提琴。', frame: '演＿', options: ['奏', '泰'], answer: '奏', clue: '提示：這個字的下面是「天」。', explain: '答案是「奏」；「泰」是泰國的泰。' },
      { id: 's3', meaning: '「＿陽」是早上剛出來的太陽。', sentence: '早上的＿陽好溫暖。', frame: '＿陽', options: ['朝', '廟'], answer: '朝', clue: '提示：這個字的外面沒有「广」。', explain: '答案是「朝」；「廟」是廟會的廟。' },
      { id: 's4', meaning: '「食＿」是大家一起吃飯的大房間。', sentence: '中午，大家到食＿吃飯。', frame: '食＿', options: ['堂', '尚'], answer: '堂', clue: '提示：這個字的下面是「土」。', explain: '答案是「堂」；「尚」是時尚的尚。' },
      { id: 's5', meaning: '「＿風」是非常大、很可怕的風。', sentence: '一陣＿風吹倒了好多樹。', frame: '＿風', options: ['狂', '逛'], answer: '狂', clue: '提示：這個字的左邊是犬字旁。', explain: '答案是「狂」；「逛」是逛街的逛，有辵字旁。' },
      { id: 's6', meaning: '「＿罵」是被別人罵。', sentence: '弟弟打破花瓶，＿了一頓罵。', frame: '＿罵', options: ['挨', '埃'], answer: '挨', clue: '提示：這個字的左邊是提手旁。', explain: '答案是「挨」；「埃」是塵埃的埃。' },
      { id: 's7', meaning: '「＿蔔」是一種白白長長的蔬菜。', sentence: '媽媽煮了一鍋＿蔔湯。', frame: '＿蔔', options: ['蘿', '羅'], answer: '蘿', clue: '提示：這個字有草字頭。', explain: '答案是「蘿」；「羅」是羅盤的羅。' },
      { id: 's8', meaning: '「＿鬧」是人很多、很好玩。', sentence: '過年的街上好＿鬧。', frame: '＿鬧', options: ['熱', '勢'], answer: '熱', clue: '提示：這個字的下面是四點。', explain: '答案是「熱」；「勢」是手勢的勢，下面是力。' },
      { id: 's9', meaning: '「青＿」是會呱呱叫的動物。', sentence: '池塘邊有一隻青＿。', frame: '青＿', options: ['蛙', '窪'], answer: '蛙', clue: '提示：這個字的左邊是虫字旁。', explain: '答案是「蛙」；「窪」是水窪的窪。' },
      { id: 's10', meaning: '「＿目」是考卷上要作答的地方。', sentence: '這次考試的＿目不難。', frame: '＿目', options: ['題', '堤'], answer: '題', clue: '提示：這個字的右邊是「頁」。', explain: '答案是「題」；「堤」是河堤的堤。' },
      { id: 's11', meaning: '「＿間」是家裡的一個小空間。', sentence: '我的＿間很整齊。', frame: '＿間', options: ['房', '防'], answer: '房', clue: '提示：這個字的上面是「戶」。', explain: '答案是「房」；「防」是消防的防。' },
      { id: 's12', meaning: '「計＿」是先想好要怎麼做。', sentence: '我們先計＿好暑假要去哪裡。', frame: '計＿', options: ['劃', '划'], answer: '劃', clue: '提示：這個字的左邊有「畫」。', explain: '答案是「劃」；「划」是划船的划。' }
    ],
    listen: [
      { id: 'l1', text: '有很多很多寺廟和佛像的國家。', answer: 0, options: [{ text: '千佛之國', img: 'temple.png' }, { text: '低窪', img: 'low-land.png' }, { text: '划船', img: 'rowing.png' }, { text: '鬱金香', img: 'tulip.png' }] },
      { id: 'l2', text: '穿著橘黃色衣服、出家修行的男生。', answer: 0, options: [{ text: '和尚', img: 'monk.png' }, { text: '開羅', img: 'cairo.png' }, { text: '築堤', img: 'dike.png' }, { text: '地勢', img: 'terrain.png' }] },
      { id: 'l3', text: '一塊地比四周還要低，下雨容易積水。', answer: 0, options: [{ text: '低窪', img: 'low-land.png' }, { text: '華麗', img: 'golden-temple.png' }, { text: '和尚', img: 'monk.png' }, { text: '氣息', img: 'music-town.png' }] },
      { id: 'l4', text: '在海邊蓋起又長又高的牆，擋住海水。', answer: 0, options: [{ text: '築堤', img: 'dike.png' }, { text: '划船', img: 'rowing.png' }, { text: '逛逛', img: 'float-market.png' }, { text: '埃及', img: 'pyramid.png' }] },
      { id: 'l5', text: '花朵像杯子，有紅色、黃色和粉紅色。', answer: 0, options: [{ text: '鬱金香', img: 'tulip.png' }, { text: '華麗', img: 'golden-temple.png' }, { text: '千佛之國', img: 'temple.png' }, { text: '低窪', img: 'low-land.png' }] },
      { id: 'l6', text: '坐在小船上，用槳撥水往前走。', answer: 0, options: [{ text: '划船', img: 'rowing.png' }, { text: '築堤', img: 'dike.png' }, { text: '地勢', img: 'terrain.png' }, { text: '和尚', img: 'monk.png' }] },
      { id: 'l7', text: '沙漠裡有又大又高的金字塔的國家。', answer: 0, options: [{ text: '埃及', img: 'pyramid.png' }, { text: '泰國', img: 'thailand.png' }, { text: '鬱金香', img: 'tulip.png' }, { text: '逛逛', img: 'float-market.png' }] },
      { id: 'l8', text: '在熱鬧的市場裡，隨意走走看看。', answer: 0, options: [{ text: '逛逛', img: 'float-market.png' }, { text: '划船', img: 'rowing.png' }, { text: '低窪', img: 'low-land.png' }, { text: '華麗', img: 'golden-temple.png' }] }
    ],
    /* ---------- 短語短句、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看它有哪兩個樣子。',
      /* 短語：什麼＋又＿＿又＿＿（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '西瓜又大又甜', img: 'pr-watermelon.png',
        parts: [{ text: '西瓜', role: '什麼' }, { text: '又' }, { text: '大', role: '怎麼樣' }, { text: '又' }, { text: '甜', role: '怎麼樣' }],
        explain: '先說是什麼，再用「又……又……」一口氣說出它的兩個樣子。' },
      pick: [
        { id: 'ph1', img: 'pr-kitten.png', before: '小貓', join: '', noun: '。', ask: '小貓怎麼樣', look: '再看看圖片，小貓縮在手掌上，看起來怎麼樣？', options: ['又小又軟', '又硬又重', '又酸又苦', '又長又細'], clue: '提示：牠縮在手掌上，摸起來像棉花。', explain: '答案是「又小又軟」，完整的短語是「小貓又小又軟」。' },
        { id: 'ph2', img: 'pr-mountain-road.png', before: '山路', join: '', noun: '。', ask: '山路怎麼樣', look: '再看看圖片，山路是直的還是繞來繞去？', options: ['又彎又窄', '又白又細', '又酸又苦', '又香又甜'], clue: '提示：路繞來繞去，只容得下一個人走。', explain: '答案是「又彎又窄」，完整的短語是「山路又彎又窄」。' },
        { id: 'ph3', img: 'pr-noodle.png', before: '麵線', join: '', noun: '。', ask: '麵線怎麼樣', look: '再看看圖片，筷子夾起來的麵線是什麼樣子？', options: ['又長又細', '又硬又重', '又彎又窄', '又酸又苦'], clue: '提示：筷子夾起來拉得好遠，像頭髮一樣。', explain: '答案是「又長又細」，完整的短語是「麵線又長又細」。' },
        { id: 'ph4', img: 'pr-rock.png', before: '石頭', join: '', noun: '。', ask: '石頭怎麼樣', look: '再看看圖片，孩子搬得動嗎？', options: ['又大又重', '又小又軟', '又香又甜', '又長又細'], clue: '提示：孩子用盡力氣，還是搬不動。', explain: '答案是「又大又重」，完整的短語是「石頭又大又重」。' },
        { id: 'ph5', img: 'pr-beach.png', before: '沙灘', join: '', noun: '。', ask: '沙灘怎麼樣', look: '再看看圖片，沙子是什麼顏色？', options: ['又白又細', '又黑又硬', '又酸又苦', '又彎又窄'], clue: '提示：沙子顏色像雪，摸起來像麵粉。', explain: '答案是「又白又細」，完整的短語是「沙灘又白又細」。' },
        { id: 'ph6', img: 'pr-lemon.png', before: '檸檬', join: '', noun: '。', ask: '檸檬怎麼樣', look: '再看看圖片，孩子吃了一口，表情怎麼樣？', options: ['又黃又酸', '又黑又硬', '又長又細', '又大又重'], clue: '提示：顏色像香蕉皮，吃一口眼睛都瞇起來了。', explain: '答案是「又黃又酸」，完整的短語是「檸檬又黃又酸」。' }
      ],
      /* 拼短語：自己切好每一塊（每格說明用上面 intro 的每一塊） */
      fill: [
        { id: 'pf1', img: 'pr-kitten.png', parts: ['小貓', '又', '小', '又', '軟'] },
        { id: 'pf2', img: 'pr-mountain-road.png', parts: ['山路', '又', '彎', '又', '窄'] },
        { id: 'pf3', img: 'pr-noodle.png', parts: ['麵線', '又', '長', '又', '細'] },
        { id: 'pf4', img: 'pr-rock.png', parts: ['石頭', '又', '大', '又', '重'] },
        { id: 'pf5', img: 'pr-beach.png', parts: ['沙灘', '又', '白', '又', '細'] }
      ],
      say: [],
      /* 短句：什麼＋就是為了＋做什麼＋而＋怎麼來的＋的（課本的例子是課文原句，這裡換成自己寫的） */
      phrase2: {
        intro: { example: '雨傘就是為了遮雨而做的', img: 'pz-umbrella.png',
          parts: [{ text: '雨傘', role: '什麼' }, { text: '就是' }, { text: '為了' }, { text: '遮雨', role: '為了做什麼' }, { text: '而' }, { text: '做', role: '怎麼來的' }, { text: '的' }],
          explain: '先說是什麼東西，再用「就是為了……而……的」說出它是為了什麼才有的。' },
        pick: [
          { id: 'p2-pz1', img: 'pz-lighthouse-ship.png', before: '燈塔就是為了', join: '', noun: '而蓋的', ask: '燈塔就是為了什麼而蓋的', look: '再看看圖片，燈塔的光照向哪裡？', options: ['指引船隻', '種花種菜', '放映電影', '養小金魚'], clue: '提示：晚上海上很黑，海上的人需要光才知道往哪裡開。', explain: '答案是「指引船隻」，完整的短句是「燈塔就是為了指引船隻而蓋的」。' },
          { id: 'p2-pz2', img: 'pz-crosswalk.png', before: '斑馬線就是為了', join: '', noun: '而畫的', ask: '斑馬線就是為了什麼而畫的', look: '再看看圖片，誰走在斑馬線上？', options: ['保護行人', '裝飾馬路', '讓車開快', '給斑馬走'], clue: '提示：過馬路的大朋友、小朋友走在上面，車子要停下來等。', explain: '答案是「保護行人」，完整的短句是「斑馬線就是為了保護行人而畫的」。' },
          { id: 'p2-pz3', img: 'pz-alarm.png', before: '鬧鐘就是為了', join: '', noun: '而買的', ask: '鬧鐘就是為了什麼而買的', look: '再看看圖片，鬧鐘響的時候孩子在做什麼？', options: ['叫我起床', '陪我睡覺', '幫我寫字', '幫我洗碗'], clue: '提示：早上時間一到，它就鈴鈴響。', explain: '答案是「叫我起床」，完整的短句是「鬧鐘就是為了叫我起床而買的」。' },
          { id: 'p2-pz4', img: 'pz-fence.png', before: '圍欄就是為了', join: '', noun: '而做的', ask: '圍欄就是為了什麼而做的', look: '再看看圖片，圍欄裡面有誰？', options: ['保護小羊', '擋住陽光', '裝飾草地', '給小鳥住'], clue: '提示：有了它，大野狼就跑不進來了。', explain: '答案是「保護小羊」，完整的短句是「圍欄就是為了保護小羊而做的」。' },
          { id: 'p2-pz5', img: 'pz-bridge.png', before: '這座橋就是為了', join: '', noun: '而建的', ask: '這座橋就是為了什麼而建的', look: '再看看圖片，大家從橋上走到哪裡？', options: ['讓大家過河', '讓魚游泳', '讓車停下', '讓人釣魚'], clue: '提示：有了它，不用游泳就能走到對岸。', explain: '答案是「讓大家過河」，完整的短句是「這座橋就是為了讓大家過河而建的」。' }
        ],
        fill: [
          { id: 'pz1', img: 'pz-lighthouse-ship.png', parts: ['燈塔', '就是', '為了', '指引船隻', '而', '蓋', '的'] },
          { id: 'pz2', img: 'pz-crosswalk.png', parts: ['斑馬線', '就是', '為了', '保護行人', '而', '畫', '的'] },
          { id: 'pz3', img: 'pz-alarm.png', parts: ['鬧鐘', '就是', '為了', '叫我起床', '而', '買', '的'] },
          { id: 'pz4', img: 'pz-fence.png', parts: ['圍欄', '就是', '為了', '保護小羊', '而', '做', '的'] },
          { id: 'pz5', img: 'pz-bridge.png', parts: ['這座橋', '就是', '為了', '讓大家過河', '而', '建', '的'] }
        ]
      },
      words: [], choose: [], make: []
    },
    pattern: [
      { key: 'suoyi', id: 'sy', title: '……所以……', img: 'suoyi.png',
        meaning: '先說原因，再用「所以」說出因為這樣才有的結果。',
        examples: ['他每天認真練跳繩，所以拿到了獎牌。'],
        match: [
          { id: 'pt-sy-m1', img: 'pt-rain-wet.png', front: '我忘了帶雨傘，', options: ['所以全身都淋溼了。', '所以中午吃了麵。', '所以跑去買冰淇淋。'], clue: '提示：看看圖片，沒帶傘遇到下雨，會怎麼樣？', explain: '答案是「所以全身都淋溼了」：沒帶傘是原因，淋溼是結果。' },
          { id: 'pt-sy-m2', img: 'pt-sleep-late.png', front: '昨天晚上太晚睡，', options: ['所以上課一直打瞌睡。', '所以變得很有精神。', '所以長出了一對翅膀。'], clue: '提示：看看圖片，睡不夠的孩子上課怎麼了？', explain: '答案是「所以上課一直打瞌睡」：太晚睡是原因，打瞌睡是結果。' },
          { id: 'pt-sy-m3', img: 'pt-practice-win.png', front: '他每天認真練習，', options: ['所以比賽得到冠軍。', '所以每天都在睡覺。', '所以忘了怎麼走路。'], clue: '提示：看看圖片，他站在頒獎臺上拿著什麼？', explain: '答案是「所以比賽得到冠軍」：認真練習是原因，得冠軍是結果。' }
        ],
        conj: [
          { id: 'pt-sy-c1', full: '肚子好餓，所以吃了兩碗飯。', img: 'pt-hungry-eat.png', sentence: '肚子好餓，＿＿吃了兩碗飯。', options: ['……所以……', '當……就……', '不但……還……'], clue: '提示：前面說原因，後面說結果。數數看有幾個空格。', explain: '答案是「……所以……」：肚子好餓，所以吃了兩碗飯。' },
          { id: 'pt-sy-c2', full: '天氣變冷了，所以我穿上厚外套。', img: 'pt-cold-coat.png', sentence: '天氣變冷了，＿＿我穿上厚外套。', options: ['……所以……', '當……就……', '不但……還……'], clue: '提示：天冷是原因，穿外套是結果。數數看有幾個空格。', explain: '答案是「……所以……」：天氣變冷了，所以我穿上厚外套。' },
          { id: 'pt-sy-c3', full: '我每天幫花澆水，所以花開得好漂亮。', img: 'pt-water-flower.png', sentence: '我每天幫花澆水，＿＿花開得好漂亮。', options: ['……所以……', '當……就……', '不但……還……'], clue: '提示：澆水是原因，花開是結果。數數看有幾個空格。', explain: '答案是「……所以……」：我每天幫花澆水，所以花開得好漂亮。' }
        ],
        half: [
          { id: 'pt-sy-h1', front: '今天是我的生日，', clue: '提示：因為過生日，會有什麼結果？記得要說「所以」。', model: '所以媽媽買了一個大蛋糕。' },
          { id: 'pt-sy-h2', front: '弟弟把房間弄得好亂，', clue: '提示：房間很亂，接著會怎麼樣？記得要說「所以」。', model: '所以被媽媽叫去整理。' }
        ],
        whole: [
          { id: 'pt-sy-w1', clue: '提示：先說原因，再用「所以」說結果。想想看：你每天做了什麼好習慣？有什麼好結果？', model: '我每天早睡早起，所以上課很有精神。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'redup', name: '疊字', meaning: '同一個字連在一起重複用，讀起來更好聽，也更生動。', example: '課文說尼羅河「緩緩」流過，把「緩」連著說了兩次。',
          show: { sentence: '海水藍藍的，好清澈。' },
          yesno: [
            { id: 'rh-re-y1', sentence: '小船輕輕的划過湖面。', answer: true, clue: '提示：形容小船的字裡，有沒有同一個字連在一起？', explain: '是疊字：「輕輕」把「輕」重複說了。' },
            { id: 'rh-re-y2', sentence: '小船划過湖面。', answer: false, clue: '提示：仔細聽，有沒有同一個字連在一起？', explain: '不是疊字：這句話沒有重複的字。' }
          ],
          pick: [
            { id: 'rh-re-p1', options: ['寺廟的屋頂亮亮的。', '寺廟的屋頂很亮。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「亮亮」是疊字：「亮」重複了。' },
            { id: 'rh-re-p2', options: ['駱駝慢慢的走過沙漠。', '駱駝走過沙漠。'], clue: '提示：仔細聽，哪一句多了重複的字？', explain: '「慢慢」是疊字：「慢」重複了。' },
            { id: 'rh-re-p3', options: ['鬱金香紅紅的，好美。', '鬱金香是紅色的。', '鬱金香像杯子。'], clue: '提示：哪一句有同一個字連在一起？', explain: '「紅紅」是疊字：「紅」重複了。' },
            { id: 'rh-re-p4', options: ['風車大大的，轉個不停。', '風車很大。', '風車在跳舞。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「大大」是疊字：「大」重複了。' },
            { id: 'rh-re-p5', options: ['沙漠熱熱的，好難受。', '沙漠很熱。', '沙漠像一個火爐。', '沙漠裡有駱駝。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「熱熱」是疊字：「熱」重複了。' },
            { id: 'rh-re-p6', options: ['湖水靜靜的，一點聲音也沒有。', '湖水很安靜。', '湖面很平。', '湖邊有人在划船。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「靜靜」是疊字：「靜」重複了。' }
          ] },
        { key: 'repeat', name: '類疊', meaning: '同一個詞或同一句話，隔開來重複說好幾次，讀起來有節奏，也讓人印象更深。', example: '課文每一段的開頭和結尾，都重複同一句邀請的話。',
          show: { sentence: '來吧，來吧，一起去旅行！', mark: ['來吧'] },
          yesno: [
            { id: 'rh-rp-y1', sentence: '快來看，快來看，船來了！', answer: true, mark: ['快來看'], clue: '提示：找找看，有沒有同一句話隔開來說了好幾次？', explain: '是類疊：「快來看」說了兩次。' },
            { id: 'rh-rp-y2', sentence: '船來了。', answer: false, clue: '提示：這句話裡，有沒有同一句話說了好幾次？', explain: '不是類疊：這句話沒有重複說同一句話。' }
          ],
          pick: [
            { id: 'rh-rp-p1', mark: ['歡迎你'], options: ['歡迎你，歡迎你，來我們的學校！', '我們的學校很漂亮。'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「歡迎你」說了兩次，是類疊。' },
            { id: 'rh-rp-p2', mark: ['我想去'], options: ['我想去泰國，我想去埃及。', '我想出國玩。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「我想去」說了兩次，是類疊。' },
            { id: 'rh-rp-p3', mark: ['看呀'], options: ['看呀！看呀！金字塔好高！', '金字塔很高。', '金字塔像一座山。'], clue: '提示：哪一句有同一個詞，說了好幾次？', explain: '「看呀」說了兩次，是類疊。' },
            { id: 'rh-rp-p4', mark: ['這裡有'], options: ['這裡有沙漠，這裡有大河，這裡有金字塔。', '埃及有很多景點。', '埃及的太陽好熱。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「這裡有」說了三次，是類疊。' },
            { id: 'rh-rp-p5', mark: ['好想'], options: ['好想划船，好想滑雪。', '我想去玩。', '雪山在對我招手。', '滑雪真好玩！'], clue: '提示：哪一句有同一個詞，隔開來說了兩次？', explain: '「好想」說了兩次，是類疊。' },
            { id: 'rh-rp-p6', mark: ['再見了'], options: ['再見了，大海；再見了，沙灘。', '我們要回家了。', '大海像一面藍色的鏡子。', '誰不愛大海呢？'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「再見了」說了兩次，是類疊。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '月亮圓圓的，掛在天上。', answer: '疊字', clue: '提示：形容月亮的字裡，有沒有同一個字連在一起？', explain: '答案是「疊字」：「圓圓」把「圓」連著說了兩次。' },
        { id: 'rh2', sentence: '小溪彎彎的流過草地。', answer: '疊字', clue: '提示：仔細聽，形容小溪的字有沒有連著重複？', explain: '答案是「疊字」：「彎彎」把「彎」連著說了兩次。' },
        { id: 'rh3', sentence: '快出發，快出發，船要開了！', answer: '類疊', mark: ['快出發'], clue: '提示：有沒有同一句話，隔開來說了好幾次？', explain: '答案是「類疊」：「快出發」說了兩次。' },
        { id: 'rh4', sentence: '我愛山，我愛海，我愛我的家鄉。', answer: '類疊', mark: ['我愛'], clue: '提示：找找看，有沒有同一個詞隔開來說了好幾次？', explain: '答案是「類疊」：「我愛」說了三次。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L09 = d; }
})(this);
