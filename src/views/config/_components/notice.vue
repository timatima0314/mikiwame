<template>
  <div class="wrapper">
    <p class="text-center">特記事項</p>
    <ul>
      <li>有料プランの契約期間は当初6ヶ⽉間、その後1年単位の⾃動更新とし、契約期間満了の1ヶ⽉前までに書⾯または電磁的⽅法により継続停⽌⼿続きを⾏わない限り、さらに1年間⾃動的に延⻑されることに同意します。</li>
      <li>本サービスを⽉の途中からご利⽤いただく場合でも、⽇割計算は⾏いません。⽉額料⾦満額を⽀払うことに同意します。</li>
      <li>有料プランの契約が終了した場合または本サービスを解約した場合、理由の如何を問わず、有料プランの契約期間満了までの料⾦を⽀払うことに同意します。</li>
      <li>本サービスの実際の利⽤の有無に関わらず、有料プランの契約期間中は利⽤料⾦がかかることに同意します。</li>
      <li>以下の⽀払条件に同意します。<br>⽀払サイト：当⽉末締/翌⽉末払 、⽀払⽅法：クレジットカード</li>
    </ul>
    <div class="agree-checkbox text-center">
      <el-checkbox :value="agree" @change="$emit('update:agree', $event)">上記同意致します。</el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfigNotice',
  props: {
    agree: { type: Boolean, required: true }
  }
}
</script>

<style lang="sass" scoped>
.wrapper
  padding: 1rem
  line-height: 1.1rem
  background-color: darken(white, 5%)
  font-size: .9rem

  li + li
    margin-top: 1rem

  .agree-checkbox
    transform: scale(1.2)
  .text-center
    text-align: center
</style>
