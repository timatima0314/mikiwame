import firebase from 'firebase/app'
import { resetRouter } from '@/router'
import { getCompanyByUid, getCompanyBySubAccountUid, getSubAccountIdByUid } from '@/utils/hooks/firestore'
import { setToken, removeToken, setRole, removeRole, hasAdminAuth } from '@/utils/auth'
import { PLAN_STATUSES, getPlanStatus } from '@/utils/plan_statuses'

const getDefaultState = () => {
  return {
    role: 'client',
    user: {},
    companyId: null,
    planStatus: PLAN_STATUSES.LIGHT,
    subAccountId: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_COMPANY_ID: (state, companyId) => {
    state.companyId = companyId
  },
  SET_PLAN_STATUS: (state, planStatus) => {
    state.planStatus = planStatus
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_SUB_ACCOUNT_ID: (state, subAccountId) => {
    state.subAccountId = subAccountId
  }
}

const actions = {
  // user login
  async login({ dispatch }, { user, isAdminLogin }) {
    const role = isAdminLogin ? 'admin' : 'client'
    setRole(role)
    setToken(user.uid)
    await dispatch('setUser', { user, role })
  },
  // user logout
  logout({ commit }) {
    resetRouter()
    commit('RESET_STATE')
    removeToken()
    removeRole()
    return firebase.auth().signOut()
  },
  /**
   * @param {firebase.auth.User}
   * @param {'admin' | 'client'} role
   */
  async setUser({ commit, dispatch }, { user, role = 'client' }) {
    try {
      if (role === 'admin' && await hasAdminAuth(user.uid) === false) throw Error('you do not have admin auth')

      commit('SET_USER', user)
      commit('SET_ROLE', role)
      await dispatch('setCompany', { uid: user.uid })
    } catch (err) {
      await dispatch('logout')
      throw Error(err)
    }
  },
  async setCompany({ commit, state }, { uid }) {
    if (state.companyId != null || state.subAccountId != null) return

    const mainAccountCompanyData = await getCompanyByUid({ uid })
    const isMainAccount = Boolean(mainAccountCompanyData.id)
    // メインアカウントのデータが取れた場合はサブアカウントのデータ取得はスキップ
    const subAccountCompanyData = isMainAccount ? null : await getCompanyBySubAccountUid({ uid })
    /* サブアカウントでログインするユーザーが増えてきたときは、こっちにする
    const [mainAccountCompanyData, subAccountCompanyData] = await Promise.all([
      getCompanyByUid({ uid }),
      getCompanyBySubAccountUid({ uid })
    ]) */

    const companyData = isMainAccount ? mainAccountCompanyData : subAccountCompanyData
    if (!companyData.id) throw Error('no company id')

    commit('SET_COMPANY_ID', companyData.id)
    commit('SET_PLAN_STATUS', getPlanStatus({ selected: companyData.selectedPlan, allowed: companyData.allowedPlan }))

    if (!isMainAccount) {
      // サブアカウントでログインする場合
      const { id: subAccountId } = await getSubAccountIdByUid({ companyId: companyData.id, uid })
      commit('SET_SUB_ACCOUNT_ID', subAccountId)
    }
  },
  // remove token
  resetToken({ commit }) {
    removeToken()
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
