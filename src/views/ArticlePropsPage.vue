<template lang="pug">

.article-props.page

  page-title(title="menu.articlePropsTitle")

  .buttons
    tool-button(tool="add" @click="onAdd()")

  resize(:padding="20")
    article-props-list(
      :article-props="articleProps"
      @click="onPropClick"
      v-if="articleProps.length"
    )
    el-alert.empty(type="info" :title="$t('validation.noData')" :closable="false" v-else)
      el-button(
        type="primary" @click="onAdd()" :plain="true"
      ) {{ $tAction('add', 'property') }}

  router-view

</template>
<script setup>
import ArticleProp from '@/models/ArticleProp';
import ArticlePropsList from '@/components/catalogue/ArticlePropsList.vue';
import PageTitle from '@/components/PageTitle.vue';
import { articlePropertySort } from '@/services/catalogue';
import Resize from '@/lib/Resize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const props = defineProps({
  editRoute: String,
  createRoute: String,
});

const articleProps = computed(() => {
    const items = ArticleProp.reactiveFilter({});
    return articlePropertySort(items);
  });

function onPropClick(prop) {
  router.push({
    name: props.editRoute,
    params: {
      articlePropId: prop.id,
    },
  });
}

function onAdd() {
  router.push({
    name: props.createRoute,
  });
}

</script>
<style scoped lang="scss">
@import "../styles/page";
</style>
