<template lang="pug">
.assistant-page.mx-auto(style="max-width: 1000px")
  v-snackbar(
    :model-value="!!error"
    color="error"
  ) {{ error }}
    template(#actions)
      v-btn(
        @click="() => { error = '' }"
        icon="$mdiClose"
      )
  page-title(title="menu.assistant")
  assistant-query-input.mb-3(
    :disabled="!!loading"
    @query="onQuery"
  )
  stm-resize(:padding="20")
    v-list.my-3(
      border
      v-if="loading"
    )
      v-list-subheader
        v-icon $mdiMessageProcessingOutline
        span.ml-3 {{ loading }}
      v-skeleton-loader.ma-2(type="paragraph")
    .assistance.my-3(
      v-for="item in thread"
      :key="item.id"
    )
      v-list-item
        v-list-subheader
          v-icon $mdiMessageOutline
          span.ml-3 {{ item.query }}
        template(#append)
          v-btn(
            variant="tonal"
            color="info"
            density="compact"
            @click="removeItem(item.id)"
          ) {{ $t('delete') }}
      assistant-found-list(
        border
        :results="item.results"
        @close="removeItem(item.id)"
        v-model="selected"
      )
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
        thread.value.splice(0, 0, {
          id: v4(),
          query,
          results: data,
        })
      }
    })
}

function removeItem(id: string) {
  const idx = thread.value.findIndex(item => item.id === id)
  if (idx >= 0) {
    thread.value.splice(idx, 1)
  }
}

</script>
