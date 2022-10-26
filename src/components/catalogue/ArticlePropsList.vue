<template lang="pug">

.article-props-list.list-group
  .list-group-item(v-for="prop in articleProps" @click="$emit('click', prop)" :key="prop.id")
    .title
      .ord(v-if="prop.ord") {{ prop.ord }}:
      .name
        em(v-if="prop.prefix") {{ prop.prefix }}
        span {{ prop.name }}
        em(v-if="prop.suffix" ) {{ prop.suffix }}
        i.el-icon-star-on(v-if="prop.isRequired")
        i.el-icon-view(v-if="prop.isNaming")
        //i.el-icon-key(v-if="prop.isUnique")
    el-tag.type(v-t="`dataTypes.${prop.type}`" type="info")

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

  .title {
    display: flex;
    flex: 1;
    text-align: left;
  }

  .ord {
    margin-right: $padding;
  }

  .name {
    * + * {
      margin-left: 2px;
    }

    i {
      color: $orange;
      font-size: 10px;
      position: relative;
      top: -$padding;
    }
  }
}

em {
  font-style: normal;
  color: $gray;
}

</style>
