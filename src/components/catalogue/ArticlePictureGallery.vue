<template lang="pug">
picture-gallery(
  v-bind="$attrs"
  :active-id="activeId"
  :avatar-id="article.avatarPictureId"
  :images="images"
  :new-image-properties="{ ownerXid: articleId, target: 'Article' }"
  :model="Picture"
  @set-avatar-click="setAvatar"
  @remove-click="image => removeArticlePicture(article, image)"
  @uploaded="onUploaded"
)
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Article from '@/models/Article';
import Picture from '@/models/Picture';
import PictureGallery from '@/lib/PictureGallery.vue';
import type ApiModel from '@/models/ApiModels';
import { setAvatar, removeArticlePicture } from '@/components/catalogue/ArticlePicturing';

const props = defineProps<{
  articleId: string;
}>();

const route = useRoute();
const article = computed(() => Article.reactiveGet(props.articleId) || {})
const activeId = computed(() => route.query.activeId as string);
const images = computed(() => Picture.reactiveFilter({ ownerXid: props.articleId }) as ApiModel[]);

async function onUploaded(picture: { id: string }) {
  if (images.value.length === 1) {
    await setAvatar(article.value, picture);
  }
}

</script>
