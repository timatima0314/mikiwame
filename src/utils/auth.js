import Cookies from 'js-cookie'
import firebase from 'firebase/app'

// ログイン状態を保持するため、uidをクッキーに保存
const tokenKey = 'session'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = token => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)

// どのロール(admin or client)でログインしているかを保持する
const roleKey = 'role'
export const getRole = () => Cookies.get(roleKey)
export const setRole = role => Cookies.set(roleKey, role)
export const removeRole = () => Cookies.remove(roleKey)

export async function hasAdminAuth(uid) {
  const adminSnapshot = await firebase.firestore().doc(`admins/${uid}`).get()
  return adminSnapshot.exists
}
