const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')

const root = path.resolve(__dirname, '..')
const parserSource = fs.readFileSync(path.join(root, 'src/composables/useCombatParser.ts'), 'utf8')

const expectations = [
  {
    name: 'parser recognizes Japanese Frontline join messages',
    actual: parserSource.includes('フロントラインに') && parserSource.includes('として参加しました'),
    expected: true,
  },
  {
    name: 'parser recognizes Japanese Grand Company names',
    actual: ['黒渦団', '双蛇党', '不滅隊'].every(name => parserSource.includes(name)),
    expected: true,
  },
  {
    name: 'parser recognizes Japanese Seal Rock tome activation',
    actual: parserSource.includes('アラガントームリス') && parserSource.includes('活動を開始した'),
    expected: true,
  },
  {
    name: 'parser recognizes Japanese Seal Rock occupation',
    actual: parserSource.includes('占拠した'),
    expected: true,
  },
  {
    name: 'parser recognizes Japanese Seal Rock neutral and exhausted logs',
    actual: parserSource.includes('中立状態になった') && parserSource.includes('情報が枯渇した'),
    expected: true,
  },
]

for (const expectation of expectations) {
  assert.equal(expectation.actual, expectation.expected, expectation.name)
}

console.log('Japanese parser checks passed.')
