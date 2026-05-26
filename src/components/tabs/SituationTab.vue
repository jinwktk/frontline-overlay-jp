<script setup lang="ts">
import GcCard from '../GcCard.vue'
import PointCards from '../PointCards.vue'
import useCombatParser from '@/composables/useCombatParser'
import { Frontline, GrandCompany } from '@/types'
import { getFrontlineNames } from '@/tools'
import { useStore } from '@/stores'

const store = useStore()
const {
  combatData,
  getGcPoint, getGcIncreaseSpeed,
  situationLockMsg,
  pointData,
  currentBattleStats,
} = useCombatParser()

const maxPointCountForPointCard = computed(() => {
  switch (combatData.zone) {
    case Frontline.triumph:
    case Frontline.naadam:
      return 0
    default:
      return combatData.ptMax
  }
})
</script>

<template>
  <div class="page-panel">
    <!-- 内容锁定遮罩 -->
    <div v-if="situationLockMsg" class="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div class="text-center text-white">
        <div class="text-4xl mb-2">⛓️🔒⛓️</div>
        <div class="text-2xl font-semibold">{{ situationLockMsg }}</div>
      </div>
    </div>

    <!-- 残りポイント -->
    <div class="page-title">残りポイント</div>
    <div class="w-full grid grid-cols-3 gap-2">
      <GcCard
        v-for="company in GrandCompany"
        :key="company"
        :gc="company"
        :me="combatData.gc === company"
        :float-points="getGcPoint(company)"
        :increase-speed="getGcIncreaseSpeed(company)"
      />
    </div>

    <!-- 現在の戦績 -->
    <div class="page-title">現在の戦績</div>
    <div class="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
      <div class="page-content !items-start !py-1 !px-2">
        <div class="text-sm text-white/70 leading-none">K</div>
        <div class="text-[1.7rem] leading-tight font-semibold tabular-nums">{{ currentBattleStats.knockouts }}</div>
      </div>
      <div class="page-content !items-start !py-1 !px-2">
        <div class="text-sm text-white/70 leading-none">D</div>
        <div class="text-[1.7rem] leading-tight font-semibold tabular-nums">{{ currentBattleStats.deaths }}</div>
      </div>
      <div class="page-content !items-start !py-1 !px-2">
        <div class="text-sm text-white/70 leading-none">K/D</div>
        <div class="text-[1.7rem] leading-tight font-semibold tabular-nums">{{ currentBattleStats.kdRatioText }}</div>
      </div>
      <div class="page-content !items-start !py-1 !px-2 min-w-0">
        <div class="text-sm text-white/70 leading-none">与ダメージ</div>
        <div class="w-full text-[1.45rem] leading-tight font-semibold tabular-nums truncate">{{ currentBattleStats.damageDealtText }}</div>
      </div>
    </div>

    <!-- 現在の拠点 -->
    <div class="page-title">現在の拠点</div>
    <div
      v-if="combatData.zone === Frontline.shatter"
      class="w-full text-[1.25rem] self-baseline text-white px-1 py-0.5 rounded bg-gray-400/90 border border-black/50"
    >
      {{ getFrontlineNames(combatData.zone)[1] }} の現在拠点データ解析にはまだ対応していません。
    </div>
    <PointCards
      :points="pointData"
      :max-point-count="maxPointCountForPointCard"
      :card-style="store.appConfig.situation_pointcard_style"
    />


    <!-- ウォッチリスト -->
    <template v-if="combatData.matchedWatchedPlayers.length > 0">
      <div class="page-title">ウォッチリスト</div>
      <div
        v-for="(wp, idx) in combatData.matchedWatchedPlayers"
        :key="idx"
        class="page-content flex !items-baseline gap-1 !px-1 !py-0.5"
      >
        <div class="w-60">
          <span class="">⭐ {{ wp.name }}</span>
          <span v-if="wp.worldName" class="text-base text-amber-900"> @{{ wp.worldName }}</span>
        </div>
        <div>／</div>
        <div v-if="wp.note">{{ wp.note }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
