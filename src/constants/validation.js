const mergeTriggerOnBlur = rule => ({ ...rule, trigger: 'blur' })

export const emailRules = [
  { required: true, message: 'メールアドレスを入力してください' },
  { type: 'email', message: 'メールアドレスの形式が無効です' }
].map(mergeTriggerOnBlur)

export const passwordRules = [
  { required: true, message: 'パスワードを入力してください' },
  { min: 6, message: 'パスワードは6文字以上です' }
].map(mergeTriggerOnBlur)

export const telRules = [
  { required: true, message: '電話番号を入力してください' },
  { pattern: /^\+\d{7}$/, message: '電話番号の形式が無効です' }
].map(mergeTriggerOnBlur)
