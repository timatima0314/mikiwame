<template>
  <div class="navbar" :style="navbarWidthStyle">
    <div class="navbar-wrapper">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

      <breadcrumb class="breadcrumb-container" />

      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-badge v-if="isAdmin" value="admin">
              <i class="el-icon-user-solid user-avatar" />
            </el-badge>
            <i v-else class="el-icon-user-solid user-avatar" />
            <span style="color: white">{{ displayName }}様</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                Home
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
            <router-link to="/company/accounts">
              <el-dropdown-item divided>
                <span v-if="!isAdmin" type="text">企業担当者一覧</span>
              </el-dropdown-item>
            </router-link>
            <router-link
              :disabled="isSubAccount"
              :event="!isSubAccount ? 'click' : ''"
              to="/company/plan"
            >
              <el-dropdown-item divided :disabled="isSubAccount">
                <span v-if="!isAdmin" type="text">現在のプラン：{{ planStatusText }}</span>
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { PLAN_STATUS_TO_TEXT } from '@/utils/plan_statuses'
import variables from '@/styles/variables.scss'
import { useCompany, useSubAccount } from '@/utils/hooks/firestore'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data: () => ({
    displayName: ''
  }),
  computed: {
    ...mapGetters([
      'sidebar',
      'user',
      'isAdmin',
      'planStatus',
      'isSubAccount',
      'companyId',
      'subAccountId'
    ]),
    planStatusText() {
      return PLAN_STATUS_TO_TEXT[this.planStatus]
    },
    navbarWidthStyle() {
      return `width: calc(100% - ${this.sidebar.opened ? variables.sideBarWidth : '54px'})`
    }
  },
  async created() {
    if (this.isSubAccount) {
      const { subAccountData } = await useSubAccount({ companyId: this.companyId, subAccountId: this.subAccountId })
      this.displayName = subAccountData.name
    } else {
      const { companyData } = await useCompany({ companyId: this.companyId })
      this.displayName = companyData.name
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

$navbar-height: 64px;
.navbar {
  position: fixed;
  z-index: 99;
  min-height: $navbar-height;
  line-height: $navbar-height;
  transition: width 0.28s;
  .navbar-wrapper {
    display: flex;
    background: $backgroundPrimary;
    height: $navbar-height;
  }

  .hamburger-container {
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    height: $navbar-height;
    margin-left: auto;
    justify-content: end;
    padding-left: 1rem;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        cursor: pointer;

        & >>> sup.el-badge__content {
          top: 6px;
          right: 24px;
        }

        .user-avatar {
          font-size: 20px;
          padding: 5px;
          background-color: lightgrey;
          border-radius: 5px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
