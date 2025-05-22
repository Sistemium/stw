<template lang="pug">
.assistant-page
  page-title(title="menu.assistant")
  el-container
    el-main
      assistant-query-input(
        :disabled="loading"
        @query="onQuery"
      )
      stm-resize.my-3(:padding="20")
        .assistance(
          v-for="item in thread"
          :key="item.id"
        )
          p.text-left {{ item.query }}
            el-button.float-right(
              text
              type="info"
              @click="removeItem(item.id)"
            ) {{ $t('delete') }}
          assistant-found-list(
            :results="item.results"
            @close="removeItem(item.id)"
            v-model="selected"
          )
        el-skeleton.my-3(
          v-if="loading"
          :rows="3"
          animated
        )
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { v4 } from 'uuid'
import PageTitle from '@/components/PageTitle.vue'
import AssistantQueryInput from '@/components/assistant/AssistantQueryInput.vue'
import AssistantFoundList from '@/components/assistant/AssistantFoundList.vue'
import { type SearchResult, useAiQuery } from '@/services/prompting'
import StmResize from '@/lib/StmResize.vue'


const thread = ref<{ id: string, query: string, results: SearchResult[] }[]>([])
const { search, loading, error } = useAiQuery()
const selected = ref<string[]>([])

function onQuery(query: string) {
  search(query)
    .then(({ data }) => {
      if (data) {
        thread.value.push({
          id: v4(),
          query,
          results: data,
        })
      }
    })
}

watch(error, message => {
  if (message) {
    ElMessage.error({
      message,
      showClose: true,
    })
  }
})

function removeItem(id: string) {
  const idx = thread.value.findIndex(item => item.id === id)
  if (idx >= 0) {
    thread.value.splice(idx, 1)
  }
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.assistant-page {
  margin: 0 auto;
  max-width: 1000px;
}
.page-title {
  margin-bottom: 0;
}
</style>
