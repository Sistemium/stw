import { ref } from 'vue'
import { ElNotification } from 'element-plus'

export interface PageProps {
  rootState: string;
  editRoute: string;
  createRoute: string;
  closeRoute: string;
}

export function useBusy() {
  const isBusy = ref(false)
  const wasBusy = ref(false)

  return {
    isBusy,
    async setBusy(promise: Promise<any>) {
      wasBusy.value = isBusy.value
      isBusy.value = true
      try {
        try {
          return await promise
        } catch (e: any) {
          ElNotification({
            message: e.response?.data || e.message,
            type: 'error',
          })
        }
      } finally {
        isBusy.value = wasBusy.value || false
      }
    },
  }
}
