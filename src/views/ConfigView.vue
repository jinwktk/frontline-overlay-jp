<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  SaveFilled,
  WarningRound,
  SettingsApplicationsSharp,
  MonitorHeartFilled,
  FlagFilled,
  AddRound, RemoveRound,
} from '@vicons/material'
import AppInfo from '@/constants/app-info'
import { type AppConfig, type ConfigGroup } from '@/types/config'
import { deepCopy } from '@/tools'
import { useStore } from '@/stores'

const store = useStore()

const groups = computed(() : ConfigGroup[] => {
  return [
    {
      key: 'general',
      name: '全般',
      icon: SettingsApplicationsSharp,
      items: [
        {
          key: 'app_scale',
          name: 'オーバーレイ拡大率',
          desc: [
            'オーバーレイの表示倍率を調整します。',
            '他のオーバーレイと併用する場合も、ACT 側ではなくこちらの設定で調整してください。',
            'この項目を変更した後は、オーバーレイを一度更新すると反映されます。',
          ],
          type: 'slider-number',
          min: 0.5, max: 2, step: 0.1,
        },
        {
          key: 'auto_collapse_when_launch',
          name: '起動時に自動で折りたたむ',
          desc: [
            'オーバーレイ初回読み込み時に自動で折りたたみます。',
            '※ 有効にすると、更新時にも自動で折りたたまれます。'
          ],
          type: 'switch',
        },
        {
          key: 'auto_expand_when_enter_battlefield',
          name: '対戦開始時に自動で展開',
          desc: [
            '対戦開始時にオーバーレイを自動で展開します。',
          ],
          type: 'switch',
        },
        {
          key: 'auto_collapse_when_leave_battlefield',
          name: '対戦終了時に自動で折りたたむ',
          desc: [
            '対戦エリアを離れたとき、オーバーレイを自動で折りたたみます。',
            '※ 初回読み込み時や PvE エリア間の移動では折りたたみません。',
          ],
          type: 'switch',
        },
      ]
    },
    {
      key: 'situation',
      name: '戦況',
      icon: FlagFilled,
      items: [
        {
          key: 'situation_pointcard_style',
          name: '「現在の拠点」レイアウト',
          desc: [
            '「現在の拠点」に表示する拠点カードのレイアウトを調整します。',
            '　> モダン: 1行に複数カードを表示し、情報密度を上げます。',
            '　> クラシック: 1行に1カードを表示し、旧バージョンの見た目を維持します。',
          ],
          type: 'select',
          options: [
            { label: 'モダン', value: 'modern' },
            { label: 'クラシック', value: 'classic' },
          ]
        },
        {
          key: 'watched_players',
          name: 'ウォッチリスト',
          beta: true,
          desc: [
            '気になるプレイヤーを登録し、短いメモを付けられます。',
            '対戦開始時に味方チームを自動で確認し、登録済みプレイヤーとメモを表示します。',
            'プレイヤー名は「プレイヤー名」または「プレイヤー名@ワールド名」の形式で入力します。',
            {
              className: 'text-orange-600',
              content: '※ 敵陣営や途中参加した味方プレイヤーは確認しません。',
            },
            {
              className: 'text-red-600',
              content: `※ 現在登録できるプレイヤーは最大${AppInfo.balanceConstants.watchedPlayersMaxCount}名です。`,
            },
          ],
          type: 'watched-players',
          maxCount: AppInfo.balanceConstants.watchedPlayersMaxCount,
        },
      ]
    },
    {
      key: 'monitor',
      name: '監視',
      icon: MonitorHeartFilled,
      items: [
        {
          key: 'badboy_threshold',
          name: '妨害判定しきい値',
          desc: [
            '10000 から 99999 の間でしきい値を設定します。',
            'しきい値を超えるダメージを受けた場合、監視対象スキルでなくても妨害統計に記録します。',
          ],
          type: 'number',
          min: 10000, max: 99999,
          step: 1000, decimalPlaces: 0,
        },
      ]
    },
  ]
})

const formConfig = ref<AppConfig>(store.appConfig)
const groupCollapsed = ref<Record<string, boolean>>({})

onMounted(() => {
  formConfig.value = deepCopy(store.appConfig)
  groupCollapsed.value = Object.fromEntries(groups.value.map(group => [group.key, false]))
  if (!formConfig.value.watched_players?.length) {
    formConfig.value.watched_players = [{ name: '', note: '' }]
  }
})

const handleAddWatchedPlayer = () => {
  formConfig.value.watched_players.push({ name: '', note: '' })
}
const handleRemoveWatchedPlayer = (index: number) => {
  formConfig.value.watched_players.splice(index, 1)
}

const handleSave = () => {
  if (formConfig.value.watched_players.length) {
    formConfig.value.watched_players = formConfig.value.watched_players.filter(wp => wp.name.trim())
  }
  store.setAppConfig(formConfig.value)
  if (window.opener) {
    window.opener.postMessage(
      { type: "config:update" },
      window.location.origin
    )
  }
  window.close()
}

</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-4">
    <div class="text-2xl font-bold flex items-center">
      設定
      <div class="ml-auto">
        <n-button
          type="success"
          size="large"
          @click="handleSave"
        >
          <template #icon>
            <SaveFilled />
          </template>
          保存
        </n-button>
      </div>
    </div>
    <n-divider class="!my-1" />
    <FoldableCard
      v-for="group in groups"
      :key="group.key"
      :card-key="'config-group-' + group.key"
      show-card-border
    >
      <template #header>
        <div class="flex items-center gap-1.5">
          <n-icon size="24"><component :is="group.icon" /></n-icon>
          <span class="font-semibold">{{ group.name }}</span>
        </div>
      </template>
      <div class="divide-y divide-gray-100">
        <div
          v-for="item in group.items"
          :key="item.key"
          class="flex items-start justify-between px-1 py-2 hover:bg-gray-100 transition-colors"
        >
          <div class="flex flex-col">
            <div class="flex items-center gap-1 text-base font-medium">
              {{ item.name }}
              <n-tooltip v-if="item.beta" :show-arrow="false">
                <template #trigger>
                  <n-icon size="16" color="#F0A020"><WarningRound /></n-icon>
                </template>
                この項目は評価中です。今後のバージョンで大きく変更または削除される可能性があります。
              </n-tooltip>
            </div>
            <div v-if="item.desc">
              <template v-for="(descItem, descIndex) in item.desc" :key="`${item.key}-${descIndex}`">
                <div v-if="typeof descItem === 'string'" class="text-xs text-gray-500">{{ descItem }}</div>
                <div v-else :class="'text-xs text-gray-500 ' + (descItem.className || '')" :style="descItem.style">{{ descItem.content }}</div>
              </template>
            </div>
          </div>
          <div>
            <n-switch
              v-if="item.type === 'switch'"
              v-model:value="(formConfig as any)[item.key]"
            />
            <n-input
              v-else-if="item.type === 'string'"
              v-model:value="(formConfig as any)[item.key]"
              class="w-60"
            />
            <n-input-number
              v-else-if="item.type === 'number'"
              v-model:value="(formConfig as any)[item.key]"
              button-placement="both"
              :min="item.min" :max="item.max"
              :step="item.step"
              :precision="item.decimalPlaces"
              class="w-36 text-center"
            />
            <n-slider
              v-else-if="item.type === 'slider-number'"
              v-model:value="(formConfig as any)[item.key]"
              :min="item.min" :max="item.max"
              :step="item.step"
              class="min-w-36"
            />
            <n-select
              v-else-if="item.type === 'select'"
              v-model:value="(formConfig as any)[item.key]"
              :options="item.options"
              class="w-36"
            />
            <!-- ウォッチリスト -->
            <div v-else-if="item.type === 'watched-players'" class="w-96 ml-1">
              <div
                v-for="(wp, wpIndex) in formConfig.watched_players"
                :key="wpIndex"
                class="flex items-center gap-x-1 mb-1"
              >
                <n-input
                  v-model:value="wp.name"
                  class="flex-1"
                  title="プレイヤー名"
                  placeholder="プレイヤー名"
                />
                <n-input
                  v-model:value="wp.note"
                  class="max-w-44"
                  title="メモ(任意)"
                  placeholder="メモ(任意)"
                />
                <n-button
                  ghost
                  type="error"
                  title="この行を削除"
                  @click="handleRemoveWatchedPlayer(wpIndex)"
                >
                  <template #icon><n-icon><RemoveRound /></n-icon></template>
                </n-button>
              </div>
              <div v-if="formConfig.watched_players.length < item.maxCount" class="flex items-center justify-end w-full">
                <n-button type="primary" class="w-32" @click="handleAddWatchedPlayer">
                  <template #icon><n-icon><AddRound /></n-icon></template>
                  追加
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FoldableCard>
  </div>
</template>

<style scoped>
</style>
