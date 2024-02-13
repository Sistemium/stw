import ReactiveModel from 'sistemium-data-vue';
import type { BaseItem } from '@/init/Model'

export const drawerEditingProps = {
  from: Object,
  isDrawer: {
    type: Boolean,
    default: true,
  },
};

export function useDrawerEditing(model: ReactiveModel) {
  return {
    saveFn,
    destroyFn,
  };
  async function saveFn(obj: BaseItem) {
    return model.createOne(obj);
  }

  async function destroyFn(id: string) {
    return model.destroy(id);
  }
}
