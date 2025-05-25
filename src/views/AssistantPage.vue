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
    :context
    @query="onQuery"
    @remove-context="removeContextItem"
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
import { computed, ref } from 'vue'
import { v4 } from 'uuid'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import PageTitle from '@/components/PageTitle.vue'
import AssistantQueryInput from '@/components/assistant/AssistantQueryInput.vue'
import AssistantFoundList from '@/components/assistant/AssistantFoundList.vue'
import { type SearchResult, useAiQuery } from '@/services/prompting'
import StmResize from '@/lib/StmResize.vue'
import { safeT } from '@/services/i18n'


const thread = ref<{ id: string, query: string, results: SearchResult[] }[]>([])
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
    label: `${safeT(entityType, 'fields')}: ${items.length}`,
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
