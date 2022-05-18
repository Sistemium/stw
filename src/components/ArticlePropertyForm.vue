<template lang="pug">

  el-form.article-property-form(
    :model="model"
    ref="form"
    size="mini"
    :rules="rules"
    :status-icon="true"
  )

    el-form-item(:label="$t('fields.name')" prop="name")
      el-input(v-model="model.name")

    el-form-item(:label="$t('fields.valueType')" prop="valueType")
      el-select(v-model="model.valueType")
        el-option(:label="$t('string')" value="string")
        el-option(:label="$t('options')" value="options")
        el-option(:label="$t('boolean')" value="boolean")
        el-option(:label="$t('number')" value="number")

    el-form-item(:label="$t('fields.required')")
      el-switch(v-model="model.isRequired")

</template>
<script>

export default {
  name: 'ArticlePropertyForm',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    rules() {
      return {
        ...this.$requiredRule('name'),
        ...this.$requiredRule('valueType'),
      };
    },
  },
  i18n: {
    messages: {
      en: {
        string: 'String',
        options: 'Options',
        boolean: 'Checkbox',
        number: 'Number',
      },
      ru: {
        string: 'Строка',
        options: 'Выбор из списка',
        boolean: 'Есть/Нет',
        number: 'Число',
      },
      lt: {
        string: 'Eilutė',
        options: 'Pasirinkimas iš sąrašo',
        boolean: 'Taip/Ne',
        number: 'Skaičius',
      },
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

</style>
