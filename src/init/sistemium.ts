import validations from '@/lib/validations';
import SimpleLabel from '@/lib/SimpleLabel.vue';
import SelectOnFocus from '@/lib/SelectOnFocus';

export default function (app) {
  app.component('SimpleLabel', SimpleLabel);
  app.directive('selectOnFocus', SelectOnFocus);
  app.mixin(validations);
}
