<template>
  <el-form
    v-model="form"
    v-loading="loading"
    class="container"
    label-width="9rem"
    :model="form"
    :rules="rules"
  >
    <h1>カード設定</h1>
    <el-form-item prop="cardNumber" label="カード番号">
      <el-input
        :value="form.cardNumber"
        :maxlength="cardNumberInputMaxLength"
        placeholder="1234 1234 1234 1234"
        @input="addSpaceToCardNumber"
      />
    </el-form-item>
    <el-form-item prop="cardNumber" label="カード名義人">
      <el-input
        v-model="form.name"
        :maxlength="cardNumberInputMaxLength"
        placeholder="TARO YAMADA"
      />
    </el-form-item>
    <el-form-item prop="" label="有効期限">
      <el-select v-model="form.expireMonth" placeholder="月">
        <el-option
          v-for="month in months"
          :key="`month${month}`"
          :label="month"
          :value="month"
        />
      </el-select>
      <el-select v-model="form.expireYear" placeholder="年">
        <el-option
          v-for="year in years"
          :key="`year${year}`"
          :label="year"
          :value="year"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="セキュリティコード" prop="securityCode">
      <el-input
        type="number"
        minlength="3"
        maxlength="4"
        placeholder="123"
        style="width: 5rem"
        :value="form.securityCode"
        @input="onInputSecurityCode"
      />
    </el-form-item>
    <Notice :agree.sync="agree" style="margin-bottom: 1rem" />
    <div style="text-align: center">
      <el-button type="primary" :disabled="!agree" @click="onClickSave"
        >登録</el-button
      >
    </div>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import range from "lodash/range";
import { functions } from "@/plugins/firebase";
import { useCompany } from "@/utils/hooks/firestore";
import Notice from "@/views/config/_components/notice";
import { updateCompany } from "@/utils/hooks/firestore";

export default {
  name: "CreditCardInput",
  components: { Notice },
  data: () => ({
    loading: false,
    form: {
      cardNumber: "",
      name: "",
      expireMonth: null,
      expireYear: null,
      securityCode: "",
    },
    agree: false, // 特記事項の同意フラグ
    agreeInDB: false, // DBに保存されている同意フラグ
    tokenizeResult: {},
    cardNumberInputMaxLength: 16 + 3, // 通常のカードは16桁。入力欄では空白3つを加えた16 + 3文字まで
  }),
  computed: {
    ...mapGetters(["companyId"]),
    rules: () => ({
      securityCode: [
        {
          pattern: /^\d{3,4}$/,
          trigger: "blur",
          message: "セキュリティコードは3~4文字で入力してください",
        },
      ],
    }),
    months: () =>
      range(1, 12 + 1).map((month) => String(month).padStart(2, "0")), // e.g. ['01', '02', ...]
    years: () => {
      const thisYear = new Date().getFullYear();
      return range(10).map((add) => add + thisYear); // 10年後までを選択肢にする
    },
    cardObject() {
      return {
        cardno: this.form.cardNumber.replace(/ /g, ""), // 空白を除去
        expire: `${this.form.expireYear}${this.form.expireMonth}`, // YYYYMM
        securitycode: this.form.securityCode,
        holdername: this.form.name,
      };
    },
  },
  async created() {
    const { companyData } = await useCompany({ companyId: this.companyId });
    this.agree = Boolean(companyData.isAgreeToNotice);
    this.agreeInDB = this.agree;
  },
  mounted() {
    // クレジットカードをトークン化するMultipaymentを初期化
    const paymentScript = document.createElement("script");
    paymentScript.src = process.env.VUE_APP_PAYMENT_JS_URL;
    document.body.appendChild(paymentScript);
    /* global Multipayment */
    setTimeout(() => {
      Multipayment.init(process.env.VUE_APP_PAYMENT_JS_APIKEY);
    }, 1000); // scriptタグの読み込みを1秒だけ待つ
  },
  methods: {
    onInputSecurityCode(inputNumber) {
      this.form.securityCode = inputNumber.substring(0, 4); // セキュリティコード4桁まで
    },
    // カード番号の入力に対して、適宜空白を追加する
    // カード会社の違いによる桁数の差も考慮
    // ref) https://github.com/muhammederdem/vue-interactive-paycard/blob/master/src/components/CardForm.vue#L198-L211
    addSpaceToCardNumber(inputString) {
      this.form.cardNumber = inputString;
      const value = this.form.cardNumber.replace(/\D/g, "");
      if (/^3[47]\d{0,13}$/.test(value)) {
        // american express, 15 digits
        this.form.cardNumber = value
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{6})/, "$1 $2 ");
        this.cardNumberMaxLength = 17;
      } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
        // diner's club, 14 digits
        this.form.cardNumber = value
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{6})/, "$1 $2 ");
        this.cardNumberMaxLength = 16;
      } else if (/^\d{0,16}$/.test(value)) {
        // regular cc number, 16 digits
        this.form.cardNumber = value
          .replace(/(\d{4})/, "$1 ")
          .replace(/(\d{4}) (\d{4})/, "$1 $2 ")
          .replace(/(\d{4}) (\d{4}) (\d{4})/, "$1 $2 $3 ");
        this.cardNumberMaxLength = 19;
      }
    },
    async onClickSave() {
      this.loading = true;
      if (!this.agreeInDB && this.agree) {
        // はじめて特記事項に同意した場合、DBのフラグを更新
        updateCompany({
          companyId: this.companyId,
          data: { isAgreeToNotice: true },
        }).catch(() => {});
      }

      try {
        // コールバック関数名を文字列で渡す必要がある。そのため、windowオブジェクトに関数を格納
        window.setTokenizeResult = (result) => {
          this.tokenizeResult = result;
        }; // e.g. tokenizeResult: { resultCode: '000', tokenObject: { token: 'tokentoken', ... } }
        Multipayment.getToken(this.cardObject, "window.setTokenizeResult");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // MultipaymentSDKが代入する処理を待つ。Vue.$nextTickで感知できない。
        const { token, maskedCardNo } = this.tokenizeResult.tokenObject;

        await functions.httpsCallable("createOrUpdateCreditCard")({
          companyId: this.companyId,
          token,
          maskedCardNo,
        });
        this.$notify({
          type: "success",
          title: "Success",
          message: "カードの登録に成功しました",
        });
        this.$router.push({ name: "config" });
      } catch (err) {
        this.$rollbar.error(err.message);
        this.$notify({
          type: "error",
          title: "Error",
          message:
            err.message === "INVALID_CARD"
              ? "入力されたカードが有効ではありません"
              : "カードの登録に失敗しました。通信環境を確認したうえで再度お試しください。",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
