<template>
  <div
    v-loading.fullscreen.lock="fullScreenLoading"
    class="dashboard-container"
  >
    <el-container style="height: 50vw">
      <el-aside width="370px">
        <div style="display: flex; margin-bottom: 1em">
          <span style="font-size: 1.4rem">質問テンプレート</span>
          <el-button
            type="primary"
            style="margin-left: 1.2em; font-size: 10px"
            size="mini"
            @click="isAddModalOpen = true"
          >
            新規テンプレート追加
          </el-button>
        </div>

        <el-form>
          <el-form-item style="text-align: left; margin-bottom: 10px">
            <el-radio-group v-model="templateType">
              <el-radio
                v-for="(rank, i) in answererRanks"
                :key="i"
                :label="rank.label"
                @change="setDefaultTemplateQuestions"
              >
                {{ rank.text }}用
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <el-input
          v-model="searchText"
          size="mini"
          placeholder="検索"
          suffix-icon="el-icon-search"
          class="search-input"
          style="margin-bottom: 4px"
        />
        <el-divider class="menu-divider" />
        <el-button class="card-button" @click="setDefaultTemplateQuestions()">
          <el-card class="card-default" shadow="never">
            <div class="card-default-name">デフォルトテンプレート</div>
          </el-card>
        </el-button>
        <div v-for="(tmp, i) in filteredTemplateQuestionsList" :key="i">
          <el-divider class="menu-divider" />
          <el-button class="card-button" @click="selectTemplateQuestions(tmp)">
            <el-card
              class="card-templates"
              :body-style="changeSelectedButtonColor(tmp.id)"
              shadow="never"
            >
              <el-tag type="info" size="mini" effect="plain"> 作成日 </el-tag>
              {{ dayjs(tmp.createdAt.toDate()).format("YYYY/MM/DD") }}
              <div class="card-name">{{ tmp.name }}</div>
            </el-card>
          </el-button>
        </div>
      </el-aside>

      <el-container>
        <el-main>
          <el-card>
            <div class="template-name">{{ showingTemplateQuestions.name }}</div>
            <div class="template-buttons">
              <el-button
                v-if="showingTemplateQuestions.id"
                type="success"
                icon="el-icon-edit"
                @click="isEditModalOpen = true"
              >編集する</el-button>
              <el-button
                v-if="showingTemplateQuestions.id"
                type="danger"
                icon="el-icon-deletes"
                @click="removeTemplateQuestions(showingTemplateQuestions)"
              >削除する</el-button>
            </div>
          </el-card>

          <el-card style="margin: 10px 0">
            <el-form>
              <!-- 日本語以外の質問がない場合は表示しない．←英語がなければ -->
              <el-form-item
                v-if="
                  showingTemplateQuestions['en'] &&
                    showingTemplateQuestions['cn']
                "
                label="表示する質問の言語"
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
              <editable-questions
                :questions="
                  showingTemplateQuestions[questionsLang].descriptions
                "
                :is-editable-questions="false"
              />
            </template>
            <template v-else>
              <editable-questions
                :questions="showingTemplateQuestions[questionsLang].selections"
                :is-editable-questions="false"
              />
            </template>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
    <add-edit-template-questions
      :is-modal-open.sync="isAddModalOpen"
      :is-add="true"
    />
    <add-edit-template-questions
      :is-modal-open.sync="isEditModalOpen"
      :template-questions-data="showingTemplateQuestions"
      :is-add="false"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import defaultTo from 'lodash/defaultTo'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { mapGetters } from 'vuex'
import { useCompany, deleteTemplateQuestions } from '@/utils/hooks/firestore'
import EditableQuestions from '@/components/EditableQuestions'
import AddEditTemplateQuestions from '@/components/AddEditTemplateQuestions'
import {
  getDefaultQuestionsByLang,
  getDefaultQuestionsForRookieByLang
} from '@/constants/questions'
import { getAnswererRanks, getQuestionsLangByLang } from '@/constants/options'

export default {
  name: 'TemplateQuestions',
  components: { EditableQuestions, AddEditTemplateQuestions },
  data() {
    return {
      questionsLang: 'jp',
      isAddModalOpen: false,
      isEditModalOpen: false,
      searchText: '',
      listLoading: false,
      fullScreenLoading: false,
      showingTemplateQuestions: {
        name: 'デフォルトテンプレート',
        jp: getDefaultQuestionsByLang('jp'),
        en: getDefaultQuestionsByLang('en'),
        cn: getDefaultQuestionsByLang('cn')
      }, // 表示質問テンプレート
      showingQuestionType: 'descriptions',
      templateQuestionsList: [], // 質問テンプレート群
      templateType: 'fulltime',
      answererRanks: getAnswererRanks(),
      unsubscribe: () => {}
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    filteredTemplateQuestionsList() {
      const categorizedQuestions = this.templateQuestionsList.filter(
        (question) => question.templateType === this.templateType
      )
      return this.searchText
        ? categorizedQuestions.filter((tmp) =>
          JSON.stringify(Object.values(tmp)).includes(this.searchText)
        )
        : categorizedQuestions
    },
    descriptionsLength() {
      return this.showingTemplateQuestions[this.questionsLang].descriptions
        .length
    },
    selectionsLength() {
      return this.showingTemplateQuestions[this.questionsLang].selections
        .length
    },
    options: () => ({
      questionsLang: getQuestionsLangByLang()
    })
  },
  async created() {
    this.listLoading = true
    const { companyDocumentSnapshot } = await useCompany({
      companyId: this.companyId
    })
    const templateQuestionsQuery = companyDocumentSnapshot.ref
      .collection('templateQuestions')
      .orderBy('createdAt', 'asc')
    // マルパク（意味理解せず）
    this.unsubscribe = templateQuestionsQuery.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        switch (change.type) {
          case 'added': // 初回取得時 or データ追加時
            this.templateQuestionsList.unshift({
              ...change.doc.data(),
              id: change.doc.id
            })
            break
          case 'modified':
            Object.assign(
              this.templateQuestionsList.find(
                ({ id }) => id === change.doc.id
              ) || {},
              change.doc.data()
            )
            break
          case 'removed':
            this.templateQuestionsList.splice(
              this.templateQuestionsList
                .map((target) => target.id)
                .indexOf(change.doc.id),
              1
            )
            break
        }
      })
    })
    this.listLoading = false
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    defaultTo,
    get,
    isEmpty,
    dayjs,
    toggleLoading() {
      this.fullScreenLoading = !this.fullScreenLoading
    },
    // 選択した質問テンプレートを表示
    selectTemplateQuestions(tmp) {
      this.questionsLang = 'jp'
      this.showingTemplateQuestions = tmp
    },
    // 選択した質問テンプレートのカードの色を暗めに（
    // TODO: デフォルトテンプレートは暗くならないので，あとあとどうにか
    changeSelectedButtonColor(id) {
      if (id === this.showingTemplateQuestions.id) {
        return { 'background-color': '#e5e5ed' }
      }
    },
    // 表示内容をデフォルトテンプレートにする
    setDefaultTemplateQuestions() {
      this.showingTemplateQuestions = {
        name: 'デフォルトテンプレート',
        jp:
          this.templateType === 'rookie'
            ? getDefaultQuestionsForRookieByLang('jp')
            : getDefaultQuestionsByLang('jp'),
        en:
          this.templateType === 'rookie'
            ? getDefaultQuestionsForRookieByLang('en')
            : getDefaultQuestionsByLang('en'),
        cn:
          this.templateType === 'rookie'
            ? getDefaultQuestionsForRookieByLang('cn')
            : getDefaultQuestionsByLang('cn')
      }
    },
    // 質問テンプレートの削除
    async removeTemplateQuestions(tmp) {
      const confirm = await this.$confirm(
        `質問テンプレート「${tmp.name}」を削除してもよろしいですか`
      ).catch(() => {})
      if (confirm === undefined) return

      deleteTemplateQuestions({
        companyId: this.companyId,
        templateQuestionsId: tmp.id
      })
        .then(() => {
          this.$message({
            message: '削除に成功しました',
            type: 'success'
          })
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$message({
            message:
              '削除に失敗しました。通信環境を確認したうえで再度お試しください。',
            type: 'error'
          })
        })

      this.setDefaultTemplateQuestions()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.dashboard {
  &-container {
    margin: 30px;
    .report-button {
      display: inline-block;
    }
    .el-button--mini {
      padding: 3px 7px !important;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.profile-image {
  width: 32px;
  height: 32px;
  border-radius: 5px;
}
.el-card {
  border-radius: 0;
}
.card {
  &-templates {
    border-style: none;
    &:hover {
      background-color: #e5e5ed;
    }
  }
  &-default {
    border-style: none;
    background-color: #c8e6c8;
  }
  &-header {
    font-size: 12px;
    text-align: left;
    margin-bottom: 10px;
    color: #606266;
  }
  &-name {
    font-weight: bold;
    font-size: 18px;
    margin-top: 5px;
  }
  &-default-name {
    font-weight: bold;
    font-size: 18px;
  }
  &-button {
    margin: 0;
    padding: 0;
    width: 350px;
    border-style: none;
    text-align: left;
    font-family: inherit;
    outline: none;
  }
}
.template {
  &-name {
    font-size: 35px;
    font-weight: bold;
  }
  &-buttons {
    margin-top: 10px;
  }
  &-created-at {
    color: #606266;
  }
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  height: 100%;
  margin: 0 auto;
}
.not-selected {
  &-text {
    margin: 10px 0 20px 0;
    color: #606266;
    font-size: 80%;
  }
  &-card {
    position: absolute;
    text-align: center;
    border: 1px dashed #909399;
    padding: 15px 8px;
    background-color: #e5e5ed;
  }
}
.menu-divider {
  margin: 0;
}
</style>
