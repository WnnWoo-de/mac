import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@/assets/styles/main.scss'
import reveal from '@/directives/reveal'

const app = createApp(App)
app.directive('reveal', reveal)
app
  .use(router)
  .use(createPinia())
  .mount('#app')