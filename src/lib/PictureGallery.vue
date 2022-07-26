<template lang="pug">

.picture-gallery(
  v-loading="busy"
  :element-loading-text="$t('loading')"
)
  el-carousel(
    ref="carousel"
    v-if="images.length"
    trigger="click"
    height="500px"
    :autoplay="false"
    indicator-position="outside"
    :type="carouselType"
    :initial-index="carouselItem"
    @change="onItemChange"
  )
    el-carousel-item(
      v-for="(image, idx) in images" :key="image.id"
      :name="image.id"
      :label="`${$t('concepts.image')} №${idx+1}`"
    )
      .gallery-image(@click.prevent="$emit('image-click', image)")

        img(:src="image.href")

  .empty(v-else @click.prevent="$emit('image-click')")
    el-avatar(
      icon="el-icon-picture-outline" :size="60"
      v-if="showEmpty"
    )

  .buttons(v-if="model && hasAuthoring")

    el-button.make-avatar(
      v-if="this.avatars && images.length > 1"
      @click="setAvatarClick"
      :disabled="isAvatar"
    ) {{ buttonText }}

    take-photo-button(
      @done="onUpload"
      @error="unUploadError"
      @imageuploading="busy = true"
      :entity-name="model.name"
    )
      slot(name="photoButton")

    confirm-button.remove(
      v-if="images.length"
      :disabled="!currentImage || images.length > 1 && isAvatar"
      :text="$t('delete')"
      :confirm-text="$t('reallyDelete')"
      @confirm="removeClick"
    )

</template>
<script>

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import TakePhotoButton from '@/lib/TakePhotoButton.vue';
import ConfirmButton from 'sistemium-vue/components/ConfirmButton.vue';

export default {

  name: 'PictureGallery',
  props: {
    // images: Array,
    avatars: Boolean,
    hasAuthoring: {
      type: Boolean,
      default: false,
    },
    newImageProperties: {
      type: Object,
      // required: true,
    },
    carouselType: {
      type: String,
      default: 'card',
    },
    showEmpty: {
      type: Boolean,
      default: true,
    },
    initialId: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      busy: false,
      newImage: null,
      carouselItem: 0,
    };
  },

  computed: {
    isAvatar() {
      return this.currentImage && this.currentImage.id === this.avatarId;
    },
    buttonText() {
      return this.isAvatar ? this.$t('thisIsAvatar') : this.$t('makeAvatar');
    },
    currentImage() {
      return this.images[this.carouselItem];
    },
  },

  components: {
    TakePhotoButton,
    ConfirmButton,
  },

  watch: {
    activeId(id) {
      this.$nextTick(() => this.setActiveItemById(id));
    },
  },

  methods: {

    setAvatarClick() {
      this.setAvatar(this.currentImage);
    },

    async removeClick() {
      await this.removeArticlePicture(this.currentImage);
    },

    src(image) {
      return image ? image.largeSrc : null;
    },

    onItemChange(carouselItem) {
      this.carouselItem = carouselItem;
    },

    unUploadError(err) {
      this.busy = false;
      const { message = JSON.stringify(err) } = err;
      this.$error('unUploadError', message);
      this.$message({
        message,
        type: 'warning',
        showClose: true,
      });
    },

    async removeArticlePicture() {
      // to be implemented in concrete class
    },

    async onUpload(picturesInfo, fileName) {

      const { model } = this;
      const { src } = find(picturesInfo, { name: 'original' });
      const { src: thumbnailSrc } = find(picturesInfo, { name: 'thumbnail' });

      // this.$debug('onUpload', src, fileName);

      try {
        const picture = await model.create({
          src,
          thumbnailSrc,
          picturesInfo,
          name: fileName,
          ...this.newImageProperties,
        });
        this.$emit('uploaded', picture, fileName);
      } catch (e) {
        this.$error('onUpload', e.message);
      }

      this.busy = false;

    },

    setActiveItemById(id) {
      const initial = findIndex(this.images, { id });
      if (initial > -1) {
        this.$refs.carousel.setActiveItem(initial);
      }
    },

  },

  created() {
    const id = this.initialId || this.avatarId;
    if (id) {
      this.$nextTick(() => this.setActiveItemById(id));
    }
  },

  i18n: {
    messages: {
      en: {
        thisIsAvatar: '✅ Profile image',
        makeAvatar: 'Set as profile image',
      },
      lt: {
        thisIsAvatar: '✅ Pagrindinė nuotrauka',
        makeAvatar: 'Nustatyti kaip pagrindinį',
      },
      ru: {
        thisIsAvatar: '✅ Основное фото',
        makeAvatar: 'Сделать основным',
      },
    },
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.picture-gallery {

  text-align: center;
  /*height: 100%;*/

  /*display: flex;*/
  flex-direction: column;
  align-items: center;

  .gallery-image {
    justify-content: center;
    display: flex;
    max-height: 100%;
    max-width: 100%;
  }

  .empty {

  }

  img {
    cursor: zoom-out;
    object-fit: contain;
  }

  .buttons {
    margin-top: $margin;
    display: flex;
    justify-content: space-around;
  }

  .take-photo-button {
  }

}

</style>
