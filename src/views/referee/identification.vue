<template>
  <div v-loading="loading">
    <el-card>
      <p style="font-weight: bold">{{ refereeI18n.t('message.pleaseUploadProofImage') }}</p>
      <p>{{ refereeI18n.t('message.referenceCheckComplete') }}</p>
      <span style="color: tomato; font-weight: bold">{{ refereeI18n.t('message.presentingExamples') }}</span>
      <div style="padding-left:12px;">
        <p style="line-height:1.7; margin-top: 5px; margin-bottom: 20px;">{{refereeI18n.t('message.hideLicenseNumberAndAddress') }}<br/>{{refereeI18n.t('message.submitProofOfIdentity')}}<br/>{{refereeI18n.t('message.pleaseHelpPreventIdentityTheft')}}</p>
        <el-upload action="" :http-request="upload" accept="image/*" :show-file-list="false">
          <el-button><i class="el-icon-top" />{{ refereeI18n.t('message.uploadPicture') }}</el-button>
        </el-upload>
        <p v-if="uploadedImages.src === null">{{ refereeI18n.t('message.notSelected') }}</p>
        <img v-else :src="uploadedImages.src" class="upload-img" width="400" style="margin: 1rem">
        <div style="text-align: center">
          <el-button @click="onClickBack"><i class="el-icon-back" />{{ refereeI18n.t('message.modifyYourAnswer') }}</el-button>
          <el-button type="primary" :disabled="disableGoNextButton" @click="save">{{ refereeI18n.t('message.registerAndContinue') }}</el-button>
        </div>
      </div>
      <p class="asterisk">{{ refereeI18n.t('message.completelyDeletedAfterCertainPeriod') }}</p>
    </el-card>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { refereePageMixin } from './mixin/refereePageMixin'
import * as Sentry from '@sentry/vue'

const ALREADY_UPLOADED = Symbol('ALREADY_UPLOADED')
const reader = new FileReader()
const storageRef = firebase.storage().ref()
export default {
  name: 'RefereeIdentification',
  mixins: [refereePageMixin],
  data: () => ({
    ids: { company: null, talent: null, referee: null },
    uploadedImages: {
      src: null, // 画像イメージのソース
      file: null // 画像のFileオブジェクト。cloud storageに画像を保存済みの場合はFileオブジェクトではなくALREADY_UPLOADEDを入れる
    },
    dialogVisible: false
  }),
  computed: {
    /**
     * Cloud Storageの保存先
     * identification/companies/:companyId/talents/:talentId/referees/:refereeId
     */
    storagePath() {
      return `identification/companies/${this.ids.company}/talents/${this.ids.talent}/referees/${this.ids.referee}`
    },
    disableGoNextButton() {
      return this.uploadedImages.file === null
    }
  },
  created() {
    this.setup().then(() => {
      const { company, talent, token: referee } = this.$route.query
      this.ids = { company, talent, referee }
      // アップロード済みの名刺を取得
      const ref = storageRef.child(this.storagePath)
      return ref.getDownloadURL().then(url => {
        this.uploadedImages = { src: url, file: ALREADY_UPLOADED }
      }).catch((err) => Sentry.captureException(new Error(err)))
    }).finally(this.toggleLoading)
  },
  methods: {
    /**
     * 名刺をアップロードする処理
     */
    upload({ file }) {
      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      }).then(imageSrc => {
        this.uploadedImages = { src: imageSrc, file }
      }).catch(err => {
        Sentry.captureException(new Error(err))
        this.$notify({ type: 'error', title: 'Error', message: this.refereeI18n.t('message.failedToLoadPhoto') })
      })
    },
    save() {
      this.toggleLoading()
      const { file } = this.uploadedImages
      if (file === ALREADY_UPLOADED) {
        // cloud storageにアップロード済みかつ、ユーザーが選択画像を変更していないとき
        return this.goCompletePage()
      }

      const ref = storageRef.child(this.storagePath)
      ref.put(file).then(() => {
        this.$notify({ type: 'success', title: 'Success', message: this.refereeI18n.t('message.uploadedBusinessCard') })
        this.goCompletePage()
      }).catch(err => {
        Sentry.captureException(new Error(err))
        this.$notify({ type: 'error', title: 'Error', message: this.refereeI18n.t('message.failedToUploadBusinessCard') })
        this.toggleLoading()
      })
    },
    onClickBack() {
      this.$router.push({ name: 'answerDescriptions', query: this.$route.query })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-img {
  @media (max-width: 500px) {
    width: 90%;
  }
}
.asterisk{
  padding-left: 1rem;
  margin-top:50px;
  &::before{
    content:"※";
    margin-left:-1rem;
    font-size: 18px;
    vertical-align:text-bottom;
  }
}
</style>
