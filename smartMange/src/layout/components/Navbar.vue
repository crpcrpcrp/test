<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <img src="../../assets/user.png" class="user-avatar" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/changePwd">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { constants } from "fs";
import { removeToken, removeTokenHead, getCookieValue } from "@/utils/auth";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    ...mapMutations("user", {
      SET_TOKEN: "SET_TOKEN",
      SET_RIGHTSlIST: "SET_RIGHTSlIST"
    }),
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },

    logout() {
      this.$store
        .dispatch("user/logout")
        .then(res => {
          if (res.data.code == 200) {
            removeToken();
            this.SET_TOKEN("");
            this.SET_RIGHTSlIST([]);
            
            if(getCookieValue('userRole') !== 'parkAdmin') {
              this.$router.push({ path:  "/login" });
            } else {
              this.$router.push({ path:  "/adminLogin" });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .userName {
          box-sizing: border-box;
          position: relative;
          cursor: pointer;
          &:after {
            content: "";
            display: block;
            position: absolute;
            bottom: 10px;
            width: 100%;
            height: 2px;
            left: 0;
            border: 1px solid #aaa;
          }
        }
        .HospitalName {
          &:after {
            content: "";
            display: none;
          }
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
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
