<template lang="pug">

el-dropdown.menu-button(
  @command="onCommand"
  :trigger="trigger"
)
  el-link(
    :type="type"
    :disabled="disabled"
  ) {{ $t(label) }}
  template(#dropdown)
    el-dropdown-menu
      el-dropdown-item(
        v-for="option in options"
        :key="option.to"
        :command="option.to"
      ) {{ $t(option.label) }}
    slot(name="items")

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

withDefaults(defineProps<{
  label: string;
  trigger?: string;
  type?: 'primary' | 'default';
  disabled?: boolean;
  options: { label: string; to: string | object; }[];
}>(), {
  trigger: 'click',
  type: 'primary',
});

defineSlots<{
  items(): any
}>()

const router = useRouter();

function onCommand(command: RouteLocationRaw) {
  router.push(command);
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
