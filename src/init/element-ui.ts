import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';


export default function (app) {
  app.use(ElementPlus, {
    size: 'default',
  });
}
