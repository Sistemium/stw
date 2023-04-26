<template lang="pug">

.picture-gallery(
  v-loading="busy"
  :element-loading-text="$t('loading')"
)
  el-carousel(
    ref="carouselRef"
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
      .gallery-image(
        @click.prevent="emit('imageClick', image)"
      )
        img(:src="image.href")

  .empty(
    v-else
    @click.prevent="emit('imageClick', null)"
  )
    el-avatar(
      v-if="showEmpty"
      :icon="PictureFilled"
      :size="60"
    )

  .buttons(v-if="model && hasAuthoring")

    el-button.make-avatar(
      v-if="avatars && images.length > 1"
      @click="emit('setAvatarClick', currentImage)"
      :disabled="isAvatar"
    ) {{ buttonText }}

    take-photo-button(
      @uploaded="onUpload"
      @error="unUploadError"
      @uploading="busy = true"
      :entity-name="model.collection"
    )
      slot(name="photoButton")

    confirm-button.remove(
      v-if="images.length"
      :disabled="!currentImage || images.length > 1 && isAvatar"
      :text="$t('delete')"
      :confirm-text="$t('reallyDelete')"
      @confirm="emit('removeClick', currentImage)"
      size="default"
    )

</template>
<script setup lang="ts">

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import TakePhotoButton from '@/lib/TakePhotoButton.vue';
import ConfirmButton from 'sistemium-vue/components/ConfirmButton.vue';
import type ApiModel from '@/models/ApiModels';
import ReactiveModel from 'sistemium-data-vue';
import { ElMessage, ElNotification } from 'element-plus';
import { PictureFilled } from '@element-plus/icons-vue';

const emit = defineEmits<{
  (e: 'removeClick', image: ApiModel): void;
  (e: 'imageClick', image: ApiModel): void;
  (e: 'uploaded', image: ApiModel, fileName: string): void;
  (e: 'setAvatarClick', image: ApiModel): void;
}>();

const props = withDefaults(defineProps<{
  avatars: boolean;
  hasAuthoring?: boolean;
  newImageProperties: object;
  carouselType?: string;
  showEmpty?: boolean;
  initialId?: string;
  images: ApiModel[];
  avatarId?: string;
  activeId?: string;
  model: ReactiveModel;
}>(), {
  hasAuthoring: false,
  carouselType: 'card',
  showEmpty: true,
  initialId: null,
});

const carouselRef = ref(null);
const busy = ref(false);
const carouselItem = ref(0);
const currentImage = computed(() => props.images[carouselItem.value]);

const isAvatar = computed(() => {
  const { value } = currentImage;
  return value && value.id === props.avatarId;
});

const buttonText = computed(() => isAvatar.value ? t('thisIsAvatar') : t('makeAvatar'));

watch(() => props.activeId, id => {
  nextTick(() => setActiveItemById(id));
});

const id = props.initialId || props.avatarId;

if (id) {
  nextTick(() => setActiveItemById(id));
}

const { t } = useI18n({
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
});

function onItemChange(item) {
  carouselItem.value = item;
}

async function unUploadError(err) {
  busy.value = false;
  const { message = JSON.stringify(err) } = err;
  console.error('unUploadError', message);
  ElMessage.warning({
    message,
    showClose: true,
  });
}

async function onUpload(picturesInfo, fileName) {

  const { model } = props;
  const { src: href } = find(picturesInfo, { name: 'original' });
  const { src: thumbnailHref } = find(picturesInfo, { name: 'thumbnail' });

  try {
    const picture : ApiModel = await model.create({
      href,
      thumbnailHref,
      picturesInfo,
      name: fileName,
      ...props.newImageProperties,
    });
    emit('uploaded', picture, fileName);
  } catch (e) {
    ElNotification({
      message: e.message,
      type: 'error',
    });
  }

  busy.value = false;

}

function setActiveItemById(id) {
  const initial = findIndex(props.images, { id });
  if (initial > -1) {
    carouselRef.value?.setActiveItem(initial);
  }
}

</script>
<style scoped lang="scss">

@import "../styles/variables";

.picture-gallery {

  text-align: center;
  flex-direction: column;
  align-items: center;

  .gallery-image {
    justify-content: center;
    display: flex;
    max-height: 100%;
    max-width: 100%;
  }

  img {
    cursor: zoom-out;
    object-fit: contain;
  }

  .buttons {
    margin-top: $margin-top;
    display: flex;
    justify-content: space-around;
    @include responsive-only(xxs) {
      :deep(button) {
        padding: 6px;
        white-space: normal;

        span {
          white-space: normal;
        }
      }
    }
  }

}

</style>
