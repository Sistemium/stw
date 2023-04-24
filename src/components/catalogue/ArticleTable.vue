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
    i.el-icon-edit

</template>
<script setup>

import { ref } from 'vue';
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';

defineProps({
  articles: Array,
  propColumns: Array,
  size: String,
  height: Number,
});

const emit = defineEmits(['currentChange', 'click', 'avatarClick']);
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

</style>
