import vss from 'vue-screen-size';

export default {
  mixins: [vss.VueScreenSizeMixin],
  computed: {
    tableSize() {
      return this.$vssWidth < 800 ? 'small' : 'default';
    },
    showTable() {
      return this.$vssWidth >= 600;
    },

  },
};
