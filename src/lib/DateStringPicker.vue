<template lang="pug">

el-date-picker.date-string-picker(
  type="datetime"
  v-model="date"
  :default-time="defaultTime"
)

</template>
<script>

import isDate from 'lodash/isDate';
import dayjs from 'sistemium-dates';

export default {
  name: 'DateStringPicker',
  props: {
    value: String,
  },
  computed: {
    defaultTime() {
      return dayjs(new Date())
        .format('HH:mm:ss');
    },
    date: {
      get() {
        const { value } = this;
        return value && isDate(value) ? value : new Date(value || null);
      },
      set(value) {
        this.$emit('input', value.toJSON());
      },
    },
  },
};

</script>
<style scoped lang="scss">

</style>
