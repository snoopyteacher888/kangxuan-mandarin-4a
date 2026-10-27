/* 第 4 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 人事時地物：選項第一個是答案；paras 是提示要用到的段落 */
    wh: [
      { id: 'wh-ren', key: '人', options: ['馬偕和臺灣的居民', '馬偕和他的家人', '學校老師和學生', '一位廚師和客人'], paras: [2, 3, 4], why: '這一課寫的是從加拿大來的馬偕，還有他在臺灣照顧、幫助的居民。' },
      { id: 'wh-shi', key: '事', options: ['幫助臺灣人看病、讀書', '到臺灣開店賣麵包', '到臺灣參加運動比賽', '到臺灣拍電影當明星'], paras: [3, 4], why: '馬偕在臺灣幫大家治病、蓋醫院，還辦學校讓孩子讀書。' },
      { id: 'wh-time', key: '時', options: ['一百多年前', '去年暑假', '明年春天', '昨天晚上'], paras: [1], why: '名人小傳寫著馬偕出生的年代，他是一百多年前的人。' },
      { id: 'wh-di', key: '地', options: ['臺灣的淡水和鄉村', '加拿大的大城市', '日本的東京', '美國的大海邊'], paras: [4, 5], why: '馬偕在淡水蓋醫院、辦學校，還常常到山區和鄉村幫助大家。' },
      { id: 'wh-wu', key: '物', options: ['醫院、學校和藥品', '球場、球鞋和籃球', '電腦、手機和網路', '汽車、火車和飛機'], paras: [3, 4], why: '馬偕送藥給大家，又蓋了醫院和學校。' }
    ],
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qb: 'extract', qc: 'extract', qe: 'extract', qd: 'infer', qg: 'infer', qf: 'interpret', qh: 'interpret',
      qi: 'evaluate', qj: 'evaluate', k1: 'interpret', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qf: { think: ['教育家是做什麼事的人？和教孩子讀書有沒有關係？', '馬偕除了看病，還讓哪些人可以去上學？'], why: '教育家是讓大家有機會學習的人。馬偕開了學校，後來又辦了只收女生的學堂，讓男生、女生都可以讀書，所以他不只是傳教士，也是教育家。' },
      qh: { think: ['詩歌裡，馬偕怎麼稱呼臺灣？', '他說要把什麼送給臺灣？一個人願意這樣做，代表什麼心情？'], why: '馬偕叫臺灣「心愛的」，還說要把青春和一生都給臺灣。願意把一輩子都給一個地方，代表他非常非常愛臺灣。' },
      qi: { think: ['馬偕已經過世很久了，大家還記不記得他？', '一個人做的好事，可不可以一直被大家記住？'], why: '馬偕雖然早就不在了，可是他的愛心和故事一直被大家記在心裡、說給下一代聽，所以說他是「永遠的」馬偕。他沒有真的長生不老。' },
      qj: { think: ['馬偕從很遠的國家來，在臺灣做了哪些事？', '這些事是為了自己，還是為了別人？'], why: '馬偕幫大家看病、蓋醫院、辦學校，常常很早出門、很晚才回家，都是為了幫助別人。所以他是一個很有愛心、願意為別人付出的人。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['謝謝你幫臺灣的人看病，還讓孩子有書可以讀。', '你離開家鄉來照顧我們，真的好勇敢，謝謝你！'], bad: ['你的鞋子是在哪裡買的？', '我今天早餐吃了蛋餅。'], why: '題目問的是見到馬偕想說什麼。可以謝謝他幫大家看病、辦學校，或稱讚他很勇敢。問鞋子、說早餐，跟他做的事沒有關係。' },
      k2: { good: ['同學跌倒了，我扶他去健康中心。', '奶奶提重物，我幫她一起拿。'], bad: ['看到同學哭，我在旁邊笑他。', '有人問路，我假裝沒聽到。'], why: '幫助別人，就是看到別人需要幫忙時，主動伸出手。笑別人、假裝沒聽到，都沒有幫上忙，還會讓人難過。' }
    },
    hanzi: [
      { id: 'h-偕', combo: { layout: 'lr', parts: [['亻', 'm', '人'], ['皆', 's', '']] }, char: '偕', zhuyin: 'ㄒㄧㄝˊ', radical: '人', strokes: 11, words: ['馬偕', '偕同'], say: '偕，馬偕的偕', cloze: '馬＿', img: 'mackay.png', options: ['偕', '階', '楷', '諧'], clue: '這個字的左邊，是單人旁。', explain: '答案是「偕」，左邊是單人旁；「階」的左邊是耳朵旁，「楷」的左邊是木字旁。', parts: ['亻', '皆'], story: '左邊是人，右邊的「皆」是「都」的意思，念起來也有點像「偕」。大家都在一起，就是「偕」，有「一起」的意思。', sentence: '爸爸偕同媽媽一起來看我的表演。', build: { layout: 'lr', show: ['？', '皆'], answer: '亻', options: ['亻', '阝', '木', '言'], clue: '想一想：「階」的左邊是耳朵旁，和別人一起，左邊要放什麼？' } },
      { id: 'h-醫', combo: { layout: 'tb', parts: [['殹', 's', ''], ['酉', 'm', '酒罈']] }, char: '醫', zhuyin: 'ㄧ', radical: '酉', strokes: 18, words: ['醫院', '醫療'], say: '醫，醫生的醫', cloze: '＿院', img: 'hospital.png', options: ['醫', '醬', '醒', '酸'], clue: '這個字的上面是「殹」。', explain: '答案是「醫」；「醬」是醬油的醬，「醒」是睡醒的醒，「酸」是酸甜的酸。', parts: ['殹', '酉'], story: '下面的「酉」像裝酒的罈子，很久以前的人常用酒來治病；上面的「殹」念起來像「醫」。用藥和酒幫人治病，就是「醫」。', sentence: '我發燒了，媽媽帶我去看醫生。', build: { layout: 'tb', show: ['殹', '？'], answer: '酉', options: ['酉', '皿', '心', '木'], clue: '想一想：很久以前常用酒來治病，下面放裝酒的罈子。' } },
      { id: 'h-命', combo: { type: '會意字', pict: '「命」裡面有一個「口」和一個「令」。用嘴巴說出要大家照著做的話，就是「命令」；後來也用來說活著的「生命」。' }, char: '命', zhuyin: 'ㄇㄧㄥˋ', radical: '口', strokes: 8, words: ['生命', '命令'], say: '命，生命的命', cloze: '生＿', img: 'sprout.png', options: ['命', '令', '冷', '拎'], clue: '這個字長得像「令」，可是多了一個「口」。', explain: '答案是「命」，裡面有「口」；「令」少了口，「冷」有兩點水，「拎」有提手旁。', parts: ['口', '令'], story: '「口」是嘴巴，「令」是叫別人做事。用嘴巴叫別人一定要做，就是「命令」。活著的力量也叫「生命」。', sentence: '每一個生命都很珍貴。' },
      { id: 'h-奉', combo: { type: '象形字', pict: '很久以前的「奉」，像兩隻手捧著東西往上送。很恭敬的把東西送給別人，就是「奉」。' }, char: '奉', zhuyin: 'ㄈㄥˋ', radical: '大', strokes: 8, words: ['奉獻', '奉茶'], say: '奉，奉茶的奉', cloze: '＿茶', img: 'serve-tea.png', options: ['奉', '春', '奏', '泰'], clue: '這個字的下面，像兩隻手捧著東西。', explain: '答案是「奉」；「春」是春天的春，下面是「日」；「奏」是演奏的奏。', parts: ['奉'], story: '「奉」像兩隻手捧著東西往上送。很有禮貌、很恭敬的把東西送給別人，就是「奉」。', sentence: '客人來了，我幫忙奉茶。' },
      { id: 'h-獻', combo: { layout: 'lr', parts: [['鬳', 's', ''], ['犬', 'm', '狗']] }, char: '獻', zhuyin: 'ㄒㄧㄢˋ', radical: '犬', strokes: 20, words: ['奉獻', '貢獻'], say: '獻，貢獻的獻', cloze: '貢＿', img: 'give-heart.png', options: ['獻', '默', '狀', '然'], clue: '這個字的右邊，是一個「犬」。', explain: '答案是「獻」，右邊是「犬」；「默」的左邊是「黑」，「狀」的左邊是「爿」。', parts: ['鬳', '犬'], story: '左邊的「鬳」是古時候煮東西的鍋子，右邊是「犬」。很久以前的人把鍋子裡的食物和狗拿去祭拜，恭敬的送上去，就是「獻」。', sentence: '科學家對世界有很大的貢獻。', build: { layout: 'lr', show: ['鬳', '？'], answer: '犬', options: ['犬', '欠', '攵', '頁'], clue: '想一想：右邊是一種動物，就是「狗」的意思。' } },
      { id: 'h-療', combo: { type: '形聲字', pict: '外面是病字旁，和生病有關；裡面的「尞」念起來像「療」。把病治好，就是「治療」。' }, char: '療', zhuyin: 'ㄌㄧㄠˊ', radical: '疒', strokes: 17, words: ['醫療', '治療'], say: '療，治療的療', cloze: '治＿', img: 'bandage.png', options: ['療', '瞭', '僚', '遼'], clue: '這個字的外面，是病字旁。', explain: '答案是「療」，外面是病字旁；「瞭」的左邊是目字旁，「僚」的左邊是單人旁。', parts: ['疒', '尞'], story: '病字旁和生病有關，裡面的「尞」念起來像「療」。想辦法把病治好，就是「治療」。', sentence: '醫生細心的治療小狗的傷口。' },
      { id: 'h-衛', combo: { type: '形聲字', pict: '外面的「行」和走路有關，中間的「韋」念起來有點像「衛」。走來走去保護大家，就是「守衛」。' }, char: '衛', zhuyin: 'ㄨㄟˋ', radical: '行', strokes: 15, words: ['衛生', '衛生紙'], say: '衛，衛生的衛', cloze: '＿生', img: 'wash-hands.png', options: ['衛', '衝', '術', '街'], clue: '這個字的中間是「韋」。', explain: '答案是「衛」，中間是「韋」；「衝」的中間是「重」，「術」的中間是「朮」，「街」的中間是「圭」。', parts: ['行', '韋'], story: '「行」和走路有關，中間的「韋」念起來有點像「衛」。走來走去保護大家的人叫「守衛」；保護身體不生病，就是「衛生」。', sentence: '吃東西前要洗手，比較衛生。' },
      { id: 'h-藥', combo: { layout: 'tb', parts: [['艹', 'm', '草'], ['樂', 's', '']] }, char: '藥', zhuyin: 'ㄧㄠˋ', radical: '艸', strokes: 19, words: ['藥品', '吃藥'], say: '藥，吃藥的藥', cloze: '吃＿', img: 'medicine.png', options: ['藥', '樂', '葉', '蘿'], clue: '這個字的下面，是快樂的「樂」。', explain: '答案是「藥」，上面有草字頭；「樂」沒有草字頭，「葉」的下面不是「樂」。', parts: ['艹', '樂'], story: '上面是草字頭，很久以前的藥大多是用草做的；下面是「樂」。吃了草做的藥，病好了，人就快樂了。', sentence: '感冒了，要按時吃藥。', build: { layout: 'tb', show: ['？', '樂'], answer: '艹', options: ['艹', '竹', '雨', '穴'], clue: '想一想：以前的藥大多是植物做的，上面放什麼？' } },
      { id: 'h-治', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['台', 's', '']] }, char: '治', zhuyin: 'ㄓˋ', radical: '水', strokes: 8, words: ['治病', '治療'], say: '治，治病的治', cloze: '＿病', img: 'doctor-check.png', options: ['治', '冶', '始', '抬'], clue: '這個字的右邊是「台」，左邊是三點的那一個。', explain: '答案是「治」，左邊是三點水；「冶」的左邊只有兩點，「始」的左邊是女字旁。', parts: ['氵', '台'], story: '左邊是水，右邊的「台」念起來有點像「治」。很久以前的人要整理河水，不讓大水淹到田，就叫「治水」；後來把病醫好，也叫「治病」。', sentence: '醫生的工作是幫人治病。', build: { layout: 'lr', show: ['？', '台'], answer: '氵', options: ['氵', '冫', '女', '扌'], clue: '想一想：這個字原本跟整理河水有關。' } },
      { id: 'h-翻', combo: { layout: 'lr', parts: [['番', 's', ''], ['羽', 'm', '翅膀']] }, char: '翻', zhuyin: 'ㄈㄢ', radical: '羽', strokes: 18, words: ['翻山越嶺', '翻書'], say: '翻，翻書的翻', cloze: '＿書', img: 'turn-page.png', options: ['翻', '番', '播', '潘'], clue: '這個字的右邊，是鳥的翅膀。', explain: '答案是「翻」，右邊是「羽」；「番」沒有羽，「播」的左邊是提手旁。', parts: ['番', '羽'], story: '左邊的「番」念起來像「翻」，右邊的「羽」是鳥的翅膀。鳥飛的時候翅膀上下翻動，所以把東西轉過來、翻過去，就是「翻」。', sentence: '我翻開課本，準備上課。', build: { layout: 'lr', show: ['番', '？'], answer: '羽', options: ['羽', '頁', '攵', '皮'], clue: '想一想：鳥飛的時候，翅膀上下翻動。' } },
      { id: 'h-嶺', combo: { layout: 'tb', parts: [['山', 'm', '山'], ['領', 's', '']] }, char: '嶺', zhuyin: 'ㄌㄧㄥˇ', radical: '山', strokes: 17, words: ['翻山越嶺', '山嶺'], say: '嶺，山嶺的嶺', cloze: '山＿', img: 'mountain-range.png', options: ['嶺', '領', '鈴', '零'], clue: '這個字的下面，是領子的「領」。', explain: '答案是「嶺」，上面多了「山」；「領」是領子的領，「鈴」是鈴聲的鈴。', parts: ['山', '領'], story: '上面是山，下面的「領」念起來像「嶺」。一座連著一座的高山，就是「山嶺」。', sentence: '翻過這座山嶺，就能看到大海。', build: { layout: 'tb', show: ['？', '領'], answer: '山', options: ['山', '雨', '艹', '竹'], clue: '想一想：高高的、可以爬上去的地方。' } },
      { id: 'h-捐', combo: { layout: 'lr', parts: [['扌', 'm', '手'], ['肙', 's', '']] }, char: '捐', zhuyin: 'ㄐㄩㄢ', radical: '手', strokes: 10, words: ['捐錢', '捐血'], say: '捐，捐錢的捐', cloze: '＿血', img: 'donate.png', options: ['捐', '絹', '娟', '涓'], clue: '這個字的左邊，是提手旁。', explain: '答案是「捐」，左邊是提手旁；「絹」的左邊是絲線，「娟」的左邊是女字旁。', parts: ['扌', '肙'], story: '左邊是手，右邊的「肙」念起來像「捐」。用手把自己的東西送出去幫助別人，就是「捐」。', sentence: '叔叔常常去捐血，幫助需要的人。', build: { layout: 'lr', show: ['？', '肙'], answer: '扌', options: ['扌', '糸', '女', '氵'], clue: '想一想：把東西送出去，要用身體的哪個部分？' } },
      { id: 'h-宿', combo: { layout: 'tb', parts: [['宀', 'm', '房子'], ['佰', 's', '']] }, char: '宿', zhuyin: 'ㄙㄨˋ', radical: '宀', strokes: 11, words: ['食宿', '宿舍'], say: '宿，宿舍的宿', cloze: '＿舍', img: 'dorm.png', options: ['宿', '縮', '佰', '宙'], clue: '這個字的上面，是寶蓋頭。', explain: '答案是「宿」，上面是寶蓋頭；「縮」的左邊多了絲線，「佰」沒有寶蓋頭。', parts: ['宀', '佰'], story: '上面的寶蓋頭像屋頂，下面像一個人躺在席子上。在屋子裡過夜睡覺，就是「宿」。', sentence: '哥哥上大學後，住在學校的宿舍。', build: { layout: 'tb', show: ['？', '佰'], answer: '宀', options: ['宀', '穴', '艹', '雨'], clue: '想一想：在屋子裡睡覺，上面放像屋頂的部首。' } },
      { id: 'h-堂', combo: { layout: 'tb', parts: [['尚', 's', ''], ['土', 'm', '泥土']] }, char: '堂', zhuyin: 'ㄊㄤˊ', radical: '土', strokes: 11, words: ['學堂', '禮堂'], say: '堂，禮堂的堂', cloze: '禮＿', img: 'school-hall.png', options: ['堂', '常', '當', '棠'], clue: '這個字的上面是「尚」，下面是蓋房子用的泥巴。', explain: '答案是「堂」，下面是「土」；「常」的下面是「巾」，「當」的下面是「田」。', parts: ['尚', '土'], story: '上面的「尚」念起來像「堂」，下面的「土」是蓋房子用的泥土。用土蓋起來的又高又大的房子，就是「堂」。', sentence: '全校同學在禮堂看表演。', build: { layout: 'tb', show: ['尚', '？'], answer: '土', options: ['土', '巾', '田', '木'], clue: '想一想：「常」的下面是巾，這個字的下面是蓋房子用的泥巴。' } },
      { id: 'h-濃', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['農', 's', '']] }, char: '濃', zhuyin: 'ㄋㄨㄥˊ', radical: '水', strokes: 16, words: ['濃濃', '濃湯'], say: '濃，濃湯的濃', cloze: '＿湯', img: 'corn-soup.png', options: ['濃', '農', '膿', '儂'], clue: '這個字的右邊是「農」，左邊和水有關。', explain: '答案是「濃」，左邊是三點水；「農」是農夫的農，沒有三點水。', parts: ['氵', '農'], story: '左邊是水，右邊的「農」念起來像「濃」。湯裡的料很多、味道很重，就是「濃」。', sentence: '媽媽煮了一鍋玉米濃湯。', build: { layout: 'lr', show: ['？', '農'], answer: '氵', options: ['氵', '月', '亻', '口'], clue: '想一想：湯是用水煮的。' } }
    ],
    vocab: [
      { id: 'v-馬偕', word: '馬偕', meaning: '一百多年前從加拿大來到臺灣的傳教士，在臺灣幫人看病、辦學校。', example: '＿＿從很遠的國家來到臺灣，幫助了很多人。', img: 'mackay.png', options: ['馬偕', '學堂', '醫院', '食宿'] },
      { id: 'v-生命', cloze: true, clozeOptions: ['生命', '玩具', '書包', '天氣'], word: '生命', meaning: '活著的力量；人、動物和植物活著的時候。', example: '小貓也是一條小＿＿，要好好愛護牠。', img: 'sprout.png', options: ['生命', '奉獻', '衛生', '學堂'] },
      { id: 'v-奉獻', cloze: true, clozeOptions: ['奉獻', '搶走', '浪費', '藏起來'], word: '奉獻', meaning: '把自己的時間、力氣，全心全意的給別人。', example: '護理師把自己的青春＿＿給生病的人。', img: 'give-heart.png', options: ['奉獻', '捐錢', '治病', '濃濃'] },
      { id: 'v-傳教士', word: '傳教士', meaning: '到各個地方，向大家介紹自己信仰的人。', example: '那位＿＿＿從很遠的國家坐船來到這裡。', img: 'missionary.png', options: ['傳教士', '藥品', '學堂', '生命'] },
      { id: 'v-醫療', cloze: true, clozeOptions: ['醫療', '遊戲', '烹飪', '運動'], word: '醫療', meaning: '看病、治病的工作和設備。', example: '那座小島上的＿＿資源比較少，生病要坐船去大城市。', img: 'doctor-check.png', options: ['醫療', '食宿', '翻山越嶺', '生命'] },
      { id: 'v-衛生', cloze: true, clozeOptions: ['衛生', '骯髒', '危險', '吵鬧'], word: '衛生', meaning: '乾淨、不容易讓人得病。', example: '吃東西前先洗手，比較＿＿。', img: 'wash-hands.png', options: ['衛生', '奉獻', '學堂', '捐錢'] },
      { id: 'v-藥品', cloze: true, clozeOptions: ['藥品', '玩具', '零食', '文具'], word: '藥品', meaning: '可以治病、讓身體好起來的東西。', example: '家裡的＿＿要放在小朋友拿不到的地方。', img: 'medicine.png', options: ['藥品', '醫院', '濃濃', '生命'] },
      { id: 'v-治病', cloze: true, clozeOptions: ['治病', '生氣', '唱歌', '跑步'], word: '治病', meaning: '讓不舒服的身體恢復健康。', example: '這位醫生很會＿＿，大家都很信任他。', img: 'doctor-check.png', options: ['治病', '捐錢', '衛生', '食宿'] },
      { id: 'v-翻山越嶺', cloze: true, clozeOptions: ['翻山越嶺', '原地不動', '坐著休息', '待在家裡'], word: '翻山越嶺', meaning: '爬過一座又一座的高峰，走很遠、很辛苦的路。', example: '郵差＿＿＿＿，把信送到村子裡。', img: 'cross-mountains.png', options: ['翻山越嶺', '披星戴月', '奉獻', '醫療'] },
      { id: 'v-捐錢', cloze: true, clozeOptions: ['捐錢', '借錢', '偷錢', '存錢'], word: '捐錢', meaning: '把自己的財物送出去，幫助需要的人。', example: '看到新聞以後，班上同學一起＿＿幫助生病的小朋友。', img: 'donate.png', options: ['捐錢', '治病', '藥品', '學堂'] },
      { id: 'v-醫院', cloze: true, clozeOptions: ['醫院', '公園', '超市', '車站'], word: '醫院', meaning: '生病的人去看病、住下來治療的地方。', example: '奶奶住進＿＿，我們全家去看她。', img: 'hospital.png', options: ['醫院', '學堂', '食宿', '生命'] },
      { id: 'v-食宿', cloze: true, clozeOptions: ['食宿', '交通', '功課', '玩具'], word: '食宿', meaning: '吃飯和住的地方。', example: '這次露營的＿＿，都由營隊幫忙準備。', img: 'dorm.png', options: ['食宿', '醫療', '衛生', '馬偕'] },
      { id: 'v-學堂', cloze: true, clozeOptions: ['學堂', '市場', '公園', '車站'], word: '學堂', meaning: '以前的人上課讀書的地方。', example: '很久很久以前，孩子們都到＿＿讀書。', img: 'old-school.png', options: ['學堂', '醫院', '藥品', '奉獻'] },
      { id: 'v-濃濃', cloze: true, clozeOptions: ['濃濃', '一點', '少許', '沒有'], word: '濃濃', meaning: '很多、很深厚的樣子。', example: '過年回到外婆家，屋子裡充滿＿＿的年味。', img: 'new-year-home.png', options: ['濃濃', '衛生', '捐錢', '治病'] },
      { id: 'v-披星戴月', cloze: true, clozeOptions: ['披星戴月', '睡到中午', '無所事事', '輕鬆自在'], word: '披星戴月', meaning: '天還沒亮就出門，到了晚上才回家，非常辛苦。', example: '為了工作，爸爸常常＿＿＿＿，很晚才回家。', img: 'night-walk.png', options: ['披星戴月', '翻山越嶺', '醫療', '食宿'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-偕', char: '偕', img: 'cw-together.png', charMeaning: '一起。', word: '偕同', meaning: '和別人一起。', example: '校長＿＿老師們一起來看我們表演。', options: ['偕同', '宿舍', '禮堂', '捐血'] },
      { id: 'cw-醫', char: '醫', img: 'cw-doctor.png', charMeaning: '治病；幫人看病的人。', word: '醫生', meaning: '幫人看病、開藥的人。', example: '我發燒了，媽媽帶我去看＿＿。', options: ['醫生', '命令', '翻書', '濃湯'] },
      { id: 'cw-命', char: '命', img: 'cw-order.png', charMeaning: '叫別人做事；活著的力量。', word: '命令', meaning: '叫別人一定要照著做的話。', example: '隊長下了＿＿，大家馬上排好隊。', options: ['命令', '奉茶', '貢獻', '治好'] },
      { id: 'cw-奉', char: '奉', img: 'serve-tea.png', charMeaning: '很恭敬的送上。', word: '奉茶', meaning: '很有禮貌的把茶端給別人喝。', example: '客人來了，我幫忙＿＿。', options: ['奉茶', '吃藥', '捐血', '翻書'] },
      { id: 'cw-獻', char: '獻', img: 'give-heart.png', charMeaning: '恭敬的送給別人。', word: '貢獻', meaning: '對大家有幫助的付出。', example: '發明電燈的人，對世界有很大的＿＿。', options: ['貢獻', '宿舍', '山嶺', '醫生'] },
      { id: 'cw-療', char: '療', img: 'bandage.png', charMeaning: '把病醫好。', word: '治療', meaning: '用藥或其他方法，讓病快點好。', example: '醫生幫受傷的小狗＿＿。', options: ['治療', '奉茶', '偕同', '禮堂'] },
      { id: 'cw-衛', char: '衛', img: 'cw-tissue.png', charMeaning: '保護；保持乾淨。', word: '衛生紙', meaning: '擦手、擦嘴用的軟軟的紙。', example: '打噴嚏的時候，要拿＿＿＿遮住口鼻。', options: ['衛生紙', '醫生', '宿舍', '貢獻'] },
      { id: 'cw-藥', char: '藥', img: 'medicine.png', charMeaning: '可以治病的東西。', word: '吃藥', meaning: '把醫生開的藥吞下去，讓病快點好。', example: '感冒了，要按時＿＿。', options: ['吃藥', '捐血', '命令', '濃湯'] },
      { id: 'cw-治', char: '治', img: 'cw-cured.png', charMeaning: '把病醫好；管理。', word: '治好', meaning: '把病醫到好了。', example: '醫生把爺爺的咳嗽＿＿了。', options: ['治好', '翻書', '奉茶', '山嶺'] },
      { id: 'cw-翻', char: '翻', img: 'turn-page.png', charMeaning: '把東西轉過來、翻過去。', word: '翻書', meaning: '把書一頁一頁的打開來看。', example: '我＿＿找到第十頁。', options: ['翻書', '吃藥', '治好', '偕同'] },
      { id: 'cw-嶺', char: '嶺', img: 'mountain-range.png', charMeaning: '一座連著一座的山。', word: '山嶺', meaning: '連在一起的一座座高山。', example: '從飛機上往下看，＿＿綠油油的。', options: ['山嶺', '禮堂', '醫生', '命令'] },
      { id: 'cw-捐', char: '捐', img: 'cw-blood.png', charMeaning: '把自己的東西送出去幫助別人。', word: '捐血', meaning: '把自己的血送到醫院，幫助需要的病人。', example: '叔叔每年都會去＿＿救人。', options: ['捐血', '治療', '貢獻', '宿舍'] },
      { id: 'cw-宿', char: '宿', img: 'dorm.png', charMeaning: '過夜、住的地方。', word: '宿舍', meaning: '學校或公司讓人住的地方。', example: '姐姐上大學後，住在學校的＿＿。', options: ['宿舍', '山嶺', '奉茶', '吃藥'] },
      { id: 'cw-堂', char: '堂', img: 'school-hall.png', charMeaning: '又高又大的房子。', word: '禮堂', meaning: '學校裡可以開會、看表演的大房間。', example: '畢業典禮在＿＿舉行。', options: ['禮堂', '衛生紙', '治好', '捐血'] },
      { id: 'cw-濃', char: '濃', img: 'corn-soup.png', charMeaning: '味道很重、很深。', word: '濃湯', meaning: '煮得稠稠的、味道很香的湯。', example: '冬天喝一碗玉米＿＿，全身都暖起來。', options: ['濃湯', '醫生', '治療', '翻書'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-耳提面命', situationImg: 'id-reminder.png', idiom: '耳提面命', char: '命', meaning: '很用心的、一次又一次的叮嚀教導。', example: '每次去游泳前，媽媽都耳提面命，要我先做暖身操。', situation: '每次出門前，爸爸都拉著我的手，一直提醒我過馬路要看紅綠燈。',
        fill: { options: ['去露營前，爸爸＿＿＿＿，要我們不可以自己跑去河邊。', '他一句話也沒有交代就走了，真是＿＿＿＿。'], clue: '提示：哪一句是一直用心的叮嚀？', explain: '第一句用得對：爸爸一直叮嚀要注意安全。一句話也沒交代，就不是這個意思。' } },
      { id: 'i-借花獻佛', situationImg: 'id-share-gift.png', idiom: '借花獻佛', char: '獻', meaning: '拿別人送給自己的東西，再拿去送給另一個人。', example: '這些蘋果是外婆給的，我就借花獻佛，分給隔壁鄰居吃。', situation: '阿姨送我們一盒餅乾，媽媽拿了幾塊，分給來家裡玩的小朋友。',
        fill: { options: ['朋友送我一盒巧克力，我＿＿＿＿，分給全班同學。', '我自己存錢買了禮物送媽媽，這是＿＿＿＿。'], clue: '提示：哪一句是拿別人送的東西，再送給別人？', explain: '第一句用得對：巧克力是朋友送的，再分給同學。自己存錢買的禮物，就不是這個意思。' } },
      { id: 'i-良藥苦口', situationImg: 'id-good-advice.png', idiom: '良藥苦口', char: '藥', meaning: '真正對你好的話，聽起來常常不太好聽。', example: '爸爸說我太常玩手機，雖然不好聽，但是良藥苦口，我決定改一改。', situation: '我寫功課很粗心，老師很嚴肅的提醒我，我雖然不開心，但知道老師是為我好。',
        fill: { options: ['姐姐提醒我不要挑食，雖然有點囉嗦，但是＿＿＿＿。', '他稱讚我的畫很漂亮，真是＿＿＿＿。'], clue: '提示：哪一句是聽了不舒服、其實是為你好的話？', explain: '第一句用得對：提醒不要挑食，是為我好。稱讚畫很漂亮，聽了很開心，就不是這個意思。' } },
      { id: 'i-天翻地覆', situationImg: 'id-messy-room.png', idiom: '天翻地覆', char: '翻', meaning: '亂得不得了，或是變化非常大。', example: '弟弟找不到玩具，把房間弄得天翻地覆。', situation: '弟弟和小狗在客廳追來追去，枕頭、玩具丟得到處都是，客廳亂得不像樣。',
        fill: { options: ['小貓在家裡跑來跑去，把客廳弄得＿＿＿＿。', '房間整理得乾乾淨淨，真是＿＿＿＿。'], clue: '提示：哪一句是亂得不得了？', explain: '第一句用得對：小貓把客廳弄得很亂。房間很乾淨，剛好相反。' } },
      { id: 'i-打退堂鼓', situationImg: 'id-give-up.png', idiom: '打退堂鼓', char: '堂', meaning: '事情做到一半，就害怕或不想做了。', example: '爬山爬到一半，妹妹喊累，想打退堂鼓。', situation: '哥哥報名了跑步比賽，看到其他選手都長得很高，就說不想比了。',
        fill: { options: ['才跑了一圈，他就喊累想＿＿＿＿。', '他把功課全部寫完了，真是＿＿＿＿。'], clue: '提示：哪一句是做到一半就不想做了？', explain: '第一句用得對：才跑一圈就想放棄。把功課全部寫完，就不是這個意思。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-偕', char: '偕', wrong: '階', sentence: '爸爸偕同媽媽一起來看我的表演。', options: ['偕', '階', '楷'], clue: '這裡是說和別人一起，跟樓梯沒有關係。', explain: '要改成「偕」。和別人一起是「偕同」，左邊是單人旁；「階」是臺階的階。' },
      { id: 'fx-醫', char: '醫', wrong: '衣', sentence: '我發燒了，媽媽帶我去看醫生。', options: ['醫', '衣', '依'], clue: '這裡說的是幫人看病的人，跟衣服沒有關係。', explain: '要改成「醫」。幫人看病的人是「醫生」；「衣」是衣服的衣。' },
      { id: 'fx-命', char: '命', wrong: '令', sentence: '每一個生命都很珍貴。', options: ['命', '令', '冷'], clue: '這裡說的是活著的力量，想一想，哪一個字多了「口」？', explain: '要改成「命」。活著的力量是「生命」，裡面有「口」；「令」少了口。' },
      { id: 'fx-奉', char: '奉', wrong: '春', sentence: '客人來了，我幫忙奉茶。', options: ['奉', '春', '奏'], clue: '這裡是說恭敬的把茶端給客人，跟季節沒有關係。', explain: '要改成「奉」。恭敬的端茶是「奉茶」；「春」是春天的春。' },
      { id: 'fx-獻', char: '獻', wrong: '現', sentence: '科學家對世界有很大的貢獻。', options: ['獻', '現', '線'], clue: '這裡是說對大家有幫助的付出，想一想，哪一個字的右邊是「犬」？', explain: '要改成「獻」。對大家有幫助的付出是「貢獻」，右邊是「犬」；「現」是出現的現。' },
      { id: 'fx-療', char: '療', wrong: '瞭', sentence: '醫生細心的治療小狗的傷口。', options: ['療', '瞭', '僚'], clue: '這裡是說把病醫好，想一想，哪一個字有病字旁？', explain: '要改成「療」。把病醫好是「治療」，外面是病字旁；「瞭」是瞭解的瞭。' },
      { id: 'fx-衛', char: '衛', wrong: '衝', sentence: '吃東西前要洗手，比較衛生。', options: ['衛', '衝', '術'], clue: '這裡是說乾淨、不容易生病，跟往前衝沒有關係。', explain: '要改成「衛」。乾淨、不容易生病是「衛生」；「衝」是衝出去的衝。' },
      { id: 'fx-藥', char: '藥', wrong: '樂', sentence: '感冒了，要按時吃藥。', options: ['藥', '樂', '葉'], clue: '這裡說的是治病的東西，想一想，哪一個字有草字頭？', explain: '要改成「藥」。治病的東西是「藥」，上面有草字頭；「樂」是快樂的樂。' },
      { id: 'fx-治', char: '治', wrong: '冶', sentence: '醫生的工作是幫人治病。', options: ['治', '冶', '始'], clue: '這裡是說把病醫好，想一想，左邊是三點還是兩點？', explain: '要改成「治」。把病醫好是「治病」，左邊是三點水；「冶」的左邊只有兩點。' },
      { id: 'fx-翻', char: '翻', wrong: '番', sentence: '我翻開課本，準備上課。', options: ['翻', '番', '播'], clue: '這裡是說把書打開，想一想，哪一個字的右邊有「羽」？', explain: '要改成「翻」。把書打開是「翻開」，右邊有「羽」；「番」沒有羽。' },
      { id: 'fx-嶺', char: '嶺', wrong: '領', sentence: '爬過這座山嶺，就能看到大海。', options: ['嶺', '領', '鈴'], clue: '這裡說的是高山，想一想，哪一個字的上面有「山」？', explain: '要改成「嶺」。一座座高山是「山嶺」，上面有山；「領」是領子的領。' },
      { id: 'fx-捐', char: '捐', wrong: '絹', sentence: '叔叔常常去捐血，幫助需要的人。', options: ['捐', '絹', '娟'], clue: '這裡是說把血送給需要的人，想一想，哪一個字有提手旁？', explain: '要改成「捐」。把血送出去是「捐血」，有提手旁；「絹」的左邊是絲線。' },
      { id: 'fx-宿', char: '宿', wrong: '縮', sentence: '哥哥上大學後，住在學校的宿舍。', options: ['宿', '縮', '佰'], clue: '這裡說的是睡覺住的地方，想一想，哪一個字有寶蓋頭？', explain: '要改成「宿」。住的地方是「宿舍」，上面是寶蓋頭；「縮」是縮小的縮。' },
      { id: 'fx-堂', char: '堂', wrong: '常', sentence: '全校同學在禮堂看表演。', options: ['堂', '常', '當'], clue: '這裡說的是看表演的大房間，想一想，哪一個字的下面是「土」？', explain: '要改成「堂」。看表演的大房間是「禮堂」，下面是土；「常」是常常的常。' },
      { id: 'fx-濃', char: '濃', wrong: '農', sentence: '媽媽煮了一鍋玉米濃湯。', options: ['濃', '農', '膿'], clue: '這裡說的是稠稠的湯，想一想，哪一個字有三點水？', explain: '要改成「濃」。稠稠的湯是「濃湯」，有三點水；「農」是農夫的農。' }
    ],
    similar: [
      { id: 's1', meaning: '「臺＿」是一層一層往上走的地方。', sentence: '走樓梯要小心，不要在臺＿上跑。', frame: '臺＿', options: ['階', '偕'], answer: '階', clue: '提示：這個字的左邊是耳朵旁。', explain: '答案是「階」；「偕」是馬偕的偕，左邊是單人旁。' },
      { id: 's2', meaning: '「音＿」是好聽的歌和曲子。', sentence: '我最喜歡上音＿課。', frame: '音＿', options: ['樂', '藥'], answer: '樂', clue: '提示：這個字上面沒有草字頭。', explain: '答案是「樂」；「藥」是吃藥的藥，有草字頭。' },
      { id: 's3', meaning: '「樹＿」是長在樹枝上、綠綠的一片一片。', sentence: '秋天到了，樹＿慢慢變黃了。', frame: '樹＿', options: ['葉', '藥'], answer: '葉', clue: '提示：這個字的下面是「枼」，不是「樂」。', explain: '答案是「葉」；「藥」是吃藥的藥，下面是「樂」。' },
      { id: 's4', meaning: '「開＿」是一件事情的最前面。', sentence: '電影快要開＿了，大家快坐好。', frame: '開＿', options: ['始', '治'], answer: '始', clue: '提示：這個字的左邊是女字旁。', explain: '答案是「始」；「治」是治病的治，左邊是三點水。' },
      { id: 's5', meaning: '「＿帶」是穿西裝時，打在脖子前面的長布條。', sentence: '爸爸穿西裝的時候，會打上＿帶。', frame: '＿帶', options: ['領', '嶺'], answer: '領', clue: '提示：這個字的上面沒有「山」。', explain: '答案是「領」；「嶺」是山嶺的嶺，上面有山。' },
      { id: 's6', meaning: '「＿聲」是叮叮噹噹的聲音。', sentence: '下課的＿聲響了，大家跑出教室。', frame: '＿聲', options: ['鈴', '嶺'], answer: '鈴', clue: '提示：這個字的左邊是金字旁。', explain: '答案是「鈴」；「嶺」是山嶺的嶺。' },
      { id: 's7', meaning: '「＿夫」是種田的人。', sentence: '＿夫每天在田裡種稻子。', frame: '＿夫', options: ['農', '濃'], answer: '農', clue: '提示：這個字沒有三點水。', explain: '答案是「農」；「濃」是濃湯的濃，有三點水。' },
      { id: 's8', meaning: '「平＿」是很普通、很一般。', sentence: '今天是很平＿的一天。', frame: '平＿', options: ['常', '堂'], answer: '常', clue: '提示：這個字的下面是「巾」。', explain: '答案是「常」；「堂」是禮堂的堂，下面是土。' },
      { id: 's9', meaning: '「＿然」是應該這樣、一定要這樣。', sentence: '幫助別人，是理所＿然的事。', frame: '＿然', options: ['當', '堂'], answer: '當', clue: '提示：這個字的下面是「田」。', explain: '答案是「當」；「堂」是禮堂的堂，下面是土。' },
      { id: 's10', meaning: '「＿出去」是很快的往前跑出去。', sentence: '下課鐘一響，弟弟就＿出教室。', frame: '＿出', options: ['衝', '衛'], answer: '衝', clue: '提示：這個字的中間是「重」。', explain: '答案是「衝」；「衛」是衛生的衛，中間是「韋」。' },
      { id: 's11', meaning: '「＿放」是讓影片或音樂開始。', sentence: '老師在教室裡＿放影片。', frame: '＿放', options: ['播', '翻'], answer: '播', clue: '提示：這個字的左邊是提手旁。', explain: '答案是「播」；「翻」是翻書的翻，右邊是「羽」。' },
      { id: 's12', meaning: '「＿小」是變小了。', sentence: '這件毛衣洗完以後＿小了。', frame: '＿小', options: ['縮', '宿'], answer: '縮', clue: '提示：這個字的左邊是絲線。', explain: '答案是「縮」；「宿」是宿舍的宿，上面是寶蓋頭。' },
      { id: 's13', meaning: '「出＿」是出來被大家看到。', sentence: '雨停了，天空出＿一道彩虹。', frame: '出＿', options: ['現', '獻'], answer: '現', clue: '提示：這個字的左邊是玉字旁。', explain: '答案是「現」；「獻」是貢獻的獻，右邊是「犬」。' }
    ],
    listen: [
      { id: 'l1', text: '生了病的人到這裡看病，病得重的還要住下來。', answer: 0, options: [{ text: '醫院', img: 'hospital.png' }, { text: '學堂', img: 'old-school.png' }, { text: '藥品', img: 'medicine.png' }, { text: '食宿', img: 'dorm.png' }] },
      { id: 'l2', text: '吃東西前先洗手，保持乾乾淨淨。', answer: 0, options: [{ text: '衛生', img: 'wash-hands.png' }, { text: '捐錢', img: 'donate.png' }, { text: '濃濃', img: 'new-year-home.png' }, { text: '學堂', img: 'old-school.png' }] },
      { id: 'l3', text: '爬過一座山，又爬過一座山，走了好遠好遠的路。', answer: 0, options: [{ text: '翻山越嶺', img: 'cross-mountains.png' }, { text: '披星戴月', img: 'night-walk.png' }, { text: '奉獻', img: 'give-heart.png' }, { text: '醫院', img: 'hospital.png' }] },
      { id: 'l4', text: '天還沒亮就出門，滿天都是星星了才回家。', answer: 0, options: [{ text: '披星戴月', img: 'night-walk.png' }, { text: '翻山越嶺', img: 'cross-mountains.png' }, { text: '衛生', img: 'wash-hands.png' }, { text: '藥品', img: 'medicine.png' }] },
      { id: 'l5', text: '把自己存的零用錢拿出來，送給需要幫忙的人。', answer: 0, options: [{ text: '捐錢', img: 'donate.png' }, { text: '治病', img: 'doctor-check.png' }, { text: '食宿', img: 'dorm.png' }, { text: '生命', img: 'sprout.png' }] },
      { id: 'l6', text: '感冒了，醫生開的藥丸和藥水。', answer: 0, options: [{ text: '藥品', img: 'medicine.png' }, { text: '濃濃', img: 'new-year-home.png' }, { text: '學堂', img: 'old-school.png' }, { text: '捐錢', img: 'donate.png' }] },
      { id: 'l7', text: '很久很久以前，小朋友上課讀書的地方。', answer: 0, options: [{ text: '學堂', img: 'old-school.png' }, { text: '醫院', img: 'hospital.png' }, { text: '衛生', img: 'wash-hands.png' }, { text: '奉獻', img: 'give-heart.png' }] },
      { id: 'l8', text: '把自己的時間和力氣，全心全意的給別人。', answer: 0, options: [{ text: '奉獻', img: 'give-heart.png' }, { text: '翻山越嶺', img: 'cross-mountains.png' }, { text: '藥品', img: 'medicine.png' }, { text: '醫院', img: 'hospital.png' }] }
    ],
    /* ---------- 短語短句、造句、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      /* 拼短語（短語）每一格下面寫要放什麼樣的詞 */
      fillLabels: { answer: '什麼', noun: '做什麼給誰' },
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看把什麼送給了誰。',
      /* 短語：將＋什麼＋做什麼＋給＋誰（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '將玩具分享給弟弟', img: 'pr-share-toy.png',
        parts: [{ text: '將' }, { text: '玩具', role: '什麼' }, { text: '分享', role: '做什麼' }, { text: '給' }, { text: '弟弟', role: '誰' }],
        explain: '「將」就是「把」。先說「將」什麼東西，再說做什麼，最後說「給」誰。這樣別人就知道東西到了誰的手上。' },
      pick: [
        { id: 'ph1', img: 'pr-give-flower.png', before: '將', join: '', noun: '送給媽媽', ask: '將什麼送給媽媽', look: '再看看圖片，他手上拿著什麼？', options: ['康乃馨', '垃圾', '石頭', '臭襪子'], clue: '提示：母親節的時候，很多人會買這種花。', explain: '答案是「康乃馨」，完整的短語是「將康乃馨送給媽媽」。' },
        { id: 'ph2', img: 'pr-share-snack.png', before: '將', join: '', noun: '分給同學', ask: '將什麼分給同學', look: '再看看圖片，盒子裡裝的是什麼？', options: ['餅乾', '鞋子', '雨傘', '書包'], clue: '提示：盒子裡香香甜甜、可以吃的東西。', explain: '答案是「餅乾」，完整的短語是「將餅乾分給同學」。' },
        { id: 'ph3', img: 'pr-letter.png', before: '將', join: '', noun: '寄給外婆', ask: '將什麼寄給外婆', look: '再看看圖片，她正要把什麼放進郵筒？', options: ['卡片', '冰塊', '枕頭', '電視'], clue: '提示：上面寫滿了祝福的話，裝進信封裡。', explain: '答案是「卡片」，完整的短語是「將卡片寄給外婆」。' },
        { id: 'ph4', img: 'pr-give-seat.png', before: '將', join: '', noun: '讓給老奶奶', ask: '將什麼讓給老奶奶', look: '再看看圖片，在公車上，小朋友站起來了。', options: ['座位', '零食', '書包', '雨傘'], clue: '提示：自己站起來，請老奶奶坐下。', explain: '答案是「座位」，完整的短語是「將座位讓給老奶奶」。' },
        { id: 'ph5', img: 'pr-teach-brother.png', before: '將', join: '', noun: '教給弟弟', ask: '將什麼教給弟弟', look: '再看看圖片，姐姐在教弟弟做什麼題目？', options: ['加法', '雨水', '枕頭', '鞋子'], clue: '提示：一個蘋果再拿一個蘋果，變成兩個蘋果。', explain: '答案是「加法」，完整的短語是「將加法教給弟弟」。' },
        { id: 'ph6', img: 'pr-donate-toys.png', before: '將', join: '', noun: '捐給育幼院', ask: '將什麼捐給育幼院', look: '再看看圖片，箱子裡裝了什麼？', options: ['舊玩具', '壞掉的碗', '垃圾', '爛蘋果'], clue: '提示：箱子裡有洋娃娃和小汽車。', explain: '答案是「舊玩具」，完整的短語是「將舊玩具捐給育幼院」。' }
      ],
      say: [],
      /* 短句：誰＋對＋什麼＋有著＋怎麼樣＋的＋什麼（課本的例子是課文原句，這裡換成自己寫的） */
      phrase2: {
        intro: { example: '妹妹對小狗有著深厚的感情', img: 'pz-girl-dog.png',
          parts: [{ text: '妹妹', role: '誰' }, { text: '對' }, { text: '小狗', role: '什麼' }, { text: '有著' }, { text: '深厚', role: '怎麼樣' }, { text: '的' }, { text: '感情', role: '什麼感覺' }],
          explain: '先說是誰，再說他「對」什麼，用「有著」接上怎麼樣的感覺。這樣就能說出一個人心裡的感覺。' },
        pick: [
          { id: 'p2-pz1', img: 'pz-basketball.png', before: '哥哥對籃球有著', join: '的', noun: '興趣', ask: '哥哥對籃球有著什麼樣的興趣', look: '再看看圖片，哥哥是不是一直在練球？', options: ['濃厚', '冷淡', '微小', '奇怪'], clue: '提示：他每天都打，怎麼打都不會膩。', explain: '答案是「濃厚」，完整的短句是「哥哥對籃球有著濃厚的興趣」。' },
          { id: 'p2-pz2', img: 'pz-grandma-garden.png', before: '奶奶對花園有著', join: '的', noun: '感情', ask: '奶奶對花園有著什麼樣的感情', look: '再看看圖片，奶奶照顧花的時候，表情怎麼樣？', options: ['深厚', '冷淡', '吵鬧', '奇怪'], clue: '提示：她每天去澆花，照顧了好多年，捨不得離開。', explain: '答案是「深厚」，完整的短句是「奶奶對花園有著深厚的感情」。' },
          { id: 'p2-pz3', img: 'pz-dark.png', before: '弟弟對黑暗有著', join: '的', noun: '恐懼', ask: '弟弟對黑暗有著什麼樣的恐懼', look: '再看看圖片，弟弟是不是躲進被子裡了？', options: ['強烈', '輕鬆', '甜美', '溫暖'], clue: '提示：一關燈他就大叫，躲起來不敢出來。', explain: '答案是「強烈」，完整的短句是「弟弟對黑暗有著強烈的恐懼」。' },
          { id: 'p2-pz4', img: 'pz-stars.png', before: '我對星空有著', join: '的', noun: '好奇', ask: '我對星空有著什麼樣的好奇', look: '再看看圖片，他是不是一直看著望遠鏡？', options: ['無限', '冷淡', '苦澀', '吵鬧'], clue: '提示：他一直問：星星有多遠？宇宙有多大？問也問不完。', explain: '答案是「無限」，完整的短句是「我對星空有著無限的好奇」。' },
          { id: 'p2-pz5', img: 'pz-teacher.png', before: '老師對我們有著', join: '的', noun: '期待', ask: '老師對我們有著什麼樣的期待', look: '再看看圖片，老師看著大家，笑得很開心。', options: ['滿心', '冷淡', '吵鬧', '苦澀'], clue: '提示：老師相信每個人將來都會很棒。', explain: '答案是「滿心」，完整的短句是「老師對我們有著滿心的期待」。' }
        ],
        fill: [
          { id: 'pz1', img: 'pz-basketball.png', parts: ['哥哥', '對', '籃球', '有著', '濃厚', '的', '興趣'] },
          { id: 'pz2', img: 'pz-grandma-garden.png', parts: ['奶奶', '對', '花園', '有著', '深厚', '的', '感情'] },
          { id: 'pz3', img: 'pz-dark.png', parts: ['弟弟', '對', '黑暗', '有著', '強烈', '的', '恐懼'] },
          { id: 'pz4', img: 'pz-stars.png', parts: ['我', '對', '星空', '有著', '無限', '的', '好奇'] },
          { id: 'pz5', img: 'pz-teacher.png', parts: ['老師', '對', '我們', '有著', '滿心', '的', '期待'] }
        ]
      },
      words: [
        { word: '翻山越嶺', meaning: '爬過一座又一座高山，走很遠、很辛苦的路。', img: 'cross-mountains.png' },
        { word: '披星戴月', meaning: '天沒亮就出門，晚上才回家，非常辛苦。', img: 'night-walk.png' }
      ],
      choose: [
        { id: 'pw1', word: '翻山越嶺', options: ['郵差翻山越嶺，把信送到山上的小村子。', '我家樓下就是便利商店，我翻山越嶺去買飲料。'], clue: '提示：想一想，「翻山越嶺」是走很遠很辛苦的路，還是很近？', explain: '第一句用得對：要爬過好幾座山，才能把信送到。便利商店就在樓下，很近，不能用「翻山越嶺」。' },
        { id: 'pw2', word: '披星戴月', options: ['為了準備早市的菜，阿姨每天披星戴月的工作。', '我放假睡到中午才起床，真是披星戴月。'], clue: '提示：想一想，「披星戴月」是很早出門、很晚回家，還是睡得很飽？', explain: '第一句用得對：天還沒亮就開始工作，很辛苦。睡到中午很輕鬆，剛好相反。' }
      ],
      make: [
        { id: 'pm1', word: '翻山越嶺', clue: '提示：想想看，誰要走很遠、很辛苦的山路？他要去做什麼？', model: '登山隊翻山越嶺，終於看到山頂的日出。' },
        { id: 'pm2', word: '披星戴月', clue: '提示：想想看，誰很早出門、很晚回家？他為了什麼這麼辛苦？', model: '爸爸披星戴月的工作，照顧我們全家。' }
      ]
    },
    pattern: [
      { key: 'dangjiu', id: 'dj', title: '當……就……', img: 'dangjiu.png',
        meaning: '先用「當」說一件事發生的時候，再用「就」說接著馬上發生的事。',
        examples: ['當電影一開始，大家就安靜下來。'],
        match: [
          { id: 'pt-dj-m1', img: 'pt-rain-umbrella.png', front: '當天空下起大雨，', options: ['路上的人就趕快撐傘。', '路上的人就跳進河裡。', '路上的人就飛到天上。'], clue: '提示：看看圖片，下雨的時候，大家手上拿著什麼？', explain: '答案是「路上的人就趕快撐傘」：一下雨，大家馬上撐傘。' },
          { id: 'pt-dj-m2', img: 'pt-movie-dark.png', front: '當教室的燈一關，', options: ['大家就安靜看影片。', '大家就站起來跳舞。', '大家就跑去操場玩。'], clue: '提示：看看圖片，燈關了以後，前面的螢幕在播什麼？', explain: '答案是「大家就安靜看影片」：燈一關，影片就開始了。' },
          { id: 'pt-dj-m3', img: 'pt-dog-welcome.png', front: '當我一回到家，', options: ['小狗就搖著尾巴跑過來。', '小狗就背著書包去上學。', '小狗就坐在書桌前寫字。'], clue: '提示：看看圖片，小狗看到主人回來，開不開心？', explain: '答案是「小狗就搖著尾巴跑過來」：我一回家，小狗馬上跑來迎接。' }
        ],
        conj: [
          { id: 'pt-dj-c1', full: '當我說完故事，大家就拍手叫好。', img: 'pt-story-clap.png', sentence: '＿我說完故事，大家＿拍手叫好。', options: ['當……就……', '不但……還……', '除了……還……'], clue: '提示：一件事做完，接著馬上發生另一件事。數數看有幾個空格。', explain: '答案是「當……就……」：當我說完故事，大家就拍手叫好。' },
          { id: 'pt-dj-c2', full: '當紅燈亮起，車子就停下來。', img: 'pt-red-light.png', sentence: '＿紅燈亮起，車子＿停下來。', options: ['當……就……', '不但……還……', '除了……還……'], clue: '提示：紅燈一亮，接著車子馬上怎麼樣？數數看有幾個空格。', explain: '答案是「當……就……」：當紅燈亮起，車子就停下來。' },
          { id: 'pt-dj-c3', full: '當太陽下山，路燈就亮起來。', img: 'pt-street-light.png', sentence: '＿太陽下山，路燈＿亮起來。', options: ['當……就……', '不但……還……', '除了……還……'], clue: '提示：太陽一下山，接著路燈馬上怎麼樣？數數看有幾個空格。', explain: '答案是「當……就……」：當太陽下山，路燈就亮起來。' }
        ],
        half: [
          { id: 'pt-dj-h1', front: '當鬧鐘一響，', clue: '提示：鬧鐘響了，你接著馬上做什麼？記得要說「就」。', model: '我就趕快起床。' },
          { id: 'pt-dj-h2', front: '當媽媽端出蛋糕，', clue: '提示：看到蛋糕，大家接著做什麼？記得要說「就」。', model: '大家就開心的唱起生日快樂歌。' }
        ],
        whole: [
          { id: 'pt-dj-w1', clue: '提示：先用「當」說一件事發生的時候，再用「就」說接著馬上發生的事。想想看：比賽一開始，你會怎麼做？', model: '當比賽開始，我就用力往前跑。' }
        ] },
      { key: 'budanhai', id: 'bdh', title: '不但……還……', img: 'budanhai.png',
        meaning: '先用「不但」說一件事，再用「還」說另一件更進一步、更多的事。',
        examples: ['這家店的麵包不但好吃，還很便宜。'],
        match: [
          { id: 'pt-bdh-m1', img: 'pt-tie-shoes.png', front: '姐姐不但教我綁鞋帶，', options: ['還陪我練習了好多次。', '還把我的鞋子丟掉。', '還跑去公園盪鞦韆。'], clue: '提示：看看圖片，姐姐是不是一直在旁邊陪著我？', explain: '答案是「還陪我練習了好多次」：姐姐教我，又陪我練習，幫了我更多。' },
          { id: 'pt-bdh-m2', img: 'pt-big-park.png', front: '這座公園不但很大，', options: ['還有很多遊樂器材。', '還會自己長腳走路。', '還會開口唱歌給我聽。'], clue: '提示：看看圖片，公園裡有溜滑梯和盪鞦韆嗎？', explain: '答案是「還有很多遊樂器材」：公園很大，又有很多好玩的東西。' },
          { id: 'pt-bdh-m3', img: 'pt-grandpa-garden.png', front: '爺爺不但會種菜，', options: ['還會種漂亮的花。', '還會飛到天上去。', '還會住在大海裡。'], clue: '提示：看看圖片，爺爺的園子裡除了菜，還有什麼？', explain: '答案是「還會種漂亮的花」：爺爺會種菜，也會種花。' }
        ],
        conj: [
          { id: 'pt-bdh-c1', full: '妹妹不但會唱歌，還會跳舞。', img: 'pt-sing-dance.png', sentence: '妹妹＿＿會唱歌，＿會跳舞。', options: ['不但……還……', '當……就……', '……也……'], clue: '提示：先說一件，再說更多的一件。數數看有幾個空格。', explain: '答案是「不但……還……」：妹妹不但會唱歌，還會跳舞。' },
          { id: 'pt-bdh-c2', full: '這杯果汁不但好喝，還很營養。', img: 'pt-juice.png', sentence: '這杯果汁＿＿好喝，＿很營養。', options: ['不但……還……', '當……就……', '……也……'], clue: '提示：好喝之外，又多了一個好處。數數看有幾個空格。', explain: '答案是「不但……還……」：這杯果汁不但好喝，還很營養。' },
          { id: 'pt-bdh-c3', full: '他不但考了第一名，還幫同學複習功課。', img: 'pt-help-study.png', sentence: '他＿＿考了第一名，＿幫同學複習功課。', options: ['不但……還……', '當……就……', '……也……'], clue: '提示：自己考得好，又多做了一件幫助別人的事。數數看有幾個空格。', explain: '答案是「不但……還……」：他不但考了第一名，還幫同學複習功課。' }
        ],
        half: [
          { id: 'pt-bdh-h1', front: '小貓不但很可愛，', clue: '提示：小貓除了可愛，還有什麼厲害的地方？記得要說「還」。', model: '還很會抓老鼠。' },
          { id: 'pt-bdh-h2', front: '運動不但讓身體健康，', clue: '提示：運動還有什麼好處？記得要說「還」。', model: '還能讓心情變好。' }
        ],
        whole: [
          { id: 'pt-bdh-w1', clue: '提示：先用「不但」說一件事，再用「還」說更多的事。想想看：你的好朋友有哪兩個優點？', model: '我的好朋友不但很聰明，還很願意幫助別人。' }
        ] },
      { key: 'chulehai', id: 'clh', title: '除了……還……', img: 'chulehai.png',
        meaning: '先用「除了」說一樣，再用「還」補上另外一樣，告訴別人不只一樣。',
        examples: ['我的書包裡除了課本，還有一個便當。'],
        match: [
          { id: 'pt-clh-m1', img: 'pt-zoo.png', front: '動物園裡除了大象，', options: ['還有長頸鹿和獅子。', '還有冰箱和電視。', '還有汽車和火車。'], clue: '提示：看看圖片，動物園裡還有哪些動物？', explain: '答案是「還有長頸鹿和獅子」：動物園裡不只有大象。' },
          { id: 'pt-clh-m2', img: 'pt-breakfast.png', front: '早餐除了吐司，', options: ['還有一杯熱牛奶。', '還有一雙舊拖鞋。', '還有一把大雨傘。'], clue: '提示：看看圖片，餐桌上還有什麼可以喝的？', explain: '答案是「還有一杯熱牛奶」：早餐不只有吐司。' },
          { id: 'pt-clh-m3', img: 'pt-bookstore.png', front: '星期天除了去公園，', options: ['我們還去書店看書。', '我們還去月亮上玩。', '我們還去海底散步。'], clue: '提示：看看圖片，他們去了公園，又去了哪裡？', explain: '答案是「我們還去書店看書」：星期天不只去公園。' }
        ],
        conj: [
          { id: 'pt-clh-c1', full: '我除了喜歡唱歌，還喜歡彈琴。', img: 'pt-piano.png', sentence: '我＿＿喜歡唱歌，＿喜歡彈琴。', options: ['除了……還……', '當……就……', '……也……'], clue: '提示：說了一樣喜歡的，再補上另一樣。數數看有幾個空格。', explain: '答案是「除了……還……」：我除了喜歡唱歌，還喜歡彈琴。' },
          { id: 'pt-clh-c2', full: '這家店除了賣麵包，還賣蛋糕。', img: 'pt-bakery.png', sentence: '這家店＿＿賣麵包，＿賣蛋糕。', options: ['除了……還……', '當……就……', '……也……'], clue: '提示：店裡不只賣一樣東西。數數看有幾個空格。', explain: '答案是「除了……還……」：這家店除了賣麵包，還賣蛋糕。' },
          { id: 'pt-clh-c3', full: '冰箱裡除了水果，還有一盒牛奶。', img: 'pt-fridge.png', sentence: '冰箱裡＿＿水果，＿有一盒牛奶。', options: ['除了……還……', '當……就……', '……也……'], clue: '提示：冰箱裡不只有一樣東西。數數看有幾個空格。', explain: '答案是「除了……還……」：冰箱裡除了水果，還有一盒牛奶。' }
        ],
        half: [
          { id: 'pt-clh-h1', front: '我的生日禮物除了一本書，', clue: '提示：還收到什麼禮物？記得要說「還」。', model: '還有一盒彩色筆。' },
          { id: 'pt-clh-h2', front: '下課的時候，我除了去喝水，', clue: '提示：下課還做了什麼？記得要說「還」。', model: '還去操場跑了一圈。' }
        ],
        whole: [
          { id: 'pt-clh-w1', clue: '提示：先用「除了」說一樣東西，再用「還」說另一樣。想想看：你的鉛筆盒裡有哪些東西？', model: '我的鉛筆盒裡除了鉛筆，還有一塊橡皮擦。' }
        ] },
      { key: 'ye', id: 'ye', title: '……也……', img: 'ye.png',
        meaning: '前後兩句說的事情差不多，後面那一句用「也」連起來，表示一樣是這樣。',
        examples: ['哥哥喜歡吃西瓜，我也喜歡吃西瓜。'],
        match: [
          { id: 'pt-ye-m1', img: 'pt-sisters-sing.png', front: '姐姐喜歡唱歌，', options: ['我也喜歡唱歌。', '我也喜歡吃石頭。', '我也住在樹上。'], clue: '提示：看看圖片，兩個人是不是一起拿著麥克風？', explain: '答案是「我也喜歡唱歌」：姐姐和我一樣喜歡唱歌。' },
          { id: 'pt-ye-m2', img: 'pt-two-umbrellas.png', front: '爸爸帶了雨傘，', options: ['媽媽也帶了雨傘。', '媽媽也帶了泳圈。', '媽媽也帶了冰棒。'], clue: '提示：看看圖片，兩個人手上拿的東西一樣嗎？', explain: '答案是「媽媽也帶了雨傘」：爸爸和媽媽都帶了雨傘。' },
          { id: 'pt-ye-m3', img: 'pt-spring-garden.png', front: '小樹長高了，', options: ['小花也長大了。', '小花也飛走了。', '小花也睡著了。'], clue: '提示：看看圖片，春天到了，花園裡的植物怎麼樣了？', explain: '答案是「小花也長大了」：小樹和小花都長大了。' }
        ],
        conj: [
          { id: 'pt-ye-c1', full: '妹妹愛吃蘋果，弟弟也愛吃蘋果。', img: 'pt-apples.png', sentence: '妹妹愛吃蘋果，弟弟＿愛吃蘋果。', options: ['……也……', '當……就……', '不但……還……'], clue: '提示：兩個人都一樣愛吃。數數看有幾個空格。', explain: '答案是「……也……」：妹妹愛吃蘋果，弟弟也愛吃蘋果。' },
          { id: 'pt-ye-c2', full: '天空下著雨，風也吹得好大。', img: 'pt-storm.png', sentence: '天空下著雨，風＿吹得好大。', options: ['……也……', '當……就……', '不但……還……'], clue: '提示：雨和風一起來了。數數看有幾個空格。', explain: '答案是「……也……」：天空下著雨，風也吹得好大。' },
          { id: 'pt-ye-c3', full: '老師稱讚了班長，也稱讚了我。', img: 'pt-praise.png', sentence: '老師稱讚了班長，＿稱讚了我。', options: ['……也……', '當……就……', '不但……還……'], clue: '提示：老師稱讚了兩個人。數數看有幾個空格。', explain: '答案是「……也……」：老師稱讚了班長，也稱讚了我。' }
        ],
        half: [
          { id: 'pt-ye-h1', front: '哥哥會游泳，', clue: '提示：還有誰也會游泳？記得要說「也」。', model: '我也會游泳。' },
          { id: 'pt-ye-h2', front: '春天的花很美，', clue: '提示：還有什麼季節的景色一樣很美？記得要說「也」。', model: '秋天的楓葉也很美。' }
        ],
        whole: [
          { id: 'pt-ye-w1', clue: '提示：先說一個人喜歡做的事，再用「也」說另一個人也一樣。想想看：你和家人有什麼一樣的地方？', model: '爸爸很愛看書，我也很愛看書。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'redup', name: '疊字', meaning: '同一個字連在一起重複用，讀起來更好聽，也更能說出感覺有多強。', example: '課文用「濃濃」形容馬偕對臺灣的感情，把「濃」連著說了兩次。',
          show: { sentence: '奶奶的手暖暖的。' },
          yesno: [
            { id: 'rh-re-y1', sentence: '小貓的毛軟軟的。', answer: true, clue: '提示：形容貓毛的字裡，有沒有同一個字連在一起？', explain: '是疊字：「軟軟」把「軟」重複說了。' },
            { id: 'rh-re-y2', sentence: '小貓的毛很軟。', answer: false, clue: '提示：仔細聽，有沒有同一個字連在一起？', explain: '不是疊字：這句話沒有重複的字。' }
          ],
          pick: [
            { id: 'rh-re-p1', options: ['月亮圓圓的。', '月亮很圓。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「圓圓」是疊字：「圓」重複了。' },
            { id: 'rh-re-p2', options: ['他靜靜的坐著看書。', '他坐著看書。'], clue: '提示：仔細聽，哪一句多了重複的字？', explain: '「靜靜」是疊字：「靜」重複了。' },
            { id: 'rh-re-p3', options: ['檸檬酸酸的。', '檸檬很酸。', '檸檬像一顆小太陽。'], clue: '提示：哪一句有同一個字連在一起？', explain: '「酸酸」是疊字：「酸」重複了。' },
            { id: 'rh-re-p4', options: ['小河彎彎的流過村子。', '小河流過村子。', '小河在唱歌。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「彎彎」是疊字：「彎」重複了。' },
            { id: 'rh-re-p5', options: ['被子香香的，好舒服。', '被子很香。', '被子像一朵白雲。', '被子是藍色的。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「香香」是疊字：「香」重複了。' },
            { id: 'rh-re-p6', options: ['麵包鬆鬆軟軟的。', '麵包很軟。', '麵包像枕頭。', '我在吃麵包。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「鬆鬆軟軟」是疊字：「鬆」和「軟」都重複了。' }
          ] },
        { key: 'repeat', name: '類疊', meaning: '同一個詞或同一句話，隔開來重複說好幾次，讀起來有節奏，也讓人感覺心情更強烈。', example: '馬偕寫的詩，把同一句呼喊說了兩次，讓人感覺到他有多愛臺灣。',
          show: { sentence: '多虧了爸爸，我學會騎車；多虧了媽媽，我學會游泳。', mark: ['多虧了'] },
          yesno: [
            { id: 'rh-rp-y1', sentence: '我想念外婆的笑，我想念外婆的菜。', answer: true, mark: ['我想念外婆的'], clue: '提示：找找看，有沒有同一句話隔開來說了好幾次？', explain: '是類疊：「我想念外婆的」說了兩次。' },
            { id: 'rh-rp-y2', sentence: '我很想念外婆。', answer: false, clue: '提示：這句話裡，有沒有同一句話說了好幾次？', explain: '不是類疊：這句話沒有重複說同一句話。' }
          ],
          pick: [
            { id: 'rh-rp-p1', mark: ['加油'], options: ['加油！加油！你一定可以！', '你一定可以的。'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「加油」說了兩次，是類疊。' },
            { id: 'rh-rp-p2', mark: ['好想去'], options: ['好想去海邊，好想去露營。', '我想出去玩。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「好想去」說了兩次，是類疊。' },
            { id: 'rh-rp-p3', mark: ['再見了'], options: ['再見了，老師；再見了，同學。', '畢業典禮結束了。', '學校像我的家。'], clue: '提示：哪一句有同一個詞，說了好幾次？', explain: '「再見了」說了兩次，是類疊。' },
            { id: 'rh-rp-p4', mark: ['我喜歡'], options: ['我喜歡看書，我喜歡畫圖，我喜歡唱歌。', '我有很多興趣。', '書本是我的好朋友。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「我喜歡」說了三次，是類疊。' },
            { id: 'rh-rp-p5', mark: ['下雨了'], options: ['下雨了！下雨了！快收衣服！', '天空下著雨。', '雨點像珍珠。', '雨在敲窗戶。'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「下雨了」說了兩次，是類疊。' },
            { id: 'rh-rp-p6', mark: ['不要怕'], options: ['不要怕，不要怕，我在這裡。', '我會保護你。', '你像一隻小兔子。', '夜晚好黑。'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「不要怕」說了兩次，是類疊。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '外面的風涼涼的。', answer: '疊字', clue: '提示：形容風的字裡，有沒有同一個字連在一起？', explain: '答案是「疊字」：「涼涼」把「涼」連著說了兩次。' },
        { id: 'rh2', sentence: '小兔子的耳朵長長的。', answer: '疊字', clue: '提示：仔細聽，形容耳朵的字有沒有連著重複？', explain: '答案是「疊字」：「長長」把「長」連著說了兩次。' },
        { id: 'rh3', sentence: '快起床，快起床，要遲到了！', answer: '類疊', mark: ['快起床'], clue: '提示：有沒有同一句話，隔開來說了好幾次？', explain: '答案是「類疊」：「快起床」說了兩次。' },
        { id: 'rh4', sentence: '我愛這個家，我愛這些朋友，我愛這所學校。', answer: '類疊', mark: ['我愛'], clue: '提示：找找看，有沒有同一個詞隔開來說了好幾次？', explain: '答案是「類疊」：「我愛」說了三次。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L04 = d; }
})(this);
