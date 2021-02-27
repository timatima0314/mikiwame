<template>
  <div class="sidebar-logo-container" :class="{collapse}">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <img :src="logoSrc" class="logo">
      </router-link>
    </transition>
  </div>
</template>

<script>
import logo from '@/assets/logo.png'
import collapseLogo from '@/assets/collapse_logo.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    logoSrc() {
      if (this.collapse) return collapseLogo
      else return logo
    }
  }
}
</script>

<style lang="scss" scoped>
$header-height: 64px;
$collapse-logo-height: 40px;
.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  .collapse & {
    width: $collapse-logo-height;
    height: $collapse-logo-height;
    margin-top: ($header-height - $collapse-logo-height) / 2;
  }
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: $header-height;
  line-height: $header-height;
  background: #fff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
