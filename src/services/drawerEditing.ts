import ReactiveModel from 'sistemium-data-vue';
import type { BaseItem } from '@/init/Model'

export const drawerEditingProps = {
  from: Object,
  isDrawer: {
    type: Boolean,
    default: true,
  },
};

export function useDrawerEditing<T extends BaseItem = BaseItem>(model: ReactiveModel<T>) {
  return {
    saveFn,
    destroyFn,
  };
  async function saveFn(obj: Partial<T>) {
    return model.createOne(obj);
  }

  async function destroyFn(id: string) {
    return model.destroy(id);
  }
}
