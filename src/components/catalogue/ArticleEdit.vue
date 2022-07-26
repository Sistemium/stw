<template lang="pug">

drawer-edit.article-edit(
  :title="$tGen('editing', 'article')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :drawer-style="drawerStyle"
)
  template(v-slot="{ model }")
    el-tabs
      el-tab-pane(:label="$t('menu.articleProps')")
        article-form(ref="form" :model="model")
      el-tab-pane(:label="$t('menu.barcodes')")
        .list-group
          .list-group-item(
            v-if="!model.barcodes || !model.barcodes.length"
          ) {{ $t('validation.noData') }}
          .list-group-item(v-for="barcode in model.barcodes" :key="barcode")
            .code {{ barcode }}
      el-tab-pane.pictures(:label="$t('menu.pictures')" v-if="articleId" :lazy="true")
        resize(:padding="110")
          article-pictures(:article-id="articleId")
        take-photo-button(@done="onPictureDone" entity-name="Picture")

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import Article from '@/models/Article';
import ArticleForm from '@/components/catalogue/ArticleForm.vue';
import { articleInstance } from '@/services/catalogue';
import TakePhotoButton from '@/lib/TakePhotoButton.vue';
import Picture from '@/models/Picture';
import find from 'lodash/find';
import ArticlePictures from '@/components/catalogue/ArticlePictures.vue';

export default {
  name: 'ArticleEdit',
  props: {
    articleId: String,
    from: Object,
    drawerStyle: Object,
  },
  components: {
    ArticlePictures,
    TakePhotoButton,
    ArticleForm,
    DrawerEdit,
  },
  computed: {
    modelOrigin() {
      const { articleId } = this;
      return articleId ? Article.reactiveGet(articleId) : articleInstance();
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
      await Picture.createOne(picture)
        .catch(e => this.$error('onPictureDone:', e));
    },
  },
  i18n: {
    messages: {
      en: {},
      ru: {},
      lt: {},
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
