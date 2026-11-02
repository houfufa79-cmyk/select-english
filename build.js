// build.js —— 把 sentences.txt 编译成 data/sentences.js
// sentences.txt 格式： 英文句子 || 正确中文翻译
const fs = require('fs');
const path = require('path');

const TXT = path.join(__dirname, 'data', 'sentences.txt');
const OUT = path.join(__dirname, 'data', 'sentences.js');

const lines = fs.readFileSync(TXT, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean);

const items = lines.map((raw, idx) => {
  const [en, zh] = raw.split('||').map(s => s.trim());
  return { id: idx + 1, en: en || raw, zh };
});

// Fisher-Yates 洗牌
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 抽 n 题，每题自动生成 2 个干扰翻译（从其他句子里随机抽 zh）
 * 选项顺序打乱，correctIdx 指向正确答案下标
 */
function pickQuestions(n) {
  const shuffled = shuffle(items.slice());
  const picked = shuffled.slice(0, Math.min(n, items.length));
  return picked.map(q => {
    // 备选池：排除本句自己的中文
    const pool = items.filter(x => x.id !== q.id).map(x => x.zh);
    const wrongs = shuffle(pool).slice(0, 2);
    // 三选一
    const opts = shuffle([q.zh, wrongs[0], wrongs[1]]);
    const correctIdx = opts.indexOf(q.zh);
    return { id: q.id, en: q.en, correctZh: q.zh, options: opts, correctIdx };
  });
}

const code = [
  '// 本文件由 build.js 自动生成，勿手改',
  '// source: sentences.txt  格式：英文 || 中文',
  '',
  `const SENTENCES = ${JSON.stringify(items, null, 2)};`,
  '',
  `// Fisher-Yates 洗牌`,
  `function _shuffle(arr) {`,
  `  for (let i = arr.length - 1; i > 0; i--) {`,
  `    const j = Math.floor(Math.random() * (i + 1));`,
  `    [arr[i], arr[j]] = [arr[j], arr[i]];`,
  `  }`,
  `  return arr;`,
  `}`,
  '',
  `// 随机抽 n 题，每题自动生成 2 个干扰翻译`,
  `function pickQuestions(n) {`,
  `  const picked = _shuffle(SENTENCES.slice()).slice(0, Math.min(n, SENTENCES.length));`,
  `  return picked.map(q => {`,
  `    const pool = SENTENCES.filter(x => x.id !== q.id).map(x => x.zh);`,
  `    const wrongs = _shuffle(pool).slice(0, 2);`,
  `    const opts = _shuffle([q.zh, wrongs[0], wrongs[1]]);`,
  `    const correctIdx = opts.indexOf(q.zh);`,
  `    return { id: q.id, en: q.en, correctZh: q.zh, options: opts, correctIdx };`,
  `  });`,
  `}`,
  '',
  `module.exports = { SENTENCES, pickQuestions };`,
  ''
].join('\n');

fs.writeFileSync(OUT, code);
console.log(`✅ 编译完成：${OUT}（${items.length} 句）`);
