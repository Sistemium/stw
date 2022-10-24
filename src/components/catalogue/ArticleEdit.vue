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
  template(v-slot="{ model }")
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
<script>

import vss from 'vue-screen-size';
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

export default {
  name: 'ArticleEdit',
  mixins: [vss.VueScreenSizeMixin],
  props: {
    articleId: String,
    from: Object,
    drawerStyle: Object,
  },
  data() {
    return {
      currentTab: null,
    };
  },
  components: {
    RecipeForm,
    ArticleMeasurementForm,
    ArticlePictures,
    TakePhotoButton,
    ArticleForm,
    DrawerEdit,
  },
  computed: {
    drawerWidth() {
      return this.$vssWidth > 450 ? '450px' : '370px';
    },
    modelOrigin() {
      const { articleId } = this;
      return articleId ? Article.reactiveGet(articleId) : articleInstance();
    },
    pictures() {
      return Picture.reactiveFilter({ ownerXid: this.articleId })
        .map(mapPictureInfo('smallImage'));
    },
  },
  methods: {
    destroyFn() {
      const { articleId } = this;
      return articleId && Article.destroy(articleId);
    },
    saveFn(props) {
      return Article.createOne(props);
    },
    async onPictureDone(picturesInfo, fileName) {
      this.$debug(picturesInfo, fileName);
      const { src } = find(picturesInfo, { name: 'largeImage' });
      const { src: thumbnailSrc } = find(picturesInfo, { name: 'thumbnail' });
      const picture = {
        href: src,
        thumbnailHref: thumbnailSrc,
        picturesInfo,
        name: fileName,
        target: 'Article',
        ownerXid: this.articleId,
      };
      try {
        const { id: avatarPictureId } = await Picture.createOne(picture);
        if (this.pictures.length === 1) {
          await Article.createOne({
            ...this.modelOrigin,
            avatarPictureId,
          });
        }
      } catch (e) {
        this.$error('onPictureDone', e);
      }
    },
  },
};

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

  ::v-deep .el-badge {
    width: 100%;
  }
}

</style>
