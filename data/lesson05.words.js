/* 第 5 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 人事時地物：選項第一個是答案；paras 是提示要用到的段落 */
    wh: [
      { id: 'wh-ren', key: '人', options: ['海倫．凱勒和她的朋友', '海倫．凱勒和她的小狗', '一位老師和學生', '一位醫生和病人'], paras: [1, 3], why: '這一課是海倫．凱勒寫的，她還說到一位剛從森林散步回來的朋友。' },
      { id: 'wh-shi', key: '事', options: ['用手感受世界', '到森林去露營', '參加跑步比賽', '學開車去旅行'], paras: [4, 6], why: '海倫．凱勒看不見也聽不見，她用手去摸，感受到很多有趣的事物，也希望能看得見。' },
      { id: 'wh-time', key: '時', options: ['小時候生病以後', '剛出生的那一天', '去年的暑假', '昨天晚上'], paras: [1], why: '名人小傳說她小時候生了病，從那以後就看不見、也聽不見了。' },
      { id: 'wh-di', key: '地', options: ['森林、草地和花園', '百貨公司和電影院', '游泳池和籃球場', '機場和火車站'], paras: [3, 4], why: '朋友去森林散步；作者摸樹枝、小樹，走到草地上，用手感受大自然。' },
      { id: 'wh-wu', key: '物', options: ['樹枝、小鳥、流水和草地', '電腦、手機和電視', '汽車、火車和飛機', '書包、鉛筆和課本'], paras: [4], why: '作者用手摸到樹枝上的花苞、感受小鳥、流水和草地。' }
    ],
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qc: 'extract', qe: 'extract', qf: 'extract', qb: 'infer', qd: 'infer', qg: 'infer', qh: 'interpret', qi: 'interpret',
      qj: 'evaluate', k1: 'interpret', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qh: { think: ['作者自己看不見，卻能用手發現好多有趣的事；她的朋友呢？', '這個問句是真的在問問題，還是想提醒大家一件事？'], why: '作者看不見都能發現那麼多美好，看得見的人卻說沒看到什麼，她覺得很可惜。這個問句是在提醒大家：看得見是很幸福的事，要好好珍惜、用心去看。' },
      qi: { think: ['名人小傳說她小時候生病以後，眼睛怎麼樣了？', '「假如」是真的發生了，還是在想像？'], why: '海倫．凱勒一直都看不見。「假如」是想像的意思，她在想：如果能看見三天，她要好好看看這個世界。所以她不是真的看見了。' },
      qj: { think: ['作者沒有視力，還能用手找到哪些快樂？', '看得見、聽得見的我們，應該怎麼對待自己有的東西？'], why: '作者看不見也聽不見，卻用心感受世界，找到很多快樂。她想告訴我們：要珍惜自己擁有的，用心去看、去聽、去感受。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['用手摸一摸，就知道是軟的還是硬的。', '用耳朵聽，就知道是誰在說話。'], bad: ['把眼睛張開來看就好了。', '什麼都不做，坐著發呆。'], why: '閉上眼睛的時候，還可以用手摸、用耳朵聽、用鼻子聞。題目說要閉上眼睛，所以不能張開眼睛看；坐著發呆，也沒辦法知道身邊有什麼。' },
      k2: { good: ['陪他走路，提醒他前面有樓梯。', '把黑板上的字念給他聽。'], bad: ['偷偷把他的東西藏起來。', '在旁邊學他走路，取笑他。'], why: '看不見的同學需要有人提醒、幫忙念字。藏他的東西、取笑他，都會讓他很難過，也很危險。' }
    },
    hanzi: [
      { id: 'h-凱', combo: { layout: 'lr', parts: [['豈', 's', ''], ['几', 'm', '小桌子']] }, char: '凱', zhuyin: 'ㄎㄞˇ', radical: '几', strokes: 12, words: ['凱勒', '凱旋'], say: '凱，凱旋的凱', cloze: '＿旋', img: 'trophy-team.png', options: ['凱', '豈', '剴', '鎧'], clue: '這個字的右邊是「几」。', explain: '答案是「凱」，右邊是「几」；「豈」少了「几」，「剴」的右邊是立刀旁。', parts: ['豈', '几'], story: '很久以前，軍隊打了勝仗回來，大家會奏樂慶祝，那時的音樂就叫「凱」。贏了比賽開開心心的回來，就是「凱旋」。', sentence: '選手們拿到冠軍，凱旋歸來。', build: { layout: 'lr', show: ['豈', '？'], answer: '几', options: ['几', '刂', '欠', '力'], clue: '想一想：右邊像一張小小的桌子。' } },
      { id: 'h-勒', combo: { layout: 'lr', parts: [['革', 'm', '皮革'], ['力', 's', '']] }, char: '勒', zhuyin: 'ㄌㄜˋ', radical: '力', strokes: 11, words: ['凱勒', '勒緊'], say: '勒，勒緊的勒', cloze: '凱＿', img: 'belt.png', options: ['勒', '勤', '靴', '勸'], clue: '這個字的左邊是「革」。', explain: '答案是「勒」，左邊是「革」；「勤」的左邊是「堇」，「靴」的右邊是「化」。', parts: ['革', '力'], story: '左邊的「革」是皮做的帶子，右邊是「力」。用皮帶使勁拉緊，就是「勒」。', sentence: '褲子太鬆了，要用皮帶勒緊。', build: { layout: 'lr', show: ['革', '？'], answer: '力', options: ['力', '刀', '又', '寸'], clue: '想一想：要使出很大的勁才能拉緊，右邊放什麼？' } },
      { id: 'h-業', combo: { type: '象形字', pict: '很久以前的「業」，像掛樂器的木架子，上面有很多鋸齒。後來用來說做的事情、讀的功課。' }, char: '業', zhuyin: 'ㄧㄝˋ', radical: '木', strokes: 13, words: ['學業', '作業'], say: '業，作業的業', cloze: '作＿', img: 'homework.png', options: ['業', '叢', '葉', '僕'], clue: '這個字的下面是「木」，上面有很多短短的豎和橫。', explain: '答案是「業」；「叢」是草叢的叢，「葉」是樹葉的葉。', parts: ['業'], story: '「業」像一個掛樂器的木架子。後來「業」用來說要做的事情，像「作業」、「學業」。', sentence: '我寫完作業才去玩。' },
      { id: 'h-勵', combo: { layout: 'lr', parts: [['厲', 's', ''], ['力', 'm', '力氣']] }, char: '勵', zhuyin: 'ㄌㄧˋ', radical: '力', strokes: 17, words: ['勵志', '鼓勵'], say: '勵，鼓勵的勵', cloze: '鼓＿', img: 'cheer-up.png', options: ['勵', '厲', '礪', '蠣'], clue: '這個字的左邊是「厲」。', explain: '答案是「勵」，右邊多了「力」；「厲」是嚴厲的厲，沒有力。', parts: ['厲', '力'], story: '左邊的「厲」念起來像「勵」，右邊是「力」。給別人力量、讓他更想努力，就是「鼓勵」。', sentence: '老師常常鼓勵我們多看書。', build: { layout: 'lr', show: ['厲', '？'], answer: '力', options: ['力', '刀', '石', '虫'], clue: '想一想：鼓勵就是給人使勁的勇氣，右邊放什麼？' } },
      { id: 'h-寧', combo: { type: '會意字', pict: '上面是屋頂，屋子裡有心、有碗。有房子住、有飯吃，心就安定了，所以「寧」是安靜、平安的意思。' }, char: '寧', zhuyin: 'ㄋㄧㄥˊ', radical: '宀', strokes: 14, words: ['寧靜', '安寧'], say: '寧，安寧的寧', cloze: '安＿', img: 'quiet-lake.png', options: ['寧', '檸', '嚀', '濘'], clue: '這個字的上面是寶蓋頭。', explain: '答案是「寧」；「檸」是檸檬的檸，左邊是木字旁；「嚀」是叮嚀的嚀，左邊是口字旁。', parts: ['宀', '心', '皿', '丁'], story: '屋頂下面有心、有碗。有房子住、有飯吃，心裡就很安定，所以「寧」是安靜、平安。', sentence: '夜晚的湖邊非常寧靜。' },
      { id: 'h-視', combo: { layout: 'lr', parts: [['礻', 's', ''], ['見', 'm', '看見']] }, char: '視', zhuyin: 'ㄕˋ', radical: '見', strokes: 12, words: ['視力', '電視'], say: '視，電視的視', cloze: '電＿', img: 'tv.png', options: ['視', '現', '規', '覺'], clue: '這個字的左邊是示字旁。', explain: '答案是「視」，左邊是示字旁；「現」的左邊是玉字旁，「規」的左邊是「夫」。', parts: ['礻', '見'], story: '左邊的「示」念起來像「視」，右邊的「見」是看見。用眼睛仔細看，就是「視」。', sentence: '我們一家人一起看電視。', build: { layout: 'lr', show: ['礻', '？'], answer: '見', options: ['見', '貝', '頁', '月'], clue: '想一想：這個字和眼睛看東西有關。' } },
      { id: 'h-注', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['主', 's', '']] }, char: '注', zhuyin: 'ㄓㄨˋ', radical: '水', strokes: 8, words: ['注意', '注音'], say: '注，注音的注', cloze: '＿音', img: 'zhuyin-card.png', options: ['注', '住', '柱', '往'], clue: '這個字的右邊是「主」，左邊和水有關。', explain: '答案是「注」，左邊是三點水；「住」的左邊是單人旁，「柱」的左邊是木字旁。', parts: ['氵', '主'], story: '左邊是水，右邊的「主」念起來像「注」。把水倒進去叫「注」；把心思放進去，就是「注意」。', sentence: '我會用注音拼出不認識的字。', build: { layout: 'lr', show: ['？', '主'], answer: '氵', options: ['氵', '亻', '木', '彳'], clue: '想一想：原本是把水倒進去的意思。' } },
      { id: 'h-憑', combo: { layout: 'tb', parts: [['馮', 's', ''], ['心', 'm', '心裡']] }, char: '憑', zhuyin: 'ㄆㄧㄥˊ', radical: '心', strokes: 16, words: ['單憑', '憑著'], say: '憑，憑著的憑', cloze: '＿著', img: 'touch-feel.png', options: ['憑', '馮', '慿', '驚'], clue: '這個字的上面是「馮」。', explain: '答案是「憑」，下面有「心」；「馮」沒有心，「驚」的下面是「馬」。', parts: ['馮', '心'], story: '上面的「馮」念起來像「憑」，下面是「心」。心裡靠著、相信一樣東西，就是「憑」。', sentence: '他憑著自己的努力學會了游泳。', build: { layout: 'tb', show: ['馮', '？'], answer: '心', options: ['心', '木', '灬', '土'], clue: '想一想：靠著、相信，是胸口裡面想的事。' } },
      { id: 'h-蓓', combo: { layout: 'tb', parts: [['艹', 'm', '草'], ['倍', 's', '']] }, char: '蓓', zhuyin: 'ㄅㄟˋ', radical: '艸', strokes: 12, words: ['蓓蕾'], say: '蓓，蓓蕾的蓓', cloze: '＿蕾', img: 'bud.png', options: ['蓓', '倍', '培', '陪'], clue: '這個字的下面，是加倍的「倍」。', explain: '答案是「蓓」，上面有草字頭；「倍」沒有草字頭，「培」的左邊是土字旁。', parts: ['艹', '倍'], story: '上面是草字頭，和植物有關；下面的「倍」念起來像「蓓」。還沒開的花苞，就叫「蓓蕾」。', sentence: '樹枝上長出了小小的蓓蕾。', build: { layout: 'tb', show: ['？', '倍'], answer: '艹', options: ['艹', '竹', '雨', '山'], clue: '想一想：花苞是植物，上面放什麼？' } },
      { id: 'h-蕾', combo: { layout: 'tb', parts: [['艹', 'm', '草'], ['雷', 's', '']] }, char: '蕾', zhuyin: 'ㄌㄟˇ', radical: '艸', strokes: 17, words: ['蓓蕾', '花蕾'], say: '蕾，花蕾的蕾', cloze: '花＿', img: 'rose-bud.png', options: ['蕾', '雷', '擂', '儡'], clue: '這個字的下面，是打雷的「雷」。', explain: '答案是「蕾」，上面有草字頭；「雷」是打雷的雷，沒有草字頭。', parts: ['艹', '雷'], story: '上面是草字頭，下面的「雷」念起來像「蕾」。花還包著、還沒打開的樣子，就是「花蕾」。', sentence: '玫瑰的花蕾慢慢張開了。', build: { layout: 'tb', show: ['？', '雷'], answer: '艹', options: ['艹', '雨', '竹', '宀'], clue: '想一想：花苞長在植物上，上面放什麼？' } },
      { id: 'h-何', combo: { layout: 'lr', parts: [['亻', 'm', '人'], ['可', 's', '']] }, char: '何', zhuyin: 'ㄏㄜˊ', radical: '人', strokes: 7, words: ['任何', '如何'], say: '何，如何的何', cloze: '如＿', img: 'think-question.png', options: ['何', '河', '荷', '可'], clue: '這個字的左邊，是單人旁。', explain: '答案是「何」，左邊是單人旁；「河」的左邊是三點水，「荷」有草字頭。', parts: ['亻', '可'], story: '左邊是人，右邊的「可」念起來像「何」。問「怎麼樣」、「哪一個」的時候，就會用到「何」。', sentence: '這題要如何算才對？', build: { layout: 'lr', show: ['？', '可'], answer: '亻', options: ['亻', '氵', '扌', '口'], clue: '想一想：「河」的左邊是水，這個字的左邊和人有關。' } },
      { id: 'h-毯', combo: { type: '形聲字', pict: '左下角是「毛」，和毛有關；右邊的「炎」念起來有點像「毯」。用毛做的厚布，就是「毯子」。' }, char: '毯', zhuyin: 'ㄊㄢˇ', radical: '毛', strokes: 12, words: ['地毯', '毛毯'], say: '毯，毛毯的毯', cloze: '毛＿', img: 'blanket.png', options: ['毯', '談', '淡', '痰'], clue: '這個字的左下角，有一個「毛」。', explain: '答案是「毯」，裡面有「毛」；「談」的左邊是言字旁，「淡」的左邊是三點水。', parts: ['毛', '炎'], story: '「毛」和毛有關，「炎」念起來有點像「毯」。用毛織成、軟軟厚厚的布，就是「毯子」。', sentence: '冬天蓋上毛毯，好溫暖。' },
      { id: 'h-適', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路有關；裡面的「啇」念起來有點像「適」。走到剛剛好的地方，就是「適合」。' }, char: '適', zhuyin: 'ㄕˋ', radical: '辵', strokes: 15, words: ['舒適', '適合'], say: '適，適合的適', cloze: '＿合', img: 'shoes-fit.png', options: ['適', '滴', '敵', '摘'], clue: '這個字有辵字旁。', explain: '答案是「適」，有辵字旁；「滴」的左邊是三點水，「摘」的左邊是提手旁。', parts: ['辶', '啇'], story: '辵字旁和走路有關，裡面念起來有點像「適」。走到剛剛好、很舒服的地方，就是「適合」、「舒適」。', sentence: '這雙鞋很適合跑步。' },
      { id: 'h-繽', combo: { layout: 'lr', parts: [['糸', 'm', '絲線'], ['賓', 's', '']] }, char: '繽', zhuyin: 'ㄅㄧㄣ', radical: '糸', strokes: 20, words: ['五彩繽紛', '繽紛'], say: '繽，繽紛的繽', cloze: '＿紛', img: 'colorful-garden.png', options: ['繽', '濱', '賓', '檳'], clue: '這個字的右邊是「賓」，左邊和絲線有關。', explain: '答案是「繽」，左邊是絲線；「濱」的左邊是三點水，「賓」沒有絲線。', parts: ['糸', '賓'], story: '左邊是絲線，右邊的「賓」念起來像「繽」。好多種顏色的線放在一起，又多又熱鬧，就是「繽紛」。', sentence: '運動會上，大家的衣服色彩繽紛。', build: { layout: 'lr', show: ['？', '賓'], answer: '糸', options: ['糸', '氵', '亻', '言'], clue: '想一想：好多顏色的線纏在一起。' } },
      { id: 'h-盡', combo: { type: '會意字', pict: '很久以前的「盡」，像一隻手拿著刷子，把碗裡面刷得乾乾淨淨。碗裡的東西都沒了，就是「盡」。' }, char: '盡', zhuyin: 'ㄐㄧㄣˋ', radical: '皿', strokes: 14, words: ['盡力', '盡情'], say: '盡，盡情的盡', cloze: '＿情', img: 'try-hard.png', options: ['盡', '畫', '晝', '書'], clue: '這個字的下面是「皿」。', explain: '答案是「盡」，下面是「皿」；「畫」的下面是「田」，「書」的下面是「曰」。', parts: ['聿', '灬', '皿'], story: '「盡」像手拿刷子把碗刷乾淨，碗裡什麼都不剩。用完全部、全部拿出來，就是「盡」，像「盡力」。', sentence: '放暑假了，我要盡情的玩。' }
    ],
    vocab: [
      { id: 'v-海倫凱勒', word: '海倫．凱勒', meaning: '美國的作家，小時候生病以後看不見也聽不見，卻努力讀完了大學。', example: '＿＿＿＿＿看不見也聽不見，卻用手感受這個世界。', img: 'helen.png', options: ['海倫．凱勒', '學業', '蓓蕾', '地毯'] },
      { id: 'v-失明', cloze: true, clozeOptions: ['失明', '失眠', '失望', '失火'], word: '失明', meaning: '眼睛看不見了。', example: '他的眼睛受了傷，差一點就＿＿了。', img: 'blindfold.png', options: ['失明', '視力', '寧靜', '舒適'] },
      { id: 'v-學業', cloze: true, clozeOptions: ['學業', '遊戲', '零食', '玩具'], word: '學業', meaning: '讀書要完成的功課和成績。', example: '哥哥一邊練球，一邊也顧好＿＿。', img: 'graduate.png', options: ['學業', '勵志', '盡力', '任何'] },
      { id: 'v-勵志', cloze: true, clozeOptions: ['勵志', '無聊', '嚇人', '好笑'], word: '勵志', meaning: '讓人變得更有勇氣、更想努力。', example: '這本書講的是一個＿＿的故事，讓我想要更努力。', img: 'climb-up.png', options: ['勵志', '學業', '地毯', '觸摸'] },
      { id: 'v-寧靜', cloze: true, clozeOptions: ['寧靜', '吵鬧', '擁擠', '熱鬧'], word: '寧靜', meaning: '一點聲音也沒有，讓人心裡很放鬆。', example: '清晨的湖邊非常＿＿，大家都還在睡覺。', img: 'quiet-lake.png', options: ['寧靜', '舒適', '失明', '蓓蕾'] },
      { id: 'v-視力', cloze: true, clozeOptions: ['視力', '聲音', '味道', '胃口'], word: '視力', meaning: '眼睛看東西清不清楚的本領。', example: '玩太久手機，＿＿會變差。', img: 'eye-test.png', options: ['視力', '注意', '單憑', '盡力'] },
      { id: 'v-注意', cloze: true, clozeOptions: ['注意', '忘記', '不理', '亂跑'], word: '注意', meaning: '把心放在一件事情上，仔細的看或聽。', example: '過馬路的時候，要＿＿左右的來車。', img: 'look-closely.png', options: ['注意', '觸摸', '勵志', '地毯'] },
      { id: 'v-單憑', cloze: true, clozeOptions: ['單憑', '全部', '很多', '一起'], word: '單憑', meaning: '只靠著。', example: '＿＿一張舊地圖，我們就找到了外婆的老家。', img: 'touch-feel.png', options: ['單憑', '任何', '寧靜', '學業'] },
      { id: 'v-觸摸', cloze: true, clozeOptions: ['觸摸', '聞到', '聽見', '看見'], word: '觸摸', meaning: '用手輕輕的去碰。', example: '博物館裡的展品，不可以隨便＿＿。', img: 'touch-feel.png', options: ['觸摸', '注意', '五彩繽紛', '盡力'] },
      { id: 'v-蓓蕾', cloze: true, clozeOptions: ['蓓蕾', '落葉', '樹根', '果實'], word: '蓓蕾', meaning: '還沒有開的花，像一個小包包。', example: '玫瑰花的＿＿，明天就要開了。', img: 'bud.png', options: ['蓓蕾', '地毯', '視力', '勵志'] },
      { id: 'v-任何', cloze: true, clozeOptions: ['任何', '一點', '只有', '少數'], word: '任何', meaning: '不管是哪一個。', example: '你有＿＿問題，都可以來問我。', img: 'many-choices.png', options: ['任何', '單憑', '舒適', '失明'] },
      { id: 'v-地毯', cloze: true, clozeOptions: ['地毯', '窗簾', '枕頭', '桌巾'], word: '地毯', meaning: '鋪在腳下，軟軟厚厚的大塊布。', example: '客廳鋪了一塊軟軟的＿＿，我們坐在上面玩積木。', img: 'carpet.png', options: ['地毯', '蓓蕾', '注意', '學業'] },
      { id: 'v-舒適', cloze: true, clozeOptions: ['舒適', '難受', '擁擠', '痛苦'], word: '舒適', meaning: '身體覺得很放鬆、很自在。', example: '這張沙發坐起來好＿＿。', img: 'lie-grass.png', options: ['舒適', '寧靜', '任何', '觸摸'] },
      { id: 'v-五彩繽紛', cloze: true, clozeOptions: ['五彩繽紛', '黑白分明', '灰暗無光', '一片漆黑'], word: '五彩繽紛', meaning: '顏色很多，又鮮豔又漂亮。', example: '運動會的看臺上，到處都是＿＿＿＿的加油旗。', img: 'colorful-garden.png', options: ['五彩繽紛', '勵志', '視力', '單憑'] },
      { id: 'v-盡力', cloze: true, clozeOptions: ['盡力', '偷懶', '放棄', '亂來'], word: '盡力', meaning: '把全部的本事都拿出來，好好去做。', example: '比賽輸了沒關係，只要＿＿就好。', img: 'try-hard.png', options: ['盡力', '注意', '失明', '地毯'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-凱', char: '凱', img: 'trophy-team.png', charMeaning: '打勝仗、贏了比賽的歡樂。', word: '凱旋', meaning: '比賽贏了，開開心心的回來。', example: '球隊拿到冠軍，＿＿回到學校。', options: ['凱旋', '勒緊', '鼓勵', '毛毯'] },
      { id: 'cw-勒', char: '勒', img: 'belt.png', charMeaning: '用帶子使勁拉緊。', word: '勒緊', meaning: '用繩子或帶子用力綁緊。', example: '褲子太鬆了，要用皮帶＿＿。', options: ['勒緊', '作業', '注音', '如何'] },
      { id: 'cw-業', char: '業', img: 'homework.png', charMeaning: '要做的事情、功課。', word: '作業', meaning: '老師要我們回家寫的功課。', example: '我先寫完＿＿，再去玩。', options: ['作業', '電視', '盡情', '凱旋'] },
      { id: 'cw-勵', char: '勵', img: 'cheer-up.png', charMeaning: '給人力量，讓他更想努力。', word: '鼓勵', meaning: '說好話、給人勇氣，讓他更想努力。', example: '比賽前，媽媽一直＿＿我。', options: ['鼓勵', '安寧', '適合', '勒緊'] },
      { id: 'cw-寧', char: '寧', img: 'cw-night-quiet.png', charMeaning: '安靜、平安。', word: '安寧', meaning: '平安、安靜，沒有吵鬧。', example: '大家都睡著了，夜晚一片＿＿。', options: ['安寧', '作業', '花蕾', '憑著'] },
      { id: 'cw-視', char: '視', img: 'tv.png', charMeaning: '用眼睛看。', word: '電視', meaning: '可以看節目、看卡通的機器。', example: '吃完晚飯，我們一起看＿＿。', options: ['電視', '毛毯', '鼓勵', '繽紛'] },
      { id: 'cw-注', char: '注', img: 'zhuyin-card.png', charMeaning: '把水或心思放進去。', word: '注音', meaning: '用ㄅㄆㄇ標出字怎麼念。', example: '不會念的字，可以看旁邊的＿＿。', options: ['注音', '如何', '凱旋', '盡情'] },
      { id: 'cw-憑', char: '憑', img: 'cw-swim-learn.png', charMeaning: '靠著。', word: '憑著', meaning: '靠著一樣東西或一份力量。', example: '他＿＿自己的努力，終於學會了游泳。', options: ['憑著', '電視', '勒緊', '安寧'] },
      { id: 'cw-蓓', char: '蓓', img: 'bud.png', charMeaning: '還沒開的花。', word: '蓓蕾', meaning: '還沒打開的花苞。', example: '春天到了，樹上冒出一個個小＿＿。', options: ['蓓蕾', '適合', '注音', '作業'] },
      { id: 'cw-蕾', char: '蕾', img: 'rose-bud.png', charMeaning: '包起來、還沒開的花。', word: '花蕾', meaning: '花還沒開之前，包起來的樣子。', example: '玫瑰的＿＿慢慢打開了。', options: ['花蕾', '鼓勵', '毛毯', '憑著'] },
      { id: 'cw-何', char: '何', img: 'think-question.png', charMeaning: '怎麼樣、哪一個。', word: '如何', meaning: '怎麼樣、用什麼方法。', example: '你知道這一題要＿＿算嗎？', options: ['如何', '繽紛', '電視', '花蕾'] },
      { id: 'cw-毯', char: '毯', img: 'blanket.png', charMeaning: '用毛做成的厚布。', word: '毛毯', meaning: '蓋在身上很溫暖的厚布。', example: '冬天蓋上＿＿，好暖和。', options: ['毛毯', '凱旋', '如何', '作業'] },
      { id: 'cw-適', char: '適', img: 'shoes-fit.png', charMeaning: '剛剛好；舒服。', word: '適合', meaning: '剛剛好、很配。', example: '這件外套很＿＿你穿。', options: ['適合', '安寧', '注音', '蓓蕾'] },
      { id: 'cw-繽', char: '繽', img: 'colorful-garden.png', charMeaning: '顏色很多、很熱鬧。', word: '繽紛', meaning: '顏色很多，好看又熱鬧。', example: '校慶的氣球色彩＿＿，好漂亮。', options: ['繽紛', '勒緊', '電視', '如何'] },
      { id: 'cw-盡', char: '盡', img: 'cw-summer-play.png', charMeaning: '全部用完；全部拿出來。', word: '盡情', meaning: '想怎麼玩就怎麼玩，玩得很痛快。', example: '放暑假了，我要＿＿的玩。', options: ['盡情', '鼓勵', '花蕾', '適合'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-懸崖勒馬', situationImg: 'id-stop-draw.png', idiom: '懸崖勒馬', char: '勒', meaning: '發現自己快要做錯事了，趕快停下來。', example: '他差一點就要偷看同學的考卷，幸好懸崖勒馬，自己認真寫完。', situation: '弟弟拿起彩色筆，正要在牆上亂塗，想起媽媽說過不可以，馬上把筆放下。',
        fill: { options: ['他正要闖紅燈，想起老師的話，趕快＿＿＿＿停下腳步。', '他每天都按時寫功課，真是＿＿＿＿。'], clue: '提示：哪一句是快做錯事的時候，趕快停下來？', explain: '第一句用得對：快要闖紅燈時趕快停下來。每天按時寫功課，本來就沒做錯事。' } },
      { id: 'i-兢兢業業', situationImg: 'id-careful-work.png', idiom: '兢兢業業', char: '業', meaning: '做事非常小心、認真負責。', example: '警衛伯伯兢兢業業的守著校門，保護大家的安全。', situation: '圖書館的阿姨每天把每一本書都放回正確的位置，從來沒有出錯。',
        fill: { options: ['值日生＿＿＿＿的把教室打掃乾淨。', '他上課一直玩橡皮擦，真是＿＿＿＿。'], clue: '提示：哪一句是做事很小心、很認真？', explain: '第一句用得對：值日生認真打掃。上課玩橡皮擦，一點也不認真。' } },
      { id: 'i-雞犬不寧', situationImg: 'id-noisy-home.png', idiom: '雞犬不寧', char: '寧', meaning: '被吵得每個人都沒辦法安靜休息。', example: '弟弟和妹妹吵了一整個下午，家裡雞犬不寧。', situation: '隔壁在裝修房子，一直傳來敲打的聲音，全家人都沒辦法好好休息。',
        fill: { options: ['樓上整晚開派對，吵得大家＿＿＿＿。', '圖書館裡一點聲音也沒有，真是＿＿＿＿。'], clue: '提示：哪一句是吵得大家不能休息？', explain: '第一句用得對：開派對吵得大家不能休息。圖書館很安靜，剛好相反。' } },
      { id: 'i-一視同仁', situationImg: 'id-fair-share.png', idiom: '一視同仁', char: '視', meaning: '對待每個人都一樣，不偏心。', example: '老師對每一位同學都一視同仁。', situation: '老師發點心的時候，每個同學都分到一樣多，不管是誰。',
        fill: { options: ['媽媽對我和弟弟＿＿＿＿，從來不偏心。', '他只對好朋友笑，對別人很兇，真是＿＿＿＿。'], clue: '提示：哪一句是對每個人都一樣好？', explain: '第一句用得對：媽媽對兩個孩子一樣好。只對好朋友好，就是偏心。' } },
      { id: 'i-盡善盡美', situationImg: 'id-perfect-show.png', idiom: '盡善盡美', char: '盡', meaning: '好到不能再好，非常完美。', example: '大家把園遊會的攤位布置得盡善盡美。', situation: '姐姐參加鋼琴比賽，從頭到尾一個音都沒彈錯，評審都說太完美了。',
        fill: { options: ['合唱團的表演＿＿＿＿，觀眾一直拍手。', '這幅圖畫得亂七八糟，真是＿＿＿＿。'], clue: '提示：哪一句是非常完美？', explain: '第一句用得對：表演好到觀眾一直拍手。畫得亂七八糟，一點也不完美。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-凱', char: '凱', wrong: '慨', sentence: '選手們拿到冠軍，凱旋歸來。', options: ['凱', '慨', '楷'], clue: '這裡是說贏了比賽開心的回來，想一想，哪一個字的右邊是「几」？', explain: '要改成「凱」。贏了回來是「凱旋」，右邊是「几」；「慨」是慷慨的慨。' },
      { id: 'fx-勒', char: '勒', wrong: '勤', sentence: '褲子太鬆了，要用皮帶勒緊。', options: ['勒', '勤', '靴'], clue: '這裡是說用帶子拉緊，想一想，哪一個字的左邊是「革」？', explain: '要改成「勒」。用帶子拉緊是「勒緊」，左邊是「革」；「勤」是勤勞的勤。' },
      { id: 'fx-業', char: '業', wrong: '葉', sentence: '我寫完作業才去玩。', options: ['業', '葉', '叢'], clue: '這裡說的是老師出的功課，跟樹葉沒有關係。', explain: '要改成「業」。老師出的功課是「作業」；「葉」是樹葉的葉。' },
      { id: 'fx-勵', char: '勵', wrong: '厲', sentence: '老師常常鼓勵我們多看書。', options: ['勵', '厲', '礪'], clue: '這裡是說給人勇氣，想一想，哪一個字的右邊有「力」？', explain: '要改成「勵」。給人勇氣是「鼓勵」，右邊有力；「厲」是嚴厲的厲。' },
      { id: 'fx-寧', char: '寧', wrong: '檸', sentence: '夜晚的湖邊非常寧靜。', options: ['寧', '檸', '嚀'], clue: '這裡是說很安靜，跟檸檬沒有關係。', explain: '要改成「寧」。很安靜是「寧靜」；「檸」是檸檬的檸，有木字旁。' },
      { id: 'fx-視', char: '視', wrong: '示', sentence: '我們一家人一起看電視。', options: ['視', '示', '是'], clue: '這裡說的是看節目的機器，想一想，哪一個字的右邊有「見」？', explain: '要改成「視」。看節目的機器是「電視」，右邊有「見」；「示」是表示的示。' },
      { id: 'fx-注', char: '注', wrong: '住', sentence: '我會用注音拼出不認識的字。', options: ['注', '住', '柱'], clue: '這裡是說標出字怎麼念的符號，想一想，哪一個字有三點水？', explain: '要改成「注」。標出念法的符號是「注音」，有三點水；「住」是居住的住。' },
      { id: 'fx-憑', char: '憑', wrong: '平', sentence: '他憑著自己的努力學會了游泳。', options: ['憑', '平', '瓶'], clue: '這裡是說靠著，想一想，哪一個字的下面有「心」？', explain: '要改成「憑」。靠著是「憑著」，下面有心；「平」是平安的平。' },
      { id: 'fx-蓓', char: '蓓', wrong: '倍', sentence: '樹枝上長出了小小的蓓蕾。', options: ['蓓', '倍', '培'], clue: '這裡說的是還沒開的花，想一想，哪一個字有草字頭？', explain: '要改成「蓓」。還沒開的花是「蓓蕾」，有草字頭；「倍」是加倍的倍。' },
      { id: 'fx-蕾', char: '蕾', wrong: '雷', sentence: '玫瑰的花蕾慢慢張開了。', options: ['蕾', '雷', '擂'], clue: '這裡說的是包起來的花苞，跟打雷沒有關係。', explain: '要改成「蕾」。花苞是「花蕾」，有草字頭；「雷」是打雷的雷。' },
      { id: 'fx-何', char: '何', wrong: '河', sentence: '這題要如何算才對？', options: ['何', '河', '荷'], clue: '這裡是說怎麼樣，跟河流沒有關係。', explain: '要改成「何」。怎麼樣是「如何」，左邊是單人旁；「河」是河流的河。' },
      { id: 'fx-毯', char: '毯', wrong: '談', sentence: '冬天蓋上毛毯，好溫暖。', options: ['毯', '談', '淡'], clue: '這裡說的是蓋在身上的厚布，跟說話沒有關係。', explain: '要改成「毯」。蓋的厚布是「毛毯」；「談」是談話的談。' },
      { id: 'fx-適', char: '適', wrong: '滴', sentence: '這雙鞋很適合跑步。', options: ['適', '滴', '敵'], clue: '這裡是說剛剛好、很配，想一想，哪一個字有辵字旁？', explain: '要改成「適」。剛剛好是「適合」，有辵字旁；「滴」是水滴的滴。' },
      { id: 'fx-繽', char: '繽', wrong: '濱', sentence: '運動會上，大家的衣服色彩繽紛。', options: ['繽', '濱', '賓'], clue: '這裡說的是顏色很多，想一想，哪一個字的左邊是絲線？', explain: '要改成「繽」。顏色很多是「繽紛」，左邊是絲線；「濱」是海濱的濱。' },
      { id: 'fx-盡', char: '盡', wrong: '晝', sentence: '放暑假了，我要盡情的玩。', options: ['盡', '晝', '畫'], clue: '這裡是說想玩就玩、玩得很痛快，跟白天沒有關係。', explain: '要改成「盡」。玩得很痛快是「盡情」，下面是「皿」；「晝」是白晝的晝。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿勞」是很努力、不偷懶。', sentence: '螞蟻每天搬食物，好＿勞。', frame: '＿勞', options: ['勤', '勒'], answer: '勤', clue: '提示：這個字的左邊是「堇」。', explain: '答案是「勤」；「勒」是勒緊的勒，左邊是「革」。' },
      { id: 's2', meaning: '「嚴＿」是很兇、很嚴格。', sentence: '教練說話好嚴＿，大家都不敢亂動。', frame: '嚴＿', options: ['厲', '勵'], answer: '厲', clue: '提示：這個字的右邊沒有「力」。', explain: '答案是「厲」；「勵」是鼓勵的勵，右邊有力。' },
      { id: 's3', meaning: '「＿檬」是很酸的黃色水果。', sentence: '夏天喝一杯＿檬汁，好涼快。', frame: '＿檬', options: ['檸', '寧'], answer: '檸', clue: '提示：這是一種水果，這個字的左邊是木字旁。', explain: '答案是「檸」；「寧」是寧靜的寧，沒有木字旁。' },
      { id: 's4', meaning: '「＿範」是先做給別人看，讓別人學。', sentence: '老師先＿範一次，再讓我們自己做。', frame: '＿範', options: ['示', '視'], answer: '示', clue: '想一想：這個字的右邊沒有「見」。', explain: '答案是「示」；「視」是電視的視，右邊有見。' },
      { id: 's5', meaning: '「＿在」是在某個地方生活。', sentence: '我家＿在學校旁邊。', frame: '＿在', options: ['住', '注'], answer: '住', clue: '提示：這個字的左邊是單人旁。', explain: '答案是「住」；「注」是注音的注，有三點水。' },
      { id: 's6', meaning: '「＿子」是撐住房子、又粗又直的東西。', sentence: '廟的前面有兩根紅色的＿子。', frame: '＿子', options: ['柱', '注'], answer: '柱', clue: '提示：這個字的左邊是木字旁。', explain: '答案是「柱」；「注」是注意的注，有三點水。' },
      { id: 's7', meaning: '「加＿」是變成原來的兩份那麼多。', sentence: '吃飽飯，力氣加＿！', frame: '加＿', options: ['倍', '蓓'], answer: '倍', clue: '提示：這個字的左邊是單人旁。', explain: '答案是「倍」；「蓓」是蓓蕾的蓓，有草字頭。' },
      { id: 's8', meaning: '「＿養」是好好照顧，讓它長大。', sentence: '我們在教室裡＿養小豆苗。', frame: '＿養', options: ['培', '蓓'], answer: '培', clue: '提示：這個字的左邊是土字旁。', explain: '答案是「培」；「蓓」是蓓蕾的蓓，有草字頭。' },
      { id: 's9', meaning: '「打＿」是天上轟隆轟隆的聲音。', sentence: '外面在打＿，弟弟嚇得躲進被子。', frame: '打＿', options: ['雷', '蕾'], answer: '雷', clue: '提示：這個字沒有草字頭。', explain: '答案是「雷」；「蕾」是花蕾的蕾，有草字頭。' },
      { id: 's10', meaning: '「＿花」是夏天開在池塘裡的大花。', sentence: '池塘裡的＿花開了。', frame: '＿花', options: ['荷', '何'], answer: '荷', clue: '提示：這個字有草字頭。', explain: '答案是「荷」；「何」是如何的何，左邊是單人旁。' },
      { id: 's11', meaning: '「＿話」是兩個人說話聊天。', sentence: '下課後，老師找我＿話。', frame: '＿話', options: ['談', '毯'], answer: '談', clue: '提示：這個字的左邊是言字旁。', explain: '答案是「談」；「毯」是毛毯的毯，裡面有毛。' },
      { id: 's12', meaning: '「水＿」是一小顆一小顆的水。', sentence: '葉子上有亮晶晶的水＿。', frame: '水＿', options: ['滴', '適'], answer: '滴', clue: '提示：這個字的左邊是三點水。', explain: '答案是「滴」；「適」是適合的適，有辵字旁。' },
      { id: 's13', meaning: '「＿客」是來家裡作客的人。', sentence: '今天家裡來了好多＿客。', frame: '＿客', options: ['賓', '繽'], answer: '賓', clue: '提示：這個字的左邊沒有絲線。', explain: '答案是「賓」；「繽」是繽紛的繽，左邊是絲線。' },
      { id: 's14', meaning: '「＿圖」是拿筆把看到、想到的樣子描出來。', sentence: '我最喜歡＿圖了。', frame: '＿圖', options: ['畫', '盡'], answer: '畫', clue: '提示：這個字的下面是「田」和一橫。', explain: '答案是「畫」；「盡」是盡力的盡，下面是「皿」。' }
    ],
    listen: [
      { id: 'l1', text: '眼睛受了傷，什麼都看不見了。', answer: 0, options: [{ text: '失明', img: 'blindfold.png' }, { text: '寧靜', img: 'quiet-lake.png' }, { text: '地毯', img: 'carpet.png' }, { text: '蓓蕾', img: 'bud.png' }] },
      { id: 'l2', text: '湖面平平的，一點聲音也沒有，讓人好放鬆。', answer: 0, options: [{ text: '寧靜', img: 'quiet-lake.png' }, { text: '五彩繽紛', img: 'colorful-garden.png' }, { text: '盡力', img: 'try-hard.png' }, { text: '視力', img: 'eye-test.png' }] },
      { id: 'l3', text: '花還沒有開，像一個小小的包包。', answer: 0, options: [{ text: '蓓蕾', img: 'bud.png' }, { text: '地毯', img: 'carpet.png' }, { text: '學業', img: 'graduate.png' }, { text: '失明', img: 'blindfold.png' }] },
      { id: 'l4', text: '鋪在客廳裡，軟軟厚厚的，可以坐在上面玩。', answer: 0, options: [{ text: '地毯', img: 'carpet.png' }, { text: '蓓蕾', img: 'bud.png' }, { text: '勵志', img: 'climb-up.png' }, { text: '注意', img: 'look-closely.png' }] },
      { id: 'l5', text: '花園裡有紅的、黃的、紫的，好多好多顏色。', answer: 0, options: [{ text: '五彩繽紛', img: 'colorful-garden.png' }, { text: '寧靜', img: 'quiet-lake.png' }, { text: '舒適', img: 'lie-grass.png' }, { text: '觸摸', img: 'touch-feel.png' }] },
      { id: 'l6', text: '用手輕輕的碰一碰，感覺它是什麼。', answer: 0, options: [{ text: '觸摸', img: 'touch-feel.png' }, { text: '視力', img: 'eye-test.png' }, { text: '盡力', img: 'try-hard.png' }, { text: '學業', img: 'graduate.png' }] },
      { id: 'l7', text: '把全部的本事都拿出來，好好的做。', answer: 0, options: [{ text: '盡力', img: 'try-hard.png' }, { text: '注意', img: 'look-closely.png' }, { text: '任何', img: 'many-choices.png' }, { text: '舒適', img: 'lie-grass.png' }] },
      { id: 'l8', text: '醫生請你看遠遠的圖案，檢查眼睛看得清不清楚。', answer: 0, options: [{ text: '視力', img: 'eye-test.png' }, { text: '失明', img: 'blindfold.png' }, { text: '寧靜', img: 'quiet-lake.png' }, { text: '勵志', img: 'climb-up.png' }] }
    ],
    /* ---------- 短語、造句、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      /* 拼短語（短語一）每一格下面寫要放什麼樣的詞 */
      fillLabels: { answer: '怎麼樣', noun: '什麼從哪裡怎麼了' },
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看是什麼樣子。',
      /* 短語一：怎麼樣＋的＋什麼＋從＋哪裡＋怎麼了（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '溫暖的陽光從窗外照進來', img: 'pr-sunshine.png',
        parts: [{ text: '溫暖', role: '怎麼樣' }, { text: '的' }, { text: '陽光', role: '什麼' }, { text: '從' }, { text: '窗外', role: '哪裡' }, { text: '照進來', role: '怎麼了' }],
        explain: '先說它怎麼樣，加上「的」，再說是什麼，接著說「從」哪裡，最後說它怎麼了。' },
      pick: [
        { id: 'ph1', img: 'pr-cool-breeze.png', before: '', noun: '晚風從窗戶吹進來', ask: '什麼樣的晚風從窗戶吹進來', look: '再看看圖片，窗簾輕輕飄，小朋友舒服的閉上眼睛。', options: ['涼爽', '炎熱', '苦澀', '吵鬧'], clue: '提示：夏天的晚上，風吹在身上好舒服，一點也不熱。', explain: '答案是「涼爽」，完整的短語是「涼爽的晚風從窗戶吹進來」。' },
        { id: 'ph2', img: 'pr-bread-smell.png', before: '', noun: '香味從廚房飄出來', ask: '什麼樣的香味從廚房飄出來', look: '再看看圖片，弟弟聞到味道，口水都快流下來了。', options: ['誘人', '難聞', '冰冷', '安靜'], clue: '提示：聞到就肚子餓，好想趕快吃一口。', explain: '答案是「誘人」，完整的短語是「誘人的香味從廚房飄出來」。' },
        { id: 'ph3', img: 'pr-music-room.png', before: '', noun: '琴聲從教室傳出來', ask: '什麼樣的琴聲從教室傳出來', look: '再看看圖片，走廊上的同學都停下來聽。', options: ['悅耳', '刺鼻', '苦澀', '冰冷'], clue: '提示：很好聽，大家都停下腳步。', explain: '答案是「悅耳」，完整的短語是「悅耳的琴聲從教室傳出來」。' },
        { id: 'ph4', img: 'pr-river.png', before: '', noun: '溪水從山上流下來', ask: '什麼樣的溪水從山上流下來', look: '再看看圖片，看得到水底的石頭嗎？', options: ['清澈', '混濁', '吵鬧', '香甜'], clue: '提示：水很乾淨，看得到水底的小石頭。', explain: '答案是「清澈」，完整的短語是「清澈的溪水從山上流下來」。' },
        { id: 'ph5', img: 'pr-kids-laugh.png', before: '', noun: '笑聲從操場傳過來', ask: '什麼樣的笑聲從操場傳過來', look: '再看看圖片，大家玩得怎麼樣？', options: ['開心', '難過', '冰冷', '苦澀'], clue: '提示：大家玩得好高興，一直哈哈大笑。', explain: '答案是「開心」，完整的短語是「開心的笑聲從操場傳過來」。' },
        { id: 'ph6', img: 'pr-snow.png', before: '', noun: '雪花從天上飄下來', ask: '什麼樣的雪花從天上飄下來', look: '再看看圖片，雪花是什麼顏色？', options: ['潔白', '漆黑', '苦澀', '吵鬧'], clue: '提示：顏色像棉花一樣，一點髒的地方都沒有。', explain: '答案是「潔白」，完整的短語是「潔白的雪花從天上飄下來」。' }
      ],
      say: [],
      /* 短語二：什麼＋是如此＋怎麼樣（課本的例子是課文原句，這裡換成自己寫的） */
      phrase2: {
        intro: { example: '星空是如此美麗', img: 'pz-starry.png',
          parts: [{ text: '星空', role: '什麼' }, { text: '是如此' }, { text: '美麗', role: '怎麼樣' }],
          explain: '先說是什麼，加上「是如此」，最後說它怎麼樣。「是如此」就是「是這麼的」，讓人感覺非常非常怎麼樣。' },
        pick: [
          { id: 'p2-pz1', img: 'pz-sea.png', before: '', join: '', noun: '是如此寬廣', ask: '什麼是如此寬廣', look: '再看看圖片，前面是一望無際的什麼？', options: ['大海', '水溝', '鞋盒', '抽屜'], clue: '提示：站在沙灘上看出去，一直看不到另一邊。', explain: '答案是「大海」，完整的短語是「大海是如此寬廣」。' },
          { id: 'p2-pz2', img: 'pz-cake.png', before: '', join: '', noun: '是如此香甜', ask: '什麼是如此香甜', look: '再看看圖片，桌上放著什麼？', options: ['蛋糕', '石頭', '肥皂', '鉛筆'], clue: '提示：生日的時候吃，上面還插著蠟燭。', explain: '答案是「蛋糕」，完整的短語是「蛋糕是如此香甜」。' },
          { id: 'p2-pz3', img: 'pz-mountain.png', before: '', join: '', noun: '是如此高大', ask: '什麼是如此高大', look: '再看看圖片，抬頭看到的是什麼？', options: ['玉山', '螞蟻', '小草', '杯子'], clue: '提示：臺灣最高的地方，頂端常常在雲的上面。', explain: '答案是「玉山」，完整的短語是「玉山是如此高大」。' },
          { id: 'p2-pz4', img: 'pz-library.png', before: '', join: '', noun: '是如此安靜', ask: '什麼是如此安靜', look: '再看看圖片，大家在做什麼？', options: ['圖書館', '菜市場', '遊樂園', '夜市'], clue: '提示：大家都在這裡讀故事、查資料，說話要很小聲。', explain: '答案是「圖書館」，完整的短語是「圖書館是如此安靜」。' },
          { id: 'p2-pz5', img: 'pz-puppy.png', before: '', join: '', noun: '是如此可愛', ask: '什麼是如此可愛', look: '再看看圖片，誰搖著尾巴跑過來？', options: ['小狗', '蟑螂', '垃圾', '蚊子'], clue: '提示：圓圓的眼睛，搖著尾巴跑過來。', explain: '答案是「小狗」，完整的短語是「小狗是如此可愛」。' }
        ],
        fill: [
          { id: 'pz1', img: 'pz-sea.png', parts: ['大海', '是如此', '寬廣'] },
          { id: 'pz2', img: 'pz-cake.png', parts: ['蛋糕', '是如此', '香甜'] },
          { id: 'pz3', img: 'pz-mountain.png', parts: ['玉山', '是如此', '高大'] },
          { id: 'pz4', img: 'pz-library.png', parts: ['圖書館', '是如此', '安靜'] },
          { id: 'pz5', img: 'pz-puppy.png', parts: ['小狗', '是如此', '可愛'] }
        ]
      },
      words: [
        { word: '五彩繽紛', meaning: '顏色很多，又鮮豔又漂亮。', img: 'colorful-garden.png' }
      ],
      choose: [
        { id: 'pw1', word: '五彩繽紛', options: ['運動會上，各班的加油旗五彩繽紛，好熱鬧。', '停電了，房間裡五彩繽紛，什麼都看不見。'], clue: '提示：想一想，「五彩繽紛」是顏色很多，還是黑黑的看不見？', explain: '第一句用得對：加油旗有好多顏色。停電了一片黑，就不是五彩繽紛。' }
      ],
      make: [
        { id: 'pm1', word: '五彩繽紛', clue: '提示：想想看，你在哪裡看過好多好多顏色？', model: '雨停以後，天空出現一道五彩繽紛的彩虹。' }
      ]
    },
    pattern: [
      { key: 'ruguo1', id: 'rg', title: '如果……', img: 'ruguo.png',
        meaning: '用「如果」說一件還沒發生、在想像的事，後面再說會怎麼樣。',
        examples: ['如果我是一隻鳥，我想飛到雲上面看看。'],
        match: [
          { id: 'pt-rg-m1', img: 'pt-rain-window.png', front: '如果明天下雨，', options: ['我們就在家裡下棋。', '我們就去曬太陽。', '我們就去沙灘玩沙。'], clue: '提示：看看圖片，下雨的時候，在哪裡玩比較好？', explain: '答案是「我們就在家裡下棋」：下雨不能出去，就在家裡玩。' },
          { id: 'pt-rg-m2', img: 'pt-magic-wand.png', front: '如果我有一根魔法棒，', options: ['我要把壞掉的玩具變好。', '我要把它丟進垃圾桶。', '我要拿它來刷牙齒。'], clue: '提示：看看圖片，魔法棒可以變出什麼神奇的事？', explain: '答案是「我要把壞掉的玩具變好」：有魔法棒，就能變出神奇的事。' },
          { id: 'pt-rg-m3', img: 'pt-dinosaur.png', front: '如果可以回到很久以前，', options: ['我想看看恐龍長什麼樣子。', '我想馬上寫明天的功課。', '我想把今天的午餐吐掉。'], clue: '提示：看看圖片，很久很久以前，地上走著什麼大動物？', explain: '答案是「我想看看恐龍長什麼樣子」：回到很久以前，就能看到恐龍。' }
        ],
        conj: [
          { id: 'pt-rg-c1', full: '如果我有翅膀，我想飛到月亮上。', img: 'pt-wings.png', sentence: '＿＿我有翅膀，我想飛到月亮上。', options: ['如果……', '當……就……', '不但……還……'], clue: '提示：這是在想像一件不會真的發生的事。數數看有幾個空格。', explain: '答案是「如果……」：如果我有翅膀，我想飛到月亮上。' },
          { id: 'pt-rg-c2', full: '如果你迷路了，可以請警察幫忙。', img: 'pt-lost-police.png', sentence: '＿＿你迷路了，可以請警察幫忙。', options: ['如果……', '當……就……', '不但……還……'], clue: '提示：這是說萬一發生了一件事，可以怎麼辦。數數看有幾個空格。', explain: '答案是「如果……」：如果你迷路了，可以請警察幫忙。' },
          { id: 'pt-rg-c3', full: '如果大象會說話，牠會說什麼呢？', img: 'pt-elephant-talk.png', sentence: '＿＿大象會說話，牠會說什麼呢？', options: ['如果……', '當……就……', '不但……還……'], clue: '提示：大象不會真的說話，這是在想像。數數看有幾個空格。', explain: '答案是「如果……」：如果大象會說話，牠會說什麼呢？' }
        ],
        half: [
          { id: 'pt-rg-h1', front: '如果我變成一隻貓，', clue: '提示：變成貓以後，你想做什麼？', model: '我要每天躺在窗邊曬太陽。' },
          { id: 'pt-rg-h2', front: '如果明天放假，', clue: '提示：放假的話，你想去哪裡、做什麼？', model: '我想和家人去爬山。' }
        ],
        whole: [
          { id: 'pt-rg-w1', clue: '提示：先用「如果」說一件想像的事，再說你會怎麼做。想想看：如果你是老師，你會做什麼？', model: '如果我是老師，我會每天說故事給大家聽。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'question', name: '設問', meaning: '用問句來說話，引起大家注意。有時自己問、自己回答；有時只問不答，答案就藏在問題裡。', example: '作者問：在森林裡走了那麼久，怎麼可能什麼都沒發現呢？意思是：一定能發現很多東西。',
          show: { sentence: '天上為什麼會有彩虹？因為陽光照到了小水滴。' },
          yesno: [
            { id: 'rh-qu-y1', sentence: '誰不喜歡過年呢？', answer: true, clue: '提示：這句話有沒有用問句說，答案藏在問題裡？', explain: '是設問：意思是大家都喜歡過年。' },
            { id: 'rh-qu-y2', sentence: '我喜歡過年。', answer: false, clue: '提示：這句話有沒有用問句？', explain: '不是設問：這句話只是說出自己喜歡過年。' }
          ],
          pick: [
            { id: 'rh-qu-p1', options: ['有什麼比吃冰淇淋更開心呢？', '吃冰淇淋很開心。'], clue: '提示：哪一句用了問句，答案藏在問題裡？', explain: '「有什麼比吃冰淇淋更開心呢？」是設問：意思是吃冰淇淋最開心。' },
            { id: 'rh-qu-p2', options: ['為什麼天會黑？因為太陽下山了。', '太陽下山了，天黑了。'], clue: '提示：哪一句先問問題，再自己回答？', explain: '先問「為什麼天會黑」，再回答，是設問。' },
            { id: 'rh-qu-p3', options: ['誰能像外婆一樣疼我呢？', '外婆很疼我。', '外婆的手很溫暖。'], clue: '提示：哪一句用了問句？', explain: '「誰能像外婆一樣疼我呢？」是設問：意思是沒有人比外婆更疼我。' },
            { id: 'rh-qu-p4', options: ['花為什麼這麼香？因為它想請蝴蝶來。', '花很香。', '蝴蝶飛來了。'], clue: '提示：哪一句先問問題，再自己回答？', explain: '先問「花為什麼這麼香」，再回答，是設問。' },
            { id: 'rh-qu-p5', options: ['怎麼可以浪費食物呢？', '我們不浪費食物。', '食物很好吃。', '飯菜堆得像小山。'], clue: '提示：哪一句用了問句，答案藏在問題裡？', explain: '「怎麼可以浪費食物呢？」是設問：意思是不可以浪費食物。' },
            { id: 'rh-qu-p6', options: ['難道你不想去看海嗎？', '我想去看海。', '大海很藍。', '海浪在唱歌。'], clue: '提示：哪一句用了問句？', explain: '「難道你不想去看海嗎？」是設問：意思是一定很想去看海。' }
          ] },
        { key: 'exclaim', name: '感嘆', meaning: '說話時加上「啊」、「哇」、「唉」這些聲音，或用驚嘆號，把心裡的驚訝、高興、難過大聲的說出來。', example: '作者用驚嘆號讚美這個世界，讓人感覺到她心裡有多麼讚嘆。',
          show: { sentence: '哇！好大的彩虹！', mark: ['哇！'] },
          yesno: [
            { id: 'rh-ex-y1', sentence: '唉！我的冰淇淋掉了。', answer: true, mark: ['唉！'], clue: '提示：這句話有沒有用「唉」，說出心裡的難過？', explain: '是感嘆：「唉」說出了難過的心情。' },
            { id: 'rh-ex-y2', sentence: '我的冰淇淋掉了。', answer: false, clue: '提示：這句話有沒有用嘆詞或驚嘆號，把心情喊出來？', explain: '不是感嘆：這句話只是說出發生的事。' }
          ],
          pick: [
            { id: 'rh-ex-p1', mark: ['啊！'], options: ['啊！好漂亮的煙火！', '天上有煙火。'], clue: '提示：哪一句把驚喜的心情喊出來了？', explain: '「啊！」把看到煙火的驚喜喊出來，是感嘆。' },
            { id: 'rh-ex-p2', mark: ['哇！'], options: ['哇！我考了一百分！', '我考了一百分。'], clue: '提示：哪一句把高興的心情喊出來了？', explain: '「哇！」把高興喊出來，是感嘆。' },
            { id: 'rh-ex-p3', mark: ['唉！'], options: ['唉！又下雨了，不能出去玩。', '今天下雨了。', '雨像珠子一樣落下。'], clue: '提示：哪一句把失望的心情喊出來了？', explain: '「唉！」說出了失望，是感嘆。' },
            { id: 'rh-ex-p4', mark: ['天哪！'], options: ['天哪！小狗把鞋子咬壞了！', '小狗咬了鞋子。', '小狗為什麼咬鞋子？'], clue: '提示：哪一句把吃驚的心情喊出來了？', explain: '「天哪！」說出了吃驚，是感嘆。' },
            { id: 'rh-ex-p5', mark: ['多麼香啊！'], options: ['這朵花多麼香啊！', '這朵花很香。', '花像小喇叭。', '花為什麼這麼香？'], clue: '提示：哪一句用驚嘆號，把讚美喊出來了？', explain: '「多麼香啊！」把讚美喊出來，是感嘆。' },
            { id: 'rh-ex-p6', mark: ['哎呀！'], options: ['哎呀！我忘了帶便當！', '我沒帶便當。', '便當在跟我說再見。', '誰沒帶便當呢？'], clue: '提示：哪一句把著急的心情喊出來了？', explain: '「哎呀！」說出了著急，是感嘆。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '這麼好吃的蛋糕，誰不愛呢？', answer: '設問', clue: '提示：這句話有沒有用問句，答案藏在問題裡？', explain: '答案是「設問」：意思是大家都愛吃。' },
        { id: 'rh2', sentence: '為什麼要刷牙？因為這樣牙齒才會健康。', answer: '設問', clue: '提示：這句話是不是先問問題，再自己回答？', explain: '答案是「設問」：先問為什麼，再說原因。' },
        { id: 'rh3', sentence: '哇！好大的一隻鯨魚！', answer: '感嘆', mark: ['哇！'], clue: '提示：有沒有把驚訝的心情大聲喊出來？', explain: '答案是「感嘆」：「哇」說出了驚訝。' },
        { id: 'rh4', sentence: '唉！我的氣球飛走了。', answer: '感嘆', mark: ['唉！'], clue: '提示：有沒有用一個聲音，說出難過的心情？', explain: '答案是「感嘆」：「唉」說出了難過。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L05 = d; }
})(this);
