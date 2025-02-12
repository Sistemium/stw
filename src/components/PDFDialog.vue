<template lang="pug">

el-dialog.p-d-f-dialog(
  top="40px"
  v-model="visible"
  :title="title"
  :fullscreen="fullscreen"
  :show-close="true"
  :append-to-body="true"
  width="75%"
  @closed="handleClose()"
)
  .pages(
    v-for="page in pages"
    :key="page"
  )
    VuePDF(
      fit-parent
      :pdf="pdf"
      :page="page"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFile } from '@/models/File'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const props = defineProps<{
  fullscreen?: boolean
  file: IFile
}>()

const visible = defineModel<boolean>()
const title = computed(() => props.file.originalName)
const {
  pdf,
  pages,
} = usePDF(props.file.url)


function handleClose() {
  visible.value = false
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
