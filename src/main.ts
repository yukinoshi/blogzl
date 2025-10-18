import { createApp } from 'vue'
import App from './App.vue'
import '@yike-design/ui/es/index.less'
import router from './router/index';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// 引入全局方法
import { YkMessage, YkNotification } from '@yike-design/ui'
import Icon from '@yike-design/ui/es/components/svg-icon';
import './style.less'
const app = createApp(App)
app.config.globalProperties.$notification = YkNotification
app.config.globalProperties.$message = YkMessage
app.use(pinia)
app.use(router)
app.use(Icon)
app.mount('#app')