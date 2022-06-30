<template lang="pug">

.article-props-list.list-group
  .list-group-item(v-for="prop in articleProps" @click="$emit('click', prop)" :key="prop.id")
    .name
      em(v-if="prop.prefix") {{ prop.prefix }}
      span {{ prop.name }}
      em(v-if="prop.suffix" ) {{ prop.suffix }}
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
@import "../../styles/variables";

.list-group-item {
  display: flex;

  .name {
    flex: 1;
    text-align: left;

    * + * {
      margin-left: 2px;
    }
  }
}

em {
  font-style: normal;
  color: $gray;
}

</style>
