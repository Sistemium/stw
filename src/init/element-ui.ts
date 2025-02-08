import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import type { App } from 'vue'

export default function (app: App) {
  app.use(ElementPlus, {
    size: 'default',
  });
}
