import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const SCROLL_DURATION = 500;
const WAIT_FOR_TIMEOUT = 200;
const MAX_WAIT_FOR = 50;
const BLINK_CLASS = 'blink';
const REMOVE_BLINK_AFTER = 4000;

interface ScrollConfig {
  // container: string;
  blink?: boolean;
  watchFor?: string | (() => string);
  watchToRepeat?: () => string | boolean;
}

export function useScrollToCreated(config: ScrollConfig) {

  const route = useRoute();

  const {
    // container,
    blink = true,
    watchFor = () => route.query.createdId,
    watchToRepeat = null,
  } = config;
  const waitCount = ref(0);

  const watchForFn = typeof watchFor === 'string' ? (() => route.params[watchFor]) : watchFor;

  onMounted(() => {
    watch(watchForFn, id => {
      if (!id) {
        return;
      }
      waitCount.value = 0;
      waitUntilId(`id-${id}`);
    }, { immediate: true });
    if (watchToRepeat) {
      watch(watchToRepeat, () => {
        const id = watchForFn();
        // console.info('watchToRepeat', id);
        if (id) {
          waitUntilId(`id-${id}`);
        }
      });
    }
  })


  function waitUntilId(id) {
    if (window.document.getElementById(id)) {
      // console.info('waitUntilId', id, true);
      scrollToId(id, SCROLL_DURATION, blink);
      return;
    }
    setTimeout(() => {
      waitCount.value += 1;
      if (waitCount.value > MAX_WAIT_FOR) {
        return;
      }
      // console.info('waitUntilId', id, waitCount.value);
      waitUntilId(id);
    }, WAIT_FOR_TIMEOUT);
  }
}



function scrollToId(id, duration = 500, blink = false) {
  const el = window.document.getElementById(id);
  if (!el) {
    // console.info('scrollToId', id, 'none');
    return;
  }
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth' });
  }, 10);
  if (!blink) {
    return;
  }
  setTimeout(() => {
    const toBlink = el.closest('tr') || el;
    toBlink.classList.add(BLINK_CLASS);
    setTimeout(() => {
      toBlink.classList.remove(BLINK_CLASS);
    }, REMOVE_BLINK_AFTER);
  }, duration);
}
