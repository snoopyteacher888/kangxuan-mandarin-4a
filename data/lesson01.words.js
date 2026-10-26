/* 第 1 課字詞練習（公開、不加密）。句子和解釋都是 Claude 自己寫的，沒有課本原文。
   生字、語詞：options 的第一個是正確答案（作答時會打亂）。 */
(function (root) {
  var d = {
    /* 兩首詩，每一段是並列的想像，不是一步一步的因果，課文地圖畫成樹狀圖 */
    mapLayout: 'tree',
    /* 理解提問的分類（照課本「閱讀理解提問」）：extract 提取訊息、infer 推論訊息、interpret 詮釋整合、evaluate 比較評估。只放題號，不放課文 */
    quizLevels: { qa: 'extract', qb: 'extract', qf: 'extract', qi: 'extract', qc: 'infer', qd: 'interpret', qg: 'interpret', qh: 'interpret',
      qe: 'evaluate', qj: 'evaluate', k1: 'evaluate', k2: 'interpret' },
    /* 詮釋整合、比較評估的鷹架：think 是「想一想」的兩個步驟（不說答案），why 是「老師教你」的說明。不放課文原句 */
    quizHelp: {
      qd: { think: ['在游泳池裡玩水的時候，會濺起什麼？大家會發出什麼聲音？', '水花和笑聲是不是同時出現？這樣的時候，心情是開心還是難過？'], why: '大家在水裡玩，一邊濺起水花，一邊哈哈大笑，水花和笑聲好像連在一起。作者用這兩句話，告訴我們游泳的時候大家都玩得很開心。水珠不會真的變成聲音，也沒有人受傷。' },
      qe: { think: ['作者游呀游，最後說自己游出了哪些東西？那些是好的還是不好的？', '一個人做自己喜歡的事，會不會越來越有自信、越來越快樂？'], why: '作者說自己游出了自信、志氣，還有豐富精采的生活。意思是：認真去做自己喜歡的事，人會越來越有自信，生活也會更精采。詩裡沒有說游泳危險，也沒有要跟魚比賽。' },
      qg: { think: ['溜直排輪的時候，風從耳朵旁邊吹過，旁邊的東西一下子就不見了，代表溜得快還是慢？', '老鷹在天空飛，給人什麼感覺？是不是又快又自由？'], why: '溜得很快的時候，風呼呼的吹，旁邊的東西一下子就看不見了，好像在天空飛一樣。老鷹飛得又快又自由，所以作者把自己想像成飛鷹。直排輪不像翅膀，作者也沒有說他怕高。' },
      qh: { think: ['陀螺在地上會做什麼動作？', '作者溜直排輪時，身體做了哪些動作？和陀螺像不像？'], why: '陀螺會在地上一直轉圈圈。作者溜直排輪的時候，一下轉身、一下跳起來，轉個不停，就像一顆陀螺。所以作者把自己想像成陀螺，不是在說他跌倒或站著不動。' },
      qj: { think: ['游泳是在什麼地方做的運動？溜直排輪呢？', '「水」和「陸」各是哪一首詩？很厲害的人，可以叫做什麼？'], why: '游泳在水裡，溜直排輪在陸地上。兩種運動作者都很會，所以叫做「水陸小高手」。題目和作者住在哪裡、走多遠的路都沒有關係。' }
    },
    /* 「說說看」改成選選看：good 兩個合理的想法（選哪一個都對）、bad 兩個不合理的，why 是老師教你的說明。不放課文原句 */
    talkChoices: {
      k1: { good: ['我最喜歡打籃球，投進球的時候好開心。', '我最喜歡騎腳踏車，風吹在臉上好舒服。'], bad: ['我最喜歡睡覺，因為床很軟。', '我最喜歡吃冰淇淋，因為很甜。'], why: '題目問的是「運動」和做運動時的心情。打籃球、騎腳踏車都是運動，也說出了心情。睡覺和吃冰淇淋不是運動，所以不合理。' },
      k2: { good: ['我會把自己想像成一陣風，因為跑得好快。', '我會把自己想像成一隻獵豹，因為獵豹跑得很快。'], bad: ['我會把自己想像成一顆石頭，因為石頭很硬。', '我會把自己想像成一棵大樹，因為大樹很高。'], why: '跑步的時候要跑得快，所以要想成跑得快、動得快的東西，像風、獵豹。石頭和大樹都不會動，跟跑步的樣子不像。' }
    },
    hanzi: [
      { id: 'h-泳', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['永', 's', '']] }, char: '泳', zhuyin: 'ㄩㄥˇ', radical: '水', strokes: 8, words: ['游泳', '泳衣'], say: '泳，游泳的泳', cloze: '游＿', img: 'swim.png', options: ['泳', '永', '詠', '冰'], clue: '這個字的左邊，是三點水。', explain: '答案是「泳」，左邊是三點水；「永」是永遠的永，「詠」的左邊是言字旁。', parts: ['氵', '永'], story: '左邊是三點水，表示和水有關；右邊的「永」念起來像「泳」。在水裡划水前進，就是「游泳」。', sentence: '暑假我去學游泳。', build: { layout: 'lr', show: ['？', '永'], answer: '氵', options: ['氵', '言', '口', '扌'], clue: '想一想：游泳要在什麼裡面？' } },
      { id: 'h-串', combo: { type: '象形字', pict: '「串」像一根棍子，把兩個東西穿在一起。' }, char: '串', zhuyin: 'ㄔㄨㄢˋ', radical: '丨', strokes: 7, words: ['一串串', '串珠子'], say: '串，一串串的串', cloze: '＿珠子', img: 'beads.png', options: ['串', '中', '患', '吊'], clue: '這個字像兩個「口」疊起來，中間一豎穿過去。', explain: '答案是「串」，一豎穿過兩個「口」；「中」只有一個「口」。', parts: ['串'], story: '「串」像一根棍子，把兩個東西穿在一起。很多東西連在一起，就是「一串」。', sentence: '妹妹把珠子串成一條項鍊。' },
      { id: 'h-般', combo: { layout: 'lr', parts: [['舟', 'm', '船'], ['殳', 's', '']] }, char: '般', zhuyin: 'ㄅㄢ', radical: '舟', strokes: 10, words: ['一般', '這般'], say: '般，一般的般', cloze: '一＿', img: 'same-height.png', options: ['般', '搬', '船', '盤'], clue: '這個字的左邊，是舟字旁。', explain: '答案是「般」，左邊是舟字旁；「搬」多了提手旁，「船」是坐船的船。', parts: ['舟', '殳'], story: '左邊的「舟」是小船，右邊的「殳」像手拿著槳。划船的樣子大家都一樣，所以「一般」是一樣、普通的意思。', sentence: '他和一般的小孩一樣愛玩。', build: { layout: 'lr', show: ['？', '殳'], answer: '舟', options: ['舟', '扌', '木', '月'], clue: '想一想：「搬」的左邊是手，這個字的左邊是一艘小小的什麼？' } },
      { id: 'h-姿', combo: { layout: 'tb', parts: [['次', 's', ''], ['女', 'm', '女生']] }, char: '姿', zhuyin: 'ㄗ', radical: '女', strokes: 9, words: ['姿勢', '舞姿', '多采多姿'], say: '姿，姿勢的姿', cloze: '＿勢', img: 'pose.png', options: ['姿', '資', '咨', '姊'], clue: '這個字的上面是「次」，下面是女字。', explain: '答案是「姿」，下面是「女」；「資」的下面是「貝」，是資料的資。', parts: ['次', '女'], story: '上面的「次」念起來像「姿」，下面是「女」。女生跳舞的樣子很好看，所以身體的樣子叫「姿勢」。', sentence: '寫字的時候，坐的姿勢要正確。', build: { layout: 'tb', show: ['次', '？'], answer: '女', options: ['女', '貝', '心', '口'], clue: '想一想：「資」的下面是貝，這個字的下面是哪一個和人有關的字？' } },
      { id: 'h-溜', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['留', 's', '']] }, char: '溜', zhuyin: 'ㄌㄧㄡ', radical: '水', strokes: 13, words: ['溜冰', '溜滑梯'], say: '溜，溜冰的溜', cloze: '＿冰', img: 'skate.png', options: ['溜', '留', '遛', '榴'], clue: '這個字的左邊，是三點水。', explain: '答案是「溜」，左邊是三點水；「留」是留下來的留，「遛」是遛狗的遛。', parts: ['氵', '留'], story: '左邊是三點水，右邊的「留」念起來像「溜」。在溼溼滑滑的地方滑著走，就是「溜」。', sentence: '我們在公園溜滑梯。', build: { layout: 'lr', show: ['？', '留'], answer: '氵', options: ['氵', '扌', '木', '足'], clue: '想一想：溼溼滑滑的地方，和什麼有關？' } },
      { id: 'h-耳', combo: { type: '象形字', pict: '很久以前的「耳」，是畫一隻耳朵的樣子。' }, char: '耳', zhuyin: 'ㄦˇ', radical: '耳', strokes: 6, words: ['耳朵', '耳旁'], say: '耳，耳朵的耳', cloze: '＿朵', img: 'ear.png', options: ['耳', '目', '且', '自'], clue: '這個字是畫我們用來聽聲音的地方。', explain: '答案是「耳」，是用來聽的耳朵；「目」是眼睛，「且」是而且的且。', parts: ['耳'], story: '很久以前的「耳」，就是畫一隻耳朵。我們用耳朵聽聲音。', sentence: '兔子的耳朵長長的。' },
      { id: 'h-鷹', combo: { type: '形聲字', pict: '下面是「鳥」，表示是一種鳥；上面念起來像「應」。' }, char: '鷹', zhuyin: 'ㄧㄥ', radical: '鳥', strokes: 24, words: ['老鷹', '飛鷹'], say: '鷹，老鷹的鷹', cloze: '老＿', img: 'eagle.png', options: ['鷹', '應', '膺', '鶯'], clue: '這個字的下面，是一隻鳥。', explain: '答案是「鷹」，下面是「鳥」；「應」的下面是「心」，是應該的應。', parts: ['广', '亻', '隹', '鳥'], story: '下面是「鳥」，上面念起來像「應」。眼睛很利、飛得很快、會抓小動物的大鳥，就是「老鷹」。', sentence: '一隻老鷹在天空飛。' },
      { id: 'h-滑', combo: { layout: 'lr', parts: [['氵', 'm', '水'], ['骨', 's', '']] }, char: '滑', zhuyin: 'ㄏㄨㄚˊ', radical: '水', strokes: 13, words: ['滑行', '滑梯'], say: '滑，滑梯的滑', cloze: '＿梯', img: 'slide.png', options: ['滑', '猾', '骨', '渦'], clue: '這個字的左邊，是三點水。', explain: '答案是「滑」，左邊是三點水；「骨」是骨頭的骨，沒有三點水。', parts: ['氵', '骨'], story: '左邊是三點水，右邊的「骨」念起來有點像「滑」。地上有水，就會溼溼的、很容易「滑」倒。', sentence: '下雨天地很滑，走路要小心。', build: { layout: 'lr', show: ['？', '骨'], answer: '氵', options: ['氵', '扌', '月', '口'], clue: '想一想：地上有了什麼，就容易摔倒？' } },
      { id: 'h-遨', combo: { type: '形聲字', pict: '左下角是辵字旁，和走路、出去玩有關；裡面的「敖」念起來像「遨」。' }, char: '遨', zhuyin: 'ㄠˊ', radical: '辵', strokes: 15, words: ['遨遊'], say: '遨，遨遊的遨', cloze: '＿遊', img: 'bird-sky.png', options: ['遨', '熬', '傲', '邀'], clue: '這個字有辵字旁，裡面是「敖」。', explain: '答案是「遨」，有辵字旁；「熬」的下面是火，「傲」的左邊是單人旁。', parts: ['辶', '敖'], story: '辵字旁和走路、出去玩有關，「敖」念起來像「遨」。自由自在的到處玩，就是「遨遊」。', sentence: '小鳥在天空自由的遨遊。' },
      { id: 'h-緩', combo: { layout: 'lr', parts: [['糸', 'm', '絲線'], ['爰', 's', '']] }, char: '緩', zhuyin: 'ㄏㄨㄢˇ', radical: '糸', strokes: 15, words: ['緩緩', '緩慢'], say: '緩，緩慢的緩', cloze: '＿慢', img: 'turtle.png', options: ['緩', '暖', '援', '媛'], clue: '這個字的左邊，是糸字旁。', explain: '答案是「緩」，左邊是絲線；「暖」的左邊是「日」，是溫暖的暖。', parts: ['糸', '爰'], story: '左邊是絲線，右邊的「爰」念起來像「緩」。把線放鬆、慢慢的拉，就是「緩」，有慢慢的意思。', sentence: '烏龜緩慢的往前爬。', build: { layout: 'lr', show: ['？', '爰'], answer: '糸', options: ['糸', '日', '扌', '氵'], clue: '想一想：「暖」的左邊是太陽，這個字的左邊是細細長長的什麼？' } },
      { id: 'h-陀', combo: { layout: 'lr', parts: [['阝', 'm', '山坡'], ['它', 's', '']] }, char: '陀', zhuyin: 'ㄊㄨㄛˊ', radical: '阜', strokes: 8, words: ['陀螺'], say: '陀，陀螺的陀', cloze: '＿螺', img: 'top.png', options: ['陀', '駝', '舵', '佗'], clue: '這個字的左邊是左耳旁，右邊是「它」。', explain: '答案是「陀」，左邊是左耳旁；「駝」的左邊是「馬」，是駱駝的駝。', parts: ['阝', '它'], story: '左邊是左耳旁，右邊的「它」念起來像「陀」。會一直轉圈的玩具，叫做「陀螺」。', sentence: '爺爺教我打陀螺。', build: { layout: 'lr', show: ['？', '它'], answer: '阝', options: ['阝', '馬', '虫', '氵'], clue: '想一想：「駝」的左邊是一種動物，這個字的左邊是像耳朵的部首。' } },
      { id: 'h-螺', combo: { layout: 'lr', parts: [['虫', 'm', '小動物'], ['累', 's', '']] }, char: '螺', zhuyin: 'ㄌㄨㄛˊ', radical: '虫', strokes: 17, words: ['螺絲', '陀螺'], say: '螺，螺絲的螺', cloze: '＿絲', img: 'screw.png', options: ['螺', '騾', '累', '摞'], clue: '這個字的左邊，是虫字旁。', explain: '答案是「螺」，左邊是「虫」；「騾」的左邊是「馬」，「累」是很累的累。', parts: ['虫', '累'], story: '左邊是「虫」，右邊的「累」念起來像「螺」。田螺、海螺的殼一圈一圈的，螺絲上也有一圈一圈的紋路。', sentence: '爸爸用工具把螺絲轉緊。', build: { layout: 'lr', show: ['？', '累'], answer: '虫', options: ['虫', '馬', '糸', '金'], clue: '想一想：田螺、海螺是小小的動物，左邊要放什麼？' } },
      { id: 'h-轉', combo: { layout: 'lr', parts: [['車', 'm', '車子'], ['專', 's', '']] }, char: '轉', zhuyin: 'ㄓㄨㄢˇ', radical: '車', strokes: 18, words: ['轉身', '轉彎'], say: '轉，轉彎的轉', cloze: '＿彎', img: 'turn-left.png', options: ['轉', '傳', '專', '磚'], clue: '這個字的左邊，是車字旁。', explain: '答案是「轉」，左邊是「車」；「傳」的左邊是單人旁，「磚」的左邊是「石」。', parts: ['車', '專'], story: '左邊是「車」，車輪會一直轉；右邊的「專」念起來像「轉」。換一個方向，就是「轉」。', sentence: '走到路口要向右轉。', build: { layout: 'lr', show: ['？', '專'], answer: '車', options: ['車', '亻', '石', '扌'], clue: '想一想：什麼東西有輪子，會一直轉呀轉？' } },
      { id: 'h-躍', combo: { layout: 'lr', parts: [['足', 'm', '腳'], ['翟', 's', '']] }, char: '躍', zhuyin: 'ㄩㄝˋ', radical: '足', strokes: 21, words: ['跳躍', '活躍'], say: '躍，跳躍的躍', cloze: '跳＿', img: 'jump.png', options: ['躍', '耀', '曜', '濯'], clue: '這個字的左邊，是足字旁。', explain: '答案是「躍」，左邊是「足」；「耀」的左邊是「光」，是閃耀的耀。', parts: ['足', '翟'], story: '左邊是「足」，就是腳；右邊的「翟」像鳥張開翅膀。用腳用力一蹬、跳起來，就是「躍」。', sentence: '小青蛙在荷葉上跳躍。', build: { layout: 'lr', show: ['？', '翟'], answer: '足', options: ['足', '光', '扌', '日'], clue: '想一想：跳起來要用身體的哪個部分？' } },
      { id: 'h-煩', combo: { type: '會意字', pict: '左邊是「火」，右邊的「頁」是頭。頭熱得像火在燒，很不舒服，就是心裡很「煩」。' }, char: '煩', zhuyin: 'ㄈㄢˊ', radical: '火', strokes: 13, words: ['煩惱', '麻煩'], say: '煩，煩惱的煩', cloze: '＿惱', img: 'worry.png', options: ['煩', '燒', '頓', '須'], clue: '這個字的左邊是火字旁，右邊是「頁」。', explain: '答案是「煩」；「燒」的右邊是「堯」，「頓」和「須」的左邊都不是火。', parts: ['火', '頁'], story: '左邊是「火」，右邊的「頁」是頭。頭熱得像火在燒，心裡很不舒服，就是「煩」。', sentence: '功課太多，讓我好煩惱。', build: { layout: 'lr', show: ['？', '頁'], answer: '火', options: ['火', '水', '木', '金'], clue: '想一想：頭熱熱的，像被什麼燒到一樣？' } }
    ],
    vocab: [
      { id: 'v-游泳', word: '游泳', meaning: '人在水裡用手腳划水，讓身體往前進。', example: '天氣好熱，我們去泳池＿＿。', img: 'swim.png', options: ['游泳', '溜冰', '跳躍', '滑行'] },
      { id: 'v-晶亮', cloze: true, clozeOptions: ['晶亮', '黑暗', '模糊', '骯髒'], word: '晶亮', meaning: '閃閃發光、很乾淨的樣子。', example: '草地上的露水，在太陽下＿＿＿的。', img: 'shiny-drops.png', options: ['晶亮', '緩緩', '一般', '煩惱'] },
      { id: 'v-一串串', cloze: true, clozeOptions: ['一串串', '一片片', '一本本', '一張張'], word: '一串串', meaning: '很多個東西相連，好幾條掛著的樣子。', example: '葡萄樹上掛著＿＿＿紫色的葡萄。', img: 'grapes.png', options: ['一串串', '晶亮', '緩緩', '多采多姿'] },
      { id: 'v-一般', cloze: true, clozeOptions: ['一般', '特別', '奇怪', '少見'], word: '一般', meaning: '和大家相同、普通常見的。', example: '這隻小狗和＿＿的狗不一樣，牠會自己開門。', img: 'same-height.png', options: ['一般', '晶亮', '煩惱', '耳旁'] },
      { id: 'v-多采多姿', word: '多采多姿', meaning: '有很多變化，豐富又精采。', example: '暑假我參加了好多營隊，生活過得＿＿＿＿。', img: 'colorful-life.png', options: ['多采多姿', '一串串', '緩緩', '煩惱'] },
      { id: 'v-溜', cloze: true, clozeOptions: ['溜', '吃', '睡', '寫'], word: '溜', meaning: '在光滑的地方，或用輪子滑著走。', example: '冬天到了，我們去冰上＿冰。', img: 'skate.png', options: ['溜', '耳旁', '飛鷹', '陀螺'] },
      { id: 'v-耳旁', word: '耳旁', meaning: '耳朵的旁邊。', example: '媽媽在我的＿＿小聲的說了一個祕密。', img: 'ear.png', options: ['耳旁', '飛鷹', '陀螺', '一般'] },
      { id: 'v-飛鷹', word: '飛鷹', meaning: '在天空中飛的老鷹。', example: '一隻＿＿張開大大的翅膀，在山上盤旋。', img: 'eagle.png', options: ['飛鷹', '陀螺', '耳旁', '游泳'] },
      { id: 'v-滑行', cloze: true, clozeOptions: ['滑行', '停住', '倒退', '跌倒'], word: '滑行', meaning: '不用走路，順著地面往前溜。', example: '他踩著滑板，在廣場上快速的＿＿。', img: 'glide.png', options: ['滑行', '轉身', '遨遊', '游泳'] },
      { id: 'v-遨遊', cloze: true, clozeOptions: ['遨遊', '睡覺', '吵架', '哭泣'], word: '遨遊', meaning: '自由自在的到處玩。', example: '我好想變成小鳥，在天空中自由＿＿。', img: 'bird-sky.png', options: ['遨遊', '轉身', '跳躍', '滑行'] },
      { id: 'v-緩緩', cloze: true, clozeOptions: ['緩緩', '急急', '匆匆', '飛快'], word: '緩緩', meaning: '慢慢的、不急的。', example: '太陽＿＿的從山後升起來。', img: 'turtle.png', options: ['緩緩', '晶亮', '一般', '一串串'] },
      { id: 'v-陀螺', word: '陀螺', meaning: '一種用繩子甩出去，會在地上一直轉圈的玩具。', example: '爺爺用繩子一甩，＿＿就在地上轉個不停。', img: 'top.png', options: ['陀螺', '飛鷹', '耳旁', '游泳'] },
      { id: 'v-轉身', cloze: true, clozeOptions: ['轉身', '坐下', '躺下', '睡著'], word: '轉身', meaning: '把整個人換到另一個方向，面朝別的地方。', example: '聽到有人叫我，我馬上＿＿看後面。', img: 'turn-around.png', options: ['轉身', '跳躍', '滑行', '遨遊'] },
      { id: 'v-跳躍', cloze: true, clozeOptions: ['跳躍', '趴下', '躺平', '睡覺'], word: '跳躍', meaning: '用腳一蹬，讓身體離開地面。', example: '小狗看到主人回家，高興得一直＿＿。', img: 'jump.png', options: ['跳躍', '轉身', '游泳', '滑行'] },
      { id: 'v-煩惱', cloze: true, clozeOptions: ['煩惱', '開心', '得意', '輕鬆'], word: '煩惱', meaning: '心裡不舒服、一直放不下。', example: '找不到心愛的玩具，弟弟好＿＿。', img: 'worry.png', options: ['煩惱', '晶亮', '緩緩', '一般'] }
    ],
    /* 生字語詞：每個生字再學一個課本以外、孩子聽得懂的語詞 */
    charwords: [
      { id: 'cw-泳', char: '泳', img: 'cw-swimsuit.png', charMeaning: '在水裡游。', word: '泳衣', meaning: '游泳的時候穿的衣服。', example: '去游泳池以前，記得帶＿＿和泳帽。', options: ['泳衣', '老鷹', '麻煩', '耳朵'] },
      { id: 'cw-串', char: '串', img: 'beads.png', charMeaning: '把東西穿在一起。', word: '串珠子', meaning: '用線把珠子一顆一顆穿起來。', example: '妹妹用線＿＿＿，做成一條手鍊。', options: ['串珠子', '溜冰場', '轉彎處', '泳衣'] },
      { id: 'cw-般', char: '般', img: 'cw-so-so.png', charMeaning: '一樣、普通。', word: '一般般', meaning: '不算好也不算壞，普普通通。', example: '這家店的麵＿＿＿，沒有特別好吃。', options: ['一般般', '串珠子', '溜冰場', '麻煩'] },
      { id: 'cw-姿', char: '姿', img: 'pose.png', charMeaning: '身體的樣子。', word: '姿勢', meaning: '身體擺出來的樣子。', example: '老師提醒我們，寫字要坐正，＿＿要正確。', options: ['姿勢', '緩慢', '螺絲', '活躍'] },
      { id: 'cw-溜', char: '溜', img: 'cw-ice-rink.png', charMeaning: '滑著走。', word: '溜冰場', meaning: '可以穿冰鞋滑來滑去的地方。', example: '冬天到了，我們一起去＿＿＿玩。', options: ['溜冰場', '一般般', '串珠子', '轉彎'] },
      { id: 'cw-耳', char: '耳', img: 'ear.png', charMeaning: '用來聽聲音的地方。', word: '耳朵', meaning: '頭的兩邊，用來聽聲音的地方。', example: '兔子的＿＿又長又大。', options: ['耳朵', '老鷹', '姿勢', '泳衣'] },
      { id: 'cw-鷹', char: '鷹', img: 'eagle.png', charMeaning: '一種很會飛的大鳥。', word: '老鷹', meaning: '眼睛很利、會抓小動物的大鳥。', example: '一隻＿＿從天上飛下來，抓走了一條魚。', options: ['老鷹', '耳朵', '螺絲', '麻煩'] },
      { id: 'cw-滑', char: '滑', img: 'slide.png', charMeaning: '溜著走。', word: '溜滑梯', meaning: '公園裡從高處滑下來的遊戲器材。', example: '下課的時候，我最喜歡去玩＿＿＿。', options: ['溜滑梯', '串珠子', '一般般', '姿勢'] },
      { id: 'cw-遨', char: '遨', img: 'cw-space.png', charMeaning: '自由的到處玩。', word: '遨遊', meaning: '自由自在的到處玩。', example: '我夢見自己坐著太空船，在星星之間＿＿。', options: ['遨遊', '轉彎', '緩慢', '活躍'] },
      { id: 'cw-緩', char: '緩', img: 'cw-snail.png', charMeaning: '慢慢的。', word: '緩慢', meaning: '速度很慢，不快。', example: '蝸牛背著殼，＿＿的往前爬。', options: ['緩慢', '活躍', '轉彎', '遨遊'] },
      { id: 'cw-陀', char: '陀', img: 'top.png', charMeaning: '會轉圈的玩具。', word: '陀螺', meaning: '會在地上一直轉圈的玩具。', example: '爺爺教我用繩子打＿＿。', options: ['陀螺', '老鷹', '耳朵', '泳衣'] },
      { id: 'cw-螺', char: '螺', img: 'screw.png', charMeaning: '一圈一圈的紋路。', word: '螺絲', meaning: '上面有一圈一圈紋路，可以轉進去把東西固定的小零件。', example: '椅子搖搖晃晃的，爸爸把＿＿轉緊了。', options: ['螺絲', '陀螺', '姿勢', '老鷹'] },
      { id: 'cw-轉', char: '轉', img: 'cw-turn.png', charMeaning: '換一個方向。', word: '轉彎', meaning: '走路或開車時，換到另一個方向。', example: '公車在路口＿＿，大家都要抓好扶手。', options: ['轉彎', '緩慢', '遨遊', '泳衣'] },
      { id: 'cw-躍', char: '躍', img: 'cw-active.png', charMeaning: '跳起來；很有活力。', word: '活躍', meaning: '很有精神、很積極，常常參加活動。', example: '哥哥上課很＿＿，常常舉手回答問題。', options: ['活躍', '緩慢', '麻煩', '耳朵'] },
      { id: 'cw-煩', char: '煩', img: 'cw-trouble.png', charMeaning: '心裡不舒服；事情很多。', word: '麻煩', meaning: '事情很多、很不容易做。', example: '忘了帶鑰匙，要等媽媽回來開門，真＿＿。', options: ['麻煩', '活躍', '姿勢', '老鷹'] }
    ],
    /* 生字變成語：課本延伸成語，解釋和例句改成孩子聽得懂的話 */
    idioms: [
      { id: 'i-洗耳恭聽', situationImg: 'id-listen.png', idiom: '洗耳恭聽', char: '耳', meaning: '很專心、很有禮貌的聽別人說話。', example: '爺爺要講以前的故事了，我們都洗耳恭聽。', situation: '校長站上臺要說話，全班同學都坐好、不講話，眼睛看著校長，仔細的聽。',
        fill: { options: ['老師要講故事了，大家都＿＿＿＿。', '老師在說話，他卻＿＿＿＿的跟同學聊天。'], clue: '提示：哪一句是很專心的聽？', explain: '第一句用得對：大家很專心的聽老師講故事。跟同學聊天就沒有在聽，剛好相反。' } },
      { id: 'i-耳目一新', situationImg: 'id-new-room.png', idiom: '耳目一新', char: '耳', meaning: '看到、聽到的都很新鮮，跟以前完全不一樣。', example: '教室重新布置以後，大家都覺得耳目一新。', situation: '暑假過後回到學校，教室的牆壁換了新顏色，桌椅也都是新的，大家都覺得好新鮮。',
        fill: { options: ['房間重新油漆以後，讓人＿＿＿＿。', '房間跟以前一模一樣，讓人＿＿＿＿。'], clue: '提示：哪一句是看起來很新鮮、和以前不一樣？', explain: '第一句用得對：房間重新油漆，看起來很新鮮。和以前一模一樣，就不是這個意思。' } },
      { id: 'i-回心轉意', situationImg: 'id-change-mind.png', idiom: '回心轉意', char: '轉', meaning: '改變原來的想法，願意再接受。', example: '弟弟本來不想去，聽說有冰淇淋，馬上回心轉意了。', situation: '妹妹生氣說不要再跟哥哥玩了，後來哥哥跟她道歉，她又願意一起玩了。',
        fill: { options: ['聽了媽媽的話，他終於＿＿＿＿，願意去看醫生。', '他從頭到尾都很想去，一下子就＿＿＿＿。'], clue: '提示：哪一句是本來不要，後來改變想法？', explain: '第一句用得對：他本來不去看醫生，後來改變了想法。一直都很想去，就沒有改變想法。' } },
      { id: 'i-躍躍欲試', situationImg: 'id-eager.png', idiom: '躍躍欲試', char: '躍', meaning: '心裡很想、很急著想要試試看。', example: '看到新的攀岩牆，大家都躍躍欲試。', situation: '體育老師拿出新的跳箱，同學們一直舉手，都好想第一個上去跳。',
        fill: { options: ['看到別人在玩新的遊戲，弟弟＿＿＿＿。', '他很怕水，一看到游泳池就＿＿＿＿的躲起來。'], clue: '提示：哪一句是很想試試看？', explain: '第一句用得對：弟弟很想玩新的遊戲。怕水躲起來，是不想試，剛好相反。' } },
      { id: 'i-心煩意亂', situationImg: 'id-upset.png', idiom: '心煩意亂', char: '煩', meaning: '心裡很煩、很亂，靜不下來。', example: '找不到鑰匙，又快遲到了，媽媽心煩意亂。', situation: '明天要考試，哥哥的書還沒讀完，外面又一直有很吵的施工聲，他抓著頭，一個字也看不下去。',
        fill: { options: ['外面一直很吵，吵得他＿＿＿＿，睡不著覺。', '躺在草地上看雲，他覺得好＿＿＿＿。'], clue: '提示：哪一句是心裡很亂、靜不下來？', explain: '第一句用得對：外面很吵，他心裡很亂。躺在草地上看雲很輕鬆，剛好相反。' } }
    ],
    /* 改錯字：sentence 是正確的句子，畫面上會把 char 換成 wrong；options 的第一個是正確的字。clue 只說語詞的意思，不能出現正確的字。 */
    fix: [
      { id: 'fx-泳', char: '泳', wrong: '永', sentence: '我穿上泳衣，跳進水裡。', options: ['泳', '永', '詠'], clue: '這裡說的是下水時穿的衣服，跟水有關，想一想，哪一個字有三點水？', explain: '要改成「泳」。游泳穿的衣服是「泳衣」，左邊有三點水；「永」是永遠的永。' },
      { id: 'fx-串', char: '串', wrong: '中', sentence: '葡萄樹上掛著一串葡萄。', options: ['串', '中', '吊'], clue: '這裡是說很多顆連在一起，想一想，哪一個字有兩個「口」？', explain: '要改成「串」。很多顆連在一起是「一串」；「中」是中間的中。' },
      { id: 'fx-般', char: '般', wrong: '搬', sentence: '這只是一般的鉛筆。', options: ['般', '搬', '船'], clue: '這裡是說普通的，跟搬東西沒有關係。', explain: '要改成「般」。普通的是「一般」；「搬」是搬東西的搬，有提手旁。' },
      { id: 'fx-姿', char: '姿', wrong: '資', sentence: '她跳舞的姿勢好漂亮。', options: ['姿', '資', '姊'], clue: '這裡是說身體的樣子，想一想，哪一個字的下面是「女」？', explain: '要改成「姿」。身體的樣子是「姿勢」，下面是「女」；「資」是資料的資。' },
      { id: 'fx-溜', char: '溜', wrong: '留', sentence: '我們去公園溜滑梯。', options: ['溜', '留', '遛'], clue: '這裡是說滑下來，想一想，哪一個字有三點水？', explain: '要改成「溜」。滑下來是「溜滑梯」，左邊有三點水；「留」是留下來的留。' },
      { id: 'fx-耳', char: '耳', wrong: '目', sentence: '兔子的耳朵長長的。', options: ['耳', '目', '且'], clue: '這裡說的是聽聲音的地方，不是眼睛。', explain: '要改成「耳」。聽聲音的是「耳朵」；「目」是眼睛。' },
      { id: 'fx-鷹', char: '鷹', wrong: '應', sentence: '一隻老鷹在天上飛。', options: ['鷹', '應', '鶯'], clue: '這裡說的是一種大鳥，想一想，哪一個字的下面是「鳥」？', explain: '要改成「鷹」。會飛的大鳥是「老鷹」，下面是「鳥」；「應」是應該的應。' },
      { id: 'fx-滑', char: '滑', wrong: '骨', sentence: '地上有水，很容易滑倒。', options: ['滑', '骨', '猾'], clue: '這裡是說腳下溜了一下、摔倒，想一想，哪一個字有三點水？', explain: '要改成「滑」。腳下溜了一下是「滑倒」，左邊有三點水；「骨」是骨頭的骨。' },
      { id: 'fx-遨', char: '遨', wrong: '熬', sentence: '小鳥在天空遨遊。', options: ['遨', '熬', '傲'], clue: '這裡是說自由的到處玩，想一想，哪一個字有辵字旁？', explain: '要改成「遨」。自由的到處玩是「遨遊」，有辵字旁；「熬」是熬夜的熬，下面是火。' },
      { id: 'fx-緩', char: '緩', wrong: '暖', sentence: '烏龜緩慢的往前爬。', options: ['緩', '暖', '援'], clue: '這裡是說很慢，跟天氣冷熱沒有關係。', explain: '要改成「緩」。很慢是「緩慢」，左邊是絲線；「暖」是溫暖的暖。' },
      { id: 'fx-陀', char: '陀', wrong: '駝', sentence: '爺爺教我打陀螺。', options: ['陀', '駝', '舵'], clue: '這裡說的是會轉圈的玩具，跟駱駝沒有關係。', explain: '要改成「陀」。會轉圈的玩具是「陀螺」，左邊是左耳旁；「駝」是駱駝的駝。' },
      { id: 'fx-螺', char: '螺', wrong: '騾', sentence: '爸爸把螺絲轉緊。', options: ['螺', '騾', '累'], clue: '這裡說的是一圈一圈的小零件，想一想，哪一個字的左邊是「虫」？', explain: '要改成「螺」。小零件是「螺絲」，左邊是「虫」；「騾」是騾子的騾。' },
      { id: 'fx-轉', char: '轉', wrong: '傳', sentence: '到了路口，車子要轉彎。', options: ['轉', '傳', '專'], clue: '這裡是說換方向，想一想，哪一個字的左邊是「車」？', explain: '要改成「轉」。換方向是「轉彎」，左邊是「車」；「傳」是傳球的傳。' },
      { id: 'fx-躍', char: '躍', wrong: '耀', sentence: '青蛙在荷葉上跳躍。', options: ['躍', '耀', '曜'], clue: '這裡是說跳起來，想一想，哪一個字的左邊是「足」？', explain: '要改成「躍」。跳起來是「跳躍」，左邊是「足」；「耀」是閃耀的耀。' },
      { id: 'fx-煩', char: '煩', wrong: '須', sentence: '找不到鉛筆，真麻煩。', options: ['煩', '須', '頓'], clue: '這裡是說事情不好做，想一想，哪一個字的左邊是「火」？', explain: '要改成「煩」。事情不好做是「麻煩」，左邊是「火」；「須」是必須的須。' }
    ],
    similar: [
      { id: 's1', meaning: '「＿衣」是下水游的時候穿的衣服。', sentence: '我帶了＿衣去游泳池。', frame: '＿衣', options: ['泳', '永'], answer: '泳', clue: '提示：這個字和水有關，左邊有三點水。', explain: '答案是「泳」；「永」是永遠的永，沒有三點水。' },
      { id: 's2', meaning: '「＿遠」是很久很久，一直都是。', sentence: '我們要＿遠當好朋友。', frame: '＿遠', options: ['永', '泳'], answer: '永', clue: '提示：這句話在說很久很久，這個字沒有三點水。', explain: '答案是「永」；「泳」是游泳的泳。' },
      { id: 's3', meaning: '「＿動」是把東西移到別的地方。', sentence: '這張桌子好重，我們一起＿動它。', frame: '＿動', options: ['搬', '般'], answer: '搬', clue: '提示：要用手出力，這個字有提手旁。', explain: '答案是「搬」；「般」是一般的般，沒有提手旁。' },
      { id: 's4', meaning: '「＿勢」是身體擺出來的樣子。', sentence: '寫字的時候，坐的＿勢要正確。', frame: '＿勢', options: ['姿', '資'], answer: '姿', clue: '提示：這個字的下面是女字。', explain: '答案是「姿」；「資」是資料的資，下面是「貝」。' },
      { id: 's5', meaning: '「＿意」是小心、注意。', sentence: '過馬路要＿意來車。', frame: '＿意', options: ['留', '溜'], answer: '留', clue: '提示：這句話在說小心看，這個字沒有三點水。', explain: '答案是「留」；「溜」是溜冰的溜，有三點水。' },
      { id: 's6', meaning: '「＿該」是本來就要這樣做。', sentence: '做錯事，＿該說對不起。', frame: '＿該', options: ['應', '鷹'], answer: '應', clue: '提示：這個字的下面是「心」，不是鳥。', explain: '答案是「應」；「鷹」是老鷹的鷹，下面是「鳥」。' },
      { id: 's7', meaning: '「＿夜」是晚上很晚都不睡覺。', sentence: '哥哥昨天＿夜讀書，今天好想睡。', frame: '＿夜', options: ['熬', '遨'], answer: '熬', clue: '提示：這個字的下面有四點，是火。', explain: '答案是「熬」；「遨」是遨遊的遨，有辵字旁。' },
      { id: 's8', meaning: '「溫＿」是不冷不熱、很舒服。', sentence: '冬天的太陽照在身上好溫＿。', frame: '溫＿', options: ['暖', '緩'], answer: '暖', clue: '提示：這句話在說太陽，這個字的左邊是「日」。', explain: '答案是「暖」；「緩」是緩慢的緩，左邊是絲線。' },
      { id: 's9', meaning: '「＿慢」是速度很慢。', sentence: '老爺爺拿著拐杖，＿慢的走路。', frame: '＿慢', options: ['緩', '暖'], answer: '緩', clue: '提示：這個字的左邊是絲線。', explain: '答案是「緩」；「暖」是溫暖的暖。' },
      { id: 's10', meaning: '「駱＿」是背上有大包包、住在沙漠的動物。', sentence: '沙漠裡有一隻駱＿。', frame: '駱＿', options: ['駝', '陀'], answer: '駝', clue: '提示：這是一種動物，左邊是「馬」。', explain: '答案是「駝」；「陀」是陀螺的陀。' },
      { id: 's11', meaning: '「閃＿」是發出很亮的光。', sentence: '天上的星星閃＿著光芒。', frame: '閃＿', options: ['耀', '躍'], answer: '耀', clue: '提示：這句話在說光，這個字的左邊是「光」。', explain: '答案是「耀」；「躍」是跳躍的躍，左邊是「足」。' }
    ],
    listen: [
      { id: 'l1', text: '在游泳池裡，用手腳划水往前進。', answer: 0, options: [{ text: '游泳', img: 'swim.png' }, { text: '溜', img: 'skate.png' }, { text: '跳躍', img: 'jump.png' }, { text: '陀螺', img: 'top.png' }] },
      { id: 'l2', text: '用繩子一甩，它就在地上轉個不停。', answer: 0, options: [{ text: '陀螺', img: 'top.png' }, { text: '飛鷹', img: 'eagle.png' }, { text: '一串串', img: 'grapes.png' }, { text: '游泳', img: 'swim.png' }] },
      { id: 'l3', text: '張開大翅膀，在高高的天空飛。', answer: 0, options: [{ text: '飛鷹', img: 'eagle.png' }, { text: '陀螺', img: 'top.png' }, { text: '耳旁', img: 'ear.png' }, { text: '緩緩', img: 'turtle.png' }] },
      { id: 'l4', text: '葡萄一顆一顆連在一起，掛在樹上。', answer: 0, options: [{ text: '一串串', img: 'grapes.png' }, { text: '晶亮', img: 'shiny-drops.png' }, { text: '煩惱', img: 'worry.png' }, { text: '轉身', img: 'turn-around.png' }] },
      { id: 'l5', text: '烏龜慢慢的、一點也不急的往前爬。', answer: 0, options: [{ text: '緩緩', img: 'turtle.png' }, { text: '滑行', img: 'glide.png' }, { text: '跳躍', img: 'jump.png' }, { text: '遨遊', img: 'bird-sky.png' }] },
      { id: 'l6', text: '考試考不好，心裡一直放不下，很不開心。', answer: 0, options: [{ text: '煩惱', img: 'worry.png' }, { text: '多采多姿', img: 'colorful-life.png' }, { text: '晶亮', img: 'shiny-drops.png' }, { text: '游泳', img: 'swim.png' }] },
      { id: 'l7', text: '聽到後面有人叫我，我把身體轉過去看。', answer: 0, options: [{ text: '轉身', img: 'turn-around.png' }, { text: '滑行', img: 'glide.png' }, { text: '游泳', img: 'swim.png' }, { text: '緩緩', img: 'turtle.png' }] },
      { id: 'l8', text: '小鳥自由自在的在天空到處飛來飛去。', answer: 0, options: [{ text: '遨遊', img: 'bird-sky.png' }, { text: '轉身', img: 'turn-around.png' }, { text: '煩惱', img: 'worry.png' }, { text: '一般', img: 'same-height.png' }] }
    ],
    /* ---------- 短語短句、造句、修辭（句子都是 Claude 自己寫的） ---------- */
    phrase: {
      /* 拼短語（短語一）每一格下面寫要放什麼樣的詞 */
      fillLabels: { answer: '怎麼樣', noun: '什麼東西' },
      pickName: '看圖選一選', pickSay: '看圖，選出最適合的詞，說說看是什麼樣子。',
      /* 短語一：無比＋怎麼樣＋的＋什麼東西（課本的例子是課文原句，這裡換成自己寫的） */
      intro: { example: '無比開心的笑容', img: 'pr-smile.png',
        parts: [{ text: '無比' }, { text: '開心', role: '怎麼樣' }, { text: '的' }, { text: '笑容', role: '什麼東西' }],
        explain: '「無比」是沒有別的比得上，也就是「非常非常」。先說「無比」，再說怎麼樣，加上「的」，最後說是什麼東西。' },
      pick: [
        { id: 'ph1', img: 'pr-prize.png', before: '無比', noun: '心情', ask: '無比什麼的心情', look: '再看看圖片，他拿到獎狀，臉上是什麼表情？', options: ['興奮', '難過', '害怕', '生氣'], clue: '提示：他拿到第一名，高興得跳起來。', explain: '答案是「興奮」，拿到第一名高興得跳起來，所以是「無比興奮的心情」。' },
        { id: 'ph2', img: 'pr-mountain.png', before: '無比', noun: '高山', ask: '無比什麼的高山', look: '再看看圖片，山頂是不是碰到雲了？', options: ['高大', '矮小', '香甜', '吵鬧'], clue: '提示：山頂比雲還要上面，抬頭都看不到頂。', explain: '答案是「高大」，山頂比雲還要上面，所以是「無比高大的高山」。' },
        { id: 'ph3', img: 'pr-sea.png', before: '無比', noun: '大海', ask: '無比什麼的大海', look: '再看看圖片，海是不是大到看不到邊？', options: ['寬廣', '窄小', '好吃', '安靜'], clue: '提示：站在沙灘上看出去，一直看不到另一邊。', explain: '答案是「寬廣」，大海看不到邊，所以是「無比寬廣的大海」。' },
        { id: 'ph4', img: 'pr-cake.png', before: '無比', noun: '蛋糕', ask: '無比什麼的蛋糕', look: '再看看圖片，大家吃了蛋糕，表情怎麼樣？', options: ['美味', '難吃', '寬廣', '吵鬧'], clue: '提示：大家一口接一口，吃得停不下來。', explain: '答案是「美味」，大家吃得停不下來，所以是「無比美味的蛋糕」。' },
        { id: 'ph5', img: 'pr-heavy-bag.png', before: '無比', noun: '書包', ask: '無比什麼的書包', look: '再看看圖片，他背書包的時候，腰是不是彎下去了？', options: ['沉重', '輕巧', '美味', '香甜'], clue: '提示：書包裡裝滿了書，他背得腰都彎了。', explain: '答案是「沉重」，書包壓得他腰都彎了，所以是「無比沉重的書包」。' },
        { id: 'ph6', img: 'pr-library.png', before: '無比', noun: '圖書館', ask: '無比什麼的圖書館', look: '再看看圖片，圖書館裡的人有沒有說話？', options: ['安靜', '吵鬧', '沉重', '美味'], clue: '提示：大家都在看書，一點聲音也沒有。', explain: '答案是「安靜」，一點聲音也沒有，所以是「無比安靜的圖書館」。' },
        { id: 'ph7', img: 'pr-stars.png', before: '無比', noun: '星空', ask: '無比什麼的星空', look: '再看看圖片，天上的星星多不多、亮不亮？', options: ['美麗', '醜陋', '沉重', '吵鬧'], clue: '提示：滿天都是閃閃的星星，大家看得捨不得走。', explain: '答案是「美麗」，滿天星星看得捨不得走，所以是「無比美麗的星空」。' },
        { id: 'ph8', img: 'pr-brave.png', before: '無比', noun: '消防員', ask: '無比什麼的消防員', look: '再看看圖片，消防員是不是往危險的地方衝過去？', options: ['勇敢', '膽小', '美味', '安靜'], clue: '提示：大家都往外跑，只有他衝進去救人。', explain: '答案是「勇敢」，他衝進去救人，所以是「無比勇敢的消防員」。' }
      ],
      say: [],
      /* 短句：誰＋從＋哪裡＋疊字（怎麼樣）＋做什麼（課本的例子是課文原句，這裡換成自己寫的） */
      phrase2: {
        intro: { example: '樹葉從空中慢慢飄下來', img: 'pz-leaf.png',
          parts: [{ text: '樹葉', role: '誰' }, { text: '從' }, { text: '空中', role: '哪裡' }, { text: '慢慢', role: '怎麼樣（疊字）' }, { text: '飄下來', role: '做什麼' }],
          explain: '先說是誰，再說「從」哪裡，用兩個一樣的字說它怎麼樣，最後說它做什麼。' },
        pick: [
          { id: 'p2-pz1', img: 'pz-wind.png', before: '大風從窗外', join: '', noun: '吹進來', ask: '大風從窗外怎麼樣吹進來', look: '再看看圖片，想一想哪一個放進去最合適？', options: ['呼呼', '靜靜', '慢慢', '甜甜'], clue: '提示：窗簾被吹得飛起來，還聽得到很大的聲音。', explain: '答案是「呼呼」，完整的短句是「大風從窗外呼呼吹進來」。' },
          { id: 'p2-pz2', img: 'pz-snow.png', before: '雪花從天上', join: '', noun: '飄下來', ask: '雪花從天上怎麼樣飄下來', look: '再看看圖片，想一想哪一個放進去最合適？', options: ['輕輕', '重重', '呼呼', '匆匆'], clue: '提示：白白的雪花像羽毛一樣，落下來一點聲音都沒有。', explain: '答案是「輕輕」，完整的短句是「雪花從天上輕輕飄下來」。' },
          { id: 'p2-pz3', img: 'pz-turtle.png', before: '烏龜從草地', join: '', noun: '爬過去', ask: '烏龜從草地怎麼樣爬過去', look: '再看看圖片，想一想哪一個放進去最合適？', options: ['慢慢', '匆匆', '呼呼', '重重'], clue: '提示：烏龜背著殼，一步一步的往前，一點也不急。', explain: '答案是「慢慢」，完整的短句是「烏龜從草地慢慢爬過去」。' },
          { id: 'p2-pz4', img: 'pz-dad-rush.png', before: '爸爸從車站', join: '', noun: '走出來', ask: '爸爸從車站怎麼樣走出來', look: '再看看圖片，想一想哪一個放進去最合適？', options: ['匆匆', '慢慢', '輕輕', '甜甜'], clue: '提示：爸爸快遲到了，一邊看手錶一邊趕路。', explain: '答案是「匆匆」，完整的短句是「爸爸從車站匆匆走出來」。' },
          { id: 'p2-pz5', img: 'pz-smell.png', before: '香味從廚房', join: '', noun: '飄出來', ask: '香味從廚房怎麼樣飄出來', look: '再看看圖片，想一想哪一個放進去最合適？', options: ['陣陣', '呼呼', '匆匆', '重重'], clue: '提示：香香的味道一次又一次的傳過來，讓人肚子好餓。', explain: '答案是「陣陣」，完整的短句是「香味從廚房陣陣飄出來」。' }
        ],
        fill: [
          { id: 'pz1', img: 'pz-wind.png', parts: ['大風', '從', '窗外', '呼呼', '吹進來'] },
          { id: 'pz2', img: 'pz-snow.png', parts: ['雪花', '從', '天上', '輕輕', '飄下來'] },
          { id: 'pz3', img: 'pz-turtle.png', parts: ['烏龜', '從', '草地', '慢慢', '爬過去'] },
          { id: 'pz4', img: 'pz-dad-rush.png', parts: ['爸爸', '從', '車站', '匆匆', '走出來'] },
          { id: 'pz5', img: 'pz-smell.png', parts: ['香味', '從', '廚房', '陣陣', '飄出來'] }
        ]
      },
      words: [
        { word: '多采多姿', meaning: '有很多變化，豐富又精采。', img: 'colorful-life.png' },
        { word: '無比', meaning: '沒有別的比得上，非常非常。', img: 'pr-smile.png' }
      ],
      choose: [
        { id: 'pw1', word: '多采多姿', options: ['學校的園遊會有好多攤位，活動多采多姿。', '他每天都待在家裡發呆，生活多采多姿。'], clue: '提示：想一想，「多采多姿」是很豐富，還是什麼都沒有？', explain: '第一句用得對：園遊會有很多攤位，很豐富。每天在家發呆，什麼變化都沒有，不是多采多姿。' },
        { id: 'pw2', word: '無比', options: ['看到小狗平安回家，我無比開心。', '這杯水無比是我的。'], clue: '提示：想一想，「無比」後面要接什麼樣的詞？', explain: '第一句用得對：「無比開心」是非常非常開心。「無比」後面要接怎麼樣的詞，第二句不通順。' }
      ],
      make: [
        { id: 'pm1', word: '多采多姿', clue: '提示：想想看，什麼活動有很多不一樣的東西可以玩、可以看？', model: '暑假我學畫畫、去露營，生活多采多姿。' },
        { id: 'pm2', word: '無比', clue: '提示：想想看，什麼時候你非常非常開心、緊張或害怕？', model: '上臺比賽的時候，我無比緊張。' }
      ]
    },
    rhetoric: {
      cards: [
        { key: 'redup', name: '疊字', meaning: '同一個字連在一起重複用，讀起來更好聽、更生動。', example: '課文裡的「呼呼」、「輕輕」、「緩緩」，都是把同一個字連著說。',
          show: { sentence: '小貓輕輕的走過來。' },
          yesno: [
            { id: 'rh-re-y1', sentence: '雨滴滴答答的下。', answer: true, clue: '提示：形容雨的字裡，有沒有同一個字連在一起？', explain: '是疊字：「滴滴答答」把「滴」和「答」都重複說了。' },
            { id: 'rh-re-y2', sentence: '雨一直下。', answer: false, clue: '提示：仔細聽，有沒有同一個字連在一起？', explain: '不是疊字：這句話沒有重複的字。' }
          ],
          pick: [
            { id: 'rh-re-p1', options: ['風呼呼的吹。', '風很大。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「呼呼」是疊字：「呼」重複了。' },
            { id: 'rh-re-p2', options: ['他慢慢的走回家。', '他走回家。'], clue: '提示：仔細聽，哪一句多了重複的字？', explain: '「慢慢」是疊字：「慢」重複了。' },
            { id: 'rh-re-p3', options: ['蛋糕甜甜的。', '蛋糕很甜。', '蛋糕像一座城堡。'], clue: '提示：哪一句有同一個字連在一起？', explain: '「甜甜」是疊字：「甜」重複了。' },
            { id: 'rh-re-p4', options: ['夜空亮晶晶的，好美。', '夜空很亮。', '夜空像一塊黑布。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「亮晶晶」是疊字：「晶」重複了。' },
            { id: 'rh-re-p5', options: ['蘋果紅紅的。', '蘋果很紅。', '蘋果像小燈籠。', '我在吃蘋果。'], clue: '提示：哪一句有同一個字連著說兩次？', explain: '「紅紅」是疊字：「紅」重複了。' },
            { id: 'rh-re-p6', options: ['小河靜靜的流著。', '小河在流。', '小河像一條絲帶。', '小河很長。'], clue: '提示：仔細聽，哪一句有重複的字？', explain: '「靜靜」是疊字：「靜」重複了。' }
          ] },
        { key: 'repeat', name: '類疊', meaning: '同一個詞或同一句話，隔開來重複說好幾次，讀起來有節奏，也讓人印象更深。', example: '課文裡的「游成……游成……游成……」，把「游成」重複說了好幾次。',
          show: { sentence: '幸好帶了傘，沒有淋溼；幸好穿了外套，沒有感冒。', mark: ['幸好'] },
          yesno: [
            { id: 'rh-rp-y1', sentence: '我想去海邊，我想去爬山，我想去露營。', answer: true, mark: ['我想去'], clue: '提示：找找看，有沒有同一句話隔開來說了好幾次？', explain: '是類疊：「我想去」說了三次。' },
            { id: 'rh-rp-y2', sentence: '放假時，我想去很多地方玩。', answer: false, clue: '提示：這句話裡，有沒有同一句話說了好幾次？', explain: '不是類疊：這句話沒有重複說同一句話。' }
          ],
          pick: [
            { id: 'rh-rp-p1', mark: ['跑呀跑'], options: ['跑呀跑，跑過了操場；跑呀跑，跑過了大樹。', '我跑得很快。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「跑呀跑」隔開來說了兩次，是類疊。' },
            { id: 'rh-rp-p2', mark: ['還好有你'], options: ['還好有你陪我玩，還好有你借我鉛筆。', '你人真好。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「還好有你」隔開來說了兩次，是類疊。' },
            { id: 'rh-rp-p3', mark: ['我喜歡'], options: ['我喜歡跑步，我喜歡唱歌。', '我有很多興趣。', '唱歌讓我很快樂。'], clue: '提示：哪一句有同一個詞，隔開來說了兩次？', explain: '「我喜歡」說了兩次，是類疊。' },
            { id: 'rh-rp-p4', mark: ['有的'], options: ['操場上，有的在跳繩，有的在踢球。', '操場上好熱鬧。', '小朋友像小鳥一樣快樂。'], clue: '提示：哪一句有同一個詞，隔開來說了兩次？', explain: '「有的」說了兩次，是類疊。' },
            { id: 'rh-rp-p5', mark: ['再見了'], options: ['再見了，學校；再見了，老師；再見了，同學。', '畢業了，我好捨不得。', '時間像流水。', '我好捨不得大家。'], clue: '提示：哪一句有同一個詞，隔開來說了好幾次？', explain: '「再見了」說了三次，是類疊。' },
            { id: 'rh-rp-p6', mark: ['加油'], options: ['加油，加油，你一定跑得到終點！', '比賽要開始了。', '他跑得像一陣風。', '大家都在看。'], clue: '提示：哪一句有同一個詞，重複說了好幾次？', explain: '「加油」說了兩次，是類疊。' }
          ] },
        { key: 'simile', name: '譬喻', meaning: '把一樣東西比成另一樣有相同地方的東西，讓人更容易想像。常用「像」、「好像」、「如」。', example: '課文把溜直排輪的自己，比成飛鷹和陀螺。',
          show: { sentence: '他跑得好快，像一陣風。' },
          yesno: [
            { id: 'rh-si-y1', sentence: '月亮像一艘小船。', answer: true, clue: '提示：這句話有沒有把月亮比成另一樣東西？', explain: '是譬喻：把月亮比成小船。' },
            { id: 'rh-si-y2', sentence: '今天晚上的月亮是彎的。', answer: false, clue: '提示：這句話有沒有用「像」把東西比成別的東西？', explain: '不是譬喻：這句話只是說月亮的樣子。' }
          ],
          pick: [
            { id: 'rh-si-p1', options: ['游泳池的水好藍，像一塊大寶石。', '游泳池的水好藍。'], clue: '提示：哪一句用了「像」，把水比成另一樣東西？', explain: '「像一塊大寶石」是譬喻：把藍藍的水比成寶石。' },
            { id: 'rh-si-p2', options: ['他轉起圈來，好像一顆陀螺。', '他一直轉圈。'], clue: '提示：哪一句把他轉圈的樣子比成另一樣東西？', explain: '「好像一顆陀螺」是譬喻。' },
            { id: 'rh-si-p3', options: ['雲朵像一團棉花糖。', '天上有很多雲。', '雲朵在天上飄。'], clue: '提示：哪一句用「像」把雲比成別的東西？', explain: '「像一團棉花糖」是譬喻：把雲朵比成棉花糖。' },
            { id: 'rh-si-p4', options: ['她的歌聲像小鳥唱歌一樣好聽。', '她很會唱歌。', '她在唱歌。'], clue: '提示：哪一句把她的歌聲比成另一樣東西？', explain: '「像小鳥唱歌一樣好聽」是譬喻。' },
            { id: 'rh-si-p5', options: ['夜市的燈好亮，像天上的月亮。', '夜市有很多燈。', '我們去逛夜市。', '夜市好熱鬧。'], clue: '提示：哪一句用「像」把燈比成別的東西？', explain: '「像天上的月亮」是譬喻：把夜市的燈比成月亮。' },
            { id: 'rh-si-p6', options: ['他溜直排輪的速度，快得像一支箭。', '他溜直排輪很快。', '他每天都溜直排輪。', '直排輪有四個輪子。'], clue: '提示：哪一句把他溜的速度比成另一樣東西？', explain: '「快得像一支箭」是譬喻：把速度比成射出去的箭。' }
          ] }
      ],
      quiz: [
        { id: 'rh1', sentence: '小狗的毛軟軟的。', answer: '疊字', clue: '提示：找找看，有沒有同一個字連在一起？', explain: '答案是「疊字」：「軟軟」是同一個字連在一起重複用。' },
        { id: 'rh2', sentence: '蝴蝶翩翩的飛舞。', answer: '疊字', clue: '提示：仔細聽，有沒有同一個字連著說？', explain: '答案是「疊字」：「翩翩」是同一個字連在一起重複用。' },
        { id: 'rh3', sentence: '我愛唱歌，我愛跳舞，我愛打球。', answer: '類疊', mark: ['我愛'], clue: '提示：找找看，有沒有同一個詞隔開來說了好幾次？', explain: '答案是「類疊」：「我愛」隔開來說了三次。' },
        { id: 'rh4', sentence: '快一點，快一點，公車要開走了！', answer: '類疊', mark: ['快一點'], clue: '提示：有沒有同一個詞，重複說了好幾次？', explain: '答案是「類疊」：「快一點」說了兩次。' },
        { id: 'rh5', sentence: '池塘的水面像一面鏡子。', answer: '譬喻', clue: '提示：這句話有沒有把水面比成別的東西？', explain: '答案是「譬喻」：把水面比成鏡子。' },
        { id: 'rh6', sentence: '他跳得好高，好像要飛起來的小鳥。', answer: '譬喻', clue: '提示：這句話有沒有用「好像」？', explain: '答案是「譬喻」：把他比成要飛起來的小鳥。' }
      ]
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = d;
  else { root.H3A_WORDS = root.H3A_WORDS || {}; root.H3A_WORDS.L01 = d; }
})(this);
