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
  components: { AlertEmpty, PageTitle },
  methods: {
    onAdd() {
      this.$router.push({
        name: this.createRoute,
        params: {
          from: this.$route,
        },
      });
    },
  },
};
