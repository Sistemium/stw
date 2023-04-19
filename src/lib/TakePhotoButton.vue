<template lang="pug">

.take-photo-button
  vue-dropzone(
    ref="dz"
    id="take-photo-button-drop-zone"
    :options="dzOptions"
    :destroy-dropzone="true"
    :use-custom-slot="true"
    :include-styling="false"
    @vdropzone-success="onDropzoneSuccess"
    @vdropzone-total-upload-progress="uploadProgress"
    @vdropzone-error="onError"
  )
    slot
      el-badge.countdown(:value="countdown" :hidden="!isUploading")
        el-button.trigger(
          plain type="primary"
          :disabled="isUploading"
          :size="size"
        ) {{ currentButtonText }}

</template>
<script>

import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import FileHandling from '@/lib/FileHandling';

export default {

  name: 'TakePhotoButton',

  props: {
    buttonText: {
      type: String,
    },
    size: {
      type: String,
    },
    trim: {
      type: Boolean,
      default: false,
    },
  },

  mixins: [FileHandling],

  computed: {
    currentButtonText() {
      return this.isUploading ? 'Загрузка ...' : this.$tAction('add', 'picture');
    },
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.trigger {
  border: solid 1px $gray-border-color;
  border-radius: 4px;
  box-shadow: none;
  width: 100%;
}

.take-photo-button :deep(.dz-preview) {
  display: none;
}

</style>
