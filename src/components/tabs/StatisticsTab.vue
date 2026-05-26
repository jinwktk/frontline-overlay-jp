<script setup lang="ts">
import AlertTitle from '../ui/AlertTitle.vue'
import PieChart from '@/components/ui/PieChart.vue'
import CombatLogCard from '../CombatLogCard.vue'
import useCombatParser from '@/composables/useCombatParser'

const {
  combatData,
  statistics,
} = useCombatParser()

const winRateTabs = computed(() => {
  const tabs: [string, string][] = []
  if (statistics.value.winRateSummary.frontline) {
    tabs.push(['frontline', 'フロントライン'])
  }
  if (statistics.value.winRateSummary.rivalWings) {
    tabs.push(['rivalWings', 'ライバルウィングズ'])
  }
  if (statistics.value.winRateSummary.crystalConflict) {
    tabs.push(['crystalConflict', 'クリスタルコンフリクト'])
  }
  return tabs
})
const activeWinRateTab = ref(winRateTabs.value[0]?.[0])
watch(winRateTabs, (newTabs) => {
  if (newTabs.length > 0) {
    if (!newTabs.some(tab => tab[0] === activeWinRateTab.value)) {
      activeWinRateTab.value = newTabs[0]![0]
    }
  } else {
    activeWinRateTab.value = undefined
  }
}, { immediate: true })

const knockoutChartTabs = computed(() => [
  [ 'skill', 'スキル別', statistics.value.pieData.knockoutBySkill ],
  [ 'selfJob', '自ジョブ別', statistics.value.pieData.knockoutBySelfJob ],
  [ 'enemyJob', '相手ジョブ別', statistics.value.pieData.knockoutByEnemyJob ],
] as [string, string, { label: string; amount: number }[]][])
const activeKnockoutChartTab = ref(knockoutChartTabs.value![0]![0])
const currKnockoutChartData = computed(() =>
  knockoutChartTabs.value.find(tab => tab[0] === activeKnockoutChartTab.value)?.[2] ?? []
)

const deathChartTabs = computed(() => [
  [ 'skill', 'スキル別', statistics.value.pieData.deathBySkill ],
  [ 'selfJob', '自ジョブ別', statistics.value.pieData.deathBySelfJob ],
  [ 'enemyJob', '相手ジョブ別', statistics.value.pieData.deathByEnemyJob ],
] as [string, string, { label: string; amount: number }[]][])
const activeDeathChartTab = ref(deathChartTabs.value![0]![0])
const currDeathChartData = computed(() =>
  deathChartTabs.value.find(tab => tab[0] === activeDeathChartTab.value)?.[2] ?? []
)
</script>

<template>
  <div class="page-panel">
    <AlertTitle v-if="!combatData.frontlineLog.length" msg="記録がありません。少なくとも1試合を完了してから確認してください。" />

    <!-- 参戦統計 -->
    <ContentBlock title="参戦統計" use-custom-content-container>
      <template #title>
        参戦統計
        <div class="ml-auto mr-5 flex items-center gap-1">
          <div class="w-[4.5rem] text-right">K</div>
          <div class="w-[4.5rem] text-right">D</div>
        </div>
      </template>

      <div class="page-content" v-if="!combatData.frontlineLog.length">データがありません</div>
      <div class="flex flex-col gap-1" v-else>
        <CombatLogCard
          v-for="(log, index) in combatData.frontlineLog"
          :key="index"
          :frontline-log="log"
        />
      </div>
    </ContentBlock>

    <!-- K/D統計 -->
    <ContentBlock title="K/D統計">
      <div class="w-full grid grid-cols-3">
        <div>参戦 <span class="text-orange-700">{{ combatData.frontlineLog.length }}</span> 試合</div>
        <div>ノックアウト数 <span class="text-orange-700">{{ statistics.knockouts.length }}</span></div>
        <div>戦闘不能数 <span class="text-orange-700">{{ statistics.deaths.length }}</span></div>
        <div>K/D <span class="text-orange-700">{{ statistics.kd }}</span></div>
        <div>平均ノックアウト <span class="text-orange-700">{{ statistics.knockoutEachMatch }}</span></div>
        <div>平均戦闘不能 <span class="text-orange-700">{{ statistics.deathEachMatch }}</span></div>
      </div>
    </ContentBlock>

    <!-- 結果統計 -->
    <ContentBlock title="結果統計">
      <template v-if="winRateTabs.length > 0">
        <div class="flex items-center gap-1">
          <div
            v-for="tab in winRateTabs"
            :key="tab[0]"
            class="text-[1.1rem] px-2 py-1 border border-transparent rounded text-white cursor-pointer text-shadow
              transition-colors duration-200"
            :class="activeWinRateTab === tab[0] ? 'bg-gray-500' : 'hover:bg-gray-500'"
            @click="activeWinRateTab = tab[0]"
          >
            {{ tab[1] }}
          </div>
        </div>
        <n-divider class="!my-1" />
        <div class="flex flex-col gap-1">
          <template v-if="activeWinRateTab === 'frontline' && statistics.winRateSummary.frontline">
            <div>
              1位回数: <span class="text-orange-700">{{ statistics.winRateSummary.frontline.first.count }}</span>
              (<span class="text-orange-700">{{ statistics.winRateSummary.frontline.first.rate }}</span>%)
            </div>
            <div>
              2位回数: <span class="text-orange-700">{{ statistics.winRateSummary.frontline.second.count }}</span>
              (<span class="text-orange-700">{{ statistics.winRateSummary.frontline.second.rate }}</span>%)
            </div>
            <div>
              3位回数: <span class="text-orange-700">{{ statistics.winRateSummary.frontline.third.count }}</span>
              (<span class="text-orange-700">{{ statistics.winRateSummary.frontline.third.rate }}</span>%)
            </div>
          </template>

          <template v-if="activeWinRateTab === 'rivalWings' && statistics.winRateSummary.rivalWings">
            <div>
              勝利回数: <span class="text-orange-700">{{ statistics.winRateSummary.rivalWings.win.count }}</span>
              (<span class="text-orange-700">{{ statistics.winRateSummary.rivalWings.win.rate }}</span>%)
            </div>
            <div>
              敗北回数: <span class="text-orange-700">{{ statistics.winRateSummary.rivalWings.lose.count }}</span>
              (<span class="text-orange-700">{{ statistics.winRateSummary.rivalWings.lose.rate }}</span>%)
            </div>
          </template>

          <template v-if="activeWinRateTab === 'crystalConflict' && statistics.winRateSummary.crystalConflict">
            <div>
              勝利回数: <span class="text-orange-700">{{ statistics.winRateSummary.crystalConflict.win.count }}</span>
              (<span class="text-orange-700">{{ statistics.winRateSummary.crystalConflict.win.rate }}</span>%)
            </div>
            <div>
              敗北回数: <span class="text-orange-700">{{ statistics.winRateSummary.crystalConflict.lose.count }}</span>
              (<span class="text-orange-700">{{ statistics.winRateSummary.crystalConflict.lose.rate }}</span>%)
            </div>
          </template>
        </div>
      </template>
      <div v-else class="py-2 flex items-center justify-center">データがありません</div>
    </ContentBlock>

    <!-- ノックアウト統計 -->
    <ContentBlock title="ノックアウト統計">
      <div class="flex items-center gap-1">
        <div
          v-for="tab in knockoutChartTabs"
          :key="tab[0]"
          class="text-[1.1rem] px-2 py-1 border border-transparent rounded text-white cursor-pointer text-shadow
            transition-colors duration-200"
          :class="activeKnockoutChartTab === tab[0] ? 'bg-gray-500' : 'hover:bg-gray-500'"
          @click="activeKnockoutChartTab = tab[0]"
        >
          {{ tab[1] }}
        </div>
      </div>
      <n-divider class="!my-1" />
      <div class="h-60">
        <PieChart v-if="currKnockoutChartData.length" :data="currKnockoutChartData" />
        <div v-else class="h-full flex items-center justify-center">データがありません</div>
      </div>
    </ContentBlock>

    <!-- 戦闘不能統計 -->
    <ContentBlock title="戦闘不能統計">
      <div class="flex items-center gap-1">
        <div
          v-for="tab in deathChartTabs"
          :key="tab[0]"
          class="text-[1.1rem] px-2 py-1 border border-transparent rounded text-white cursor-pointer text-shadow
            transition-colors duration-200"
          :class="activeDeathChartTab === tab[0] ? 'bg-gray-500' : 'hover:bg-gray-500'"
          @click="activeDeathChartTab = tab[0]"
        >
          {{ tab[1] }}
        </div>
      </div>
      <n-divider class="!my-1" />
      <div class="h-60">
        <PieChart v-if="currDeathChartData.length" :data="currDeathChartData" />
        <div v-else class="h-full flex items-center justify-center">データがありません</div>
      </div>
    </ContentBlock>
  </div>
</template>

<style scoped>
</style>
