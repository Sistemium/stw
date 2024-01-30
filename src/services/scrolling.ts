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
  scrollToIdFn?: (id: string) => boolean;
  ifIdExistsFn?: (id: string, duration?: number) => boolean;
}

export function useScrollToCreated(config: ScrollConfig) {

  const route = useRoute();

  const {
    // container,
    blink = true,
    watchFor,
    watchToRepeat = null,
    scrollToIdFn = scrollToIdDefault,
    ifIdExistsFn = (id: string) => !!window.document.getElementById(`id-${id}`),
  } = config;
  const waitCount = ref(0);

  const watchForFn = typeof watchFor === 'string'
    ? (() => route.params[watchFor] as string)
    : (watchFor || (() => route.query.createdId as string));

  onMounted(() => {
    watch(watchForFn, id => {
      if (!id) {
        return;
      }
      waitCount.value = 0;
      waitUntilId(id);
    }, { immediate: true });
    if (watchToRepeat) {
      watch(watchToRepeat, () => {
        const id = watchForFn();
        // console.info('watchToRepeat', id);
        if (id) {
          waitUntilId(id);
        }
      });
    }
  })


  function waitUntilId(id: string) {
    if (ifIdExistsFn(id)) {
      // console.info('waitUntilId', id, true);
      waitCount.value = 0;
      setTimeout(() => {
        scrollToId(id, SCROLL_DURATION, blink);
      }, 0);
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


  function scrollToId(id: string, duration = 500, blink = false) {
    if (!scrollToIdFn(id, duration) || !blink) {
      return;
    }
    setTimeout(() => {
      const el = window.document.getElementById(id);
      if (!el) {
        return;
      }
      const toBlink = el.closest('tr') || el;
      toBlink.classList.add(BLINK_CLASS);
      setTimeout(() => {
        toBlink.classList.remove(BLINK_CLASS);
      }, REMOVE_BLINK_AFTER);
    }, duration);
  }

  function scrollToIdDefault(rawId: string, duration: number): boolean {
    const id = `id-${rawId}`;
    const el = window.document.getElementById(id);
    if (!el) {
      // console.info('scrollToId', id, 'none');
      return false;
    }
    setTimeout(() => {
      const scrollEl = el.closest('tr') || el;
      // console.info('scrollToId', id, scrollEl.offsetParent, waitCount.value);
      if (!scrollEl.offsetParent && waitCount.value <= MAX_WAIT_FOR) {
        waitCount.value += 1;
        setTimeout(() => scrollToId(id, duration, blink), 10);
        return;
      }
      scrollEl.scrollIntoView({ behavior: 'smooth' });
    }, 10);
    return true;
  }

}
