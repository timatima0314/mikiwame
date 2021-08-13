<template>
  <div v-loading="loading" class="container">
    <span class="title">
      <i class="el-icon-user-solid" />
      候補者情報
    </span>

    <div id="print-page">
      <div v-if="showLogo">
        <img :src="logo" class="logo">
      </div>
      <el-card id="report-card" shadow="never" class="card-entire">
        <el-row :gutter="20">
          <el-col :span="4">
            <p
              style="
                font-size: 1.2rem;
                font-weight: bold;
                overflow-wrap: break-word;
              "
            >
              {{ talent.name }}
            </p>
            <p style="overflow-wrap: break-word">
              {{ talent.belongs || "所属不明" }}
            </p>
            <p v-if="status !== 'done'" class="caution red">
              ※リファレンスチェック未完了のため、内容が変更される可能性がございます
            </p>
          </el-col>
          <el-col :span="4">
            <div
              style="font-weight: bold; font-size: 11.5px; line-height: 30px"
            >
              <p>A おすすめ致します</p>
              <p>B 採用しても問題ない</p>
              <p>C 検討事項あり</p>
              <p>D 注意事項あり</p>
              <p>E おすすめ致しません</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              class="total-evaluation-text item-title"
              style="text-align: center; margin: 0 auto"
            >
              総合評価
            </div>
            <el-card
              :style="scoreStyle(totalEvaluation)"
              shadow="never"
              class="selections-evaluation-card selections-evaluation-box total-evaluation"
              style="margin-top: 10px"
            >
              <div class="selections-evaluation-score">
                {{ totalEvaluation }}
                <div v-if="totalEvaluation !== '未'" class="result">判定</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <p>
              リファレンスチェックの状態<br>
              <span class="status">{{ statusText }}</span>
            </p>
            <p>
              推薦者依頼{{ refereeCount }}名(回答完了 {{ answeredCount }}名)
            </p>
            <el-button
              data-html2canvas-ignore
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="printPage"
            >
              PDFダウンロード
            </el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="never" class="card-entire referee">
        <span class="card-title">
          <i class="el-icon-user" />
          推薦者
        </span>

        <ReportRefereeList :referees="referees" />
      </el-card>

      <el-card shadow="never" class="card-entire">
        <span class="card-title">
          <i class="el-icon-search" />
          社会人基礎力の評価
        </span>
        <div class="card-content">
          <el-row
            v-if="talent.rank === 'rookie'"
            :gutter="20"
            class="selections-evaluation-row"
          >
            <el-col
              v-for="(selection, i) in selectionsEvaluation.slice(1, 4)"
              :key="i"
              :span="6"
              :offset="i !== 0 ? 2 : 1"
              class="selections-evaluation-box"
            >
              <p class="selections-evaluation-text item-title">
                {{ selection.text }}
              </p>
              <el-card
                :style="scoreStyle(selection.evaluation)"
                shadow="never"
                class="selections-evaluation-card"
              >
                <div class="selections-evaluation-score">
                  {{ selection.evaluation }}
                  <div v-if="selection.evaluation !== '未'" class="result">
                    判定
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row v-else :gutter="20" class="selections-evaluation-row">
            <el-col
              v-for="(selection, i) in selectionsEvaluation.slice(0, 4)"
              :key="i"
              :span="6"
              class="selections-evaluation-box"
            >
              <p class="selections-evaluation-text item-title">
                {{ selection.text }}
              </p>
              <el-card
                :style="scoreStyle(selection.evaluation)"
                shadow="never"
                class="selections-evaluation-card"
              >
                <div class="selections-evaluation-score">
                  {{ selection.evaluation }}
                  <div v-if="selection.evaluation !== '未'" class="result">
                    判定
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col
              v-for="(selection, i) in selectionsEvaluation.slice(4, 7)"
              :key="i"
              :span="6"
              :offset="i !== 0 ? 2 : 1"
              class="selections-evaluation-box"
            >
              <p class="selections-evaluation-text item-title">
                {{ selection.text }}
              </p>
              <el-card
                :style="scoreStyle(selection.evaluation)"
                shadow="never"
                class="selections-evaluation-card"
              >
                <div class="selections-evaluation-score">
                  {{ selection.evaluation }}
                  <div v-if="selection.evaluation !== '未'" class="result">
                    判定
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div v-if="descriptionsAndAnswers.length !== 0">
          <hr style="margin: 1rem">

          <el-row :gutter="20">
            <el-col :span="3.5" :offset="1">
              <div
                class="card-title item-title"
                style="
                  font-weight: bold;
                  padding-left: 8px;
                  padding-right: 8px;
                  font-size: 1rem;
                  margin-top: 0;
                "
              >
                記述質問・回答
              </div>
            </el-col>
            <el-col :span="18">
              <p style="margin: 0px; font-size: 0.9rem">
                ■コミュニケーション機能について <br>
                推薦者の回答の中で、気になる項目を求職者に質問することができます。<br>
                気になる回答にチェックを入れて最下部から送信してください。<br>
                自由記載にて質問することも可能です。なお、求職者への質問は、一回限りとなります。<br>
                ※推薦者のお名前は開示されません。
              </p>
            </el-col>
          </el-row>
          <div class="card-content">
            <div
              v-for="(descriptionsByLang, j) in descriptionsAndAnswers"
              :key="j"
              class="questionsAndAnswers-row"
            >
              <div v-for="(description, i) in descriptionsByLang" :key="i">
                <!-- 中国語，英語の推薦者がいない限りは日本語の記述式のみ表示 -->
                <!-- ToDo: 以下のように記述しないとエラーが発生 .?使用したい -->
                <div
                  v-if="
                    j === 'jp' ||
                      (description.answers && description.answers.length)
                  "
                >
                  <div class="questionsAndAnswers-label">
                    <span
                      class="item-title questionsAndAnswers-num"
                    >{{ i + 1 }}.</span>
                    {{ description.text }}
                  </div>
                  <div v-if="!description.answers" class="type-text">
                    未回答
                  </div>
                  <div v-for="(answer, _) in description.answers" :key="_">
                    <el-checkbox
                      v-if="!talent.excuseCreatedAt"
                      v-model="answer.isChecked"
                    />
                    <el-checkbox
                      v-else
                      :value="findExcuse(description.key, answer.id, false)"
                      disabled
                    />
                    <span
                      class="questionsAndAnswers-name"
                    ><i class="el-icon-user-solid" />{{ answer.name }}</span>
                    <div class="questionsAndAnswers-text">
                      {{ answer.answerText || "未回答" }}
                    </div>
                    <div
                      v-if="
                        talent.excuseCompletedAt &&
                          findExcuse(description.key, answer.id, true)
                      "
                    >
                      <hr>
                      <p class="regain-trust-excuse">
                        候補者からの回答：{{
                          findExcuse(description.key, answer.id, true)
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-row>
            <el-col :span="3.5" :offset="1">
              <div
                class="card-title item-title"
                style="
                  font-weight: bold;
                  padding-left: 8px;
                  padding-right: 8px;
                  font-size: 1rem;
                "
              >
                選択質問・回答
              </div>
            </el-col>
          </el-row>
          <div class="card-content">
            <div
              v-for="(selection, i) in selectionsAndAnswers"
              :key="i"
              class="questionsAndAnswers-row"
            >
              <div class="questionsAndAnswers-label">
                <span
                  class="item-title questionsAndAnswers-num"
                >{{ i + 1 }}.</span>
                {{ selection.text }}
              </div>
              <div v-for="(answer, j) in selection.answers" :key="j">
                <span
                  class="questionsAndAnswers-name"
                ><i class="el-icon-user-solid" />{{ answer.name }}<br></span>
                <ul
                  v-for="(text, k) in radioSelectionText['jp']"
                  :key="k"
                  style="display: inline-block"
                >
                  <li
                    :class="
                      isChoiceSelected(answer, selection, k)
                        ? 'selected'
                        : 'no-selected'
                    "
                  >
                    {{ text }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="card-content">
            <template
              v-if="
                talent.excuseCreatedAt &&
                  talent.excusesToRegainTrust.fromCompany.text
              "
            >
              <div class="regain-trust-from-company questionsAndAnswers-row">
                <span class="regain-trust-from-company-title">追加質問</span>
                {{ talent.excusesToRegainTrust.fromCompany.text }}
              </div>
              <div v-if="talent.excuseCompletedAt">
                <hr class="regain-trust-divider">
                <p class="regain-trust-excuse">
                  候補者からの回答：{{
                    talent.excusesToRegainTrust.fromCompany.excuse
                  }}
                </p>
              </div>
            </template>
          </div>
          <div class="regain-trust-form">
            <el-form
              v-if="!talent.excuseCreatedAt"
              ref="form"
              :model="form"
              label-position="top"
            >
              <el-form-item label="自由記載の質問欄" style="margin-bottom: 0">
                <el-input
                  v-model="form.excusesToRegainTrust.fromCompany.text"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 4 }"
                  placeholder="※自由記載（具体的にご記載ください）"
                />
              </el-form-item>
              <p style="font-size: 0.7rem; margin-top: 0.2rem">
                ※推薦者のお名前は記載しないでください。
              </p>
              <el-form-item
                label="追加質問の回答締切"
                prop="excuseDeadline"
                :rules="[
                  {
                    required: true,
                    message: '締切は必ず入力してください',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-date-picker
                  v-model="form.excuseDeadline"
                  type="date"
                  placeholder="締切を入力してください"
                />
              </el-form-item>
              <div class="regain-trust-mail-button">
                <el-button
                  type="info"
                  @click="sendTalentRegainTrustMail()"
                >追加質問の送信</el-button>
              </div>
              <div style="text-align: center">
                <p class="regain-trust-explanation">
                  <strong>■コミュニケーション機能について</strong><br>
                  推薦者の回答の中で、気になる項目を求職者に質問することができます。<br>
                  気になる回答にチェックを入れて送信してください。<br>
                  自由記載にて質問することも可能です。なお、求職者への質問は、一回限りとなります。<br>
                  ※推薦者のお名前は開示されません。
                </p>
              </div>
            </el-form>
            <div
              v-else-if="talent.excuseCreatedAt && !talent.excuseCompletedAt"
              class="regain-trust-mail-button"
            >
              <RegainTrustDeadline :date="talent.excuseDeadline" />
              <el-button
                type="info"
                disabled
              >候補者からの回答待ちです</el-button>
            </div>
            <div
              v-else-if="talent.excuseCompletedAt"
              class="regain-trust-mail-button"
            >
              <el-button
                type="info"
                disabled
              >候補者は追加質問に対して回答済みです</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="previous-page">
      <router-link
        to="/company"
      ><el-button
        type="primary"
        icon="el-icon-arrow-left"
      >戻る</el-button></router-link>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get'
import html2pdf from 'html2pdf.js'
import { useTalent, updateTalent, getReferees } from '@/utils/hooks/firestore'
import { mapGetters } from 'vuex'
import logo from '@/assets/logo.png'
import { defaultDeadline } from '@/constants/date'
import { functions } from '@/plugins/firebase'
import RegainTrustDeadline from '@/components/RegainTrustDeadline'
import ReportRefereeList from '@/components/ReportRefereeList'
import {
  selectionPatterns,
  radioSelectionText,
  radioSelectionScore
} from '@/constants/questions'

export default {
  name: 'TalentReport',
  components: { RegainTrustDeadline, ReportRefereeList },
  data: () => ({
    selectionPatterns,
    radioSelectionText,
    radioSelectionScore,
    logo,
    showLogo: false,
    loading: false,
    form: {
      excuseDeadline: null,
      excusesToRegainTrust: {
        fromReferees: [],
        fromCompany: {
          text: '',
          excuse: ''
        }
      }
    },
    talent: {
      name: '',
      belongs: '',
      rank: ''
    },
    selectionsEvaluation: [
      { type: 'compliance', text: 'コンプライアンス', evaluation: '未' },
      { type: 'attendance', text: '勤怠', evaluation: '未' },
      { type: 'responsibility', text: '責任感', evaluation: '未' },
      { type: 'attitude', text: '仕事に対する姿勢', evaluation: '未' },
      { type: 'accomplishment', text: '業務完遂力', evaluation: '未' },
      { type: 'tolerance', text: 'ストレス耐性', evaluation: '未' },
      { type: 'others', text: 'その他', evaluation: '未' }
    ],
    totalEvaluation: '未',
    descriptionsAndAnswers: [
      {
        jp: [
          {
            key: '',
            text: '',
            answers: []
          }
        ],
        en: [
          {
            key: '',
            text: '',
            answers: []
          }
        ],
        cn: [
          {
            key: '',
            text: '',
            answers: []
          }
        ]
      }
    ],
    referees: [],
    // 記述式の回答がある場合は最終的に以下のような構造になります
    // descriptionsAndAnswers: [
    //   {
    //     key: questionsのkey,
    //     text: 質問文,
    //     answers: [{ name: 回答者の名前, answerText: 回答文 }, ...]
    //   },
    //  ...
    // ]
    selectionsAndAnswers: [
      {
        key: '',
        text: '',
        answers: []
      }
    ],
    refereeCount: 0,
    answeredCount: 0, // 回答した推薦者の数
    status: ''
  }),
  computed: {
    ...mapGetters(['companyId']),
    statusText() {
      const textEnum = {
        done: '完了',
        noReferee: '推薦者登録未完了',
        noAnswer: '推薦者回答未完了'
      }
      return textEnum[this.status]
    }
  },
  async created() {
    await this.fetchTalent()
  },
  methods: {
    get,
    async fetchTalent() {
      this.loading = true
      const { talentData } = await useTalent({
        companyId: this.companyId,
        talentId: this.$route.params.talentId
      })
      const referees = await getReferees({
        companyId: this.companyId,
        talentId: this.$route.params.talentId
      })
      this.referees = referees
      this.refereeCount = referees.length
      this.talent = talentData
      // TODO:要多言語対応
      this.descriptionsAndAnswers = {
        jp: talentData.questions['jp'].descriptions.map((description) => ({
          key: description.key,
          text: description.text,
          answers: []
        })),
        en: talentData.questions['en']?.descriptions.map((description) => ({
          key: description.key,
          text: description.text,
          answers: []
        })),
        cn: talentData.questions['cn']?.descriptions.map((description) => ({
          key: description.key,
          text: description.text,
          answers: []
        }))
      }
      this.selectionsAndAnswers = talentData.questions['jp'].selections.map(
        (selection) => ({
          key: selection.key,
          text: selection.text,
          answers: []
        })
      )
      if (talentData.evaluation) {
        referees.forEach((referee) => {
          if (referee.answer) {
            this.answeredCount++
          }
          this.setAnswers(referee)
        })
        this.selectionsEvaluation.forEach((selection) => {
          selection.evaluation = talentData.evaluation[selection.type] || '未'
        })
        this.totalEvaluation = talentData.evaluation.totalScore || '未'
      }

      if (this.answeredCount === this.refereeCount && this.refereeCount !== 0) {
        this.status = 'done'
      } else if (this.answeredCount < this.refereeCount) {
        this.status = 'noAnswer'
      } else {
        this.status = 'noReferee'
      }

      this.form.excuseDeadline = defaultDeadline

      this.loading = false
    },
    toggleLogo() {
      this.showLogo = !this.showLogo
    },
    // 選択肢質問において、どの選択肢が推薦者の解答なのかを判断する
    isChoiceSelected(answer, question, index) {
      if (selectionPatterns.positivePattern.includes(question.key)) {
        // ポジティブ質問である場合
        if (index === radioSelectionScore.indexOf(answer.answernum)) { return true } else return false
      } else if (selectionPatterns.negativePattern.includes(question.key)) {
        // ネガティブ質問である場合
        if (
          index ===
          radioSelectionScore.slice().reverse().indexOf(answer.answernum)
        ) { return true } else return false
      }
      return false
    },
    async printPage() {
      this.loading = true
      window.scrollTo(0, 0)
      const element = document.getElementById('print-page')
      const option = {
        margin: 3,
        filename: `リファレンスレポート_${this.talent.name}様.pdf`,
        pagebreak: {
          mode: ['css'],
          avoid: [
            '.questionsAndAnswers-row',
            '.questionsAndAnswers-num',
            '.questionsAndAnswers-name',
            '.questionsAndAnswers-text'
          ]
        },
        jsPDF: { format: 'a3' }
      }
      this.toggleLogo()
      await html2pdf(element, option)
      this.toggleLogo()
      this.loading = false
    },
    setAnswers(referee) {
      const refereeDescriptions = get(referee, 'answer.descriptions')
      const refereeSelections = get(referee, 'answer.selections')
      if (
        !refereeDescriptions ||
        !refereeSelections ||
        !Object.keys(refereeDescriptions).length ||
        !Object.keys(refereeSelections).length
      ) { return }

      this.descriptionsAndAnswers[referee.language].forEach((description) => {
        if (!description.answers) {
          description.answers = []
        }
        const [, answer] =
          Object.entries(refereeDescriptions).find(
            ([key]) => key === description.key
          ) || []
        description.answers.push({
          id: referee.id,
          name: referee.name,
          answerText: answer,
          isChecked: false
        })
      })
      this.selectionsAndAnswers.forEach((selection) => {
        if (!selection.answers) {
          selection.answers = []
        }
        const [, answer] =
          Object.entries(refereeSelections).find(
            ([key]) => key === selection.key
          ) || []
        selection.answers.push({
          id: referee.id,
          name: referee.name,
          answernum: answer
        })
      })
    },
    scoreStyle(score) {
      if (score === 'A') {
        return 'color: #FFF; border-color: #28a745; background: #28a745;'
      } else if (score === 'B') {
        return 'color: #FFF; border-color: #007bff; background: #007bff;'
      } else if (score === 'C' || score === 'D') {
        return 'color: #FFF; border-color: #ffc107; background: #ffc107;'
      } else if (score === 'E') {
        return 'color: #FFF; border-color: #dc3545; background: #dc3545;'
      }
    },
    async sendTalentRegainTrustMail() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) return

      this.loading = true

      // TODO: 多言語対応
      Object.keys(this.descriptionsAndAnswers).forEach((descriptionsByLang) => {
        this.descriptionsAndAnswers[descriptionsByLang].forEach(
          (description) => {
            description.answers.forEach((answer) => {
              if (answer.isChecked) {
                const existingFromReferees = this.form.excusesToRegainTrust.fromReferees.find(
                  (val) => val.questionKey === description.key
                )
                if (existingFromReferees) {
                  existingFromReferees.answers.push({
                    refereeId: answer.id,
                    text: answer.answerText,
                    excuse: ''
                  })
                } else {
                  this.form.excusesToRegainTrust.fromReferees.push({
                    text: description.text,
                    questionKey: description.key,
                    answers: [
                      {
                        refereeId: answer.id,
                        text: answer.answerText,
                        excuse: ''
                      }
                    ]
                  })
                }
              }
            })
          }
        )
      })

      // コミュニケーション機能に関する情報更新→メール送信→excuseCreatedAt更新
      // メール送信失敗した場合は再度編集できるように
      // メール送信が成功したらexcuseCreatedAtを更新
      // 遅すぎる
      /* try {
        await updateTalent({
          companyId: this.companyId,
          talentId: this.talent.id,
          data: {
            excuseDeadline: this.form.excuseDeadline,
            excuseCompletedAt: null,
            excusesToRegainTrust: this.form.excusesToRegainTrust
          }
        })
      } catch (err) {
        this.$rollbar.error(err)
        this.$message({
          message: '更新に失敗しました。通信環境を確認したうえで再度お試しください。',
          type: 'error'
        })
        return (this.loading = false)
      }

      try {
        await functions.httpsCallable('sendMailToTalentRegainTrustByIds')({
          companyId: this.companyId,
          talentId: this.talent.id
        })
      } catch (err) {
        this.$rollbar.error(err)
        this.$message({
          message: 'メール送信に失敗しました。通信環境を確認したうえで再度お試しください。',
          type: 'error'
        })
        return (this.loading = false)
      }

      await updateTalent({
        companyId: this.companyId,
        talentId: this.talent.id,
        data: { excuseCreatedAt: new Date() }
      }).then(() => {
        this.$message({
          message: 'メール送信に成功しました',
          type: 'success'
        })
      }).catch(err => {
        this.$rollbar.error(err)
        this.$message({
          message: '更新に失敗しました。通信環境を確認したうえで再度お試しください。',
          type: 'error'
        })
      }) */

      // 送信完了を待つと、3秒以上ローディングで待たされてしまう。そのため、完了を待たずに成功通知を出してしまう。
      await updateTalent({
        companyId: this.companyId,
        talentId: this.talent.id,
        data: {
          excuseDeadline: this.form.excuseDeadline,
          excuseCompletedAt: null,
          excusesToRegainTrust: this.form.excusesToRegainTrust,
          excuseCreatedAt: new Date()
        }
      })

      functions.httpsCallable('sendMailToTalentRegainTrustByIds')({
        companyId: this.companyId,
        talentId: this.talent.id
      })
      this.$notify({
        title: 'Success',
        message: 'メールの送信に成功しました',
        type: 'success'
      })

      // 表示内容を更新
      await this.fetchTalent()

      this.loading = false
    },
    // コミュニケーション機能で使用する回答を絞る
    findExcuse(descriptionKey, answerId, isRequiredExcuse) {
      if (!this.talent.excusesToRegainTrust) return ''

      const fromReferee = this.talent.excusesToRegainTrust.fromReferees.find(
        (fr) => fr.questionKey === descriptionKey
      )
      if (fromReferee === undefined) return ''
      const answers = fromReferee.answers.find(
        (ans) => ans.refereeId === answerId
      )
      if (isRequiredExcuse && answers) return answers.excuse
      else if (!isRequiredExcuse && answers) return true
      else ''
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  width: 80%
  margin: 2rem auto
.logo
  width: 30%
  height: 30%
  object-fit: contain
.title
  font-size: 1.5rem
.total-evaluation
  margin-left: 2rem
  &-text
    font-weight: bold
    margin-bottom: 30px
    width: 70%
.status
  color: #44c1c1
.red
  color: #ea0202
.green
  color: green
.caution
  font-size: .8rem
.result
  font-size: 1rem
  font-weight: bold
  text-align: right
.item-title
  color: #FFF
  background-color: #00004c
  border-radius: 5px
  text-align: center
  padding-top: 8px
  padding-bottom: 8px
.card-entire
  margin-top: 1rem
  margin-right: 1rem /*pdfで右を見切れさせない*/
  border: solid
  border-color: #C0C4CC
.card-title
  font-size: 1.3rem
  &:nth-child(n + 2)
    margin-top: 1rem
.card-content
  padding: 1rem 2rem
.selections-evaluation
  &-row
    margin: 1.5rem
  &-card
    font-size: 5rem
    height: 10rem
    width: 10rem
    margin: auto
    border-radius: 1rem
  &-score
    margin-top: .8rem
  &-box
    display: flex
    text-align: center
    flex: 1
    flex-direction: column
    justify-content: space-between
  &-text
    padding-left: 1rem
    padding-right: 1rem
    font-weight: bold
    margin-bottom: 10px
    font-size: .9rem
.questionsAndAnswers
  &-row
    border-top: 2px solid #C0C4CC
  &-num
    padding: 5px
  &-label
    text-align: left
    padding: 1rem
    color: #00004c
    font-weight: 400
    vertical-align: top
    font-size: .9rem
    line-height: 1.7
  &-text
    padding: .6rem 1rem .6rem 1rem
    font-size: .8rem
  &-name
    font-size: .9rem
.previous-page
  margin-top: 2rem
  text-align: center
.regain-trust
  &-form
    border-top: 2px solid #C0C4CC
    padding: 2rem 1rem
  &-mail-button
    text-align: center
  &-excuse
    padding: 0rem 1rem .6rem 1rem
    color: #409EFF
    font-size: .9rem
  &-from-company
    text-align: left
    padding: 1rem
    color: #E6A23C
    font-weight: 400
    vertical-align: top
    font-size: .9rem
    line-height: 1.7
  &-from-company-title
    color: #FFF
    background-color: #E6A23C
    border-radius: 5px
    text-align: center
    padding: 8px 5px
  &-divider
    border: none
    border-top: 1px solid #C0C4CC
    margin-left: 1rem
  &-explanation
    font-size: 0.75rem
    display: inline-block
    text-align: left
.selected
  font-size: 17px
.no-selected
  font-size: 15px
  color: #C0C0C0
</style>
