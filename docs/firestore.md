# FireStoreの設計

## コレクションの入れ子構造

- admin_configs
- administrators
- company_version
  - companies
    - talents
    - subAccounts
      - refrees

## コレクションのスキーマ

### /admins/{uid}

- 管理者用アカウントのuidをidに持つ空のドキュメントを保持しておくことで、どのユーザーが管理者かを判別

### /admin_configs/{id}

- 管理者用の設定を管理するためのコレクション(social-checkの名残。今のところ用途なし)

| フィールド           | Type   | 説明                   |
| -------------------- | ------ | ---------------------- |
| targetAddedMailTo    | String | 送信先のメールアドレス |

### /risk_eyes_billing/{YYYYMM}

| フィールド            | Type   | 説明                   |
| --------------------- | ------ | ---------------------- |
| <RISK EYESの利用者ID> | number | ある利用者の、その月の請求金額 |
| uploadedAt            | Date   | アップロードされた日時(念の為保持) |

- RISK EYESの請求を管理者ページからCSVでアップロードし、このコレクションに保存する。2020年9月分のCSVであれば、/risk_eyes_billing/202009に保存される

### /company_version/{version}

- versionは1, 2, 3, ...
- companiesコレクションのバージョン管理を行うためのコレクション
- フィールドは存在しない

### /company_version/{version}/companies/{id}

- idは自動割り振り
- 会社を管理するコレクション

| フィールド             | Type                 | 説明                                                         |
| --------------------   | -------------------  | ------------------------------------------------------------ |
| name                   | string               | 会社名                                                       |
| email                  | string               | 会社のメアド。Firebase Authのemailと一緒。更新時には両方を変更する必要があることに注意。|
| uid                    | uid                  | Firebase Authのuidに対応                                     |
| createdAt              | Date                 | 登録日時                                                     |
| verifiedAt             | Date\|null           | 管理者アカウントによって承認された日時。nullは承認取り消しを表す|
| deletedAt              | Date\|null           | 退会した日時。ユーザー自身によって退会した場合と管理者による強制退会の場合どちらも使用。nullは退会キャンセルを表す。|
| bannedAt               | Date\|null           | 強制退会させられた日時。強制退会かユーザー自身による退会かを判別する。nullはユーザー自身による退会か退会キャンセル済を表す。|
| riskEyesId             | string               | RISK EYESの利用者ID。課金額の確認に用いる                    |
| creditCard             | Map                  | hasMemberSaved: boolean GMO側に会員を登録したかのフラグ<br>cardSeq: number GMO側に登録したカードの連番<br>maskedCardNo: string 一部伏せ字にしたカード番号<br>valid: boolean 最後にクレカの有効性チェックを行ったときの結果|
| isAgreeToNotice        | boolean              | 特記事項(月額や企業ロゴの使用)に同意したか                        |
| isBusinessCardRequired | boolean              | 推薦者に本人確認の名刺を提出させるかどうか                        |
| isFreemailAllowed      | boolean              | 推薦者が登録するメールについてフリーメールを許可するかどうか      |
| loginCount             | number               | ユーザーがログインした回数(初回ログインのポップアップを消した際には-1となる)  |
| selectedPlan           | 'LIGHT' | 'STANDARD' | ユーザーが選択したプラン                                      |
| allowedPlan            | 'LIGHT' | 'STANDARD' | 管理者が許可したプラン                                      |
| subAccountUids         | array                | サブアカウントのuidが含まれる配列                                      |


### /company_version/{version}/companies/{company_id}/orders/{id}

- idは自動割り振り
- クレカの取引を管理するコレクション
- 現状は洗替・継続課金CSVをアップロードする使用のため、使っていない。自動課金を行う場合は必要

| フィールド           | Type                | 説明                                                         |
| -------------------- | ------------------- | ------------------------------------------------------------ |
| amount               | Date                | 金額                                                         |
| accessID             | String              | GMO側に取引を登録したときに発行されるID                      |
| accessPass           | String              | GMO側に取引を登録したときに跛行されるPass                    |
| createdAt            | Date                | 登録日時                                                     |
| doneAt               | Date                | 請求が行われた日時(基本的には登録日時の1ヶ月後)              |

### /company_version/{version}/companies/{company_id}/talents/{id}

- idは自動割り振り
- ある会社の候補者(リファレンスチェックの対象者)を管理するコレクション

| フィールド               | Type      | 説明                                                         |
| ------------------------ | --------- | ------------------------------------------------------------ |
| name                     | string    | 候補者の氏名                                                 |
| email                    | string    | 候補者のメールアドレス                                       |
| deadline                 | timestamp | リファレンスチェックの締め切り                               |
| createdAt                | timestamp | 追加された日時                                               |
| isMailToRefereesSent     | boolean   | 推薦者たちへのメールを送信済みかどうか                       |
| isAgreeToPrivacyPolicy   | boolean   | 候補者画面にて、プライバシーポリシーに同意したか             |
| completedAt              | Date      | すべての推薦者がリファレンスを完了した日時                                     |
| questions                | map       | 推薦者に答えてもらう質問。型は以下を参照                     |
| rank                     | string    | 候補者の区分。新卒・アルバイト(rookie)または一般職・責任者(fulltime)                     |
| status                   | string    | 候補者がどの段階まで手順を進めたかのステータス。talentRegistered(メール未送信)→mailSend(メール未開封)→agreeToPrivacyPolicy(推薦者未登録)→refereesRegistered(推薦者未回答)→refereesAnswered(完了)の5段階。                   |
| excuseDeadline           | timestamp | コミュニケーション機能の回答締め切り                                               |
| excuseCreatedAt          | timestamp | コミュニケーション機能の回答依頼メールが送信された日時                               |
| excuseCompletedAt        | timestamp | 候補者がコミュニケーション機能を完了した日時                                   |
| exsusesToRegainTrust     | map       | コミュニケーション機能の質問とその回答。型は以下を参照                              |
| isUnsubscribeRemind      | boolean   | リマインドメールの配信停止を希望しているかどうか。trueであれば、リマインドメールを送らないようにする |

```javascript
questions: {
  jp: {
    descriptions: { key: string, text: string }[],
    selections: { key: string, text: string }[]
  },
  en: {
    descriptions: { key: string, text: string }[],
    selections: { key: string, text: string }[]
  }
  cn: {
    descriptions: { key: string, text: string }[],
    selections: { key: string, text: string }[]
  }
}
```
なお、`key`は質問を一意に識別するためのもので、`text`は質問文のこと。

```
excusesToRegainTrust: {
  fromReferees: {
    answers: { refereeId: string, text: string, excuse: string }[] 
  }[],
  fromCompany: { text: string, excuse: string }
}
```

### /company_version/{version}/companies/{company_id}/subAccounts/{id}

- idは自動割り振り
- ある会社のサブアカウントを管理するコレクション

| フィールド               | Type      | 説明                                                         |
| ------------------------ | --------- | ------------------------------------------------------------ |
| name                     | string    | サブアカウントの氏名                                                 |
| email                    | string    | サブアカウントのメールアドレス                                       |
| department               | string    | リサブアカウント利用者が所属する会社の部署                               |
| createdAt                | timestamp | 追加された日時                                               |
| bannedAt                 | timestamp | アカウントを無効にされた日時                       |
| uid                      | uid       | Firebase Authのuidに対応                                     |
| id                       | string    | 自動割り振りされたサブアカウントのid                                    |

### /company_version/{version}/companies/{company_id}/talents/{talent_id}/referees/{id}

- idは自動割り振り
- ある会社のある候補者の推薦者(リファレンスチェックに答えてくれる人)を管理するコレクション
- リファレンスチェックへの回答を保存

| フィールド               | Type      | 説明                                                         |
| ------------------------ | --------- | ------------------------------------------------------------ |
| name                     | string    | 推薦者の氏名                                                 |
| belongs                  | string    | 推薦者の所属(会社・役職など)                                 |
| email                    | string    | 推薦者のメールアドレス                                       |
| createdAt                | timestamp | 追加された日時                                               |
| isAgreeToPrivacyPolicy   | boolean   | 推薦者画面にて、プライバシーポリシーに同意したか             |
| completedAt              | Date      | リファレンスを完了した日時                                     |
| answer                   | map       | リファレンスへの回答。構造は以下の通り                            |
| phoneNumber              | string    | リファレンス時に登録した電話番号                            |
| isUnsubscribeRemind      | boolean   | リマインドメールの配信停止を希望しているかどうか。trueであれば、リマインドメールを送らないようにする |

```javascript
answer: {
  descriptions: { [key:string]: string }, // 値には記述式の質問への回答文章が入る。e.g. advantageAndDisadvantage: '長所は〜、短所は〜。'
  selections: { [key:string]: number } // 値には選択式の回答結果が入る。0〜10で、0が「あてはまらない」、10が「あてはまる」
}
```
keyにはtalent.questionsのkeyが入る(talentドキュメントの説明を参照)

### /withdrawal_questionnaire/{id}

- 退会時のアンケート結果を保存するコレクション

| フィールド               | Type      | 説明                                                         |
| ------------------------ | --------- | ------------------------------------------------------------ |
| userName                 | string    | ユーザーの氏名                                               |
| companyId                | string    | 会社のID                                                    |
| companyName              | string    | 会社名                                                      |
| email                    | string    | 会社のメールアドレス                                          | 
| createdAt                | timestamp | 追加された日時                                               |
| reasonsForWithdrawal     | map       | 退会時アンケートへの回答。構造は以下の通り。                     |

```javascript
reasonsForWithdrawal: {
  descriptions: string , // アンケートの自由記入欄への回答が入る。値は一つのみ
  selections: { string }[] // アンケートの選択欄の回答が入る。複数選択可能で、選択した項目のlabelの値が入る。
}
```
selectionの選択肢は`src/constants/options.js`を参照
