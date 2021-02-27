<template>
  <div class="container">
    <RegainTrustSteps />
    <router-view />
  </div>
</template>

<script>

import RegainTrustSteps from '@/components/RegainTrustSteps'
export default {
  name: 'RegainTrustLayout',
  components: { RegainTrustSteps }
}
</script>
