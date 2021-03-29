<template>
  <div>
    <h3>反社チェック</h3>
    <div v-if="paperClipCount >= 0 || webClipCount >= 0">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-card class="card card-paper">
            <span class="title title-paper"
              ><i class="el-icon-reading" /> 新聞</span
            >
            <div class="num">{{ paperClipCount }}件</div>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card class="card card-web">
            <span class="title title-web"
              ><i class="el-icon-monitor" /> web</span
            >
            <div class="num">{{ webClipCount }}件</div>
          </el-card>
        </el-col>
      </el-row>
      <div
        v-if="paperClipCount >= 1 || webClipCount >= 1"
        style="margin-left: 18px"
      >
        <el-button
          plain
          :loading="loading"
          type="primary"
          icon="el-icon-document"
          @click="openClipListPage"
        >
          記事一覧
        </el-button>
        <p style="font-size: 0.8rem">
          ※推奨ブラウザ：Chrome,Firefox（現段階ではこちらを推奨します）
        </p>
        <p style="font-weight: bold; font-size: 1.3rem">
          記事一覧表示用ID: {{ riskEyesId }}
        </p>
      </div>
      <iframe :src="riskEyesUrl" style="width: 100%; display: none" />
    </div>
    <div v-else>
      <el-popover placement="right" width="350" trigger="hover">
        候補者の名前が含まれる記事の件数を取得します。<br />
        一件以上ヒットした場合、ヒットした記事の一覧を確認することができます。<br />
        <el-button
          slot="reference"
          :loading="loading"
          style="margin-top: 5px"
          @click="onClickGetClipCount"
        >
          件数取得
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import get from "lodash/get";
import { functions } from "@/plugins/firebase";

export default {
  name: "RiskCheck",
  props: {
    talentData: {
      type: Object,
      default: () => ({
        name: "",
        email: "",
        id: "",
        deadline: new Date(),
      }),
    },
    riskEyesId: { type: String, default: "" },
  },
  data: () => ({
    loading: false,
    paperClipCount: null,
    webClipCount: null,
    riskEyesUrl: "",
  }),
  computed: {
    ...mapGetters(["companyId"]),
  },
  watch: {
    talentData() {
      this.paperClipCount = get(this.talentData, "riskCheck.paperClipCount");
      this.webClipCount = get(this.talentData, "riskCheck.webClipCount");
    },
  },
  created() {
    this.paperClipCount = get(this.talentData, "riskCheck.paperClipCount");
    this.webClipCount = get(this.talentData, "riskCheck.webClipCount");
  },
  methods: {
    get,
    onClickGetClipCount() {
      this.loading = true;
      const { id: talentId } = this.talentData;
      functions
        .httpsCallable("fetchAndSaveRiskCheck")({
          companyId: this.companyId,
          talentId,
        })
        .then((response) => {
          this.paperClipCount = response.data.paperClipCount;
          this.webClipCount = response.data.webClipCount;
        })
        .catch((err) => {
          this.$rollbar.error(err);
          if (err.code === "permission-denied") {
            this.$notify({
              type: "error",
              title: "Error",
              message: "反社チェックIDが設定されていません",
            });
          } else {
            this.$notify({
              type: "error",
              title: "Error",
              message:
                "記事件数の取得に失敗しました。通信環境を確認したうえで再度お試しください。",
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openClipListPage() {
      this.loading = true;
      const { name } = this.talentData;
      functions
        .httpsCallable("getRiskCheckResultUrl")({ talentName: name })
        .then((response) => {
          this.riskEyesUrl = response.data.resultUrl;
          window.open(response.data.resultUrl);
        })
        .catch((err) => {
          this.$rollbar.error(err);
          this.$notify({
            type: "error",
            title: "Error",
            message:
              "記事のURLの取得に失敗しました。通信環境を確認したうえで再度お試しください。",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: bold;
  border-radius: 5px;
  padding: 5px;
  &-paper {
    background-color: #99a3a4;
  }
  &-web {
    background-color: #bad4ff;
  }
}
.num {
  font-size: 35px;
  font-weight: bold;
  margin-top: 15px;
}
.card {
  margin: 0 15px 15px 15px;
  text-align: center;
  border-radius: 8px;
  color: #fff;
  &-paper {
    background-color: #717d7e;
  }
  &-web {
    background-color: #99b4df;
  }
}
</style>
