<template lang="pug">

drawer-edit.article-edit(
  :title="title"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="currentTab ==='0'"
  :drawer-style="drawerStyle"
  :size="drawerWidth"
  :validate-fn="validate"
)
  template(#default="{ model }")
    el-tabs(v-model="currentTab")
      el-tab-pane(:label="$t('menu.articleProps')")
        article-form(
          ref="form"
          :model="model"
        )
      el-tab-pane(:label="$t('menu.measurements')")
        article-measurement-form(
          ref="measurementForm"
          :model="model"
        )
      el-tab-pane
        template(#label)
          span.tab-label {{ $t('concepts.recipe') }}
          el-badge(
            v-if="model.materials?.length"
            type="info"
            :value="model.materials?.length"
            size="small"
          )
        .cost-info(v-if="model.materials?.length")
          article-cost-info(
            v-if="model.materials?.length && storageId && date"
            :article-id="model.id"
            :storage-id="storageId"
            :date="date"
            :vat-prices="false"
            :vat-rate="0"
            :materials="model.materials"
            :units="1"
            type="resultCost"
          )
          storage-select(v-model="invStore.currentStorageId")
        recipe-form(
          :model="model"
          ref="recipeFormRef"
          :storage-id="storageId"
          :date="date"
          :vat-prices="false"
          :vat-rate="0"
          cost-type="resultCost"
        )
      //el-tab-pane(:label="$t('menu.barcodes')")
        .list-group
          .list-group-item(
            v-if="!model.barcodes || !model.barcodes.length"
          ) {{ $t('validation.noData') }}
          .list-group-item(v-for="barcode in model.barcodes" :key="barcode")
            .code {{ barcode }}
      el-tab-pane.pictures(
        v-if="articleId"
        :label="$t('menu.pictures')"
        :lazy="true"
      )
        resize(:padding="110")
          article-pictures(:pictures="pictures")
        take-photo-button(
          entity-name="Picture"
          @uploaded="(picturesInfo, fileName) => onPictureDone(model, picturesInfo, fileName)"
        )

</template>
<script setup lang="ts">

import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { eachSeries } from 'async';
import DrawerEdit from '@/lib/DrawerEdit.vue';
import Resize from '@/lib/StmResize.vue';
import TakePhotoButton from '@/lib/TakePhotoButton.vue';
import RecipeForm from '@/components/production/RecipeForm.vue';
import ArticleForm from '@/components/catalogue/ArticleForm.vue';
import ArticlePictures from '@/components/catalogue/ArticlePictures.vue';
import ArticleMeasurementForm from '@/components/catalogue/ArticleMeasurementForm.vue';
import { articleInstance } from '@/services/catalogue.js';
import { cloneInstance } from '@/lib/validations';
import { createPicture } from '@/services/picturing';
import Picture, { mapPictureInfo } from '@/models/Picture.js';
import Article from '@/models/Article.js';
import { setAvatar } from '@/components/catalogue/ArticlePicturing';
import ArticleCostInfo from '@/components/production/ArticleCostInfo.vue';
import { useInvStore } from '@/store/invStore';
import StorageSelect from '@/components/select/StorageSelect.vue';
import { tGen } from '@/lib/validations';

const props = defineProps<{
  articleId?: string,
  from: object,
  drawerStyle?: object,
}>();

const invStore = useInvStore();
const form = ref(null);
const measurementForm = ref(null);
const recipeFormRef = ref(null);
const currentTab = ref('0');
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

const storageId = computed(() => invStore.currentStorageId);
const date = ref(new Date().toJSON());

const pictures = computed(() => Picture.reactiveFilter({ ownerXid: props.articleId })
  .map(mapPictureInfo('smallImage')));

const title = computed(() => [
  modelOrigin.value?.code,
  tGen('editing', 'article'),
].filter(x => x).join(' '));

function validate(callback: (e: boolean) => void) {
  const validators = [
    form.value.validate,
    measurementForm.value.validate,
    recipeFormRef.value.validate,
  ];
  eachSeries(validators, (fn, cb) => {
    fn(valid => {
      cb(valid ? null : Error('invalid'));
    });
  }, err => {
    callback(!err);
  });
}

function destroyFn() {
  const { articleId } = props;
  return articleId && Article.destroy(articleId);
}

function saveFn(obj) {
  return Article.createOne(obj);
}

async function onPictureDone(article, picturesInfo, fileName) {
  const properties = {
    name: fileName,
    target: 'Article',
    ownerXid: props.articleId,
  };
  try {
    const picture = await createPicture(Picture, picturesInfo, properties);
    if (pictures.value.length === 1) {
      await setAvatar(article, picture);
    }
  } catch (e) {
    console.error('onPictureDone', e);
  }
}

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-tab-pane {
  padding-bottom: 40px;
}

.el-tab-pane.pictures {
  //margin-bottom: 60px;
}

.take-photo-button {
  margin-top: $margin-right;

  :deep(.el-badge) {
    width: 100%;
  }
}

.tab-label + .el-badge {
  margin-left: $padding;
}

.cost-info {
  display: flex;
  justify-content: space-between;
}

</style>
