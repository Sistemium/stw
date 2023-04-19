import ScrollTo from 'vue-scrollto';
import elementUi from './element-ui';
import sistemium from './sistemium';

// eslint-disable-next-line func-names
export default function (app) {
  elementUi(app);
  app.use(ScrollTo);
  sistemium(app);
}
