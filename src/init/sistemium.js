import Vue from 'vue';

import '@bit/sistemium.vue.mixins.debug';
import '@bit/sistemium.vue.resize/Resize';
import '@bit/sistemium.vue.update-route-params';

import '@/lib/validations';
import ToolButton from '@/lib/ToolButton.vue';

Vue.component(ToolButton.name, ToolButton);
