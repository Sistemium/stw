import { ref, type Ref } from 'vue'
import { safeT } from '@/services/i18n'
import axios from 'axios'
import { useInvStore } from '@/store/invStore'

export interface AssistantReport {
  columns: {
    name: string
    dataType: 'string' | 'date' | 'number' | 'boolean'
    decimals?: number
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
  results: Ref<SearchResult[]>
  loading: Ref<boolean>
  error?: Ref<string>
}

export interface UnwrappedPrompt {
  id: string
  query: string
  results: SearchResult[]
  loading: boolean
  error?: string
}


export function useAiQuery() {
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string> = ref('')
  const results: Ref<SearchResult[]> = ref([])
  const store = useInvStore()

  async function search(query: string) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await axios.post<SearchResult[]>('/api/ai/query', { query }, {
        headers: {
          authorization: store.authToken,
        },
      })
      results.value = data || []
      return { data }
    } catch (e) {
      error.value = safeT('error getting response', 'validation')
      return { error }
    } finally {
      loading.value = false
    }
  }

  return { loading, error, results, search }
}
