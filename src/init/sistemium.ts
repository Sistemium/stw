import validations from '@/lib/validations';
import SimpleLabel from '@/lib/SimpleLabel.vue';
import SelectOnFocus from '@/lib/SelectOnFocus';
import type { App } from 'vue'

export default function (app: App) {
  app.component('SimpleLabel', SimpleLabel);
  app.directive('selectOnFocus', SelectOnFocus);
  app.mixin(validations);
}
