const SCROLL_DURATION = 500;
const WAIT_FOR_TIMEOUT = 200;
const MAX_WAIT_FOR = 50;
const BLINK_CLASS = 'blink';
const REMOVE_BLINK_AFTER = 4000;

export default function scrollToCreated({ container }) {
  return {
    data() {
      return {
        waitCount: 0,
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
          container,
          easing: 'ease',
          offset: -30,
          onDone(e) {
            if (e) {
              const toBlink = e.closest('tr') || e;
              console.info(toBlink);
              toBlink.classList.add(BLINK_CLASS);
              setTimeout(() => {
                toBlink.classList.remove(BLINK_CLASS);
              }, REMOVE_BLINK_AFTER);
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
          if (this.waitCount > MAX_WAIT_FOR) {
            return;
          }
          // this.$debug('skipping', this.count, id);
          this.waitUntilId(id);
        }, WAIT_FOR_TIMEOUT);
      },
    },
  };
}
