const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')

const root = path.resolve(__dirname, '..')
const calendarSource = fs.readFileSync(path.join(root, 'src/components/tabs/CalendarTab.vue'), 'utf8')

const expectations = [
  {
    name: 'calendar uses an explicit JST offset for reset calculations',
    actual: calendarSource.includes('JST_OFFSET_MS') && calendarSource.includes('DAY_MS'),
    expected: true,
  },
  {
    name: 'calendar calculates the next reset as JST midnight',
    actual: calendarSource.includes('getNextJstMidnight') && calendarSource.includes('timeUntilNextJstMidnight'),
    expected: true,
  },
  {
    name: 'calendar formats future reset times in Asia/Tokyo',
    actual: calendarSource.includes("timeZone: 'Asia/Tokyo'"),
    expected: true,
  },
  {
    name: 'calendar no longer uses local 23:00 reset helpers',
    actual: !calendarSource.includes('setHours(23') && !calendarSource.includes('getNext23') && !calendarSource.includes('timeUntilNext23'),
    expected: true,
  },
  {
    name: 'calendar no longer depends on browser local timezone offset',
    actual: !calendarSource.includes('getTimezoneOffset'),
    expected: true,
  },
]

for (const expectation of expectations) {
  assert.equal(expectation.actual, expectation.expected, expectation.name)
}

console.log('Calendar JST reset checks passed.')
