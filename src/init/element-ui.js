import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';

// eslint-disable-next-line func-names
export default function (app) {
  app.use(ElementPlus, { size: 'small' });
}
