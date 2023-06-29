import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PortalVue from 'portal-vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap-icons/font/bootstrap-icons.min.css"
const app = createApp(App)

app.use(router)
app.use(PortalVue)

app.mount('#app')
