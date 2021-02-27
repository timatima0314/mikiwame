<template>
  <div v-if="!!id">
    <a :href="link" target="_blank">
      <svg-icon :icon-class="`${service}-logo`" />
      <span style="color: #409eff;">{{ id }}</span>
    </a>
    <br>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

const SNS_TYPE = { type: String, default: null }

/**
 * @use <sns-link service="twitter" id="twitter_id" link="https://..." />
 */
export default {
  name: 'SnsLinkItem',
  components: { SvgIcon },
  props: {
    service: SNS_TYPE,
    id: SNS_TYPE,
    link: SNS_TYPE
  }
}
</script>
