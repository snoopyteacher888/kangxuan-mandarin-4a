/* 第 6 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 人事時地物：選項第一個是答案；paras 是提示要用到的段落 */
    wh: [
      { id: 'wh-ren', key: '人', options: ['登山家江秀真', '一位游泳選手', '一位鋼琴老師', '一位飛機駕駛'], paras: [2], why: '這一課寫的是臺灣的女登山家江秀真。' },
      { id: 'wh-shi', key: '事', options: ['登上世界最高峰', '參加游泳比賽', '開一家餐廳', '學會彈鋼琴'], paras: [4, 6], why: '江秀真努力訓練，最後登上了世界最高峰。' },
      { id: 'wh-time', key: '時', options: ['從高中一直到長大以後', '剛出生的那一天', '小學一年級的時候', '去年暑假的時候'], paras: [3, 4], why: '江秀真高中開始喜歡登山，長大以後才出發去爬世界最高峰。' },
      { id: 'wh-di', key: '地', options: ['世界的高山', '海邊的沙灘', '學校的操場', '城裡的大街'], paras: [4, 5], why: '她爬完臺灣的高山，又去爬世界最高的山。' },
      { id: 'wh-wu', key: '物', options: ['白雪、寒風和山路', '沙灘和海浪', '書包和課本', '蛋糕和蠟燭'], paras: [5], why: '登山的路上有危險的山路、呼呼吹的寒風，還有很大的溫差。' }
    ],
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qb: 'extract', qd: 'extract', qf: 'extract', qe: 'infer', qg: 'infer', qc: 'interpret', qh: 'interpret',
      qi: 'evaluate', qj: 'evaluate', k1: 'evaluate', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qc: { think: ['媽媽有時候對你很溫柔，那時候她會做什麼？', '媽媽嚴格要求你的時候，是不是為了讓你更好？高山也是這樣嗎？'], why: '媽媽會溫柔的抱我們，也會嚴格的要求我們。高山有時候風景很美，讓人很快樂；有時候風雪很大，考驗登山的人。所以作者說高山像母親。' },
      qh: { think: ['「旁人」是誰？是不是和江秀真一起爬山的人？', '沒有親自去爬的人，知不知道寒風有多冷、路有多危險？'], why: '「旁人」是旁邊的其他人。沒有親自走過那段路的人，很難知道有多冷、多累、多危險，所以說旁人沒辦法體會。不是說旁邊的人很壞。' },
      qi: { think: ['江秀真遇到最困難的時候，有沒有放棄？', '課文最後說，她用什麼樣的腳步面對一座又一座的山？'], why: '江秀真就算沒有力氣了也不放棄，課文最後也說她一直用勇氣和決心往前走。所以她很可能會繼續挑戰。爬山不是為了賺錢。' },
      qj: { think: ['「空想」是只有想，還是有去做？', '江秀真為了夢想，做了哪些努力？'], why: '空想就是只想不做。江秀真每天跑步、做訓練，一步一步完成夢想。這句話告訴我們：有夢想很好，但一定要努力去做，夢想才會成真。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我想當畫家，所以我每天畫一張圖。', '我想跑得更快，所以每天早上去操場練跑。'], bad: ['我想當醫生，可是每天都只在玩手機。', '我什麼夢想都沒有，什麼都不想做。'], why: '題目問的是怎麼讓夢想不變成空想，所以要說出現在就能做的努力。每天畫圖、每天練跑，都是在為夢想努力。只玩手機、什麼都不想做，夢想就只是空想。' },
      k2: { good: ['我會告訴自己：再試一次，一定會更好。', '我會想一想成功的時候有多開心，再加油。'], bad: ['我會馬上放棄，去做別的事。', '我會生氣的把東西丟掉。'], why: '想放棄的時候，可以用好話鼓勵自己，或想像成功的畫面，就像江秀真一樣。馬上放棄、生氣丟東西，都沒辦法讓事情變好。' }
    },
    hanzi: [
      { id: 'h-秀', combo: { type: '會意字', pict: '上面是「禾」，是稻子；下面像稻子長出又長又漂亮的穗。長得又好又漂亮，就是「秀」。' }, char: '秀', zhuyin: 'ㄒㄧㄡˋ', radical: '禾', strokes: 7, words: ['江秀真', '優秀'], say: '秀，優秀的秀', cloze: '優＿', img: 'cw-excellent.png', options: ['秀', '季', '禿', '透'], clue: '這個字的上面是「禾」，下面是「乃」。', explain: '答案是「秀」；「季」的下面是「子」，「禿」的下面是「几」，「透」多了辵字旁。', parts: ['禾', '乃'], story: '上面的「禾」是稻子，下面像稻子長出漂亮的穗。長得又好又漂亮，就是「秀」，所以很出色叫「優秀」。', sentence: '姐姐的成績很優秀。' },
      { id: 'h-稱', combo: { layout: 'lr', parts: [['禾', 'm', '稻子'], ['爯', 's', '']] }, char: '稱', zhuyin: 'ㄔㄥ', radical: '禾', strokes: 14, words: ['稱為', '稱讚'], say: '稱，稱讚的稱', cloze: '＿讚', img: 'cw-praise.png', options: ['稱', '秤', '種', '稀'], clue: '這個字的左邊是禾字旁，右邊是「爯」。', explain: '答案是「稱」；「秤」的右邊是「平」，「種」的右邊是「重」，「稀」的右邊是「希」。', parts: ['禾', '爯'], story: '左邊的「禾」是稻子，右邊像用手把東西提起來。很久以前要把稻子提起來量一量，叫做「稱」；後來說別人的好話，也叫「稱讚」。', sentence: '老師稱讚我字寫得很工整。', build: { layout: 'lr', show: ['？', '爯'], answer: '禾', options: ['禾', '木', '米', '扌'], clue: '想一想：很久以前要量的是稻穀，左邊放和稻子有關的部首。' } },
      { id: 'h-朗', combo: { layout: 'lr', parts: [['良', 's', ''], ['月', 'm', '月亮']] }, char: '朗', zhuyin: 'ㄌㄤˇ', radical: '月', strokes: 11, words: ['開朗', '朗讀'], say: '朗，朗讀的朗', cloze: '＿讀', img: 'cw-read-aloud.png', options: ['朗', '郎', '娘', '狼'], clue: '這個字的左邊是「良」，右邊是會發亮的那一個。', explain: '答案是「朗」，右邊是「月」；「郎」的右邊是耳朵旁，「娘」的左邊是女字旁，「狼」的左邊是犬字旁。', parts: ['良', '月'], story: '左邊的「良」念起來有點像「朗」，右邊是月亮。月亮又亮又清楚，就是「朗」；聲音清清楚楚的念出來，就是「朗讀」。', sentence: '我站起來朗讀課文。', build: { layout: 'lr', show: ['良', '？'], answer: '月', options: ['月', '阝', '女', '犭'], clue: '想一想：晚上天上那個彎彎、會發亮的東西。' } },
      { id: 'h-登', combo: { layout: 'tb', parts: [['癶', 'm', '兩隻腳'], ['豆', 's', '']] }, char: '登', zhuyin: 'ㄉㄥ', radical: '癶', strokes: 12, words: ['登山', '登臺'], say: '登，登山的登', cloze: '＿山', img: 'hiking.png', options: ['登', '燈', '證', '凳'], clue: '這個字的下面是「豆」，上面像兩隻腳。', explain: '答案是「登」；「燈」多了火字旁，「證」多了言字旁，「凳」的下面是「几」。', parts: ['癶', '豆'], story: '上面的「癶」像兩隻腳，下面的「豆」是古時候的高腳盤子。兩隻腳一步一步往上走，就是「登」。', sentence: '週末我們全家去登山。', build: { layout: 'tb', show: ['？', '豆'], answer: '癶', options: ['癶', '艹', '穴', '爫'], clue: '想一想：上面像兩隻腳，要往上走。' } },
      { id: 'h-穆', combo: { layout: 'lr', parts: [['禾', 'm', '稻子'], ['㣎', 's', '']] }, char: '穆', zhuyin: 'ㄇㄨˋ', radical: '禾', strokes: 16, words: ['珠穆朗瑪峰', '肅穆'], say: '穆，肅穆的穆', cloze: '肅＿', img: 'cw-solemn.png', options: ['穆', '移', '稿', '繆'], clue: '這個字的左邊是禾字旁，右邊有三撇。', explain: '答案是「穆」；「移」的右邊是兩個「夕」，「稿」的右邊是「高」。', parts: ['禾', '㣎'], story: '左邊是稻子，右邊念起來有點像「穆」。稻子成熟後安安靜靜的垂著頭，所以「穆」有莊嚴、安靜的意思，像「肅穆」。', sentence: '升旗典禮的時候，大家安靜又肅穆。', build: { layout: 'lr', show: ['？', '㣎'], answer: '禾', options: ['禾', '糸', '木', '言'], clue: '想一想：「移」的左邊和這個字一樣，是稻子。' } },
      { id: 'h-瑪', combo: { layout: 'lr', parts: [['王', 'm', '玉'], ['馬', 's', '']] }, char: '瑪', zhuyin: 'ㄇㄚˇ', radical: '玉', strokes: 14, words: ['珠穆朗瑪峰', '瑪瑙'], say: '瑪，瑪瑙的瑪', cloze: '＿瑙', img: 'cw-agate.png', options: ['瑪', '媽', '碼', '螞'], clue: '這個字的右邊是「馬」，左邊是玉字旁。', explain: '答案是「瑪」，左邊是玉字旁；「媽」的左邊是女字旁，「碼」的左邊是石字旁，「螞」的左邊是虫字旁。', parts: ['王', '馬'], story: '左邊是玉，和漂亮的石頭有關；右邊的「馬」念起來像「瑪」。一種有一圈一圈花紋的漂亮石頭，就叫「瑪瑙」。', sentence: '阿姨有一條瑪瑙做的手鍊。', build: { layout: 'lr', show: ['？', '馬'], answer: '王', options: ['王', '女', '石', '虫'], clue: '想一想：瑪瑙是一種漂亮的寶石，左邊是玉字旁。' } },
      { id: 'h-峰', combo: { layout: 'lr', parts: [['山', 'm', '山'], ['夆', 's', '']] }, char: '峰', zhuyin: 'ㄈㄥ', radical: '山', strokes: 10, words: ['珠穆朗瑪峰', '山峰'], say: '峰，山峰的峰', cloze: '山＿', img: 'everest.png', options: ['峰', '蜂', '鋒', '逢'], clue: '這個字的右邊是「夆」，左邊和高高的地形有關。', explain: '答案是「峰」；「蜂」的左邊是虫字旁，「鋒」的左邊是金字旁，「逢」有辵字旁。', parts: ['山', '夆'], story: '左邊是山，右邊的「夆」念起來像「峰」。山最高、最尖的地方，就是「山峰」。', sentence: '遠遠的山峰上積著白雪。', build: { layout: 'lr', show: ['？', '夆'], answer: '山', options: ['山', '虫', '金', '石'], clue: '想一想：「蜂」的左邊是蟲，這個字的左邊和高高的地形有關。' } },
      { id: 'h-母', combo: { type: '象形字', pict: '很久以前的「母」，像一位跪坐著的媽媽，胸前有兩點，表示她會餵小寶寶喝奶。' }, char: '母', zhuyin: 'ㄇㄨˇ', radical: '毋', strokes: 5, words: ['母親', '母雞'], say: '母，母雞的母', cloze: '＿雞', img: 'cw-hen.png', options: ['母', '毋', '每', '毎'], clue: '這個字的裡面有兩點。', explain: '答案是「母」，裡面有兩點；「毋」裡面是一撇，「每」的上面多了一撇一橫。', parts: ['母'], story: '「母」像一位媽媽，胸前的兩點表示會餵寶寶喝奶。所以媽媽叫「母親」，雞媽媽叫「母雞」。', sentence: '母雞帶著小雞散步。' },
      { id: 'h-酷', combo: { layout: 'lr', parts: [['酉', 'm', '酒罈'], ['告', 's', '']] }, char: '酷', zhuyin: 'ㄎㄨˋ', radical: '酉', strokes: 14, words: ['冷酷', '酷熱'], say: '酷，酷熱的酷', cloze: '＿熱', img: 'cw-hot-sun.png', options: ['酷', '醋', '告', '浩'], clue: '這個字的右邊是「告」。', explain: '答案是「酷」，左邊是「酉」；「醋」的右邊是「昔」，「浩」的左邊是三點水。', parts: ['酉', '告'], story: '左邊的「酉」是裝酒的罈子，右邊的「告」念起來有點像「酷」。酒味很濃很重叫「酷」，後來用來說非常、很厲害，像「酷熱」、「冷酷」。', sentence: '夏天的中午好酷熱。', build: { layout: 'lr', show: ['？', '告'], answer: '酉', options: ['酉', '氵', '牛', '口'], clue: '想一想：這個字原本說酒的味道很濃，左邊是裝酒的罈子。' } },
      { id: 'h-磨', combo: { layout: 'tb', parts: [['麻', 's', ''], ['石', 'm', '石頭']] }, char: '磨', zhuyin: 'ㄇㄛˊ', radical: '石', strokes: 16, words: ['磨練', '磨墨'], say: '磨，磨墨的磨', cloze: '＿墨', img: 'cw-ink.png', options: ['磨', '摩', '魔', '麻'], clue: '這個字的上面是「麻」，下面是石頭。', explain: '答案是「磨」，下面是「石」；「摩」的下面是「手」，「魔」的下面是「鬼」。', parts: ['麻', '石'], story: '上面的「麻」念起來像「磨」，下面是石頭。用石頭來回的擦，把東西弄碎、弄平，就是「磨」。', sentence: '寫書法以前，要先磨墨。', build: { layout: 'tb', show: ['麻', '？'], answer: '石', options: ['石', '手', '鬼', '木'], clue: '想一想：用硬硬的東西來回擦，下面放什麼？' } },
      { id: 'h-攀', combo: { layout: 'tb', parts: [['樊', 's', ''], ['手', 'm', '手']] }, char: '攀', zhuyin: 'ㄆㄢ', radical: '手', strokes: 19, words: ['攀登', '攀爬'], say: '攀，攀爬的攀', cloze: '＿爬', img: 'cw-climb-tree.png', options: ['攀', '樊', '礬', '擊'], clue: '這個字的上面是「樊」。', explain: '答案是「攀」，下面是「手」；「樊」沒有手，「擊」的上面不一樣。', parts: ['樊', '手'], story: '上面的「樊」念起來像「攀」，下面是手。用手抓著東西往上爬，就是「攀」。', sentence: '小猴子攀爬到樹上。', build: { layout: 'tb', show: ['樊', '？'], answer: '手', options: ['手', '木', '心', '大'], clue: '想一想：往上爬，要用什麼抓住東西？' } },
      { id: 'h-氧', combo: { type: '形聲字', pict: '外面是「气」，和空氣有關；裡面的「羊」念起來有點像「氧」。我們呼吸需要的氣體，就是「氧氣」。' }, char: '氧', zhuyin: 'ㄧㄤˇ', radical: '气', strokes: 10, words: ['低氧', '氧氣'], say: '氧，氧氣的氧', cloze: '＿氣', img: 'cw-oxygen.png', options: ['氧', '羊', '洋', '氛'], clue: '這個字的外面是「气」，裡面是一隻小動物。', explain: '答案是「氧」；「羊」沒有「气」，「洋」的左邊是三點水，「氛」裡面是「分」。', parts: ['气', '羊'], story: '外面的「气」和空氣有關，裡面的「羊」念起來有點像「氧」。我們每一次呼吸，都需要「氧氣」。', sentence: '植物會製造氧氣。' },
      { id: 'h-訓', combo: { layout: 'lr', parts: [['言', 'm', '說話'], ['川', 's', '']] }, char: '訓', zhuyin: 'ㄒㄩㄣˋ', radical: '言', strokes: 10, words: ['訓練', '訓話'], say: '訓，訓練的訓', cloze: '＿練', img: 'run-training.png', options: ['訓', '川', '順', '馴'], clue: '這個字的右邊是「川」。', explain: '答案是「訓」，左邊是言字旁；「順」的右邊是「頁」，「馴」的左邊是「馬」。', parts: ['言', '川'], story: '左邊是說話，右邊的「川」是河流。用說話教導別人，讓他像河水一樣順著好的方向走，就是「訓」。', sentence: '小狗經過訓練，學會了坐下。', build: { layout: 'lr', show: ['？', '川'], answer: '言', options: ['言', '馬', '頁', '氵'], clue: '想一想：教導別人要靠說話。' } },
      { id: 'h-谷', combo: { type: '象形字', pict: '很久以前的「谷」，上面像水從兩座山中間流出來，下面是谷口。兩座山中間低低的地方，就是「山谷」。' }, char: '谷', zhuyin: 'ㄍㄨˇ', radical: '谷', strokes: 7, words: ['谷底', '山谷'], say: '谷，山谷的谷', cloze: '＿底', img: 'valley.png', options: ['谷', '俗', '浴', '欲'], clue: '這個字的上面像兩個「八」，下面是「口」。', explain: '答案是「谷」；「俗」多了單人旁，「浴」多了三點水，「欲」多了「欠」。', parts: ['谷'], story: '「谷」像水從兩座山中間流出來的樣子。兩座山中間低低的地方，就是「山谷」，最低的地方叫「谷底」。', sentence: '站在山谷裡大喊，會聽到回音。' },
      { id: 'h-響', combo: { layout: 'tb', parts: [['鄉', 's', ''], ['音', 'm', '聲音']] }, char: '響', zhuyin: 'ㄒㄧㄤˇ', radical: '音', strokes: 22, words: ['呼呼作響', '響亮'], say: '響，響亮的響', cloze: '＿亮', img: 'cw-loud-voice.png', options: ['響', '鄉', '嚮', '饗'], clue: '這個字的上面是「鄉」。', explain: '答案是「響」，下面是「音」；「鄉」沒有音，「嚮」的下面是「向」，「饗」的下面是「食」。', parts: ['鄉', '音'], story: '上面的「鄉」念起來像「響」，下面是聲音的「音」。聲音很大、傳得很遠，就是「響」。', sentence: '他的歌聲又大又響亮。', build: { layout: 'tb', show: ['鄉', '？'], answer: '音', options: ['音', '食', '向', '心'], clue: '想一想：耳朵聽到的東西，下面放哪一個部件？' } }
    ],
    vocab: [
      { id: 'v-江秀真', word: '江秀真', meaning: '臺灣很有名的女登山家，爬過世界最高的山。', example: '＿＿＿是臺灣很有名的女登山家。', img: 'climber.png', options: ['江秀真', '母親', '谷底', '訓練'] },
      { id: 'v-稱為', cloze: true, clozeOptions: ['稱為', '忘記', '打掃', '跑步'], word: '稱為', meaning: '叫做。', example: '臺灣有很多高山，常被＿＿「高山之島」。', img: 'name-tag.png', options: ['稱為', '開朗', '攀登', '低氧'] },
      { id: 'v-開朗', cloze: true, clozeOptions: ['開朗', '憂愁', '膽小', '生氣'], word: '開朗', meaning: '個性樂觀，心情總是很明亮。', example: '小美的個性很＿＿，每天都笑嘻嘻的。', img: 'big-smile.png', options: ['開朗', '冷酷', '谷底', '磨練'] },
      { id: 'v-珠穆朗瑪峰', word: '珠穆朗瑪峰', meaning: '世界上最高的山。', example: '登上＿＿＿＿＿，是很多登山家的夢想。', img: 'everest.png', options: ['珠穆朗瑪峰', '江秀真', '登山', '母親'] },
      { id: 'v-登山', cloze: true, clozeOptions: ['登山', '游泳', '逛街', '睡覺'], word: '登山', meaning: '往高高的峰頂一步一步爬上去。', example: '週末，爸爸帶我們去＿＿。', img: 'hiking.png', options: ['登山', '稱為', '低氧', '冷酷'] },
      { id: 'v-千變萬化', cloze: true, clozeOptions: ['千變萬化', '一成不變', '動也不動', '原封不動'], word: '千變萬化', meaning: '一下這樣、一下那樣，樣子非常多。', example: '海上的天氣＿＿＿＿，一下出太陽，一下又下大雨。', img: 'changing-clouds.png', options: ['千變萬化', '不知不覺', '呼呼作響', '開朗'] },
      { id: 'v-不知不覺', cloze: true, clozeOptions: ['不知不覺', '一清二楚', '早有準備', '特別注意'], word: '不知不覺', meaning: '自己都沒有發現，就已經這樣了。', example: '我們玩得太開心，＿＿＿＿天就黑了。', img: 'time-flies.png', options: ['不知不覺', '千變萬化', '訓練', '谷底'] },
      { id: 'v-母親', cloze: true, clozeOptions: ['母親', '老師', '醫生', '警察'], word: '母親', meaning: '媽媽。', example: '五月的第二個星期天是＿＿節。', img: 'mother-hug.png', options: ['母親', '江秀真', '攀登', '開朗'] },
      { id: 'v-冷酷', cloze: true, clozeOptions: ['冷酷', '溫柔', '親切', '熱心'], word: '冷酷', meaning: '冰冰涼涼又不留情，一點也不溫柔。', example: '寒流來了，＿＿的北風吹得大家直發抖。', img: 'snowstorm.png', options: ['冷酷', '開朗', '母親', '登山'] },
      { id: 'v-磨練', cloze: true, clozeOptions: ['磨練', '偷懶', '休息', '玩耍'], word: '磨練', meaning: '經過很多辛苦和考驗，讓自己變得更強。', example: '經過一次又一次的＿＿，他變得更勇敢了。', img: 'training-hard.png', options: ['磨練', '稱為', '谷底', '千變萬化'] },
      { id: 'v-攀登', cloze: true, clozeOptions: ['攀登', '滑下', '躺著', '跳水'], word: '攀登', meaning: '抓住東西，用手腳往上爬。', example: '登山隊員慢慢＿＿上陡峭的岩壁。', img: 'rock-climb.png', options: ['攀登', '低氧', '母親', '呼呼作響'] },
      { id: 'v-低氧', cloze: true, clozeOptions: ['低氧', '高溫', '下雨', '颳風'], word: '低氧', meaning: '空氣裡讓人呼吸的那種氣體比較少。', example: '高山上是＿＿的環境，走幾步路就會喘。', img: 'thin-air.png', options: ['低氧', '訓練', '開朗', '不知不覺'] },
      { id: 'v-訓練', cloze: true, clozeOptions: ['訓練', '比賽', '放假', '睡覺'], word: '訓練', meaning: '照著計畫，一次又一次的學、反覆的做。', example: '消防員每天都要接受嚴格的＿＿。', img: 'run-training.png', options: ['訓練', '磨練', '冷酷', '稱為'] },
      { id: 'v-谷底', cloze: true, clozeOptions: ['谷底', '山頂', '屋頂', '天空'], word: '谷底', meaning: '兩座山中間最低的地方。', example: '石頭從山坡滾下去，掉到了＿＿。', img: 'valley.png', options: ['谷底', '攀登', '江秀真', '開朗'] },
      { id: 'v-呼呼作響', cloze: true, clozeOptions: ['呼呼作響', '靜悄悄的', '一動不動', '輕聲細語'], word: '呼呼作響', meaning: '風吹得很大，發出很大的聲音。', example: '颱風來了，窗外的風＿＿＿＿。', img: 'strong-wind.png', options: ['呼呼作響', '千變萬化', '低氧', '母親'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-秀', char: '秀', img: 'cw-excellent.png', charMeaning: '很出色、很好。', word: '優秀', meaning: '表現非常好，比一般人更出色。', example: '哥哥在比賽中表現很＿＿，拿到了獎狀。', options: ['優秀', '稱讚', '山峰', '母雞'] },
      { id: 'cw-稱', char: '稱', img: 'cw-praise.png', charMeaning: '叫做；說別人的好話。', word: '稱讚', meaning: '說別人做得好的話。', example: '我把房間整理乾淨，媽媽＿＿我很能幹。', options: ['稱讚', '氧氣', '磨墨', '響亮'] },
      { id: 'cw-朗', char: '朗', img: 'cw-read-aloud.png', charMeaning: '明亮；聲音清楚。', word: '朗讀', meaning: '用清楚、響亮的聲音把文章念出來。', example: '上課時，老師請我起來＿＿課文。', options: ['朗讀', '攀爬', '酷熱', '肅穆'] },
      { id: 'cw-登', char: '登', img: 'cw-on-stage.png', charMeaning: '往上走、爬上去。', word: '登臺', meaning: '走上舞臺表演。', example: '輪到我們班＿＿表演了，大家好緊張。', options: ['登臺', '訓話', '瑪瑙', '優秀'] },
      { id: 'cw-穆', char: '穆', img: 'cw-solemn.png', charMeaning: '莊嚴、安靜。', word: '肅穆', meaning: '很莊嚴、很安靜，大家都不敢吵鬧。', example: '升旗典禮的時候，操場上很＿＿。', options: ['肅穆', '母雞', '朗讀', '山谷'] },
      { id: 'cw-瑪', char: '瑪', img: 'cw-agate.png', charMeaning: '漂亮的石頭名字。', word: '瑪瑙', meaning: '一種有一圈一圈花紋、很漂亮的石頭。', example: '阿姨戴著一條＿＿做的手鍊。', options: ['瑪瑙', '響亮', '稱讚', '氧氣'] },
      { id: 'cw-峰', char: '峰', img: 'many-peaks.png', charMeaning: '山最高、最尖的地方。', word: '山峰', meaning: '山最高、最尖的地方。', example: '遠遠的＿＿上積著白雪。', options: ['山峰', '優秀', '磨墨', '登臺'] },
      { id: 'cw-母', char: '母', img: 'cw-hen.png', charMeaning: '媽媽；雌的。', word: '母雞', meaning: '雞媽媽，會生蛋。', example: '＿＿帶著一群小雞在草地上找蟲吃。', options: ['母雞', '肅穆', '攀爬', '朗讀'] },
      { id: 'cw-酷', char: '酷', img: 'cw-hot-sun.png', charMeaning: '非常、很厲害。', word: '酷熱', meaning: '非常非常熱。', example: '夏天中午的太陽好＿＿，大家都躲在樹下。', options: ['酷熱', '瑪瑙', '訓話', '山峰'] },
      { id: 'cw-磨', char: '磨', img: 'cw-ink.png', charMeaning: '來回摩擦。', word: '磨墨', meaning: '在硯臺上加水，拿墨條來回的磨，做出寫毛筆字用的墨。', example: '寫書法以前，要先＿＿。', options: ['磨墨', '母雞', '響亮', '稱讚'] },
      { id: 'cw-攀', char: '攀', img: 'cw-climb-tree.png', charMeaning: '抓著東西往上爬。', word: '攀爬', meaning: '用手腳抓著東西往上爬。', example: '小猴子＿＿到樹上摘香蕉。', options: ['攀爬', '酷熱', '優秀', '肅穆'] },
      { id: 'cw-氧', char: '氧', img: 'cw-oxygen.png', charMeaning: '呼吸需要的氣體。', word: '氧氣', meaning: '空氣中我們呼吸一定需要的氣體。', example: '植物會製造＿＿，讓空氣更新鮮。', options: ['氧氣', '登臺', '山谷', '磨墨'] },
      { id: 'cw-訓', char: '訓', img: 'cw-principal-talk.png', charMeaning: '教導。', word: '訓話', meaning: '長輩或校長對大家說要注意的事。', example: '朝會時，校長在臺上＿＿。', options: ['訓話', '攀爬', '瑪瑙', '朗讀'] },
      { id: 'cw-谷', char: '谷', img: 'cw-echo.png', charMeaning: '兩座山中間低低的地方。', word: '山谷', meaning: '兩座山中間低低的地方。', example: '我們站在＿＿裡大喊，聽到好大的回音。', options: ['山谷', '氧氣', '母雞', '稱讚'] },
      { id: 'cw-響', char: '響', img: 'cw-loud-voice.png', charMeaning: '發出聲音；聲音很大。', word: '響亮', meaning: '聲音很大、很清楚。', example: '他的歌聲又大又＿＿，大家都聽得到。', options: ['響亮', '山峰', '酷熱', '訓話'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-豁然開朗', situationImg: 'id-tunnel-light.png', idiom: '豁然開朗', char: '朗', meaning: '眼前突然變得又寬又亮；也可以說突然想通了。', example: '想了好久的數學題，聽完老師的說明，我心裡豁然開朗。', situation: '火車開出長長的山洞，眼前突然出現一大片明亮的綠色田野。',
        fill: { options: ['走出黑黑的隧道，眼前＿＿＿＿，看到一大片海。', '房間的燈壞了，裡面一片漆黑，真是＿＿＿＿。'], clue: '提示：哪一句是眼前突然變得又寬又亮？', explain: '第一句用得對：走出隧道，突然看到一大片海。房間一片漆黑，剛好相反。' } },
      { id: 'i-登峰造極', situationImg: 'id-master.png', idiom: '登峰造極', char: '登', meaning: '本事好到最高、最厲害的地步。', example: '這位老師傅的木雕手藝登峰造極，大家都來向他學習。', situation: '一位老師傅寫毛筆字寫了五十年，每一個字都漂亮得不得了，沒有人比得上。',
        fill: { options: ['他練琴練了三十年，琴藝已經＿＿＿＿。', '他昨天才第一次拿球拍，球技＿＿＿＿。'], clue: '提示：哪一句是本事好到最厲害？', explain: '第一句用得對：練了三十年，琴彈得非常厲害。第一次拿球拍，還不太會打。' } },
      { id: 'i-虛懷若谷', situationImg: 'id-humble.png', idiom: '虛懷若谷', char: '谷', meaning: '心胸像山谷一樣寬大，很謙虛，願意聽別人的意見。', example: '姐姐得了冠軍，還是虛懷若谷，認真聽大家的建議。', situation: '哥哥是班上最會畫圖的人，可是同學給他建議時，他都認真的聽，還跟同學說謝謝。',
        fill: { options: ['他雖然很厲害，卻＿＿＿＿，常常向別人請教。', '他覺得自己最厲害，誰的話都不聽，真是＿＿＿＿。'], clue: '提示：哪一句是很謙虛、願意聽別人的話？', explain: '第一句用得對：很厲害還常常請教別人，很謙虛。誰的話都不聽，剛好相反。' } },
      { id: 'i-不同凡響', situationImg: 'id-amazing-show.png', idiom: '不同凡響', char: '響', meaning: '特別出色，和一般的很不一樣。', example: '魔術師的表演不同凡響，大家都看呆了。', situation: '魔術師一揮手，帽子裡飛出一大群白鴿，觀眾都驚訝得張大嘴巴。',
        fill: { options: ['這位小提琴家一開始演奏，就＿＿＿＿，全場安靜下來聽。', '這個表演很普通，跟平常一樣，真是＿＿＿＿。'], clue: '提示：哪一句是特別出色？', explain: '第一句用得對：一演奏全場都安靜聽，很出色。很普通、跟平常一樣，就不是這個意思。' } },
      { id: 'i-額手稱慶', situationImg: 'id-celebrate.png', idiom: '額手稱慶', char: '稱', meaning: '大家聽到好消息，都非常高興、一起慶祝。', example: '聽到颱風轉向不會來，大家都額手稱慶。', situation: '比賽最後一秒，我們班投進一球贏了，全班跳起來互相擊掌。',
        fill: { options: ['聽到走失的小狗找到了，全家人都＿＿＿＿。', '聽到明天要考試，大家都＿＿＿＿，好難過。'], clue: '提示：哪一句是聽到好消息，很高興？', explain: '第一句用得對：小狗找到了，是好消息。要考試很難過，就不是這個意思。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-秀', char: '秀', wrong: '透', sentence: '姐姐的成績很優秀。', options: ['秀', '透', '季'], clue: '這裡是說很出色，跟透明沒有關係。', explain: '要改成「秀」。很出色是「優秀」；「透」是透明的透。' },
      { id: 'fx-稱', char: '稱', wrong: '秤', sentence: '老師稱讚我字寫得很工整。', options: ['稱', '秤', '種'], clue: '這裡是說別人的好話，跟量重量的工具沒有關係。', explain: '要改成「稱」。說別人的好話是「稱讚」；「秤」是量重量的秤。' },
      { id: 'fx-朗', char: '朗', wrong: '郎', sentence: '我站起來朗讀課文。', options: ['朗', '郎', '狼'], clue: '這裡是說清楚的念出來，想一想，哪一個字的右邊是「月」？', explain: '要改成「朗」。清楚的念出來是「朗讀」，右邊是月；「郎」是新郎的郎。' },
      { id: 'fx-登', char: '登', wrong: '燈', sentence: '週末我們全家去登山。', options: ['登', '燈', '凳'], clue: '這裡是說爬上山，跟電燈沒有關係。', explain: '要改成「登」。爬上山是「登山」；「燈」是電燈的燈。' },
      { id: 'fx-穆', char: '穆', wrong: '移', sentence: '升旗典禮的時候，大家安靜又肅穆。', options: ['穆', '移', '稿'], clue: '這裡是說莊嚴安靜，跟移動沒有關係。', explain: '要改成「穆」。莊嚴安靜是「肅穆」；「移」是移動的移。' },
      { id: 'fx-瑪', char: '瑪', wrong: '媽', sentence: '阿姨有一條瑪瑙做的手鍊。', options: ['瑪', '媽', '碼'], clue: '這裡說的是一種漂亮的石頭，想一想，哪一個字是玉字旁？', explain: '要改成「瑪」。漂亮的石頭是「瑪瑙」，左邊是玉字旁；「媽」是媽媽的媽。' },
      { id: 'fx-峰', char: '峰', wrong: '蜂', sentence: '遠遠的山峰上積著白雪。', options: ['峰', '蜂', '鋒'], clue: '這裡說的是山頂，跟蜜蜂沒有關係。', explain: '要改成「峰」。山頂是「山峰」，左邊是山；「蜂」是蜜蜂的蜂。' },
      { id: 'fx-母', char: '母', wrong: '每', sentence: '雞媽媽就是母雞。', options: ['母', '每', '毋'], clue: '這裡說的是雞媽媽，跟每天沒有關係。', explain: '要改成「母」。雞媽媽是「母雞」；「每」是每天的每。' },
      { id: 'fx-酷', char: '酷', wrong: '醋', sentence: '夏天的中午好酷熱。', options: ['酷', '醋', '告'], clue: '這裡是說非常熱，跟酸酸的醋沒有關係。', explain: '要改成「酷」。非常熱是「酷熱」；「醋」是白醋的醋。' },
      { id: 'fx-磨', char: '磨', wrong: '摩', sentence: '寫書法以前，要先磨墨。', options: ['磨', '摩', '魔'], clue: '這裡是說在硯臺上來回的擦，想一想，哪一個字的下面是石頭？', explain: '要改成「磨」。在硯臺上做墨是「磨墨」，下面是石；「摩」的下面是手。' },
      { id: 'fx-攀', char: '攀', wrong: '樊', sentence: '小猴子攀爬到樹上。', options: ['攀', '樊', '擊'], clue: '這裡是說抓著往上爬，想一想，哪一個字的下面有「手」？', explain: '要改成「攀」。抓著往上爬是「攀爬」，下面有手；「樊」沒有手。' },
      { id: 'fx-氧', char: '氧', wrong: '羊', sentence: '植物會製造氧氣。', options: ['氧', '羊', '洋'], clue: '這裡說的是呼吸需要的氣體，跟小羊沒有關係。', explain: '要改成「氧」。呼吸需要的氣體是「氧氣」，外面是「气」；「羊」是小羊的羊。' },
      { id: 'fx-訓', char: '訓', wrong: '川', sentence: '小狗經過訓練，學會了坐下。', options: ['訓', '川', '順'], clue: '這裡是說一次一次的練習，想一想，哪一個字的左邊是言字旁？', explain: '要改成「訓」。一次次的練習是「訓練」，左邊是言字旁；「川」是河川的川。' },
      { id: 'fx-谷', char: '谷', wrong: '浴', sentence: '站在山谷裡大喊，會聽到回音。', options: ['谷', '浴', '俗'], clue: '這裡說的是山和山中間低低的地方，跟洗澡沒有關係。', explain: '要改成「谷」。山中間低低的地方是「山谷」；「浴」是浴室的浴。' },
      { id: 'fx-響', char: '響', wrong: '鄉', sentence: '他的歌聲又大又響亮。', options: ['響', '鄉', '嚮'], clue: '這裡是說聲音很大，想一想，哪一個字的下面有「音」？', explain: '要改成「響」。聲音很大是「響亮」，下面有音；「鄉」是家鄉的鄉。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿明」是可以看穿過去。', sentence: '玻璃杯是＿明的。', frame: '＿明', options: ['透', '秀'], answer: '透', clue: '提示：這個字有辵字旁。', explain: '答案是「透」；「秀」是優秀的秀，沒有辵字旁。' },
      { id: 's2', meaning: '「＿子」是量東西有多重的工具。', sentence: '菜市場的阿姨用＿子量菜有多重。', frame: '＿子', options: ['秤', '稱'], answer: '秤', clue: '提示：這個字的右邊是「平」。', explain: '答案是「秤」；「稱」是稱讚的稱。' },
      { id: 's3', meaning: '「新＿」是剛結婚的男生。', sentence: '婚禮上，新＿穿著帥氣的西裝。', frame: '新＿', options: ['郎', '朗'], answer: '郎', clue: '提示：這個字的右邊是耳朵旁。', explain: '答案是「郎」；「朗」是朗讀的朗，右邊是月。' },
      { id: 's4', meaning: '「電＿」是會發光的東西。', sentence: '天黑了，快打開電＿吧。', frame: '電＿', options: ['燈', '登'], answer: '燈', clue: '提示：這個字的左邊是火字旁。', explain: '答案是「燈」；「登」是登山的登。' },
      { id: 's5', meaning: '「＿動」是換到別的地方。', sentence: '請把桌子往旁邊＿動一點。', frame: '＿動', options: ['移', '穆'], answer: '移', clue: '提示：這個字的右邊是兩個「夕」。', explain: '答案是「移」；「穆」是肅穆的穆。' },
      { id: 's6', meaning: '「蜜＿」是會採花蜜的小昆蟲。', sentence: '花園裡有好多蜜＿在飛。', frame: '蜜＿', options: ['蜂', '峰'], answer: '蜂', clue: '提示：這個字的左邊是虫字旁。', explain: '答案是「蜂」；「峰」是山峰的峰。' },
      { id: 's7', meaning: '「＿天」是天天。', sentence: '我＿天都會喝一杯牛奶。', frame: '＿天', options: ['每', '母'], answer: '每', clue: '提示：這個字的上面多了一撇一橫。', explain: '答案是「每」；「母」是母親的母。' },
      { id: 's8', meaning: '「白＿」是酸酸的調味料。', sentence: '涼拌小黃瓜要加一點白＿。', frame: '白＿', options: ['醋', '酷'], answer: '醋', clue: '提示：這個字的右邊是「昔」。', explain: '答案是「醋」；「酷」是酷熱的酷。' },
      { id: 's9', meaning: '「按＿」是用手揉一揉，讓身體舒服。', sentence: '我幫奶奶按＿肩膀。', frame: '按＿', options: ['摩', '磨'], answer: '摩', clue: '提示：這個字的下面是「手」。', explain: '答案是「摩」；「磨」是磨墨的磨，下面是石。' },
      { id: 's10', meaning: '「＿術」是神奇的表演。', sentence: '他變了一個好神奇的＿術。', frame: '＿術', options: ['魔', '磨'], answer: '魔', clue: '提示：這個字的下面是「鬼」。', explain: '答案是「魔」；「磨」是磨墨的磨。' },
      { id: 's11', meaning: '「太平＿」是世界上最大的一片海。', sentence: '臺灣的東邊是太平＿。', frame: '太平＿', options: ['洋', '氧'], answer: '洋', clue: '提示：這個字的左邊是三點水。', explain: '答案是「洋」；「氧」是氧氣的氧。' },
      { id: 's12', meaning: '「＿利」是事情進行得很好、沒有困難。', sentence: '祝你考試＿利！', frame: '＿利', options: ['順', '訓'], answer: '順', clue: '提示：這個字的右邊是「頁」。', explain: '答案是「順」；「訓」是訓練的訓。' },
      { id: 's13', meaning: '「＿室」是洗澡的房間。', sentence: '我在＿室裡洗澡。', frame: '＿室', options: ['浴', '谷'], answer: '浴', clue: '提示：這個字的左邊是三點水。', explain: '答案是「浴」；「谷」是山谷的谷。' },
      { id: 's14', meaning: '「家＿」是自己出生、長大的地方。', sentence: '過年時，爸爸帶我們回家＿看爺爺。', frame: '家＿', options: ['鄉', '響'], answer: '鄉', clue: '提示：這個字的下面沒有「音」。', explain: '答案是「鄉」；「響」是響亮的響。' }
    ],
    listen: [
      { id: 'l1', text: '個性很樂觀，每天都笑嘻嘻的。', answer: 0, options: [{ text: '開朗', img: 'big-smile.png' }, { text: '冷酷', img: 'snowstorm.png' }, { text: '谷底', img: 'valley.png' }, { text: '低氧', img: 'thin-air.png' }] },
      { id: 'l2', text: '天上的雲，一下像兔子，一下像大魚，變來變去。', answer: 0, options: [{ text: '千變萬化', img: 'changing-clouds.png' }, { text: '不知不覺', img: 'time-flies.png' }, { text: '攀登', img: 'rock-climb.png' }, { text: '訓練', img: 'run-training.png' }] },
      { id: 'l3', text: '手腳抓著岩石，一步一步往上爬。', answer: 0, options: [{ text: '攀登', img: 'rock-climb.png' }, { text: '谷底', img: 'valley.png' }, { text: '開朗', img: 'big-smile.png' }, { text: '母親', img: 'mother-hug.png' }] },
      { id: 'l4', text: '兩座山中間，最低最低的地方。', answer: 0, options: [{ text: '谷底', img: 'valley.png' }, { text: '登山', img: 'hiking.png' }, { text: '呼呼作響', img: 'strong-wind.png' }, { text: '磨練', img: 'training-hard.png' }] },
      { id: 'l5', text: '大風吹過窗戶，發出好大的聲音。', answer: 0, options: [{ text: '呼呼作響', img: 'strong-wind.png' }, { text: '千變萬化', img: 'changing-clouds.png' }, { text: '低氧', img: 'thin-air.png' }, { text: '開朗', img: 'big-smile.png' }] },
      { id: 'l6', text: '看書看得太專心，抬頭一看，天已經黑了。', answer: 0, options: [{ text: '不知不覺', img: 'time-flies.png' }, { text: '冷酷', img: 'snowstorm.png' }, { text: '攀登', img: 'rock-climb.png' }, { text: '谷底', img: 'valley.png' }] },
      { id: 'l7', text: '高山上的空氣很稀薄，走幾步就喘不過氣。', answer: 0, options: [{ text: '低氧', img: 'thin-air.png' }, { text: '訓練', img: 'run-training.png' }, { text: '母親', img: 'mother-hug.png' }, { text: '不知不覺', img: 'time-flies.png' }] },
      { id: 'l8', text: '每天照著計畫跑步，讓身體越來越強壯。', answer: 0, options: [{ text: '訓練', img: 'run-training.png' }, { text: '開朗', img: 'big-smile.png' }, { text: '呼呼作響', img: 'strong-wind.png' }, { text: '登山', img: 'hiking.png' }] }
    ],
    /* ---------- 短語、造句、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      /* 拼短語（短語一）每一格下面寫要放什麼樣的詞 */
      fillLabels: { before: '做什麼', answer: '怎麼樣', noun: '什麼東西' },
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看是什麼樣子。',
      /* 短語一：做什麼（……著）＋怎麼樣＋的＋什麼東西（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '背著沉重的書包', img: 'pr-carry-bag.png',
        parts: [{ text: '背著', role: '做什麼' }, { text: '沉重', role: '怎麼樣' }, { text: '的' }, { text: '書包', role: '什麼東西' }],
        explain: '先說正在做什麼（……著），再說東西怎麼樣，加上「的」，最後說是什麼東西。' },
      pick: [
        { id: 'ph1', img: 'pr-hold-flowers.png', before: '捧著', noun: '花束', ask: '捧著什麼樣的花束', look: '再看看圖片，花束有幾種顏色？', options: ['美麗', '難聞', '苦澀', '吵鬧'], clue: '提示：花朵有好多顏色，看起來好漂亮。', explain: '答案是「美麗」，完整的短語是「捧著美麗的花束」。' },
        { id: 'ph2', img: 'pr-sing-song.png', before: '唱著', noun: '歌', ask: '唱著什麼樣的歌', look: '再看看圖片，大家是不是邊走邊蹦跳？', options: ['輕快', '沉重', '冰冷', '苦澀'], clue: '提示：大家邊走邊唱，腳步跟著節奏蹦蹦跳。', explain: '答案是「輕快」，完整的短語是「唱著輕快的歌」。' },
        { id: 'ph3', img: 'pr-eat-icecream.png', before: '吃著', noun: '冰淇淋', ask: '吃著什麼樣的冰淇淋', look: '再看看圖片，天氣熱不熱？', options: ['冰涼', '滾燙', '苦澀', '吵鬧'], clue: '提示：大熱天吃一口，整個人都清爽起來。', explain: '答案是「冰涼」，完整的短語是「吃著冰涼的冰淇淋」。' },
        { id: 'ph4', img: 'pr-wear-coat.png', before: '穿著', noun: '外套', ask: '穿著什麼樣的外套', look: '再看看圖片，外面是不是在下雪？', options: ['溫暖', '冰冷', '苦澀', '吵鬧'], clue: '提示：冬天穿上它，一點也不會冷。', explain: '答案是「溫暖」，完整的短語是「穿著溫暖的外套」。' },
        { id: 'ph5', img: 'pr-hug-cat.png', before: '抱著', noun: '小貓', ask: '抱著什麼樣的小貓', look: '再看看圖片，小貓的毛是不是毛茸茸的？', options: ['柔軟', '堅硬', '苦澀', '吵鬧'], clue: '提示：牠的毛摸起來像棉花一樣。', explain: '答案是「柔軟」，完整的短語是「抱著柔軟的小貓」。' },
        { id: 'ph6', img: 'pr-read-book.png', before: '看著', noun: '故事書', ask: '看著什麼樣的故事書', look: '再看看圖片，他的表情怎麼樣？', options: ['有趣', '無聊', '冰冷', '苦澀'], clue: '提示：他看得哈哈大笑，一直想翻下一頁。', explain: '答案是「有趣」，完整的短語是「看著有趣的故事書」。' }
      ],
      say: [],
      /* 短語二：做什麼＋疊字的量詞＋什麼東西（課本的例子是課文原句，這裡換成自己寫的） */
      phrase2: {
        intro: { example: '爬上層層階梯', img: 'pz-stairs.png',
          parts: [{ text: '爬上', role: '做什麼' }, { text: '層層', role: '一個接一個（疊字）' }, { text: '階梯', role: '什麼東西' }],
          explain: '先說做什麼，再用兩個一樣的字說「一個接一個、好多好多」，最後說是什麼東西。' },
        pick: [
          { id: 'p2-pz1', img: 'pz-bridges.png', before: '走過', join: '', noun: '小橋', ask: '走過什麼樣的小橋', look: '再看看圖片，河上有幾座橋？', options: ['座座', '盞盞', '滴滴', '片片'], clue: '提示：一條小河上有好多橋，走過一個又一個。', explain: '答案是「座座」，完整的短語是「走過座座小橋」。' },
          { id: 'p2-pz2', img: 'pz-forest.png', before: '穿過', join: '', noun: '樹林', ask: '穿過什麼樣的樹林', look: '再看看圖片，綠色的樹林有多大？', options: ['片片', '盞盞', '滴滴', '座座'], clue: '提示：綠色的樹林一大塊接著一大塊。', explain: '答案是「片片」，完整的短語是「穿過片片樹林」。' },
          { id: 'p2-pz3', img: 'pz-waves.png', before: '衝過', join: '', noun: '浪花', ask: '衝過什麼樣的浪花', look: '再看看圖片，浪是不是一道疊著一道？', options: ['層層', '盞盞', '座座', '滴滴'], clue: '提示：白色的浪一道疊著一道，越來越高。', explain: '答案是「層層」，完整的短語是「衝過層層浪花」。' },
          { id: 'p2-pz4', img: 'pz-hills.png', before: '翻過', join: '', noun: '山嶺', ask: '翻過什麼樣的山嶺', look: '再看看圖片，山是不是一座又一座？', options: ['重重', '盞盞', '滴滴', '朵朵'], clue: '提示：山一座疊著一座，好像怎麼也翻不完。', explain: '答案是「重重」，完整的短語是「翻過重重山嶺」。' },
          { id: 'p2-pz5', img: 'pz-lanterns.png', before: '點亮', join: '', noun: '燈籠', ask: '點亮什麼樣的燈籠', look: '再看看圖片，燈籠有幾個？', options: ['盞盞', '片片', '層層', '滴滴'], clue: '提示：數燈籠要說「一＿燈籠」，這個字的下面是「皿」。', explain: '答案是「盞盞」，完整的短語是「點亮盞盞燈籠」。' }
        ],
        fill: [
          { id: 'pz1', img: 'pz-bridges.png', parts: ['走過', '座座', '小橋'] },
          { id: 'pz2', img: 'pz-forest.png', parts: ['穿過', '片片', '樹林'] },
          { id: 'pz3', img: 'pz-waves.png', parts: ['衝過', '層層', '浪花'] },
          { id: 'pz4', img: 'pz-hills.png', parts: ['翻過', '重重', '山嶺'] },
          { id: 'pz5', img: 'pz-lanterns.png', parts: ['點亮', '盞盞', '燈籠'] }
        ]
      },
      words: [
        { word: '千變萬化', meaning: '一下這樣、一下那樣，變化非常多。', img: 'changing-clouds.png' },
        { word: '不知不覺', meaning: '自己都沒有發現，就已經這樣了。', img: 'time-flies.png' },
        { word: '不知所措', meaning: '慌張得不知道該怎麼辦才好。', img: 'wd-panic.png' }
      ],
      choose: [
        { id: 'pw1', word: '千變萬化', options: ['海邊的天空千變萬化，一下晴天一下下雨。', '這顆石頭放了一百年，千變萬化，一點也沒變。'], clue: '提示：想一想，「千變萬化」是變化很多，還是都沒變？', explain: '第一句用得對：天空一下晴一下雨，變化很多。石頭一點也沒變，剛好相反。' },
        { id: 'pw2', word: '不知不覺', options: ['我和朋友聊得太開心，不知不覺就到了中午。', '我一直盯著時鐘看，不知不覺的知道現在幾點。'], clue: '提示：想一想，「不知不覺」是自己沒發現，還是一直盯著看？', explain: '第一句用得對：聊得太開心，沒發現時間過了。一直盯著時鐘，就不是不知不覺。' },
        { id: 'pw3', word: '不知所措', options: ['弟弟在百貨公司和家人走散了，急得不知所措。', '他早就準備好了，不知所措的上臺表演。'], clue: '提示：想一想，「不知所措」是慌張，還是準備好了？', explain: '第一句用得對：和家人走散，慌得不知道怎麼辦。早就準備好了，就不會不知所措。' }
      ],
      make: [
        { id: 'pm1', word: '千變萬化', clue: '提示：想想看，有什麼東西一下這樣、一下那樣，變化很多？', model: '彩色的泡泡在陽光下千變萬化，一下藍一下紫。' },
        { id: 'pm2', word: '不知不覺', clue: '提示：想想看，做什麼事情時，時間不知不覺就過去了？', model: '看著窗外的風景，我不知不覺睡著了。' },
        { id: 'pm3', word: '不知所措', clue: '提示：想想看，什麼時候你慌張得不知道該怎麼辦？', model: '第一次上臺比賽，我緊張得不知所措。' }
      ]
    },
    pattern: [
      { key: 'shiyeshi', id: 'sys', title: '是……也是……', img: 'shiyeshi.png',
        meaning: '先用「是」說他的一個身分或特點，再用「也是」說另一個，兩個都對。',
        examples: ['媽媽是我們家的廚師，也是我的老師。'],
        match: [
          { id: 'pt-sys-m1', img: 'pt-dad-chef.png', front: '爸爸是公車司機，', options: ['也是很會做菜的廚師。', '也是一隻會飛的鳥。', '也是一張大餐桌。'], clue: '提示：看看圖片，爸爸回到家穿上了什麼？', explain: '答案是「也是很會做菜的廚師」：爸爸會開公車，也會做菜。' },
          { id: 'pt-sys-m2', img: 'pt-dog-friend.png', front: '小狗是我們家的寵物，', options: ['也是我最好的朋友。', '也是一輛腳踏車。', '也是一棵大樹。'], clue: '提示：看看圖片，小狗和小男孩是不是靠在一起？', explain: '答案是「也是我最好的朋友」：小狗是寵物，也是好朋友。' },
          { id: 'pt-sys-m3', img: 'pt-library-rest.png', front: '圖書館是看書的地方，', options: ['也是休息的好地方。', '也是游泳的地方。', '也是煮飯的地方。'], clue: '提示：看看圖片，有人坐在沙發上做什麼？', explain: '答案是「也是休息的好地方」：圖書館可以看書，也可以休息。' }
        ],
        conj: [
          { id: 'pt-sys-c1', full: '姐姐是班長，也是畫圖高手。', img: 'pt-sister-leader.png', sentence: '姐姐＿班長，＿＿畫圖高手。', options: ['是……也是……', '無論……始終……', '不但……還……'], clue: '提示：姐姐有兩個身分，兩個都對。數數看每個空格有幾個字。', explain: '答案是「是……也是……」：姐姐是班長，也是畫圖高手。' },
          { id: 'pt-sys-c2', full: '公園是運動的地方，也是遊戲的地方。', img: 'pt-park-fun.png', sentence: '公園＿運動的地方，＿＿遊戲的地方。', options: ['是……也是……', '無論……始終……', '不但……還……'], clue: '提示：公園可以做兩件事，兩個都對。數數看每個空格有幾個字。', explain: '答案是「是……也是……」：公園是運動的地方，也是遊戲的地方。' },
          { id: 'pt-sys-c3', full: '爺爺是我的長輩，也是我的下棋老師。', img: 'pt-grandpa-teacher.png', sentence: '爺爺＿我的長輩，＿＿我的下棋老師。', options: ['是……也是……', '無論……始終……', '不但……還……'], clue: '提示：爺爺有兩個身分，兩個都對。數數看每個空格有幾個字。', explain: '答案是「是……也是……」：爺爺是我的長輩，也是我的下棋老師。' }
        ],
        half: [
          { id: 'pt-sys-h1', front: '我的好朋友是班上的開心果，', clue: '提示：好朋友還有什麼身分或特點？記得要說「也是」。', model: '也是最會幫助別人的人。' },
          { id: 'pt-sys-h2', front: '這本書是我的生日禮物，', clue: '提示：這本書對你來說還是什麼？記得要說「也是」。', model: '也是我最喜歡的故事書。' }
        ],
        whole: [
          { id: 'pt-sys-w1', clue: '提示：先用「是」說一個身分，再用「也是」說另一個。想想看：老師對你們來說是什麼？', model: '老師是教我們讀書的人，也是我們的好朋友。' }
        ] },
      { key: 'shihaishi', id: 'shs', title: '是……還是……', img: 'shihaishi.png',
        meaning: '用「是……還是……」說出兩個選擇，問問看要選哪一個。',
        examples: ['你是要喝果汁，還是要喝牛奶？'],
        match: [
          { id: 'pt-shs-m1', img: 'pt-choose-drink.png', front: '你是要喝柳橙汁，', options: ['還是要喝牛奶？', '還是要喝沙子？', '還是要喝石頭？'], clue: '提示：看看圖片，他的另一隻手拿著什麼？', explain: '答案是「還是要喝牛奶」：柳橙汁和牛奶，選一個。' },
          { id: 'pt-shs-m2', img: 'pt-choose-club.png', front: '你是要參加籃球社，', options: ['還是要參加合唱團？', '還是要參加吃晚飯？', '還是要參加睡午覺？'], clue: '提示：看看圖片，除了籃球，還有一支什麼？', explain: '答案是「還是要參加合唱團」：籃球社和合唱團，選一個。' },
          { id: 'pt-shs-m3', img: 'pt-choose-pet.png', front: '我們是要養小狗，', options: ['還是要養小貓？', '還是要養恐龍？', '還是要養大象？'], clue: '提示：看看圖片，寵物店裡還有哪一種可愛的動物？', explain: '答案是「還是要養小貓」：小狗和小貓，選一個。' }
        ],
        conj: [
          { id: 'pt-shs-c1', full: '你是要吃蛋糕，還是要吃布丁？', img: 'pt-choose-dessert.png', sentence: '你＿要吃蛋糕，＿＿要吃布丁？', options: ['是……還是……', '無論……始終……', '不但……還……'], clue: '提示：兩種甜點要選一個。數數看每個空格有幾個字。', explain: '答案是「是……還是……」：你是要吃蛋糕，還是要吃布丁？' },
          { id: 'pt-shs-c2', full: '暑假我們是要去海邊，還是要去爬山？', img: 'pt-choose-trip.png', sentence: '暑假我們＿要去海邊，＿＿要去爬山？', options: ['是……還是……', '無論……始終……', '不但……還……'], clue: '提示：兩個地方要選一個。數數看每個空格有幾個字。', explain: '答案是「是……還是……」：暑假我們是要去海邊，還是要去爬山？' },
          { id: 'pt-shs-c3', full: '你是要穿紅色的衣服，還是要穿藍色的？', img: 'pt-choose-color.png', sentence: '你＿要穿紅色的衣服，＿＿要穿藍色的？', options: ['是……還是……', '無論……始終……', '不但……還……'], clue: '提示：兩件衣服要選一件。數數看每個空格有幾個字。', explain: '答案是「是……還是……」：你是要穿紅色的衣服，還是要穿藍色的？' }
        ],
        half: [
          { id: 'pt-shs-h1', front: '下課時，你是要去盪鞦韆，', clue: '提示：還有什麼可以選？記得要說「還是」。', model: '還是要去溜滑梯？' },
          { id: 'pt-shs-h2', front: '週末我們是要在家看書，', clue: '提示：還有什麼可以選？記得要說「還是」。', model: '還是要去公園玩？' }
        ],
        whole: [
          { id: 'pt-shs-w1', clue: '提示：用「是……還是……」說出兩個選擇，問別人要選哪一個。想想看：午餐有哪兩種可以選？', model: '午餐你是要吃麵，還是要吃飯？' }
        ] },
      { key: 'wulun', id: 'wl', title: '無論……始終……', img: 'wulun.png',
        meaning: '用「無論」說出不管什麼情況，再用「始終」說一直都不會變的事。',
        examples: ['無論晴天還是雨天，郵差始終每天送信。'],
        match: [
          { id: 'pt-wl-m1', img: 'pt-rain-runner.png', front: '無論颳風還是下雨，', options: ['叔叔始終每天去跑步。', '叔叔始終在天上飛。', '叔叔始終住在海底。'], clue: '提示：看看圖片，下雨天叔叔還在做什麼？', explain: '答案是「叔叔始終每天去跑步」：不管天氣怎樣，叔叔一直都去跑步。' },
          { id: 'pt-wl-m2', img: 'pt-bike-try.png', front: '無論跌倒幾次，', options: ['他始終沒有放棄學騎車。', '他始終坐在床上睡覺。', '他始終變成一隻小貓。'], clue: '提示：看看圖片，他膝蓋貼著貼布，還在做什麼？', explain: '答案是「他始終沒有放棄學騎車」：跌倒很多次，他一直都沒放棄。' },
          { id: 'pt-wl-m3', img: 'pt-grandma-water.png', front: '無論每天有多忙，', options: ['奶奶始終記得澆花。', '奶奶始終不會走路。', '奶奶始終住在月亮上。'], clue: '提示：看看圖片，奶奶一早在陽臺做什麼？', explain: '答案是「奶奶始終記得澆花」：再忙，奶奶一直都會澆花。' }
        ],
        conj: [
          { id: 'pt-wl-c1', full: '無論風雨多大，郵差始終把信送到。', img: 'pt-mail-carrier.png', sentence: '＿＿風雨多大，郵差＿＿把信送到。', options: ['無論……始終……', '是……也是……', '是……還是……'], clue: '提示：不管風雨多大，郵差一直都會做到。數數看每個空格有幾個字。', explain: '答案是「無論……始終……」：無論風雨多大，郵差始終把信送到。' },
          { id: 'pt-wl-c2', full: '無論我比賽輸贏，好朋友始終支持我。', img: 'pt-friend-support.png', sentence: '＿＿我比賽輸贏，好朋友＿＿支持我。', options: ['無論……始終……', '是……也是……', '是……還是……'], clue: '提示：輸了贏了都一樣，好朋友一直支持我。數數看每個空格有幾個字。', explain: '答案是「無論……始終……」：無論我比賽輸贏，好朋友始終支持我。' },
          { id: 'pt-wl-c3', full: '無論夜晚多黑，燈塔始終亮著光。', img: 'pt-lighthouse.png', sentence: '＿＿夜晚多黑，燈塔＿＿亮著光。', options: ['無論……始終……', '是……也是……', '是……還是……'], clue: '提示：再黑都一樣，燈塔一直都亮著。數數看每個空格有幾個字。', explain: '答案是「無論……始終……」：無論夜晚多黑，燈塔始終亮著光。' }
        ],
        half: [
          { id: 'pt-wl-h1', front: '無論功課多難，', clue: '提示：功課很難的時候，你一直會怎麼做？記得要說「始終」。', model: '我始終會自己想辦法寫完。' },
          { id: 'pt-wl-h2', front: '無論別人怎麼說，', clue: '提示：別人說什麼，你一直都會怎麼想？記得要說「始終」。', model: '我始終相信自己做得到。' }
        ],
        whole: [
          { id: 'pt-wl-w1', clue: '提示：先用「無論」說不管什麼情況，再用「始終」說一直不變的事。想想看：遇到困難的時候，你會怎麼做？', model: '無論遇到什麼困難，我始終不會放棄。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'simile', name: '譬喻', meaning: '把一樣東西比成另一樣有相同地方的東西，讓人更容易想像。常用「像」、「好像」、「如」。', example: '課文把高山比成母親：有時溫暖的抱著她，有時又嚴格的考驗她。',
          show: { sentence: '雪山白得像一塊大蛋糕。' },
          yesno: [
            { id: 'rh-si-y1', sentence: '山上的雲像棉花糖一樣。', answer: true, clue: '提示：這句話有沒有把雲比成另一樣東西？', explain: '是譬喻：把雲比成棉花糖。' },
            { id: 'rh-si-y2', sentence: '山上有很多雲。', answer: false, clue: '提示：這句話有沒有用「像」把東西比成別的東西？', explain: '不是譬喻：這句話只是說山上有雲。' }
          ],
          pick: [
            { id: 'rh-si-p1', options: ['登山的路彎得像一條蛇。', '登山的路很彎。'], clue: '提示：哪一句用了「像」，把山路比成另一樣東西？', explain: '「彎得像一條蛇」是譬喻：把山路比成蛇。' },
            { id: 'rh-si-p2', options: ['他的背包重得像一塊大石頭。', '他的背包很重。'], clue: '提示：哪一句把背包比成別的東西？', explain: '「重得像一塊大石頭」是譬喻。' },
            { id: 'rh-si-p3', options: ['山頂的風冷得像冰塊。', '山頂的風很冷。', '風在山頂唱歌。'], clue: '提示：哪一句用「像」把風比成別的東西？', explain: '「冷得像冰塊」是譬喻：把風比成冰塊。' },
            { id: 'rh-si-p4', options: ['雪地亮得像一面鏡子。', '雪地很亮。', '雪地上有腳印。'], clue: '提示：哪一句把雪地比成另一樣東西？', explain: '「亮得像一面鏡子」是譬喻。' },
            { id: 'rh-si-p5', options: ['遠處的登山客像螞蟻一樣小。', '登山的人很多。', '山在對我們招手。', '登山的人走得很慢。'], clue: '提示：哪一句用「像」把登山客比成別的東西？', explain: '「像螞蟻一樣小」是譬喻。' },
            { id: 'rh-si-p6', options: ['日出時的天空像一幅畫。', '太陽出來了。', '天空醒過來了。', '天空是橘色的。'], clue: '提示：哪一句把天空比成另一樣東西？', explain: '「像一幅畫」是譬喻：把天空比成一幅畫。' }
          ] },
        { key: 'redup', name: '疊字', meaning: '同一個字連在一起重複用，讀起來更好聽，也更生動。', example: '課文裡的「呼呼」、「重重」，都是把同一個字連著說。',
          show: { sentence: '山上的空氣涼涼的。' },
          yesno: [
            { id: 'rh-re-y1', sentence: '雪花輕輕的飄下來。', answer: true, clue: '提示：形容雪花的字裡，有沒有同一個字連在一起？', explain: '是疊字：「輕輕」把「輕」重複說了。' },
            { id: 'rh-re-y2', sentence: '雪花飄下來。', answer: false, clue: '提示：仔細聽，有沒有同一個字連在一起？', explain: '不是疊字：這句話沒有重複的字。' }
          ],
          pick: [
            { id: 'rh-re-p1', options: ['山頂高高的。', '山頂很高。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「高高」是疊字：「高」重複了。' },
            { id: 'rh-re-p2', options: ['她慢慢的往上爬。', '她往上爬。'], clue: '提示：仔細聽，哪一句多了重複的字？', explain: '「慢慢」是疊字：「慢」重複了。' },
            { id: 'rh-re-p3', options: ['寒風冷冷的吹。', '寒風很冷。', '寒風像刀子。'], clue: '提示：哪一句有同一個字連在一起？', explain: '「冷冷」是疊字：「冷」重複了。' },
            { id: 'rh-re-p4', options: ['帳篷小小的，很溫暖。', '帳篷很小。', '帳篷像一顆蛋。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「小小」是疊字：「小」重複了。' },
            { id: 'rh-re-p5', options: ['她的臉凍得紅紅的。', '她的臉很紅。', '她的臉像蘋果。', '她在笑。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「紅紅」是疊字：「紅」重複了。' },
            { id: 'rh-re-p6', options: ['天空藍藍的，好漂亮。', '天空很藍。', '天空像大海。', '天空在微笑。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「藍藍」是疊字：「藍」重複了。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '高山像一位溫柔的巨人。', answer: '譬喻', clue: '提示：這句話有沒有用「像」把高山比成別的？', explain: '答案是「譬喻」：把高山比成巨人。' },
        { id: 'rh2', sentence: '雪地白得像一張紙。', answer: '譬喻', clue: '提示：這句話有沒有用「像」？', explain: '答案是「譬喻」：把雪地比成紙。' },
        { id: 'rh3', sentence: '小溪彎彎的流過山谷。', answer: '疊字', clue: '提示：形容小溪的字裡，有沒有同一個字連在一起？', explain: '答案是「疊字」：「彎彎」把「彎」連著說了兩次。' },
        { id: 'rh4', sentence: '她一步步的往上走。', answer: '疊字', clue: '提示：仔細聽，有沒有同一個字連著說？', explain: '答案是「疊字」：「步步」把「步」連著說了兩次。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L06 = d; }
})(this);
