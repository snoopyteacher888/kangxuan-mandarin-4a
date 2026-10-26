/* 第 3 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 人事時地物：選項第一個是答案；paras 是提示要用到的段落 */
    wh: [
      { id: 'wh-ren', key: '人', options: ['作者、同學、學長和教練', '作者和爸爸媽媽', '作者和醫生護理師', '作者和便利商店店員'], paras: [2, 3, 4], why: '作者在同學邀約下加入籃球社，學長幫他打氣，教練教他們運球。' },
      { id: 'wh-shi', key: '事', options: ['參加籃球社，努力練習，在比賽最後把球投出', '參加游泳比賽，得到第一名的獎牌', '參加畫畫比賽，畫了一座高山', '參加合唱團，在臺上唱歌給大家聽'], paras: [2, 4, 6], why: '作者加入籃球社，不放棄的練習，最後在比賽中上場投球。' },
      { id: 'wh-time', key: '時', options: ['從剛開學，到比賽結束前五秒', '暑假的時候，在海邊玩水', '過年的時候，回奶奶家', '晚上睡覺前，躺在床上'], paras: [2, 5], why: '作者剛開學時加入籃球社，一直練習到比賽，最後五秒上場。' },
      { id: 'wh-di', key: '地', options: ['學校的籃球場', '家裡的客廳', '游泳池', '動物園'], paras: [3, 5], why: '作者在球場上練習、比賽。' },
      { id: 'wh-wu', key: '物', options: ['籃球和籃球架', '足球和球門', '畫筆和畫紙', '鋼琴和樂譜'], paras: [3, 4], why: '作者打的是籃球，一開始覺得籃球架像高山。' }
    ],
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qc: 'extract', qd: 'extract', qe: 'extract', qb: 'infer', qg: 'infer', qf: 'interpret', qh: 'interpret',
      qi: 'evaluate', qj: 'evaluate', k1: 'interpret', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qf: { think: ['剛開始學運球時，球聽不聽作者的話？', '後來作者一直練習，球是不是就照著作者想要的方向跳了？'], why: '剛開始球到處亂跑，好像不聽話。作者努力練習以後，越來越會控制球，球就照著他的意思跳，好像在跳舞一樣。球不會真的跳舞，這是把球寫得像人。' },
      qh: { think: ['比賽只剩下五秒，兩隊又打得一樣好，這時候上場會不會有壓力？', '同伴對作者說了什麼？聽完以後，作者覺得自己做不做得到？'], why: '最後五秒、兩隊分數差不多，上場的人一定很緊張。可是同伴幫他打氣，作者也相信自己做得到。所以他的心情是緊張，但是有信心。' },
      qi: { think: ['比賽的時候，球場上的聲音是大還是小？', '一個人非常非常專心做一件事的時候，還會注意到旁邊的聲音嗎？'], why: '球場上其實很吵，大家一直在加油。但是作者要投出最重要的一球，他太專心了，好像什麼都聽不到，所以說世界變得一片安靜。觀眾沒有回家，球場也沒有停電。' },
      qj: { think: ['作者一開始會打籃球嗎？他遇到了哪些困難？', '後來作者怎麼做，才能在比賽中上場投球？'], why: '作者本來不太會運動，還很怕籃球架，可是他不放棄，每天最早去練習，最後越來越厲害。這篇文章告訴我們：只要不放棄、努力練習，就能慢慢進步、完成夢想。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我努力練習騎腳踏車，摔了好幾次，最後終於學會了。', '我每天練習跳繩，從只能跳五下，到現在可以連跳一百下。'], bad: ['我很喜歡吃蘋果。', '我今天穿了一件新衣服去上學。'], why: '題目問的是「努力練習以後才學會的事」。騎腳踏車、跳繩都是練習很久才學會的。喜歡吃蘋果、穿新衣服，不用練習，也沒有說學會了什麼。' },
      k2: { good: ['不要怕，你可以的，我相信你！', '盡力就好，不管怎麼樣我們都支持你。'], bad: ['你一定會投不進。', '你太慢了，換別人上場好了。'], why: '朋友緊張的時候，要說讓他有信心、覺得有人支持的話。說他一定投不進、要換人，只會讓他更緊張、更難過。' }
    },
    hanzi: [
      { id: 'h-社', combo: { layout: 'lr', parts: [['礻', 'm', '祭拜'], ['土', 's', '']] }, char: '社', zhuyin: 'ㄕㄜˋ', radical: '示', strokes: 8, words: ['籃球社', '社團'], say: '社，社團的社', cloze: '＿團', img: 'basketball-club.png', options: ['社', '杜', '吐', '祉'], clue: '這個字的左邊是示字旁，右邊是「土」。', explain: '答案是「社」，左邊是示字旁；「杜」的左邊是木字旁，「吐」的左邊是口字旁。', parts: ['礻', '土'], story: '左邊的示字旁和祭拜有關，右邊是「土」。很久以前大家一起祭拜土地，聚在一起；現在很多人聚在一起做喜歡的事，就叫「社團」。', sentence: '我參加了學校的舞蹈社團。', build: { layout: 'lr', show: ['？', '土'], answer: '礻', options: ['礻', '木', '口', '扌'], clue: '想一想：「杜」的左邊是木，這個字的左邊是和祭拜有關的部首。' } },
      { id: 'h-邀', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的「敫」念起來有點像「邀」。走過去請別人來，就是「邀」。' }, char: '邀', zhuyin: 'ㄧㄠ', radical: '辵', strokes: 17, words: ['邀約', '邀請'], say: '邀，邀請的邀', cloze: '＿請', img: 'invite.png', options: ['邀', '激', '繳', '敫'], clue: '這個字有辵字旁。', explain: '答案是「邀」，有辵字旁；「激」的左邊是三點水，「繳」的左邊是絲線。', parts: ['辶', '敫'], story: '辵字旁和走路有關，「敫」念起來有點像「邀」。走過去請別人一起來，就是「邀請」。', sentence: '我邀請好朋友來家裡玩。' },
      { id: 'h-與', combo: { type: '會意字', pict: '「與」像好幾隻手一起抬著一樣東西，所以有「和、跟、一起」的意思。' }, char: '與', zhuyin: 'ㄩˇ', radical: '臼', strokes: 14, words: ['我與你', '與其'], say: '與，我與你的與', cloze: '我＿你', img: 'two-friends.png', options: ['與', '興', '舉', '輿'], clue: '這個字長得像「興」，可是中間不一樣。', explain: '答案是「與」，是「和、跟」的意思；「興」是高興的興，「舉」是舉手的舉。', parts: ['與'], story: '「與」像好幾隻手一起抬東西，大家一起做，就有「和、跟」的意思。', sentence: '這是我與好朋友的合照。' },
      { id: 'h-遙', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的部分念起來像「遙」。要走很久很久才到，就是「遙遠」。' }, char: '遙', zhuyin: 'ㄧㄠˊ', radical: '辵', strokes: 14, words: ['遙遠', '遙控器'], say: '遙，遙遠的遙', cloze: '＿遠', img: 'far-mountain.png', options: ['遙', '搖', '謠', '瑤'], clue: '這個字有辵字旁，和走路有關。', explain: '答案是「遙」，有辵字旁；「搖」是搖頭的搖，有提手旁；「謠」是歌謠的謠，有言字旁。', parts: ['辶', '䍃'], story: '辵字旁和走路有關，裡面念起來像「遙」。要走好久好久才走得到，就是「遙遠」。', sentence: '外婆家離這裡很遙遠。' },
      { id: 'h-投', combo: { layout: 'lr', parts: [['扌', 'm', '手'], ['殳', 's', '']] }, char: '投', zhuyin: 'ㄊㄡˊ', radical: '手', strokes: 7, words: ['投籃', '投票'], say: '投，投籃的投', cloze: '＿籃', img: 'shoot.png', options: ['投', '設', '役', '股'], clue: '這個字的左邊，是提手旁。', explain: '答案是「投」，左邊是提手旁；「設」的左邊是言字旁，「役」的左邊是雙人旁。', parts: ['扌', '殳'], story: '左邊是手，右邊的「殳」像拿著東西的手。用手把東西丟出去，就是「投」。', sentence: '哥哥投籃很準。', build: { layout: 'lr', show: ['？', '殳'], answer: '扌', options: ['扌', '言', '彳', '月'], clue: '想一想：把球丟出去，要用身體的哪個部分？' } },
      { id: 'h-熟', combo: { layout: 'tb', parts: [['孰', 's', ''], ['灬', 'm', '火']] }, char: '熟', zhuyin: 'ㄕㄡˊ', radical: '火', strokes: 15, words: ['熟能生巧', '煮熟'], say: '熟，煮熟的熟', cloze: '煮＿', img: 'cooked-egg.png', options: ['熟', '熱', '塾', '孰'], clue: '這個字的上面是「孰」，下面有四點。', explain: '答案是「熟」，上面是「孰」；「熱」的上面是「埶」，是很熱的熱。', parts: ['孰', '灬'], story: '上面的「孰」念起來像「熟」，下面四點是火。用火把食物煮到可以吃，就是「熟」；事情做很多次，也會變「熟」。', sentence: '雞蛋要煮熟了才能吃。', build: { layout: 'tb', show: ['孰', '？'], answer: '灬', options: ['灬', '土', '心', '口'], clue: '想一想：把東西煮好要用什麼？下面放四點的那一個。' } },
      { id: 'h-巧', combo: { layout: 'lr', parts: [['工', 'm', '工具'], ['丂', 's', '']] }, char: '巧', zhuyin: 'ㄑㄧㄠˇ', radical: '工', strokes: 5, words: ['熟能生巧', '巧克力'], say: '巧，巧克力的巧', cloze: '＿克力', img: 'chocolate.png', options: ['巧', '朽', '功', '攻'], clue: '這個字的左邊是「工」。', explain: '答案是「巧」，左邊是「工」；「朽」的左邊是木字旁，「功」的右邊是「力」。', parts: ['工', '丂'], story: '左邊的「工」是做東西的工具，右邊念起來像「巧」。會用工具，做得又好又漂亮，就是「巧」。', sentence: '我最喜歡吃巧克力。', build: { layout: 'lr', show: ['？', '丂'], answer: '工', options: ['工', '木', '力', '子'], clue: '想一想：做東西要用什麼？這個部首像一把尺。' } },
      { id: 'h-彈', combo: { layout: 'lr', parts: [['弓', 'm', '弓箭'], ['單', 's', '']] }, char: '彈', zhuyin: 'ㄊㄢˊ', radical: '弓', strokes: 15, words: ['反彈', '彈琴'], say: '彈，彈琴的彈', cloze: '＿琴', img: 'piano.png', options: ['彈', '單', '蟬', '禪'], clue: '這個字的左邊，是弓字旁。', explain: '答案是「彈」，左邊是「弓」；「單」沒有弓字旁，「蟬」的左邊是「虫」。', parts: ['弓', '單'], story: '左邊是「弓」，弓拉開以後會彈回來；右邊的「單」念起來像「彈」。會彈回來，或用手指撥一撥，就是「彈」。', sentence: '姐姐每天都在練習彈琴。', build: { layout: 'lr', show: ['？', '單'], answer: '弓', options: ['弓', '虫', '口', '示'], clue: '想一想：以前射箭用的東西，拉開又會彈回來。' } },
      { id: 'h-曾', combo: { type: '象形字', pict: '很久以前的「曾」，像蒸東西的鍋子冒出熱氣。後來借來說「以前有過」。' }, char: '曾', zhuyin: 'ㄘㄥˊ', radical: '曰', strokes: 12, words: ['不曾', '曾經'], say: '曾，曾經的曾', cloze: '＿經', img: 'sunrise-beach.png', options: ['曾', '會', '增', '層'], clue: '這個字的上面有兩點，下面是「日」。', explain: '答案是「曾」；「增」多了土字旁，是增加的增；「層」多了「尸」，是樓層的層。', parts: ['八', '田', '日'], story: '很久以前的「曾」像蒸東西的鍋子在冒煙。現在用來說「以前有過」，例如「曾經」。', sentence: '我曾經去海邊看過日出。' },
      { id: 'h-揮', combo: { layout: 'lr', parts: [['扌', 'm', '手'], ['軍', 's', '']] }, char: '揮', zhuyin: 'ㄏㄨㄟ', radical: '手', strokes: 12, words: ['指揮', '揮手'], say: '揮，揮手的揮', cloze: '＿手', img: 'wave-goodbye.png', options: ['揮', '輝', '渾', '運'], clue: '這個字的左邊，是提手旁。', explain: '答案是「揮」，左邊是提手旁；「輝」的左邊是「光」，是光輝的輝。', parts: ['扌', '軍'], story: '左邊是手，右邊的「軍」念起來有點像「揮」。把手搖來搖去，就是「揮手」。', sentence: '火車開了，我對奶奶揮手說再見。', build: { layout: 'lr', show: ['？', '軍'], answer: '扌', options: ['扌', '光', '氵', '辶'], clue: '想一想：說再見的時候，搖的是身體的哪個部分？' } },
      { id: 'h-彼', combo: { layout: 'lr', parts: [['彳', 'm', '走路'], ['皮', 's', '']] }, char: '彼', zhuyin: 'ㄅㄧˇ', radical: '彳', strokes: 8, words: ['此起彼落', '彼此'], say: '彼，彼此的彼', cloze: '＿此', img: 'help-each-other.png', options: ['彼', '披', '被', '波'], clue: '這個字的左邊，是雙人旁。', explain: '答案是「彼」，左邊是雙人旁；「被」的左邊是衣字旁，「波」的左邊是三點水。', parts: ['彳', '皮'], story: '左邊的雙人旁和走路有關，右邊的「皮」念起來有點像「彼」。「彼」是「那邊」，「彼此」就是你和我、這邊和那邊。', sentence: '同學之間要彼此幫忙。', build: { layout: 'lr', show: ['？', '皮'], answer: '彳', options: ['彳', '扌', '衤', '氵'], clue: '想一想：和走路有關的部首，是哪一個？' } },
      { id: 'h-秒', combo: { layout: 'lr', parts: [['禾', 'm', '稻子'], ['少', 's', '']] }, char: '秒', zhuyin: 'ㄇㄧㄠˇ', radical: '禾', strokes: 9, words: ['秒針', '五秒'], say: '秒，秒針的秒', cloze: '＿針', img: 'stopwatch.png', options: ['秒', '妙', '抄', '炒'], clue: '這個字的左邊，是禾字旁。', explain: '答案是「秒」，左邊是「禾」；「妙」的左邊是女字旁，「炒」的左邊是火字旁。', parts: ['禾', '少'], story: '左邊的「禾」是稻子，右邊是「少」。稻穗尖端細細的毛，非常非常小，後來就用「秒」說非常短的時間。', sentence: '時鐘的秒針一直往前走。', build: { layout: 'lr', show: ['？', '少'], answer: '禾', options: ['禾', '女', '扌', '火'], clue: '想一想：「妙」的左邊是女，這個字的左邊是稻子。' } },
      { id: 'h-喧', combo: { layout: 'lr', parts: [['口', 'm', '嘴巴'], ['宣', 's', '']] }, char: '喧', zhuyin: 'ㄒㄩㄢ', radical: '口', strokes: 12, words: ['喧鬧', '喧譁'], say: '喧，喧鬧的喧', cloze: '＿鬧', img: 'noisy.png', options: ['喧', '宣', '渲', '暄'], clue: '這個字的左邊，是口字旁。', explain: '答案是「喧」，左邊是「口」；「宣」沒有口字旁，是宣布的宣。', parts: ['口', '宣'], story: '左邊是「口」，右邊的「宣」念起來像「喧」。很多嘴巴一起大聲說話，好吵，就是「喧鬧」。', sentence: '夜市裡人好多，非常喧鬧。', build: { layout: 'lr', show: ['？', '宣'], answer: '口', options: ['口', '氵', '日', '木'], clue: '想一想：大聲說話要用什麼？' } },
      { id: 'h-優', combo: { layout: 'lr', parts: [['亻', 'm', '人'], ['憂', 's', '']] }, char: '優', zhuyin: 'ㄧㄡ', radical: '人', strokes: 17, words: ['優美', '優點'], say: '優，優點的優', cloze: '＿點', img: 'dancer.png', options: ['優', '憂', '擾', '夏'], clue: '這個字的左邊，是單人旁。', explain: '答案是「優」，左邊是單人旁；「憂」是擔憂的憂，沒有單人旁。', parts: ['亻', '憂'], story: '左邊是人，右邊的「憂」念起來像「優」。人做得很好、很棒，就是「優」。', sentence: '每個人都有自己的優點。', build: { layout: 'lr', show: ['？', '憂'], answer: '亻', options: ['亻', '扌', '忄', '口'], clue: '想一想：「擾」的左邊是手，說一個人很棒，左邊放什麼？' } },
      { id: 'h-弧', combo: { layout: 'lr', parts: [['弓', 'm', '弓'], ['瓜', 's', '']] }, char: '弧', zhuyin: 'ㄏㄨˊ', radical: '弓', strokes: 8, words: ['弧線', '括弧'], say: '弧，弧線的弧', cloze: '＿線', img: 'arc.png', options: ['弧', '狐', '孤', '瓜'], clue: '這個字的左邊，是弓字旁。', explain: '答案是「弧」，左邊是「弓」；「狐」是狐狸的狐，「孤」是孤單的孤。', parts: ['弓', '瓜'], story: '左邊是「弓」，弓是彎彎的；右邊的「瓜」念起來像「弧」。像弓一樣彎彎的線，就是「弧線」。', sentence: '小狗跳起來，在空中畫出一道弧線接住飛盤。', build: { layout: 'lr', show: ['？', '瓜'], answer: '弓', options: ['弓', '犭', '子', '禾'], clue: '想一想：「狐」的左邊是動物，這個字的左邊是一樣彎彎的射箭工具。' } }
    ],
    vocab: [
      { id: 'v-喝采', cloze: true, clozeOptions: ['喝采', '嘆氣', '罵人', '哭泣'], word: '喝采', meaning: '大聲叫好、拍手稱讚。', example: '他表演完，觀眾都起立為他＿＿。', img: 'cheer.png', options: ['喝采', '喧鬧', '指揮', '邀約'] },
      { id: 'v-籃球社', word: '籃球社', meaning: '學校裡喜歡打籃球的人，一起練習的社團。', example: '我參加了學校的＿＿＿，每個星期練習兩次。', img: 'basketball-club.png', options: ['籃球社', '弧線', '秒', '與'] },
      { id: 'v-邀約', cloze: true, clozeOptions: ['邀約', '拒絕', '趕走', '忘記'], word: '邀約', meaning: '請別人一起來做一件事。', example: '在好朋友的＿＿下，我們一起去看了電影。', img: 'invite.png', options: ['邀約', '指揮', '反彈', '喝采'] },
      { id: 'v-與', cloze: true, clozeOptions: ['與', '或', '但', '嗎'], word: '與', meaning: '和、跟。', example: '我＿妹妹一起去公園玩。', img: 'two-friends.png', options: ['與', '秒', '投', '不曾'] },
      { id: 'v-遙不可及', cloze: true, clozeOptions: ['遙不可及', '近在眼前', '輕而易舉', '一模一樣'], word: '遙不可及', meaning: '非常遠，好像怎麼走都沒辦法到。', example: '對小時候的我來說，騎腳踏車去上學像是＿＿＿＿的夢想。', img: 'far-mountain.png', options: ['遙不可及', '熟能生巧', '此起彼落', '喧鬧'] },
      { id: 'v-投', cloze: true, clozeOptions: ['投', '吃', '睡', '唱'], word: '投', meaning: '把球丟出去、丟進去。', example: '他站在線外，把球＿進了籃框。', img: 'shoot.png', options: ['投', '與', '秒', '反彈'] },
      { id: 'v-熟能生巧', cloze: true, clozeOptions: ['熟能生巧', '半途而廢', '一事無成', '手忙腳亂'], word: '熟能生巧', meaning: '練得很習慣了，自然就會找到好方法。', example: '剛開始包水餃包得很醜，包了一百個以後＿＿＿＿，越包越漂亮。', img: 'practice-ball.png', options: ['熟能生巧', '遙不可及', '此起彼落', '優美'] },
      { id: 'v-反彈', cloze: true, clozeOptions: ['反彈', '停住', '掉落', '消失'], word: '反彈', meaning: '碰到東西以後，又跳回來。', example: '球丟到牆上，又＿＿回到我手裡。', img: 'bounce.png', options: ['反彈', '指揮', '投', '喝采'] },
      { id: 'v-不曾', cloze: true, clozeOptions: ['不曾', '常常', '每天', '總是'], word: '不曾', meaning: '從來沒有。', example: '爺爺說他＿＿坐過飛機，好想試試看。', img: 'never-give-up.png', options: ['不曾', '與', '秒', '投'] },
      { id: 'v-指揮', cloze: true, clozeOptions: ['指揮', '聽從', '跟著', '模仿'], word: '指揮', meaning: '叫別人照著自己的意思去做。', example: '班長站在前面＿＿大家把桌椅排整齊。', img: 'conductor.png', options: ['指揮', '邀約', '喝采', '反彈'] },
      { id: 'v-此起彼落', cloze: true, clozeOptions: ['此起彼落', '鴉雀無聲', '一言不發', '安安靜靜'], word: '此起彼落', meaning: '這裡響完那裡又響，一直接連不斷。', example: '演唱會上，粉絲的尖叫聲＿＿＿＿。', img: 'crowd-cheer.png', options: ['此起彼落', '遙不可及', '熟能生巧', '喧鬧'] },
      { id: 'v-秒', cloze: true, clozeOptions: ['秒', '斤', '杯', '本'], word: '秒', meaning: '很短的時間單位，六十個是一分鐘。', example: '他跑五十公尺只花了九＿。', img: 'stopwatch.png', options: ['秒', '與', '投', '不曾'] },
      { id: 'v-喧鬧', cloze: true, clozeOptions: ['喧鬧', '安靜', '冷清', '寂靜'], word: '喧鬧', meaning: '很多人大聲說話，很吵。', example: '下課的時候，走廊上非常＿＿。', img: 'noisy.png', options: ['喧鬧', '優美', '喝采', '指揮'] },
      { id: 'v-優美', cloze: true, clozeOptions: ['優美', '難看', '普通', '奇怪'], word: '優美', meaning: '很好看、很好聽，讓人覺得舒服。', example: '姐姐跳舞的動作非常＿＿。', img: 'dancer.png', options: ['優美', '喧鬧', '反彈', '邀約'] },
      { id: 'v-弧線', cloze: true, clozeOptions: ['弧線', '直線', '方格', '圓點'], word: '弧線', meaning: '像彩虹一樣彎彎的一條。', example: '球在空中畫出一道＿＿，掉進了籃框。', img: 'arc.png', options: ['弧線', '籃球社', '秒', '與'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-社', char: '社', img: 'cw-club.png', charMeaning: '很多人聚在一起的團體。', word: '社團', meaning: '大家因為喜歡同一件事，聚在一起練習、活動的團體。', example: '我參加了學校的直笛＿＿。', options: ['社團', '彼此', '秒針', '括弧'] },
      { id: 'cw-邀', char: '邀', img: 'invite.png', charMeaning: '請別人來。', word: '邀請', meaning: '很有禮貌的請別人來。', example: '我生日那天，＿＿好朋友來家裡吃蛋糕。', options: ['邀請', '揮手', '優點', '煮熟'] },
      { id: 'cw-與', char: '與', img: 'cw-join.png', charMeaning: '和、跟；一起加入。', word: '參與', meaning: '加入、一起做。', example: '班上每個人都要＿＿大掃除。', options: ['參與', '曾經', '彼此', '遙控器'] },
      { id: 'cw-遙', char: '遙', img: 'cw-remote.png', charMeaning: '很遠。', word: '遙控器', meaning: '不用走過去，在遠遠的地方按一按，就能開電視的小東西。', example: '我拿起＿＿＿，把電視打開。', options: ['遙控器', '巧克力', '社團', '括弧'] },
      { id: 'cw-投', char: '投', img: 'cw-vote.png', charMeaning: '把東西丟進去、放進去。', word: '投票', meaning: '把寫好的選票放進票箱，選出自己想要的人。', example: '班上要選班長，大家一個一個去＿＿。', options: ['投票', '揮手', '參與', '秒針'] },
      { id: 'cw-熟', char: '熟', img: 'cooked-egg.png', charMeaning: '煮好可以吃；做很多次而很習慣。', word: '煮熟', meaning: '用火煮到可以吃。', example: '雞蛋要＿＿以後才能吃。', options: ['煮熟', '邀請', '投票', '優點'] },
      { id: 'cw-巧', char: '巧', img: 'chocolate.png', charMeaning: '做得很好、很靈活。', word: '巧克力', meaning: '用可可做成、甜甜的零食。', example: '我最喜歡吃＿＿＿口味的冰淇淋。', options: ['巧克力', '遙控器', '社團', '曾經'] },
      { id: 'cw-彈', char: '彈', img: 'piano.png', charMeaning: '用手指撥、按，讓樂器發出聲音。', word: '彈琴', meaning: '用手指按琴鍵，發出好聽的音樂。', example: '姐姐每天放學都要練習＿＿。', options: ['彈琴', '投票', '煮熟', '揮手'] },
      { id: 'cw-曾', char: '曾', img: 'sunrise-beach.png', charMeaning: '以前有過。', word: '曾經', meaning: '以前有過這件事。', example: '我＿＿去過阿里山看日出。', options: ['曾經', '彼此', '參與', '彈琴'] },
      { id: 'cw-揮', char: '揮', img: 'wave-goodbye.png', charMeaning: '把手搖來搖去。', word: '揮手', meaning: '把手舉起來左右搖。', example: '爸爸在車站對我＿＿說再見。', options: ['揮手', '煮熟', '社團', '括弧'] },
      { id: 'cw-彼', char: '彼', img: 'help-each-other.png', charMeaning: '那邊；你和我。', word: '彼此', meaning: '你和我、雙方互相。', example: '好朋友要＿＿幫忙，不要吵架。', options: ['彼此', '優點', '遙控器', '投票'] },
      { id: 'cw-秒', char: '秒', img: 'cw-clock.png', charMeaning: '很短的時間。', word: '秒針', meaning: '時鐘上走得最快、最細的那一根針。', example: '時鐘的＿＿滴答滴答的走著。', options: ['秒針', '括弧', '曾經', '參與'] },
      { id: 'cw-喧', char: '喧', img: 'noisy.png', charMeaning: '很多人大聲說話。', word: '喧譁', meaning: '大聲吵鬧說話。', example: '圖書館裡要保持安靜，不可以＿＿。', options: ['喧譁', '邀請', '巧克力', '揮手'] },
      { id: 'cw-優', char: '優', img: 'cw-good-points.png', charMeaning: '很好、很棒。', word: '優點', meaning: '一個人好的地方、厲害的地方。', example: '弟弟的＿＿是很有禮貌。', options: ['優點', '彈琴', '秒針', '社團'] },
      { id: 'cw-弧', char: '弧', img: 'cw-brackets.png', charMeaning: '彎彎的樣子。', word: '括弧', meaning: '寫字時用的「（ ）」符號，把一些字包起來。', example: '老師說，補充說明的話可以寫在＿＿裡面。', options: ['括弧', '喧譁', '投票', '曾經'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-無與倫比', situationImg: 'id-best-cake.png', idiom: '無與倫比', char: '與', meaning: '好到沒有別的東西可以比得上。', example: '奶奶做的滷肉飯，在我心中是無與倫比的美味。', situation: '大家吃過很多家的蛋糕，可是都覺得這一家的蛋糕最好吃，沒有一家比得上。',
        fill: { options: ['煙火表演美得＿＿＿＿，大家都看呆了。', '這幅畫畫得很普通，真是＿＿＿＿。'], clue: '提示：哪一句是好到沒有東西比得上？', explain: '第一句用得對：煙火美到大家都看呆了。畫得很普通，就不是這個意思。' } },
      { id: 'i-五體投地', situationImg: 'id-admire.png', idiom: '五體投地', char: '投', meaning: '非常非常佩服一個人。', example: '他一口氣解出全部的數學難題，我真是佩服得五體投地。', situation: '表演魔術的叔叔把撲克牌變不見，又從我的口袋裡拿出來，大家都覺得他太厲害了。',
        fill: { options: ['他能倒背整本書，大家都佩服得＿＿＿＿。', '他常常說謊，大家都對他＿＿＿＿。'], clue: '提示：哪一句是很佩服一個人？', explain: '第一句用得對：能倒背整本書，大家很佩服他。常常說謊，大家不會佩服他。' } },
      { id: 'i-耳熟能詳', situationImg: 'id-sing-along.png', idiom: '耳熟能詳', char: '熟', meaning: '聽得很熟，可以完整的說出來。', example: '這首兒歌大家都耳熟能詳，一開頭就跟著唱。', situation: '音樂一放出生日快樂歌，全班同學不用看歌詞，馬上就能一起唱出來。',
        fill: { options: ['這個故事大家都聽過很多次，早就＿＿＿＿了。', '這首歌我從來沒聽過，所以＿＿＿＿。'], clue: '提示：哪一句是聽得很熟？', explain: '第一句用得對：聽過很多次，所以很熟。從來沒聽過，就不熟。' } },
      { id: 'i-弄巧成拙', situationImg: 'id-messy-help.png', idiom: '弄巧成拙', char: '巧', meaning: '想要做得更好，結果反而把事情弄糟了。', example: '弟弟想幫媽媽洗碗，結果打破了盤子，真是弄巧成拙。', situation: '妹妹想把頭髮剪得更漂亮，自己拿剪刀剪，結果剪得一邊長一邊短。',
        fill: { options: ['他想把蛋糕做得更甜，糖加太多，結果＿＿＿＿。', '他照著食譜一步一步做，蛋糕做得很成功，一點也不＿＿＿＿。'], clue: '提示：哪一句是想做得更好，結果反而弄糟了？', explain: '第一句用得對：想讓蛋糕更甜，結果加太多糖弄糟了。照著做很成功，就不是這個意思。' } },
      { id: 'i-對牛彈琴', situationImg: 'id-baby-talk.png', idiom: '對牛彈琴', char: '彈', meaning: '跟聽不懂的人說道理，說了也沒有用。', example: '跟兩歲的弟弟講數學，簡直是對牛彈琴。', situation: '哥哥一直跟剛出生的小嬰兒說怎麼打電動，小嬰兒只會睡覺，一句也聽不懂。',
        fill: { options: ['跟小貓說要寫功課，簡直是＿＿＿＿。', '老師講的故事，大家都聽得很懂，真是＿＿＿＿。'], clue: '提示：哪一句是說了對方也聽不懂？', explain: '第一句用得對：小貓聽不懂寫功課。大家都聽得懂，就不是這個意思。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-社', char: '社', wrong: '杜', sentence: '我參加了學校的舞蹈社團。', options: ['社', '杜', '吐'], clue: '這裡說的是大家聚在一起練習的團體，想一想，哪一個字的左邊是示字旁？', explain: '要改成「社」。聚在一起的團體是「社團」，左邊是示字旁；「杜」的左邊是木字旁。' },
      { id: 'fx-邀', char: '邀', wrong: '激', sentence: '我邀請好朋友來家裡玩。', options: ['邀', '激', '繳'], clue: '這裡是說請別人來，想一想，哪一個字有辵字旁？', explain: '要改成「邀」。請別人來是「邀請」，有辵字旁；「激」是刺激的激。' },
      { id: 'fx-與', char: '與', wrong: '興', sentence: '這是我與好朋友的合照。', options: ['與', '興', '舉'], clue: '這裡是「和、跟」的意思，跟高興沒有關係。', explain: '要改成「與」。「和、跟」的意思是「與」；「興」是高興的興。' },
      { id: 'fx-遙', char: '遙', wrong: '搖', sentence: '外婆家離這裡很遙遠。', options: ['遙', '搖', '謠'], clue: '這裡是說很遠，想一想，哪一個字有辵字旁？', explain: '要改成「遙」。很遠是「遙遠」，有辵字旁；「搖」是搖頭的搖。' },
      { id: 'fx-投', char: '投', wrong: '設', sentence: '哥哥投籃很準。', options: ['投', '設', '股'], clue: '這裡是說把球丟進籃框，想一想，哪一個字有提手旁？', explain: '要改成「投」。把球丟進籃框是「投籃」，有提手旁；「設」是設計的設。' },
      { id: 'fx-熟', char: '熟', wrong: '熱', sentence: '雞蛋要煮熟了才能吃。', options: ['熟', '熱', '塾'], clue: '這裡是說煮到可以吃，跟天氣熱沒有關係。', explain: '要改成「熟」。煮到可以吃是「煮熟」；「熱」是很熱的熱。' },
      { id: 'fx-巧', char: '巧', wrong: '朽', sentence: '我最喜歡吃巧克力。', options: ['巧', '朽', '功'], clue: '這裡說的是甜甜的零食，想一想，哪一個字的左邊是「工」？', explain: '要改成「巧」。甜甜的零食是「巧克力」，左邊是「工」；「朽」的左邊是木字旁。' },
      { id: 'fx-彈', char: '彈', wrong: '單', sentence: '姐姐每天都在練習彈琴。', options: ['彈', '單', '蟬'], clue: '這裡是說用手指讓琴發出聲音，想一想，哪一個字有弓字旁？', explain: '要改成「彈」。讓琴發出聲音是「彈琴」，左邊是「弓」；「單」沒有弓字旁。' },
      { id: 'fx-曾', char: '曾', wrong: '增', sentence: '我曾經去海邊看過日出。', options: ['曾', '增', '層'], clue: '這裡是說以前有過，跟增加沒有關係。', explain: '要改成「曾」。以前有過是「曾經」；「增」是增加的增。' },
      { id: 'fx-揮', char: '揮', wrong: '輝', sentence: '火車開了，我對奶奶揮手。', options: ['揮', '輝', '運'], clue: '這裡是說把手搖一搖，想一想，哪一個字有提手旁？', explain: '要改成「揮」。把手搖一搖是「揮手」，有提手旁；「輝」是光輝的輝。' },
      { id: 'fx-彼', char: '彼', wrong: '被', sentence: '同學之間要彼此幫忙。', options: ['彼', '被', '披'], clue: '這裡是說你和我互相，跟棉被沒有關係。', explain: '要改成「彼」。互相是「彼此」，左邊是雙人旁；「被」是棉被的被。' },
      { id: 'fx-秒', char: '秒', wrong: '妙', sentence: '時鐘的秒針一直往前走。', options: ['秒', '妙', '炒'], clue: '這裡說的是時鐘上走得最快的針，想一想，哪一個字的左邊是「禾」？', explain: '要改成「秒」。走得最快的針是「秒針」，左邊是「禾」；「妙」是奇妙的妙。' },
      { id: 'fx-喧', char: '喧', wrong: '宣', sentence: '夜市裡人好多，非常喧鬧。', options: ['喧', '宣', '渲'], clue: '這裡是說很多人大聲說話，想一想，哪一個字有口字旁？', explain: '要改成「喧」。很多人大聲說話是「喧鬧」，有口字旁；「宣」是宣布的宣。' },
      { id: 'fx-優', char: '優', wrong: '憂', sentence: '每個人都有自己的優點。', options: ['優', '憂', '擾'], clue: '這裡是說好的地方，跟擔心沒有關係。', explain: '要改成「優」。好的地方是「優點」，有單人旁；「憂」是擔憂的憂。' },
      { id: 'fx-弧', char: '弧', wrong: '狐', sentence: '球在空中畫出一道弧線。', options: ['弧', '狐', '孤'], clue: '這裡說的是彎彎的線，跟狐狸沒有關係。', explain: '要改成「弧」。彎彎的線是「弧線」，左邊是「弓」；「狐」是狐狸的狐。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿請」是很有禮貌的請別人來。', sentence: '小美＿請全班同學參加她的生日會。', frame: '＿請', options: ['邀', '激'], answer: '邀', clue: '提示：這個字有辵字旁，和走路有關。', explain: '答案是「邀」；「激」是刺激的激，有三點水。' },
      { id: 's2', meaning: '「刺＿」是讓人心跳很快、很興奮。', sentence: '坐雲霄飛車好刺＿！', frame: '刺＿', options: ['激', '邀'], answer: '激', clue: '提示：這個字的左邊是三點水。', explain: '答案是「激」；「邀」是邀請的邀。' },
      { id: 's3', meaning: '「＿頭」是把頭左右轉來轉去，表示不要。', sentence: '問他要不要吃青椒，他一直＿頭。', frame: '＿頭', options: ['搖', '遙'], answer: '搖', clue: '提示：要動一動頭和手，這個字有提手旁。', explain: '答案是「搖」；「遙」是遙遠的遙，有辵字旁。' },
      { id: 's4', meaning: '「假＿」是先想像一件還沒發生的事。', sentence: '我們先＿想一下：如果明天下雨，要怎麼辦？', frame: '＿想', options: ['設', '投'], answer: '設', clue: '提示：這個字的左邊是言字旁。', explain: '答案是「設」；「投」是投籃的投，有提手旁。' },
      { id: 's5', meaning: '「＿鬧」是人很多、很好玩的樣子。', sentence: '過年的時候，街上好＿鬧。', frame: '＿鬧', options: ['熱', '熟'], answer: '熱', clue: '提示：這個字的上面和「勢」很像。', explain: '答案是「熱」；「熟」是煮熟的熟。' },
      { id: 's6', meaning: '「樓＿」是大樓的第幾樓。', sentence: '我們家住在十二樓，這棟大樓一共有二十＿。', frame: '二十＿', options: ['層', '曾'], answer: '層', clue: '提示：這個字的上面多了一個「尸」。', explain: '答案是「層」；「曾」是曾經的曾。' },
      { id: 's7', meaning: '「＿加」是變多。', sentence: '天氣熱，喝水的量要＿加。', frame: '＿加', options: ['增', '曾'], answer: '增', clue: '提示：這個字的左邊是土字旁。', explain: '答案是「增」；「曾」是曾經的曾，沒有土字旁。' },
      { id: 's8', meaning: '「光＿」是很亮、很漂亮的光。', sentence: '太陽的光＿照亮了大地。', frame: '光＿', options: ['輝', '揮'], answer: '輝', clue: '提示：這句話在說光，這個字的左邊是「光」。', explain: '答案是「輝」；「揮」是揮手的揮，有提手旁。' },
      { id: 's9', meaning: '「棉＿」是睡覺時蓋的厚厚的東西。', sentence: '冬天好冷，我蓋上厚厚的棉＿。', frame: '棉＿', options: ['被', '彼'], answer: '被', clue: '提示：這個字和衣服、布有關，左邊是衣字旁。', explain: '答案是「被」；「彼」是彼此的彼，左邊是雙人旁。' },
      { id: 's10', meaning: '「奇＿」是很特別、很神奇。', sentence: '種子長成大樹，真是奇＿。', frame: '奇＿', options: ['妙', '秒'], answer: '妙', clue: '提示：這個字的左邊是女字旁。', explain: '答案是「妙」；「秒」是秒針的秒，左邊是「禾」。' },
      { id: 's11', meaning: '「＿布」是正式的告訴大家一件事。', sentence: '校長在朝會上＿布運動會的日期。', frame: '＿布', options: ['宣', '喧'], answer: '宣', clue: '提示：這個字沒有口字旁，上面是寶蓋頭。', explain: '答案是「宣」；「喧」是喧鬧的喧，有口字旁。' },
      { id: 's12', meaning: '「擔＿」是心裡放不下，一直擔心。', sentence: '弟弟發燒了，媽媽很擔＿。', frame: '擔＿', options: ['憂', '優'], answer: '憂', clue: '提示：這個字沒有單人旁。', explain: '答案是「憂」；「優」是優點的優，有單人旁。' },
      { id: 's13', meaning: '「＿狸」是一種尾巴蓬蓬的動物。', sentence: '森林裡跑出一隻＿狸。', frame: '＿狸', options: ['狐', '弧'], answer: '狐', clue: '提示：這是一種動物，左邊是犬字旁。', explain: '答案是「狐」；「弧」是弧線的弧，左邊是「弓」。' }
    ],
    listen: [
      { id: 'l1', text: '他表演完，大家大聲叫好、一直拍手。', answer: 0, options: [{ text: '喝采', img: 'cheer.png' }, { text: '喧鬧', img: 'noisy.png' }, { text: '反彈', img: 'bounce.png' }, { text: '指揮', img: 'conductor.png' }] },
      { id: 'l2', text: '好朋友打電話來，請我明天一起去打球。', answer: 0, options: [{ text: '邀約', img: 'invite.png' }, { text: '指揮', img: 'conductor.png' }, { text: '喝采', img: 'cheer.png' }, { text: '不曾', img: 'never-give-up.png' }] },
      { id: 'l3', text: '那座山好遠好遠，好像怎麼走都走不到。', answer: 0, options: [{ text: '遙不可及', img: 'far-mountain.png' }, { text: '熟能生巧', img: 'practice-ball.png' }, { text: '此起彼落', img: 'crowd-cheer.png' }, { text: '優美', img: 'dancer.png' }] },
      { id: 'l4', text: '每天練習，練得很熟以後，就越做越好了。', answer: 0, options: [{ text: '熟能生巧', img: 'practice-ball.png' }, { text: '遙不可及', img: 'far-mountain.png' }, { text: '喧鬧', img: 'noisy.png' }, { text: '反彈', img: 'bounce.png' }] },
      { id: 'l5', text: '球丟到地上，又跳回我的手裡。', answer: 0, options: [{ text: '反彈', img: 'bounce.png' }, { text: '投', img: 'shoot.png' }, { text: '弧線', img: 'arc.png' }, { text: '秒', img: 'stopwatch.png' }] },
      { id: 'l6', text: '這邊有人喊加油，那邊也有人喊加油，一直都沒停。', answer: 0, options: [{ text: '此起彼落', img: 'crowd-cheer.png' }, { text: '遙不可及', img: 'far-mountain.png' }, { text: '優美', img: 'dancer.png' }, { text: '不曾', img: 'never-give-up.png' }] },
      { id: 'l7', text: '下課時，走廊上的人都在大聲說話，好吵。', answer: 0, options: [{ text: '喧鬧', img: 'noisy.png' }, { text: '優美', img: 'dancer.png' }, { text: '喝采', img: 'cheer.png' }, { text: '邀約', img: 'invite.png' }] },
      { id: 'l8', text: '球在空中畫出一道彎彎的線，像彩虹一樣。', answer: 0, options: [{ text: '弧線', img: 'arc.png' }, { text: '反彈', img: 'bounce.png' }, { text: '秒', img: 'stopwatch.png' }, { text: '籃球社', img: 'basketball-club.png' }] }
    ],
    /* ---------- 短語、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      /* 拼短語每一格下面寫要放什麼樣的詞 */
      fillLabels: { before: '做什麼', answer: '怎麼樣', noun: '什麼東西' },
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看做出來的東西是什麼樣子。',
      /* 短語：做什麼＋怎麼樣＋的＋什麼東西（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '畫出漂亮的圖畫', img: 'pr-painting.png',
        parts: [{ text: '畫出', role: '做什麼' }, { text: '漂亮', role: '怎麼樣' }, { text: '的' }, { text: '圖畫', role: '什麼東西' }],
        explain: '先說做什麼，再說做出來的東西怎麼樣，加上「的」，最後說是什麼東西。' },
      pick: [
        { id: 'ph1', img: 'pr-singing.png', before: '唱出', noun: '歌聲', ask: '唱出什麼樣的歌聲', look: '再看看圖片，大家聽了是不是很喜歡？', options: ['好聽', '難吃', '冰冷', '粗糙'], clue: '提示：大家都拍手，還想要她再唱一次。', explain: '答案是「好聽」，完整的短語是「唱出好聽的歌聲」。' },
        { id: 'ph2', img: 'pr-rainbow.png', before: '畫出', noun: '彩虹', ask: '畫出什麼樣的彩虹', look: '再看看圖片，彩虹有幾種顏色？', options: ['美麗', '吵鬧', '苦澀', '沉重'], clue: '提示：紅橙黃綠藍靛紫，讓人看了好喜歡。', explain: '答案是「美麗」，完整的短語是「畫出美麗的彩虹」。' },
        { id: 'ph3', img: 'pr-bread.png', before: '烤出', noun: '麵包', ask: '烤出什麼樣的麵包', look: '再看看圖片，麵包聞起來怎麼樣？', options: ['香甜', '吵鬧', '安靜', '冰冷'], clue: '提示：剛出爐，整間廚房都是好聞的味道，吃起來像有加糖。', explain: '答案是「香甜」，完整的短語是「烤出香甜的麵包」。' },
        { id: 'ph4', img: 'pr-sandcastle.png', before: '堆出', noun: '沙堡', ask: '堆出什麼樣的沙堡', look: '再看看圖片，沙堡跟小朋友比起來怎麼樣？', options: ['高大', '好聽', '香甜', '冰涼'], clue: '提示：沙堡堆得比小朋友的頭還要上面。', explain: '答案是「高大」，完整的短語是「堆出高大的沙堡」。' },
        { id: 'ph5', img: 'pr-handwriting.png', before: '寫出', noun: '字', ask: '寫出什麼樣的字', look: '再看看圖片，字寫得歪不歪？', options: ['工整', '吵鬧', '香甜', '冰冷'], clue: '提示：每一個字都排得直直的、一筆一畫很清楚。', explain: '答案是「工整」，完整的短語是「寫出工整的字」。' },
        { id: 'ph6', img: 'pr-lantern.png', before: '做出', noun: '燈籠', ask: '做出什麼樣的燈籠', look: '再看看圖片，燈籠做得仔不仔細？', options: ['精美', '好聽', '苦澀', '吵鬧'], clue: '提示：上面有細細的花紋，像是店裡賣的一樣好看。', explain: '答案是「精美」，完整的短語是「做出精美的燈籠」。' },
        { id: 'ph7', img: 'pr-laughing.png', before: '發出', noun: '笑聲', ask: '發出什麼樣的笑聲', look: '再看看圖片，大家的表情怎麼樣？', options: ['開心', '難過', '冰冷', '苦澀'], clue: '提示：大家笑得嘴巴張好大，眼睛都瞇起來了。', explain: '答案是「開心」，完整的短語是「發出開心的笑聲」。' },
        { id: 'ph8', img: 'pr-dance-steps.png', before: '跳出', noun: '舞步', ask: '跳出什麼樣的舞步', look: '再看看圖片，他們跳得快不快、開不開心？', options: ['輕快', '沉重', '苦澀', '冰冷'], clue: '提示：腳步一下一下好有精神，跟著音樂蹦蹦跳。', explain: '答案是「輕快」，完整的短語是「跳出輕快的舞步」。' }
      ],
      say: [],
      words: [
        { word: '有朝一日', meaning: '將來有一天。', img: 'future-dream.png' },
        { word: '風雲人物', meaning: '表現很好、大家都認識的厲害人物。', img: 'star-player.png' },
        { word: '遙不可及', meaning: '非常遠，或是好像沒有希望做到。', img: 'far-mountain.png' },
        { word: '熟能生巧', meaning: '練習得很熟，自然就做得又快又好。', img: 'practice-ball.png' },
        { word: '此起彼落', meaning: '這裡響完那裡又響，一直接連不斷。', img: 'crowd-cheer.png' },
        { word: '平分秋色', meaning: '兩邊一樣好，分不出誰比較厲害。', img: 'tie-game.png' }
      ],
      choose: [
        { id: 'pw1', word: '有朝一日', options: ['我希望有朝一日能當上醫生，幫助生病的人。', '我昨天有朝一日去了動物園。'], clue: '提示：想一想，「有朝一日」說的是以前，還是將來？', explain: '第一句用得對：說的是將來有一天的願望。昨天是已經過去的事，不能用「有朝一日」。' },
        { id: 'pw2', word: '風雲人物', options: ['他在運動會拿了三面金牌，成了全校的風雲人物。', '他每天都躲在家裡，誰也不認識他，是個風雲人物。'], clue: '提示：想一想，「風雲人物」是大家都認識，還是沒人認識？', explain: '第一句用得對：拿了金牌，大家都認識他。沒人認識，就不是風雲人物。' },
        { id: 'pw3', word: '遙不可及', options: ['對剛學游泳的我來說，游完一千公尺好像遙不可及。', '學校就在我家隔壁，真是遙不可及。'], clue: '提示：想一想，「遙不可及」是很遠很難，還是很近很容易？', explain: '第一句用得對：剛學游泳，要游一千公尺好難。學校在隔壁很近，剛好相反。' },
        { id: 'pw4', word: '熟能生巧', options: ['我每天練習寫書法，熟能生巧，字越寫越漂亮。', '我從來沒有練習過，所以熟能生巧。'], clue: '提示：想一想，「熟能生巧」要不要先練習很多次？', explain: '第一句用得對：每天練習，越寫越好。從來沒練習，就不會熟能生巧。' },
        { id: 'pw5', word: '此起彼落', options: ['青蛙的叫聲此起彼落，整個晚上都沒停。', '圖書館裡安安靜靜，聲音此起彼落。'], clue: '提示：想一想，「此起彼落」是聲音一直有，還是完全沒有？', explain: '第一句用得對：青蛙一直叫，接連不斷。圖書館很安靜，就不是此起彼落。' },
        { id: 'pw6', word: '平分秋色', options: ['兩隊的實力平分秋色，比到最後還是平手。', '我們隊贏了二十分，兩隊平分秋色。'], clue: '提示：想一想，「平分秋色」是兩邊一樣好，還是一邊贏很多？', explain: '第一句用得對：兩隊一樣厲害，打成平手。贏了二十分，就不是平分秋色。' }
      ],
      make: [
        { id: 'pm1', word: '有朝一日', clue: '提示：想想看，你將來有一天想做什麼？', model: '我希望有朝一日能去日本看雪。' },
        { id: 'pm2', word: '風雲人物', clue: '提示：想想看，學校裡誰表現很好，大家都認識他？', model: '姐姐唱歌得了冠軍，變成學校的風雲人物。' },
        { id: 'pm3', word: '遙不可及', clue: '提示：想想看，什麼事對現在的你來說好難、好遠？', model: '登上玉山對我來說好像遙不可及。' },
        { id: 'pm4', word: '熟能生巧', clue: '提示：想想看，什麼事你練習很多次以後，越做越好？', model: '我每天練習綁鞋帶，熟能生巧，現在一下就綁好了。' },
        { id: 'pm5', word: '此起彼落', clue: '提示：想想看，什麼聲音這裡響完那裡又響？', model: '過年的時候，鞭炮聲此起彼落。' },
        { id: 'pm6', word: '平分秋色', clue: '提示：想想看，有沒有兩個人或兩隊一樣厲害、分不出輸贏？', model: '我和哥哥下棋平分秋色，一人贏一盤。' }
      ]
    },
    pattern: [
      { key: 'zhiyao', id: 'zy', title: '只要……就……', img: 'zhiyao.png',
        meaning: '先用「只要」說一個要做到的事，再用「就」說做到以後會有的結果。',
        examples: ['只要每天多喝水，身體就會比較健康。'],
        match: [
          { id: 'pt-zy-m1', img: 'pt-water-tree.png', front: '只要每天幫小樹澆水，', options: ['它就會慢慢長大。', '它就會飛走。', '它就會唱歌。'], clue: '提示：看看圖片，小樹喝了水會怎麼樣？', explain: '答案是「它就會慢慢長大」：每天澆水，小樹就會長大。' },
          { id: 'pt-zy-m2', img: 'pt-early-bed.png', front: '只要早一點睡覺，', options: ['明天就不會遲到。', '明天就會下雪。', '明天就變成大人。'], clue: '提示：早點睡，第二天早上會怎麼樣？', explain: '答案是「明天就不會遲到」：早點睡，就能早點起床。' },
          { id: 'pt-zy-m3', img: 'pt-practice-piano.png', front: '只要每天練習彈琴，', options: ['就能彈得越來越好聽。', '就能長出一對翅膀。', '就不用吃晚飯了。'], clue: '提示：看看圖片，每天練習會有什麼結果？', explain: '答案是「就能彈得越來越好聽」：每天練習，就會進步。' }
        ],
        conj: [
          { id: 'pt-zy-c1', full: '只要按下這個按鈕，電燈就會亮。', img: 'pt-light-switch.png', sentence: '＿＿按下這個按鈕，電燈＿會亮。', options: ['只要……就……', '不管……都……', '……一邊……一邊……'], clue: '提示：做了一件事，就會有結果。數數看有幾個空格。', explain: '答案是「只要……就……」：只要按下按鈕，電燈就會亮。' },
          { id: 'pt-zy-c2', full: '只要大家一起打掃，教室就會很乾淨。', img: 'pt-clean-class.png', sentence: '＿＿大家一起打掃，教室＿會很乾淨。', options: ['只要……就……', '不管……都……', '……一邊……一邊……'], clue: '提示：大家做到一件事，教室就會變乾淨。數數看有幾個空格。', explain: '答案是「只要……就……」：只要大家一起打掃，教室就會很乾淨。' },
          { id: 'pt-zy-c3', full: '只要有空，我就會去圖書館看書。', img: 'pt-library-free.png', sentence: '＿＿有空，我＿會去圖書館看書。', options: ['只要……就……', '不管……都……', '……一邊……一邊……'], clue: '提示：有空的時候，就會去做一件事。數數看有幾個空格。', explain: '答案是「只要……就……」：只要有空，我就會去圖書館看書。' }
        ],
        half: [
          { id: 'pt-zy-h1', front: '只要多讀書，', clue: '提示：多讀書會有什麼好結果？記得要說「就」。', model: '就會懂得更多事情。' },
          { id: 'pt-zy-h2', front: '只要明天天氣好，', clue: '提示：天氣好的話，你們要去做什麼？記得要說「就」。', model: '我們就去爬山。' }
        ],
        whole: [
          { id: 'pt-zy-w1', clue: '提示：先用「只要」說你要做到的事，再用「就」說會有的結果。想想看：你想學會什麼？要怎麼做？', model: '只要我認真練習，就一定能學會游泳。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'simile', name: '譬喻', meaning: '把一樣東西比成另一樣有相同地方的東西，讓人更容易想像。常用「像」、「好像」、「如」。', example: '課文把高高的籃球架，比成一座遙不可及的高山。',
          show: { sentence: '操場大得像一片海。' },
          yesno: [
            { id: 'rh-si-y1', sentence: '妹妹笑起來像一朵花。', answer: true, clue: '提示：這句話有沒有把妹妹的笑臉比成另一樣東西？', explain: '是譬喻：把妹妹的笑臉比成一朵花。' },
            { id: 'rh-si-y2', sentence: '妹妹笑了。', answer: false, clue: '提示：這句話有沒有用「像」把東西比成別的東西？', explain: '不是譬喻：這句話只是說妹妹笑了。' }
          ],
          pick: [
            { id: 'rh-si-p1', options: ['球場上的歡呼聲，像打雷一樣大。', '球場上有人在歡呼。'], clue: '提示：哪一句用了「像」，把歡呼聲比成另一樣東西？', explain: '「像打雷一樣大」是譬喻：把歡呼聲比成打雷。' },
            { id: 'rh-si-p2', options: ['他跑得像獵豹一樣快。', '他跑得很快。'], clue: '提示：哪一句把他跑步的樣子比成別的東西？', explain: '「像獵豹一樣快」是譬喻。' },
            { id: 'rh-si-p3', options: ['籃框高得像掛在天上。', '籃框很高。', '籃球是橘色的。'], clue: '提示：哪一句用「像」把籃框比成別的東西？', explain: '「高得像掛在天上」是譬喻。' },
            { id: 'rh-si-p4', options: ['教練的哨聲，像小鳥在叫。', '教練吹了哨子。', '大家開始練球。'], clue: '提示：哪一句把哨聲比成另一樣東西？', explain: '「像小鳥在叫」是譬喻：把哨聲比成鳥叫。' },
            { id: 'rh-si-p5', options: ['汗水像下雨一樣滴下來。', '他流了很多汗。', '他打球打了很久。', '汗水在跟他說辛苦了。'], clue: '提示：哪一句用「像」把汗水比成別的東西？', explain: '「像下雨一樣滴下來」是譬喻。' },
            { id: 'rh-si-p6', options: ['球衣被汗弄溼了，好像剛從水裡撈起來。', '球衣溼了。', '他換了一件球衣。', '球衣在唱歌。'], clue: '提示：哪一句把溼溼的球衣比成另一樣東西？', explain: '「好像剛從水裡撈起來」是譬喻。' }
          ] },
        { key: 'personify', name: '擬人', meaning: '把東西或動物當成人來寫，讓它們會說話、會笑、會做人做的事。', example: '課文說球一開始「不好好的待在我的手下」，後來又會「跳出迷人的舞姿」，好像人一樣。',
          show: { sentence: '籃球在地上跳來跳去，一點也不聽話。', mark: ['一點也不聽話'] },
          yesno: [
            { id: 'rh-pe-y1', sentence: '球框張開雙手，等著接住我的球。', answer: true, mark: ['張開雙手'], clue: '提示：這句話有沒有把球框寫得像人一樣？', explain: '是擬人：球框像人一樣張開雙手。' },
            { id: 'rh-pe-y2', sentence: '球掉進了球框。', answer: false, clue: '提示：這句話裡的球和球框，有沒有做人做的事？', explain: '不是擬人：這句話只是說球進了。' }
          ],
          pick: [
            { id: 'rh-pe-p1', mark: ['陪我跑過'], options: ['球鞋陪我跑過了好多場比賽。', '我的球鞋很舊了。'], clue: '提示：哪一句把球鞋寫得像人一樣？', explain: '「球鞋陪我跑過了好多場比賽」是擬人。' },
            { id: 'rh-pe-p2', mark: ['偷偷看著我們'], options: ['月亮在天上偷偷看著我們練球。', '月亮出來了。'], clue: '提示：哪一句的月亮像人一樣會看？', explain: '「月亮偷偷看著我們」是擬人。' },
            { id: 'rh-pe-p3', mark: ['推著我'], options: ['風輕輕的推著我往前跑。', '今天的風很大。', '我跑得很快。'], clue: '提示：哪一句的風像人一樣會推？', explain: '「風輕輕的推著我」是擬人。' },
            { id: 'rh-pe-p4', mark: ['累了', '躺在地上休息'], options: ['籃球累了，躺在地上休息。', '籃球掉在地上。', '籃球是圓的。'], clue: '提示：哪一句的籃球像人一樣會累？', explain: '「籃球累了，躺在地上休息」是擬人。' },
            { id: 'rh-pe-p5', mark: ['請我喝口水'], options: ['水壺張開嘴巴，請我喝口水。', '我喝了一口水。', '水壺裡裝滿了水。', '水很冰。'], clue: '提示：哪一句的水壺像人一樣會說話？', explain: '「水壺請我喝口水」是擬人。' },
            { id: 'rh-pe-p6', mark: ['陪我們練到天黑'], options: ['路燈守在球場旁邊，陪我們練到天黑。', '球場旁邊有路燈。', '天黑了。', '路燈像星星。'], clue: '提示：哪一句的路燈像人一樣會陪伴？', explain: '「路燈陪我們練到天黑」是擬人。' }
          ] },
        { key: 'sound', name: '狀聲詞', meaning: '把聽到的聲音寫出來，例如咚咚咚、嘩啦嘩啦，讓人好像聽到了聲音。', example: '課文開頭的「刷──」，就是籃球穿過籃網的聲音。',
          show: { sentence: '籃球咚咚咚的在地上彈。', mark: ['咚咚咚'] },
          yesno: [
            { id: 'rh-so-y1', sentence: '哨子嗶的一聲響了。', answer: true, mark: ['嗶'], clue: '提示：這句話有沒有把聽到的聲音寫出來？', explain: '是狀聲詞：「嗶」是哨子的聲音。' },
            { id: 'rh-so-y2', sentence: '教練吹了哨子。', answer: false, clue: '提示：這句話有沒有寫出聽到的聲音？', explain: '不是狀聲詞：這句話沒有寫出聲音。' }
          ],
          pick: [
            { id: 'rh-so-p1', mark: ['砰'], options: ['大門砰的一聲關上了。', '大門關上了。'], clue: '提示：哪一句把關門的聲音寫出來了？', explain: '「砰」是狀聲詞：寫出關門的聲音。' },
            { id: 'rh-so-p2', mark: ['啪啪啪'], options: ['觀眾啪啪啪的拍手。', '觀眾在拍手。'], clue: '提示：哪一句寫出了拍手的聲音？', explain: '「啪啪啪」是狀聲詞：寫出拍手的聲音。' },
            { id: 'rh-so-p3', mark: ['咕嚕咕嚕'], options: ['肚子咕嚕咕嚕的叫。', '我肚子餓了。', '我想吃東西。'], clue: '提示：哪一句寫出了肚子餓的聲音？', explain: '「咕嚕咕嚕」是狀聲詞。' },
            { id: 'rh-so-p4', mark: ['吱'], options: ['球鞋在地上吱的一聲停住。', '我穿了新球鞋。', '球鞋是白色的。'], clue: '提示：哪一句寫出了鞋子摩擦地板的聲音？', explain: '「吱」是狀聲詞：寫出鞋子停住的聲音。' },
            { id: 'rh-so-p5', mark: ['滴滴答答'], options: ['雨滴滴答答的打在屋頂上。', '外面下雨了。', '雨像珠子。', '雨在敲門。'], clue: '提示：哪一句寫出了下雨的聲音？', explain: '「滴滴答答」是狀聲詞：寫出雨的聲音。' },
            { id: 'rh-so-p6', mark: ['嘩啦嘩啦'], options: ['水龍頭嘩啦嘩啦的流著水。', '水龍頭開著。', '水很冰。', '水像一條小河。'], clue: '提示：哪一句寫出了水流的聲音？', explain: '「嘩啦嘩啦」是狀聲詞：寫出水流的聲音。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '那顆籃球圓得像一顆大橘子。', answer: '譬喻', clue: '提示：這句話有沒有把籃球比成別的東西？', explain: '答案是「譬喻」：把籃球比成橘子。' },
        { id: 'rh2', sentence: '他的聲音大得像打雷。', answer: '譬喻', clue: '提示：這句話有沒有用「像」？', explain: '答案是「譬喻」：把聲音比成打雷。' },
        { id: 'rh3', sentence: '書本在書桌上睡著了。', answer: '擬人', mark: ['睡著了'], clue: '提示：書本會不會像人一樣做事？', explain: '答案是「擬人」：書本像人一樣會睡覺。' },
        { id: 'rh4', sentence: '小草向我點頭說早安。', answer: '擬人', mark: ['點頭說早安'], clue: '提示：這句話有沒有把小草寫得像人？', explain: '答案是「擬人」：小草像人一樣會點頭說早安。' },
        { id: 'rh5', sentence: '鬧鐘鈴鈴鈴的響了。', answer: '狀聲詞', mark: ['鈴鈴鈴'], clue: '提示：這句話有沒有寫出聽到的聲音？', explain: '答案是「狀聲詞」：「鈴鈴鈴」是鬧鐘的聲音。' },
        { id: 'rh6', sentence: '小狗汪汪的叫著迎接我。', answer: '狀聲詞', mark: ['汪汪'], clue: '提示：找找看，有沒有把聲音寫出來？', explain: '答案是「狀聲詞」：「汪汪」是小狗的叫聲。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L03 = d; }
})(this);
