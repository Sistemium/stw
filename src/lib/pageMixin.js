import AlertEmpty from '@/lib/AlertEmpty.vue';
import PageTitle from '@/components/PageTitle.vue';

export default {
  props: {
    rootState: String,
    editRoute: String,
    createRoute: String,
    closeRoute: String,
    // progressRoute: String,
  },
  data() {
    return {
      busy: false,
    };
  },
  components: { AlertEmpty, PageTitle },
  methods: {
    setBusy(promise) {
      const { busy: wasBusy } = this;
      this.busy = true;
      return promise
        .finally(() => {
          this.busy = wasBusy || false;
        });
    },
    pushCreate(query) {
      this.$router.push({
        name: this.createRoute,
        query,
      })
        .catch(e => this.$error(e));
    },
  },
};
