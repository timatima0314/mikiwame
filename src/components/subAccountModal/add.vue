<template>
  <el-dialog
    title="企業担当者の追加"
    :visible="isModalOpen"
    :before-close="handleClose"
    style="text-align: center"
    :width="$mq === 'pc' ? '60%' : '80%'"
    @close="close"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      :disabled="loading"
      :label-position="$mq === 'pc' ? 'right' : 'top'"
      :label-width="$mq === 'pc' ? '10rem' : '20rem'"
      :style="$mq === 'pc' ? '' : 'text-align: left'"
    >
      <el-form-item label="氏名" prop="name">
        <el-input v-model="form.name" placeholder="山田太郎" />
      </el-form-item>

      <el-form-item label="メールアドレス" prop="email">
        <el-input v-model="form.email" placeholder="info@mikiwame-p.jp" />
      </el-form-item>

      <el-form-item label="部署名" prop="department">
        <el-input v-model="form.department" placeholder="人事部" />
      </el-form-item>

      <el-button type="primary" @click="addSubAccount">送信する</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { functions, companiesCollectionRef } from "@/plugins/firebase";

const getDefaultFormValues = () => ({
  name: "",
  email: "",
  department: "",
});

export default {
  name: "AddSubAccountModal",
  props: {
    isModalOpen: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
      form: getDefaultFormValues(),
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
    rules: () => ({
      name: [
        { required: true, message: "氏名を入力してください", trigger: "blur" },
      ],
      email: [
        {
          required: true,
          message: "メールアドレスを入力してください",
          trigger: "blur",
        },
        {
          type: "email",
          message: "メールアドレスの形式が無効です",
          trigger: "blur",
        },
      ],
      department: [
        {
          required: true,
          message: "部署名を入力してください",
          trigger: "blur",
        },
      ],
    }),
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
    },
    close() {
      this.$emit("update:isModalOpen", false);
    },
    // ×ボタンかモーダルの外がクリックされた場合
    handleClose(done) {
      this.$confirm("企業担当者の追加を中断しますか?")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    async addSubAccount() {
      const valid = await this.$refs.form.validate().catch(() => {});
      if (!valid) return;

      this.toggleLoading();
      const subAccountRef = await companiesCollectionRef
        .doc(this.companyId)
        .collection("subAccounts");
      const snap = await subAccountRef
        .where("email", "==", this.form.email)
        .get();
      if (!snap.empty) {
        this.$notify({
          type: "error",
          title: "Error",
          message:
            "ご入力されたメールアドレスは既に使用されております。他のメールアドレスをご入力ください。",
        });
        this.toggleLoading();
        return;
      }
      const newSubAccountData = await subAccountRef
        .add({ ...this.form, createdAt: new Date() })
        .catch((err) => {
          this.$rollbar.error(err);
          this.$notify({
            type: "error",
            title: "Error",
            message:
              "ネットワークエラーが発生しました。通信環境を確認したうえで再度お試しください。",
          });
          this.toggleLoading();
          this.close();
          throw Error(err);
        });
      functions
        .httpsCallable("notifySubAccountToSetPassword")({
          companyId: this.companyId,
          subAccountId: newSubAccountData.id,
        })
        .then(() => {
          this.$notify({
            title: "Success",
            message:
              "企業担当者の追加に成功しました。パスワード設定メールを指定のメールアドレスに送信しました。",
            type: "success",
          });
          this.form = getDefaultFormValues();
        })
        .catch(() => {
          this.$notify({
            type: "error",
            title: "Error",
            message:
              "ネットワークエラーが発生しました。通信環境を確認したうえで再度お試しください。",
          });
        })
        .finally(() => {
          this.toggleLoading();
          this.close();
        });
    },
  },
};
</script>
