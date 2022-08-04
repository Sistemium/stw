const SCROLL_DURATION = 500;
const WAIT_FOR_TIMEOUT = 200;

export default {
  data() {
    return {
      waitCount: 0,
      scrollSelector: '',
    };
  },
  mounted() {
    this.$watchImmediate('$route.query.createdId', id => {
      if (!id) {
        return;
      }
      this.waitCount = 0;
      this.waitUntilId(`#id-${id}`);
    });
  },
  methods: {
    scrollToId(id) {
      this.$scrollTo(id, SCROLL_DURATION, {
        container: this.scrollSelector,
        easing: 'ease',
        onDone(e) {
          if (e) {
            e.classList.add('blink');
          }
        },
      });
    },
    waitUntilId(id) {
      if (document.querySelector(id)) {
        this.scrollToId(id);
        return;
      }
      setTimeout(() => {
        this.waitCount += 1;
        if (this.waitCount > 100) {
          return;
        }
        this.$debug('skipping', this.count, id);
        this.waitUntilId(id);
      }, WAIT_FOR_TIMEOUT);
    },
  },
};
