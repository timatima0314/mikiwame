import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import last from 'lodash/last'
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { getCurrentUser } from '@/plugins/firebase'
import { getToken, getRole } from '@/utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 推薦者ページへのアクセスであるかを確認
  const isReferee = to.matched.some(({ meta }) => meta.isReferee)

  // determine whether the user has logged in
  getCurrentUser()
    .then(async user => {
      if (!user) throw Error('no current user')
      // 推薦者のログインであればログインのみ判定して許可
      if (isReferee) {
        next()
      } else {
        // 2要素認証のため、メールログインと電話番号ログインの両方に成功して初めて、tokenをcookieに書き込む。
        // したがって、getToken()がundefinedであれば、電話番号ログインが成功していない
        if (getToken() === undefined) throw Error('phone auth has not successed')
        const currentRole = getRole()
        // companyが登録されていない(匿名ユーザーでログイン中) or companyの取得に失敗したとき、ログイン画面にリダイレクト
        await store.dispatch('user/setUser', { user, role: currentRole })
        if (to.path === '/login') {
          // if is logged in, redirect to the home page
          next({ path: '/' })
          NProgress.done()
        } else {
          // /login以外にアクセスした場合
          const { acceptRoles } = last(to.matched).meta || {}
          const isRoleAccepted = acceptRoles === undefined || acceptRoles.includes(currentRole)
          if (!isRoleAccepted) throw Error('invalid role')
          next()
        }
      }
    })
    .catch(() => {
      // 未ログイン状態の場合はこのcatchが処理される
      const requireAuth = to.matched.some(({ meta }) => meta.requireAuth)
      if (requireAuth) {
        // 推薦者が認証前に認証後のページへ飛ぼうとした場合
        if (isReferee) next({ path: `/404` })
        // pages that do not have permission to access are redirected to the login page.
        else next(`/login?redirect=${to.path}`)
        NProgress.done()
      } else {
        // in the free login whitelist, go directly
        next()
      }
    })
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
