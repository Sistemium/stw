<template lang="pug">

drawer-edit.article-edit(
  :title="$tGen('editing', 'article')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="currentTab ==='0'"
  :drawer-style="drawerStyle"
  :size="drawerWidth"
)
  template(#default="{ model }")
    el-tabs(v-model="currentTab")
      el-tab-pane(:label="$t('menu.articleProps')")
        article-form(ref="form" :model="model")
      el-tab-pane(:label="$t('menu.measurements')")
        article-measurement-form(:model="model" ref="measurementForm")
      el-tab-pane(:label="$t('concepts.recipe')")
        recipe-form(:model="model" ref="recipeForm")
      //el-tab-pane(:label="$t('menu.barcodes')")
        .list-group
          .list-group-item(
            v-if="!model.barcodes || !model.barcodes.length"
          ) {{ $t('validation.noData') }}
          .list-group-item(v-for="barcode in model.barcodes" :key="barcode")
            .code {{ barcode }}
      el-tab-pane.pictures(:label="$t('menu.pictures')" v-if="articleId" :lazy="true")
        resize(:padding="110")
          article-pictures(:pictures="pictures")
        take-photo-button(@done="onPictureDone" entity-name="Picture")

</template>
<script setup lang="ts">

import DrawerEdit from '@/lib/DrawerEdit.vue';
import Article from '@/models/Article';
import ArticleForm from '@/components/catalogue/ArticleForm.vue';
import { articleInstance } from '@/services/catalogue';
import TakePhotoButton from '@/lib/TakePhotoButton.vue';
import Picture, { mapPictureInfo } from '@/models/Picture';
import find from 'lodash/find';
import ArticlePictures from '@/components/catalogue/ArticlePictures.vue';
import ArticleMeasurementForm from '@/components/catalogue/ArticleMeasurementForm.vue';
import RecipeForm from '@/components/production/RecipeForm.vue';
import Resize from '@/lib/Resize.vue';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { cloneInstance } from '@/lib/validations.js';


const props = defineProps<{
  articleId: string,
  from: object,
  drawerStyle?: object,
}>();

const currentTab = ref(null);
const route = useRoute();
const { width } = useWindowSize();
const drawerWidth = computed(() => width.value > 450 ? '450px' : '370px');
const copyArticle = computed(() => {
  const { copyId } = route.query;
  return cloneInstance(Article.reactiveGet(copyId));
});
const modelOrigin = computed(() => {
  const { articleId } = props;
  if (articleId) {
    return Article.reactiveGet(articleId);
  }
  return copyArticle.value || articleInstance();
});

const pictures = computed(() => Picture.reactiveFilter({ ownerXid: props.articleId })
  .map(mapPictureInfo('smallImage')));

function destroyFn() {
  const { articleId } = props;
  return articleId && Article.destroy(articleId);
}

function saveFn(obj) {
  return Article.createOne(obj);
}

async function onPictureDone(picturesInfo, fileName) {
  // this.$debug(picturesInfo, fileName);
  const { src } = find(picturesInfo, { name: 'largeImage' });
  const { src: thumbnailSrc } = find(picturesInfo, { name: 'thumbnail' });
  const picture = {
    href: src,
    thumbnailHref: thumbnailSrc,
    picturesInfo,
    name: fileName,
    target: 'Article',
    ownerXid: props.articleId,
  };
  try {
    const { id: avatarPictureId } = await Picture.createOne(picture);
    if (pictures.value.length === 1) {
      await Article.createOne({
        ...modelOrigin.value,
        avatarPictureId,
      });
    }
  } catch (e) {
    console.error('onPictureDone', e);
  }
}

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-tab-pane {
  padding-bottom: 60px;
}

.el-tab-pane.pictures {
  margin-bottom: 60px;
}

.take-photo-button {
  margin-top: $margin-right;

  :deep(.el-badge) {
    width: 100%;
  }
}

</style>
