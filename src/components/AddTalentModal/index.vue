<template>
  <el-dialog title="候補者の追加" :visible="isModalOpen" :before-close="handleClose" style="text-align: center" :width="$mq === 'pc' ? '60%' : '80%'" @close="close">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="loading"
      :label-position="$mq === 'pc' ? 'right' : 'top'"
      :label-width="$mq === 'pc' ? '10rem' : '20rem'"
      :style="$mq === 'pc' ? '' : 'text-align: left'"
    >
      <div v-if="!isBulk">
        <el-form-item label="氏名" prop="name">
          <el-input v-model="form.name" placeholder="山田太郎" />
        </el-form-item>

        <el-form-item label="メールアドレス" prop="email">
          <el-input v-model="form.email" placeholder="info@mikiwame-p.jp" />
        </el-form-item>

        <el-form-item label="電話番号">
          <el-row :gutter="10">
            <el-col :span="6">
              <span class="demonstration">国際コード</span>
            </el-col>
            <el-col :span="10">
              <span class="demonstration">電話番号（ハイフンなし）</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="countryCode">
                <el-input v-model="form.countryCode" placeholder="国際コード" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="phoneNumber">
                <el-input v-model="form.phoneNumber" placeholder="電話番号を入力してください" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="言語" style="text-align: left">
          <el-radio-group v-model="form.language">
            <el-radio
              v-for="(option, i) in options.questionsLang"
              :key="i"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="現在の会社" prop="currentCompany">
          <el-input v-model="form.currentCompany" placeholder="会社名を入力してください" />
        </el-form-item>

        <el-form-item label="候補者の現在の職種" prop="currentJobCategory" style="text-align: left">
          <el-cascader v-model="form.currentJobCategory" :options="options.jobCategoryOptions" placeholder="選択してください" />
        </el-form-item>

        <el-form-item label="応募媒体" prop="siteWhereTalentApplied" style="text-align: left">
          <el-cascader v-model="form.siteWhereTalentApplied" :options="options.appliedSiteOptions" placeholder="選択してください" />
        </el-form-item>

        <el-form-item label="企業担当者" prop="recruitmentOfficer">
          <el-input v-model="form.recruitmentOfficer" placeholder="企業担当者を入力してください" />
        </el-form-item>
      </div>
      <el-form-item label="締め切り" style="text-align: left" prop="deadline">
        <el-date-picker v-model="form.deadline" />
      </el-form-item>

      <el-form-item label="推薦者の内訳" style="text-align: left">
        <div v-for="(breakdown, index) in form.refereeBreakdown" :key="index">
          <el-card>
            <el-select v-model="breakdown.relationship" placeholder="関係性">
              <el-option
                v-for="option in options.relationshipOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-button v-if="form.refereeBreakdown.length > 1" type="primary" icon="el-icon-close" style="float: right" circle plain @click="deleteRefereeBreakdown(index)" />
            <el-input v-if="breakdown.relationship === 'other'" v-model="breakdown.otherRelationship" placeholder="推薦者との関係性を入力してください" />
            <div><el-select v-model="breakdown.timeWorkingTogether" placeholder="時期">
              <el-option
                v-for="option in options.timeWorkingOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select></div>
            <el-input v-if="breakdown.timeWorkingTogether === 'other'" v-model="breakdown.otherTimeWorkingTogether" placeholder="一緒に働いた時期を入力してください" />
            <el-input-number v-model="breakdown.numberOfPeople" :min="1" :max="10" placeholder="人数" />名
          </el-card>
        </div>
        <el-button type="primary" plain icon="el-icon-plus" style="float: right" @click="addRefereeBreakdown">内訳を追加</el-button>
      </el-form-item>

      <div v-if="!isBulk">
        <el-form-item label="候補者の区分" style="text-align: left">
          <el-radio-group v-model="form.rank">
            <el-radio
              v-for="(option, i) in options.answererRanks"
              :key="i"
              :label="option.label"
              :disabled="isEditableQuestions"
              @change="adaptQuestionIdToRank(option.label)"
            >
              {{ option.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item label="質問テンプレート" style="text-align: left">
        <el-select v-model="templateQuestionsId" placeholder="Select" :disabled="isEditableQuestions" style="padding-right: 10px" @change="questionsLang = 'jp'">
          <el-option
            v-for="(tmp, i) in filteredTemplateQuestionList"
            :key="i"
            :label="tmp.name"
            :value="tmp.id"
          />
        </el-select>
        <el-button v-if="!isEditableQuestions" type="primary" @click="confirmTemplateQuestions">このテンプレートをもとに質問を作成</el-button>
        <el-button v-else type="primary" @click="changeTemplateQuestions">テンプレートを変更</el-button>
      </el-form-item>

      <el-tabs v-model="showingQuestionType" type="card">
        <el-tab-pane label="記述式" name="descriptions"><h3>記述式の質問({{ descriptionsLength }}問)</h3></el-tab-pane>
        <el-tab-pane label="選択式" name="selections"><h3>選択式の質問({{ selectionsLength }}問)</h3></el-tab-pane>
      </el-tabs>

      <el-form-item v-if="templateQuestions['en'] && templateQuestions['cn']" label="編集する質問の言語" style="text-align: left">
        <el-radio-group v-model="questionsLang" placeholder="言語">
          <el-radio
            v-for="(option, i) in options.questionsLang"
            :key="i"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
        <p style="margin-top: 0px; font-size: 0.7rem;">※その国の言語で質問した場合、その国の言語で返答されます</p>
      </el-form-item>

      <template v-if="showingQuestionType === 'descriptions'">
        <el-card>
          <editable-questions :questions="isEditableQuestions ? questions[questionsLang].descriptions : templateQuestions[questionsLang].descriptions" :is-editable-questions="isEditableQuestions" />
          <div v-if="isEditableQuestions">
            <h3>独自の質問(必要に応じて追加してください)</h3>
            <el-input v-model="newQuestionText" type="textarea" placeholder="オリジナルの質問を入力してください" style="padding-bottom: 10px" />
            <el-button type="info" @click="addDescriptionQuestion">独自の質問を追加する</el-button>
            <el-button type="info" @click="resetQuestion">質問をもとに戻す</el-button>
          </div>
        </el-card>
      </template>

      <el-card v-else-if="showingQuestionType === 'selections'">
        <div v-for="(question, i) in isEditableQuestions ? questions[questionsLang].selections : templateQuestions[questionsLang].selections" :key="i">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col><p class="strong font-big" style="text-align: left">{{ i + 1 }}. {{ question.text }}</p></el-col>
            <el-col v-if="isEditableQuestions" :span="2"><el-button icon="el-icon-lock" type="info" circle disabled /></el-col>
          </el-row>
          <hr style="border-style: dashed; color: grey">
        </div>
      </el-card>
      <hr>

      <el-button type="primary" @click="addTalent">保存する</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import { defaultDeadline } from '@/constants/date'
import EditableQuestions from '@/components/EditableQuestions'
import { getDefaultQuestionsByLang, getDefaultQuestionsForRookieByLang } from '@/constants/questions'
import { statusProperty } from '@/constants/status'
import { getRelationshipOptionsByLang, getTimeWorkingOptionsByLang, getJobCategoryOptionsByLang, getAppliedSiteOptions, getAnswererRanks, getQuestionsLangByLang } from '@/constants/options'
import { companiesCollectionRef } from '@/plugins/firebase'
import { useCompany } from '@/utils/hooks/firestore'
import { checkDuplicationOfBreakdown } from '@/utils/referee_breakdown'

const getDefaultFormValues = () => ({
  name: '',
  email: '',
  countryCode: '+81',
  phoneNumber: '',
  currentCompany: '',
  currentJobCategory: '',
  siteWhereTalentApplied: '',
  recruitmentOfficer: '',
  deadline: defaultDeadline,
  refereeBreakdown: [{
    relationship: '',
    isRelationshipSelectedByCompany: false,
    otherRelationship: '', // relationshipがotherの時にのみ有効
    timeWorkingTogether: '',
    isTimeWorkingTogetherSelectedByCompany: false,
    otherTimeWorkingTogether: '', // timeWorkingTogetherがotherの時にのみ有効
    numberOfPeople: 1
  }],
  rank: 'fulltime',
  language: 'jp'
})

/*
 * @use <add-target-modal :is-modal-open.sync="isModalOpen" :company-document-ref="companyDocumentRef" />
 */
export default {
  name: 'AddTalentModal',
  components: { EditableQuestions },
  props: {
    isModalOpen: { type: Boolean, default: false },
    isBulk: { type: Boolean, default: false },
    talents: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      questionsLang: 'jp',
      form: getDefaultFormValues(),
      showingQuestionType: 'descriptions',
      // defaultDescriptionQuestions: [],
      // originalDescriptionQuestions: [],
      newQuestionText: '',
      isEditableQuestions: false,
      questions: {
        jp: {
          descriptions: [],
          selections: []
        },
        en: {
          descriptions: [],
          selections: []
        },
        cn: {
          descriptions: [],
          selections: []
        }
      },
      templateQuestionsList: [
        {
          name: 'デフォルトテンプレート(一般職・責任者)',
          jp: getDefaultQuestionsByLang('jp'),
          en: getDefaultQuestionsByLang('en'),
          cn: getDefaultQuestionsByLang('cn'),
          id: 'fulltimeDefault',
          templateType: 'fulltime'
        },
        {
          name: 'デフォルトテンプレート(新卒・アルバイト)',
          jp: getDefaultQuestionsForRookieByLang('jp'),
          en: getDefaultQuestionsForRookieByLang('en'),
          cn: getDefaultQuestionsForRookieByLang('cn'),
          id: 'rookieDefault',
          templateType: 'rookie'
        }
      ],
      templateQuestionsId: 'fulltimeDefault',
      unsubscribe: () => {}
    }
  },
  computed: {
    ...mapGetters(['user', 'companyId']),
    templateQuestions() {
      return this.templateQuestionsList.find((tmp) => tmp.id === this.templateQuestionsId)
    },
    filteredTemplateQuestionList() {
      return this.templateQuestionsList.filter(question => question.templateType === this.form.rank)
    },
    descriptionsLength() {
      return this.isEditableQuestions ? this.questions[this.questionsLang].descriptions.length : this.templateQuestions[this.questionsLang].descriptions.length
    },
    selectionsLength() {
      return this.isEditableQuestions ? this.questions[this.questionsLang].selections.length : this.templateQuestions[this.questionsLang].selections.length
    },
    rules: () => ({
      name: [{ required: true, message: '氏名を入力してください', trigger: 'blur' }],
      email: [
        { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
        { type: 'email', message: 'メールアドレスの形式が無効です', trigger: 'blur' }
      ],
      deadline: [{ required: true, message: '締め切りを選択してください', trigger: 'blur' }],
      countryCode: [{ pattern: /(\+[0-9]{1,4})$/, message: '国際コードの形式が無効です', trigger: 'blur' }],
      phoneNumber: [{ pattern: /^[0-9]{9,11}$/, message: '9-11桁の半角数字を入力してください', trigger: 'blur' }],
      currentCompany: [{ required: true, message: '会社名を入力して下さい', trigger: 'blur' }],
      currentJobCategory: [{ required: true, message: '職種を選択してください', trigger: 'blur' }],
      siteWhereTalentApplied: [{ required: true, message: '候補者が応募した媒体を選択してください', trigger: 'blur' }]
    }),
    options: () => ({
      relationshipOptions: getRelationshipOptionsByLang(),
      timeWorkingOptions: getTimeWorkingOptionsByLang(),
      jobCategoryOptions: getJobCategoryOptionsByLang(),
      appliedSiteOptions: getAppliedSiteOptions(),
      answererRanks: getAnswererRanks(),
      questionsLang: getQuestionsLangByLang()
    })
  },
  async created() {
    const { companyDocumentSnapshot } = await useCompany({ companyId: this.companyId })
    const templateQuestionsQuery = companyDocumentSnapshot.ref.collection('templateQuestions').orderBy('createdAt', 'asc')
    // マルパク（意味理解せず）
    this.unsubscribe = templateQuestionsQuery.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        switch (change.type) {
          case 'added': // 初回取得時 or データ追加時
            this.templateQuestionsList.unshift({ ...change.doc.data(), id: change.doc.id })
            break
          case 'modified':
            Object.assign(this.templateQuestionsList.find(({ id }) => id === change.doc.id) || {}, change.doc.data())
            break
          case 'removed':
            this.templateQuestionsList.splice(this.templateQuestionsList.map(target => target.id).indexOf(change.doc.id), 1)
            break
        }
      })
    })
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading
    },
    close() {
      this.$emit('update:isModalOpen', false)
    },
    // ×ボタンかモーダルの外がクリックされた場合
    handleClose(done) {
      this.$confirm('候補者の追加を中断しますか?')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    // 推薦者の内訳を追加
    addRefereeBreakdown() {
      this.form.refereeBreakdown.push({
        relationship: '',
        otherRelationship: '',
        isRelationshipSelectedByCompany: false,
        timeWorkingTogether: '',
        otherTimeWorkingTogether: '',
        isTimeWorkingTogetherSelectedByCompany: false,
        numberOfPeople: 1
      })
    },
    // 推薦者の内訳を削除
    deleteRefereeBreakdown(index) {
      this.form.refereeBreakdown.splice(index, 1)
    },
    // 独自の質問を追加
    addDescriptionQuestion() {
      if (!this.newQuestionText) return this.$message('質問が入力されていません')

      this.questions[this.questionsLang].descriptions.push({
        key: `original_${new Date().getTime()}`,
        text: this.newQuestionText
      })

      this.newQuestionText = ''
    },
    // 質問をデフォルトに戻す
    resetQuestion() {
      this.questions[this.questionsLang].descriptions = cloneDeep(this.templateQuestions[this.questionsLang].descriptions)
    },
    // 質問テンプレート決定
    confirmTemplateQuestions() {
      this.questions = cloneDeep(this.templateQuestions)
      this.isEditableQuestions = true
    },
    // 一度決定した質問テンプレートを変更
    async changeTemplateQuestions() {
      this.questionsLang = 'jp'
      const confirm = await this.$confirm(`質問テンプレートを変更した場合，編集した質問内容は保存されませんがよろしいですか？`).catch(() => {})
      if (confirm === undefined) return

      this.isEditableQuestions = false
    },
    adaptQuestionIdToRank(label) {
      this.templateQuestionsId = label === 'rookie' ? 'rookieDefault' : 'fulltimeDefault'
    },
    async addTalent() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) return

      // 推薦者内訳の重複確認
      const isBreakdownDuplicated = checkDuplicationOfBreakdown(this.form.refereeBreakdown)
      if (isBreakdownDuplicated) return this.$notify({ title: 'Error', message: '推薦者内訳が重複しています。', type: 'error' })

      if (!this.isEditableQuestions) this.questions = cloneDeep(this.templateQuestions)

      this.toggleLoading()
      if (!this.isBulk) {
        const questions = this.isEditableQuestions ? this.questions : this.templateQuestions
        // 通常の追加の場合
        companiesCollectionRef.doc(this.companyId).collection('talents').add({
          ...this.form,
          status: statusProperty.talentRegistered.key,
          refereeBreakdown: this.form.refereeBreakdown.map(breakdown => ({
            ...breakdown,
            isRelationshipSelectedByCompany: Boolean(breakdown.relationship),
            isTimeWorkingTogetherSelectedByCompany: Boolean(breakdown.timeWorkingTogether)
          })),
          createdAt: new Date(),
          questions: {
            // TODO: 英語の質問が追加された場合は、enのキーに保存したい
            jp: {
              descriptions: questions['jp']?.descriptions ?? [],
              selections: questions['jp']?.selections ?? []
            },
            en: {
              descriptions: questions['en']?.descriptions ?? [],
              selections: questions['en']?.selections ?? []
            },
            cn: {
              descriptions: questions['cn']?.descriptions ?? [],
              selections: questions['cn']?.selections ?? []
            }
          }
        }).then(() => {
          this.form = getDefaultFormValues()
          this.isEditableQuestions = false
          this.templateQuestionsId = 'fulltimeDefault'

          this.close()
        }).catch(err => {
          console.error(err)
          this.$alert('時間をおいて再度お試しください', '解析対象の追加に失敗しました')
        }).finally(this.toggleLoading)
      } else {
        // 一括追加の場合
        // await Promise.all(
        //   this.talents.map(talent => {

        //   })
        // )
        await Promise.all(
          this.talents.map(talent => companiesCollectionRef.doc(this.companyId).collection('talents').add({
            ...talent,
            deadline: this.form.deadline || defaultDeadline,
            rank: this.form.rank || 'fulltime',
            language: this.form.questionsLang || 'jp',
            status: statusProperty.talentRegistered.key,
            refereeBreakdown: this.form.refereeBreakdown.map(breakdown => ({
              ...breakdown,
              isRelationshipSelectedByCompany: Boolean(breakdown.relationship),
              isTimeWorkingTogetherSelectedByCompany: Boolean(breakdown.timeWorkingTogether)
            })),
            createdAt: new Date(),
            questions: {
              // TODO: 英語の質問が追加された場合は、enのキーに保存したい
              jp: {
                descriptions: this.questions['jp'].descriptions,
                selections: this.questions['jp'].selections
              },
              en: {
                descriptions: this.questions['en'].descriptions,
                selections: this.questions['en'].selections
              },
              cn: {
                descriptions: this.questions['cn'].descriptions,
                selections: this.questions['cn'].selections
              }
            }
          }))
        ).catch(e => {
          console.error(e)
          this.$alert('時間をおいて再度お試しください', '解析対象の追加に失敗しました')
          this.toggleLoading()
        })
        this.form = getDefaultFormValues()
        this.isEditableQuestions = false
        this.templateQuestionsId = 'fulltimeDefault'
        this.toggleLoading()
        this.close()
      }
    }
  }
}
</script>
