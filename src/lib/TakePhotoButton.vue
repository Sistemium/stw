<template lang="pug">

.take-photo-button
  .el-button(
    id="take-photo-button-drop-zone"
    v-bind="getRootProps()"
  )
    input(v-bind="getInputProps()")
    //el-badge.countdown(:value="countdown" :hidden="!isUploading")
    //  el-button.trigger(
    //    plain type="primary"
    //    :disabled="isUploading"
    //    :size="size"
    span {{ currentButtonText }}

</template>
<script setup lang="ts">

import { useDropzone } from 'vue3-dropzone';
import { addMonths } from 'sistemium-dates';
import { tAction, t } from '@/lib/validations.js'
import { computed, ref } from 'vue';
import axios from 'axios';
import filter from 'lodash/filter';
import { useStore } from 'vuex'
import type { PictureInfo, IMSResponse } from '@/models/Pictures';
import { eachSeries } from 'async';

const store = useStore();

const props = withDefaults(defineProps<{
  // buttonText?: string;
  size?: string;
  trim?: boolean;
  entityName: string;
}>(), { trim: false, size: 'default' });

const emit = defineEmits<{
  (e: 'uploading'): void;
  (e: 'uploaded', picturesInfo: PictureInfo[], fileName: string): void;
}>();

const { getRootProps, getInputProps } = useDropzone({ onDrop });
const isLoading = ref(false);
const currentButtonText = computed(() => isLoading.value ? t('loading') : tAction('add', 'picture'));

function onDrop(acceptFiles) {
  saveFiles(acceptFiles);
}

function imsUrl() {
  const { org = '' } = store.state.auth?.account;
  const url = [
    `/ims/${org}?folder=${props.entityName}/${addMonths(new Date(), 0)}`,
    props.trim && 'trim=true',
  ];
  return filter(url)
    .join('&');
}

async function saveFiles(files) {
  await eachSeries(files, async file => {
    await saveFile(file);
  });
}

async function saveFile(file) {
  const formData = new FormData();

  formData.append('files[]', file);

  const response = await axios.post(imsUrl(), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      authorization: store.getters['auth/ACCESS_TOKEN'],
    },
  });

  const { data } = response as { data: IMSResponse };

  emit('uploaded', data.pictures, file.name);

}

</script>
<style scoped lang="scss">

@import "../styles/variables";

</style>
