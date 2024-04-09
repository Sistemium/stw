<template lang="pug">

component.drawer-edit.box-card(
  ref="drawer"
  :is="drawerComponent"
  shadow="never"
  :title="title"
  :model-value="true"
  :append-to-body="true"
  :destroy-on-close="true"
  :size="size"
  :style="drawerStyle"
  @close="handleClose"
)

  .container
    slot(:model="model")

  form-buttons(
    :changed="changed"
    :deletable="isDeletable"
    size="default"
    @save-click="onSaveClick"
    @cancel-click="cancelClick"
    @delete-click="onDeleteClick"
  )

</template>
<script setup lang="ts">

import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import FormButtons from 'sistemium-vue/components/FormButtons.vue';
import matchesDeep from 'sistemium-data/lib/util/matchesDeep.js';
import { localizedDeleteError } from '@/services/erroring.js';
import i18n from '@/i18n';
import type { BaseItem } from '@/init/Model'
import { useI18n } from 'vue-i18n';

const props = defineProps({
  title: String,
  isDrawer: { type: Boolean, default: true },
  size: {
    type: String,
    default: '370px',
  },
  from: Object,
  forceModified: Boolean,
  deletable: {
    type: Boolean,
    default: false,
  },
  modelOrigin: {
    type: Object,
    default: null,
  },
  saveFn: {
    type: Function,
    async default(props: any) {
      console.error('saveFn not implemented', props);
    },
  },
  destroyFn: {
    type: Function,
    async default(id: string) {
      console.error('destroyFn not implemented', id);
    },
  },
  validateFn: {
    type: Function,
  },
  drawerStyle: Object,
  afterCloseTo: Object,
});

const emit = defineEmits<{
  (e: 'deleted', id: string | null): void
  (e: 'error', error: Error): void
}>();

const drawer = ref(null);
const loadingMessage = ref();
const drawerOpen = ref(false);
const model = ref();
const router = useRouter();
const route = useRoute();
const $parent = ref();

nextTick(() => {
  drawerOpen.value = true;
});

const drawerComponent = computed(() => props.isDrawer ? 'el-drawer' : 'el-card');
const { t } = useI18n()
// const loading = computed(() => !!loadingMessage.value);
const isDeletable = computed(() => props.deletable && !!props.modelOrigin?.id);
const changed = computed(() => props.forceModified || hasChanges.value);
const hasChanges = computed(() => {
  return !props.modelOrigin
    || !props.modelOrigin.id
    || !matchesDeep(model.value, props.modelOrigin);
});

onMounted(() => {
  $parent.value = getCurrentInstance()?.parent;
});

watch(() => props.modelOrigin, modelOrigin => {
  model.value = cloneDeep(modelOrigin || {});
}, { immediate: true });

function onDeleteClick() {
  const { id } = model.value;
  if (!id) {
    emit('deleted', null);
    return;
  }
  performOperation(() => props.destroyFn(id)
    .then(() => {
      emit('deleted', id);
    }).catch(e => {
      throw localizedDeleteError(e);
    }));
}

function getValidateForm() {
  const fn = props.validateFn || $parent.value?.refs?.form?.validate;
  return fn || ((cb: any) => typeof cb === 'function' && cb(true));
}

function onSaveClick() {
  getValidateForm()((valid: any) => {
    if (valid) {
      performOperation(save);
    } else {
      ElMessage.warning(i18n.global.t('validation.formInvalid').toString());
    }
  });
}

function save() {
  return props.saveFn(model.value)
    .then((record: BaseItem) => {
      $parent.value?.emit('saved', record);
      return record;
    });
}

function handleClose(record: any) {
  if (!props.from) {
    drawerOpen.value = false;
    $parent.value?.emit('closed', record);
    return;
  }
  const query = pick(route.query, 'search') as { [key: string]: string };
  if (record && !props.modelOrigin.id) {
    query.createdId = record.id;
  }
  router.replace(merge({ ...(props.afterCloseTo || props.from) }, { query }))
    .catch(e => console.error('handleClose', e));
}

function cancelClick(record: any) {
  if (!drawer.value) {
    console.error('cancelClick', 'drawer ref is empty');
    return;
  }
  handleClose(record);
}

async function performOperation(op) {

  showLoading();

  try {
    const res = await op();
    hideLoading();
    cancelClick(res);
  } catch (e: any) {
    hideLoading();
    emit('error', e);
    showError(e);
  }

}

function showError(e) {
  return ElMessage.error({
    message: e.message,
    // offset: 20,
    duration: 7500,
    showClose: true,
    dangerouslyUseHTMLString: true,
  });
}

function showLoading(message = '') {
  loadingMessage.value = ElMessage({
    message: message || `${i18n.global.t('saving')} ...`,
    duration: 0,
  });
}

function hideLoading() {
  if (!loadingMessage.value) {
    return;
  }
  loadingMessage.value.close();
  loadingMessage.value = null;
}

</script>
<style lang="scss">

@import "../styles/variables";

.container {
  //padding: $margin-right;
}

.el-drawer.drawer-edit {
  height: unset;
}

.el-card.drawer-edit {
  @include responsive-only(xxs) {
    border: none;
    :deep(.el-card__body), .container {
      padding: 0;
    }
  }
  @include responsive-only(gt-xxs) {
    .form-buttons {
      justify-content: flex-end;
    }
  }
}

</style>
