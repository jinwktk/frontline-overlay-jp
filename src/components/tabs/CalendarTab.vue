<script setup lang="ts">
import { getFrontlineBackground, getFrontlineBackgroundColor, getFrontlineForeColor, getFrontlineNames } from '@/tools'
import { Frontline } from '@/types'

/*
 * 轮换算法参考了 https://github.com/NekoWoods/what-zc-today/blob/main/sketch.js
 */

const JST_OFFSET_MS = 9 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const startDate = new Date('2026-04-27T15:00:00Z') // JST 2026-04-28 00:00 のローテーション起点
const showFuture = [0, 1, 2, 3, 4, 5, 6] as const

const now = ref(new Date())
const days = ref(daysBetweenJstMidnights(startDate, new Date()))
const remainder = ref(calRemainder(days.value))
const timer = ref(0)

onMounted(() => {
  timer.value = setInterval(() => {
    const current = new Date()
    now.value = current

    const dayCount = daysBetweenJstMidnights(startDate, current)
    days.value = dayCount
    remainder.value = calRemainder(dayCount)
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})

const currentFrontline = computed(() => {
  return getFrontline(remainder.value)
})

const futureData = computed(() => showFuture.map(val => {
  const rm = calRemainder(days.value + val + 1)
  return {
    val: val,
    rm: rm,
    ...getFrontline(rm),
  }
}))

function daysBetweenJstMidnights(from: Date, to: Date) {
  return getJstDayNumber(to) - getJstDayNumber(from)
}

function getJstDayNumber(date: Date) {
  return Math.floor((date.getTime() + JST_OFFSET_MS) / DAY_MS)
}
function calRemainder(day: number) {
  return day % 8
}

const getFrontline = (index: number) => {
  let frontline: Frontline
  switch (index) {
    case 0: frontline = Frontline.seize; break;
    case 1: frontline = Frontline.secure; break;
    case 2: frontline = Frontline.naadam; break;
    case 3: frontline = Frontline.triumph; break;
    case 4: frontline = Frontline.seize; break;
    case 5: frontline = Frontline.shatter; break;
    case 6: frontline = Frontline.naadam; break;
    case 7: frontline = Frontline.triumph; break;
    default: throw new Error('Invalid remainder value: ' + index)
  }
  return {
    names: getFrontlineNames(frontline),
    foreColor: getFrontlineForeColor(frontline),
    backgroundColor: getFrontlineBackgroundColor(frontline),
    backgroundImage: getFrontlineBackground(frontline),
  }
}

const getNextJstMidnight = (current: Date, addDay = 0) => {
  const nextJstDayNumber = getJstDayNumber(current) + 1 + addDay
  return new Date(nextJstDayNumber * DAY_MS - JST_OFFSET_MS)
}
const timeUntilNextJstMidnight = (current: Date, addDay?: number) => {
  const nextJstMidnight = getNextJstMidnight(current, addDay)
  const diffMs = Math.max(0, nextJstMidnight.getTime() - current.getTime())

  const hours = Math.floor(diffMs / (1000 * 60 * 60)).toString().padStart(2, '0')
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000).toString().padStart(2, '0')

  return `${hours}時間${minutes}分${seconds}秒`
}
const formatDate = (date: Date) => {
  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/\//g, '/').replace(',', '')
}

</script>

<template>
  <div class="page-panel">
    <!-- 現在の戦場 -->
    <div class="page-title">
      <div class="flex w-full items-center">
        <div>現在の戦場</div>
        <div class="ml-auto">{{ `(残り${timeUntilNextJstMidnight(now)})` }}</div>
      </div>
    </div>
    <div
      class="relative p-2 gap-1 rounded shadow-xl flex items-center"
      :style="{
        color: currentFrontline.foreColor,
        backgroundColor: currentFrontline.backgroundColor,
        backgroundImage: `url(${currentFrontline.backgroundImage})`,
        backgroundSize: '70%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '1% center',
      }"
    >
      <div class="ml-auto">
        <div class="text-[1.75rem] leading-[1.5] font-medium text-white text-shadow">
          {{ currentFrontline.names[1] }}
        </div>
        <p class="text-[#cad5e2] m-0 mr-1 text-right">
          {{ currentFrontline.names[2] }}
        </p>
      </div>
    </div>
    <!-- 今後の戦場 -->
    <div class="page-title">今後の戦場</div>
    <div class="flex flex-col gap-0.5 text-[1.125rem]">
      <div
        v-for="future in futureData"
        :key="future.val"
        class="flex items-center border border-black/50 rounded px-1 py-0.5 pr-2"
        :style="{
          color: future.foreColor,
          backgroundColor: future.backgroundColor,
        }"
      >
        <div>
          <span class="mx-[0.3em] ml-[0.5em]"> · </span>
          <span>{{ future.names[1] }}</span>
        </div>
        <div class="ml-auto">
          {{ `${formatDate(getNextJstMidnight(now, future.val))}／${timeUntilNextJstMidnight(now, future.val)}後` }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
