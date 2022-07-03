<template lang="pug">

.prop-input-options

  el-select(
    allow-create
    filterable
    default-first-option
    v-model="option"
    :size="size"
    value-key="id"
  )
    el-option(v-for="{ id, name } in options" :label="name" :value="{id, name}" :key="id")

  el-button(
    v-if="isNew" icon="el-icon-plus" @click="onAdd" circle type="success"
  )

</template>

<script>
import PropInputBase from '@/components/props/PropInputBase';
import PropOption from '@/models/PropOption';

export default {
  name: 'PropInputOptions',
  mixins: [PropInputBase],
  computed: {
    propId() {
      return this.prop.id;
    },
    options() {
      const { propId = null } = this;
      return PropOption.reactiveFilter({ propId });
    },
    isNew() {
      return this.option && !this.option.id;
    },
  },
  data() {
    const { optionId } = this.value || {};
    return {
      option: optionId ? { id: optionId } : null,
    };
  },
  methods: {
    onAdd() {
      this.$saveWithLoading(async () => {
        const { option: name, propId } = this;
        this.option = await PropOption.create({ name, propId });
      });
    },
  },
  watch: {
    option(option) {
      Object.assign(this.result, {
        optionId: this.isNew ? null : option.id,
        stringValue: this.isNew ? option : option.name,
      });
      this.$emit('input', { ...this.result });
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
