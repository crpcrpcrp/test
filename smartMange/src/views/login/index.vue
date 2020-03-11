<template>
  <div class="login-container" v-loading="loading" :class="{adminLogin: adminFlag}">
    <div class="login-form">
      <div class="left"></div>
      <div class="right">
        <div class="logo">
          <div class="img">
            <img src="../../assets/logo.png" />
          </div>
          <div class="name">{{loginMsg}}</div>
        </div>
        <div class="form-login">
          <el-form ref="loginForm" :model="loginForm" label-position="left">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="请输入登录账号"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password "
                :type="passwordType"
                placeholder="请输入登录密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <div style="display:flex;justify-content:space-between;">
              <el-checkbox v-model="checked" size="mini" class="check">
                <span>记住密码</span>
              </el-checkbox>
              <span class="forgetPwd" @click.prevent.stop="switchLink(adminFlag?'adminRetrievePwd':'retrievePwd')">忘记密码</span>
            </div>
            <div style="width:100%;margin-bottom:30px;" class="btn" @click="handleLogin">登录</div>
            <p class="loginDes" v-if="!adminFlag"  @click.prevent.stop="switchLink('register')">注册账户</p>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { validUsername, valiVercode, valiVerselect } from '@/utils/validate'
import { infor } from "@/myApi/login";
import { mapGetters } from "vuex";
import { setUserMessage, getUserMessage, setCookies, removeCookies } from "@/utils/auth.js";
import { constants } from "fs";
export default {
  name: "Login",
  data() {
    return {
      adminFlag: false,
      loginMsg: '园区企业登录',
      checked: true,
      loginForm: {
        username: "",
        password: "",
        vercode: "0000"
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  computed: {
    ...mapGetters(["username", "selectValue"])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.loginForm = getUserMessage() || {};
    this.initPage();
  },
  methods: {
    initPage() {
      if(this.$route.name === "login") {
        this.loginMsg = '园区企业登录';
      } else {
        this.loginMsg = '园区管理员登录';
        this.adminFlag = true;
      }
    },
    switchLink(routerName) {
      console.log('push', routerName)
      this.$router.push({name: routerName});
    }, 
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    }, //这里的nextTick
    handleLogin() {
      if (!this.loginForm.username) {
        this.$message({
          type: "warning",
          message: "请填写账户名称"
        });
        return;
      }
      if (!this.loginForm.password) {
        this.$message({
          type: "warning",
          message: "请填写账户密码"
        });
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("user/login", {...this.loginForm,type:1}) // type:1 密码登录
        .then(data => {
          //dispatch这里其实派发了store中module中的user下的login
          if (this.checked) {
            setUserMessage(this.loginForm);
          }
          this.$router.push({ path: this.redirect || "/" }); //登陆成功后跳到刚才欲要跳转但被拦截的地址；
          this.loading = false;
          setCookies({userRole: this.adminFlag ? 'parkAdmin': 'company'});
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>


<style lang="scss">
//关于输入框颜色的问题
//输入框的颜色有两个，一个是在style中定义的，一个是-webkit-autofill 的box-shadow属性$bg颜色，两个颜色改成一样的
//输入框中字体的颜色也有两个，一个是login-container .el-input input的color，一个是webkit-autofill中$cursor的颜色,保持一样子

//$bg:gray;
$bg: #dddddd;
$light_gray: #fff;
$cursor: black;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     // color: $cursor;
//     color: black;
//   }
// }

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $cursor;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.03);
    border-radius: 5px;
    color: #454545;
  }
}
.el-select .el-input {
  width: 100% !important;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  background-image: url("../../assets/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  min-height: 100%;
  width: 100%;
  background-size: cover;
  background-color: $bg;
  overflow: hidden;
  position: absolute;
  .login-form {
    position: absolute;
    top: calc(50% - 220px);
    left: calc(50% - 200px);
    width: 480px;
    height: 450px;
    overflow: hidden;
    display: flex;
    .el-form-item__content {
      overflow: hidden;
      .el-select {
        box-sizing: border-box;
        width: calc(100% - 35px);
      }
    }
    .el-button {
      background: #ef8200;
      border-color: #ef8200;
    }
  }
  
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 10px 0 20px 0;
    img {
      width: 300px;
      // height: 70px;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .vercode-wrap {
    display: flex;
    width: 100%;

    .el-form-item {
      flex: 1;
    }
    .img-wrap {
      margin-bottom: 22px;
      // display:flex;
      align-items: center;
      padding-left: 15px;
      box-sizing: border-box;
      // position: relative;

      img {
        height: 80%;
        width: auto;
        margin-top: 5px;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .loginDes {
    position: absolute;
    right: 16px;
    bottom: 30px;
    padding: 0;
    margin: 0;
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
  }
}
/*.left {
   flex: 6;
   background-image:url('../../assets/left.png');
   background-repeat:no-repeat;
   background-size: 100% 100%;
   height: 100%;
   border-radius: 5px;
}*/
.right {
  background: #f6f6f6;
  flex: 5;
  height: 100%;
  border-radius: 5px;
  .form-login {
    margin-top: 25px;
    padding: 0 15px;
    //  .el-form-item__content {
    //    height: 30px;
    //    line-height: 30px;
    //  }
  }
}
.logo {
  margin-top: 50px;
  height: 95px;
  // background: pink;
  .name {
    height: 55px;
    line-height: 55px;
    text-align: center;
    font-size: 18px;
  }
  .img {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 60px;
      width: 60px;
      // border-radius: 50%;
    }
  }
}

.btn {
  margin-top: 10px;
  border-radius: 10px;
  background: #409eff;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  cursor: pointer;
}

.adminLogin .login-form .btn{
  margin-top: 30px;
}

.check {
  span {
    color: gray;
  }
}

.forgetPwd {
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}
</style>
