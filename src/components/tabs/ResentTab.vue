<script setup lang="ts">
import {
  VisibilityFilled,
  VisibilityOffFilled,
} from '@vicons/material'
import JobSpan from '../ui/JobSpan.vue'
import useCombatParser from '@/composables/useCombatParser'
import { formatTime } from '@/tools'
import type { SelfActionLog } from '@/types/combat'

const NAIVE_UI_MESSAGE = useMessage()
const {
  combatData,
} = useCombatParser()

const hidePlayerName = ref(false)
const insideTabs = computed(() => [
  [ 'goodboys', '被支援', '他プレイヤーがあなたに使用した重要支援スキル', combatData.goodboys ],
  [ 'badboys', '被妨害', '他プレイヤーがあなたに使用した重要妨害スキル', combatData.badboys ],
  [ 'mygoods', '支援', 'あなたが他プレイヤーに使用した重要支援スキル', combatData.mygoods ],
  [ 'mybads', '妨害', 'あなたが他プレイヤーに使用した重要妨害スキル', combatData.mybads ],
] as [string, string, string, SelfActionLog[]][])
const activeTab = ref(insideTabs.value![0]![0])

const currTabDescription = computed(() => insideTabs.value!.find(tab => tab[0] === activeTab.value)![2])
const currSelfActionLogs = computed(() => insideTabs.value!.find(tab => tab[0] === activeTab.value)![3])

const getSelfActionLogDamage = (log: SelfActionLog) => {
  if (log.actionInstantDeath) {
    return '即死'
  }
  return log.actionDamage.toLocaleString()
}

const switchShowPlayerNameButtonActionText = computed(() => hidePlayerName.value ? '表示' : '非表示')
const handleSwitchShowPlayerName = () => {
  const act = switchShowPlayerNameButtonActionText.value
  hidePlayerName.value = !hidePlayerName.value
  NAIVE_UI_MESSAGE.info(`プレイヤー名を${act}にしました`)
}
</script>

<template>
  <div class="page-panel min-h-0">
    <div class="w-full flex items-center gap-1 shrink-0">
      <div
        v-for="tab in insideTabs"
        :key="tab[0]"
        class="text-[1.2rem] leading-[1] px-2 py-1 border border-transparent rounded text-white cursor-pointer text-shadow
          transition-colors duration-200"
        :class="activeTab === tab[0] ? 'bg-white/30' : 'hover:bg-white/30'"
        @click="activeTab = tab[0]"
      >
        {{ tab[1] }}
      </div>
      <n-divider vertical />
      <div class="text-[1.1rem] text-white text-shadow">{{ currTabDescription }}</div>
    </div>
    <n-divider class="!my-1 shrink-0"></n-divider>
    <div class="w-full flex flex-col gap-0.5 flex-1 min-h-0 overflow-y-auto">
      <div v-if="!currSelfActionLogs.length" class="page-title">データがありません</div>
      <AlertTitle v-else-if="!combatData.zone && !combatData.onConflict" msg="ここには前回の記録を表示しています。次回の対戦開始時に消去されます。" />
      <div
        v-for="(log, logIndex) in currSelfActionLogs"
        :key="`${activeTab}-${logIndex}`"
        class="page-title"
      >
        <div>{{ formatTime(log.happenTime) }}　</div>
        <div class="flex flex-wrap flex-1">
          <template v-if="activeTab === 'goodboys'">
            <div class="flex items-center">
              <JobSpan v-if="log.targetJob" :job="log.targetJob" />
              <span class="text-orange-700" :class="hidePlayerName ? 'blur' : ''">{{ log.targetName }}</span>
            </div>
            <span>があなたに</span>
            <span class="text-orange-700">{{ log.actionName }}</span>
            <span>を使用しました</span>
            <template v-if="log.actionDamage">
              <span>、</span>
              <span class="text-orange-700">{{ log.actionDamage.toLocaleString() }}</span>
              <span>HP回復</span>
            </template>
          </template>
          <template v-else-if="activeTab === 'mygoods'">
            <span>対象:</span>
            <div class="flex items-center">
              <JobSpan v-if="log.targetJob" :job="log.targetJob" />
              <span class="text-orange-700" :class="hidePlayerName ? 'blur' : ''">{{ log.targetName }}</span>
            </div>
            <span>に使用:</span>
            <span class="text-orange-700">{{ log.actionName }}</span>
            <template v-if="log.actionDamage">
              <span>、</span>
              <span class="text-orange-700">{{ log.actionDamage.toLocaleString() }}</span>
              <span>HP回復</span>
            </template>
          </template>
          <template v-else-if="activeTab === 'badboys'">
            <div class="flex items-center">
              <JobSpan v-if="log.targetJob" :job="log.targetJob" />
              <span class="text-orange-700" :class="hidePlayerName ? 'blur' : ''">{{ log.targetName }}</span>
            </div>
            <span>があなたに</span>
            <span class="text-orange-700">{{ log.actionName }}</span>
            <span>を使用しました</span>
            <template v-if="log.actionDamage">
              <span>、</span>
              <span class="text-orange-700">{{ getSelfActionLogDamage(log) }}</span>
              <span>ダメージ</span>
            </template>
          </template>
          <template v-else-if="activeTab === 'mybads'">
            <span>対象:</span>
            <div class="flex items-center">
              <JobSpan v-if="log.targetJob" :job="log.targetJob" />
              <span class="text-orange-700" :class="hidePlayerName ? 'blur' : ''">{{ log.targetName }}</span>
            </div>
            <span>に使用:</span>
            <span class="text-orange-700">{{ log.actionName }}</span>
            <template v-if="log.actionDamage">
              <span>、</span>
              <span class="text-orange-700">{{ getSelfActionLogDamage(log) }}</span>
              <span>ダメージ</span>
            </template>
          </template>
        </div>
      </div>
    </div>

    <n-tooltip trigger="hover" placement="left">
      <template #trigger>
        <n-float-button
          type="primary"
          bottom="1rem" right="1rem"
          @click="handleSwitchShowPlayerName"
        >
          <n-icon>
            <VisibilityFilled v-if="hidePlayerName" />
            <VisibilityOffFilled v-else />
          </n-icon>
        </n-float-button>
      </template>
      <div class="text-[1.2rem]">プレイヤー名を{{ switchShowPlayerNameButtonActionText }}</div>
    </n-tooltip>
  </div>
</template>

<style scoped>
</style>
