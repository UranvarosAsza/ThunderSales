import './assets/main.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000, // az automatikus bezárási idő beállítása (példa: 3000 ms)
  position: 'bottom-center', // pozíció beállítása (példa: jobb felső sarok)
  transition: 'slide'
})
app.mount('#app')
