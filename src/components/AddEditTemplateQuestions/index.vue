<template>
  <el-dialog
    :title="
      isAdd
        ? '新規テンプレートの追加'
        : '「' + templateQuestionsData.name + '」の編集'
    "
    :visible="isModalOpen"
    style="text-align: center"
    :width="$mq === 'pc' ? '60%' : '80%'"
    @close="close"
  >
    <el-form ref="form" :model="form" :disabled="loading" :rules="rules">
      <el-form-item label="テンプレート名" prop="name">
        <el-input
          v-model="form.name"
          placeholder="質問のテンプレート名を入力してください"
        />
      </el-form-item>
      <el-form-item
        label="テンプレートタイプ"
        style="text-align: left; margin-bottom: 10px"
      >
        <el-radio-group v-model="form.templateType">
          <el-radio
            v-for="(rank, i) in answererRanks"
            :key="i"
            :label="rank.label"
            :disabled="!isAdd"
            @change="adaptQuestionToRank(rank.label)"
          >
            {{ rank.text }}用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="form['en'] && form['cn']"
        label="編集する質問の言語"
        style="text-align: left; margin-bottom: 10px"
      >
        <el-select v-model="questionsLang" placeholder="言語">
          <el-option
            v-for="item in options.questionsLang"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-tabs v-model="showingQuestionType" type="card">
      <el-tab-pane
        label="記述式"
        name="descriptions"
      ><h3>記述式の質問({{ descriptionsLength }}問)</h3></el-tab-pane>
      <el-tab-pane
        label="選択式"
        name="selections"
      ><h3>選択式の質問({{ selectionsLength }}問)</h3></el-tab-pane>
    </el-tabs>

    <template v-if="showingQuestionType === 'descriptions'">
      <el-card>
        <editable-questions
          :questions="
            form[questionsLang] ? form[questionsLang].descriptions : []
          "
          :is-editable-questions="true"
        />
        <h3>独自の質問(必要に応じて追加してください)</h3>
        <el-input
          v-model="newQuestionText"
          type="textarea"
          placeholder="オリジナルの質問を入力してください"
        />
        <el-button
          type="info"
          @click="addDescriptionQuestion"
        >独自の質問を追加する</el-button>
        <el-button
          type="info"
          @click="resetQuestion"
        >質問をもとに戻す</el-button>
      </el-card>
    </template>

    <el-card v-else-if="showingQuestionType === 'selections'">
      <div v-for="(question, i) in form[questionsLang].selections" :key="i">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col><p class="strong font-big" style="text-align: left">
            {{ i + 1 }}. {{ question.text }}
          </p></el-col>
          <el-col
            :span="2"
          ><el-button
            icon="el-icon-lock"
            type="info"
            circle
            disabled
          /></el-col>
        </el-row>
        <hr style="border-style: dashed; color: grey">
      </div>
    </el-card>
    <hr>

    <el-button
      v-if="isAdd"
      type="primary"
      @click="addTemplateQuestions"
    >保存する</el-button>
    <el-button
      v-else
      type="primary"
      @click="editTemplateQuestions"
    >編集内容を保存する</el-button>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import VueMq from 'vue-mq' // PCかモバイルを判断
import cloneDeep from 'lodash/cloneDeep'
import EditableQuestions from '@/components/EditableQuestions'
import {
  getDefaultQuestionsByLang,
  getDefaultQuestionsForRookieByLang
} from '@/constants/questions'
import { companiesCollectionRef } from '@/plugins/firebase'
import { updateTemplateQuestions } from '@/utils/hooks/firestore'
import { getAnswererRanks, getQuestionsLangByLang } from '@/constants/options'
import * as Sentry from '@sentry/vue'

const breakpoints = {
  sp: 800,
  pc: 2000
}

Vue.use(VueMq, { breakpoints })

/*
 * @use <add-target-modal :is-modal-open.sync="isModalOpen" :company-document-ref="companyDocumentRef" />
 */
export default {
  name: 'AddEditTemplateQuestions',
  components: { EditableQuestions },
  props: {
    isModalOpen: { type: Boolean, default: false },
    isAdd: { type: Boolean, default: true },
    templateQuestionsData: {
      type: Object,
      default: () => ({
        name: '',
        jp: getDefaultQuestionsByLang('jp'),
        en: getDefaultQuestionsByLang('en'),
        cn: getDefaultQuestionsByLang('cn'),
        templateType: 'fulltime'
      })
    }
  },
  data() {
    return {
      loading: false,
      questionsLang: 'jp',
      showingQuestionType: 'descriptions',
      newQuestionText: '',
      form: {
        name: '',
        jp: getDefaultQuestionsByLang('jp'),
        en: getDefaultQuestionsByLang('en'),
        cn: getDefaultQuestionsByLang('cn'),
        templateType: 'fulltime'
      },
      answererRanks: getAnswererRanks()
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    descriptionsLength() {
      return this.form[this.questionsLang]?.descriptions.length ?? 0
    },
    selectionsLength() {
      return this.form[this.questionsLang]?.selections.length ?? 0
    },
    rules: () => ({
      name: [
        {
          required: true,
          message: 'テンプレートの名前を入力してください',
          trigger: 'blur'
        }
      ]
    }),
    options: () => ({
      questionsLang: getQuestionsLangByLang()
    })
  },
  watch: {
    isModalOpen() {
      this.templateQuestionsDataToForm() // modalを開く（閉じる）タイミングで
      this.questionsLang = 'jp'
    }
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading
    },
    templateQuestionsDataToForm() {
      this.form = cloneDeep(this.templateQuestionsData)
    },
    close() {
      this.$emit('update:isModalOpen', false)
    },
    // 質問を追加
    addDescriptionQuestion() {
      if (!this.newQuestionText) { return this.$message('質問が入力されていません') }

      this.form[this.questionsLang].descriptions.push({
        key: `original_${new Date().getTime()}`,
        text: this.newQuestionText
      })

      this.newQuestionText = ''
    },
    // 質問を元に戻す
    resetQuestion() {
      if (this.isAdd) {
        this.form[this.questionsLang].descriptions =
          this.form.templateType === 'rookie'
            ? cloneDeep(
              getDefaultQuestionsForRookieByLang(this.questionsLang)
                .descriptions
            )
            : cloneDeep(
              getDefaultQuestionsByLang(this.questionsLang).descriptions
            )
      } else {
        this.form[this.questionsLang].descriptions =
          this.templateQuestionsData[this.questionsLang]?.descriptions ?? []
      }
    },
    adaptQuestionToRank(label) {
      this.form[this.questionsLang] =
        label === 'rookie'
          ? getDefaultQuestionsForRookieByLang(this.questionsLang)
          : getDefaultQuestionsByLang(this.questionsLang)
    },
    // 新規質問テンプレートの追加
    async addTemplateQuestions() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) {
        this.$notify({
          type: 'error',
          title: 'Error',
          message: '入力に不備がございます'
        })
        return
      }

      this.toggleLoading()
      companiesCollectionRef
        .doc(this.companyId)
        .collection('templateQuestions')
        .add({
          createdAt: new Date(),
          name: this.form.name,
          jp: this.form['jp'],
          en: this.form['en'],
          cn: this.form['cn'],
          templateType: this.form.templateType
        })
        .then(async(docRef) => {
          await updateTemplateQuestions({
            companyId: this.companyId,
            templateQuestionsId: docRef.id,
            data: { id: docRef.id }
          })
          this.close()
        })
        .catch((err) => {
          Sentry.captureException(new Error(err))
          this.$alert(
            '通信環境を確認したうえで再度お試しください。',
            '解析対象の追加に失敗しました'
          )
        })
        .finally(this.toggleLoading)
    },
    // 編集した質問テンプレートの保存
    async editTemplateQuestions() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) {
        this.$notify({
          type: 'error',
          title: 'Error',
          message: '入力に不備がございます'
        })
        return
      }

      this.toggleLoading()
      updateTemplateQuestions({
        companyId: this.companyId,
        templateQuestionsId: this.templateQuestionsData.id,
        data: { ...this.form }
      })
        .then(() => {
          this.$message({
            message: '更新に成功しました',
            type: 'success'
          })
          this.close()
        })
        .catch((err) => {
          Sentry.captureException(new Error(err))
          this.$message({
            message:
              '更新に失敗しました。通信環境を確認したうえで再度お試しください。',
            type: 'error'
          })
        })
        .finally(this.toggleLoading)
    }
  }
}
</script>
