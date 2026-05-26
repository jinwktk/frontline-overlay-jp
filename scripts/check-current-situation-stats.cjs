const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')

const root = path.resolve(__dirname, '..')
const parserSource = fs.readFileSync(path.join(root, 'src/composables/useCombatParser.ts'), 'utf8')
const situationTabSource = fs.readFileSync(path.join(root, 'src/components/tabs/SituationTab.vue'), 'utf8')

const expectations = [
  {
    name: 'parser exposes current battle stats for the Situation tab',
    actual: parserSource.includes('currentBattleStats') && parserSource.includes('currentDamageDealt'),
    expected: true,
  },
  {
    name: 'parser counts player and summon damage for the current battle',
    actual: parserSource.includes('currentDamageDealt += damage') && parserSource.includes('summonerId === combatData.playerId'),
    expected: true,
  },
  {
    name: 'Situation tab shows current battle stats section',
    actual: situationTabSource.includes('現在の戦績') && situationTabSource.includes('currentBattleStats'),
    expected: true,
  },
  {
    name: 'Situation tab shows K/D and damage labels',
    actual: situationTabSource.includes('K/D') && situationTabSource.includes('与ダメージ'),
    expected: true,
  },
]

for (const expectation of expectations) {
  assert.equal(expectation.actual, expectation.expected, expectation.name)
}

console.log('Current situation stats checks passed.')
