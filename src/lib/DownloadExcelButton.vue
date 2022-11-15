<template lang="pug">

el-button.download-excel-button(
  @click="onClick"
  type="text"
)
  i.el-icon-download
  span .xlsx

</template>
<script>

import axios from 'axios';
import download from 'downloadjs';

const NAME = 'DownloadExcelButton';

export default {

  name: NAME,

  props: {
    dataFn: Function,
    name: {
      type: String,
      default: 'download',
    },
  },

  methods: {
    onClick() {

      const {
        data,
        schema,
      } = this.dataFn();

      axios.post('/xlsx', {
        schema,
        data,
      }, {
        responseType: 'blob',
      })
        .then(response => {
          const content = response.headers['content-type'];
          return download(response.data, `${this.name}.xlsx`, content);
        })
        .catch(e => {
          this.$notify.error(e.message);
        });

    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

</style>
