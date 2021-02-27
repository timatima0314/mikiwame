import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login/admin',
    component: () => import('@/views/login/index'),
    name: 'adminLogin',
    hidden: true
  },
  {
    path: '/login/reset_password',
    component: () => import('@/views/login/reset_password'),
    name: 'resetPassword',
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'clientLogin',
    hidden: true
  },
  {
    path: '/signup',
    component: () => import('@/views/signup/index'),
    name: 'signup',
    hidden: true
  },
  {
    path: '/signup/phone',
    component: () => import('@/views/signup/phone'),
    name: 'signupPhone',
    hidden: true
  },
  {
    path: '/signup/sub_account',
    name: 'signupSubAccount',
    component: () => import('@/views/signup/subAccount'),
    hidden: true
  },
  {
    path: '/signup/sub_account/phone',
    name: 'signupSubAccountPhone',
    component: () => import('@/views/signup/phone'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: () => import('@/views'),
    hidden: true
  },

  {
    path: '/company',
    component: Layout,
    meta: { title: 'ダッシュボード', icon: 'dashboard', requireAuth: true, acceptRoles: ['client'] },
    children: [
      {
        path: '/company',
        name: 'companyIndex',
        component: () => import('@/views/company/index'),
        hidden: true,
        meta: { activeMenu: '/company', acceptRoles: ['client'] }
      },
      {
        path: '/company/talents/:talentId/report',
        name: 'report',
        component: () => import('@/views/company/report'),
        hidden: true,
        meta: { activeMenu: '/company', title: 'レポート', requireAuth: true, acceptRoles: ['client'] }
      },
      {
        path: '/company/plan/',
        name: 'plan',
        component: () => import('@/views/company/plan'),
        hidden: true,
        meta: { activeMenu: '/company', title: 'プラン', requireAuth: true, acceptRoles: ['client'] }
      },
      {
        path: '/company/accounts/',
        name: 'companyAccountsIndex',
        component: () => import('@/views/company/accounts'),
        hidden: true,
        meta: { activeMenu: '/company/accounts', title: '企業担当者一覧', icon: 'el-icon-user', requireAuth: true, acceptRoles: ['client'] }
      }
    ]
  },

  {
    path: '/template_questions',
    component: Layout,
    meta: { title: '質問テンプレート', icon: 'el-icon-chat-line-square', requireAuth: true, acceptRoles: ['client'] },
    children: [
      {
        path: '/template_questions',
        name: 'templateQustionsIndex',
        component: () => import('@/views/template_questions/index'),
        hidden: true,
        meta: { activeMenu: '/template_questions', acceptRoles: ['client'] }
      }
    ]
  },

  {
    path: '/admin',
    component: Layout,
    meta: { title: '管理者ページ', icon: 'dashboard', requireAuth: true, acceptRoles: ['admin'] },
    children: [
      {
        path: '',
        component: () => import('@/views/admin'),
        name: 'adminIndex',
        meta: { title: 'クライアント一覧', requireAuth: true, acceptRoles: ['admin'] }
      },
      {
        path: 'payment',
        name: 'adminPayment',
        component: () => import('@/views/admin/payment'),
        meta: { title: '請求', icon: 'el-icon-money', requireAuth: true, acceptRoles: ['admin'] }
      }
    ]
  },

  {
    path: '/config',
    component: Layout,
    meta: { title: '設定', icon: 'el-icon-setting', requireAuth: true },
    children: [
      {
        path: '/config',
        name: 'config',
        component: () => import('@/views/config'),
        hidden: true
      },
      {
        path: '/config/card', // breadcrumbで「設定/カード設定」と表示させるために絶対パス指定
        name: 'configCard',
        component: () => import('@/views/config/card'),
        hidden: true,
        meta: { activeMenu: '/config', title: 'カード設定' }
      }
    ]
  },

  {
    path: 'mailto:contact@mikiwame-p.jp?subject=%E3%80%90MiKiWaMePoint%E3%80%91%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B',
    meta: { title: 'カスタマーサポート', icon: 'el-icon-message', requireAuth: true, acceptRoles: ['client'] }
  },

  // 退会画面
  {
    path: '/withdrawal',
    component: () => import('@/views/withdrawal'),
    name: 'withdrawal',
    hidden: true,
    meta: { title: '退会', requireAuth: true, acceptRoles: ['client'] }
  },
  {
    path: '/withdrawal/complete',
    component: () => import('@/views/withdrawal/complete'),
    name: 'withdrawalComplete',
    hidden: true
  },

  // 候補者画面
  {
    path: '/talent/instruction',
    component: () => import('@/views/talent/instruction'),
    name: 'talentInstruction',
    hidden: true
  },
  {
    path: '/talent',
    component: () => import('@/views/talent'),
    name: 'talentAddreferees',
    hidden: true
  },
  {
    path: '/talent/complete',
    component: () => import('@/views/talent/complete'),
    name: 'talentComplete',
    hidden: true,
    props: true
  },
  {
    path: '/talent/unsubscribe/remind',
    component: () => import('@/views/talent/unsubscribe/remind'),
    name: 'talentUnsubscribeRemind',
    hidden: true
  },

  // コミュニケーション機能
  {
    path: '/regain_trust',
    hidden: true,
    component: () => import('@/views/regain_trust/regainTrustLayout'),
    children: [
      {
        path: 'instruction',
        name: 'regainTrustInstruction',
        component: () => import('@/views/regain_trust/instruction')
      },
      {
        path: 'excuse',
        name: 'regainTrustExcuse',
        component: () => import('@/views/regain_trust/excuse')
      },
      {
        path: 'confirm',
        name: 'regainTrustConfirm',
        component: () => import('@/views/regain_trust/confirm')
      },
      {
        path: 'complete',
        name: 'regainTrustComplete',
        component: () => import('@/views/regain_trust/complete')
      }
    ]
  },

  // 推薦者画面
  {
    path: '/referee',
    hidden: true,
    component: () => import('@/views/referee/refereeLayout'),
    children: [
      {
        path: '',
        name: 'refereeChoiceRoute',
        component: () => import('@/views/referee/choiceRoute')
      },
      {
        path: 'instruction',
        name: 'refereeInstruction',
        component: () => import('@/views/referee/instruction')
      },
      {
        path: 'authentication',
        name: 'refereeAuthentication',
        component: () => import('@/views/referee/authentication')
      },
      {
        path: 'answer/descriptions',
        name: 'answerDescriptions',
        component: () => import('@/views/referee/answer/descriptions'),
        meta: { requireAuth: true, isReferee: true }
      },
      {
        path: 'answer/selections',
        name: 'answerSelections',
        component: () => import('@/views/referee/answer/selections'),
        meta: { requireAuth: true, isReferee: true }
      },
      {
        path: 'identification',
        name: 'refereeIdentification',
        component: () => import('@/views/referee/identification'),
        meta: { requireAuth: true, isReferee: true }
      },
      {
        path: 'complete',
        name: 'refereeComplete',
        component: () => import('@/views/referee/complete'),
        meta: { requireAuth: true, isReferee: true }
      }
    ]
  },
  {
    path: '/referee/unsubscribe/remind',
    component: () => import('@/views/referee/unsubscribe/remind'),
    name: 'refereeUnsubscribeRemind',
    hidden: true
  },

  {
    path: '/privacy_policy',
    component: () => import('@/views/privacy_policy')
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
