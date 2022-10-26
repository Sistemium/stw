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
    @click="onAdd()"
  )

  article-property-edit(v-if="showDrawer" @closed="showDrawer = false")

</template>
<script>

import ArticlePropertyEdit from '@/components/ArticlePropertyEdit.vue';

export default {
  name: 'PropTags',
  components: { ArticlePropertyEdit },
  props: {
    size: {
      type: String,
      // default: 'mini',
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showDrawer: false,
    };
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
  align-items: flex-start;
  margin: 0 auto;
  justify-content: center;

  .tool-button {
    margin-left: $margin-right;
  }
}

::-webkit-scrollbar {
  height: 12px;
}

::-webkit-scrollbar-track {
  border-radius: $border-radius;
}

::-webkit-scrollbar-thumb {
  border-radius: $border-radius;
  background: darken($gray-background, 5%);
}

.tags {
  padding-bottom: $padding;
  white-space: nowrap;
  overflow-x: scroll;
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
