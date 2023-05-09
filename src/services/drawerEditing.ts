import ReactiveModel from 'sistemium-data-vue';

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
  async function saveFn(obj) {
    return model.createOne(obj);
  }

  async function destroyFn(id) {
    return model.destroy(id);
  }
}
