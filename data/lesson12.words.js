/* 第 12 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 人事時地物：選項第一個是答案；paras 是提示要用到的段落 */
    wh: [
      { id: 'wh-ren', key: '人', options: ['老鞋匠夫婦和小精靈', '國王和皇后', '警察和小偷', '老師和學生'], paras: [2, 8], why: '故事裡有開鞋店的老鞋匠夫婦，還有半夜來幫忙的兩個小精靈。' },
      { id: 'wh-shi', key: '事', options: ['小精靈幫忙做鞋子', '老鞋匠開餐廳', '小精靈偷走鞋子', '老鞋匠去旅行'], paras: [5, 8], why: '小精靈半夜偷偷幫老鞋匠做鞋，老鞋匠夫婦後來送禮物答謝他們。' },
      { id: 'wh-time', key: '時', options: ['很久很久以前', '去年暑假', '明天早上', '下個月'], paras: [2], why: '故事一開始就說，這是很久很久以前的事。' },
      { id: 'wh-di', key: '地', options: ['城鎮裡的鞋店', '海邊的沙灘', '學校的教室', '熱鬧的夜市'], paras: [2], why: '故事發生在一座古老城鎮裡的小鞋店。' },
      { id: 'wh-wu', key: '物', options: ['皮革和鞋子', '書包和課本', '碗和筷子', '球和球拍'], paras: [4, 5], why: '老鞋匠用皮革做鞋子，小精靈也把皮革做成了新鞋。' }
    ],
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qb: 'extract', qc: 'extract', qd: 'extract', qg: 'extract', qe: 'infer', qf: 'infer', qi: 'infer', qh: 'interpret',
      qj: 'evaluate', k1: 'evaluate', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qh: { think: ['小精靈第一次出現時，穿的是什麼樣的衣服？腳上有沒有穿鞋？', '送別人最缺少的東西，他們會不會最開心？'], why: '小精靈的衣服破破舊舊，又光著腳，最需要的就是新衣服和新鞋子。送別人最需要的東西，是最貼心的禮物。' },
      qj: { think: ['小精靈幫了老鞋匠什麼忙？', '老鞋匠夫婦知道以後，做了什麼？'], why: '小精靈幫老鞋匠做鞋，老鞋匠夫婦就做新衣新鞋答謝他們。故事告訴我們：別人幫助我們，要懂得感謝和回報。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我想送他們小帽子，因為半夜很冷。', '我想送他們好吃的點心，因為工作到半夜一定很餓。'], bad: ['我不想送，因為他們沒跟我說話。', '我要把他們抓起來，讓他們一直幫我做鞋。'], why: '題目問的是還想送什麼禮物、為什麼。帽子、點心都是關心小精靈的禮物，也說了原因。不想送沒有回答問題；把小精靈抓起來，是不對的事。' },
      k2: { good: ['同學借我橡皮擦，我跟他說謝謝，下次也借他東西。', '鄰居奶奶幫我撿球，我畫了一張卡片送她。'], bad: ['別人幫我是應該的，不用說謝謝。', '我不記得有誰幫過我，也不想說。'], why: '別人幫助我們，要說謝謝，也可以想辦法回報。覺得不用說謝謝很沒禮貌；不想說就沒有回答問題。' }
    },
    hanzi: [
      { id: 'h-妻', combo: { type: '會意字', pict: '下面是「女」，上面像一隻手在整理頭髮。很久以前，結了婚的女子會把頭髮梳整齊，所以「妻」就是太太。' }, char: '妻', zhuyin: 'ㄑㄧ', radical: '女', strokes: 8, words: ['妻子', '夫妻'], say: '妻，夫妻的妻', cloze: '夫＿', img: 'cw-couple-walk.png', options: ['妻', '要', '委', '婁'], clue: '這個字的下面是「女」，上面像一隻手。', explain: '答案是「妻」；「要」的上面是「覀」，「委」的上面是「禾」，「婁」的上面不一樣。', parts: ['𠂤', '女'], story: '下面是女子，上面像一隻手在整理頭髮。結了婚、把頭髮梳整齊的女子，就是「妻子」。', sentence: '那對夫妻每天一起去散步。' },
      { id: 'h-耐', combo: { layout: 'lr', parts: [['而', 's', ''], ['寸', 'm', '手']] }, char: '耐', zhuyin: 'ㄋㄞˋ', radical: '而', strokes: 9, words: ['耐心', '忍耐'], say: '耐，忍耐的耐', cloze: '忍＿', img: 'cw-wait-line.png', options: ['耐', '而', '需', '耍'], clue: '這個字的左邊是「而」。', explain: '答案是「耐」，右邊是「寸」；「而」少了寸，「需」的上面是「雨」，「耍」的下面是「女」。', parts: ['而', '寸'], story: '左邊的「而」像鬍子，右邊的「寸」像一隻手。很久以前的人被剃掉鬍子，也要忍著，所以「耐」就是忍得住。', sentence: '排隊的時候要忍耐，不可以插隊。', build: { layout: 'lr', show: ['而', '？'], answer: '寸', options: ['寸', '攵', '欠', '力'], clue: '想一想：右邊像「村」的右邊，一橫一豎鉤再加一點。' } },
      { id: 'h-革', combo: { type: '象形字', pict: '很久以前的「革」，像一張攤開來晒乾的動物皮，上面是頭，中間是身體，下面是尾巴。' }, char: '革', zhuyin: 'ㄍㄜˊ', radical: '革', strokes: 9, words: ['皮革'], say: '革，皮革的革', cloze: '皮＿', img: 'cw-leather-bag.png', options: ['革', '草', '華', '單'], clue: '這個字像一張攤開晒乾的動物皮。', explain: '答案是「革」；「草」的下面是「早」，「華」的下面是兩個「十」，「單」的上面是兩個「口」。', parts: ['革'], story: '「革」像一張攤開晒乾的動物皮。把牛皮、羊皮處理好，做成的材料就是「皮革」。', sentence: '這個包包是用皮革做的。' },
      { id: 'h-賣', combo: { type: '會意字', pict: '上面是「士」（原本是「出」），下面是「買」。把東西拿出來給別人買，就是「賣」。' }, char: '賣', zhuyin: 'ㄇㄞˋ', radical: '貝', strokes: 15, words: ['賣', '叫賣'], say: '賣，叫賣的賣', cloze: '叫＿', img: 'cw-vendor-call.png', options: ['賣', '買', '讀', '續'], clue: '這個字的上面多了一個「士」。', explain: '答案是「賣」，上面有「士」；「買」上面沒有士，「讀」多了言字旁，「續」多了絲線。', parts: ['士', '買'], story: '上面是「士」，下面是「買」。把東西拿出來讓別人買，就是「賣」。記住：多了「士」是賣，沒有是買。', sentence: '夜市的老闆大聲叫賣烤玉米。' },
      { id: 'h-倍', combo: { layout: 'lr', parts: [['亻', 'm', '人'], ['咅', 's', '']] }, char: '倍', zhuyin: 'ㄅㄟˋ', radical: '人', strokes: 10, words: ['雙倍', '加倍'], say: '倍，加倍的倍', cloze: '加＿', img: 'cw-double-scoop.png', options: ['倍', '陪', '培', '賠'], clue: '這個字的右邊是「咅」，左邊和人有關。', explain: '答案是「倍」，左邊是單人旁；「陪」的左邊是耳朵旁，「培」的左邊是土字旁，「賠」的左邊是「貝」。', parts: ['亻', '咅'], story: '左邊是人，右邊的「咅」念起來有點像「倍」。一樣的東西再多一份，就是「加倍」、「雙倍」。', sentence: '吃飽了，力氣加倍！', build: { layout: 'lr', show: ['？', '咅'], answer: '亻', options: ['亻', '阝', '土', '貝'], clue: '想一想：「陪」的左邊是耳朵旁，這個字的左邊和人有關。' } },
      { id: 'h-謎', combo: { layout: 'lr', parts: [['言', 'm', '說話'], ['迷', 's', '']] }, char: '謎', zhuyin: 'ㄇㄧˊ', radical: '言', strokes: 17, words: ['謎團', '謎語'], say: '謎，謎語的謎', cloze: '＿語', img: 'cw-riddle.png', options: ['謎', '迷', '咪', '瞇'], clue: '這個字的右邊是「迷」，左邊和說話有關。', explain: '答案是「謎」，左邊是言字旁；「迷」少了言字旁，「咪」的左邊是口字旁，「瞇」的左邊是目字旁。', parts: ['言', '迷'], story: '左邊是說話，右邊的「迷」是搞不清楚。說出讓人一時想不通、要猜一猜的話，就是「謎語」。', sentence: '元宵節的時候，我們一起猜謎語。', build: { layout: 'lr', show: ['？', '迷'], answer: '言', options: ['言', '口', '目', '米'], clue: '想一想：謎語是用說的，左邊和說話有關。' } },
      { id: 'h-鐘', combo: { layout: 'lr', parts: [['金', 'm', '金屬'], ['童', 's', '']] }, char: '鐘', zhuyin: 'ㄓㄨㄥ', radical: '金', strokes: 20, words: ['鐘聲', '鬧鐘'], say: '鐘，鬧鐘的鐘', cloze: '鬧＿', img: 'cw-alarm-clock.png', options: ['鐘', '鍾', '種', '童'], clue: '這個字的右邊是「童」。', explain: '答案是「鐘」，左邊是金字旁；「鍾」的右邊是「重」，「種」的左邊是禾字旁，「童」少了金字旁。', parts: ['金', '童'], story: '左邊是金，右邊的「童」念起來像「鐘」。用銅鑄成、敲起來噹噹響的，就是「鐘」。', sentence: '早上鬧鐘一響，我就起床了。', build: { layout: 'lr', show: ['？', '童'], answer: '金', options: ['金', '禾', '亻', '木'], clue: '想一想：鐘是用銅鑄成的，左邊放什麼？' } },
      { id: 'h-敲', combo: { layout: 'lr', parts: [['高', 's', ''], ['攴', 'm', '手拿棍子']] }, char: '敲', zhuyin: 'ㄑㄧㄠ', radical: '攴', strokes: 14, words: ['敲打', '敲門'], say: '敲，敲門的敲', cloze: '＿門', img: 'cw-knock-door.png', options: ['敲', '搞', '稿', '高'], clue: '這個字的左邊是「高」。', explain: '答案是「敲」，右邊是「攴」；「搞」的左邊是提手旁，「稿」的左邊是禾字旁，「高」少了攴。', parts: ['高', '攴'], story: '左邊的「高」念起來有點像「敲」，右邊的「攴」像手拿著棍子在打。用東西一下一下的打，就是「敲」。', sentence: '有人在外面敲門。', build: { layout: 'lr', show: ['高', '？'], answer: '攴', options: ['攴', '頁', '力', '欠'], clue: '想一想：右邊像一隻手拿著棍子在打。' } },
      { id: 'h-靈', combo: { type: '形聲字', pict: '上面是「雨」，中間有三個「口」，下面是「巫」。很久以前的人跳舞求雨，覺得天上有神明，所以「靈」有神奇、聰明的意思。' }, char: '靈', zhuyin: 'ㄌㄧㄥˊ', radical: '雨', strokes: 24, words: ['小精靈', '靈巧'], say: '靈，靈巧的靈', cloze: '＿巧', img: 'cw-nimble-hands.png', options: ['靈', '零', '雷', '露'], clue: '這個字的中間有三個「口」，下面是「巫」。', explain: '答案是「靈」；「零」的下面是「令」，「雷」的下面是「田」，「露」的下面是「路」。', parts: ['雨', '口', '口', '口', '巫'], story: '上面是雨，中間三個口，下面是「巫」。很久以前的人跳舞求雨，所以「靈」有神奇、聰明的意思；手腳很巧叫「靈巧」。', sentence: '奶奶的手很靈巧，會編小籃子。' },
      { id: 'h-鎚', combo: { layout: 'lr', parts: [['金', 'm', '金屬'], ['追', 's', '']] }, char: '鎚', zhuyin: 'ㄔㄨㄟˊ', radical: '金', strokes: 18, words: ['鐵鎚', '木鎚'], say: '鎚，木鎚的鎚', cloze: '木＿', img: 'cw-wood-mallet.png', options: ['鎚', '追', '槌', '錘'], clue: '這個字的右邊是「追」。', explain: '答案是「鎚」，左邊是金字旁；「追」少了金字旁，「槌」的左邊是木字旁，「錘」的右邊是「垂」。', parts: ['金', '追'], story: '左邊是金，右邊的「追」念起來像「鎚」。用鐵做、可以敲東西的工具，就是「鎚子」。', sentence: '爸爸用木鎚把木頭敲平。', build: { layout: 'lr', show: ['？', '追'], answer: '金', options: ['金', '木', '扌', '石'], clue: '想一想：鐵做的鎚子，左邊放和鐵有關的部首。' } },
      { id: 'h-嘖', combo: { layout: 'lr', parts: [['口', 'm', '嘴巴'], ['責', 's', '']] }, char: '嘖', zhuyin: 'ㄗㄜˊ', radical: '口', strokes: 14, words: ['嘖嘖稱奇', '嘖嘖'], say: '嘖，嘖嘖稱奇的嘖', cloze: '＿嘖', img: 'cw-wow-cake.png', options: ['嘖', '責', '債', '漬'], clue: '這個字的右邊是「責」，左邊和嘴巴有關。', explain: '答案是「嘖」，左邊是口字旁；「責」少了口，「債」的左邊是單人旁，「漬」的左邊是三點水。', parts: ['口', '責'], story: '左邊是口，右邊的「責」念起來有點像「嘖」。看到很厲害的東西，嘴巴忍不住發出「嘖嘖」的讚嘆聲。', sentence: '大家看到城堡蛋糕，嘖嘖讚嘆。', build: { layout: 'lr', show: ['？', '責'], answer: '口', options: ['口', '亻', '氵', '貝'], clue: '想一想：讚嘆是用嘴巴發出聲音。' } },
      { id: 'h-足', combo: { type: '象形字', pict: '很久以前的「足」，上面像膝蓋，下面像一隻腳。所以「足」就是腳。' }, char: '足', zhuyin: 'ㄗㄨˊ', radical: '足', strokes: 7, words: ['手舞足蹈', '足球'], say: '足，足球的足', cloze: '＿球', img: 'cw-soccer.png', options: ['足', '是', '走', '捉'], clue: '這個字的上面是「口」，下面像一隻腳。', explain: '答案是「足」；「是」的上面是「日」，「走」的上面是「土」，「捉」多了提手旁。', parts: ['口', '止'], story: '「足」上面像膝蓋，下面像腳，所以就是腳。用腳踢的球，就是「足球」。', sentence: '下課時，我們去操場踢足球。' },
      { id: 'h-蹈', combo: { layout: 'lr', parts: [['足', 'm', '腳'], ['舀', 's', '']] }, char: '蹈', zhuyin: 'ㄉㄠˋ', radical: '足', strokes: 17, words: ['手舞足蹈', '舞蹈'], say: '蹈，舞蹈的蹈', cloze: '舞＿', img: 'cw-dance-class.png', options: ['蹈', '稻', '滔', '踏'], clue: '這個字的右邊是「舀」，左邊和腳有關。', explain: '答案是「蹈」，右邊是「舀」；「稻」的左邊是禾字旁，「滔」的左邊是三點水，「踏」的右邊是「沓」。', parts: ['足', '舀'], story: '左邊是腳，右邊的「舀」念起來像「蹈」。用腳踏著節拍跳舞，就是「舞蹈」。', sentence: '姐姐每週都去上舞蹈課。', build: { layout: 'lr', show: ['？', '舀'], answer: '足', options: ['足', '禾', '氵', '扌'], clue: '想一想：跳舞要用腳，左邊放什麼？' } },
      { id: 'h-蹦', combo: { layout: 'lr', parts: [['足', 'm', '腳'], ['崩', 's', '']] }, char: '蹦', zhuyin: 'ㄅㄥˋ', radical: '足', strokes: 18, words: ['蹦蹦跳跳', '活蹦亂跳'], say: '蹦，活蹦亂跳的蹦', cloze: '活＿亂跳', img: 'cw-lively-fish.png', options: ['蹦', '崩', '繃', '嘣'], clue: '這個字的右邊是「崩」，左邊和腳有關。', explain: '答案是「蹦」，左邊是足字旁；「崩」少了足字旁，「繃」的左邊是絲線，「嘣」的左邊是口字旁。', parts: ['足', '崩'], story: '左邊是腳，右邊的「崩」念起來像「蹦」。用腳用力跳起來，就是「蹦」。', sentence: '市場的魚活蹦亂跳，好新鮮。', build: { layout: 'lr', show: ['？', '崩'], answer: '足', options: ['足', '山', '糸', '口'], clue: '想一想：跳起來要用腳。' } },
      { id: 'h-內', combo: { type: '會意字', pict: '外面是一個框框，裡面是「入」。走進框框裡面，就是「內」。' }, char: '內', zhuyin: 'ㄋㄟˋ', radical: '入', strokes: 4, words: ['內心', '室內'], say: '內，室內的內', cloze: '室＿', img: 'cw-indoor-play.png', options: ['內', '肉', '丙', '納'], clue: '這個字的框框裡是一個「入」。', explain: '答案是「內」，裡面只有一個入；「肉」的裡面有兩個人，「丙」的上面多了一橫。', parts: ['冂', '入'], story: '外面是框框，裡面是「入」。走進框框裡面，就是「內」；房子裡面叫「室內」。', sentence: '下雨天，我們在室內玩遊戲。' }
    ],
    vocab: [
      { id: 'v-遠近知名', cloze: true, clozeOptions: ['遠近知名', '默默無聞', '沒人聽過', '冷冷清清'], word: '遠近知名', meaning: '不管住在哪裡的人，都聽說過它。', example: '這家牛肉麵店＿＿＿＿，常常大排長龍。', img: 'famous-shop.png', options: ['遠近知名', '嘖嘖稱奇', '手舞足蹈', '謎團'] },
      { id: 'v-妻子', cloze: true, clozeOptions: ['妻子', '女兒', '老師', '鄰居'], word: '妻子', meaning: '太太。', example: '叔叔和他的＿＿手牽手去散步。', img: 'old-couple.png', options: ['妻子', '小精靈', '鐵鎚', '內心'] },
      { id: 'v-耐心', cloze: true, clozeOptions: ['耐心', '急躁', '生氣', '粗心'], word: '耐心', meaning: '不急不躁，願意慢慢等、慢慢做。', example: '媽媽很有＿＿的教我綁鞋帶。', img: 'patient-wait.png', options: ['耐心', '內心', '雙倍', '皮革'] },
      { id: 'v-皮革', cloze: true, clozeOptions: ['皮革', '紙張', '玻璃', '石頭'], word: '皮革', meaning: '用牛或羊的外層做成的材料，可以做鞋子。', example: '爸爸的新鞋是用＿＿做的。', img: 'leather.png', options: ['皮革', '鐘聲', '敲打', '妻子'] },
      { id: 'v-賣', cloze: true, clozeOptions: ['賣', '買', '送', '借'], word: '賣', meaning: '把東西給別人，換到錢。', example: '夜市的阿姨在＿烤玉米。', img: 'sell-shoes.png', options: ['賣', '耐心', '謎團', '小精靈'] },
      { id: 'v-雙倍', cloze: true, clozeOptions: ['雙倍', '一半', '一點', '很少'], word: '雙倍', meaning: '變成原來的兩份那麼多。', example: '今天集點可以拿到＿＿點數。', img: 'double-coins.png', options: ['雙倍', '皮革', '內心', '蹦蹦跳跳'] },
      { id: 'v-謎團', cloze: true, clozeOptions: ['謎團', '答案', '玩具', '早餐'], word: '謎團', meaning: '想不通、不知道答案的事。', example: '到底是誰把餅乾吃光了？這是一個＿＿。', img: 'mystery.png', options: ['謎團', '鐘聲', '耐心', '遠近知名'] },
      { id: 'v-鐘聲', cloze: true, clozeOptions: ['鐘聲', '鳥叫', '雨聲', '掌聲'], word: '鐘聲', meaning: '「噹──噹──」響，告訴大家時間到了。', example: '學校的＿＿響了，下課囉！', img: 'clock-midnight.png', options: ['鐘聲', '謎團', '敲打', '賣'] },
      { id: 'v-小精靈', cloze: true, clozeOptions: ['小精靈', '大巨人', '老爺爺', '小偷'], word: '小精靈', meaning: '童話裡個子很矮、會魔法的人。', example: '童話故事裡的＿＿＿，會在半夜偷偷幫忙。', img: 'elves.png', options: ['小精靈', '妻子', '鐵鎚', '雙倍'] },
      { id: 'v-鐵鎚', cloze: true, clozeOptions: ['鐵鎚', '剪刀', '掃把', '湯匙'], word: '鐵鎚', meaning: '用來敲釘子的工具，頭重重的。', example: '爸爸用＿＿把釘子敲進牆裡。', img: 'hammer.png', options: ['鐵鎚', '皮革', '內心', '手舞足蹈'] },
      { id: 'v-敲打', cloze: true, clozeOptions: ['敲打', '撫摸', '擦拭', '清洗'], word: '敲打', meaning: '用東西一下一下的碰，發出聲響。', example: '工人用鐵鎚＿＿木板。', img: 'hammer.png', options: ['敲打', '賣', '謎團', '耐心'] },
      { id: 'v-嘖嘖稱奇', cloze: true, clozeOptions: ['嘖嘖稱奇', '毫不在意', '無聊透頂', '打起瞌睡'], word: '嘖嘖稱奇', meaning: '看到很厲害的事，忍不住一直讚嘆。', example: '魔術師把鴿子變不見，觀眾都＿＿＿＿。', img: 'amazed-couple.png', options: ['嘖嘖稱奇', '遠近知名', '蹦蹦跳跳', '鐘聲'] },
      { id: 'v-手舞足蹈', cloze: true, clozeOptions: ['手舞足蹈', '垂頭喪氣', '一動不動', '愁眉苦臉'], word: '手舞足蹈', meaning: '高興得整個人跳起來、動個不停。', example: '聽到明天放假，弟弟高興得＿＿＿＿。', img: 'happy-dance.png', options: ['手舞足蹈', '嘖嘖稱奇', '雙倍', '妻子'] },
      { id: 'v-蹦蹦跳跳', cloze: true, clozeOptions: ['蹦蹦跳跳', '坐著不動', '躺著睡覺', '慢步行走'], word: '蹦蹦跳跳', meaning: '一直上上下下彈起來的樣子。', example: '小兔子在草地上＿＿＿＿。', img: 'elves-dance.png', options: ['蹦蹦跳跳', '手舞足蹈', '鐵鎚', '耐心'] },
      { id: 'v-內心', cloze: true, clozeOptions: ['內心', '外面', '臉上', '手上'], word: '內心', meaning: '自己感覺到、別人看不見的想法和感情。', example: '得到大家的稱讚，他的＿＿好開心。', img: 'warm-heart.png', options: ['內心', '謎團', '賣', '小精靈'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-妻', char: '妻', img: 'cw-couple-walk.png', charMeaning: '太太。', word: '夫妻', meaning: '結了婚的先生和太太。', example: '那對＿＿每天一起去公園散步。', options: ['夫妻', '忍耐', '謎語', '室內'] },
      { id: 'cw-耐', char: '耐', img: 'cw-wait-line.png', charMeaning: '忍得住。', word: '忍耐', meaning: '把不舒服的感覺忍下來。', example: '排隊的時候要＿＿，不可以插隊。', options: ['忍耐', '叫賣', '敲門', '足球'] },
      { id: 'cw-革', char: '革', img: 'cw-leather-bag.png', charMeaning: '處理過的動物皮。', word: '皮革', meaning: '用牛或羊的外層做成的材料。', example: '這個包包是用＿＿做的。', options: ['皮革', '加倍', '鬧鐘', '舞蹈'] },
      { id: 'cw-賣', char: '賣', img: 'cw-vendor-call.png', charMeaning: '把東西給人換錢。', word: '叫賣', meaning: '大聲喊，請別人來買東西。', example: '夜市的老闆大聲＿＿烤玉米。', options: ['叫賣', '夫妻', '靈巧', '木鎚'] },
      { id: 'cw-倍', char: '倍', img: 'cw-double-scoop.png', charMeaning: '一樣的再多一份。', word: '加倍', meaning: '變成兩份那麼多。', example: '今天冰淇淋買一球送一球，分量＿＿！', options: ['加倍', '謎語', '室內', '忍耐'] },
      { id: 'cw-謎', char: '謎', img: 'cw-riddle.png', charMeaning: '想不通、要猜的事。', word: '謎語', meaning: '把答案藏起來，讓人猜的有趣句子。', example: '元宵節的時候，我們一起猜＿＿。', options: ['謎語', '足球', '叫賣', '皮革'] },
      { id: 'cw-鐘', char: '鐘', img: 'cw-alarm-clock.png', charMeaning: '會響、看時間的東西。', word: '鬧鐘', meaning: '時間到了會響、叫人起床的時鐘。', example: '早上＿＿一響，我就起床了。', options: ['鬧鐘', '舞蹈', '夫妻', '嘖嘖'] },
      { id: 'cw-敲', char: '敲', img: 'cw-knock-door.png', charMeaning: '一下一下的打。', word: '敲門', meaning: '用手在門上叩叩叩，讓裡面的人知道。', example: '進別人房間前，要先＿＿。', options: ['敲門', '加倍', '活蹦亂跳', '靈巧'] },
      { id: 'cw-靈', char: '靈', img: 'cw-nimble-hands.png', charMeaning: '聰明、神奇；動作快。', word: '靈巧', meaning: '手腳很活、做得又快又好。', example: '奶奶的手很＿＿，會編小籃子。', options: ['靈巧', '鬧鐘', '皮革', '忍耐'] },
      { id: 'cw-鎚', char: '鎚', img: 'cw-wood-mallet.png', charMeaning: '敲東西的工具。', word: '木鎚', meaning: '用木頭做的鎚子。', example: '爸爸用＿＿把木頭敲平。', options: ['木鎚', '敲門', '謎語', '夫妻'] },
      { id: 'cw-嘖', char: '嘖', img: 'cw-wow-cake.png', charMeaning: '讚嘆的聲音。', word: '嘖嘖', meaning: '讚嘆時嘴巴發出的聲音。', example: '大家看到城堡蛋糕，＿＿讚嘆。', options: ['嘖嘖', '室內', '叫賣', '舞蹈'] },
      { id: 'cw-足', char: '足', img: 'cw-soccer.png', charMeaning: '腳。', word: '足球', meaning: '用腳踢的球。', example: '下課時，我們去操場踢＿＿。', options: ['足球', '木鎚', '加倍', '靈巧'] },
      { id: 'cw-蹈', char: '蹈', img: 'cw-dance-class.png', charMeaning: '用腳踏著跳。', word: '舞蹈', meaning: '跟著音樂跳舞。', example: '姐姐每週都去上＿＿課。', options: ['舞蹈', '嘖嘖', '鬧鐘', '皮革'] },
      { id: 'cw-蹦', char: '蹦', img: 'cw-lively-fish.png', charMeaning: '用力跳起來。', word: '活蹦亂跳', meaning: '跳來跳去，很有精神。', example: '市場的魚＿＿＿＿，好新鮮。', options: ['活蹦亂跳', '足球', '忍耐', '夫妻'] },
      { id: 'cw-內', char: '內', img: 'cw-indoor-play.png', charMeaning: '裡面。', word: '室內', meaning: '房子裡面。', example: '下雨天，我們在＿＿玩遊戲。', options: ['室內', '敲門', '舞蹈', '叫賣'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-洗心革面', situationImg: 'id-change-better.png', idiom: '洗心革面', char: '革', meaning: '下定決心改掉壞習慣，變成更好的人。', example: '他以前常亂丟垃圾，現在洗心革面，主動撿垃圾。', situation: '以前常常亂丟垃圾的小強，現在看到垃圾都主動撿起來，丟進垃圾桶。',
        fill: { options: ['他以前常說謊，現在＿＿＿＿，變得很誠實。', '他一直都很守規矩，從來沒做錯事，真是＿＿＿＿。'], clue: '提示：哪一句是改掉壞習慣，變得更好？', explain: '第一句用得對：以前說謊，現在改過來了。一直都很守規矩，沒有要改的壞習慣。' } },
      { id: 'i-事半功倍', situationImg: 'id-easy-way.png', idiom: '事半功倍', char: '倍', meaning: '用對方法，花一點點力氣，就有很大的效果。', example: '用推車搬書，事半功倍。', situation: '大家一箱一箱的用手搬書，只有小明用推車，一下子就把書搬完了。',
        fill: { options: ['先學會查字典再認生字，真是＿＿＿＿。', '他用錯方法，做了好久都沒做完，真是＿＿＿＿。'], clue: '提示：哪一句是用對方法，輕鬆又有效？', explain: '第一句用得對：會查字典，認字又快又好。用錯方法做很久，剛好相反。' } },
      { id: 'i-旁敲側擊', situationImg: 'id-hint-gift.png', idiom: '旁敲側擊', char: '敲', meaning: '不直接說，而是從旁邊提示，讓人自己猜到。', example: '媽媽旁敲側擊，想知道我考試考得怎麼樣。', situation: '媽媽拿著一個包好的禮物，一直說「它是圓的、會彈起來」，讓孩子猜裡面是什麼。',
        fill: { options: ['我＿＿＿＿的問弟弟，才知道是誰打破了杯子。', '他直接大聲說出答案，真是＿＿＿＿。'], clue: '提示：哪一句是不直接說，從旁邊問？', explain: '第一句用得對：從旁邊慢慢問，才知道答案。直接大聲說，剛好相反。' } },
      { id: 'i-心滿意足', situationImg: 'id-satisfied.png', idiom: '心滿意足', char: '足', meaning: '心裡覺得很滿足，什麼都不缺了。', example: '吃完一大碗冰，弟弟心滿意足的摸著肚子。', situation: '小美抱著期待好久的新玩具，開心的笑了一整天。',
        fill: { options: ['收到期待好久的生日禮物，妹妹＿＿＿＿。', '他什麼都沒得到，覺得很失望，真是＿＿＿＿。'], clue: '提示：哪一句是心裡很滿足？', explain: '第一句用得對：收到想要的禮物，很滿足。很失望，剛好相反。' } },
      { id: 'i-循規蹈矩', situationImg: 'id-follow-rules.png', idiom: '循規蹈矩', char: '蹈', meaning: '乖乖遵守規則，不亂來。', example: '小明在學校一向循規蹈矩，從不惹事。', situation: '下課時，同學們在走廊上排好隊，靠右邊安靜的走。',
        fill: { options: ['他上課＿＿＿＿，從來不亂說話。', '他在走廊上奔跑大叫，真是＿＿＿＿。'], clue: '提示：哪一句是乖乖遵守規則？', explain: '第一句用得對：上課不亂說話，很守規矩。在走廊奔跑大叫，剛好相反。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-妻', char: '妻', wrong: '委', sentence: '那對夫妻每天一起去散步。', options: ['妻', '委', '要'], clue: '這裡說的是先生和太太，跟委員沒有關係。', explain: '要改成「妻」。先生和太太是「夫妻」；「委」是委員的委。' },
      { id: 'fx-耐', char: '耐', wrong: '而', sentence: '排隊的時候要忍耐，不可以插隊。', options: ['耐', '而', '需'], clue: '這裡是說把不舒服忍下來，想一想，哪一個字的右邊是「寸」？', explain: '要改成「耐」。忍下來是「忍耐」，右邊是寸；「而」少了寸。' },
      { id: 'fx-革', char: '革', wrong: '格', sentence: '這個包包是用皮革做的。', options: ['革', '格', '隔'], clue: '這裡說的是做包包的材料，跟格子沒有關係。', explain: '要改成「革」。做包包的材料是「皮革」；「格」是格子的格。' },
      { id: 'fx-賣', char: '賣', wrong: '買', sentence: '夜市的老闆大聲叫賣烤玉米。', options: ['賣', '買', '讀'], clue: '這裡是說把東西給人換錢，想一想，哪一個字的上面有「士」？', explain: '要改成「賣」。把東西給人換錢是「賣」，上面有士；「買」是付錢拿東西。' },
      { id: 'fx-倍', char: '倍', wrong: '陪', sentence: '吃飽了，力氣加倍！', options: ['倍', '陪', '培'], clue: '這裡是說變成兩份那麼多，跟陪伴沒有關係。', explain: '要改成「倍」。變兩份那麼多是「加倍」，左邊是單人旁；「陪」是陪伴的陪。' },
      { id: 'fx-謎', char: '謎', wrong: '迷', sentence: '元宵節的時候，我們一起猜謎語。', options: ['謎', '迷', '咪'], clue: '這裡說的是讓人猜的句子，想一想，哪一個字有言字旁？', explain: '要改成「謎」。讓人猜的句子是「謎語」，有言字旁；「迷」是迷路的迷。' },
      { id: 'fx-鐘', char: '鐘', wrong: '鍾', sentence: '早上鬧鐘一響，我就起床了。', options: ['鐘', '鍾', '種'], clue: '這裡說的是早上會響、叫人起床的東西，想一想，哪一個字的右邊是「童」？', explain: '要改成「鐘」。叫人起床的是「鬧鐘」，右邊是童；「鍾」的右邊是「重」。' },
      { id: 'fx-敲', char: '敲', wrong: '搞', sentence: '有人在外面敲門。', options: ['敲', '搞', '稿'], clue: '這裡是說用手在門上叩叩叩，想一想，哪一個字的右邊是「攴」？', explain: '要改成「敲」。在門上叩叩叩是「敲門」；「搞」的左邊是提手旁。' },
      { id: 'fx-靈', char: '靈', wrong: '零', sentence: '奶奶的手很靈巧，會編小籃子。', options: ['靈', '零', '鈴'], clue: '這裡是說手很巧，跟零分沒有關係。', explain: '要改成「靈」。手很巧是「靈巧」；「零」是零分的零。' },
      { id: 'fx-鎚', char: '鎚', wrong: '追', sentence: '爸爸用木鎚把木頭敲平。', options: ['鎚', '追', '槌'], clue: '這裡說的是敲東西的工具，想一想，哪一個字有金字旁？', explain: '要改成「鎚」。敲東西的工具是「鎚子」，有金字旁；「追」是追趕的追。' },
      { id: 'fx-嘖', char: '嘖', wrong: '責', sentence: '他看到城堡蛋糕，嘴裡發出「嘖」的一聲。', options: ['嘖', '責', '債'], clue: '這裡是說嘴巴發出的讚嘆聲，想一想，哪一個字有口字旁？', explain: '要改成「嘖」。嘴巴發出的聲音有口字旁；「責」是負責的責。' },
      { id: 'fx-足', char: '足', wrong: '是', sentence: '下課時，我們去操場踢足球。', options: ['足', '是', '走'], clue: '這裡說的是用腳踢的球，跟「是不是」沒有關係。', explain: '要改成「足」。用腳踢的球是「足球」；「是」是「是不是」的是。' },
      { id: 'fx-蹈', char: '蹈', wrong: '稻', sentence: '姐姐每週都去上舞蹈課。', options: ['蹈', '稻', '滔'], clue: '這裡是說跳舞，跟稻米沒有關係。', explain: '要改成「蹈」。跳舞是「舞蹈」，左邊是足字旁；「稻」是稻米的稻。' },
      { id: 'fx-蹦', char: '蹦', wrong: '崩', sentence: '市場的魚活蹦亂跳，好新鮮。', options: ['蹦', '崩', '繃'], clue: '這裡是說跳來跳去，想一想，哪一個字的左邊是足字旁？', explain: '要改成「蹦」。跳來跳去是「活蹦亂跳」，左邊是足字旁；「崩」少了足字旁。' },
      { id: 'fx-內', char: '內', wrong: '肉', sentence: '下雨天，我們在室內玩遊戲。', options: ['內', '肉', '丙'], clue: '這裡是說房子裡面，跟吃的肉沒有關係。', explain: '要改成「內」。房子裡面是「室內」；「肉」是豬肉的肉。' }
    ],
    similar: [
      { id: 's1', meaning: '「重＿」是很有關係、不能忽略。', sentence: '準時上學很重＿。', frame: '重＿', options: ['要', '妻'], answer: '要', clue: '提示：這個字的上面是「覀」。', explain: '答案是「要」；「妻」是夫妻的妻。' },
      { id: 's2', meaning: '「＿要」是一定得用到。', sentence: '小狗＿要我們好好照顧。', frame: '＿要', options: ['需', '耐'], answer: '需', clue: '提示：這個字的上面是「雨」。', explain: '答案是「需」；「耐」是忍耐的耐。' },
      { id: 's3', meaning: '「＿子」是一個一個方方的小框框圖案。', sentence: '這件襯衫上有紅色的＿子。', frame: '＿子', options: ['格', '革'], answer: '格', clue: '提示：這個字的左邊是木字旁。', explain: '答案是「格」；「革」是皮革的革。' },
      { id: 's4', meaning: '「＿東西」是付錢把東西拿回家。', sentence: '媽媽去超市＿東西。', frame: '＿東西', options: ['買', '賣'], answer: '買', clue: '提示：這個字的上面沒有「士」。', explain: '答案是「買」；「賣」是把東西給人換錢。' },
      { id: 's5', meaning: '「＿伴」是待在旁邊，不讓人孤單。', sentence: '奶奶生病了，我在旁邊＿伴她。', frame: '＿伴', options: ['陪', '倍'], answer: '陪', clue: '提示：這個字的左邊是耳朵旁。', explain: '答案是「陪」；「倍」是加倍的倍。' },
      { id: 's6', meaning: '「＿路」是找不到路。', sentence: '在森林裡，我們＿路了。', frame: '＿路', options: ['迷', '謎'], answer: '迷', clue: '提示：這個字沒有言字旁。', explain: '答案是「迷」；「謎」是謎語的謎。' },
      { id: 's7', meaning: '「＿子」是埋進土裡會發芽的小東西。', sentence: '我在花盆裡埋下一顆＿子。', frame: '＿子', options: ['種', '鐘'], answer: '種', clue: '提示：這個字的左邊是禾字旁。', explain: '答案是「種」；「鐘」是鬧鐘的鐘。' },
      { id: 's8', meaning: '「＿度」是從下面到頂端有多長。', sentence: '這座山的＿度有三千公尺。', frame: '＿度', options: ['高', '敲'], answer: '高', clue: '提示：這個字的右邊沒有「攴」。', explain: '答案是「高」；「敲」是敲門的敲。' },
      { id: 's9', meaning: '「＿分」是一分都沒有拿到。', sentence: '這題我不會，考了＿分。', frame: '＿分', options: ['零', '靈'], answer: '零', clue: '提示：這個字的下面是「令」。', explain: '答案是「零」；「靈」是靈巧的靈。' },
      { id: 's10', meaning: '「＿著」是跟在後面跑，想抓住。', sentence: '小狗在後面＿著我跑。', frame: '＿著', options: ['追', '鎚'], answer: '追', clue: '提示：這個字有辵字旁。', explain: '答案是「追」；「鎚」是鐵鎚的鎚。' },
      { id: 's11', meaning: '「負＿」是把事情管好，不出錯。', sentence: '照顧小魚由我負＿。', frame: '負＿', options: ['責', '嘖'], answer: '責', clue: '提示：這個字沒有口字旁。', explain: '答案是「責」；「嘖」是嘖嘖稱奇的嘖。' },
      { id: 's12', meaning: '「＿路」是用腳一步一步往前。', sentence: '我每天＿路去上學。', frame: '＿路', options: ['走', '足'], answer: '走', clue: '提示：這個字的上面是「土」。', explain: '答案是「走」；「足」是足球的足。' },
      { id: 's13', meaning: '「水＿」是種在田裡、會長出米的植物。', sentence: '田裡的水＿長得綠油油的。', frame: '水＿', options: ['稻', '蹈'], answer: '稻', clue: '提示：這個字的左邊是禾字旁。', explain: '答案是「稻」；「蹈」是舞蹈的蹈。' },
      { id: 's14', meaning: '「豬＿」是豬身上可以吃的部分。', sentence: '晚餐有一盤炒豬＿。', frame: '豬＿', options: ['肉', '內'], answer: '肉', clue: '提示：這個字的裡面有兩個「人」。', explain: '答案是「肉」；「內」是室內的內。' }
    ],
    listen: [
      { id: 'l1', text: '很有名，不管遠的近的人都聽說過這家店。', answer: 0, options: [{ text: '遠近知名', img: 'famous-shop.png' }, { text: '皮革', img: 'leather.png' }, { text: '鐵鎚', img: 'hammer.png' }, { text: '內心', img: 'warm-heart.png' }] },
      { id: 'l2', text: '不急不躁，願意慢慢的等。', answer: 0, options: [{ text: '耐心', img: 'patient-wait.png' }, { text: '謎團', img: 'mystery.png' }, { text: '賣', img: 'sell-shoes.png' }, { text: '小精靈', img: 'elves.png' }] },
      { id: 'l3', text: '用牛或羊的外層做成的材料，可以做鞋子。', answer: 0, options: [{ text: '皮革', img: 'leather.png' }, { text: '雙倍', img: 'double-coins.png' }, { text: '鐘聲', img: 'clock-midnight.png' }, { text: '妻子', img: 'old-couple.png' }] },
      { id: 'l4', text: '想了好久都想不通、不知道答案的事。', answer: 0, options: [{ text: '謎團', img: 'mystery.png' }, { text: '耐心', img: 'patient-wait.png' }, { text: '敲打', img: 'hammer.png' }, { text: '手舞足蹈', img: 'happy-dance.png' }] },
      { id: 'l5', text: '半夜十二點，大鐘噹噹的響。', answer: 0, options: [{ text: '鐘聲', img: 'clock-midnight.png' }, { text: '嘖嘖稱奇', img: 'amazed-couple.png' }, { text: '皮革', img: 'leather.png' }, { text: '內心', img: 'warm-heart.png' }] },
      { id: 'l6', text: '用來敲釘子的工具，頭重重的。', answer: 0, options: [{ text: '鐵鎚', img: 'hammer.png' }, { text: '小精靈', img: 'elves.png' }, { text: '雙倍', img: 'double-coins.png' }, { text: '遠近知名', img: 'famous-shop.png' }] },
      { id: 'l7', text: '高興得手和腳都動起來跳舞。', answer: 0, options: [{ text: '手舞足蹈', img: 'happy-dance.png' }, { text: '謎團', img: 'mystery.png' }, { text: '耐心', img: 'patient-wait.png' }, { text: '鐵鎚', img: 'hammer.png' }] },
      { id: 'l8', text: '童話裡個子很矮、半夜偷偷幫忙的人。', answer: 0, options: [{ text: '小精靈', img: 'elves.png' }, { text: '妻子', img: 'old-couple.png' }, { text: '鐘聲', img: 'clock-midnight.png' }, { text: '賣', img: 'sell-shoes.png' }] }
    ],
    /* ---------- 短語短句、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看是什麼樣子。',
      /* 短語：誰＋的＋什麼＋怎麼樣（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '阿姨的廚藝高明', img: 'pr-chef-dish.png',
        parts: [{ text: '阿姨', role: '誰' }, { text: '的' }, { text: '廚藝', role: '什麼' }, { text: '高明', role: '怎麼樣' }],
        explain: '先說是誰的，加上「的」，再說是哪一樣本事或東西，最後說它怎麼樣。' },
      pick: [
        { id: 'ph1', img: 'pr-singer.png', before: '姐姐的歌聲', join: '', noun: '。', ask: '姐姐的歌聲怎麼樣', look: '再看看圖片，臺下的人聽得開不開心？', options: ['清脆悅耳', '苦澀難吃', '冰冷堅硬', '骯髒凌亂'], clue: '提示：像小鳥一樣好聽，大家都想再聽一次。', explain: '答案是「清脆悅耳」，完整的短語是「姐姐的歌聲清脆悅耳」。' },
        { id: 'ph2', img: 'pr-grandpa-hands.png', before: '爺爺的雙手', join: '', noun: '。', ask: '爺爺的雙手怎麼樣', look: '再看看圖片，爺爺搬得動一整箱水果嗎？', options: ['粗糙有力', '柔軟無力', '香甜可口', '五顏六色'], clue: '提示：摸起來沙沙的，一整箱水果也搬得動。', explain: '答案是「粗糙有力」，完整的短語是「爺爺的雙手粗糙有力」。' },
        { id: 'ph3', img: 'pr-teacher-voice.png', before: '老師的聲音', join: '', noun: '。', ask: '老師的聲音怎麼樣', look: '再看看圖片，老師蹲下來，怎麼跟孩子說話？', options: ['溫柔親切', '尖銳刺耳', '苦澀難吃', '冰冷堅硬'], clue: '提示：老師輕輕的說，讓人聽了很安心。', explain: '答案是「溫柔親切」，完整的短語是「老師的聲音溫柔親切」。' },
        { id: 'ph4', img: 'pr-puppy-fur.png', before: '小狗的毛', join: '', noun: '。', ask: '小狗的毛怎麼樣', look: '再看看圖片，孩子摸得舒不舒服？', options: ['柔軟光滑', '粗糙扎人', '苦澀難吃', '吵鬧刺耳'], clue: '提示：摸起來像絲綢一樣，好舒服。', explain: '答案是「柔軟光滑」，完整的短語是「小狗的毛柔軟光滑」。' },
        { id: 'ph5', img: 'pr-cake-taste.png', before: '蛋糕的味道', join: '', noun: '。', ask: '蛋糕的味道怎麼樣', look: '再看看圖片，孩子吃了一口，表情怎麼樣？', options: ['香甜可口', '苦澀難吃', '冰冷堅硬', '粗糙扎人'], clue: '提示：咬下去就停不下來，好想再來一塊。', explain: '答案是「香甜可口」，完整的短語是「蛋糕的味道香甜可口」。' },
        { id: 'ph6', img: 'pr-runner.png', before: '哥哥的腳步', join: '', noun: '。', ask: '哥哥的腳步怎麼樣', look: '再看看圖片，哥哥跑得快不快？', options: ['輕快敏捷', '沉重緩慢', '苦澀難吃', '五顏六色'], clue: '提示：他跑起來像小鹿一樣，咻一下就過去了。', explain: '答案是「輕快敏捷」，完整的短語是「哥哥的腳步輕快敏捷」。' }
      ],
      /* 拼短語：自己切好每一塊（每格說明用上面 intro 的每一塊） */
      fill: [
        { id: 'pf1', img: 'pr-singer.png', parts: ['姐姐', '的', '歌聲', '清脆悅耳'] },
        { id: 'pf2', img: 'pr-grandpa-hands.png', parts: ['爺爺', '的', '雙手', '粗糙有力'] },
        { id: 'pf3', img: 'pr-teacher-voice.png', parts: ['老師', '的', '聲音', '溫柔親切'] },
        { id: 'pf4', img: 'pr-puppy-fur.png', parts: ['小狗', '的', '毛', '柔軟光滑'] },
        { id: 'pf5', img: 'pr-runner.png', parts: ['哥哥', '的', '腳步', '輕快敏捷'] }
      ],
      say: [],
      /* 短句：哪裡＋做什麼（裝滿、開滿……）＋怎麼樣＋的＋什麼（課本的例子是課文原句，這裡換成自己寫的） */
      phrase2: {
        intro: { example: '架上排滿五顏六色的積木', img: 'pz-shelf-toys.png',
          parts: [{ text: '架上', role: '哪裡' }, { text: '排滿', role: '做什麼' }, { text: '五顏六色', role: '怎麼樣' }, { text: '的' }, { text: '積木', role: '什麼' }],
          explain: '先說是哪裡，再說那裡「裝滿」、「排滿」了什麼樣的東西。這樣就能把一個地方的樣子說清楚。' },
        pick: [
          { id: 'p2-pz1', img: 'pz-sky-kites.png', before: '天空飛滿', noun: '風箏', ask: '天空飛滿什麼樣的風箏', look: '再看看圖片，風箏都長得一樣嗎？', options: ['各種形狀', '苦澀難吃', '冰冷堅硬', '安靜無聲'], clue: '提示：有的像魚、有的像老鷹、有的像蝴蝶。', explain: '答案是「各種形狀」，完整的短句是「天空飛滿各種形狀的風箏」。' },
          { id: 'p2-pz2', img: 'pz-basket-fruit.png', before: '籃子裝滿', noun: '水果', ask: '籃子裝滿什麼樣的水果', look: '再看看圖片，水果看起來怎麼樣？', options: ['新鮮', '腐爛', '冰冷', '吵鬧'], clue: '提示：剛從果園摘下來，看起來又亮又飽滿。', explain: '答案是「新鮮」，完整的短句是「籃子裝滿新鮮的水果」。' },
          { id: 'p2-pz3', img: 'pz-garden-flowers.png', before: '花園開滿', noun: '花朵', ask: '花園開滿什麼樣的花朵', look: '再看看圖片，花朵有幾種顏色？', options: ['美麗', '枯萎', '苦澀', '吵鬧'], clue: '提示：紅的、黃的、紫的，蝴蝶都飛過來了。', explain: '答案是「美麗」，完整的短句是「花園開滿美麗的花朵」。' },
          { id: 'p2-pz4', img: 'pz-pond-fish.png', before: '池塘游滿', noun: '小魚', ask: '池塘游滿什麼樣的小魚', look: '再看看圖片，小魚長什麼樣子？', options: ['可愛', '兇猛', '苦澀', '冰冷'], clue: '提示：小小的、圓圓的眼睛，大家都想多看一眼。', explain: '答案是「可愛」，完整的短句是「池塘游滿可愛的小魚」。' },
          { id: 'p2-pz5', img: 'pz-box-crayons.png', before: '盒子裝著', noun: '蠟筆', ask: '盒子裝著什麼樣的蠟筆', look: '再看看圖片，蠟筆有幾種顏色？', options: ['繽紛', '漆黑', '苦澀', '吵鬧'], clue: '提示：一枝一枝顏色都不一樣，排得像彩虹。', explain: '答案是「繽紛」，完整的短句是「盒子裝著繽紛的蠟筆」。' }
        ],
        fill: [
          { id: 'pz1', img: 'pz-sky-kites.png', parts: ['天空', '飛滿', '各種形狀', '的', '風箏'] },
          { id: 'pz2', img: 'pz-basket-fruit.png', parts: ['籃子', '裝滿', '新鮮', '的', '水果'] },
          { id: 'pz3', img: 'pz-garden-flowers.png', parts: ['花園', '開滿', '美麗', '的', '花朵'] },
          { id: 'pz4', img: 'pz-pond-fish.png', parts: ['池塘', '游滿', '可愛', '的', '小魚'] },
          { id: 'pz5', img: 'pz-box-crayons.png', parts: ['盒子', '裝著', '繽紛', '的', '蠟筆'] }
        ]
      },
      words: [
        { word: '遠近知名', meaning: '很有名，遠的近的人都知道。', img: 'famous-shop.png' },
        { word: '喜出望外', meaning: '遇到想不到的好事，特別高興。', img: 'wd-surprise-gift.png' },
        { word: '百思不解', meaning: '想了很多次，還是想不通。', img: 'wd-puzzled.png' }
      ],
      choose: [
        { id: 'pw1', word: '遠近知名', options: ['這家豆花店遠近知名，很多人專程來吃。', '這家店剛開，還沒有人知道，真是遠近知名。'], clue: '提示：想一想，「遠近知名」是很有名，還是沒人知道？', explain: '第一句用得對：很多人專程來吃，很有名。沒有人知道，剛好相反。' },
        { id: 'pw2', word: '喜出望外', options: ['在國外的叔叔突然回來過年，我們喜出望外。', '我早就知道會收到這個禮物，所以喜出望外。'], clue: '提示：想一想，「喜出望外」是想不到的好事，還是早就知道的事？', explain: '第一句用得對：叔叔突然回來，是想不到的好事。早就知道，就不是喜出望外。' },
        { id: 'pw3', word: '百思不解', options: ['我的襪子為什麼只剩一隻？我百思不解。', '這題一加一等於二，我百思不解。'], clue: '提示：想一想，「百思不解」是想不通，還是很簡單？', explain: '第一句用得對：想不通襪子去哪裡了。一加一很簡單，不會想不通。' }
      ],
      make: [
        { id: 'pm1', word: '遠近知名', clue: '提示：想想看，你家附近有什麼很有名的店或地方？', model: '我們鎮上的肉圓遠近知名，假日都要排隊。' },
        { id: 'pm2', word: '喜出望外', clue: '提示：想想看，有什麼想不到的好事讓你很開心？', model: '抽獎抽到大獎，讓我喜出望外。' },
        { id: 'pm3', word: '百思不解', clue: '提示：想想看，有什麼事讓你想了很久都想不通？', model: '小狗怎麼會跑到屋頂上？我百思不解。' }
      ]
    },
    pattern: [
      { key: 'youyu', id: 'yy', title: '由於……因此……', img: 'youyu.png',
        meaning: '先用「由於」說原因，再用「因此」說出因為這樣才有的結果。',
        examples: ['由於下大雨，因此運動會延期了。'],
        match: [
          { id: 'pt-yy-m1', img: 'pt-traffic-late.png', front: '由於路上塞車，', options: ['因此我上學遲到了。', '因此我變成了超人。', '因此天空下起糖果。'], clue: '提示：看看圖片，車子塞住了，孩子為什麼看著手錶？', explain: '答案是「因此我上學遲到了」：塞車是原因，遲到是結果。' },
          { id: 'pt-yy-m2', img: 'pt-study-pass.png', front: '由於他認真複習，', options: ['因此考試考得很好。', '因此忘了自己的名字。', '因此長出了一條尾巴。'], clue: '提示：看看圖片，他拿著考卷笑得好開心。', explain: '答案是「因此考試考得很好」：認真複習是原因，考得好是結果。' },
          { id: 'pt-yy-m3', img: 'pt-dry-plant.png', front: '由於很久沒有下雨，', options: ['因此花園的花都枯了。', '因此到處都在淹水。', '因此大家穿上雨衣。'], clue: '提示：看看圖片，地面和花變成什麼樣子？', explain: '答案是「因此花園的花都枯了」：沒下雨是原因，花枯了是結果。' }
        ],
        conj: [
          { id: 'pt-yy-c1', full: '由於天氣很冷，因此山上下雪了。', img: 'pt-cold-snow.png', sentence: '＿＿天氣很冷，＿＿山上下雪了。', options: ['由於……因此……', '雖然……卻……', '如果……就……'], clue: '提示：前面是原因，後面是結果。數數看每個空格有幾個字。', explain: '答案是「由於……因此……」：由於天氣很冷，因此山上下雪了。' },
          { id: 'pt-yy-c2', full: '由於他很熱心，因此大家都喜歡他。', img: 'pt-kind-friends.png', sentence: '＿＿他很熱心，＿＿大家都喜歡他。', options: ['由於……因此……', '雖然……卻……', '如果……就……'], clue: '提示：他很熱心是原因，大家喜歡他是結果。數數看每個空格有幾個字。', explain: '答案是「由於……因此……」：由於他很熱心，因此大家都喜歡他。' },
          { id: 'pt-yy-c3', full: '由於這家店很好吃，因此大排長龍。', img: 'pt-long-line.png', sentence: '＿＿這家店很好吃，＿＿大排長龍。', options: ['由於……因此……', '雖然……卻……', '如果……就……'], clue: '提示：好吃是原因，排隊是結果。數數看每個空格有幾個字。', explain: '答案是「由於……因此……」：由於這家店很好吃，因此大排長龍。' }
        ],
        half: [
          { id: 'pt-yy-h1', front: '由於昨天太晚睡，', clue: '提示：太晚睡會有什麼結果？記得要說「因此」。', model: '因此今天上課一直打哈欠。' },
          { id: 'pt-yy-h2', front: '由於弟弟每天練習，', clue: '提示：每天練習會有什麼結果？記得要說「因此」。', model: '因此跳繩越跳越好。' }
        ],
        whole: [
          { id: 'pt-yy-w1', clue: '提示：先用「由於」說原因，再用「因此」說結果。想想看：你每天做的一件好事，帶來什麼好結果？', model: '由於我每天幫忙澆水，因此陽臺的花開得好漂亮。' }
        ] },
      { key: 'suiran', id: 'sr', title: '雖然……卻……', img: 'suiran.png',
        meaning: '先用「雖然」說一件事，再用「卻」說出跟大家想的不一樣的結果。',
        examples: ['她雖然個子小，力氣卻很大。'],
        match: [
          { id: 'pt-sr-m1', img: 'pt-old-strong.png', front: '爺爺雖然年紀很大，', options: ['身體卻很硬朗。', '卻還是三歲小孩。', '卻會在天上飛。'], clue: '提示：看看圖片，爺爺在公園做什麼？精神好不好？', explain: '答案是「身體卻很硬朗」：年紀大，身體卻很好，跟大家想的不一樣。' },
          { id: 'pt-sr-m2', img: 'pt-small-loud.png', front: '小鳥雖然很小，', options: ['叫聲卻很響亮。', '叫聲也很小。', '卻是一隻大象。'], clue: '提示：看看圖片，小鳥張大嘴巴，聲音大不大？', explain: '答案是「叫聲卻很響亮」：小鳥很小，叫聲卻很大，跟大家想的不一樣。' },
          { id: 'pt-sr-m3', img: 'pt-rain-fun.png', front: '雖然下著大雨，', options: ['大家卻玩得很開心。', '大家都淋溼了。', '大家卻變成了魚。'], clue: '提示：看看圖片，孩子們在雨中的表情怎麼樣？', explain: '答案是「大家卻玩得很開心」：下大雨，大家卻很開心，跟大家想的不一樣。' }
        ],
        conj: [
          { id: 'pt-sr-c1', full: '這道菜雖然不好看，吃起來卻很美味。', img: 'pt-ugly-tasty.png', sentence: '這道菜＿＿不好看，吃起來＿很美味。', options: ['雖然……卻……', '由於……因此……', '如果……就……'], clue: '提示：前後兩件事跟想的不一樣。數數看每個空格有幾個字。', explain: '答案是「雖然……卻……」：這道菜雖然不好看，吃起來卻很美味。' },
          { id: 'pt-sr-c2', full: '媽媽雖然很累，卻還是笑著抱我。', img: 'pt-tired-smile.png', sentence: '媽媽＿＿很累，＿還是笑著抱我。', options: ['雖然……卻……', '由於……因此……', '如果……就……'], clue: '提示：很累，卻還是笑著。數數看每個空格有幾個字。', explain: '答案是「雖然……卻……」：媽媽雖然很累，卻還是笑著抱我。' },
          { id: 'pt-sr-c3', full: '他雖然個子矮，卻跳得很高。', img: 'pt-short-jump.png', sentence: '他＿＿個子矮，＿跳得很高。', options: ['雖然……卻……', '由於……因此……', '如果……就……'], clue: '提示：個子矮，卻跳得高。數數看每個空格有幾個字。', explain: '答案是「雖然……卻……」：他雖然個子矮，卻跳得很高。' }
        ],
        half: [
          { id: 'pt-sr-h1', front: '雖然題目很難，', clue: '提示：題目很難，你卻怎麼樣？記得要說「卻」。', model: '我卻一題一題寫完了。' },
          { id: 'pt-sr-h2', front: '弟弟雖然很怕黑，', clue: '提示：很怕黑，弟弟卻做了什麼？記得要說「卻」。', model: '卻還是勇敢的自己去睡覺。' }
        ],
        whole: [
          { id: 'pt-sr-w1', clue: '提示：先用「雖然」說一件事，再用「卻」說出想不到的結果。想想看：下雨天的時候發生過什麼事？', model: '雖然外面下著雨，我們卻在家裡玩得很開心。' }
        ] },
      { key: 'bushi', id: 'bs', title: '不是……就是……', img: 'bushi.png',
        meaning: '用「不是……就是……」說出兩種情況，一定是其中一種。',
        examples: ['週末我不是去公園，就是去圖書館。'],
        match: [
          { id: 'pt-bs-m1', img: 'pt-cat-sleep-eat.png', front: '小貓整天不是在睡覺，', options: ['就是在吃東西。', '就是在開飛機。', '就是在寫功課。'], clue: '提示：看看圖片，小貓除了睡覺，還在做什麼？', explain: '答案是「就是在吃東西」：小貓不是睡覺，就是吃東西。' },
          { id: 'pt-bs-m2', img: 'pt-brother-ball.png', front: '哥哥下課不是去打籃球，', options: ['就是去跳繩。', '就是去月亮上。', '就是去海底睡覺。'], clue: '提示：看看圖片，哥哥除了打籃球，還在玩什麼？', explain: '答案是「就是去跳繩」：哥哥下課不是打籃球，就是跳繩。' },
          { id: 'pt-bs-m3', img: 'pt-breakfast-choice.png', front: '早餐我不是吃饅頭，', options: ['就是吃蛋餅。', '就是吃石頭。', '就是吃鉛筆。'], clue: '提示：看看圖片，早餐桌上還有什麼？', explain: '答案是「就是吃蛋餅」：早餐不是饅頭，就是蛋餅。' }
        ],
        conj: [
          { id: 'pt-bs-c1', full: '梅雨季不是下雨，就是陰天。', img: 'pt-rainy-season.png', sentence: '梅雨季＿＿下雨，＿＿陰天。', options: ['不是……就是……', '雖然……卻……', '如果……就……'], clue: '提示：兩種天氣，一定是其中一種。數數看每個空格有幾個字。', explain: '答案是「不是……就是……」：梅雨季不是下雨，就是陰天。' },
          { id: 'pt-bs-c2', full: '奶奶不是在煮飯，就是在澆花。', img: 'pt-grandma-cook.png', sentence: '奶奶＿＿在煮飯，＿＿在澆花。', options: ['不是……就是……', '雖然……卻……', '如果……就……'], clue: '提示：奶奶一定在做這兩件事其中一件。數數看每個空格有幾個字。', explain: '答案是「不是……就是……」：奶奶不是在煮飯，就是在澆花。' },
          { id: 'pt-bs-c3', full: '小狗不是在追球，就是在搖尾巴。', img: 'pt-dog-play.png', sentence: '小狗＿＿在追球，＿＿在搖尾巴。', options: ['不是……就是……', '雖然……卻……', '如果……就……'], clue: '提示：小狗一定在做這兩件事其中一件。數數看每個空格有幾個字。', explain: '答案是「不是……就是……」：小狗不是在追球，就是在搖尾巴。' }
        ],
        half: [
          { id: 'pt-bs-h1', front: '放假的時候，我不是在家看書，', clue: '提示：放假你還常常做什麼？記得要說「就是」。', model: '就是跟爸爸去騎腳踏車。' },
          { id: 'pt-bs-h2', front: '弟弟的玩具不是丟在地上，', clue: '提示：弟弟的玩具還常常在哪裡？記得要說「就是」。', model: '就是藏在沙發下面。' }
        ],
        whole: [
          { id: 'pt-bs-w1', clue: '提示：用「不是……就是……」說出你常做的兩件事。想想看：晚上你都在做什麼？', model: '晚上我不是在寫功課，就是在幫忙洗碗。' }
        ] },
      { key: 'yuqi', id: 'yq', title: '與其……不如……', img: 'yuqi.png',
        meaning: '比一比兩種做法，用「與其」說比較不好的，再用「不如」說比較好的。',
        examples: ['與其坐著抱怨，不如動手整理。'],
        match: [
          { id: 'pt-yq-m1', img: 'pt-worry-practice.png', front: '與其一直擔心表演會出錯，', options: ['不如多練習幾次。', '不如把直笛丟掉。', '不如去吃冰淇淋。'], clue: '提示：看看圖片，孩子拿起直笛在做什麼？', explain: '答案是「不如多練習幾次」：與其擔心，不如練習，比較有用。' },
          { id: 'pt-yq-m2', img: 'pt-walk-school.png', front: '與其一直等公車，', options: ['不如走路去學校。', '不如回家睡覺。', '不如坐在地上哭。'], clue: '提示：看看圖片，兩個孩子決定怎麼去學校？', explain: '答案是「不如走路去學校」：公車一直不來，走路比較快。' },
          { id: 'pt-yq-m3', img: 'pt-play-outside.png', front: '與其整天待在家看電視，', options: ['不如出去運動。', '不如看更多電視。', '不如一直吃零食。'], clue: '提示：看看圖片，孩子拿著球跑去哪裡？', explain: '答案是「不如出去運動」：出去運動對身體比較好。' }
        ],
        conj: [
          { id: 'pt-yq-c1', full: '與其坐著哭，不如重新堆好積木。', img: 'pt-rebuild-blocks.png', sentence: '＿＿坐著哭，＿＿重新堆好積木。', options: ['與其……不如……', '雖然……卻……', '如果……就……'], clue: '提示：比一比，後面的做法比較好。數數看每個空格有幾個字。', explain: '答案是「與其……不如……」：與其坐著哭，不如重新堆好積木。' },
          { id: 'pt-yq-c2', full: '與其去店裡買卡片，不如自己做一張。', img: 'pt-handmade-card.png', sentence: '＿＿去店裡買卡片，＿＿自己做一張。', options: ['與其……不如……', '雖然……卻……', '如果……就……'], clue: '提示：比一比，自己做比較有心意。數數看每個空格有幾個字。', explain: '答案是「與其……不如……」：與其去店裡買卡片，不如自己做一張。' },
          { id: 'pt-yq-c3', full: '與其亂猜答案，不如直接問老師。', img: 'pt-ask-teacher.png', sentence: '＿＿亂猜答案，＿＿直接問老師。', options: ['與其……不如……', '雖然……卻……', '如果……就……'], clue: '提示：比一比，問老師比較好。數數看每個空格有幾個字。', explain: '答案是「與其……不如……」：與其亂猜答案，不如直接問老師。' }
        ],
        half: [
          { id: 'pt-yq-h1', front: '與其一直玩手機，', clue: '提示：什麼事比玩手機更好？記得要說「不如」。', model: '不如去公園跑跑步。' },
          { id: 'pt-yq-h2', front: '與其等別人來幫忙，', clue: '提示：什麼做法比等別人更好？記得要說「不如」。', model: '不如自己先動手做。' }
        ],
        whole: [
          { id: 'pt-yq-w1', clue: '提示：先用「與其」說比較不好的做法，再用「不如」說比較好的做法。想想看：覺得好累的時候，怎麼做比較好？', model: '與其一直說好累，不如早點去睡覺。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'exclaim', name: '感嘆', meaning: '說話時加上「啊」、「哇」、「唉」這些聲音，或用驚嘆號，把心裡的驚訝、高興、難過大聲的說出來。', example: '老鞋匠嘆了一聲「唉」，讓人感覺到他心裡好無奈。',
          show: { sentence: '哇！這雙鞋好漂亮！', mark: ['哇！'] },
          yesno: [
            { id: 'rh-ex-y1', sentence: '天哪！鞋子全都做好了！', answer: true, mark: ['天哪！'], clue: '提示：這句話有沒有用「天哪」，把吃驚的心情喊出來？', explain: '是感嘆：「天哪」說出了吃驚。' },
            { id: 'rh-ex-y2', sentence: '鞋子全都做好了。', answer: false, clue: '提示：這句話有沒有用嘆詞或驚嘆號，把心情喊出來？', explain: '不是感嘆：這句話只是說出發生的事。' }
          ],
          pick: [
            { id: 'rh-ex-p1', mark: ['啊！'], options: ['啊！好可愛的小精靈！', '桌上有兩個小精靈。'], clue: '提示：哪一句把驚喜的心情喊出來了？', explain: '「啊！」把驚喜喊出來，是感嘆。' },
            { id: 'rh-ex-p2', mark: ['唉！'], options: ['唉！皮革又用完了。', '皮革用完了。'], clue: '提示：哪一句把無奈的心情喊出來了？', explain: '「唉！」說出了無奈，是感嘆。' },
            { id: 'rh-ex-p3', mark: ['哇！'], options: ['哇！這雙鞋好閃亮！', '這雙鞋很亮。', '這雙鞋像鏡子。'], clue: '提示：哪一句把讚嘆的心情喊出來了？', explain: '「哇！」說出了讚嘆，是感嘆。' },
            { id: 'rh-ex-p4', mark: ['哎呀！'], options: ['哎呀！我的針掉了！', '我的針掉了。', '針去哪裡了呢？'], clue: '提示：哪一句把著急的心情喊出來了？', explain: '「哎呀！」說出了著急，是感嘆。' },
            { id: 'rh-ex-p5', mark: ['多麼合身啊！'], options: ['這件衣服多麼合身啊！', '這件衣服很合身。', '衣服在對我笑。', '衣服像一朵花。'], clue: '提示：哪一句用驚嘆號，把開心喊出來了？', explain: '「多麼合身啊！」把開心喊出來，是感嘆。' },
            { id: 'rh-ex-p6', mark: ['太好了！'], options: ['太好了！我們有新鞋了！', '我們有新鞋了。', '新鞋在跳舞。', '誰送的新鞋呢？'], clue: '提示：哪一句把高興的心情喊出來了？', explain: '「太好了！」說出了高興，是感嘆。' }
          ] },
        { key: 'question', name: '設問', meaning: '用問句來說話，引起大家注意。有時自己問、自己回答；有時只問不答，答案就藏在問題裡。', example: '小精靈看到桌上和平常不一樣，連問了兩個問題，說出心裡的疑惑。',
          show: { sentence: '是誰在半夜幫忙呢？原來是兩個小精靈。' },
          yesno: [
            { id: 'rh-qu-y1', sentence: '有誰不愛吃巧克力呢？', answer: true, clue: '提示：這句話有沒有用問句說，答案藏在問題裡？', explain: '是設問：意思是大家都愛吃巧克力。' },
            { id: 'rh-qu-y2', sentence: '我愛吃巧克力。', answer: false, clue: '提示：這句話有沒有用問句？', explain: '不是設問：這句話只是說出自己愛吃。' }
          ],
          pick: [
            { id: 'rh-qu-p1', options: ['為什麼鞋子做好了？因為小精靈幫忙。', '小精靈幫忙做鞋子。'], clue: '提示：哪一句先問問題，再自己回答？', explain: '先問「為什麼鞋子做好了」，再回答，是設問。' },
            { id: 'rh-qu-p2', options: ['有什麼比收到禮物更開心呢？', '收到禮物很開心。'], clue: '提示：哪一句用了問句，答案藏在問題裡？', explain: '「有什麼比收到禮物更開心呢？」是設問：意思是收到禮物最開心。' },
            { id: 'rh-qu-p3', options: ['怎麼可以不說謝謝呢？', '我們要說聲感謝。', '感謝像一朵花。'], clue: '提示：哪一句用了問句？', explain: '「怎麼可以不說謝謝呢？」是設問：意思是一定要說謝謝。' },
            { id: 'rh-qu-p4', options: ['為什麼天會下雨？因為雲太重了。', '今天下雨了。', '雨點在跳舞。'], clue: '提示：哪一句先問問題，再自己回答？', explain: '先問「為什麼天會下雨」，再回答，是設問。' },
            { id: 'rh-qu-p5', options: ['難道你不想知道答案嗎？', '我想知道答案。', '答案很簡單。', '答案像寶藏。'], clue: '提示：哪一句用了問句，答案藏在問題裡？', explain: '「難道你不想知道答案嗎？」是設問：意思是一定很想知道。' },
            { id: 'rh-qu-p6', options: ['誰能像小精靈一樣靈巧呢？', '小精靈很靈巧。', '小精靈像小鳥。', '哇！小精靈好厲害！'], clue: '提示：哪一句用了問句？', explain: '「誰能像小精靈一樣靈巧呢？」是設問：意思是沒有人比小精靈更靈巧。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '哇！店裡擠滿了客人！', answer: '感嘆', mark: ['哇！'], clue: '提示：有沒有把驚訝的心情大聲喊出來？', explain: '答案是「感嘆」：「哇」說出了驚訝。' },
        { id: 'rh2', sentence: '唉！又下雨了。', answer: '感嘆', mark: ['唉！'], clue: '提示：有沒有用一個聲音，說出失望的心情？', explain: '答案是「感嘆」：「唉」說出了失望。' },
        { id: 'rh3', sentence: '為什麼要早睡？因為身體才會長高。', answer: '設問', clue: '提示：這句話是不是先問問題，再自己回答？', explain: '答案是「設問」：先問為什麼，再說原因。' },
        { id: 'rh4', sentence: '誰會不愛自己的家呢？', answer: '設問', clue: '提示：這句話有沒有用問句，答案藏在問題裡？', explain: '答案是「設問」：意思是大家都愛自己的家。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L12 = d; }
})(this);
