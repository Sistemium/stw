<template lang="pug">

.prop-input-options

  el-select(
    allow-create
    filterable
    default-first-option
    v-model="value"
    :size="size"
    value-key="id"
  )
    el-option(v-for="{ id, name } in options" :label="name" :value="{id}")

  el-button(
    v-if="isNew" size="mini" icon="el-icon-plus" @click="onAdd" circle type="success"
  )

</template>

<script>
import PropInput from '@/components/props/PropInputBase';
import PropOption from '@/models/PropOption';

export default {
  name: 'PropInputOptions',
  mixins: [PropInput],
  computed: {
    propId() {
      return this.prop.id;
    },
    options() {
      const { propId = null } = this;
      return PropOption.reactiveFilter({ propId });
    },
    isNew() {
      return this.value && !this.value.id;
    },
  },
  methods: {
    onAdd() {
      this.$saveWithLoading(async () => {
        const { value: name, propId } = this;
        this.value = await PropOption.create({ name, propId });
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../styles/variables";

.prop-input-options {
  display: flex;
  align-items: center;
}

.el-button {
  margin-left: $margin-right;
}

</style>
