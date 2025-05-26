<template lang="pug">
.assistant-page.mx-auto(style="max-width: 1000px")
  snack-message(v-model="error")
  page-title(title="menu.assistant")
  assistant-query-input.mb-3(
    :disabled="!!loading"
    @query="onQuery"
    @remove-context="removeContextItem"
    :context
  )
  stm-resize(:padding="20")
    loading-skeleton.my-3(:loading)
    assistant-found-list.my-3(
      v-for="prompt in thread"
      :key="prompt.id"
      @close="removeItem(prompt.id)"
      v-model="selected"
      border
      :prompt
    )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { v4 } from 'uuid'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import PageTitle from '@/components/PageTitle.vue'
import AssistantQueryInput from '@/components/assistant/AssistantQueryInput.vue'
import AssistantFoundList from '@/components/assistant/AssistantFoundList.vue'
import LoadingSkeleton from '@/components/assistant/LoadingSkeleton.vue'
import SnackMessage from '@/lib/SnackMessage.vue'
import { type PromptData, useAiQuery } from '@/services/prompting'
import StmResize from '@/lib/StmResize.vue'
import { safeT } from '@/services/i18n'


const thread = ref<PromptData[]>([])
const { search, loading, error } = useAiQuery()
const selected = ref<string[]>([])

interface ContextItem {
  id: string
  label: string
  ids: string[]
}

const context = computed<ContextItem[]>(() => {
  const all = flatten(thread.value.map(({ results }) => results))
    .filter(({ id }) => selected.value.includes(id))
  return map(groupBy(all, 'entityType'), (items, entityType) => ({
    id: entityType,
    label: `${safeT(entityType, 'plural')}: ${items.length}`,
    ids: items.map(({ id }) => id)
  }))
})

function removeContextItem(id: string) {
  const ctx = context.value.find(item => item.id === id)
  if (ctx) {
    selected.value = selected.value.filter(s => !ctx.ids.includes(s))
  }
}

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
