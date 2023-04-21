import Resize from '@/lib/Resize.vue';

import validations from '@/lib/validations';
import ToolButton from '@/lib/ToolButton.vue';
import SimpleLabel from '@/lib/SimpleLabel.vue';
import SelectOnFocus from '@/lib/SelectOnFocus';
import debug from '@/lib/debug';

// eslint-disable-next-line func-names
export default function (app) {
  app.component(ToolButton.name, ToolButton);
  app.component(SimpleLabel.name, SimpleLabel);
  app.component(Resize.name, Resize);
  app.directive('selectOnFocus', SelectOnFocus);
  app.mixin(validations);
  app.mixin(debug);
}
