<template lang="pug">

  .inventory
    barcode-input(@scan="onScan" :lock="false")
    template
      //(v-if="notFound")
      //h2(v-t="")
      property-matcher(:title="$t('notFoundAdding')")

</template>
<script>

import BarcodeInput from '@/components/BarcodeScanner/BarcodeInput.vue';
import PropertyMatcher from '@/components/PropertyMatcher.vue';
import Article from '@/models/Article';

export default {
  name: 'Inventory',
  data() {
    return {
      notFound: null,
    };
  },
  components: {
    BarcodeInput,
    PropertyMatcher,
  },
  methods: {
    onScan(code) {
      this.notFound = false;
      Article.findAll({ barcodes: code })
        .then(res => {
          this.notFound = !res;
          if (!res) {
            this.$message({
              type: 'warning',
              message: this.$t('not_found'),
            });
          }
        })
        .catch(e => this.$error(e));
    },
  },
  i18n: {
    messages: {
      en: {
        not_found: 'Not found article',
        notFoundAdding: 'Add new article or link barcode to existing',
      },
      ru: {
        not_found: 'Номенклатура не найдена',
        notFoundAdding: 'Добавим новую номенклатуру или привяжем штрих-код к имеющейся',
      },
      lt: {
        not_found: 'Nomenklatūros nerasta',
        notFoundAdding: 'Pridėti naują nomenklatūrą arba pridėti brūkšninį kodą prie esamos',
      },
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.property-matcher {
  margin-top: $margin-top;
}

</style>
