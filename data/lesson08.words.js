/* 第 8 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qb: 'extract', qd: 'extract', qe: 'extract', qf: 'extract', qj: 'extract', qa: 'infer', qc: 'infer', qg: 'interpret', qh: 'interpret',
      qi: 'evaluate', k1: 'evaluate', k2: 'evaluate' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qg: { think: ['哪一座建築是兩棟一模一樣的大樓？', '兩棟大樓中間有什麼，把它們連在一起，像手牽著手？'], why: '吉隆坡的雙峰塔是兩棟一模一樣的大樓，中間還有一座連通橋接在一起，就像兩隻長頸鹿手牽著手。' },
      qh: { think: ['大樓很有特色以後，別的地方的人會不會想來看？', '很多人來參觀，城市會變得怎麼樣？'], why: '有特色的大樓會讓城市變得很有名，吸引很多人來參觀，也帶來做生意的機會。大樓不會讓天氣變涼快。' },
      qi: { think: ['台北一○一的外形像什麼？外面有什麼圖案？這些是不是很久以前就有的東西？', '台北一○一裡面裝了什麼？那是不是新的科技？'], why: '台北一○一外形像竹子、外面有古錢圖案，這些是傳統的東西；裡面裝了阻尼器，是新的科技。所以它同時有傳統和科技。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我最喜歡晴空塔，因為它白白藍藍的，好像融進天空。', '我最喜歡台北一○一，因為它像竹子，還會放跨年煙火。'], bad: ['我最喜歡金字塔，因為它在沙漠裡。', '我都不喜歡，因為我沒有去過。'], why: '題目問的是課文裡的三座大樓。晴空塔、台北一○一都是課文介紹的，也說了原因。金字塔不是這三座之一；沒去過也可以從課文認識，再說說喜歡哪一座。' },
      k2: { good: ['我會設計一座像鳳梨的大樓，因為我的家鄉出產鳳梨。', '我會設計一座像海浪的大樓，因為我的家鄉在海邊。'], bad: ['我會設計一座很普通、什麼特色都沒有的大樓。', '我不想設計，蓋房子太麻煩了。'], why: '代表家鄉的大樓，要和家鄉的特色有關，像特產或風景。很普通的大樓看不出家鄉的特色；不想設計就沒有回答問題。' }
    },
    hanzi: [
      { id: 'h-臨', combo: { type: '會意字', pict: '很久以前的「臨」，像一個人彎著身子，睜大眼睛往下看很多東西。從高處往下看，或是來到一個地方，就是「臨」。' }, char: '臨', zhuyin: 'ㄌㄧㄣˊ', radical: '臣', strokes: 17, words: ['居高臨下', '光臨'], say: '臨，光臨的臨', cloze: '光＿', img: 'cw-welcome-shop.png', options: ['臨', '監', '鹽', '覽'], clue: '這個字的左邊是「臣」，右邊下面有三個「口」。', explain: '答案是「臨」；「監」的下面是「皿」，「鹽」的下面也是「皿」，「覽」的下面是「見」。', parts: ['臣', '𠂉', '品'], story: '「臨」像一個人彎著身子往下看。從高處往下看叫「居高臨下」；客人來到店裡，就說「歡迎光臨」。', sentence: '歡迎光臨我們的小店。' },
      { id: 'h-樓', combo: { layout: 'lr', parts: [['木', 'm', '木頭'], ['婁', 's', '']] }, char: '樓', zhuyin: 'ㄌㄡˊ', radical: '木', strokes: 15, words: ['大樓', '樓梯'], say: '樓，樓梯的樓', cloze: '＿梯', img: 'cw-stairs.png', options: ['樓', '摟', '褸', '縷'], clue: '這個字的右邊是「婁」，左邊和樹木有關。', explain: '答案是「樓」，左邊是木字旁；「摟」的左邊是提手旁，「縷」的左邊是絲線。', parts: ['木', '婁'], story: '左邊是木，右邊的「婁」念起來像「樓」。用木頭蓋起來、有好幾層的房子，就是「樓」。', sentence: '我一階一階的爬樓梯回家。', build: { layout: 'lr', show: ['？', '婁'], answer: '木', options: ['木', '扌', '衤', '糸'], clue: '想一想：以前的房子多半用樹砍下來的材料蓋。' } },
      { id: 'h-頸', combo: { layout: 'lr', parts: [['巠', 's', ''], ['頁', 'm', '頭']] }, char: '頸', zhuyin: 'ㄐㄧㄥˇ', radical: '頁', strokes: 16, words: ['長頸鹿', '頸部'], say: '頸，頸部的頸', cloze: '＿部', img: 'cw-neck-scarf.png', options: ['頸', '勁', '經', '徑'], clue: '這個字的左邊是「巠」，右邊和頭有關。', explain: '答案是「頸」，右邊是「頁」；「勁」的右邊是「力」，「經」的左邊是絲線，「徑」的左邊是雙人旁。', parts: ['巠', '頁'], story: '左邊的「巠」念起來像「頸」，右邊的「頁」和頭有關。頭下面連著身體的地方，就是「頸」，也就是脖子。', sentence: '冬天要用圍巾保護頸部。', build: { layout: 'lr', show: ['巠', '？'], answer: '頁', options: ['頁', '力', '糸', '彳'], clue: '想一想：脖子在頭的下面，右邊放和頭有關的部件。' } },
      { id: 'h-代', combo: { layout: 'lr', parts: [['亻', 'm', '人'], ['弋', 's', '']] }, char: '代', zhuyin: 'ㄉㄞˋ', radical: '人', strokes: 5, words: ['代表', '代替'], say: '代，代替的代', cloze: '＿替', img: 'cw-substitute.png', options: ['代', '伐', '袋', '貸'], clue: '這個字的左邊是單人旁，右邊是「弋」。', explain: '答案是「代」；「伐」的右邊是「戈」，「袋」的下面多了「衣」，「貸」的下面多了「貝」。', parts: ['亻', '弋'], story: '左邊是人，右邊的「弋」念起來有點像「代」。換一個人來做，就是「代替」。', sentence: '媽媽生病了，爸爸代替她來接我。', build: { layout: 'lr', show: ['？', '弋'], answer: '亻', options: ['亻', '彳', '扌', '木'], clue: '想一想：換另一個人來做，左邊和人有關。' } },
      { id: 'h-濟', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['齊', 's', '']] }, char: '濟', zhuyin: 'ㄐㄧˋ', radical: '水', strokes: 17, words: ['經濟', '救濟'], say: '濟，救濟的濟', cloze: '救＿', img: 'cw-relief-goods.png', options: ['濟', '擠', '劑', '齊'], clue: '這個字的右邊是「齊」，左邊和水有關。', explain: '答案是「濟」，左邊是三點水；「擠」的左邊是提手旁，「劑」的右邊是立刀旁。', parts: ['氵', '齊'], story: '左邊是水，右邊的「齊」念起來有點像「濟」。很久以前說渡過河水，後來說幫助別人度過困難，像「救濟」。', sentence: '大家捐出物資，救濟受災的家庭。', build: { layout: 'lr', show: ['？', '齊'], answer: '氵', options: ['氵', '扌', '刂', '亻'], clue: '想一想：原本是渡過河水的意思。' } },
      { id: 'h-阻', combo: { layout: 'lr', parts: [['阝', 'm', '土坡'], ['且', 's', '']] }, char: '阻', zhuyin: 'ㄗㄨˇ', radical: '阜', strokes: 8, words: ['阻尼器', '阻止'], say: '阻，阻止的阻', cloze: '＿止', img: 'cw-stop-kid.png', options: ['阻', '組', '祖', '租'], clue: '這個字的右邊是「且」，左邊是耳朵旁。', explain: '答案是「阻」，左邊是耳朵旁；「組」的左邊是絲線，「祖」的左邊是示字旁，「租」的左邊是禾字旁。', parts: ['阝', '且'], story: '左邊的耳朵旁在這裡是高高的土坡，右邊的「且」念起來有點像「阻」。土坡擋住了路，就是「阻」。', sentence: '媽媽阻止弟弟去摸很燙的鍋子。', build: { layout: 'lr', show: ['？', '且'], answer: '阝', options: ['阝', '糸', '礻', '禾'], clue: '想一想：擋住路的是高高的土坡，左邊是耳朵旁。' } },
      { id: 'h-尼', combo: { type: '會意字', pict: '「尼」的上面是「尸」，像一個人；下面的「匕」也像一個人。兩個人靠得很近，原本是「親近」的意思，現在多用來念外國話的聲音。' }, char: '尼', zhuyin: 'ㄋㄧˊ', radical: '尸', strokes: 5, words: ['阻尼器', '尼龍'], say: '尼，尼龍的尼', cloze: '＿龍', img: 'cw-nylon-rope.png', options: ['尼', '泥', '呢', '妮'], clue: '這個字的上面是「尸」，下面是「匕」。', explain: '答案是「尼」；「泥」多了三點水，「呢」多了口字旁，「妮」多了女字旁。', parts: ['尸', '匕'], story: '「尼」像兩個人靠在一起。現在常用來念外國話的聲音，像「尼龍」、「阻尼器」。', sentence: '爸爸用尼龍繩把行李綁好。' },
      { id: 'h-器', combo: { type: '會意字', pict: '「器」的中間是一隻「犬」，四個角各有一個「口」，像狗守著很多個裝東西的容器。可以裝東西、用來做事的東西，就是「器」。' }, char: '器', zhuyin: 'ㄑㄧˋ', radical: '口', strokes: 16, words: ['阻尼器', '樂器'], say: '器，樂器的器', cloze: '樂＿', img: 'cw-instruments.png', options: ['器', '哭', '囂', '嚴'], clue: '這個字的四個角各有一個「口」，中間是「犬」。', explain: '答案是「器」；「哭」只有兩個口，「囂」的中間是「頁」。', parts: ['口', '口', '犬', '口', '口'], story: '中間是一隻狗，四周有四個口，像狗守著很多個容器。用來做事的東西都叫「器」，像「樂器」、「電器」。', sentence: '姐姐會彈好幾種樂器。' },
      { id: 'h-震', combo: { layout: 'tb', parts: [['雨', 'm', '天氣'], ['辰', 's', '']] }, char: '震', zhuyin: 'ㄓㄣˋ', radical: '雨', strokes: 15, words: ['地震', '震動'], say: '震，震動的震', cloze: '＿動', img: 'cw-phone-vibrate.png', options: ['震', '振', '賑', '辰'], clue: '這個字的下面是「辰」，上面和天氣有關。', explain: '答案是「震」，上面是「雨」；「振」的左邊是提手旁，「辰」上面沒有雨。', parts: ['雨', '辰'], story: '上面是「雨」，下面的「辰」念起來像「震」。打大雷的時候，聲音大到東西都在抖，就是「震」。', sentence: '手機在桌上震動了一下。', build: { layout: 'tb', show: ['？', '辰'], answer: '雨', options: ['雨', '艹', '穴', '宀'], clue: '想一想：打雷的時候東西都在抖，上面放和天氣有關的部件。' } },
      { id: 'h-京', combo: { type: '象形字', pict: '很久以前的「京」，像蓋在高高土臺上的房子。很高大的房子，在國家最重要的城市，所以首都叫「京」。' }, char: '京', zhuyin: 'ㄐㄧㄥ', radical: '亠', strokes: 8, words: ['東京', '京劇'], say: '京，京劇的京', cloze: '＿劇', img: 'cw-opera.png', options: ['京', '景', '涼', '就'], clue: '這個字的上面是一點一橫，下面是「小」。', explain: '答案是「京」；「景」的上面多了「日」，「涼」多了三點水，「就」的右邊多了「尤」。', parts: ['亠', '口', '小'], story: '「京」像蓋在高臺上的大房子。國家最重要的城市叫「京城」，日本的首都叫「東京」。', sentence: '爺爺很喜歡看京劇表演。' },
      { id: 'h-晴', combo: { layout: 'lr', parts: [['日', 'm', '太陽'], ['青', 's', '']] }, char: '晴', zhuyin: 'ㄑㄧㄥˊ', radical: '日', strokes: 12, words: ['晴空塔', '晴天'], say: '晴，晴天的晴', cloze: '＿天', img: 'cw-sunny.png', options: ['晴', '情', '清', '睛'], clue: '這個字的右邊是「青」，左邊是天上會發光的那一個。', explain: '答案是「晴」，左邊是「日」；「情」的左邊是豎心旁，「清」的左邊是三點水，「睛」的左邊是目字旁。', parts: ['日', '青'], story: '左邊是太陽，右邊的「青」念起來像「晴」。太陽出來、天空藍藍的，就是「晴天」。', sentence: '今天是大晴天，適合出去玩。', build: { layout: 'lr', show: ['？', '青'], answer: '日', options: ['日', '目', '氵', '忄'], clue: '想一想：天氣好，天上有太陽，左邊放什麼？' } },
      { id: 'h-塔', combo: { layout: 'lr', parts: [['土', 'm', '泥土'], ['荅', 's', '']] }, char: '塔', zhuyin: 'ㄊㄚˇ', radical: '土', strokes: 13, words: ['晴空塔', '燈塔'], say: '塔，燈塔的塔', cloze: '燈＿', img: 'cw-lighthouse.png', options: ['塔', '搭', '答', '荅'], clue: '這個字的右邊是「荅」，左邊和蓋房子的泥巴有關。', explain: '答案是「塔」，左邊是土字旁；「搭」的左邊是提手旁，「答」的上面是竹字頭。', parts: ['土', '荅'], story: '左邊是土，右邊的「荅」念起來像「塔」。用磚頭和泥土一層一層蓋起來、又細又高的建築，就是「塔」。', sentence: '海邊的燈塔晚上會發光。', build: { layout: 'lr', show: ['？', '荅'], answer: '土', options: ['土', '扌', '竹', '木'], clue: '想一想：塔是用磚塊和泥巴一層層蓋起來的，左邊放什麼？' } },
      { id: 'h-訊', combo: { layout: 'lr', parts: [['言', 'm', '說話'], ['卂', 's', '']] }, char: '訊', zhuyin: 'ㄒㄩㄣˋ', radical: '言', strokes: 10, words: ['通訊', '簡訊'], say: '訊，簡訊的訊', cloze: '簡＿', img: 'cw-text-message.png', options: ['訊', '迅', '汛', '訓'], clue: '這個字的右邊是「卂」，左邊和說話有關。', explain: '答案是「訊」，左邊是言字旁；「迅」有辵字旁，「汛」的左邊是三點水，「訓」的右邊是「川」。', parts: ['言', '卂'], story: '左邊是說話，右邊的「卂」有很快的意思。很快的把話傳出去，就是「訊」，像「簡訊」、「通訊」。', sentence: '媽媽傳了一封簡訊給我。', build: { layout: 'lr', show: ['？', '卂'], answer: '言', options: ['言', '辶', '氵', '口'], clue: '想一想：傳消息就是傳話，左邊放和說話有關的部首。' } },
      { id: 'h-吉', combo: { type: '會意字', pict: '「吉」的上面是「士」，下面是「口」。說出好聽、好運的話，就是「吉」，有好運、平安的意思。' }, char: '吉', zhuyin: 'ㄐㄧˊ', radical: '口', strokes: 6, words: ['吉隆坡', '吉祥'], say: '吉，吉祥的吉', cloze: '＿祥', img: 'cw-lucky.png', options: ['吉', '古', '告', '舌'], clue: '這個字的上面是「士」，下面是「口」。', explain: '答案是「吉」，上面是「士」；「古」的上面是「十」，「告」的上面是「牛」的樣子，「舌」的上面是「千」。', parts: ['士', '口'], story: '上面是「士」，下面是「口」。說好聽、帶來好運的話，就是「吉祥話」。', sentence: '過年時，大家都說吉祥話。' },
      { id: 'h-橋', combo: { layout: 'lr', parts: [['木', 'm', '木頭'], ['喬', 's', '']] }, char: '橋', zhuyin: 'ㄑㄧㄠˊ', radical: '木', strokes: 16, words: ['連通橋', '天橋'], say: '橋，天橋的橋', cloze: '天＿', img: 'cw-footbridge.png', options: ['橋', '喬', '僑', '嬌'], clue: '這個字的右邊是「喬」，左邊和樹木有關。', explain: '答案是「橋」，左邊是木字旁；「喬」沒有木，「僑」的左邊是單人旁，「嬌」的左邊是女字旁。', parts: ['木', '喬'], story: '左邊是木，右邊的「喬」是高高的意思，念起來也像「橋」。用木頭搭起來、高高跨過河的路，就是「橋」。', sentence: '我們走天橋過馬路。', build: { layout: 'lr', show: ['？', '喬'], answer: '木', options: ['木', '亻', '女', '口'], clue: '想一想：以前過河的通道多半用樹幹搭，左邊放什麼？' } }
    ],
    vocab: [
      { id: 'v-居高臨下', cloze: true, clozeOptions: ['居高臨下', '低頭走路', '躲在地底', '蹲在角落'], word: '居高臨下', meaning: '站在頂端往底部看，看得清清楚楚。', example: '我們站在山頂＿＿＿＿，整座城市都看得一清二楚。', img: 'look-down.png', options: ['居高臨下', '四面八方', '剪影', '可觀'] },
      { id: 'v-大樓', cloze: true, clozeOptions: ['大樓', '小船', '帳篷', '樹屋'], word: '大樓', meaning: '有很多層、很高的房子。', example: '這棟＿＿有一百多層高。', img: 'tall-building.png', options: ['大樓', '連通橋', '代表', '地震'] },
      { id: 'v-長頸鹿', cloze: true, clozeOptions: ['長頸鹿', '企鵝', '烏龜', '兔子'], word: '長頸鹿', meaning: '脖子特別高、身上有斑點的動物。', example: '動物園裡的＿＿＿伸著脖子吃樹葉。', img: 'giraffe.png', options: ['長頸鹿', '大樓', '剪影', '經濟'] },
      { id: 'v-代表', cloze: true, clozeOptions: ['代表', '忘記', '打破', '藏起'], word: '代表', meaning: '用一樣東西來說出另一個意思。', example: '紅色的愛心＿＿愛。', img: 'flag.png', options: ['代表', '通訊', '可觀', '居高臨下'] },
      { id: 'v-經濟', cloze: true, clozeOptions: ['經濟', '天氣', '運動', '音樂'], word: '經濟', meaning: '大家賺錢、花錢、做生意的情形。', example: '觀光客變多了，小鎮的＿＿也越來越好。', img: 'money-coins.png', options: ['經濟', '地震', '代表', '長頸鹿'] },
      { id: 'v-阻尼器', word: '阻尼器', meaning: '裝在大樓裡，讓大樓不容易搖晃的大機器。', example: '大樓裡的＿＿＿可以減少搖晃。', img: 'damper.png', options: ['阻尼器', '晴空塔', '連通橋', '大樓'] },
      { id: 'v-地震', cloze: true, clozeOptions: ['地震', '下雪', '彩虹', '日出'], word: '地震', meaning: '房子和路面突然搖晃起來。', example: '發生＿＿的時候，要趕快躲到桌子下面。', img: 'earthquake.png', options: ['地震', '經濟', '剪影', '四面八方'] },
      { id: 'v-東京', word: '東京', meaning: '日本的首都。', example: '＿＿是日本最熱鬧的城市。', img: 'tokyo.png', options: ['東京', '吉隆坡', '晴空塔', '代表'] },
      { id: 'v-晴空塔', word: '晴空塔', meaning: '在日本東京，一座又細又高的電波塔。', example: '從＿＿＿上面往下看，整個東京都看得到。', img: 'skytree.png', options: ['晴空塔', '阻尼器', '東京', '大樓'] },
      { id: 'v-通訊', cloze: true, clozeOptions: ['通訊', '睡覺', '吃飯', '跑步'], word: '通訊', meaning: '把消息、聲音傳過去，讓遠方的人收到。', example: '有了手機，＿＿變得好方便。', img: 'phone-signal.png', options: ['通訊', '經濟', '長頸鹿', '可觀'] },
      { id: 'v-可觀', cloze: true, clozeOptions: ['可觀', '很少', '一點', '沒有'], word: '可觀', meaning: '數量很多、很大。', example: '這家店一天賺的錢很＿＿。', img: 'money-pile.png', options: ['可觀', '代表', '地震', '剪影'] },
      { id: 'v-吉隆坡', word: '吉隆坡', meaning: '馬來西亞的首都。', example: '＿＿＿是一座熱鬧的熱帶城市。', img: 'kl-city.png', options: ['吉隆坡', '東京', '阻尼器', '經濟'] },
      { id: 'v-連通橋', cloze: true, clozeOptions: ['連通橋', '游泳池', '溜滑梯', '停車場'], word: '連通橋', meaning: '把兩棟大樓接在一起，讓人在半空中走過去的走道。', example: '兩棟大樓中間有一座＿＿＿，走過去不用下樓。', img: 'sky-bridge.png', options: ['連通橋', '大樓', '通訊', '居高臨下'] },
      { id: 'v-剪影', cloze: true, clozeOptions: ['剪影', '彩虹', '地圖', '照片'], word: '剪影', meaning: '只看得到外形、黑黑的一片圖案。', example: '夕陽下，高樓變成了一片黑色的＿＿。', img: 'silhouette.png', options: ['剪影', '可觀', '長頸鹿', '代表'] },
      { id: 'v-四面八方', cloze: true, clozeOptions: ['四面八方', '同一個角落', '只有一邊', '原地不動'], word: '四面八方', meaning: '前後左右，每一個角落。', example: '鑼聲一響，人們從＿＿＿＿跑過來看熱鬧。', img: 'all-directions.png', options: ['四面八方', '居高臨下', '經濟', '地震'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-臨', char: '臨', img: 'cw-welcome-shop.png', charMeaning: '來到；從高處往下看。', word: '光臨', meaning: '客人來到店裡或家裡。', example: '歡迎＿＿，請進！', options: ['光臨', '頸部', '尼龍', '晴天'] },
      { id: 'cw-樓', char: '樓', img: 'cw-stairs.png', charMeaning: '有好幾層的房子。', word: '樓梯', meaning: '一階一階讓人走上走下的通道。', example: '我一階一階的爬＿＿回家。', options: ['樓梯', '代替', '樂器', '吉祥'] },
      { id: 'cw-頸', char: '頸', img: 'cw-neck-scarf.png', charMeaning: '脖子。', word: '頸部', meaning: '脖子。', example: '冬天要用圍巾保護＿＿。', options: ['頸部', '救濟', '震動', '天橋'] },
      { id: 'cw-代', char: '代', img: 'cw-substitute.png', charMeaning: '換別人來做。', word: '代替', meaning: '換一個人或東西來做。', example: '媽媽生病了，爸爸＿＿她來接我。', options: ['代替', '阻止', '京劇', '簡訊'] },
      { id: 'cw-濟', char: '濟', img: 'cw-relief-goods.png', charMeaning: '幫助別人度過困難。', word: '救濟', meaning: '送錢或東西，幫助有困難的人。', example: '大家捐出物資，＿＿受災的家庭。', options: ['救濟', '光臨', '燈塔', '樂器'] },
      { id: 'cw-阻', char: '阻', img: 'cw-stop-kid.png', charMeaning: '擋住。', word: '阻止', meaning: '擋住，不讓別人去做。', example: '媽媽＿＿弟弟去摸很燙的鍋子。', options: ['阻止', '樓梯', '晴天', '吉祥'] },
      { id: 'cw-尼', char: '尼', img: 'cw-nylon-rope.png', charMeaning: '念外國話聲音的字。', word: '尼龍', meaning: '一種很堅固的人造材料，可以做繩子和衣服。', example: '爸爸用＿＿繩把行李綁好。', options: ['尼龍', '代替', '簡訊', '震動'] },
      { id: 'cw-器', char: '器', img: 'cw-instruments.png', charMeaning: '用來做事的東西。', word: '樂器', meaning: '可以演奏出音樂的東西。', example: '姐姐會彈好幾種＿＿。', options: ['樂器', '頸部', '天橋', '救濟'] },
      { id: 'cw-震', char: '震', img: 'cw-phone-vibrate.png', charMeaning: '抖動、搖動。', word: '震動', meaning: '一直快速的抖動。', example: '手機在桌上＿＿了一下。', options: ['震動', '阻止', '光臨', '尼龍'] },
      { id: 'cw-京', char: '京', img: 'cw-opera.png', charMeaning: '國家最重要的城市。', word: '京劇', meaning: '一種畫著臉譜、穿著漂亮戲服唱戲的表演。', example: '爺爺很喜歡看＿＿表演。', options: ['京劇', '樓梯', '震動', '燈塔'] },
      { id: 'cw-晴', char: '晴', img: 'cw-sunny.png', charMeaning: '太陽出來、天氣好。', word: '晴天', meaning: '太陽出來、沒有下雨的好天氣。', example: '今天是大＿＿，適合出去玩。', options: ['晴天', '救濟', '京劇', '代替'] },
      { id: 'cw-塔', char: '塔', img: 'cw-lighthouse.png', charMeaning: '又細又高的建築。', word: '燈塔', meaning: '海邊高高的建築，晚上發光，幫船找到方向。', example: '海邊的＿＿晚上會發光。', options: ['燈塔', '尼龍', '阻止', '頸部'] },
      { id: 'cw-訊', char: '訊', img: 'cw-text-message.png', charMeaning: '傳過來的消息。', word: '簡訊', meaning: '用手機傳的短短文字。', example: '媽媽傳了一封＿＿給我。', options: ['簡訊', '晴天', '樂器', '光臨'] },
      { id: 'cw-吉', char: '吉', img: 'cw-lucky.png', charMeaning: '好運、平安。', word: '吉祥', meaning: '好運、平安的意思。', example: '過年時，大家都說＿＿話。', options: ['吉祥', '京劇', '樓梯', '救濟'] },
      { id: 'cw-橋', char: '橋', img: 'cw-footbridge.png', charMeaning: '跨過河或馬路的路。', word: '天橋', meaning: '蓋在馬路上方，讓行人安全通過的走道。', example: '我們走＿＿過馬路。', options: ['天橋', '燈塔', '簡訊', '代替'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-同舟共濟', situationImg: 'id-row-together.png', idiom: '同舟共濟', char: '濟', meaning: '大家一條心，一起想辦法度過困難。', example: '比賽遇到困難時，全隊同舟共濟，終於贏了。', situation: '小船遇到大浪，船上的人一起用力划槳，終於平安上岸。',
        fill: { options: ['颱風過後，全村的人＿＿＿＿，一起把家園整理好。', '遇到困難，大家各走各的，真是＿＿＿＿。'], clue: '提示：哪一句是大家一起度過困難？', explain: '第一句用得對：全村一起整理家園。各走各的，剛好相反。' } },
      { id: 'i-風雨無阻', situationImg: 'id-rain-delivery.png', idiom: '風雨無阻', char: '阻', meaning: '不管颳風下雨，都照樣去做。', example: '送報生每天風雨無阻的把報紙送來。', situation: '下著大雨，送報生還是穿著雨衣，騎腳踏車把報紙送到每一戶。',
        fill: { options: ['爺爺每天早上都去公園運動，＿＿＿＿。', '一下小雨，他就不去上課了，真是＿＿＿＿。'], clue: '提示：哪一句是不管天氣怎樣都照樣做？', explain: '第一句用得對：爺爺每天都去運動。一下雨就不去，剛好相反。' } },
      { id: 'i-震耳欲聾', situationImg: 'id-loud-firecracker.png', idiom: '震耳欲聾', char: '震', meaning: '聲音大到耳朵好像快要被震壞了。', example: '演唱會的音樂震耳欲聾，大家都在尖叫。', situation: '廟口的鞭炮響個不停，旁邊的人都摀住耳朵。',
        fill: { options: ['工地的機器聲＿＿＿＿，吵得大家沒辦法睡。', '圖書館裡很安靜，聲音＿＿＿＿。'], clue: '提示：哪一句是聲音非常非常大？', explain: '第一句用得對：機器聲大到大家睡不著。圖書館很安靜，剛好相反。' } },
      { id: 'i-聚沙成塔', situationImg: 'id-piggy-bank.png', idiom: '聚沙成塔', char: '塔', meaning: '一點一點的累積，最後會變得很多。', example: '每天存一點零用錢，聚沙成塔，就能買下想要的書。', situation: '小明每天把一枚硬幣放進小豬撲滿，一年以後，撲滿變得滿滿的。',
        fill: { options: ['每天背五個生字，＿＿＿＿，一年就會認識很多字。', '他一下子就把錢全部花光，真是＿＿＿＿。'], clue: '提示：哪一句是一點一點累積變多？', explain: '第一句用得對：每天背一點，慢慢變多。一下子花光，剛好相反。' } },
      { id: 'i-吉人天相', situationImg: 'id-safe-luck.png', idiom: '吉人天相', char: '吉', meaning: '好心的人自然會有好運，平安度過危險。', example: '他在山裡迷路一整天，幸好吉人天相，被平安找到。', situation: '一位登山客在山裡迷路了，大家都很擔心，最後他平安的被救了回來。',
        fill: { options: ['奶奶跌了一跤，幸好＿＿＿＿，一點也沒受傷。', '他故意把玩具弄壞，真是＿＿＿＿。'], clue: '提示：哪一句是遇到危險，卻平安沒事？', explain: '第一句用得對：奶奶跌倒卻沒受傷，很幸運。故意弄壞玩具，和好運沒有關係。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-臨', char: '臨', wrong: '鄰', sentence: '歡迎光臨我們的小店。', options: ['臨', '鄰', '林'], clue: '這裡是說客人來到，跟鄰居沒有關係。', explain: '要改成「臨」。客人來到是「光臨」；「鄰」是鄰居的鄰。' },
      { id: 'fx-樓', char: '樓', wrong: '摟', sentence: '我一階一階的爬樓梯回家。', options: ['樓', '摟', '縷'], clue: '這裡說的是一階一階往上走的通道，想一想，哪一個字的左邊是木字旁？', explain: '要改成「樓」。往上走的通道是「樓梯」，左邊是木；「摟」的左邊是提手旁。' },
      { id: 'fx-頸', char: '頸', wrong: '勁', sentence: '冬天要用圍巾保護頸部。', options: ['頸', '勁', '經'], clue: '這裡說的是脖子，想一想，哪一個字的右邊是「頁」？', explain: '要改成「頸」。脖子是「頸部」，右邊是頁；「勁」是用力的意思。' },
      { id: 'fx-代', char: '代', wrong: '袋', sentence: '媽媽生病了，爸爸代替她來接我。', options: ['代', '袋', '伐'], clue: '這裡是說換別人來做，跟口袋沒有關係。', explain: '要改成「代」。換別人來做是「代替」；「袋」是口袋的袋。' },
      { id: 'fx-濟', char: '濟', wrong: '擠', sentence: '大家捐出物資，救濟受災的家庭。', options: ['濟', '擠', '齊'], clue: '這裡是說幫助有困難的人，跟擠來擠去沒有關係。', explain: '要改成「濟」。幫助有困難的人是「救濟」，有三點水；「擠」是擁擠的擠。' },
      { id: 'fx-阻', char: '阻', wrong: '組', sentence: '媽媽阻止弟弟去摸很燙的鍋子。', options: ['阻', '組', '祖'], clue: '這裡是說擋住不讓他做，想一想，哪一個字的左邊是耳朵旁？', explain: '要改成「阻」。擋住是「阻止」，左邊是耳朵旁；「組」是組長的組。' },
      { id: 'fx-尼', char: '尼', wrong: '泥', sentence: '爸爸用尼龍繩把行李綁好。', options: ['尼', '泥', '呢'], clue: '這裡說的是一種堅固的材料，跟泥巴沒有關係。', explain: '要改成「尼」。堅固的材料是「尼龍」；「泥」是泥巴的泥。' },
      { id: 'fx-器', char: '器', wrong: '氣', sentence: '姐姐會彈好幾種樂器。', options: ['器', '氣', '哭'], clue: '這裡說的是演奏音樂的東西，跟生氣沒有關係。', explain: '要改成「器」。演奏音樂的東西是「樂器」；「氣」是生氣的氣。' },
      { id: 'fx-震', char: '震', wrong: '振', sentence: '手機在桌上震動了一下。', options: ['震', '振', '辰'], clue: '這裡是說一直抖動，想一想，哪一個字的上面是「雨」？', explain: '要改成「震」。一直抖動是「震動」，上面是雨；「振」的左邊是提手旁。' },
      { id: 'fx-京', char: '京', wrong: '經', sentence: '爺爺很喜歡看京劇表演。', options: ['京', '經', '景'], clue: '這裡說的是畫臉譜唱戲的表演，跟經過沒有關係。', explain: '要改成「京」。畫臉譜唱戲的是「京劇」；「經」是經過的經。' },
      { id: 'fx-晴', char: '晴', wrong: '睛', sentence: '今天是大晴天，適合出去玩。', options: ['晴', '睛', '情'], clue: '這裡是說好天氣，跟眼睛沒有關係。', explain: '要改成「晴」。好天氣是「晴天」，左邊是日；「睛」是眼睛的睛。' },
      { id: 'fx-塔', char: '塔', wrong: '搭', sentence: '海邊的燈塔晚上會發光。', options: ['塔', '搭', '答'], clue: '這裡說的是高高的建築，跟搭車沒有關係。', explain: '要改成「塔」。高高的建築是「燈塔」，左邊是土；「搭」是搭車的搭。' },
      { id: 'fx-訊', char: '訊', wrong: '迅', sentence: '媽媽傳了一封簡訊給我。', options: ['訊', '迅', '汛'], clue: '這裡說的是手機傳的文字，想一想，哪一個字有言字旁？', explain: '要改成「訊」。手機傳的文字是「簡訊」，有言字旁；「迅」是迅速的迅。' },
      { id: 'fx-吉', char: '吉', wrong: '古', sentence: '過年時，大家都說吉祥話。', options: ['吉', '古', '告'], clue: '這裡是說帶來好運的話，跟古時候沒有關係。', explain: '要改成「吉」。好運的話是「吉祥話」，上面是士；「古」是古老的古。' },
      { id: 'fx-橋', char: '橋', wrong: '喬', sentence: '我們走天橋過馬路。', options: ['橋', '喬', '僑'], clue: '這裡說的是馬路上方的走道，想一想，哪一個字的左邊是木字旁？', explain: '要改成「橋」。馬路上方的走道是「天橋」，左邊是木；「喬」少了木字旁。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿居」是住在隔壁的人。', sentence: '我們的＿居很親切。', frame: '＿居', options: ['鄰', '臨'], answer: '鄰', clue: '提示：這個字的右邊是耳朵旁。', explain: '答案是「鄰」；「臨」是光臨的臨。' },
      { id: 's2', meaning: '「口＿」是縫在衣服上、可以放東西的地方。', sentence: '我把糖果放進口＿。', frame: '口＿', options: ['袋', '代'], answer: '袋', clue: '提示：這個字的下面是「衣」。', explain: '答案是「袋」；「代」是代替的代。' },
      { id: 's3', meaning: '「擁＿」是人很多，貼在一起。', sentence: '捷運上人好多，好擁＿。', frame: '擁＿', options: ['擠', '濟'], answer: '擠', clue: '提示：這個字的左邊是提手旁。', explain: '答案是「擠」；「濟」是救濟的濟，有三點水。' },
      { id: 's4', meaning: '「＿長」是小隊裡面帶頭的人。', sentence: '我被選為這一組的＿長。', frame: '＿長', options: ['組', '阻'], answer: '組', clue: '提示：這個字的左邊是絲線。', explain: '答案是「組」；「阻」是阻止的阻。' },
      { id: 's5', meaning: '「＿巴」是土和水混在一起。', sentence: '下過雨，路上都是＿巴。', frame: '＿巴', options: ['泥', '尼'], answer: '泥', clue: '提示：這個字的左邊是三點水。', explain: '答案是「泥」；「尼」是尼龍的尼。' },
      { id: 's6', meaning: '「空＿」是我們呼吸的東西。', sentence: '山上的空＿好新鮮。', frame: '空＿', options: ['氣', '器'], answer: '氣', clue: '提示：這個字的裡面是「米」。', explain: '答案是「氣」；「器」是樂器的器。' },
      { id: 's7', meaning: '「風＿」是看起來很美的地方。', sentence: '山上的風＿好美。', frame: '風＿', options: ['景', '京'], answer: '景', clue: '提示：這個字的上面是「日」。', explain: '答案是「景」；「京」是京劇的京。' },
      { id: 's8', meaning: '「眼＿」是看東西的器官。', sentence: '小狗的眼＿圓圓亮亮的。', frame: '眼＿', options: ['睛', '晴'], answer: '睛', clue: '提示：這個字的左邊是目字旁。', explain: '答案是「睛」；「晴」是晴天的晴。' },
      { id: 's9', meaning: '「＿車」是坐上車子出門。', sentence: '我們＿公車去動物園。', frame: '＿公車', options: ['搭', '塔'], answer: '搭', clue: '提示：這個字的左邊是提手旁。', explain: '答案是「搭」；「塔」是燈塔的塔。' },
      { id: 's10', meaning: '「＿速」是非常快。', sentence: '消防車＿速趕到火災現場。', frame: '＿速', options: ['迅', '訊'], answer: '迅', clue: '提示：這個字有辵字旁。', explain: '答案是「迅」；「訊」是簡訊的訊。' },
      { id: 's11', meaning: '「＿老」是很久很久以前的。', sentence: '這是一座很＿老的廟。', frame: '＿老', options: ['古', '吉'], answer: '古', clue: '提示：這個字的上面是「十」。', explain: '答案是「古」；「吉」是吉祥的吉。' },
      { id: 's12', meaning: '「心＿」是心裡的感覺。', sentence: '考了一百分，我的心＿好好。', frame: '心＿', options: ['情', '晴'], answer: '情', clue: '提示：這個字的左邊是豎心旁。', explain: '答案是「情」；「晴」是晴天的晴。' }
    ],
    listen: [
      { id: 'l1', text: '站在很高的地方，往下看整座城市。', answer: 0, options: [{ text: '居高臨下', img: 'look-down.png' }, { text: '剪影', img: 'silhouette.png' }, { text: '通訊', img: 'phone-signal.png' }, { text: '地震', img: 'earthquake.png' }] },
      { id: 'l2', text: '脖子很長，可以吃到高高樹上的葉子。', answer: 0, options: [{ text: '長頸鹿', img: 'giraffe.png' }, { text: '大樓', img: 'tall-building.png' }, { text: '代表', img: 'flag.png' }, { text: '可觀', img: 'money-pile.png' }] },
      { id: 'l3', text: '地面突然搖晃，書從書架上掉下來。', answer: 0, options: [{ text: '地震', img: 'earthquake.png' }, { text: '經濟', img: 'money-coins.png' }, { text: '連通橋', img: 'sky-bridge.png' }, { text: '剪影', img: 'silhouette.png' }] },
      { id: 'l4', text: '裝在大樓裡，讓大樓不會搖來搖去。', answer: 0, options: [{ text: '阻尼器', img: 'damper.png' }, { text: '晴空塔', img: 'skytree.png' }, { text: '通訊', img: 'phone-signal.png' }, { text: '長頸鹿', img: 'giraffe.png' }] },
      { id: 'l5', text: '夕陽下，高樓只看得到黑黑的外形。', answer: 0, options: [{ text: '剪影', img: 'silhouette.png' }, { text: '居高臨下', img: 'look-down.png' }, { text: '代表', img: 'flag.png' }, { text: '大樓', img: 'tall-building.png' }] },
      { id: 'l6', text: '兩棟大樓中間，讓人在半空中走過去。', answer: 0, options: [{ text: '連通橋', img: 'sky-bridge.png' }, { text: '阻尼器', img: 'damper.png' }, { text: '四面八方', img: 'all-directions.png' }, { text: '經濟', img: 'money-coins.png' }] },
      { id: 'l7', text: '人們從前後左右，每個方向走過來。', answer: 0, options: [{ text: '四面八方', img: 'all-directions.png' }, { text: '居高臨下', img: 'look-down.png' }, { text: '可觀', img: 'money-pile.png' }, { text: '地震', img: 'earthquake.png' }] },
      { id: 'l8', text: '金幣堆得像小山一樣高，數量好多。', answer: 0, options: [{ text: '可觀', img: 'money-pile.png' }, { text: '代表', img: 'flag.png' }, { text: '剪影', img: 'silhouette.png' }, { text: '通訊', img: 'phone-signal.png' }] }
    ],
    /* ---------- 短語短句、造句、句型、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      /* 拼短語（短語）每一格下面寫要放什麼樣的詞 */
      fillLabels: { before: '做什麼', answer: '怎麼樣', noun: '什麼東西' },
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看是什麼樣子。',
      /* 短語：做什麼（……著）＋怎麼樣＋的＋什麼東西（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '飄著清新的花香', img: 'pr-flower-smell.png',
        parts: [{ text: '飄著', role: '做什麼' }, { text: '清新', role: '怎麼樣' }, { text: '的' }, { text: '花香', role: '什麼東西' }],
        explain: '先說正在做什麼（……著），再說它怎麼樣，加上「的」，最後說是什麼東西。' },
      pick: [
        { id: 'ph1', img: 'pr-wave-flag.png', before: '揮著', noun: '旗子', ask: '揮著什麼樣的旗子', look: '再看看圖片，旗子是什麼顏色？', options: ['鮮豔', '苦澀', '冰冷', '安靜'], clue: '提示：紅的、黃的，顏色好亮、好搶眼。', explain: '答案是「鮮豔」，完整的短語是「揮著鮮豔的旗子」。' },
        { id: 'ph2', img: 'pr-wear-hat.png', before: '戴著', noun: '帽子', ask: '戴著什麼樣的帽子', look: '再看看圖片，帽子上有什麼？', options: ['可愛', '苦澀', '冰冷', '吵鬧'], clue: '提示：帽子上有兔耳朵，大家看了都想摸一摸。', explain: '答案是「可愛」，完整的短語是「戴著可愛的帽子」。' },
        { id: 'ph3', img: 'pr-hear-bird.png', before: '聽著', noun: '鳥叫聲', ask: '聽著什麼樣的鳥叫聲', look: '再看看圖片，孩子聽得開不開心？', options: ['悅耳', '刺鼻', '苦澀', '冰冷'], clue: '提示：好好聽，讓人想一直聽下去。', explain: '答案是「悅耳」，完整的短語是「聽著悅耳的鳥叫聲」。' },
        { id: 'ph4', img: 'pr-drink-tea.png', before: '喝著', noun: '奶茶', ask: '喝著什麼樣的奶茶', look: '再看看圖片，杯子是不是冒著煙？', options: ['溫熱', '冰冷', '苦澀', '吵鬧'], clue: '提示：冬天捧在手上，手都暖起來了。', explain: '答案是「溫熱」，完整的短語是「喝著溫熱的奶茶」。' },
        { id: 'ph5', img: 'pr-watch-fireworks.png', before: '看著', noun: '煙火', ask: '看著什麼樣的煙火', look: '再看看圖片，天空變成什麼樣子？', options: ['燦爛', '黯淡', '苦澀', '安靜'], clue: '提示：天空一下子好亮、好多顏色。', explain: '答案是「燦爛」，完整的短語是「看著燦爛的煙火」。' },
        { id: 'ph6', img: 'pr-ride-bike.png', before: '騎著', noun: '腳踏車', ask: '騎著什麼樣的腳踏車', look: '再看看圖片，腳踏車看起來新不新？', options: ['嶄新', '破舊', '苦澀', '吵鬧'], clue: '提示：剛買回來，亮晶晶的，一點刮痕都沒有。', explain: '答案是「嶄新」，完整的短語是「騎著嶄新的腳踏車」。' }
      ],
      say: [],
      /* 短句：什麼＋是＋哪裡＋最＋怎麼樣＋的＋什麼（課本的例子是課文原句，這裡換成自己寫的） */
      phrase2: {
        intro: { example: '大榕樹是學校最老的樹', img: 'pz-school-tree.png',
          parts: [{ text: '大榕樹', role: '什麼' }, { text: '是' }, { text: '學校', role: '哪裡' }, { text: '最' }, { text: '老', role: '怎麼樣' }, { text: '的' }, { text: '樹', role: '什麼東西' }],
          explain: '先說是什麼，再說它「是」哪裡「最」怎麼樣的東西。這樣就能介紹一個地方最特別的東西。' },
        pick: [
          { id: 'p2-pz1', img: 'pz-night-market.png', before: '夜市是我們鎮上最', noun: '地方', ask: '夜市是我們鎮上最怎麼樣的地方', look: '再看看圖片，夜市裡的人多不多？', options: ['熱鬧', '安靜', '冰冷', '苦澀'], clue: '提示：晚上燈火通明，人來人往。', explain: '答案是「熱鬧」，完整的短句是「夜市是我們鎮上最熱鬧的地方」。' },
          { id: 'p2-pz2', img: 'pz-zoo-elephant.png', before: '大象是動物園裡最', noun: '動物', ask: '大象是動物園裡最怎麼樣的動物', look: '再看看圖片，大象和旁邊的動物比起來怎麼樣？', options: ['巨大', '矮小', '苦澀', '吵鬧'], clue: '提示：其他動物站在牠旁邊，看起來都好小。', explain: '答案是「巨大」，完整的短句是「大象是動物園裡最巨大的動物」。' },
          { id: 'p2-pz3', img: 'pz-class-tall.png', before: '哥哥是班上最', noun: '學生', ask: '哥哥是班上最怎麼樣的學生', look: '再看看圖片，哥哥站在哪裡？', options: ['高', '矮', '慢', '小'], clue: '提示：大家排成一排，他的頭比別人多出一截。', explain: '答案是「高」，完整的短句是「哥哥是班上最高的學生」。' },
          { id: 'p2-pz4', img: 'pz-curry-lunch.png', before: '咖哩飯是學校最', noun: '午餐', ask: '咖哩飯是學校最怎麼樣的午餐', look: '再看看圖片，大家是不是排隊要拿？', options: ['受歡迎', '難吃', '冰冷', '苦澀'], clue: '提示：大家都排隊搶著要拿這一道。', explain: '答案是「受歡迎」，完整的短句是「咖哩飯是學校最受歡迎的午餐」。' },
          { id: 'p2-pz5', img: 'pz-park-slide.png', before: '溜滑梯是公園裡最', noun: '設施', ask: '溜滑梯是公園裡最怎麼樣的設施', look: '再看看圖片，孩子們是不是排隊要玩？', options: ['好玩', '無聊', '危險', '安靜'], clue: '提示：很多孩子排隊，一溜再溜都不會膩。', explain: '答案是「好玩」，完整的短句是「溜滑梯是公園裡最好玩的設施」。' }
        ],
        fill: [
          { id: 'pz1', img: 'pz-night-market.png', parts: ['夜市', '是', '我們鎮上', '最', '熱鬧', '的', '地方'] },
          { id: 'pz2', img: 'pz-zoo-elephant.png', parts: ['大象', '是', '動物園裡', '最', '巨大', '的', '動物'] },
          { id: 'pz3', img: 'pz-class-tall.png', parts: ['哥哥', '是', '班上', '最', '高', '的', '學生'] },
          { id: 'pz4', img: 'pz-curry-lunch.png', parts: ['咖哩飯', '是', '學校', '最', '受歡迎', '的', '午餐'] },
          { id: 'pz5', img: 'pz-park-slide.png', parts: ['溜滑梯', '是', '公園裡', '最', '好玩', '的', '設施'] }
        ]
      },
      words: [
        { word: '居高臨下', meaning: '站在很高的地方，往下看。', img: 'look-down.png' },
        { word: '剪影', meaning: '只看得到外形、黑黑的一片圖案。', img: 'silhouette.png' },
        { word: '四面八方', meaning: '周圍每一個方向、每一個地方。', img: 'all-directions.png' }
      ],
      choose: [
        { id: 'pw1', word: '居高臨下', options: ['我們站在山頂居高臨下，整座城市都看得清清楚楚。', '我們躲在地下室裡，居高臨下的往上看。'], clue: '提示：想一想，「居高臨下」是站在高處，還是低處？', explain: '第一句用得對：站在山頂往下看。躲在地下室是在很低的地方，剛好相反。' },
        { id: 'pw2', word: '剪影', options: ['夕陽下，遠方的山只剩下黑色的剪影。', '她在大白天拍了一張五顏六色的剪影。'], clue: '提示：想一想，「剪影」是黑黑的外形，還是彩色的照片？', explain: '第一句用得對：夕陽下只看到山黑黑的外形。五顏六色的照片，就不是剪影。' },
        { id: 'pw3', word: '四面八方', options: ['過年時，親戚從四面八方回到奶奶家。', '我一直坐在同一個角落，從四面八方看書。'], clue: '提示：想一想，「四面八方」是很多方向，還是同一個地方？', explain: '第一句用得對：親戚從各個地方回來。一直坐在同一個角落，剛好相反。' }
      ],
      make: [
        { id: 'pm1', word: '居高臨下', clue: '提示：想想看，你站在什麼很高的地方往下看過？看到了什麼？', model: '從高樓上居高臨下，路上的車子小得像玩具。' },
        { id: 'pm2', word: '剪影', clue: '提示：想想看，什麼時候東西只看得到黑黑的外形？', model: '黃昏時，大樹變成了一個美麗的剪影。' },
        { id: 'pm3', word: '四面八方', clue: '提示：想想看，什麼時候很多人從不同的地方來到同一個地方？', model: '園遊會開始了，人們從四面八方湧進操場。' }
      ]
    },
    pattern: [
      { key: 'jiaru', id: 'jr', title: '假如……', img: 'jiaru.png',
        meaning: '用「假如」說一件還沒發生、想像出來的事，後面再說會怎麼樣。',
        examples: ['假如我是一隻海豚，我要在大海裡自由的游。'],
        match: [
          { id: 'pt-jr-m1', img: 'pt-if-fish.png', front: '假如我是一條魚，', options: ['我要游遍整片大海。', '我要在天上飛來飛去。', '我要去爬高高的山。'], clue: '提示：看看圖片，魚住在哪裡？', explain: '答案是「我要游遍整片大海」：魚住在水裡，可以在大海裡游。' },
          { id: 'pt-jr-m2', img: 'pt-if-giant.png', front: '假如我變成巨人，', options: ['我要幫忙拿下樹上的風箏。', '我要躲進小小的鞋盒裡。', '我要睡在螞蟻的家裡。'], clue: '提示：看看圖片，巨人的手伸到哪裡？', explain: '答案是「我要幫忙拿下樹上的風箏」：巨人很高，拿得到高處的東西。' },
          { id: 'pt-jr-m3', img: 'pt-if-robot.png', front: '假如家裡有一臺機器人，', options: ['它可以幫忙打掃房間。', '它可以變成一顆蘋果。', '它可以長出很多葉子。'], clue: '提示：看看圖片，機器人手上拿著什麼？', explain: '答案是「它可以幫忙打掃房間」：機器人拿著掃把在打掃。' }
        ],
        conj: [
          { id: 'pt-jr-c1', full: '假如我是一朵雲，我要飄到世界各地。', img: 'pt-if-cloud.png', sentence: '＿＿我是一朵雲，我要飄到世界各地。', options: ['假如……', '不但……更……', '當……就……'], clue: '提示：這是在想像一件不會真的發生的事。數數看有幾個空格。', explain: '答案是「假如……」：假如我是一朵雲，我要飄到世界各地。' },
          { id: 'pt-jr-c2', full: '假如天上下的是糖果，大家一定很開心。', img: 'pt-if-candy-rain.png', sentence: '＿＿天上下的是糖果，大家一定很開心。', options: ['假如……', '不但……更……', '當……就……'], clue: '提示：天上不會真的下糖果，這是在想像。數數看有幾個空格。', explain: '答案是「假如……」：假如天上下的是糖果，大家一定很開心。' },
          { id: 'pt-jr-c3', full: '假如家裡有一間樹屋，我每天都要在上面看書。', img: 'pt-if-tree-house.png', sentence: '＿＿家裡有一間樹屋，我每天都要在上面看書。', options: ['假如……', '不但……更……', '當……就……'], clue: '提示：家裡還沒有樹屋，這是在想像。數數看有幾個空格。', explain: '答案是「假如……」：假如家裡有一間樹屋，我每天都要在上面看書。' }
        ],
        half: [
          { id: 'pt-jr-h1', front: '假如我會隱形，', clue: '提示：隱形以後，你想偷偷做什麼好事？', model: '我要偷偷幫同學把教室打掃乾淨。' },
          { id: 'pt-jr-h2', front: '假如明天不用上學，', clue: '提示：不用上學的話，你想去哪裡、做什麼？', model: '我想去海邊撿貝殼。' }
        ],
        whole: [
          { id: 'pt-jr-w1', clue: '提示：先用「假如」說一件想像的事，再說你會怎麼做。想想看：假如你有一雙翅膀，你想飛去哪裡？', model: '假如我有一雙翅膀，我要飛去看外婆。' }
        ] },
      { key: 'budangeng', id: 'bdg', title: '不但……更……', img: 'budangeng.png',
        meaning: '先用「不但」說一個好處或特點，再用「更」說出比前面更厲害、更重要的事。',
        examples: ['他不但自己做完功課，更教同學寫題目。'],
        match: [
          { id: 'pt-bdg-m1', img: 'pt-bike-earth.png', front: '騎腳踏車不但能運動，', options: ['更能讓地球少一點汙染。', '更能讓雨馬上停下來。', '更能讓腳踏車變成飛機。'], clue: '提示：看看圖片，地球為什麼在笑？', explain: '答案是「更能讓地球少一點汙染」：騎腳踏車不用油，對地球很好。' },
          { id: 'pt-bdg-m2', img: 'pt-reading-know.png', front: '多讀書不但很有趣，', options: ['更能學到很多知識。', '更能讓頭髮變長。', '更能讓天空變藍。'], clue: '提示：看看圖片，孩子頭上冒出了什麼？', explain: '答案是「更能學到很多知識」：讀書可以知道很多事。' },
          { id: 'pt-bdg-m3', img: 'pt-veggie-strong.png', front: '吃青菜不但對身體好，', options: ['更能讓我們長得健康強壯。', '更能讓我們長出翅膀。', '更能讓我們變成大象。'], clue: '提示：看看圖片，孩子秀出了什麼？', explain: '答案是「更能讓我們長得健康強壯」：吃青菜讓身體更強壯。' }
        ],
        conj: [
          { id: 'pt-bdg-c1', full: '他不但跑得快，更願意教大家練跑。', img: 'pt-champion-teach.png', sentence: '他＿＿跑得快，＿願意教大家練跑。', options: ['不但……更……', '假如……', '當……就……'], clue: '提示：先說一個優點，再說一個更棒的。數數看每個空格有幾個字。', explain: '答案是「不但……更……」：他不但跑得快，更願意教大家練跑。' },
          { id: 'pt-bdg-c2', full: '做好回收不但讓環境乾淨，更能節省資源。', img: 'pt-recycle.png', sentence: '做好回收＿＿讓環境乾淨，＿能節省資源。', options: ['不但……更……', '假如……', '當……就……'], clue: '提示：先說一個好處，再說一個更重要的。數數看每個空格有幾個字。', explain: '答案是「不但……更……」：做好回收不但讓環境乾淨，更能節省資源。' },
          { id: 'pt-bdg-c3', full: '微笑不但讓自己開心，更讓別人覺得溫暖。', img: 'pt-smile.png', sentence: '微笑＿＿讓自己開心，＿讓別人覺得溫暖。', options: ['不但……更……', '假如……', '當……就……'], clue: '提示：先說一個好處，再說一個更棒的。數數看每個空格有幾個字。', explain: '答案是「不但……更……」：微笑不但讓自己開心，更讓別人覺得溫暖。' }
        ],
        half: [
          { id: 'pt-bdg-h1', front: '早睡早起不但讓身體健康，', clue: '提示：早睡早起還有什麼更好的地方？記得要說「更」。', model: '更能讓上課的精神變好。' },
          { id: 'pt-bdg-h2', front: '幫媽媽做家事不但能幫忙，', clue: '提示：做家事還能讓你學到什麼？記得要說「更」。', model: '更能學會照顧自己。' }
        ],
        whole: [
          { id: 'pt-bdg-w1', clue: '提示：先用「不但」說一個優點，再用「更」說一個更棒的。想想看：你的好朋友有哪些優點？', model: '我的好朋友不但很會畫圖，更常常幫助別人。' }
        ] }
    ],
    rhetoric: {
      cards: [
        { key: 'simile', name: '譬喻', meaning: '把一樣東西比成另一樣有相同地方的東西，讓人更容易想像。常用「像」、「好像」、「有如」。', example: '課文把台北一○一的外形比成竹子，讓人一下子就想像得出來。',
          show: { sentence: '這棟大樓高得像一把插進雲裡的劍。' },
          yesno: [
            { id: 'rh-si-y1', sentence: '晴空塔像一根白色的鉛筆。', answer: true, clue: '提示：這句話有沒有把塔比成另一樣東西？', explain: '是譬喻：把塔比成鉛筆。' },
            { id: 'rh-si-y2', sentence: '晴空塔是白色的。', answer: false, clue: '提示：這句話有沒有用「像」把東西比成別的東西？', explain: '不是譬喻：這句話只是說塔的顏色。' }
          ],
          pick: [
            { id: 'rh-si-p1', options: ['大樓的窗戶亮得像星星。', '大樓的窗戶很亮。'], clue: '提示：哪一句用了「像」，把窗戶比成另一樣東西？', explain: '「亮得像星星」是譬喻。' },
            { id: 'rh-si-p2', options: ['電梯快得像火箭。', '電梯跑得很快。'], clue: '提示：哪一句把電梯比成別的東西？', explain: '「快得像火箭」是譬喻。' },
            { id: 'rh-si-p3', options: ['城市的燈光像一片海。', '城市有很多燈。', '燈光在眨眼睛。'], clue: '提示：哪一句用「像」把燈光比成別的東西？', explain: '「像一片海」是譬喻：把燈光比成海。' },
            { id: 'rh-si-p4', options: ['兩棟大樓像一對雙胞胎。', '兩棟大樓一樣高。', '大樓有八個角。'], clue: '提示：哪一句把兩棟大樓比成另一樣東西？', explain: '「像一對雙胞胎」是譬喻。' },
            { id: 'rh-si-p5', options: ['長頸鹿的脖子像一根長竿子。', '長頸鹿的脖子很長。', '長頸鹿在吃葉子。', '長頸鹿對我笑。'], clue: '提示：哪一句用「像」把脖子比成別的東西？', explain: '「像一根長竿子」是譬喻。' },
            { id: 'rh-si-p6', options: ['從高樓往下看，人小得像螞蟻。', '高樓下面有很多人。', '我站在高樓上。', '人群在小聲說話。'], clue: '提示：哪一句把人比成另一樣東西？', explain: '「小得像螞蟻」是譬喻。' }
          ] },
        { key: 'sense', name: '摹寫', meaning: '把眼睛看到、耳朵聽到、鼻子聞到、嘴巴嘗到、身體摸到的感覺，仔細的寫出來，讓人好像自己也感受到了。', example: '課文仔細寫出晴空塔的形狀和顏色，讓人好像親眼看到一樣。',
          show: { sentence: '剛出爐的麵包香噴噴的，咬一口又鬆又軟。', mark: ['香噴噴的', '又鬆又軟'] },
          yesno: [
            { id: 'rh-se-y1', sentence: '冰淇淋冰冰涼涼，吃起來甜甜的。', answer: true, mark: ['冰冰涼涼', '甜甜的'], clue: '提示：這句話有沒有仔細寫出吃起來的感覺？', explain: '是摹寫：寫出冰淇淋摸起來和吃起來的感覺。' },
            { id: 'rh-se-y2', sentence: '我吃了冰淇淋。', answer: false, clue: '提示：這句話有沒有寫出看到、聽到、吃到的感覺？', explain: '不是摹寫：這句話只是說做了什麼事。' }
          ],
          pick: [
            { id: 'rh-se-p1', mark: ['嘩啦嘩啦'], options: ['雨嘩啦嘩啦的打在屋頂上。', '外面下雨了。'], clue: '提示：哪一句把聽到的聲音寫出來了？', explain: '「嘩啦嘩啦」寫出雨的聲音，是摹寫。' },
            { id: 'rh-se-p2', mark: ['金黃色', '香氣撲鼻'], options: ['炸雞是金黃色的，香氣撲鼻。', '我買了炸雞。'], clue: '提示：哪一句寫出了看到的顏色和聞到的味道？', explain: '寫出炸雞的顏色和香味，是摹寫。' },
            { id: 'rh-se-p3', mark: ['又軟又滑'], options: ['小貓的毛摸起來又軟又滑。', '我有一隻小貓。', '小貓像一團棉花。'], clue: '提示：哪一句寫出了摸起來的感覺？', explain: '「又軟又滑」寫出摸起來的感覺，是摹寫。' },
            { id: 'rh-se-p4', mark: ['紅的、黃的、紫的'], options: ['花園裡開著紅的、黃的、紫的花。', '花園裡有花。', '花朵在跳舞。'], clue: '提示：哪一句寫出了看到的顏色？', explain: '寫出花的顏色，是摹寫。' },
            { id: 'rh-se-p5', mark: ['酸酸甜甜'], options: ['檸檬汁酸酸甜甜，好好喝。', '我點了一杯檸檬汁。', '檸檬像一顆小太陽。', '檸檬汁真好喝！'], clue: '提示：哪一句寫出了喝起來的味道？', explain: '「酸酸甜甜」寫出喝起來的味道，是摹寫。' },
            { id: 'rh-se-p6', mark: ['轟隆轟隆'], options: ['火車轟隆轟隆的開過去。', '火車開過去了。', '火車像一條長龍。', '火車在唱歌。'], clue: '提示：哪一句把聽到的聲音寫出來了？', explain: '「轟隆轟隆」寫出火車的聲音，是摹寫。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '這座塔細得像一根針。', answer: '譬喻', clue: '提示：這句話有沒有用「像」把塔比成別的？', explain: '答案是「譬喻」：把塔比成針。' },
        { id: 'rh2', sentence: '大樓的燈光像天上的銀河。', answer: '譬喻', clue: '提示：這句話有沒有用「像」？', explain: '答案是「譬喻」：把燈光比成銀河。' },
        { id: 'rh3', sentence: '風呼呼的吹，吹在臉上冰冰涼涼的。', answer: '摹寫', mark: ['呼呼的吹', '冰冰涼涼'], clue: '提示：這句話有沒有仔細寫出聽到的聲音和摸到的感覺？', explain: '答案是「摹寫」：寫出風的聲音和吹在臉上的感覺。' },
        { id: 'rh4', sentence: '湯裡飄出一陣陣香味，喝起來鹹鹹的。', answer: '摹寫', mark: ['一陣陣香味', '鹹鹹的'], clue: '提示：這句話有沒有仔細寫出聞到和嘗到的感覺？', explain: '答案是「摹寫」：寫出湯的香味和味道。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L08 = d; }
})(this);
