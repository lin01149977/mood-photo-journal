import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import { registerBaseComponents } from './components'

import './styles/index.less'

const app = createApp(App)
const backgroundIndex = Math.floor(Math.random() * 3) + 1

document.documentElement.dataset.journalBackground = String(backgroundIndex)

app.use(createPinia())
app.use(router)
registerBaseComponents(app)

app.mount('#app')
