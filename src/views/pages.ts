import { ref } from 'vue';
import { ElNotification } from 'element-plus';

export interface PageProps {
  rootState: string;
  editRoute: string;
  createRoute: string;
  closeRoute: string;
}

export function useBusy() {
  const isBusy = ref(false);
  const wasBusy = ref(false);
  return { setBusy, isBusy };
  function setBusy(promise) {
    wasBusy.value = isBusy.value;
    isBusy.value = true;
    return promise
      .catch(e => {
        ElNotification({
          message: e.response?.data || e.message,
          type: 'error',
        });
      })
      .finally(() => {
        isBusy.value = wasBusy.value || false;
      });
  }
}
