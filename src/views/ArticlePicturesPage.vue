<template lang="pug">

el-dialog.article-pictures-page(
  :fullscreen="true"
  :show-close="true"
  :visible.sync="visible"
  custom-class="el-dialog-gallery"
  @closed="handleClose()"
  :append-to-body="true"
  center
)
  article-picture-gallery(
    :article-id="articleId"
    :has-authoring="true"
    :avatars="true"
    :carousel-type="null"
    :new-image-properties="newImageProperties"
    @image-click="handleClose"
  )

</template>
<script>

import Picture from '@/models/Picture';
import ArticlePictureGallery from '@/components/catalogue/ArticlePictureGallery';

export default {

  name: 'ArticlePicturesPage',

  props: {
    from: Object,
    articleId: String,
  },

  data() {
    return {
      busy: false,
      image: undefined,
      visible: true,
      pictureModel: Picture,
    };
  },

  computed: {
    newImageProperties() {
      return {
        ownerXid: this.articleId,
        target: 'Article',
      };
    },
  },

  methods: {
    handleClose() {
      this.$router.push(this.from)
        .catch(e => this.$error('handleClose', e));
    },
  },

  components: { ArticlePictureGallery },
};

</script>
<style scoped lang="scss">

</style>
