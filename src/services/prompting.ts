import { ref } from 'vue'
import { safeT } from '@/services/i18n'
import axios from 'axios'
import { useInvStore } from '@/store/invStore'

export interface SearchResult {
  id: string
  name: string
  entityType: 'article' | 'customer'
}

export function useAiQuery() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<SearchResult[]>([])
  const store = useInvStore()

  async function search(query: string) {
    loading.value = true
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
      loading.value = false
    }
  }

  return { loading, error, results, search }
}
