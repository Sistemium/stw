import elementUi from './element-ui'
import sistemium from './sistemium'
import type { App } from 'vue'

export default function(app: App) {
  elementUi(app)
  sistemium(app)
}
