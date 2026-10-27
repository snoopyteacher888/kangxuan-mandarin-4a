/* 第 11 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 人事時地物：選項第一個是答案；paras 是提示要用到的段落 */
    wh: [
      { id: 'wh-ren', key: '人', options: ['愛麗絲和兔子洞裡的朋友', '愛麗絲和她的爸爸媽媽', '老師和全班同學', '國王和皇后'], paras: [3], why: '劇本的人物有愛麗絲、兔子先生、小門和三腳桌。' },
      { id: 'wh-shi', key: '事', options: ['想辦法打開小門', '到海邊撿貝殼', '參加運動會', '去森林露營'], paras: [10, 22], why: '愛麗絲掉進兔子洞，一直想辦法打開小門、走出去。' },
      { id: 'wh-time', key: '時', options: ['夏天的下午', '寒冷的冬夜', '過年的早上', '下雪的晚上'], paras: [4], why: '旁白說，故事發生在夏天的下午。' },
      { id: 'wh-di', key: '地', options: ['兔子洞', '學校操場', '百貨公司', '動物園'], paras: [2, 4], why: '劇本寫著地點是兔子洞，愛麗絲追兔子掉了進去。' },
      { id: 'wh-wu', key: '物', options: ['鑰匙、果汁和扇子', '書包、課本和鉛筆', '球拍、球和球網', '碗、筷子和湯匙'], paras: [10, 13, 30], why: '愛麗絲用了金鑰匙、喝了果汁變小，最後搖扇子變回原樣。' }
    ],
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qb: 'extract', qc: 'extract', qf: 'extract', qi: 'extract', qd: 'infer', qh: 'infer', qe: 'interpret', qg: 'interpret',
      qj: 'evaluate', k1: 'evaluate', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qe: { think: ['愛麗絲拿起果汁以後，有沒有馬上喝？她先看了什麼？', '先看清楚有沒有危險再做，這樣的人做事怎麼樣？'], why: '愛麗絲先看瓶子上有沒有寫「有毒」，確定沒有才喝。做事前先看清楚，表示她很小心。' },
      qg: { think: ['三腳桌明明在旁邊，為什麼不幫愛麗絲拿鑰匙？', '有些事情別人幫不上忙，要靠誰？'], why: '三腳桌不是小氣，而是想讓愛麗絲知道：有些事情一定要自己努力、自己想辦法，才能做到。' },
      qj: { think: ['愛麗絲遇到會說話的門、變大變小，她有沒有害怕得放棄？', '每次遇到麻煩，她都怎麼做？'], why: '愛麗絲對新奇的事很好奇，遇到困難也不放棄，一直想辦法，像吃蛋糕、搖扇子。所以她是好奇又勇敢、會想辦法的人。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我不會吃，因為不知道是誰放的，可能不安全。', '我會先問大人，大人說可以再吃。'], bad: ['我會全部吃掉，因為蛋糕很好吃。', '我會把蛋糕丟到地上踩一踩。'], why: '來路不明的食物可能不安全，最好不要吃，或先問大人。看到就全部吃掉很危險；丟在地上踩，是浪費食物。' },
      k2: { good: ['刷牙要自己刷，別人沒辦法幫我刷乾淨。', '學騎腳踏車，一定要自己踩、自己練習。'], bad: ['功課都叫媽媽幫我寫。', '我什麼事都不用自己做。'], why: '題目問的是一定要自己做的事。刷牙、學騎腳踏車，都要靠自己。叫媽媽寫功課是不對的；什麼都不做，也沒有回答問題。' }
    },
    hanzi: [
      { id: 'h-背', combo: { layout: 'tb', parts: [['北', 's', ''], ['月', 'm', '身體']] }, char: '背', zhuyin: 'ㄅㄟˋ', radical: '肉', strokes: 9, words: ['背心', '背包'], say: '背，背包的背', cloze: '＿包', img: 'cw-backpack.png', options: ['背', '北', '輩', '悲'], clue: '這個字的上面是「北」，下面和身體有關。', explain: '答案是「背」，下面是「月」；「北」少了月，「輩」的下面是「車」，「悲」的下面是「心」。', parts: ['北', '月'], story: '上面的「北」像兩個人背對背，下面的「月」在這裡是身體。身體後面那一面，就是「背」。', sentence: '爸爸買了一個新的登山背包。', build: { layout: 'tb', show: ['北', '？'], answer: '月', options: ['月', '日', '目', '田'], clue: '想一想：背是身體的一部分，下面放和身體有關的部件。' } },
      { id: 'h-錶', combo: { layout: 'lr', parts: [['金', 'm', '金屬'], ['表', 's', '']] }, char: '錶', zhuyin: 'ㄅㄧㄠˇ', radical: '金', strokes: 16, words: ['懷錶', '手錶'], say: '錶，手錶的錶', cloze: '手＿', img: 'cw-wristwatch.png', options: ['錶', '表', '俵', '裱'], clue: '這個字的右邊是「表」，左邊和金屬有關。', explain: '答案是「錶」，左邊是金字旁；「表」沒有金字旁，「裱」的左邊是衣字旁。', parts: ['金', '表'], story: '左邊是金，右邊的「表」念起來像「錶」。用金屬做的、可以看時間的小東西，就是「錶」。', sentence: '哥哥戴著一支新手錶。', build: { layout: 'lr', show: ['？', '表'], answer: '金', options: ['金', '衤', '亻', '木'], clue: '想一想：錶是用鐵和銅做的，左邊放什麼？' } },
      { id: 'h-掉', combo: { layout: 'lr', parts: [['扌', 'm', '手'], ['卓', 's', '']] }, char: '掉', zhuyin: 'ㄉㄧㄠˋ', radical: '手', strokes: 11, words: ['掉進', '掉牙'], say: '掉，掉牙的掉', cloze: '＿牙', img: 'cw-lost-tooth.png', options: ['掉', '桌', '悼', '卓'], clue: '這個字的右邊是「卓」，左邊和手有關。', explain: '答案是「掉」，左邊是提手旁；「桌」的下面是「木」，「悼」的左邊是豎心旁。', parts: ['扌', '卓'], story: '左邊是手，右邊的「卓」念起來有點像「掉」。手一鬆，東西就落下去，就是「掉」。', sentence: '妹妹的門牙掉了一顆。', build: { layout: 'lr', show: ['？', '卓'], answer: '扌', options: ['扌', '木', '忄', '氵'], clue: '想一想：東西從手中落下去，左邊放什麼？' } },
      { id: 'h-深', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['罙', 's', '']] }, char: '深', zhuyin: 'ㄕㄣ', radical: '水', strokes: 11, words: ['深不見底', '深夜'], say: '深，深夜的深', cloze: '＿夜', img: 'cw-late-night.png', options: ['深', '探', '琛', '滲'], clue: '這個字的右邊是「罙」，左邊和水有關。', explain: '答案是「深」，左邊是三點水；「探」的左邊是提手旁，「琛」的左邊是玉字旁。', parts: ['氵', '罙'], story: '左邊是水，右邊的「罙」念起來像「深」。水很多、看不到底，就是「深」；夜晚很晚了，叫「深夜」。', sentence: '到了深夜，大家都睡著了。', build: { layout: 'lr', show: ['？', '罙'], answer: '氵', options: ['氵', '扌', '木', '亻'], clue: '想一想：水很多、看不到底，左邊和水有關。' } },
      { id: 'h-鎖', combo: { type: '形聲字', pict: '左邊是金字旁，和金屬有關；右邊念起來像「鎖」。用金屬做、可以把門關緊打不開的東西，就是「鎖」。' }, char: '鎖', zhuyin: 'ㄙㄨㄛˇ', radical: '金', strokes: 18, words: ['上鎖', '鎖門'], say: '鎖，鎖門的鎖', cloze: '＿門', img: 'cw-lock-door.png', options: ['鎖', '瑣', '鎮', '銷'], clue: '這個字的左邊是金字旁，右邊的上面是「小」。', explain: '答案是「鎖」；「瑣」的左邊是玉字旁，「鎮」的右邊是「真」，「銷」的右邊是「肖」。', parts: ['金', '⺌', '貝'], story: '左邊是金，用金屬做的。把門關緊、別人打不開的東西，就是「鎖」。', sentence: '出門前，我把家門鎖好。' },
      { id: 'h-鑰', combo: { type: '形聲字', pict: '左邊是金字旁，右邊的「龠」念起來像「鑰」。用金屬做的、能打開鎖的小東西，就是「鑰匙」。' }, char: '鑰', zhuyin: 'ㄧㄠˋ', radical: '金', strokes: 25, words: ['鑰匙', '鑰匙圈'], say: '鑰，鑰匙的鑰', cloze: '＿匙圈', img: 'cw-keyring.png', options: ['鑰', '籥', '龠', '錀'], clue: '這個字的左邊是金字旁，右邊的筆畫很多。', explain: '答案是「鑰」；「龠」少了金字旁，「籥」的上面是竹字頭。', parts: ['金', '龠'], story: '左邊是金，右邊的「龠」念起來像「鑰」。用金屬做、可以打開鎖的，就是「鑰匙」。', sentence: '我的書包上掛著一個鑰匙圈。' },
      { id: 'h-匙', combo: { type: '形聲字', pict: '右邊的「匕」像一支湯匙，左邊的「是」念起來有點像「匙」。用來舀東西吃的小工具，就是「湯匙」。' }, char: '匙', zhuyin: 'ㄔˊ', radical: '匕', strokes: 11, words: ['鑰匙', '湯匙'], say: '匙，湯匙的匙', cloze: '湯＿', img: 'cw-spoon.png', options: ['匙', '是', '題', '提'], clue: '這個字的左邊是「是」，右邊是「匕」。', explain: '答案是「匙」；「是」少了匕，「題」的右邊是「頁」，「提」的左邊是提手旁。', parts: ['是', '匕'], story: '右邊的「匕」很久以前就是湯匙的樣子，左邊的「是」念起來有點像「匙」。用來舀湯的工具，就是「湯匙」。', sentence: '我用湯匙喝湯。' },
      { id: 'h-汁', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['十', 's', '']] }, char: '汁', zhuyin: 'ㄓ', radical: '水', strokes: 5, words: ['果汁', '墨汁'], say: '汁，墨汁的汁', cloze: '墨＿', img: 'cw-ink-bottle.png', options: ['汁', '計', '什', '針'], clue: '這個字的右邊是「十」，左邊和水有關。', explain: '答案是「汁」，左邊是三點水；「計」的左邊是言字旁，「什」的左邊是單人旁，「針」的左邊是金字旁。', parts: ['氵', '十'], story: '左邊是水，右邊的「十」念起來有點像「汁」。從東西裡擠出來、水水的液體，就是「汁」。', sentence: '寫書法要用墨汁。', build: { layout: 'lr', show: ['？', '十'], answer: '氵', options: ['氵', '言', '亻', '金'], clue: '想一想：汁是水水的液體，左邊放什麼？' } },
      { id: 'h-示', combo: { type: '象形字', pict: '很久以前的「示」，像一張放祭品的桌子。把東西擺出來給大家看，就是「示」。' }, char: '示', zhuyin: 'ㄕˋ', radical: '示', strokes: 5, words: ['標示', '示範'], say: '示，示範的示', cloze: '＿範', img: 'cw-demonstrate.png', options: ['示', '宗', '禁', '票'], clue: '這個字只有五畫，上面是兩橫，下面像「小」。', explain: '答案是「示」；「宗」的上面多了寶蓋頭，「禁」的上面多了「林」，「票」的上面多了「覀」。', parts: ['二', '小'], story: '「示」像一張擺東西的桌子。把東西擺出來給大家看，就是「示」；先做給大家看，叫「示範」。', sentence: '老師先示範一次怎麼投籃。' },
      { id: 'h-迫', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的「白」念起來有點像「迫」。被逼著往前走，就是「迫」。' }, char: '迫', zhuyin: 'ㄆㄛˋ', radical: '辵', strokes: 9, words: ['迫不及待', '被迫'], say: '迫，被迫的迫', cloze: '被＿', img: 'cw-rain-cancel.png', options: ['迫', '伯', '拍', '怕'], clue: '這個字有辵字旁，裡面是「白」。', explain: '答案是「迫」，有辵字旁；「伯」的左邊是單人旁，「拍」的左邊是提手旁，「怕」的左邊是豎心旁。', parts: ['辶', '白'], story: '辵字旁和走路有關，裡面的「白」念起來有點像「迫」。被逼著、只好這樣做，就是「被迫」；急得等不了，就是「迫不及待」。', sentence: '下大雨了，比賽被迫取消。' },
      { id: 'h-袋', combo: { layout: 'tb', parts: [['代', 's', ''], ['衣', 'm', '衣服']] }, char: '袋', zhuyin: 'ㄉㄞˋ', radical: '衣', strokes: 11, words: ['口袋', '袋鼠'], say: '袋，袋鼠的袋', cloze: '＿鼠', img: 'cw-kangaroo.png', options: ['袋', '代', '貸', '黛'], clue: '這個字的上面是「代」。', explain: '答案是「袋」，下面是「衣」；「代」少了衣，「貸」的下面是「貝」，「黛」的下面是「黑」。', parts: ['代', '衣'], story: '上面的「代」念起來像「袋」，下面是衣服。用布做的、可以裝東西的，就是「袋子」。', sentence: '袋鼠寶寶在媽媽懷裡睡覺。', build: { layout: 'tb', show: ['代', '？'], answer: '衣', options: ['衣', '貝', '心', '木'], clue: '想一想：口袋是縫在外套上的，下面放和穿的東西有關的部件。' } },
      { id: 'h-哭', combo: { type: '會意字', pict: '上面兩個「口」像兩隻張大的眼睛和嘴巴，下面的「犬」像一隻大聲叫的狗。張大嘴巴、大聲叫，就是「哭」。' }, char: '哭', zhuyin: 'ㄎㄨ', radical: '口', strokes: 10, words: ['哭', '哭泣'], say: '哭，哭泣的哭', cloze: '＿泣', img: 'cw-baby-cry.png', options: ['哭', '器', '笑', '吳'], clue: '這個字的上面有兩個「口」，下面是「犬」。', explain: '答案是「哭」，只有兩個口；「器」有四個口，「笑」的上面是竹字頭。', parts: ['口', '口', '犬'], story: '上面兩個口，下面一隻狗。張大嘴巴大聲叫，眼淚流下來，就是「哭」。', sentence: '小寶寶餓了，大聲哭泣。' },
      { id: 'h-盒', combo: { layout: 'tb', parts: [['合', 's', ''], ['皿', 'm', '容器']] }, char: '盒', zhuyin: 'ㄏㄜˊ', radical: '皿', strokes: 11, words: ['盒子', '便當盒'], say: '盒，便當盒的盒', cloze: '便當＿', img: 'cw-lunchbox.png', options: ['盒', '合', '盆', '蓋'], clue: '這個字的上面是「合」。', explain: '答案是「盒」，下面是「皿」；「合」少了皿，「盆」的上面是「分」，「蓋」的上面是草字頭。', parts: ['合', '皿'], story: '上面的「合」是蓋起來，下面的「皿」是裝東西的容器。可以蓋起來的容器，就是「盒子」。', sentence: '我的便當盒裡有飯和菜。', build: { layout: 'tb', show: ['合', '？'], answer: '皿', options: ['皿', '口', '木', '心'], clue: '想一想：裝東西的容器，下面放什麼？' } },
      { id: 'h-扇', combo: { type: '會意字', pict: '外面是「戶」，像一扇門；裡面是「羽」，像鳥的羽毛。門開開關關會有風，羽毛搧一搧也有風，就是「扇」。' }, char: '扇', zhuyin: 'ㄕㄢˋ', radical: '戶', strokes: 10, words: ['扇子', '電風扇'], say: '扇，電風扇的扇', cloze: '電風＿', img: 'cw-electric-fan.png', options: ['扇', '搧', '翩', '肩'], clue: '這個字的外面是「戶」，裡面是「羽」。', explain: '答案是「扇」；「搧」多了提手旁，「肩」的裡面是「月」。', parts: ['戶', '羽'], story: '外面是門，裡面是羽毛。羽毛做的、搧一搧就有風的工具，就是「扇子」。', sentence: '夏天好熱，打開電風扇吧。' },
      { id: 'h-遲', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的「犀」念起來有點像「遲」。走得很慢、很晚才到，就是「遲」。' }, char: '遲', zhuyin: 'ㄔˊ', radical: '辵', strokes: 16, words: ['遲到', '遲疑'], say: '遲，遲疑的遲', cloze: '＿疑', img: 'cw-hesitate.png', options: ['遲', '犀', '運', '達'], clue: '這個字有辵字旁，裡面是「犀」。', explain: '答案是「遲」；「犀」少了辵字旁，「運」的裡面是「軍」，「達」的裡面是「幸」。', parts: ['辶', '犀'], story: '辵字旁和走路有關，裡面的「犀」念起來有點像「遲」。走得很慢、很晚才到，就是「遲到」；拿不定主意，就是「遲疑」。', sentence: '他站在泳池邊遲疑了一下，才跳下去。' }
    ],
    vocab: [
      { id: 'v-背心', cloze: true, clozeOptions: ['背心', '褲子', '帽子', '襪子'], word: '背心', meaning: '沒有袖子的上衣。', example: '天氣好熱，爸爸穿著一件＿＿。', img: 'vest.png', options: ['背心', '懷錶', '口袋', '盒子'] },
      { id: 'v-懷錶', cloze: true, clozeOptions: ['懷錶', '手機', '電視', '鬧鐘'], word: '懷錶', meaning: '放在口袋裡、可以帶著走的圓形時鐘。', example: '爺爺從口袋裡拿出一個金色的＿＿看時間。', img: 'pocket-watch.png', options: ['懷錶', '鑰匙', '扇子', '背心'] },
      { id: 'v-掉進', cloze: true, clozeOptions: ['掉進', '爬出', '飛上', '跳過'], word: '掉進', meaning: '從上面落下，跌到裡面去。', example: '小球＿＿水溝裡了。', img: 'fall-hole.png', options: ['掉進', '上鎖', '遲到', '標示'] },
      { id: 'v-深不見底', cloze: true, clozeOptions: ['深不見底', '淺到腳踝', '一望無際', '平坦寬廣'], word: '深不見底', meaning: '往下看黑漆漆的一片，好像沒有盡頭。', example: '這口井＿＿＿＿，丟顆石頭下去都聽不到聲音。', img: 'deep-hole.png', options: ['深不見底', '東張西望', '迫不及待', '果汁'] },
      { id: 'v-東張西望', cloze: true, clozeOptions: ['東張西望', '目不轉睛', '閉上眼睛', '低頭不語'], word: '東張西望', meaning: '到處看來看去。', example: '上課的時候，他一直＿＿＿＿，沒有專心聽講。', img: 'look-around.png', options: ['東張西望', '深不見底', '掉進', '哭'] },
      { id: 'v-上鎖', cloze: true, clozeOptions: ['上鎖', '打開', '推開', '拆掉'], word: '上鎖', meaning: '把門關好，讓別人打不開。', example: '睡覺前，爸爸把大門＿＿。', img: 'locked-door.png', options: ['上鎖', '鑰匙', '標示', '口袋'] },
      { id: 'v-鑰匙', cloze: true, clozeOptions: ['鑰匙', '剪刀', '鉛筆', '橡皮'], word: '鑰匙', meaning: '開鎖用的小東西。', example: '我用＿＿打開家門。', img: 'gold-key.png', options: ['鑰匙', '扇子', '懷錶', '上鎖'] },
      { id: 'v-果汁', cloze: true, clozeOptions: ['果汁', '白飯', '麵包', '餅乾'], word: '果汁', meaning: '柳丁、葡萄擠出來的甜甜飲料。', example: '早餐我喝了一杯新鮮的＿＿。', img: 'juice.png', options: ['果汁', '盒子', '背心', '遲到'] },
      { id: 'v-標示', cloze: true, clozeOptions: ['標示', '忘記', '藏起', '擦掉'], word: '標示', meaning: '貼在東西上，告訴別人的記號或文字。', example: '瓶子上有危險的＿＿，不能亂喝。', img: 'warning-label.png', options: ['標示', '上鎖', '哭', '掉進'] },
      { id: 'v-迫不及待', cloze: true, clozeOptions: ['迫不及待', '不慌不忙', '無精打采', '興趣缺缺'], word: '迫不及待', meaning: '心裡急得要命，想馬上就做。', example: '一放學，弟弟就＿＿＿＿的打開新玩具。', img: 'cant-wait.png', options: ['迫不及待', '東張西望', '深不見底', '扇子'] },
      { id: 'v-口袋', cloze: true, clozeOptions: ['口袋', '鈕扣', '袖子', '領子'], word: '口袋', meaning: '縫在衣服上，可以放東西的地方。', example: '我把糖果放進＿＿裡。', img: 'pocket.png', options: ['口袋', '懷錶', '果汁', '標示'] },
      { id: 'v-哭', cloze: true, clozeOptions: ['哭', '笑', '跳', '唱'], word: '哭', meaning: '因為難過而流眼淚。', example: '妹妹跌倒了，難過得＿了起來。', img: 'crying-girl.png', options: ['哭', '掉進', '上鎖', '盒子'] },
      { id: 'v-盒子', cloze: true, clozeOptions: ['盒子', '雨傘', '枕頭', '鞋子'], word: '盒子', meaning: '有蓋、可以裝東西的小箱。', example: '我把彈珠收進＿＿裡。', img: 'cake-box.png', options: ['盒子', '口袋', '鑰匙', '背心'] },
      { id: 'v-扇子', cloze: true, clozeOptions: ['扇子', '雨傘', '鍋子', '杯子'], word: '扇子', meaning: '搖一搖就有風的工具。', example: '天氣好熱，奶奶拿著＿＿搧風。', img: 'fan.png', options: ['扇子', '果汁', '遲到', '懷錶'] },
      { id: 'v-遲到', cloze: true, clozeOptions: ['遲到', '早到', '準時', '請假'], word: '遲到', meaning: '超過約好的時間才來。', example: '我睡過頭，上學＿＿了。', img: 'late-rabbit.png', options: ['遲到', '迫不及待', '哭', '東張西望'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-背', char: '背', img: 'cw-backpack.png', charMeaning: '身體後面那一面。', word: '背包', meaning: '揹在身體後面、可以裝東西的包包。', example: '爸爸買了一個新的登山＿＿。', options: ['背包', '手錶', '深夜', '湯匙'] },
      { id: 'cw-錶', char: '錶', img: 'cw-wristwatch.png', charMeaning: '看時間的小東西。', word: '手錶', meaning: '戴在手腕上看時間的小時鐘。', example: '哥哥戴著一支新＿＿。', options: ['手錶', '墨汁', '袋鼠', '鎖門'] },
      { id: 'cw-掉', char: '掉', img: 'cw-lost-tooth.png', charMeaning: '落下來。', word: '掉牙', meaning: '小時候的牙齒鬆了，落下來。', example: '妹妹七歲了，開始＿＿了。', options: ['掉牙', '示範', '哭泣', '背包'] },
      { id: 'cw-深', char: '深', img: 'cw-late-night.png', charMeaning: '看不到底；很晚。', word: '深夜', meaning: '夜裡很晚很晚的時候。', example: '到了＿＿，大家都睡著了。', options: ['深夜', '被迫', '電風扇', '掉牙'] },
      { id: 'cw-鎖', char: '鎖', img: 'cw-lock-door.png', charMeaning: '把東西關緊，打不開。', word: '鎖門', meaning: '用鑰匙把門關緊。', example: '出門前，記得要＿＿。', options: ['鎖門', '遲疑', '手錶', '便當盒'] },
      { id: 'cw-鑰', char: '鑰', img: 'cw-keyring.png', charMeaning: '開鎖的工具。', word: '鑰匙圈', meaning: '把好幾把鑰匙串在一起的小圈圈。', example: '我的書包上掛著一個＿＿＿。', options: ['鑰匙圈', '深夜', '示範', '袋鼠'] },
      { id: 'cw-匙', char: '匙', img: 'cw-spoon.png', charMeaning: '舀東西的工具。', word: '湯匙', meaning: '舀湯、舀飯用的小工具。', example: '我用＿＿喝湯。', options: ['湯匙', '鎖門', '哭泣', '遲疑'] },
      { id: 'cw-汁', char: '汁', img: 'cw-ink-bottle.png', charMeaning: '水水的液體。', word: '墨汁', meaning: '寫毛筆字用的黑色液體。', example: '寫書法要用＿＿。', options: ['墨汁', '背包', '被迫', '電風扇'] },
      { id: 'cw-示', char: '示', img: 'cw-demonstrate.png', charMeaning: '擺出來給人看。', word: '示範', meaning: '先做一次給大家看。', example: '老師先＿＿一次怎麼投籃。', options: ['示範', '湯匙', '掉牙', '鑰匙圈'] },
      { id: 'cw-迫', char: '迫', img: 'cw-rain-cancel.png', charMeaning: '被逼著。', word: '被迫', meaning: '不想這樣，卻只好這樣做。', example: '下大雨了，比賽＿＿取消。', options: ['被迫', '墨汁', '手錶', '深夜'] },
      { id: 'cw-袋', char: '袋', img: 'cw-kangaroo.png', charMeaning: '可以裝東西的布包。', word: '袋鼠', meaning: '肚子前面有育兒袋、很會跳的動物。', example: '＿＿媽媽把寶寶放在肚子前面。', options: ['袋鼠', '鎖門', '示範', '遲疑'] },
      { id: 'cw-哭', char: '哭', img: 'cw-baby-cry.png', charMeaning: '流著眼淚出聲。', word: '哭泣', meaning: '流著眼淚，難過的出聲。', example: '小寶寶餓了，大聲＿＿。', options: ['哭泣', '背包', '鑰匙圈', '墨汁'] },
      { id: 'cw-盒', char: '盒', img: 'cw-lunchbox.png', charMeaning: '有蓋子的容器。', word: '便當盒', meaning: '裝午餐、可以帶著走的盒子。', example: '我的＿＿＿裡有飯和菜。', options: ['便當盒', '被迫', '掉牙', '湯匙'] },
      { id: 'cw-扇', char: '扇', img: 'cw-electric-fan.png', charMeaning: '搧出風的工具。', word: '電風扇', meaning: '插上電會轉動、吹出涼風的機器。', example: '夏天好熱，打開＿＿＿吧。', options: ['電風扇', '袋鼠', '深夜', '示範'] },
      { id: 'cw-遲', char: '遲', img: 'cw-hesitate.png', charMeaning: '慢、晚。', word: '遲疑', meaning: '拿不定主意，一直猶豫。', example: '他站在泳池邊＿＿了一下，才跳下去。', options: ['遲疑', '哭泣', '便當盒', '手錶'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-汗流浹背', situationImg: 'id-sweaty.png', idiom: '汗流浹背', char: '背', meaning: '流了很多汗，背後的衣服都溼透了。', example: '打完一場籃球，大家都汗流浹背。', situation: '大熱天跑完操場三圈，小華的衣服背後全都溼了。',
        fill: { options: ['大太陽下搬了一整天的箱子，工人＿＿＿＿。', '坐在冷氣房裡看書，他＿＿＿＿。'], clue: '提示：哪一句是流了很多汗？', explain: '第一句用得對：大太陽下搬東西，流了很多汗。冷氣房裡很涼，不會流很多汗。' } },
      { id: 'i-深思熟慮', situationImg: 'id-think-hard.png', idiom: '深思熟慮', char: '深', meaning: '想得很仔細、很周到。', example: '要不要養小狗，媽媽說要深思熟慮。', situation: '下棋的時候，哥哥托著下巴想了很久很久，才放下一顆棋子。',
        fill: { options: ['爸爸＿＿＿＿以後，才決定要買哪一輛車。', '他想都沒想就亂買東西，真是＿＿＿＿。'], clue: '提示：哪一句是想得很仔細？', explain: '第一句用得對：爸爸想清楚才決定。想都沒想就亂買，剛好相反。' } },
      { id: 'i-從容不迫', situationImg: 'id-calm-fire-drill.png', idiom: '從容不迫', char: '迫', meaning: '遇到事情不慌不忙，很冷靜。', example: '防災演練時，同學們從容不迫的排隊走出教室。', situation: '警報響了，同學們排好隊，一個接一個慢慢走出教室，沒有人推擠。',
        fill: { options: ['上臺比賽時，她＿＿＿＿的彈完了整首曲子。', '他一聽到雷聲就嚇得到處亂跑，真是＿＿＿＿。'], clue: '提示：哪一句是不慌不忙、很冷靜？', explain: '第一句用得對：她很冷靜的彈完曲子。嚇得到處亂跑，剛好相反。' } },
      { id: 'i-姍姍來遲', situationImg: 'id-late-friend.png', idiom: '姍姍來遲', char: '遲', meaning: '慢慢的才來，讓大家等了很久。', example: '大家都到齊了，他才姍姍來遲。', situation: '電影快開始了，大家在門口等了好久，小明才慢吞吞的走過來。',
        fill: { options: ['約好九點出發，他到十點才＿＿＿＿。', '他每天都提早十分鐘到學校，真是＿＿＿＿。'], clue: '提示：哪一句是很晚才來？', explain: '第一句用得對：晚了一個小時才到。每天提早到，剛好相反。' } },
      { id: 'i-背水一戰', situationImg: 'id-last-chance.png', idiom: '背水一戰', char: '背', meaning: '沒有退路了，下定決心拚到底。', example: '最後一場輸了就要淘汰，大家決定背水一戰。', situation: '球隊只剩最後一次機會，大家圍成一圈，決定拚到最後一秒。',
        fill: { options: ['輸了這場就要淘汰，球員們決定＿＿＿＿。', '比賽還沒開始，他就決定放棄，真是＿＿＿＿。'], clue: '提示：哪一句是沒有退路，決定拚到底？', explain: '第一句用得對：沒有退路，決定拚了。還沒開始就放棄，剛好相反。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-背', char: '背', wrong: '北', sentence: '爸爸買了一個新的登山背包。', options: ['背', '北', '悲'], clue: '這裡說的是揹在身上的包包，想一想，哪一個字的下面有「月」？', explain: '要改成「背」。揹在身上的包包是「背包」，下面有月；「北」是北方的北。' },
      { id: 'fx-錶', char: '錶', wrong: '表', sentence: '哥哥戴著一支新手錶。', options: ['錶', '表', '裱'], clue: '這裡說的是戴在手上看時間的東西，想一想，哪一個字有金字旁？', explain: '要改成「錶」。看時間的東西是「手錶」，有金字旁；「表」是表演的表。' },
      { id: 'fx-掉', char: '掉', wrong: '桌', sentence: '妹妹的門牙掉了一顆。', options: ['掉', '桌', '卓'], clue: '這裡是說落下來，想一想，哪一個字有提手旁？', explain: '要改成「掉」。落下來是「掉」，有提手旁；「桌」是桌子的桌。' },
      { id: 'fx-深', char: '深', wrong: '探', sentence: '到了深夜，大家都睡著了。', options: ['深', '探', '琛'], clue: '這裡是說夜裡很晚的時候，想一想，哪一個字有三點水？', explain: '要改成「深」。很晚的夜裡是「深夜」，有三點水；「探」是探險的探。' },
      { id: 'fx-鎖', char: '鎖', wrong: '瑣', sentence: '出門前，我把家門鎖好。', options: ['鎖', '瑣', '索'], clue: '這裡是說讓門打不開，想一想，哪一個字有金字旁？', explain: '要改成「鎖」。讓門打不開是「鎖門」，有金字旁；「瑣」的左邊是玉字旁。' },
      { id: 'fx-鑰', char: '鑰', wrong: '藥', sentence: '我的書包上掛著一個鑰匙圈。', options: ['鑰', '藥', '要'], clue: '這裡說的是開鎖的東西，跟吃藥沒有關係。', explain: '要改成「鑰」。開鎖的東西是「鑰匙」，有金字旁；「藥」是吃藥的藥。' },
      { id: 'fx-匙', char: '匙', wrong: '是', sentence: '我用湯匙喝湯。', options: ['匙', '是', '題'], clue: '這裡說的是舀湯的工具，想一想，哪一個字的右邊是「匕」？', explain: '要改成「匙」。舀湯的工具是「湯匙」，右邊是匕；「是」少了匕。' },
      { id: 'fx-汁', char: '汁', wrong: '計', sentence: '寫書法要用墨汁。', options: ['汁', '計', '針'], clue: '這裡說的是黑色的液體，想一想，哪一個字有三點水？', explain: '要改成「汁」。黑色的液體是「墨汁」，有三點水；「計」是計算的計。' },
      { id: 'fx-示', char: '示', wrong: '是', sentence: '老師先示範一次怎麼投籃。', options: ['示', '是', '式'], clue: '這裡是說先做給大家看，跟「是不是」沒有關係。', explain: '要改成「示」。做給大家看是「示範」；「是」是「是不是」的是。' },
      { id: 'fx-迫', char: '迫', wrong: '怕', sentence: '下大雨了，比賽被迫取消。', options: ['迫', '怕', '拍'], clue: '這裡是說只好這樣做，跟害怕沒有關係。', explain: '要改成「迫」。只好這樣做是「被迫」，有辵字旁；「怕」是害怕的怕。' },
      { id: 'fx-袋', char: '袋', wrong: '代', sentence: '我把糖果放進口袋裡。', options: ['袋', '代', '貸'], clue: '這裡說的是衣服上放東西的地方，想一想，哪一個字的下面是「衣」？', explain: '要改成「袋」。衣服上放東西的地方是「口袋」，下面是衣；「代」是代替的代。' },
      { id: 'fx-哭', char: '哭', wrong: '器', sentence: '小寶寶餓了，大聲哭泣。', options: ['哭', '器', '笑'], clue: '這裡是說流眼淚，跟機器沒有關係。', explain: '要改成「哭」。流眼淚是「哭泣」；「器」是機器的器。' },
      { id: 'fx-盒', char: '盒', wrong: '合', sentence: '我的便當盒裡有飯和菜。', options: ['盒', '合', '何'], clue: '這裡說的是裝午餐的容器，想一想，哪一個字的下面有「皿」？', explain: '要改成「盒」。裝午餐的容器是「便當盒」，下面有皿；「合」是合作的合。' },
      { id: 'fx-扇', char: '扇', wrong: '善', sentence: '夏天好熱，打開電風扇吧。', options: ['扇', '善', '搧'], clue: '這裡說的是吹風的機器，跟善良沒有關係。', explain: '要改成「扇」。吹風的機器是「電風扇」；「善」是善良的善。' },
      { id: 'fx-遲', char: '遲', wrong: '持', sentence: '他站在泳池邊遲疑了一下，才跳下去。', options: ['遲', '持', '馳'], clue: '這裡是說拿不定主意，想一想，哪一個字有辵字旁？', explain: '要改成「遲」。拿不定主意是「遲疑」，有辵字旁；「持」是堅持的持。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿極」是地球最上面、最冷的那一端。', sentence: '＿極熊住在很冷的地方。', frame: '＿極', options: ['北', '背'], answer: '北', clue: '提示：這個字的下面沒有「月」。', explain: '答案是「北」；「背」是背包的背。' },
      { id: 's2', meaning: '「＿演」是在臺上演給大家看。', sentence: '我們班要上臺＿演跳舞。', frame: '＿演', options: ['表', '錶'], answer: '表', clue: '提示：這個字沒有金字旁。', explain: '答案是「表」；「錶」是手錶的錶。' },
      { id: 's3', meaning: '「書＿」是寫功課用的大檯面。', sentence: '我坐在書＿前寫功課。', frame: '書＿', options: ['桌', '掉'], answer: '桌', clue: '提示：這個字的下面是「木」。', explain: '答案是「桌」；「掉」是掉牙的掉。' },
      { id: 's4', meaning: '「＿險」是去沒去過的地方，發現新東西。', sentence: '我們去森林裡＿險。', frame: '＿險', options: ['探', '深'], answer: '探', clue: '提示：這個字的左邊是提手旁。', explain: '答案是「探」；「深」是深夜的深。' },
      { id: 's5', meaning: '「＿算」是用數字算一算。', sentence: '我在紙上＿算答案。', frame: '＿算', options: ['計', '汁'], answer: '計', clue: '提示：這個字的左邊是言字旁。', explain: '答案是「計」；「汁」是果汁的汁。' },
      { id: 's6', meaning: '「害＿」是很擔心、不敢。', sentence: '弟弟一個人在黑黑的房間會害＿。', frame: '害＿', options: ['怕', '迫'], answer: '怕', clue: '提示：這個字的左邊是豎心旁。', explain: '答案是「怕」；「迫」是被迫的迫。' },
      { id: 's7', meaning: '「＿替」是換別人來做。', sentence: '媽媽生病了，爸爸＿替她煮飯。', frame: '＿替', options: ['代', '袋'], answer: '代', clue: '提示：這個字的下面沒有「衣」。', explain: '答案是「代」；「袋」是口袋的袋。' },
      { id: 's8', meaning: '「機＿」是會自己動的工具。', sentence: '工廠裡有很多大機＿。', frame: '機＿', options: ['器', '哭'], answer: '器', clue: '提示：這個字有四個「口」。', explain: '答案是「器」；「哭」只有兩個口。' },
      { id: 's9', meaning: '「＿作」是大家一起做。', sentence: '大家分工＿作，很快就打掃完了。', frame: '＿作', options: ['合', '盒'], answer: '合', clue: '提示：這個字的下面沒有「皿」。', explain: '答案是「合」；「盒」是便當盒的盒。' },
      { id: 's10', meaning: '「＿膀」是脖子兩邊、手臂上面的地方。', sentence: '爸爸讓我坐在他的＿膀上。', frame: '＿膀', options: ['肩', '扇'], answer: '肩', clue: '提示：這個字的裡面是「月」。', explain: '答案是「肩」；「扇」是扇子的扇，裡面是羽。' },
      { id: 's11', meaning: '「游泳＿」是游泳的地方。', sentence: '暑假我們去游泳＿玩水。', frame: '游泳＿', options: ['池', '遲'], answer: '池', clue: '提示：這個字的左邊是三點水。', explain: '答案是「池」；「遲」是遲到的遲。' }
    ],
    listen: [
      { id: 'l1', text: '沒有袖子的上衣，穿起來涼涼的。', answer: 0, options: [{ text: '背心', img: 'vest.png' }, { text: '懷錶', img: 'pocket-watch.png' }, { text: '盒子', img: 'cake-box.png' }, { text: '扇子', img: 'fan.png' }] },
      { id: 'l2', text: '一個圓圓的金色時鐘，放在口袋裡帶著走。', answer: 0, options: [{ text: '懷錶', img: 'pocket-watch.png' }, { text: '鑰匙', img: 'gold-key.png' }, { text: '標示', img: 'warning-label.png' }, { text: '哭', img: 'crying-girl.png' }] },
      { id: 'l3', text: '一個非常深的洞，往下看黑漆漆的。', answer: 0, options: [{ text: '深不見底', img: 'deep-hole.png' }, { text: '東張西望', img: 'look-around.png' }, { text: '果汁', img: 'juice.png' }, { text: '遲到', img: 'late-rabbit.png' }] },
      { id: 'l4', text: '站在路口，轉頭這邊看看、那邊看看。', answer: 0, options: [{ text: '東張西望', img: 'look-around.png' }, { text: '迫不及待', img: 'cant-wait.png' }, { text: '上鎖', img: 'locked-door.png' }, { text: '口袋', img: 'pocket.png' }] },
      { id: 'l5', text: '開門鎖用的小東西。', answer: 0, options: [{ text: '鑰匙', img: 'gold-key.png' }, { text: '扇子', img: 'fan.png' }, { text: '背心', img: 'vest.png' }, { text: '盒子', img: 'cake-box.png' }] },
      { id: 'l6', text: '柳丁、葡萄擠出來的甜甜飲料。', answer: 0, options: [{ text: '果汁', img: 'juice.png' }, { text: '標示', img: 'warning-label.png' }, { text: '掉進', img: 'fall-hole.png' }, { text: '懷錶', img: 'pocket-watch.png' }] },
      { id: 'l7', text: '心裡好急，一秒鐘都等不下去。', answer: 0, options: [{ text: '迫不及待', img: 'cant-wait.png' }, { text: '深不見底', img: 'deep-hole.png' }, { text: '哭', img: 'crying-girl.png' }, { text: '上鎖', img: 'locked-door.png' }] },
      { id: 'l8', text: '搖一搖就有涼涼的風。', answer: 0, options: [{ text: '扇子', img: 'fan.png' }, { text: '口袋', img: 'pocket.png' }, { text: '鑰匙', img: 'gold-key.png' }, { text: '遲到', img: 'late-rabbit.png' }] }
    ],
    /* ---------- 句型、修辭（句子都是 Claude 自己寫的） ---------- */
    pattern: [
      { key: 'ruguojiu', id: 'rgj', title: '如果……就……', img: 'ruguojiu.png',
        meaning: '先用「如果」說一個情況，再用「就」說遇到這個情況時要怎麼做、會怎麼樣。',
        examples: ['如果累了，就坐下來休息一下。'],
        match: [
          { id: 'pt-rgj-m1', img: 'pt-rest-tired.png', front: '如果爬山爬累了，', options: ['就坐下來休息一下。', '就跳進河裡游泳。', '就馬上去寫功課。'], clue: '提示：看看圖片，一家人坐在石頭上做什麼？', explain: '答案是「就坐下來休息一下」：累了就休息。' },
          { id: 'pt-rgj-m2', img: 'pt-ask-mom.png', front: '如果找不到襪子，', options: ['就去問問媽媽。', '就去公園盪鞦韆。', '就把鞋子丟掉。'], clue: '提示：看看圖片，孩子跑去找誰？', explain: '答案是「就去問問媽媽」：找不到東西，就問媽媽。' },
          { id: 'pt-rgj-m3', img: 'pt-brush-teeth.png', front: '如果吃了糖果，', options: ['就要記得刷牙。', '就要去睡午覺。', '就要去曬太陽。'], clue: '提示：看看圖片，孩子吃完糖果拿著什麼？', explain: '答案是「就要記得刷牙」：吃了糖要刷牙，牙齒才不會蛀掉。' }
        ],
        conj: [
          { id: 'pt-rgj-c1', full: '如果有問題，就舉手問老師。', img: 'pt-raise-hand.png', sentence: '＿＿有問題，＿舉手問老師。', options: ['如果……就……', '……以免……', '是……還是……'], clue: '提示：遇到一個情況，接著要怎麼做。數數看每個空格有幾個字。', explain: '答案是「如果……就……」：如果有問題，就舉手問老師。' },
          { id: 'pt-rgj-c2', full: '如果花盆的土乾了，就要澆水。', img: 'pt-water-dry-soil.png', sentence: '＿＿花盆的土乾了，＿要澆水。', options: ['如果……就……', '……以免……', '是……還是……'], clue: '提示：土乾了，接著要做什麼。數數看每個空格有幾個字。', explain: '答案是「如果……就……」：如果花盆的土乾了，就要澆水。' },
          { id: 'pt-rgj-c3', full: '如果最後離開教室，就要關燈。', img: 'pt-turn-off-light.png', sentence: '＿＿最後離開教室，＿要關燈。', options: ['如果……就……', '……以免……', '是……還是……'], clue: '提示：最後一個走的人，接著要做什麼。數數看每個空格有幾個字。', explain: '答案是「如果……就……」：如果最後離開教室，就要關燈。' }
        ],
        half: [
          { id: 'pt-rgj-h1', front: '如果明天天氣好，', clue: '提示：天氣好的話，你們要做什麼？記得要說「就」。', model: '我們就去公園野餐。' },
          { id: 'pt-rgj-h2', front: '如果你覺得冷，', clue: '提示：覺得冷的時候，要怎麼辦？記得要說「就」。', model: '就多穿一件外套。' }
        ],
        whole: [
          { id: 'pt-rgj-w1', clue: '提示：先用「如果」說一個情況，再用「就」說會怎麼樣。想想看：如果你考了一百分，會發生什麼事？', model: '如果我考了一百分，媽媽就會帶我去吃冰。' }
        ] },
      { key: 'yimian', id: 'ym', title: '……以免……', img: 'yimian.png',
        meaning: '前面先說要怎麼做，再用「以免」說這樣做是為了不讓壞事發生。',
        examples: ['騎腳踏車要戴安全帽，以免受傷。'],
        match: [
          { id: 'pt-ym-m1', img: 'pt-helmet.png', front: '騎機車一定要戴安全帽，', options: ['以免發生意外時受傷。', '以免帽子太孤單。', '以免安全帽生氣。'], clue: '提示：看看圖片，戴安全帽是為了保護哪裡？', explain: '答案是「以免發生意外時受傷」：戴安全帽是為了保護頭。' },
          { id: 'pt-ym-m2', img: 'pt-umbrella-carry.png', front: '天快下雨了，出門要帶傘，', options: ['以免淋成落湯雞。', '以免雨傘太無聊。', '以免肚子餓了。'], clue: '提示：看看圖片，天空是不是黑黑的？', explain: '答案是「以免淋成落湯雞」：帶傘是為了不被雨淋溼。' },
          { id: 'pt-ym-m3', img: 'pt-hold-rail.png', front: '下樓梯要扶著扶手，', options: ['以免不小心跌倒。', '以免扶手被偷走。', '以免樓梯變長。'], clue: '提示：看看圖片，扶著扶手可以讓自己怎麼樣？', explain: '答案是「以免不小心跌倒」：扶著扶手比較不會跌倒。' }
        ],
        conj: [
          { id: 'pt-ym-c1', full: '媽媽把菜蓋起來，以免蒼蠅飛進去。', img: 'pt-cover-food.png', sentence: '媽媽把菜蓋起來，＿＿蒼蠅飛進去。', options: ['……以免……', '如果……就……', '是……也是……'], clue: '提示：蓋起來是為了不讓壞事發生。數數看有幾個空格。', explain: '答案是「……以免……」：媽媽把菜蓋起來，以免蒼蠅飛進去。' },
          { id: 'pt-ym-c2', full: '我睡前調好鬧鐘，以免睡過頭。', img: 'pt-alarm-set.png', sentence: '我睡前調好鬧鐘，＿＿睡過頭。', options: ['……以免……', '如果……就……', '是……也是……'], clue: '提示：調鬧鐘是為了不讓壞事發生。數數看有幾個空格。', explain: '答案是「……以免……」：我睡前調好鬧鐘，以免睡過頭。' },
          { id: 'pt-ym-c3', full: '過馬路要牽好弟弟的手，以免他走丟。', img: 'pt-hold-brother.png', sentence: '過馬路要牽好弟弟的手，＿＿他走丟。', options: ['……以免……', '如果……就……', '是……也是……'], clue: '提示：牽好手是為了不讓壞事發生。數數看有幾個空格。', explain: '答案是「……以免……」：過馬路要牽好弟弟的手，以免他走丟。' }
        ],
        half: [
          { id: 'pt-ym-h1', front: '吃飯前要先洗手，', clue: '提示：不洗手會怎麼樣？記得要說「以免」。', model: '以免把細菌吃下肚。' },
          { id: 'pt-ym-h2', front: '出門前要檢查書包，', clue: '提示：不檢查會怎麼樣？記得要說「以免」。', model: '以免忘了帶課本。' }
        ],
        whole: [
          { id: 'pt-ym-w1', clue: '提示：先說要怎麼做，再用「以免」說是為了不讓什麼壞事發生。想想看：冬天要注意什麼？', model: '冬天要多穿一點衣服，以免感冒。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'personify', name: '轉化', meaning: '把東西或動物寫得像人一樣，會說話、會想事情、會做人做的事，也叫「擬人」。', example: '劇本裡的小門和三腳桌都會說話、會得意、會陪伴人，就像人一樣。',
          show: { sentence: '時鐘催我：「快起床！」', mark: ['催我'] },
          yesno: [
            { id: 'rh-pe-y1', sentence: '小椅子乖乖的等我回家。', answer: true, mark: ['等我回家'], clue: '提示：這句話有沒有把椅子寫得像人一樣？', explain: '是轉化：椅子像人一樣會等我回家。' },
            { id: 'rh-pe-y2', sentence: '小椅子放在書桌前。', answer: false, clue: '提示：這句話裡的椅子，有沒有做人做的事？', explain: '不是轉化：這句話只是說椅子放在哪裡。' }
          ],
          pick: [
            { id: 'rh-pe-p1', mark: ['抱怨'], options: ['鞋子抱怨我走太多路了。', '鞋子已經很舊了。'], clue: '提示：哪一句把鞋子寫得像人一樣？', explain: '「鞋子抱怨」是轉化。' },
            { id: 'rh-pe-p2', mark: ['累得睡著了'], options: ['鉛筆盒累得睡著了。', '鉛筆盒放在桌上。'], clue: '提示：哪一句的鉛筆盒像人一樣會累？', explain: '「鉛筆盒累得睡著了」是轉化。' },
            { id: 'rh-pe-p3', mark: ['生氣的不肯打開'], options: ['門生氣的不肯打開。', '門被鎖住了。', '門像一張大嘴。'], clue: '提示：哪一句的門像人一樣會生氣？', explain: '「門生氣的不肯打開」是轉化。' },
            { id: 'rh-pe-p4', mark: ['笑著跟我打招呼'], options: ['太陽笑著跟我打招呼。', '太陽出來了。', '太陽很大。'], clue: '提示：哪一句的太陽像人一樣會笑？', explain: '「太陽笑著跟我打招呼」是轉化。' },
            { id: 'rh-pe-p5', mark: ['偷偷告訴我一個祕密'], options: ['小鳥偷偷告訴我一個祕密。', '小鳥在樹上。', '小鳥飛走了。', '小鳥像一片葉子。'], clue: '提示：哪一句的小鳥像人一樣會說話？', explain: '「小鳥告訴我一個祕密」是轉化。' },
            { id: 'rh-pe-p6', mark: ['跳起舞來'], options: ['樹葉在風中跳起舞來。', '樹葉被風吹動。', '樹葉是綠色的。', '樹葉像小扇子。'], clue: '提示：哪一句的樹葉像人一樣會跳舞？', explain: '「樹葉跳起舞來」是轉化。' }
          ] },
        { key: 'repeat', name: '類疊', meaning: '同一個詞或同一句話，隔開來重複說好幾次，讀起來有節奏，也讓人感覺心情更強烈。', example: '兔子先生急急忙忙的時候，把同一句話連說兩次，讓人感覺到他好著急。',
          show: { sentence: '好香喔，好香喔，蛋糕烤好了！', mark: ['好香喔'] },
          yesno: [
            { id: 'rh-rp-y1', sentence: '找到了！找到了！鑰匙在這裡！', answer: true, mark: ['找到了'], clue: '提示：找找看，有沒有同一句話說了好幾次？', explain: '是類疊：「找到了」說了兩次。' },
            { id: 'rh-rp-y2', sentence: '鑰匙在這裡。', answer: false, clue: '提示：這句話裡，有沒有同一句話說了好幾次？', explain: '不是類疊：這句話沒有重複說同一句話。' }
          ],
          pick: [
            { id: 'rh-rp-p1', mark: ['等我'], options: ['等我，等我，我也要去！', '我也要去。'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「等我」說了兩次，是類疊。' },
            { id: 'rh-rp-p2', mark: ['太好了'], options: ['太好了！太好了！門打開了！', '門打開了。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「太好了」說了兩次，是類疊。' },
            { id: 'rh-rp-p3', mark: ['怎麼辦'], options: ['怎麼辦？怎麼辦？我變得好小！', '我變小了。', '我像一隻螞蟻。'], clue: '提示：哪一句有同一個詞，說了好幾次？', explain: '「怎麼辦」說了兩次，是類疊。' },
            { id: 'rh-rp-p4', mark: ['我想要'], options: ['我想要蛋糕，我想要果汁，我想要糖果。', '我想吃點心。', '點心在對我笑。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「我想要」說了三次，是類疊。' },
            { id: 'rh-rp-p5', mark: ['快跑'], options: ['快跑！快跑！兔子要跑掉了！', '兔子跑掉了。', '兔子跑得很快。', '兔子像一陣風。'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「快跑」說了兩次，是類疊。' },
            { id: 'rh-rp-p6', mark: ['好神奇'], options: ['好神奇，好神奇，門會說話！', '門會說話。', '門在跟我打招呼。', '誰在說話呢？'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「好神奇」說了兩次，是類疊。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '書包嘆了一口氣，說自己好重。', answer: '轉化', mark: ['嘆了一口氣'], clue: '提示：書包會不會像人一樣做事？', explain: '答案是「轉化」：書包像人一樣會嘆氣。' },
        { id: 'rh2', sentence: '雨傘張開雙手，替我擋雨。', answer: '轉化', mark: ['張開雙手'], clue: '提示：這句話有沒有把雨傘寫得像人？', explain: '答案是「轉化」：雨傘像人一樣張開雙手。' },
        { id: 'rh3', sentence: '好冷，好冷，快關窗！', answer: '類疊', mark: ['好冷'], clue: '提示：有沒有同一句話，隔開來說了好幾次？', explain: '答案是「類疊」：「好冷」說了兩次。' },
        { id: 'rh4', sentence: '再一次，再一次，我還想玩！', answer: '類疊', mark: ['再一次'], clue: '提示：找找看，有沒有同一個詞重複說了好幾次？', explain: '答案是「類疊」：「再一次」說了兩次。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L11 = d; }
})(this);
