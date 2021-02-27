<template>
  <div class="container">
    <el-dialog :visible="urlDialogFlag" :show-close="false" width="30%" center>
      <div style="text-align: center">
        <h3>{{ talentI18n.t('message.copyText') }}<br>
          {{ talentI18n.t('message.tellAndAsk', { honorific: commonI18n.t('message.honorific', { name: selectedRefereeName }) }) }}</h3>
      </div>
      <div style="background-color: #e5e5ed; padding: 0.8em">
        {{ linkToRefereePage }}
      </div>
      <div style="text-align: right; margin-top: 1rem;">
        <el-button type="primary" @click="urlDialogFlag = false">OK</el-button>
      </div>
    </el-dialog>
    <el-card>
      <p v-html="commonI18n.t('message.boldHonorific', { name: talentName })" />
      <p class="thanks">{{ talentI18n.t('message.thankYouForRegistering') }}</p>
      <p>{{ talentI18n.t('message.informationKeptConfidential') }}</p>
      <div>
        <p>
          {{ talentI18n.t('message.requestPageButtonBelow') }}<br>
          {{ talentI18n.t('message.pasteURLToRequest') }}<span style="color: red">{{ talentI18n.t('message.doNotHesitate') }}</span>
        </p>
      </div>
      <div style=" margin-left: auto;margin-right: auto;">
        <el-table :data="undeletedReferees" style="width: 50%; margin-bottom: 1rem">
          <el-table-column :label="commonI18n.t('message.name')" prop="name" />
          <el-table-column :label="talentI18n.t('message.publishButton')">
            <template v-slot="{row}">
              <el-button
                v-clipboard:copy="linkToRefereePage"
                icon="el-icon-copy-document"
                type="primary"
                @click="getURL(row)"
              >{{ talentI18n.t('message.copyURL') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="onClickBack">
          <i class="el-icon-back" />
          {{ talentI18n.t('message.backRegisteringPage') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getI18n } from '@/constants/i18n'

export default {
  name: 'TalentComplete',
  props: {
    language: { type: String, default: 'jp' },
    talentName: { type: String, default: '' },
    companyId: { type: String, default: '' },
    talentId: { type: String, default: '' },
    undeletedReferees: { type: Array, default: null }
  },
  data() {
    return {
      urlDialogFlag: false,
      selectedRefereeName: '',
      linkToRefereePage: '',
      refereeLang: 'jp'
    }
  },
  computed: {
    talentI18n() {
      const i18n = getI18n('talent')
      i18n.locale = this.language
      return i18n
    },
    commonI18n() {
      const i18n = getI18n('common')
      i18n.locale = this.language
      return i18n
    },
    refereeI18n() {
      const i18n = getI18n('referee')
      i18n.locale = this.refereeLang
      return i18n
    }
  },
  methods: {
    getURL(referee) {
      this.urlDialogFlag = true
      this.selectedRefereeName = referee.name
      this.refereeLang = referee.language
      const text = this.refereeI18n.t('message.messageAndURLForReferee', { honorific: this.commonI18n.t('message.honorific', { name: this.talentName }) })
      this.linkToRefereePage = `${text} ${location.origin}/referee/?company=${this.companyId}&talent=${this.talentId}&token=${referee.id}`
    },
    onClickBack() {
      this.$router.push({ name: 'talentAddreferees', query: this.$route.query })
    }
  }
}
</script>

<style lang="sass" scoped>
.thanks
  font-weight: bold
  font-size: 1.2rem
  color: #1a86f5
  text-align: center
</style>

