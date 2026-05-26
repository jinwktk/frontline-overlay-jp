<script setup lang="ts">
import { useMessage } from 'naive-ui'
import {
  EventNoteFilled,
  CopyAllFilled,
} from '@vicons/material'
import IconGithub from '../icons/IconGithub.vue'
import AppInfo from '@/constants/app-info'
import { checkAppUpdates, copyToClipboard } from '@/tools'

const NAIVE_UI_MESSAGE = useMessage()

const appNewVersion = ref('')
const checkingAppUpdate = ref(false)

onMounted(() => {
  checkAppUpdate()
})

const contactData = computed(() => [
  {
    key: 'githubRepo',
    label: 'Github',
    icon: IconGithub,
    data: AppInfo.githubRepo,
    onClick: () => {
      window.open(AppInfo.githubRepo)
    },
    onClickCopyBtn: () => {
      copyToClipboard(AppInfo.githubRepo)
      NAIVE_UI_MESSAGE.success('リンクをコピーしました')
    },
  },
  {
    key: 'changelogDoc',
    label: '更新履歴',
    icon: EventNoteFilled,
    data: AppInfo.changelogDoc,
    onClick: () => {
      window.open(AppInfo.changelogDoc)
    },
    onClickCopyBtn: () => {
      copyToClipboard(AppInfo.changelogDoc)
      NAIVE_UI_MESSAGE.success('リンクをコピーしました')
    },
  }
])

const checkAppUpdate = async () => {
  try {
    checkingAppUpdate.value = true
    const { needUpdate, latestVersion } = await checkAppUpdates()
    if (needUpdate) appNewVersion.value = latestVersion
    else appNewVersion.value = ''
  } catch (e) {
    console.error('アプリの更新確認中にエラーが発生しました:', e)
  } finally {
    checkingAppUpdate.value = false
  }
}
const handleCheckAppUpdate = async () => {
  if (checkingAppUpdate.value) {
    NAIVE_UI_MESSAGE.info('確認中です。しばらくお待ちください'); return
  }
  await checkAppUpdate()
  if (appNewVersion.value) {
    NAIVE_UI_MESSAGE.info('新しいバージョンがあります')
  } else {
    NAIVE_UI_MESSAGE.info('最新バージョンです')
  }
}
const handleUpdateApp = async () => {
  const cacheKeys = await caches.keys()
  for (const name of cacheKeys) {
    await caches.delete(name)
  }
  location.reload()
}
</script>

<template>
  <div class="page-panel">
    <div class="page-title">
      <span>現在のバージョン:</span>
      <span class="text-orange-700 font-bold">{{ AppInfo.version }}</span>
    </div>
    <div class="page-content flex-col items-start pb-[0.375rem]">
      <template v-if="appNewVersion">
        <div>新しいバージョン: {{ appNewVersion }}</div>
        <n-button
          size="large"
          type="success"
          class="px-12 text-[1.25rem]"
          :loading="checkingAppUpdate"
          @click="handleUpdateApp"
        >
          更新する
        </n-button>
        <div class="text-red-600">※現在の対戦データは失われます。</div>
      </template>
      <template v-else>
        <div>最新バージョンです</div>
        <n-button
          size="large"
          type="info"
          class="px-12 text-[1.25rem]"
          :loading="checkingAppUpdate"
          @click="handleCheckAppUpdate"
        >
          更新を確認
        </n-button>
      </template>
    </div>
    <div class="page-title">リンク</div>
    <div class="page-content">
      <div>左のボタンで別ウィンドウを開き、右のボタンでリンクをコピーします。</div>
      <div class="grid grid-cols-[1fr_auto] gap-1 w-fit">
        <div v-for="contact in contactData" :key="contact.key" class="contents">
          <n-button size="large" type="info" class="px-12 text-[1.25rem]" @click="contact.onClick">
            <template #icon>
              <n-icon>
                <component :is="contact.icon" />
              </n-icon>
            </template>
            {{ contact.label }}
          </n-button>
          <n-button size="large" type="info" @click="contact.onClickCopyBtn">
            <template #icon>
              <n-icon>
                <component :is="CopyAllFilled" />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
