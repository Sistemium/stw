import DrawerEdit from '@/lib/DrawerEdit.vue';

export default {
  props: {
    from: Object,
    isDrawer: { type: Boolean, default: true },
  },
  components: { DrawerEdit },
};
