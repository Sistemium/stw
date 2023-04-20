import { createNamespacedHelpers } from 'vuex';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'BarcodeScanner',
  props: {
    emitOnCreate: Boolean,
  },
  computed: {
    ...mapGetters({
      scannedBarCode: g.SCANNED_BARCODE,
    }),
  },
  methods: {
    ...mapMutations({
      clearBarcode: m.SET_SCANNED_BARCODE,
    }),
  },
  watch: {
    scannedBarCode(barCode) {
      this.$emit('input', barCode);
      if (barCode) {
        this.$emit('scan', barCode);
      } else {
        this.$emit('clear');
      }
    },
  },
  created() {
    if (this.scannedBarCode) {
      this.$emit('input', this.scannedBarCode);
    }
  },
};
