<template lang="pug">

el-select.storage-select(
  v-model="storageId"
  :placeholder="$tAction('select', 'storage')"
  ref="select"
  :disabled="disabled"
  :clearable="clearable"
)
  el-option-group(
    v-for="group in groups"
    :key="group.type"
    :label="group.label"
  )
    el-option(
      v-for="storage in group.options"
      :key="storage.id"
      :label="storage.name"
      :value="storage.id"
    )

</template>
<script setup>

import { computed, ref } from 'vue';
import orderBy from 'lodash/orderBy';
import Storage from '@/models/Storage';
import i18n from '@/i18n';

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  clearable: Boolean,
});

const emit = defineEmits(['update:modelValue']);

defineExpose({ open });

const select = ref(null);

function open() {
  select.value.visible = true;
}

const storageId = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const groups = computed(() => ['facility', 'personal']
  .map(type => ({
    type,
    label: i18n.global.t(`concepts.${type}`),
    options: orderBy(Storage.reactiveFilter({ type }), 'name'),
  }))
  .filter(({ options }) => options.length));

</script>
<style lang="scss">
.storage-select {
  width: 200px;
}
</style>
