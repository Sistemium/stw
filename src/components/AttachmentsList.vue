<template lang="pug">
.attachments-list(v-loading="loading")
  .files
    .file(
      v-for="file in files"
      :key="file.id"
    )
      el-popconfirm(
        :title="$t('reallyDelete')"
        @confirm="deleteFile(file)"
        :confirm-button-text="$t('fields.bool.yes')"
        :cancel-button-text="$t('fields.bool.no')"
      )
        template(#reference)
          el-link.red(:icon="Delete")
      el-link(size="small" :href="file.url")
        small {{ file.originalName || file.name }}

  el-upload(
    :disabled="files.length > 1"
    action="/api/upload"
    accept="application/pdf"
    :limit="2"
    multiple
    :on-success="onUpload"
    :headers="headers"
    :show-file-list="false"
    :on-error="() => { loading = false }"
    :before-upload="() => loading = true"
  )
    el-button(
      :disabled="files.length > 1"
      circle
      type="primary"
      :icon="Upload"
      size="small"
    )

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import File, { type IFile } from '@/models/File'
import type { UploadFile } from 'element-plus'
import { useStore } from 'vuex'
import { Upload, Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  ownerId: string
}>()

const loading = ref(false);
const store = useStore()
const files = computed(() => File.reactiveFilter({ ownerId: props.ownerId }))
const headers = computed(() => ({
  authorization: store.getters['auth/ACCESS_TOKEN'],
}))

interface Uploaded {
  url: string
}

watch(() => props.ownerId, (ownerId: string) => {
  File.findAll({ ownerId })
}, { immediate: true })

async function onUpload(response: Uploaded[], uploadFile: UploadFile) {
  const [{ url }] = response
  const { name } = uploadFile
  await File.create({ url, name, ownerId: props.ownerId, mime: 'application/pdf' })
    .finally(() => {
      loading.value = false
    })
}

async function deleteFile(file: IFile) {
  loading.value = true
  await File.destroy(file.id)
    .finally(() => {
      loading.value = false
    })
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.attachments-list, .files {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.file {
  margin-right: 6px;
}
.red {
  color: darkred;
}
</style>
