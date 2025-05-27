<template lang="pug">
.assistant-page.mx-auto(style="max-width: 1000px")
  snack-message(v-model="rootError")
  page-title(title="menu.assistant")
  assistant-query-input.mb-3(
    :disabled="!!loading"
    @query="onQuery"
    @remove-context="removeContextItem"
    :context
  )
  stm-resize(:padding="20")
    //loading-skeleton.my-3(:loading)
    assistant-found-list.my-3(
      v-model="selected"
      v-for="prompt in thread"
      :key="prompt.id"
      @close="removeItem(prompt.id)"
      @refresh="refresh(prompt)"
      border
      :prompt
    )
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { v4 } from 'uuid'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import PageTitle from '@/components/PageTitle.vue'
import AssistantQueryInput from '@/components/assistant/AssistantQueryInput.vue'
import AssistantFoundList from '@/components/assistant/AssistantFoundList.vue'
// import LoadingSkeleton from '@/components/assistant/LoadingSkeleton.vue'
import SnackMessage from '@/lib/SnackMessage.vue'
import { type PromptData, type SearchResult, useAiQuery } from '@/services/prompting'
import StmResize from '@/lib/StmResize.vue'
import { safeT } from '@/services/i18n'

const loading = ref(false)
const rootError = ref('')
const thread: Ref<PromptData[]> = ref([])
const selected = ref(new Map<string, SearchResult>())

interface ContextItem {
  id: string
  label: string
  ids: string[]
}

const context = computed<ContextItem[]>(() => {
  const all = flatten(thread.value.map(({ results }) => results.value || []))
    .filter(({ id }) => selected.value.has(id))
  return map(groupBy(all, 'entityType'), (items, entityType) => ({
    id: entityType,
    label: `${safeT(entityType, 'plural')}: ${items.length}`,
    ids: items.map(({ id }) => id),
  }))
})

function removeContextItem(id: string) {
  const ctx = context.value.find(item => item.id === id)
  if (ctx) {
    ctx.ids.forEach(id => {
      selected.value.delete(id)
    })
  }
}

function refresh(prompt: PromptData) {
  const { search, loading, error, results } = useAiQuery()
  const item = {
    id: prompt.id,
    query: prompt.query,
    results: prompt.results,
    loading,
    error,
  }

  search(prompt.query)
    .then(() => {
      item.results.value = results.value
    })

  const idx = thread.value.findIndex(v => v.id == prompt.id)
  if (idx === -1) {
    thread.value.splice(0, 0, item)
  } else {
    thread.value.splice(idx, 1, item)
  }

}

function onQuery(query: string) {
  const { search, loading, error, results } = useAiQuery()
  search(query)
  thread.value.splice(0, 0, {
    id: v4(),
    query,
    loading,
    error,
    results,
  })
}

function removeItem(id: string) {
  const idx = thread.value.findIndex(item => item.id === id)
  if (idx >= 0) {
    thread.value.splice(idx, 1)
  }
}

</script>
