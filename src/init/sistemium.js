import Vue from 'vue';

import '@bit/sistemium.vue.mixins.debug';
import Resize from '@/lib/Resize.vue';
import '@bit/sistemium.vue.update-route-params';

import '@/lib/validations';
import ToolButton from '@/lib/ToolButton.vue';
import SimpleLabel from '@/lib/SimpleLabel.vue';
import SelectOnFocus from '@/lib/SelectOnFocus';

Vue.component(ToolButton.name, ToolButton);
Vue.component(SimpleLabel.name, SimpleLabel);
Vue.component(Resize.name, Resize);

Vue.directive('selectOnFocus', SelectOnFocus);
