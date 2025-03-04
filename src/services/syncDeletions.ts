import { subscribeChanges } from '@/services/socket'
import { storeAdapter } from 'sistemium-data-vue/lib/components/HydratedModel'

export default function() {
  subscribeChanges('RecordStatus', async (doc?: Record<string, any>) => {
    const name = doc?.name
    if (!name) {
      return
    }
    const model = storeAdapter.getStoreModelIfExists(name)
    if (!model) {
      return
    }
    const { objectXid } = doc
    model.eject(objectXid)
  })
    .catch(e => console.error(e))
}
