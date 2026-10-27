/* 第 7 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 人事時地物：選項第一個是答案；paras 是提示要用到的段落 */
    wh: [
      { id: 'wh-ren', key: '人', options: ['巧文姐姐和全班同學', '巧文姐姐和她的家人', '校長和老師們', '廚師和客人'], paras: [1, 4], why: '巧文姐姐是一位美食作家，她來到班上和全班同學分享。' },
      { id: 'wh-shi', key: '事', options: ['分享美食、做壽司', '到餐廳吃大餐', '去公園野餐', '參加運動會'], paras: [2, 4], why: '巧文姐姐分享各國美食，最後帶大家動手做壽司。' },
      { id: 'wh-time', key: '時', options: ['星期二下午', '星期一早上', '星期六晚上', '過年的時候'], paras: [1], why: '課文一開始就說，巧文姐姐是星期二下午來的。' },
      { id: 'wh-di', key: '地', options: ['教室', '廚房', '公園', '夜市'], paras: [1, 6], why: '巧文姐姐到班上分享，大家在教室裡上這堂課。' },
      { id: 'wh-wu', key: '物', options: ['甩餅、義大利麵和壽司', '漢堡、薯條和可樂', '水餃、湯圓和粽子', '蛋糕、餅乾和布丁'], paras: [2, 3, 4], why: '巧文姐姐介紹了印度甩餅、義大利麵，還帶大家做壽司。' }
    ],
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qc: 'extract', qd: 'extract', qe: 'extract', qf: 'extract', qb: 'infer', qg: 'infer', qh: 'interpret',
      qi: 'evaluate', qj: 'evaluate', k1: 'evaluate', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qh: { think: ['課文最後，巧文姐姐說了三種認識國家的方法，各是什麼？', '她說她「最喜歡」的是哪一種？味覺和什麼有關？'], why: '巧文姐姐說，有人用文字、有人用照片，她最喜歡用味覺，也就是吃當地的食物，來認識不同的文化。' },
      qi: { think: ['這堂課裡，大家看到、聽到、吃到了什麼？', '題目的「美味」和「一堂課」，跟這堂課的內容有沒有關係？'], why: '這堂課大家認識了印度、義大利、日本的美食，還自己做壽司來吃，又好吃又學到東西，所以叫「美味的一堂課」很適合。' },
      qj: { think: ['巧文姐姐去過哪些地方？她回來以後做了什麼？', '她跟同學說話、帶同學做壽司的時候，心情怎麼樣？'], why: '巧文姐姐到很多國家旅行，還很開心的把看到、吃到的分享給大家，帶大家動手做，所以她是喜歡旅行、也很樂意分享的人。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我會介紹珍珠奶茶，因為甜甜的，珍珠又很有彈性。', '我會介紹滷肉飯，因為很香，大家都很愛吃。'], bad: ['我會介紹義大利麵，因為它是臺灣的美食。', '我不想介紹，因為我不喜歡吃東西。'], why: '題目要介紹的是臺灣美食，還要說出原因。珍珠奶茶、滷肉飯都是臺灣有名的食物。義大利麵是義大利的食物；不想介紹，就沒有回答問題。' },
      k2: { good: ['我想去日本吃拉麵，因為湯頭很香。', '我想去義大利吃披薩，因為想吃當地的味道。'], bad: ['我想去學校吃營養午餐。', '我想去月亮上吃石頭。'], why: '題目問的是想去哪一個國家吃什麼美食。去日本吃拉麵、去義大利吃披薩，都有說到國家和美食。學校不是國家，月亮上也沒有美食。' }
    },
    hanzi: [
      { id: 'h-薄', combo: { layout: 'tb', parts: [['艹', 'm', '草'], ['溥', 's', '']] }, char: '薄', zhuyin: 'ㄅㄛˊ', radical: '艸', strokes: 17, words: ['薄', '薄荷'], say: '薄，薄荷的薄', cloze: '＿荷', img: 'cw-mint.png', options: ['薄', '簿', '博', '溥'], clue: '這個字的下面是「溥」，上面是草字頭。', explain: '答案是「薄」，上面是草字頭；「簿」的上面是竹字頭，「博」的左邊是「十」。', parts: ['艹', '溥'], story: '上面是草字頭，下面的「溥」念起來像「薄」。很久以前說草長得很密，後來用來說東西「不厚」。', sentence: '冬天的早上，水面結了一層薄冰。', build: { layout: 'tb', show: ['？', '溥'], answer: '艹', options: ['艹', '竹', '雨', '山'], clue: '想一想：「簿」的上面是竹，這個字的上面和草有關。' } },
      { id: 'h-烙', combo: { layout: 'lr', parts: [['火', 'm', '火'], ['各', 's', '']] }, char: '烙', zhuyin: 'ㄌㄠˋ', radical: '火', strokes: 10, words: ['烙', '烙餅'], say: '烙，烙餅的烙', cloze: '＿餅', img: 'cw-scallion-pancake.png', options: ['烙', '洛', '絡', '落'], clue: '這個字的右邊是「各」，左邊和熱熱的東西有關。', explain: '答案是「烙」，左邊是火字旁；「洛」的左邊是三點水，「絡」的左邊是絲線。', parts: ['火', '各'], story: '左邊是火，右邊的「各」念起來有點像「烙」。把餅放在燒熱的鍋子上烤熟，就是「烙」。', sentence: '奶奶在鍋子上烙了一張蔥油餅。', build: { layout: 'lr', show: ['？', '各'], answer: '火', options: ['火', '氵', '糸', '木'], clue: '想一想：把餅放在熱鍋上烤，左邊和什麼有關？' } },
      { id: 'h-沾', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['占', 's', '']] }, char: '沾', zhuyin: 'ㄓㄢ', radical: '水', strokes: 8, words: ['沾', '沾滿'], say: '沾，沾滿的沾', cloze: '＿滿', img: 'cw-muddy-shoes.png', options: ['沾', '站', '粘', '佔'], clue: '這個字的右邊是「占」，左邊和水有關。', explain: '答案是「沾」，左邊是三點水；「站」的左邊是「立」，「佔」的左邊是單人旁。', parts: ['氵', '占'], story: '左邊是水，右邊的「占」念起來像「沾」。碰到水或醬，東西黏在上面，就是「沾」。', sentence: '下雨天，我的鞋子沾滿了泥巴。', build: { layout: 'lr', show: ['？', '占'], answer: '氵', options: ['氵', '立', '米', '亻'], clue: '想一想：碰到水，溼溼的黏在上面。' } },
      { id: 'h-咖', combo: { layout: 'lr', parts: [['口', 'm', '嘴巴'], ['加', 's', '']] }, char: '咖', zhuyin: 'ㄎㄚ', radical: '口', strokes: 8, words: ['咖哩', '咖啡'], say: '咖，咖啡的咖', cloze: '＿啡', img: 'cw-coffee.png', options: ['咖', '伽', '加', '茄'], clue: '這個字的右邊是「加」，左邊和嘴巴有關。', explain: '答案是「咖」，左邊是口字旁；「加」沒有口，「茄」的上面是草字頭。', parts: ['口', '加'], story: '左邊是口，右邊的「加」念起來像「咖」。用嘴巴念出外國話的聲音，就寫成「咖」，像「咖啡」、「咖哩」。', sentence: '爸爸每天早上喝一杯咖啡。', build: { layout: 'lr', show: ['？', '加'], answer: '口', options: ['口', '亻', '艹', '木'], clue: '想一想：這個字是念出外國話的聲音，左邊和嘴巴有關。' } },
      { id: 'h-哩', combo: { layout: 'lr', parts: [['口', 'm', '嘴巴'], ['里', 's', '']] }, char: '哩', zhuyin: 'ㄌㄧˇ', radical: '口', strokes: 10, words: ['咖哩', '咖哩飯'], say: '哩，咖哩的哩', cloze: '咖＿', img: 'cw-curry-rice.png', options: ['哩', '里', '狸', '理'], clue: '這個字的右邊是「里」，左邊和嘴巴有關。', explain: '答案是「哩」，左邊是口字旁；「里」沒有口，「狸」的左邊是犬字旁，「理」的左邊是玉字旁。', parts: ['口', '里'], story: '左邊是口，右邊的「里」念起來像「哩」。也是用來念外國話的聲音，像「咖哩」。', sentence: '今天的午餐是咖哩飯。', build: { layout: 'lr', show: ['？', '里'], answer: '口', options: ['口', '犭', '王', '土'], clue: '想一想：這個字用來念外國話的聲音，左邊和嘴巴有關。' } },
      { id: 'h-印', combo: { type: '會意字', pict: '很久以前的「印」，像一隻手壓著一個跪著的人。用手往下壓，就是「印」，後來說蓋印章。' }, char: '印', zhuyin: 'ㄧㄣˋ', radical: '卩', strokes: 6, words: ['印度', '印章'], say: '印，印章的印', cloze: '＿章', img: 'cw-stamp.png', options: ['印', '卯', '仰', '抑'], clue: '這個字的左邊像一隻手往下壓。', explain: '答案是「印」；「仰」多了單人旁，「抑」多了提手旁。', parts: ['印'], story: '「印」像一隻手往下壓。用印章往紙上一壓，就留下印子，所以叫「印章」。', sentence: '老師在我的作業上蓋了一個印章。' },
      { id: 'h-甩', combo: { type: '指事字', pict: '「甩」長得很像「用」，可是中間那一豎往右邊甩出去，好像東西被用力甩開。' }, char: '甩', zhuyin: 'ㄕㄨㄞˇ', radical: '用', strokes: 5, words: ['甩餅', '甩動'], say: '甩，甩動的甩', cloze: '＿動', img: 'cw-dog-shake.png', options: ['甩', '用', '角', '冊'], clue: '這個字長得很像「用」，可是中間一豎往右彎。', explain: '答案是「甩」，中間一豎往右彎；「用」的中間一豎是直的。', parts: ['甩'], story: '「甩」和「用」很像，可是中間的一豎往右邊甩出去，好像把東西用力甩開一樣。', sentence: '小狗甩動身體，把水弄乾。' },
      { id: 'h-材', combo: { layout: 'lr', parts: [['木', 'm', '木頭'], ['才', 's', '']] }, char: '材', zhuyin: 'ㄘㄞˊ', radical: '木', strokes: 7, words: ['食材', '木材'], say: '材，木材的材', cloze: '木＿', img: 'cw-wood.png', options: ['材', '財', '村', '柴'], clue: '這個字的右邊是「才」，左邊和樹木有關。', explain: '答案是「材」，左邊是木字旁；「財」的左邊是「貝」，「村」的右邊是「寸」。', parts: ['木', '才'], story: '左邊是木，右邊的「才」念起來像「材」。可以拿來蓋房子、做東西的木頭，就是「木材」；做菜用的東西叫「食材」。', sentence: '這間小屋是用木材蓋的。', build: { layout: 'lr', show: ['？', '才'], answer: '木', options: ['木', '貝', '火', '禾'], clue: '想一想：「財」的左邊是貝，蓋房子用的東西，左邊放什麼？' } },
      { id: 'h-醬', combo: { layout: 'tb', parts: [['將', 's', ''], ['酉', 'm', '酒罈']] }, char: '醬', zhuyin: 'ㄐㄧㄤˋ', radical: '酉', strokes: 18, words: ['醬料', '醬油'], say: '醬，醬油的醬', cloze: '＿油', img: 'cw-soy-sauce.png', options: ['醬', '將', '漿', '獎'], clue: '這個字的上面是「將」。', explain: '答案是「醬」，下面是「酉」；「漿」的下面是「水」，「獎」的下面是「大」。', parts: ['將', '酉'], story: '上面的「將」念起來像「醬」，下面的「酉」是罈子。放在罈子裡慢慢做出來的調味料，就是「醬」。', sentence: '媽媽炒菜時加了一點醬油。', build: { layout: 'tb', show: ['將', '？'], answer: '酉', options: ['酉', '水', '犬', '木'], clue: '想一想：醬是放在罈子裡慢慢做的，下面放裝東西的罈子。' } },
      { id: 'h-義', combo: { type: '會意字', pict: '上面是「羊」，下面是「我」。很久以前，羊代表美好的事，「義」就是自己去做好的、應該做的事。' }, char: '義', zhuyin: 'ㄧˋ', radical: '羊', strokes: 13, words: ['義大利', '義工'], say: '義，義工的義', cloze: '＿工', img: 'cw-volunteer.png', options: ['義', '議', '儀', '蟻'], clue: '這個字的上面是「羊」，下面是「我」。', explain: '答案是「義」；「議」多了言字旁，「儀」多了單人旁，「蟻」多了虫字旁。', parts: ['羊', '我'], story: '上面的「羊」代表美好，下面是「我」。自己去做好的、應該做的事，就是「義」；不拿錢、自願幫忙的人叫「義工」。', sentence: '週末，姐姐到公園當義工。' },
      { id: 'h-麵', combo: { layout: 'lr', parts: [['麥', 'm', '小麥'], ['面', 's', '']] }, char: '麵', zhuyin: 'ㄇㄧㄢˋ', radical: '麥', strokes: 20, words: ['麵條', '麵包'], say: '麵，麵包的麵', cloze: '＿包', img: 'cw-bread.png', options: ['麵', '面', '緬', '棉'], clue: '這個字的右邊是「面」。', explain: '答案是「麵」，左邊是「麥」；「面」沒有麥，「緬」的左邊是絲線。', parts: ['麥', '面'], story: '左邊是小麥，右邊的「面」念起來像「麵」。小麥磨成粉，做成的麵條、麵包，都用這個「麵」。', sentence: '早餐我吃了一個麵包。', build: { layout: 'lr', show: ['？', '面'], answer: '麥', options: ['麥', '米', '禾', '食'], clue: '想一想：做麵的粉是哪一種穀物磨成的？' } },
      { id: 'h-郁', combo: { layout: 'lr', parts: [['有', 's', ''], ['阝', 'm', '城鎮']] }, char: '郁', zhuyin: 'ㄩˋ', radical: '邑', strokes: 9, words: ['濃郁'], say: '郁，濃郁的郁', cloze: '濃＿', img: 'cw-flower-scent.png', options: ['郁', '有', '都', '部'], clue: '這個字的左邊是「有」。', explain: '答案是「郁」，左邊是「有」；「都」的左邊是「者」，「部」的左邊是「咅」。', parts: ['有', '阝'], story: '左邊的「有」念起來有點像「郁」，右邊是耳朵旁。香味又多又濃，就是「濃郁」。', sentence: '桂花的香味好濃郁。', build: { layout: 'lr', show: ['有', '？'], answer: '阝', options: ['阝', '頁', '攵', '月'], clue: '想一想：右邊是耳朵旁。' } },
      { id: 'h-壽', combo: { type: '形聲字', pict: '上面的「士」像一位老人，下面的部分念起來像「壽」。活得很久很久，就是「長壽」。' }, char: '壽', zhuyin: 'ㄕㄡˋ', radical: '士', strokes: 14, words: ['壽司', '壽星'], say: '壽，壽星的壽', cloze: '＿星', img: 'cw-birthday-star.png', options: ['壽', '濤', '籌', '禱'], clue: '這個字的上面是「士」，下面有一個「寸」。', explain: '答案是「壽」；「濤」多了三點水，「籌」多了竹字頭，「禱」多了示字旁。', parts: ['士', '壽'], story: '「壽」和活得很久有關。過生日的人叫「壽星」，祝老人家活得久叫「長壽」。', sentence: '今天的壽星是弟弟。' },
      { id: 'h-醋', combo: { layout: 'lr', parts: [['酉', 'm', '酒罈'], ['昔', 's', '']] }, char: '醋', zhuyin: 'ㄘㄨˋ', radical: '酉', strokes: 15, words: ['醋飯', '糖醋'], say: '醋，糖醋的醋', cloze: '糖＿', img: 'cw-sweet-sour.png', options: ['醋', '酷', '錯', '措'], clue: '這個字的右邊是「昔」，左邊是裝東西的罈子。', explain: '答案是「醋」；「酷」的右邊是「告」，「錯」的左邊是金字旁。', parts: ['酉', '昔'], story: '左邊的「酉」是罈子，右邊的「昔」念起來有點像「醋」。放在罈子裡慢慢變酸的調味料，就是「醋」。', sentence: '媽媽煮了一盤糖醋排骨。', build: { layout: 'lr', show: ['？', '昔'], answer: '酉', options: ['酉', '金', '扌', '口'], clue: '想一想：醋是放在罈子裡慢慢做出來的。' } },
      { id: 'h-未', combo: { type: '象形字', pict: '很久以前的「未」，像一棵樹上面又長出更多小枝葉，還在長、還沒長完。所以「未」是「還沒有」。' }, char: '未', zhuyin: 'ㄨㄟˋ', radical: '木', strokes: 5, words: ['未知', '未來'], say: '未，未來的未', cloze: '＿來', img: 'cw-future.png', options: ['未', '末', '朱', '禾'], clue: '這個字上面的橫比較短，下面的橫比較長。', explain: '答案是「未」，上短下長；「末」是上長下短，「朱」的上面多了一撇。', parts: ['未'], story: '「未」像樹上又長出小枝葉，還沒長完，所以是「還沒有」。還沒到的日子，就是「未來」。', sentence: '我希望未來能當一名太空人。' }
    ],
    vocab: [
      { id: 'v-見聞', cloze: true, clozeOptions: ['見聞', '功課', '零食', '玩具'], word: '見聞', meaning: '看到的和聽到的事情。', example: '爺爺常常跟我們分享他年輕時旅行的＿＿。', img: 'travel-share.png', options: ['見聞', '食材', '未知', '濃郁'] },
      { id: 'v-薄', cloze: true, clozeOptions: ['薄', '厚', '硬', '重'], word: '薄', meaning: '不厚，很扁很平。', example: '冬天的早上，水面結了一層＿冰。', img: 'thin-dough.png', options: ['薄', '烙', '沾', '咖哩'] },
      { id: 'v-烙', cloze: true, clozeOptions: ['烙', '洗', '切', '冰'], word: '烙', meaning: '把食物放在熱熱的鍋子上烤熟。', example: '奶奶在平底鍋上＿了一張餅。', img: 'pan-bread.png', options: ['烙', '薄', '壽司', '見聞'] },
      { id: 'v-沾', cloze: true, clozeOptions: ['沾', '丟', '藏', '踩'], word: '沾', meaning: '碰一下，讓東西附在上面。', example: '吃水餃的時候，我喜歡＿一點醬油。', img: 'dip-sauce.png', options: ['沾', '烙', '醬料', '未知'] },
      { id: 'v-咖哩', cloze: true, clozeOptions: ['咖哩', '果汁', '冰塊', '牛奶'], word: '咖哩', meaning: '黃黃的、香香辣辣的醬，可以拌飯吃。', example: '這盤＿＿飯香得讓人流口水。', img: 'curry.png', options: ['咖哩', '醋飯', '麵條', '見聞'] },
      { id: 'v-印度', word: '印度', meaning: '在亞洲南部的一個國家。', example: '＿＿是一個很大的國家，很多人愛吃咖哩。', img: 'india-food.png', options: ['印度', '義大利', '壽司', '食材'] },
      { id: 'v-甩餅', cloze: true, clozeOptions: ['甩餅', '湯圓', '粽子', '月餅'], word: '甩餅', meaning: '把麵皮拋到空中轉呀轉，做成又大又薄的一種印度點心。', example: '師傅把麵皮拋到空中，做出一張香噴噴的＿＿。', img: 'roti.png', options: ['甩餅', '壽司', '醬料', '薄'] },
      { id: 'v-食材', cloze: true, clozeOptions: ['食材', '玩具', '文具', '衣服'], word: '食材', meaning: '做菜要用到的菜、肉、蛋等東西。', example: '媽媽到市場買了很多新鮮的＿＿。', img: 'ingredients.png', options: ['食材', '見聞', '濃郁', '印度'] },
      { id: 'v-醬料', cloze: true, clozeOptions: ['醬料', '冰塊', '餅乾', '飲料'], word: '醬料', meaning: '加在食物上，讓味道更好、糊糊的或水水的東西。', example: '吃火鍋時，每個人都調了自己喜歡的＿＿。', img: 'sauces.png', options: ['醬料', '麵條', '甩餅', '未知'] },
      { id: 'v-義大利', word: '義大利', meaning: '在歐洲南部的一個國家，披薩和麵都很有名。', example: '＿＿＿的披薩很有名。', img: 'italy-food.png', options: ['義大利', '印度', '咖哩', '醋飯'] },
      { id: 'v-麵條', cloze: true, clozeOptions: ['麵條', '石頭', '樹葉', '雨傘'], word: '麵條', meaning: '用小麥粉做成、細細長長的食物。', example: '奶奶煮了一鍋熱呼呼的＿＿。', img: 'pasta.png', options: ['麵條', '醬料', '烙', '見聞'] },
      { id: 'v-濃郁', cloze: true, clozeOptions: ['濃郁', '清淡', '無味', '冷淡'], word: '濃郁', meaning: '味道非常香、非常重。', example: '咖啡店裡飄著＿＿的香味。', img: 'cream-pasta.png', options: ['濃郁', '薄', '食材', '印度'] },
      { id: 'v-壽司', cloze: true, clozeOptions: ['壽司', '包子', '饅頭', '油條'], word: '壽司', meaning: '日本的食物，用醋飯包著海苔、魚和蔬菜。', example: '我最喜歡吃鮭魚＿＿。', img: 'sushi.png', options: ['壽司', '甩餅', '咖哩', '沾'] },
      { id: 'v-醋飯', cloze: true, clozeOptions: ['醋飯', '炒飯', '稀飯', '麵包'], word: '醋飯', meaning: '拌過酸酸甜甜調味料的白米，用來做壽司。', example: '做壽司要先準備好＿＿。', img: 'sushi-rice.png', options: ['醋飯', '麵條', '未知', '義大利'] },
      { id: 'v-未知', cloze: true, clozeOptions: ['未知', '熟悉', '清楚', '明白'], word: '未知', meaning: '還沒有人弄清楚的。', example: '太空裡還有很多＿＿的祕密。', img: 'globe-question.png', options: ['未知', '見聞', '濃郁', '醬料'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-薄', char: '薄', img: 'cw-mint.png', charMeaning: '不厚。', word: '薄荷', meaning: '一種綠色的植物，吃起來涼涼的。', example: '這顆糖吃起來涼涼的，有＿＿的味道。', options: ['薄荷', '烙餅', '印章', '義工'] },
      { id: 'cw-烙', char: '烙', img: 'cw-scallion-pancake.png', charMeaning: '在熱鍋上烤熟。', word: '烙餅', meaning: '在熱鍋上烤熟的餅。', example: '奶奶在鍋子上＿＿給我們當早餐。', options: ['烙餅', '咖啡', '木材', '未來'] },
      { id: 'cw-沾', char: '沾', img: 'cw-muddy-shoes.png', charMeaning: '碰到東西，附在上面。', word: '沾滿', meaning: '全部都黏上了東西。', example: '下雨天，我的鞋子＿＿了泥巴。', options: ['沾滿', '醬油', '壽星', '薄荷'] },
      { id: 'cw-咖', char: '咖', img: 'cw-coffee.png', charMeaning: '念外國話聲音的字。', word: '咖啡', meaning: '用烘過的豆子煮成、苦苦香香的飲料。', example: '爸爸每天早上都要喝一杯＿＿。', options: ['咖啡', '甩動', '麵包', '糖醋'] },
      { id: 'cw-哩', char: '哩', img: 'cw-curry-rice.png', charMeaning: '念外國話聲音的字。', word: '咖哩飯', meaning: '淋上黃黃的咖哩醬的白飯。', example: '今天的午餐是＿＿＿。', options: ['咖哩飯', '印章', '濃郁', '烙餅'] },
      { id: 'cw-印', char: '印', img: 'cw-stamp.png', charMeaning: '往下壓，留下痕跡。', word: '印章', meaning: '刻著名字，可以蓋在紙上的小東西。', example: '老師在作業上蓋了一個＿＿。', options: ['印章', '沾滿', '義工', '咖啡'] },
      { id: 'cw-甩', char: '甩', img: 'cw-dog-shake.png', charMeaning: '用力搖、往外丟。', word: '甩動', meaning: '用力的搖來搖去。', example: '小狗用力＿＿身體，把水弄乾。', options: ['甩動', '木材', '壽星', '薄荷'] },
      { id: 'cw-材', char: '材', img: 'cw-wood.png', charMeaning: '可以拿來做東西的材料。', word: '木材', meaning: '可以拿來蓋房子、做家具的木頭。', example: '這間小屋是用＿＿蓋的。', options: ['木材', '醬油', '未來', '咖哩飯'] },
      { id: 'cw-醬', char: '醬', img: 'cw-soy-sauce.png', charMeaning: '糊糊的調味料。', word: '醬油', meaning: '黑黑的、鹹鹹的調味料。', example: '炒青菜時，加一點＿＿更好吃。', options: ['醬油', '印章', '甩動', '濃郁'] },
      { id: 'cw-義', char: '義', img: 'cw-volunteer.png', charMeaning: '應該做的好事。', word: '義工', meaning: '不拿錢、自願幫忙做事的人。', example: '姐姐週末去公園當＿＿，幫忙撿垃圾。', options: ['義工', '麵包', '沾滿', '烙餅'] },
      { id: 'cw-麵', char: '麵', img: 'cw-bread.png', charMeaning: '用小麥粉做的食物。', word: '麵包', meaning: '用小麥粉烤成、鬆鬆軟軟的食物。', example: '早餐我吃了一個＿＿。', options: ['麵包', '糖醋', '木材', '咖啡'] },
      { id: 'cw-郁', char: '郁', img: 'cw-flower-scent.png', charMeaning: '香味很重。', word: '濃郁', meaning: '香味非常重、非常香。', example: '桂花開了，香味好＿＿。', options: ['濃郁', '義工', '甩動', '印章'] },
      { id: 'cw-壽', char: '壽', img: 'cw-birthday-star.png', charMeaning: '活得很久；生日。', word: '壽星', meaning: '過生日的人。', example: '今天的＿＿是弟弟，大家一起為他唱歌。', options: ['壽星', '薄荷', '醬油', '未來'] },
      { id: 'cw-醋', char: '醋', img: 'cw-sweet-sour.png', charMeaning: '酸酸的調味料。', word: '糖醋', meaning: '用糖和醋煮出來、酸酸甜甜的味道。', example: '媽媽煮了一盤＿＿排骨。', options: ['糖醋', '咖哩飯', '義工', '沾滿'] },
      { id: 'cw-未', char: '未', img: 'cw-future.png', charMeaning: '還沒有。', word: '未來', meaning: '還沒到的以後。', example: '我希望＿＿能當一名太空人。', options: ['未來', '麵包', '壽星', '木材'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-妄自菲薄', situationImg: 'id-self-doubt.png', idiom: '妄自菲薄', char: '薄', meaning: '隨便看輕自己，覺得自己什麼都不好。', example: '你的歌聲那麼好聽，別再妄自菲薄了。', situation: '小華的圖畫得很好看，大家都稱讚他，他卻一直搖手，說自己畫得很爛。',
        fill: { options: ['你明明很會跳舞，不要＿＿＿＿。', '他覺得自己最厲害，常常在別人面前＿＿＿＿。'], clue: '提示：哪一句是隨便看輕自己？', explain: '第一句用得對：很會跳舞卻說自己不好，就是看輕自己。覺得自己最厲害，剛好相反。' } },
      { id: 'i-沾沾自喜', situationImg: 'id-show-off.png', idiom: '沾沾自喜', char: '沾', meaning: '覺得自己很厲害，得意洋洋的樣子。', example: '弟弟考了一百分，就沾沾自喜的到處說。', situation: '哥哥拿著考卷到處給人看，還把下巴抬得高高的。',
        fill: { options: ['他才贏了一場比賽，就＿＿＿＿的跟大家炫耀。', '他輸了比賽，很難過的＿＿＿＿。'], clue: '提示：哪一句是得意洋洋的樣子？', explain: '第一句用得對：贏了一場就到處炫耀，很得意。輸了很難過，就不是這個意思。' } },
      { id: 'i-因材施教', situationImg: 'id-teach-each.png', idiom: '因材施教', char: '材', meaning: '照著每個人不一樣的興趣和能力，用不同的方法來教。', example: '好老師會因材施教，讓每個學生都能進步。', situation: '老師發現小美愛唱歌、小明愛畫圖，就用唱歌教小美、用畫圖教小明。',
        fill: { options: ['教練＿＿＿＿，跑得快的練速度，力氣大的練丟球。', '老師對每個人都用一模一樣的方法，這就是＿＿＿＿。'], clue: '提示：哪一句是用不同的方法教不同的人？', explain: '第一句用得對：教練照每個人的長處來教。每個人都用一樣的方法，剛好相反。' } },
      { id: 'i-義不容辭', situationImg: 'id-volunteer-help.png', idiom: '義不容辭', char: '義', meaning: '應該做的事，不能推掉，一定要去做。', example: '同學需要幫忙，我義不容辭的伸出手。', situation: '同學在操場跌倒受傷了，小安馬上跑過去，扶他去健康中心。',
        fill: { options: ['看到有人需要幫忙，警察＿＿＿＿的上前幫忙。', '有人請他幫忙，他假裝沒聽見，真是＿＿＿＿。'], clue: '提示：哪一句是應該幫忙，就馬上去做？', explain: '第一句用得對：警察馬上去幫忙。假裝沒聽見，剛好相反。' } },
      { id: 'i-壽比南山', situationImg: 'id-grandpa-birthday.png', idiom: '壽比南山', char: '壽', meaning: '祝人活得像高山一樣長久，是祝長輩長壽的話。', example: '爺爺生日時，大家舉杯祝他壽比南山。', situation: '奶奶八十歲生日，全家人圍著她，送上桃子形狀的點心，祝她健康、活得長長久久。',
        fill: { options: ['奶奶九十歲生日，我們祝她＿＿＿＿。', '弟弟今天剛滿一個月，我們祝他＿＿＿＿。'], clue: '提示：哪一句是祝老人家活得長長久久？', explain: '第一句用得對：這是祝長輩的話，用在奶奶生日很合適。剛出生的小寶寶，不會用這句話祝福。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-薄', char: '薄', wrong: '簿', sentence: '水面結了一層薄冰。', options: ['薄', '簿', '博'], clue: '這裡是說不厚，跟筆記本沒有關係。', explain: '要改成「薄」。不厚是「薄」，上面是草字頭；「簿」是筆記簿的簿。' },
      { id: 'fx-烙', char: '烙', wrong: '落', sentence: '奶奶在鍋子上烙了一張蔥油餅。', options: ['烙', '落', '洛'], clue: '這裡是說在熱鍋上烤，想一想，哪一個字有火字旁？', explain: '要改成「烙」。在熱鍋上烤是「烙」，有火字旁；「落」是落下的落。' },
      { id: 'fx-沾', char: '沾', wrong: '站', sentence: '下雨天，我的鞋子沾滿了泥巴。', options: ['沾', '站', '佔'], clue: '這裡是說黏在上面，跟站起來沒有關係。', explain: '要改成「沾」。黏在上面是「沾」，有三點水；「站」是站立的站。' },
      { id: 'fx-咖', char: '咖', wrong: '加', sentence: '爸爸每天早上喝一杯咖啡。', options: ['咖', '加', '茄'], clue: '這裡說的是一種飲料，想一想，哪一個字有口字旁？', explain: '要改成「咖」。一種飲料是「咖啡」，有口字旁；「加」是加油的加。' },
      { id: 'fx-哩', char: '哩', wrong: '里', sentence: '今天的午餐是咖哩飯。', options: ['哩', '里', '理'], clue: '這裡說的是黃黃的醬，想一想，哪一個字有口字旁？', explain: '要改成「哩」。黃黃的醬是「咖哩」，有口字旁；「里」是公里的里。' },
      { id: 'fx-印', char: '印', wrong: '因', sentence: '老師在作業上蓋了一個印章。', options: ['印', '因', '茵'], clue: '這裡說的是蓋在紙上的章，跟「因為」沒有關係。', explain: '要改成「印」。蓋在紙上的是「印章」；「因」是因為的因。' },
      { id: 'fx-甩', char: '甩', wrong: '用', sentence: '小狗甩動身體，把水弄乾。', options: ['甩', '用', '角'], clue: '這裡是說用力搖來搖去，想一想，哪一個字中間的一豎往右彎？', explain: '要改成「甩」。用力搖是「甩動」，中間一豎往右彎；「用」的一豎是直的。' },
      { id: 'fx-材', char: '材', wrong: '財', sentence: '這間小屋是用木材蓋的。', options: ['材', '財', '村'], clue: '這裡說的是蓋房子的木頭，跟錢沒有關係。', explain: '要改成「材」。蓋房子的木頭是「木材」，左邊是木；「財」是錢財的財。' },
      { id: 'fx-醬', char: '醬', wrong: '將', sentence: '媽媽炒菜時加了一點醬油。', options: ['醬', '將', '漿'], clue: '這裡說的是黑黑鹹鹹的調味料，想一想，哪一個字的下面是「酉」？', explain: '要改成「醬」。黑黑鹹鹹的調味料是「醬油」，下面是酉；「將」是將來的將。' },
      { id: 'fx-義', char: '義', wrong: '議', sentence: '週末，姐姐到公園當義工。', options: ['義', '議', '儀'], clue: '這裡是說自願幫忙的人，跟開會討論沒有關係。', explain: '要改成「義」。自願幫忙的人是「義工」；「議」是會議的議。' },
      { id: 'fx-麵', char: '麵', wrong: '面', sentence: '早餐我吃了一個麵包。', options: ['麵', '面', '棉'], clue: '這裡說的是用小麥粉做的食物，想一想，哪一個字有「麥」？', explain: '要改成「麵」。小麥粉做的食物是「麵包」，左邊是麥；「面」是見面的面。' },
      { id: 'fx-郁', char: '郁', wrong: '有', sentence: '桂花的香味好濃郁。', options: ['郁', '有', '都'], clue: '這裡是說香味很重，想一想，哪一個字的右邊是耳朵旁？', explain: '要改成「郁」。香味很重是「濃郁」，右邊是耳朵旁；「有」是沒有的有。' },
      { id: 'fx-壽', char: '壽', wrong: '受', sentence: '今天的壽星是弟弟。', options: ['壽', '受', '售'], clue: '這裡說的是過生日的人，跟受傷沒有關係。', explain: '要改成「壽」。過生日的人是「壽星」；「受」是受傷的受。' },
      { id: 'fx-醋', char: '醋', wrong: '酷', sentence: '媽媽煮了一盤糖醋排骨。', options: ['醋', '酷', '錯'], clue: '這裡說的是酸酸的調味料，想一想，哪一個字的右邊是「昔」？', explain: '要改成「醋」。酸酸甜甜的是「糖醋」，右邊是昔；「酷」是酷熱的酷。' },
      { id: 'fx-未', char: '未', wrong: '末', sentence: '我希望未來能當一名太空人。', options: ['未', '末', '禾'], clue: '這裡是說還沒到的以後，想一想，哪一個字上面的橫短、下面的橫長？', explain: '要改成「未」。還沒到的以後是「未來」，上短下長；「末」是週末的末，上長下短。' }
    ],
    similar: [
      { id: 's1', meaning: '「筆記＿」是寫字用的本子。', sentence: '我把生字寫在筆記＿上。', frame: '筆記＿', options: ['簿', '薄'], answer: '簿', clue: '提示：這個字的上面是竹字頭。', explain: '答案是「簿」；「薄」是薄冰的薄，上面是草字頭。' },
      { id: 's2', meaning: '「＿下來」是從上面掉下來。', sentence: '秋天到了，樹葉一片片＿下來。', frame: '＿下來', options: ['落', '烙'], answer: '落', clue: '提示：這個字有草字頭。', explain: '答案是「落」；「烙」是烙餅的烙，有火字旁。' },
      { id: 's3', meaning: '「車＿」是上車、下車的地方。', sentence: '我們在公車＿等車。', frame: '車＿', options: ['站', '沾'], answer: '站', clue: '提示：這個字的左邊是「立」。', explain: '答案是「站」；「沾」是沾醬的沾，有三點水。' },
      { id: 's4', meaning: '「＿油」是說「努力喔」的話。', sentence: '比賽開始了，大家一起喊：「＿油！」', frame: '＿油', options: ['加', '咖'], answer: '加', clue: '提示：這個字沒有口字旁。', explain: '答案是「加」；「咖」是咖啡的咖。' },
      { id: 's5', meaning: '「公＿」是量路有多遠的單位。', sentence: '從家裡到學校有兩公＿遠。', frame: '公＿', options: ['里', '哩'], answer: '里', clue: '提示：這個字沒有口字旁。', explain: '答案是「里」；「哩」是咖哩的哩。' },
      { id: 's6', meaning: '「＿為」是說明為什麼的詞。', sentence: '＿為下雨，運動會延期了。', frame: '＿為', options: ['因', '印'], answer: '因', clue: '提示：這個字的外面是一個大框框。', explain: '答案是「因」；「印」是印章的印。' },
      { id: 's7', meaning: '「使＿」是拿來做事。', sentence: '這支筆可以使＿很久。', frame: '使＿', options: ['用', '甩'], answer: '用', clue: '提示：這個字中間的一豎是直的。', explain: '答案是「用」；「甩」是甩動的甩，中間一豎往右彎。' },
      { id: 's8', meaning: '「＿寶」是很值錢的東西。', sentence: '海盜把＿寶藏在山洞裡。', frame: '＿寶', options: ['財', '材'], answer: '財', clue: '提示：這個字的左邊是「貝」。', explain: '答案是「財」；「材」是木材的材。' },
      { id: 's9', meaning: '「＿子」是鄉下人住在一起的小地方。', sentence: '爺爺住在山邊的小＿子裡。', frame: '＿子', options: ['村', '材'], answer: '村', clue: '提示：這個字的右邊是「寸」。', explain: '答案是「村」；「材」是木材的材。' },
      { id: 's10', meaning: '「＿狀」是比賽表現好得到的紙。', sentence: '我參加畫圖比賽，得到一張＿狀。', frame: '＿狀', options: ['獎', '醬'], answer: '獎', clue: '提示：這個字的下面是「大」。', explain: '答案是「獎」；「醬」是醬油的醬。' },
      { id: 's11', meaning: '「豆＿」是用黃豆打成的飲料。', sentence: '早餐我喝了一杯豆＿。', frame: '豆＿', options: ['漿', '醬'], answer: '漿', clue: '提示：這個字的下面是「水」。', explain: '答案是「漿」；「醬」是醬油的醬，下面是酉。' },
      { id: 's12', meaning: '「會＿」是大家坐在一起討論事情。', sentence: '班長召開班級會＿。', frame: '會＿', options: ['議', '義'], answer: '議', clue: '提示：這個字的左邊是言字旁。', explain: '答案是「議」；「義」是義工的義。' },
      { id: 's13', meaning: '「見＿」是兩個人碰到、看到彼此。', sentence: '我們約好下午在公園見＿。', frame: '見＿', options: ['面', '麵'], answer: '面', clue: '提示：這個字沒有「麥」。', explain: '答案是「面」；「麵」是麵包的麵。' },
      { id: 's14', meaning: '「算＿」是算得不對。', sentence: '這一題我算＿了，要重算。', frame: '算＿', options: ['錯', '醋'], answer: '錯', clue: '提示：這個字的左邊是金字旁。', explain: '答案是「錯」；「醋」是糖醋的醋。' },
      { id: 's15', meaning: '「週＿」是星期六和星期天。', sentence: '這個週＿我們要去露營。', frame: '週＿', options: ['末', '未'], answer: '末', clue: '提示：這個字上面的橫比較長。', explain: '答案是「末」；「未」是未來的未，上面的橫比較短。' }
    ],
    listen: [
      { id: 'l1', text: '把麵皮拋到空中轉圈，做成又大又薄的餅。', answer: 0, options: [{ text: '甩餅', img: 'roti.png' }, { text: '壽司', img: 'sushi.png' }, { text: '咖哩', img: 'curry.png' }, { text: '醋飯', img: 'sushi-rice.png' }] },
      { id: 'l2', text: '日本的食物，用醋飯包著海苔和魚。', answer: 0, options: [{ text: '壽司', img: 'sushi.png' }, { text: '甩餅', img: 'roti.png' }, { text: '麵條', img: 'pasta.png' }, { text: '薄', img: 'thin-dough.png' }] },
      { id: 'l3', text: '黃黃的、香香辣辣的醬，可以拌飯吃。', answer: 0, options: [{ text: '咖哩', img: 'curry.png' }, { text: '醬料', img: 'sauces.png' }, { text: '未知', img: 'globe-question.png' }, { text: '食材', img: 'ingredients.png' }] },
      { id: 'l4', text: '還沒有人知道答案的事情。', answer: 0, options: [{ text: '未知', img: 'globe-question.png' }, { text: '見聞', img: 'travel-share.png' }, { text: '濃郁', img: 'cream-pasta.png' }, { text: '烙', img: 'pan-bread.png' }] },
      { id: 'l5', text: '把餅放在熱熱的鍋子上，烤到熟。', answer: 0, options: [{ text: '烙', img: 'pan-bread.png' }, { text: '沾', img: 'dip-sauce.png' }, { text: '薄', img: 'thin-dough.png' }, { text: '印度', img: 'india-food.png' }] },
      { id: 'l6', text: '做菜要用的青菜、肉和蛋。', answer: 0, options: [{ text: '食材', img: 'ingredients.png' }, { text: '醬料', img: 'sauces.png' }, { text: '見聞', img: 'travel-share.png' }, { text: '麵條', img: 'pasta.png' }] },
      { id: 'l7', text: '奶油的香味好重，聞起來好香。', answer: 0, options: [{ text: '濃郁', img: 'cream-pasta.png' }, { text: '未知', img: 'globe-question.png' }, { text: '烙', img: 'pan-bread.png' }, { text: '義大利', img: 'italy-food.png' }] },
      { id: 'l8', text: '去旅行時看到、聽到的有趣事情。', answer: 0, options: [{ text: '見聞', img: 'travel-share.png' }, { text: '食材', img: 'ingredients.png' }, { text: '壽司', img: 'sushi.png' }, { text: '沾', img: 'dip-sauce.png' }] }
    ],
    /* ---------- 短語、造句、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看它變成什麼樣子。',
      /* 短語：什麼＋怎麼變（慢慢、漸漸）＋變得又＿＿又＿＿（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '氣球慢慢變得又大又圓', img: 'pr-balloon.png',
        parts: [{ text: '氣球', role: '什麼' }, { text: '慢慢', role: '怎麼變' }, { text: '變得' }, { text: '又' }, { text: '大', role: '怎麼樣' }, { text: '又' }, { text: '圓', role: '怎麼樣' }],
        explain: '先說是什麼，再說它慢慢的、漸漸的變了，最後用「又……又……」說出它變成的兩個樣子。' },
      pick: [
        { id: 'ph1', img: 'pr-puppy-grow.png', before: '小狗漸漸變得', join: '', noun: '。', ask: '小狗漸漸變得怎麼樣', look: '再看看圖片，小狗長大以後，和小時候比起來怎麼樣？', options: ['又高又壯', '又冷又硬', '又苦又澀', '又溼又黏'], clue: '提示：牠長大了，身體比以前更大、更有力氣。', explain: '答案是「又高又壯」，完整的短語是「小狗漸漸變得又高又壯」。' },
        { id: 'ph2', img: 'pr-bread-bake.png', before: '麵包漸漸變得', join: '', noun: '。', ask: '麵包漸漸變得怎麼樣', look: '再看看圖片，烤箱裡的麵包膨起來了嗎？', options: ['又香又軟', '又冷又硬', '又苦又澀', '又高又壯'], clue: '提示：聞起來好好聞，摸起來鬆鬆的。', explain: '答案是「又香又軟」，完整的短語是「麵包漸漸變得又香又軟」。' },
        { id: 'ph3', img: 'pr-snowman-melt.png', before: '雪人慢慢變得', join: '', noun: '。', ask: '雪人慢慢變得怎麼樣', look: '再看看圖片，太陽出來以後，雪人怎麼了？', options: ['又小又扁', '又高又壯', '又香又軟', '又紅又甜'], clue: '提示：雪人融化了，越來越矮、越來越平。', explain: '答案是「又小又扁」，完整的短語是「雪人慢慢變得又小又扁」。' },
        { id: 'ph4', img: 'pr-apple-ripe.png', before: '蘋果漸漸變得', join: '', noun: '。', ask: '蘋果漸漸變得怎麼樣', look: '再看看圖片，樹上的蘋果是什麼顏色？', options: ['又紅又大', '又冷又硬', '又小又扁', '又苦又澀'], clue: '提示：蘋果成熟了，顏色像火一樣，個子也長胖了。', explain: '答案是「又紅又大」，完整的短語是「蘋果漸漸變得又紅又大」。' },
        { id: 'ph5', img: 'pr-sky-dark.png', before: '天空漸漸變得', join: '', noun: '。', ask: '天空漸漸變得怎麼樣', look: '再看看圖片，路燈是不是亮起來了？', options: ['又黑又暗', '又紅又大', '又香又軟', '又高又壯'], clue: '提示：太陽下山了，看不太清楚四周了。', explain: '答案是「又黑又暗」，完整的短語是「天空漸漸變得又黑又暗」。' },
        { id: 'ph6', img: 'pr-room-clean.png', before: '房間慢慢變得', join: '', noun: '。', ask: '房間慢慢變得怎麼樣', look: '再看看圖片，打掃完以後，房間裡的東西怎麼樣？', options: ['又乾淨又整齊', '又骯髒又凌亂', '又冰冷又堅硬', '又苦澀又難吃'], clue: '提示：地上沒有垃圾，東西都排得好好的。', explain: '答案是「又乾淨又整齊」，完整的短語是「房間慢慢變得又乾淨又整齊」。' }
      ],
      /* 拼短語：自己切好每一塊（每格說明用上面 intro 的每一塊） */
      fill: [
        { id: 'pf1', img: 'pr-puppy-grow.png', parts: ['小狗', '漸漸', '變得', '又', '高', '又', '壯'] },
        { id: 'pf2', img: 'pr-bread-bake.png', parts: ['麵包', '漸漸', '變得', '又', '香', '又', '軟'] },
        { id: 'pf3', img: 'pr-snowman-melt.png', parts: ['雪人', '慢慢', '變得', '又', '小', '又', '扁'] },
        { id: 'pf4', img: 'pr-apple-ripe.png', parts: ['蘋果', '漸漸', '變得', '又', '紅', '又', '大'] },
        { id: 'pf5', img: 'pr-room-clean.png', parts: ['房間', '慢慢', '變得', '又', '乾淨', '又', '整齊'] }
      ],
      say: [],
      words: [
        { word: '各式各樣', meaning: '很多種不一樣的樣子和種類。', img: 'wd-variety.png' },
        { word: '大開眼界', meaning: '看到很多沒看過的新東西，覺得很新奇。', img: 'wd-eye-opening.png' },
        { word: '念念不忘', meaning: '心裡一直記著，忘不了。', img: 'wd-never-forget.png' },
        { word: '成就感', meaning: '努力完成一件事以後，心裡覺得很滿足、很驕傲。', img: 'wd-achievement.png' }
      ],
      choose: [
        { id: 'pw1', word: '各式各樣', options: ['手工市集裡有各式各樣的餅乾，看得我眼花撩亂。', '盤子裡只有一顆蘋果，真是各式各樣。'], clue: '提示：想一想，「各式各樣」是很多種，還是只有一種？', explain: '第一句用得對：有很多種餅乾。只有一顆蘋果，就不是各式各樣。' },
        { id: 'pw2', word: '大開眼界', options: ['第一次去科學博物館，看到好多新奇的東西，真是大開眼界。', '我每天走同一條路上學，真是大開眼界。'], clue: '提示：想一想，「大開眼界」是看到新東西，還是每天都一樣？', explain: '第一句用得對：看到很多沒看過的東西。每天都走同一條路，沒有新東西。' },
        { id: 'pw3', word: '念念不忘', options: ['外婆煮的那碗雞湯，我到現在還念念不忘。', '昨天吃了什麼我念念不忘，一點也想不起來。'], clue: '提示：想一想，「念念不忘」是一直記得，還是想不起來？', explain: '第一句用得對：一直記得外婆的雞湯。想不起來，剛好相反。' },
        { id: 'pw4', word: '成就感', options: ['我自己組好了一臺模型車，好有成就感。', '我今天什麼都沒做，覺得好有成就感。'], clue: '提示：想一想，「成就感」要不要先努力完成一件事？', explain: '第一句用得對：自己完成模型車，很滿足。什麼都沒做，就不會有成就感。' }
      ],
      make: [
        { id: 'pm1', word: '各式各樣', clue: '提示：想想看，哪裡有很多種不一樣的東西？', model: '文具店裡有各式各樣的筆，看得我好想全部買回家。' },
        { id: 'pm2', word: '大開眼界', clue: '提示：想想看，你去哪裡看到了很多沒看過的東西？', model: '第一次走進海底隧道，讓我大開眼界。' },
        { id: 'pm3', word: '念念不忘', clue: '提示：想想看，有什麼好吃的、好玩的，讓你一直記得？', model: '去年在海邊看到的夕陽，我到現在還念念不忘。' },
        { id: 'pm4', word: '成就感', clue: '提示：想想看，你努力完成了什麼事，覺得很驕傲？', model: '我自己拼完了一千片拼圖，覺得很有成就感。' }
      ]
    },
    pattern: [
      { key: 'meijing', id: 'mj', title: '沒想到……竟然……', img: 'meijing.png',
        meaning: '先用「沒想到」說本來以為的樣子，再用「竟然」說出讓人吃驚、想不到的結果。',
        examples: ['沒想到小小的螞蟻，竟然搬得動大餅乾。'],
        match: [
          { id: 'pt-mj-m1', img: 'pt-shy-sing.png', front: '沒想到平常很害羞的小美，', options: ['竟然在臺上唱得這麼好聽。', '竟然在臺上睡著了。', '竟然在臺上變成小鳥。'], clue: '提示：看看圖片，臺下的同學為什麼拍手？', explain: '答案是「竟然在臺上唱得這麼好聽」：害羞的小美唱得很好，讓人想不到。' },
          { id: 'pt-mj-m2', img: 'pt-ugly-fruit.png', front: '沒想到這顆長得不好看的芭樂，', options: ['吃起來竟然這麼甜。', '竟然會自己跳起來。', '竟然會開口說話。'], clue: '提示：看看圖片，孩子吃了一口，表情怎麼樣？', explain: '答案是「吃起來竟然這麼甜」：長得不好看，吃起來卻很甜。' },
          { id: 'pt-mj-m3', img: 'pt-small-dog-brave.png', front: '沒想到這隻小小的狗，', options: ['竟然敢對著大狗叫。', '竟然會開車上班。', '竟然會寫字畫圖。'], clue: '提示：看看圖片，小狗在保護誰？', explain: '答案是「竟然敢對著大狗叫」：小狗很勇敢，讓人想不到。' }
        ],
        conj: [
          { id: 'pt-mj-c1', full: '沒想到奶奶竟然跑完了馬拉松。', img: 'pt-grandma-marathon.png', sentence: '＿＿＿奶奶＿＿跑完了馬拉松。', options: ['沒想到……竟然……', '當……就……', '如果……'], clue: '提示：這是一件讓人吃驚的事。數數看每個空格有幾個字。', explain: '答案是「沒想到……竟然……」：沒想到奶奶竟然跑完了馬拉松。' },
          { id: 'pt-mj-c2', full: '沒想到家裡的貓竟然會自己開門。', img: 'pt-cat-door.png', sentence: '＿＿＿家裡的貓＿＿會自己開門。', options: ['沒想到……竟然……', '當……就……', '如果……'], clue: '提示：貓會開門，讓人好吃驚。數數看每個空格有幾個字。', explain: '答案是「沒想到……竟然……」：沒想到家裡的貓竟然會自己開門。' },
          { id: 'pt-mj-c3', full: '沒想到臺灣的高山上竟然下雪了。', img: 'pt-mountain-snow.png', sentence: '＿＿＿臺灣的高山上＿＿下雪了。', options: ['沒想到……竟然……', '當……就……', '如果……'], clue: '提示：臺灣很少下雪，這讓人很驚喜。數數看每個空格有幾個字。', explain: '答案是「沒想到……竟然……」：沒想到臺灣的高山上竟然下雪了。' }
        ],
        half: [
          { id: 'pt-mj-h1', front: '沒想到小小的種子，', clue: '提示：種子後來變成了什麼？記得要說「竟然」。', model: '竟然長成了一棵大樹。' },
          { id: 'pt-mj-h2', front: '沒想到平常很安靜的弟弟，', clue: '提示：弟弟做了什麼讓人吃驚的事？記得要說「竟然」。', model: '竟然在比賽中跑了第一名。' }
        ],
        whole: [
          { id: 'pt-mj-w1', clue: '提示：先用「沒想到」說本來以為的樣子，再用「竟然」說讓你吃驚的結果。想想看：最近有什麼事讓你很意外？', model: '沒想到這本書竟然這麼好看，我一口氣就看完了。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'exclaim', name: '感嘆', meaning: '說話時加上「啊」、「哇」、「唉」這些聲音，或用驚嘆號，把心裡的驚訝、高興、難過大聲的說出來。', example: '巧文姐姐說到義大利麵條時，先喊了一聲「啊」，讓人感覺到她有多驚喜。',
          show: { sentence: '哇！這碗麵好香！', mark: ['哇！'] },
          yesno: [
            { id: 'rh-ex-y1', sentence: '啊！我的麵包烤焦了。', answer: true, mark: ['啊！'], clue: '提示：這句話有沒有用「啊」，把心裡的感覺喊出來？', explain: '是感嘆：「啊」說出了吃驚的心情。' },
            { id: 'rh-ex-y2', sentence: '我的麵包烤焦了。', answer: false, clue: '提示：這句話有沒有用嘆詞或驚嘆號，把心情喊出來？', explain: '不是感嘆：這句話只是說出發生的事。' }
          ],
          pick: [
            { id: 'rh-ex-p1', mark: ['哇！'], options: ['哇！好大的蛋糕！', '桌上有一個蛋糕。'], clue: '提示：哪一句把驚喜的心情喊出來了？', explain: '「哇！」把驚喜喊出來，是感嘆。' },
            { id: 'rh-ex-p2', mark: ['唉！'], options: ['唉！湯又灑出來了。', '湯灑出來了。'], clue: '提示：哪一句把失望的心情喊出來了？', explain: '「唉！」說出了失望，是感嘆。' },
            { id: 'rh-ex-p3', mark: ['天哪！'], options: ['天哪！這盤菜也太辣了！', '這盤菜很辣。', '這盤菜像火一樣。'], clue: '提示：哪一句把吃驚的心情喊出來了？', explain: '「天哪！」說出了吃驚，是感嘆。' },
            { id: 'rh-ex-p4', mark: ['哎呀！'], options: ['哎呀！我忘了關火！', '我忘了關火。', '為什麼要關火呢？'], clue: '提示：哪一句把著急的心情喊出來了？', explain: '「哎呀！」說出了著急，是感嘆。' },
            { id: 'rh-ex-p5', mark: ['多麼好吃啊！'], options: ['這壽司多麼好吃啊！', '這壽司很好吃。', '壽司像小枕頭。', '壽司排成一排。'], clue: '提示：哪一句用驚嘆號，把讚美喊出來了？', explain: '「多麼好吃啊！」把讚美喊出來，是感嘆。' },
            { id: 'rh-ex-p6', mark: ['啊！'], options: ['啊！原來麵條有這麼多造型！', '麵條有很多造型。', '麵條在跳舞。', '誰做了這些麵條？'], clue: '提示：哪一句把驚訝的心情喊出來了？', explain: '「啊！」說出了驚訝，是感嘆。' }
          ] },
        { key: 'parallel', name: '排比', meaning: '把三句或三句以上樣子差不多的話，一句接一句排在一起說，讀起來很有節奏，也很有氣勢。', example: '巧文姐姐用三個「有的像……」，一口氣說出麵條的不同造型。',
          show: { sentence: '花園裡的花，有的紅，有的黃，有的白。', mark: ['有的紅', '有的黃', '有的白'] },
          yesno: [
            { id: 'rh-pa-y1', sentence: '我喜歡畫圖，我喜歡唱歌，我喜歡跳舞。', answer: true, mark: ['我喜歡畫圖', '我喜歡唱歌', '我喜歡跳舞'], clue: '提示：有沒有三句樣子差不多的話排在一起？', explain: '是排比：「我喜歡……」三句排在一起。' },
            { id: 'rh-pa-y2', sentence: '我有很多興趣。', answer: false, clue: '提示：這句話裡，有沒有三句樣子差不多的話？', explain: '不是排比：這句話只有一句。' }
          ],
          pick: [
            { id: 'rh-pa-p1', mark: ['有人跑步', '有人跳繩', '有人打球'], options: ['公園裡，有人跑步，有人跳繩，有人打球。', '公園裡有很多人在運動。'], clue: '提示：哪一句有三句樣子差不多的話排在一起？', explain: '「有人跑步，有人跳繩，有人打球」三句排在一起，是排比。' },
            { id: 'rh-pa-p2', mark: ['蘋果紅紅的', '香蕉黃黃的', '葡萄紫紫的'], options: ['蘋果紅紅的，香蕉黃黃的，葡萄紫紫的。', '水果有很多顏色。'], clue: '提示：哪一句用三句差不多的話，說了三種水果？', explain: '三種水果用三句差不多的話排在一起，是排比。' },
            { id: 'rh-pa-p3', mark: ['跑得快', '跳得高', '丟得遠'], options: ['他跑得快，跳得高，丟得遠。', '他很會運動。', '他像一隻小鹿。'], clue: '提示：哪一句有三個樣子差不多的說法排在一起？', explain: '「跑得快，跳得高，丟得遠」排在一起，是排比。' },
            { id: 'rh-pa-p4', mark: ['早上去爬山', '中午去游泳', '晚上去看星星'], options: ['早上去爬山，中午去游泳，晚上去看星星。', '今天去了很多地方。', '今天好累啊！'], clue: '提示：哪一句用三句差不多的話，說出一天做的事？', explain: '三句「什麼時候去做什麼」排在一起，是排比。' },
            { id: 'rh-pa-p5', mark: ['紅的蘋果', '黃的香蕉', '綠的芭樂'], options: ['桌上有紅的蘋果，黃的香蕉，綠的芭樂。', '桌上有水果。', '水果真好吃！', '水果像小燈籠。'], clue: '提示：哪一句有三個樣子差不多的說法排在一起？', explain: '「紅的蘋果，黃的香蕉，綠的芭樂」排在一起，是排比。' },
            { id: 'rh-pa-p6', mark: ['海很藍', '天很高', '風很涼'], options: ['海很藍，天很高，風很涼。', '今天的天氣很好。', '哇！天氣真好！', '海浪在唱歌。'], clue: '提示：哪一句有三句樣子差不多的話排在一起？', explain: '「海很藍，天很高，風很涼」三句排在一起，是排比。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '哇！這碗湯好香！', answer: '感嘆', mark: ['哇！'], clue: '提示：有沒有把讚嘆的心情大聲喊出來？', explain: '答案是「感嘆」：「哇」說出了讚嘆。' },
        { id: 'rh2', sentence: '唉！我的冰淇淋融化了。', answer: '感嘆', mark: ['唉！'], clue: '提示：有沒有用一個聲音，說出難過的心情？', explain: '答案是「感嘆」：「唉」說出了難過。' },
        { id: 'rh3', sentence: '弟弟愛吃麵，妹妹愛吃飯，我愛吃餃子。', answer: '排比', mark: ['弟弟愛吃麵', '妹妹愛吃飯', '我愛吃餃子'], clue: '提示：有沒有三句樣子差不多的話排在一起？', explain: '答案是「排比」：三句「誰愛吃什麼」排在一起。' },
        { id: 'rh4', sentence: '花園裡，蝴蝶在飛，蜜蜂在忙，小鳥在叫。', answer: '排比', mark: ['蝴蝶在飛', '蜜蜂在忙', '小鳥在叫'], clue: '提示：有沒有三句樣子差不多的話，一句接一句？', explain: '答案是「排比」：三句「什麼在做什麼」排在一起。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L07 = d; }
})(this);
