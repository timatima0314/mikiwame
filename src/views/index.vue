<template>
  <div />
</template>

<script>
// admin or client によってリダイレクト先などを振り分ける
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  computed: {
    ...mapGetters(['isAdmin'])
  },
  created() {
    this.$router.push({
      name: this.isAdmin ? 'adminIndex' : 'companyIndex'
    })
  }
}
</script>
