<script setup lang="ts">
import useCombatParser from '@/composables/useCombatParser'
import { ImportantActions } from '@/constants'
import { formatTime } from '@/tools'

const {
  combatData,
} = useCombatParser()

const parsedIarLog = computed(() => {
  return combatData.iarLog.map(log => {
    const [measures] = ImportantActions[log.actionName]!
    return {
      ...log,
      formatedHappenTime: formatTime(log.happenTime),
      showExecs: measures.includes('exec'),
      showHits: measures.includes('hit'),
      showDamage: measures.includes('damage'),
      showHeal: measures.includes('heal'),
    }
  })
})
</script>

<template>
  <div class="page-panel">
    <div class="w-full flex flex-col gap-0.5 flex-1 overflow-y-auto">
      <div v-if="!combatData.iarLog.length" class="page-title">データがありません</div>
      <AlertTitle v-else-if="!combatData.zone && !combatData.onConflict" msg="ここには前回の記録を表示しています。次回の対戦開始時に消去されます。" />
      <div v-for="(log, logIndex) in parsedIarLog" :key="`log-${logIndex}`" class="page-title">
        <div>{{ log.formatedHappenTime }}　</div>
        <div class="flex-1">
          <span>発動:</span>
          <template v-if="log.showExecs">
            <span class="text-orange-700">{{ log.actionTargets.length }}</span>
            <span>回</span>
          </template>
          <span class="text-orange-700">{{ log.actionName }}</span>
          <template v-if="log.showHits">
            <span> 命中</span>
            <span class="text-orange-700">{{ log.actionTargets.length }}</span>
            <span>人</span>
          </template>
          <template v-if="log.showDamage">
            <span>、合計</span>
            <span class="text-orange-700">{{ log.totalDamage.toLocaleString() }}</span>
            <span>ダメージ</span>
          </template>
          <template v-if="log.showHeal">
            <span>、合計</span>
            <span class="text-orange-700">{{ log.totalHeal.toLocaleString() }}</span>
            <span>HP回復</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
