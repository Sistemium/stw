import { computed } from 'vue'
import { useInvStore } from '@/store/invStore'

export function useSite() {
  const store = useInvStore()

  const siteId = computed({
    get() {
      return store.currentSiteId
    },
    set(v: string) {
      store.currentSiteId = v
    }
  })
  return {
    siteId,
  }
}
