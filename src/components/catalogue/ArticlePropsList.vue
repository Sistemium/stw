<template lang="pug">

.article-props-list.list-group
  .list-group-item(v-for="prop in articleProps")
    .name {{ prop.name }}
    el-tag.type(size="mini" v-t="`dataTypes.${prop.type}`" type="info")

</template>
<script>

export default {
  name: 'ArticlePropsList',
  props: {
    articleProps: {
      type: Array,
      required: true,
    },
  },
};

</script>
<style scoped lang="scss">

.list-group-item {
  display: flex;
  .name {
    flex: 1;
    text-align: left;
  }
}

</style>
