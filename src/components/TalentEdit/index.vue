<template>
  <el-dialog
    :title="`${talentData.name}さんの編集画面`"
    :visible="isUpdateModalOpen"
    :before-close="onClose"
    style="text-align: center"
    :width="$mq === 'pc' ? '60%' : '80%'"
    @update:visible="onClose"
  >
    <el-form
      ref="form"
      :label-position="$mq === 'pc' ? 'right' : 'top'"
      :label-width="$mq === 'pc' ? '10rem' : '20rem'"
      :style="$mq === 'pc' ? '' : 'text-align: left'"
      :model="form"
      :disabled="loading"
      :rules="rules"
    >
      <el-form-item label="氏名" prop="name">
        <el-input v-model="form.name" placeholder="候補者" />
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
              <el-input
                v-model="form.phoneNumber"
                placeholder="電話番号を入力してください"
              />
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
        <el-input
          v-model="form.currentCompany"
          placeholder="会社名を入力して下さい"
        />
      </el-form-item>

      <el-form-item
        label="候補者の現在の職種"
        prop="currentJobCategory"
        style="text-align: left"
      >
        <el-cascader
          v-model="form.currentJobCategory"
          :options="options.jobCategoryOptions"
          placeholder="選択してください"
        />
      </el-form-item>

      <el-form-item
        label="応募媒体"
        prop="siteWhereTalentApplied"
        style="text-align: left"
      >
        <el-select
          v-model="form.siteWhereTalentApplied"
          filterable
          placeholder="選択してください"
        >
          <el-option
            v-for="agent in options.appliedSiteOptions"
            :key="agent.value"
            :label="agent.label"
            :value="agent.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="企業担当者" prop="recruitmentOfficer">
        <el-input
          v-model="form.recruitmentOfficer"
          placeholder="企業担当者を入力してください"
        />
      </el-form-item>

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
                :disabled="breakdown.registeredRefereesNum > 0"
              />
            </el-select>
            <el-button
              v-if="form.refereeBreakdown.length > 1"
              type="primary"
              icon="el-icon-close"
              style="float: right"
              circle
              plain
              :disabled="breakdown.registeredRefereesNum > 0"
              @click="deleteRefereeBreakdown(index)"
            />
            <el-input
              v-if="breakdown.relationship === 'other'"
              v-model="breakdown.otherRelationship"
              placeholder="推薦者との関係性を入力してください"
              :disabled="breakdown.registeredRefereesNum > 0"
            />
            <div>
              <el-select
                v-model="breakdown.timeWorkingTogether"
                placeholder="時期"
              >
                <el-option
                  v-for="option in options.timeWorkingOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                  :disabled="breakdown.registeredRefereesNum > 0"
                />
              </el-select>
            </div>
            <el-input
              v-if="breakdown.timeWorkingTogether === 'other'"
              v-model="breakdown.otherTimeWorkingTogether"
              placeholder="一緒に働いた時期を入力してください"
              :disabled="breakdown.registeredRefereesNum > 0"
            />
            <el-input-number
              v-model="breakdown.numberOfPeople"
              :min="
                breakdown.registeredRefereesNum === 0
                  ? 1
                  : breakdown.registeredRefereesNum
              "
              :max="10"
              placeholder="人数"
            />名
          </el-card>
        </div>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          style="float: right"
          @click="addRefereeBreakdown"
          >内訳を追加</el-button
        >
      </el-form-item>

      <el-form-item label="URL" style="display: none">
        <el-input :value="URL" readonly />
      </el-form-item>

      <el-button :loading="loading" @click="onCancelEdit"
        >編集をキャンセル</el-button
      >
      <el-button :loading="loading" type="primary" @click="onSubmit"
        >更新</el-button
      >
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import omit from 'lodash/omit'
import { updateTalent } from '@/utils/hooks/firestore'
import {
  checkDuplicationOfBreakdown,
  calculateRegisteredRefereesNum
} from '@/utils/referee_breakdown'
import {
  getRelationshipOptionsByLang,
  getTimeWorkingOptionsByLang,
  getJobCategoryOptionsByLang,
  getAppliedSiteOptions,
  getQuestionsLangByLang
} from '@/constants/options'
import * as Sentry from '@sentry/vue'

export default {
  name: 'TalentEdit',
  props: {
    isUpdateModalOpen: { type: Boolean, default: false },
    talentData: {
      type: Object,
      default: () => ({
        name: '',
        email: '',
        currentCompany: '', // add
        currentJobCategory: '', // add
        siteWhereTalentApplied: '', // add
        recruitmentOfficer: '', // add
        id: '',
        deadline: new Date(),
        refereeBreakdown: [
          {
            relationship: '',
            isRelationshipSelectedByCompany: false,
            otherRelationship: '', // relationshipがotherの時にのみ有効
            timeWorkingTogether: '',
            isTimeWorkingTogetherSelectedByCompany: false,
            otherTimeWorkingTogether: '', // timeWorkingTogetherがotherの時にのみ有効
            numberOfPeople: 1
          }
        ]
      })
    },
    referees: {
      type: Array,
      default: () => {
        [
          {
            isRelationshipSelectedByCompany: false,
            isTimeWorkingTogetherSelectedByCompany: false,
            relationship: '',
            otherRelationship: '',
            timeWorkingTogether: '',
            otherTimeWorkingTogether: ''
          }
        ]
      }
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      currentCompany: '',
      currentJobCategory: '',
      siteWhereTalentApplied: [],
      recruitmentOfficer: '',
      deadline: null,
      language: 'jp',
      refereeBreakdown: [
        {
          relationship: '',
          isRelationshipSelectedByCompany: false,
          otherRelationship: '', // relationshipがotherの時にのみ有効
          timeWorkingTogether: '',
          isTimeWorkingTogetherSelectedByCompany: false,
          otherTimeWorkingTogether: '', // timeWorkingTogetherがotherの時にのみ有効
          numberOfPeople: 1
        }
      ]
    },
    loading: false,
    willNotify: false
  }),
  computed: {
    ...mapGetters(['companyId']),
    URL() {
      return `talent?company=${this.companyId}&token=${this.talentData.id}`
    },
    rules: () => ({
      name: [
        { required: true, message: '氏名を入力してください', trigger: 'blur' }
      ],
      email: [
        {
          required: true,
          message: 'メールアドレスを入力してください',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: 'メールアドレスの形式が無効です',
          trigger: 'blur'
        }
      ],
      deadline: [
        {
          required: true,
          message: '締め切りを選択してください',
          trigger: 'blur'
        }
      ],
      countryCode: [
        {
          pattern: /(\+[0-9]{1,4})$/,
          message: '国際コードの形式が無効です',
          trigger: 'blur'
        }
      ],
      phoneNumber: [
        {
          pattern: /^[0-9]{9,11}$/,
          message: '9-11桁の半角数字を入力してください',
          trigger: 'blur'
        }
      ],
      currentCompany: [
        {
          required: true,
          message: '会社名を入力して下さい',
          trigger: 'blur'
        }
      ],
      currentJobCategory: [
        { required: true, message: '職種を選択してください', trigger: 'blur' }
      ],
      siteWhereTalentApplied: [
        {
          required: true,
          message: '候補者が応募した媒体を選択してください',
          trigger: 'blur'
        }
      ]
    }),
    options: () => ({
      relationshipOptions: getRelationshipOptionsByLang(),
      timeWorkingOptions: getTimeWorkingOptionsByLang(),
      jobCategoryOptions: getJobCategoryOptionsByLang(),
      appliedSiteOptions: getAppliedSiteOptions(),
      questionsLang: getQuestionsLangByLang()
    })
  },
  watch: {
    isUpdateModalOpen() {
      this.assignDataToForm()
    }
  },
  methods: {
    // propsをそのままdata.form.siteWhereTalentAppliedに代入するとArrayが入りエラーになるのでvalueだけ取り出す。
    talentAppliedChange() {
      const appliedChange = getAppliedSiteOptions().filter(
        talentApplied =>
          talentApplied.value == this.talentData.siteWhereTalentApplied[0]
      )
      return appliedChange[0].value
    },
    assignDataToForm() {
      this.form = {
        ...omit(this.talentData, 'ref'),
        refereeBreakdown: this.talentData.refereeBreakdown.map(breakdown => ({
          ...breakdown,
          registeredRefereesNum: calculateRegisteredRefereesNum(
            this.referees,
            breakdown
          )
        })),
        deadline: this.talentData.deadline?.toDate(),
        siteWhereTalentApplied: this.talentAppliedChange()
      }
    },
    // 推薦者の内訳を追加
    addRefereeBreakdown() {
      this.form.refereeBreakdown.push({
        relationship: '',
        otherRelationship: '', // relationshipがotherの時にのみ有効
        isRelationshipSelectedByCompany: false,
        timeWorkingTogether: '',
        otherTimeWorkingTogether: '', // timeWorkingTogetherがotherの時にのみ有効
        isTimeWorkingTogetherSelectedByCompany: false,
        numberOfPeople: 1,
        registeredRefereesNum: 0
      })
    },
    // 推薦者の内訳を削除
    deleteRefereeBreakdown(index) {
      this.form.refereeBreakdown.splice(index, 1)
    },
    async onSubmit() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) return

      // 推薦者内訳の重複確認
      const isBreakdownDuplicated = checkDuplicationOfBreakdown(
        this.form.refereeBreakdown
      )
      if (isBreakdownDuplicated) {
        return this.$notify({
          title: 'Error',
          message: '推薦者内訳が重複しています。',
          type: 'error'
        })
      }

      this.loading = true
      updateTalent({
        companyId: this.companyId,
        talentId: this.talentData.id,
        data: {
          ...this.form,
          refereeBreakdown: this.form.refereeBreakdown.map(breakdown => ({
            ...omit(breakdown, 'registeredRefereesNum'),
            isRelationshipSelectedByCompany: Boolean(breakdown.relationship),
            isTimeWorkingTogetherSelectedByCompany: Boolean(
              breakdown.timeWorkingTogether
            )
          })),
          siteWhereTalentApplied: [this.form.siteWhereTalentApplied]
        }
      })
        .then(() => {
          this.$message({
            message: '更新に成功しました',
            type: 'success'
          })
        })
        .catch(err => {
          Sentry.captureException(new Error(err))
          this.$message({
            message:
              '更新に失敗しました。通信環境を確認したうえで再度お試しください。',
            type: 'error'
          })
        })
        .finally(this.onUpdateEnd)
    },
    onUpdateEnd() {
      this.willNotify = false
      this.loading = false
    },
    onClose() {
      this.onCancelEdit()
      this.$emit('update:isUpdateModalOpen', false)
    },
    onCancelEdit() {
      this.$emit('update:isUpdateModalOpen', false)
      this.assignDataToForm()
    }
  }
}
</script>

<style lang="sass" scoped>
.icon
  font-size: 1.5em
  margin-top: 4px
</style>
