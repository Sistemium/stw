<template lang="pug">

el-dialog.article-pictures-page(
  v-model="visible"
  :append-to-body="true"
  center
  class="el-dialog-gallery"
  :fullscreen="true"
  :show-close="true"
  @closed="handleClose()"
)
  article-picture-gallery(
    :article-id="articleId"
    :avatars="true"
    :carousel-type="null"
    :has-authoring="authoring"
    @image-click="handleClose"
  )

</template>
<script setup lang="ts">

import ArticlePictureGallery from '@/components/catalogue/ArticlePictureGallery.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  from?: Record<string, any>
  articleId: string
  authoring?: boolean
}>();

const router = useRouter();
const visible = ref(true);

const emit = defineEmits<{
  ( e: 'closed'): void
}>()

function handleClose() {
  if (!props.from) {
    visible.value = false
    emit('closed')
    return
  }
  router.push(props.from)
    .catch(e => console.error('handleClose', e));
}

</script>
