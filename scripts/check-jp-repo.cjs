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
]

for (const expectation of expectations) {
  assert.equal(expectation.actual, expectation.expected, expectation.name)
}

console.log('Japanese fork repository checks passed.')
