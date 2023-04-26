<template lang="pug">
picture-gallery(
  v-bind="$attrs"
  :active-id="activeId"
  :avatar-id="article.avatarPictureId"
  :images="images"
  :new-image-properties="{ ownerXid: articleId, target: 'Article' }"
  :model="Picture"
  @set-avatar-click="setAvatar"
  @remove-click="removeArticlePicture"
  @uploaded="onUploaded"
)
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Article from '@/models/Article.js';
import Picture from '@/models/Picture.js';
import PictureGallery from '@/lib/PictureGallery.vue';
import type ApiModel from '@/models/ApiModels';
import { saveWithLoading } from '@/lib/validations';

const props = defineProps<{
  articleId: string;
}>();

const route = useRoute();
const article = computed(() => Article.reactiveGet(props.articleId) || {})
const activeId = computed(() => route.query.activeId as string);
const images = computed(() => Picture.reactiveFilter({ ownerXid: props.articleId }) as ApiModel[]);

async function onUploaded (picture) {
  if (images.value.length === 1) {
    await setAvatar(picture);
  }
}

async function setAvatar(picture) {
  await saveWithLoading(() => Article.createOne({
    ...article.value,
    avatarPictureId: picture ? picture.id : null,
  }));
}

async function removeArticlePicture(picture) {
  await saveWithLoading(async () => {
    await Picture.destroy(picture.id);
    if (article.value.avatarPictureId === picture.id) {
      await setAvatar(null);
    }
  });
}

</script>
