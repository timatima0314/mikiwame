const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  user: state => state.user.user,
  companyId: state => state.user.companyId,
  planStatus: state => state.user.planStatus,
  role: state => state.user.role,
  isAdmin: state => state.user.role === 'admin',
  subAccountId: state => state.user.subAccountId,
  isSubAccount: state => state.user.subAccountId != null
}
export default getters
