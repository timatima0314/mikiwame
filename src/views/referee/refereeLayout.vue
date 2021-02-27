<template>
  <div class="container">
    <RefereeSteps
      :is-business-card-required="isBusinessCardRequired"
      :language="language"
      :is-completed="isCompleted"
    />
    <router-view />
  </div>
</template>

<script>
import RefereeSteps from '@/components/RefereeSteps'
import { RefereeApi } from '@/utils/api/referee_api'

export default {
  name: 'RefereeLayout',
  components: { RefereeSteps },
  data() {
    return {
      isBusinessCardRequired: true,
      language: 'jp',
      isCompleted: false
    }
  },
  async created() {
    const { company: companyId, talent: talentId, token: refereeId } = this.$route.query
    try {
      const { isBusinessCardRequired, refereeData } = await RefereeApi({ companyId, talentId, refereeId }).get()
      this.isBusinessCardRequired = isBusinessCardRequired
      this.language = refereeData.language
      this.isCompleted = Boolean(refereeData.completedAt)
    } catch {
      // 何もしない
    }
  }
}
</script>
