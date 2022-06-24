<template lang="pug">

  .prop-tags
    .tags
      el-tag(
        v-for="tag in tags" :key="tag.id"
        :size="size"
        @click="$emit('click', tag)"
      ) {{ tag.name }}
      .empty(v-if="!tags.length" v-t="'emptyTags'")
    tool-button(
      tool="add"
      @click="onAdd"
    )

    article-property-edit(v-if="showDrawer" @closed="showDrawer = false")

</template>
<script>

import find from 'lodash/find';
import ArticleProp from '@/models/ArticleProp';
import ArticlePropertyEdit from '@/components/ArticlePropertyEdit.vue';

export default {
  name: 'PropTags',
  components: { ArticlePropertyEdit },
  props: {
    size: {
      type: String,
      default: 'mini',
    },
    exclude: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showDrawer: false,
    };
  },
  computed: {
    tags() {
      return ArticleProp.reactiveFilter(({ id }) => !find(this.exclude, ({ id })));
    },
  },
  methods: {
    onAdd() {
      this.showDrawer = true;
    },
  },
  i18n: {
    messages: {
      en: {
        emptyTags: 'Add property',
      },
      ru: {
        emptyTags: 'Добавить свойство',
      },
      lt: {
        emptyTags: 'Pridėti ypatybę',
      },
    },
  },
};

</script>
<style scoped lang="scss">

@import "../../styles/variables";

.el-button {
  color: $primary-color;
}

.prop-tags {
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: center;

  .tool-button {
    margin-left: $margin-right;
  }
}

.tags {
  //flex: 1;
  display: flex;
  flex-wrap: wrap;

  > .el-tag + .el-tag {
    margin-left: $padding;
  }
}

.el-tag {
  cursor: pointer;

  &:hover {
    color: white;
    background: $primary-hover-color;
  }
}

</style>
