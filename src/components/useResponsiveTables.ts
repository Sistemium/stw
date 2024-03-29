import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue';

export interface ResponsiveTableConfig {
  widthBreak?: number;
  sizeBreak?: number;
}

type ElSize = 'small' | 'default';

export default function (config: ResponsiveTableConfig = {}) {
  const {
    widthBreak = 600,
    sizeBreak = 800,
  } = config;
  const { width } = useWindowSize();
  const tableSize = computed<ElSize>(() => {
    return width.value < sizeBreak ? 'small' : 'default';
  });
  const showTable = computed(() => width.value >= widthBreak);
  return { tableSize, showTable, windowWidth: width };
}
