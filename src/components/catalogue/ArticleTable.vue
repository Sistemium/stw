<template lang="pug">

el-table.article-table(
  ref="table"
  :data="articles"
  :height="height"
  highlight-current-row
  row-key="id"
  :size="size"
  stripe
  @row-click="rowClick"
  @current-change="handleCurrentChange"
)
  el-table-column(
    class-name="avatar"
    column-key="avatar"
    :width="60"
  )
    template(#default="{ row }")
      article-avatar(
        :article="row"
        :id="`id-${row.id}`"
        size="default"
      )
  el-table-column(
    :label="$t('fields.name')"
    prop="name"
  )
  el-table-column(
    :label="$t('fields.code')"
    prop="code"
  )
  el-table-column(
    v-for="prop in propColumns"
    :align="prop.align"
    :key="prop.id"
    :label="prop.name"
    :prop="prop.id"
  )
  el-table-column(
    align="center"
    column-key="buttons"
    :width="50"
  )
    el-icon.el-icon-edit()
      Edit

</template>
<script setup lang="ts">

import { ref } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';

defineProps<{
  articles: object[],
  propColumns: object[],
  size?: string;
  height?: number;
}>();

const emit = defineEmits<{
  (e: 'avatarClick', row: object) : void;
  (e: 'click', row: object) : void;
  (e: 'currentChange', current: object, old: object) : void;
}>();
const table = ref(null);

function handleCurrentChange(current, old) {
  emit('currentChange', current, old);
}

function rowClick(row, column) {
  if (!column) {
    return;
  }
  const { columnKey } = column;
  // eslint-disable-next-line default-case
  switch (columnKey) {
    case 'buttons':
      emit('click', row);
      break;
    case 'avatar':
      emit('avatarClick', row);
      break;
  }
}

</script>
<style scoped lang="scss">

.el-icon-edit {
  cursor: pointer;
}

.article-table :deep(td.avatar .cell) {
  text-overflow: unset;
}

</style>
