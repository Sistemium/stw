import validations from '@/lib/validations';
import SimpleLabel from '@/lib/SimpleLabel.vue';
import SelectOnFocus from '@/lib/SelectOnFocus';

// eslint-disable-next-line func-names
export default function (app) {
  app.component('SimpleLabel', SimpleLabel);
  app.directive('selectOnFocus', SelectOnFocus);
  app.mixin(validations);
}
