import { ref } from 'vue'
import { safeT } from '@/services/i18n'
import axios from 'axios'
import { useInvStore } from '@/store/invStore'

export interface AssistantReport {
  columns: {
    name: string
    dataType: 'string' | 'date' | 'number' | 'boolean'
  }[]
  data: Record<string, any>[]
}

export interface SearchResult {
  id: string
  name: string
  entityType: 'article' | 'customer' | 'report'
  report: AssistantReport
}

export interface PromptData {
  id: string
  query: string
  results: SearchResult[]
}

export function useAiQuery() {
  const loading = ref('')
  const error = ref<string | null>(null)
  const results = ref<SearchResult[]>([])
  const store = useInvStore()

  async function search(query: string) {
    loading.value = query
    error.value = null
    try {
      const { data } = await axios.post<SearchResult[]>('/api/ai/query', { query }, {
        headers: {
          authorization: store.authToken,
        },
      })
      results.value = data
      return { data }
    } catch (e) {
      error.value = safeT('error getting response', 'validation')
      return { error }
    } finally {
      loading.value = ''
    }
  }

  return { loading, error, results, search }
}
