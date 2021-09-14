import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/ja'

import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import VueClipboard from 'vue-clipboard2' // クリップボードへのコピー

import '@/icons' // icon
import '@/permission' // permission control

import '@/plugins/firebase'
import VueMq from 'vue-mq' // PCかモバイルを判断

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

Sentry.init({
  Vue,
  dsn: process.env.ENV === 'production' ? process.env.VUE_APP_SENTRY_DSN : false,
  // release: process.env.VERSION ソースマップ表示に必要
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'app.mikiwame-p.jp', /^\//]
    })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// ユーザー設定時に使用
// const user = { id: 'xxx', email: 'yyyyy@zzzzz.com' }
// Sentry.configureScope((scope) => {
//   scope.setUser({ id: user.id, email: user.email })
// })

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// PCかモバイルを判断
const breakpoints = {
  sp: 800,
  pc: 2000
}

Vue.use(VueMq, { breakpoints })
Vue.use(VueClipboard)
Vue.use(VueTelInput)
