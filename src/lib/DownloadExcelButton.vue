<template lang="pug">

el-link.download-excel-button(
  @click="onClick()"
)
  el-icon
    Download
  span .xlsx

</template>
<script setup lang="ts">

import axios from 'axios';
import download from 'downloadjs';
import { ElNotification } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

interface XLSRequest {
  data: object[];
  schema: object;
}

const props = withDefaults(defineProps<{
  dataFn: () => XLSRequest;
  name: string;
}>(), { name: 'download' });

function onClick() {

  const {
    data,
    schema,
  } = props.dataFn();

  axios.post('/xlsx', {
    schema,
    data,
  }, {
    responseType: 'blob',
  })
    .then(response => {
      const content = response.headers['content-type'];
      return download(response.data, `${props.name}.xlsx`, content);
    })
    .catch(e => {
      ElNotification({ type: 'error', message: e.message });
    });
}

</script>
