<template>
  <div>
    <sns-link-item v-for="twitterId in twitters" :id="twitterId" :key="`twitter-${twitterId}`" service="twitter" :link="`https://twitter.com/${twitterId}`" />
    <sns-link-item v-for="instagramId in instagrams" :id="instagramId" :key="`instagram-${instagramId}`" service="instagram" :link="`https://www.instagram.com/${instagramId}`" />
    <sns-link-item v-for="tiktokId in tiktoks" :id="tiktokId" :key="`tiktok-${tiktokId}`" service="tiktok" :link="`https://www.tiktok.com/${tiktokId}`" />
    <sns-link-item :id="facebook.name" service="facebook" :link="facebook.link" />
    <sns-link-item :id="line.name" service="line" :link="line.link" />
  </div>
</template>
<script>
import SnsLinkItem from './item'

export default {
  name: 'SnsLink',
  components: { SnsLinkItem },
  props: {
    twitters: { type: Array, default: () => [] },
    instagrams: { type: Array, default: () => [] },
    tiktoks: { type: Array, default: () => [] },
    facebook: { type: Object, default: () => ({ name: '', link: '' }) },
    line: { type: Object, default: () => ({ name: '', link: '' }) }
  }
}
</script>
