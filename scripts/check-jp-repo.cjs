const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')

const root = path.resolve(__dirname, '..')
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')
const packageJson = JSON.parse(read('package.json'))

const expectations = [
  {
    name: 'package name is Japanese fork name',
    actual: packageJson.name,
    expected: 'frontline-overlay-jp',
  },
  {
    name: 'README points to Japanese GitHub Pages URL',
    actual: read('README.md').includes('https://jinwktk.github.io/frontline-overlay-jp/'),
    expected: true,
  },
  {
    name: 'app info points to Japanese repository',
    actual: read('src/constants/app-info.ts').includes('https://github.com/jinwktk/frontline-overlay-jp'),
    expected: true,
  },
  {
    name: 'app info points to Japanese changelog page',
    actual: read('src/constants/app-info.ts').includes('https://jinwktk.github.io/frontline-overlay-jp/changelog'),
    expected: true,
  },
  {
    name: 'AGENTS.md records this Japanese fork work',
    actual: read('AGENTS.md').includes('frontline-overlay-jp'),
    expected: true,
  },
  {
    name: 'GitHub Pages 404 redirect uses Japanese fork base path',
    actual: read('public/404.html').includes("'/frontline-overlay-jp'"),
    expected: true,
  },
  {
    name: 'README uses confirmed Japanese name for 沃刻其特',
    actual: read('README.md').includes('ウォーコー・チーテー'),
    expected: true,
  },
  {
    name: 'README no longer marks 沃刻其特 translation as pending',
    actual: read('README.md').includes('日本語名確認中'),
    expected: false,
  },
  {
    name: 'app display names use confirmed Japanese name for 沃刻其特',
    actual: read('src/tools/index.ts').includes('ウォーコー・チーテー'),
    expected: true,
  },
]

for (const expectation of expectations) {
  assert.equal(expectation.actual, expectation.expected, expectation.name)
}

console.log('Japanese fork repository checks passed.')
