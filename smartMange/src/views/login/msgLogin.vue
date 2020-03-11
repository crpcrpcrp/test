<template>
  <div class="login-container">
    <div class="login-form">
      <div class="right">
        <div class="logo">
          <div class="img">
            <img src="../../assets/logo.png" />
          </div>
          <div class="name">慧管家管理系统</div>
        </div>
        <div class="form-login">
          <el-form ref="loginForm" :model="loginForm" label-position="left">
            <!-- 登录 -->
            <!-- <InputBox
              key="0"
              v-if="typeIndex === 0"
              type="0"
              @switchType="switchType"
              @submit="submitForm"
              :loginFlag="loginFlag"
            /> -->
            <!-- 注册 -->
            <InputBox
              key="2"
              v-if="typeIndex === 2"
              type="2"
              @switchType="switchType"
              @submit="submitForm"
              :loginFlag="loginFlag"
            />
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputBox from "./components/inputBox";
import { infor } from "@/myApi/login";
import { mapGetters } from "vuex";
import { constants } from "fs";
import { login, register } from "@/myApi/msgLogin";
import { setToken } from "@/utils/auth";

export default {
  name: "Login",
  components: {
    InputBox
  },
  data() {
    return {
      typeIndex: 2, // 登录/注册 flag
      loginForm: {
        telephone: "",
        code: ""
      },
      redirect: undefined,
      loginFlag: true
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    // 切换 登录/注册 框展示
    // switchType(value) {
    //   if (Number(value) === 2) {
    //     this.typeIndex = 0;
    //   } else {
    //     this.typeIndex = 2;
    //   }
    //   this.loginFlag = true;
    // },
    // 改版 -- 改为跳转登录页
    switchType() {
      this.$router.push({name: 'login'})
    }, 
    submitForm(value) {
      if (value && value.code) {
        this.loginFlag = false;
        if (Number(value.type) === 0) {
          // 登录
          login(value)
            .then(res => {
              const { data } = res;
              if (data.code === 200) {
                setToken(data.data.string);
                this.$message.success("登录成功");
              } else {
                this.$message.error(data.msg);
              }
              this.loginFlag = true;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(err => {
              this.loginFlag = true;
              this.$message.error(err);
            });
        } else {
          // 注册
          register(value)
            .then(res => {
              const { data } = res;
              if (data.code === 200) {
                setToken(data.data.string);
                this.$message.success("注册成功");
              } else {
                this.$message.error(data.msg);
              }
              this.loginFlag = true;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(err => {
              this.loginFlag = true;
              this.$message.error(err);
            });
        }
        this.loginFlag = true;
      }
    }
  }
};
</script>


<style lang="scss">
//$bg:gray;
$bg: #dddddd;
$light_gray: #fff;
$cursor: black;

/* reset element-ui css */
.login-container {
  .codeBtn {
    outline: 0;
    width: 100%;
    height: 52px;
    border: 1px solid #00cdcd;
    color: #14b1b1;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    &.disable {
      background: #ddd;
      border-color: #ccc;
      color: #555;
    }
  }
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
    background: rgba(0, 0, 0, 0.1);
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
    top: calc(50% - 210px);
    left: calc(50% - 200px);
    width: 480px;
    height: 450px;
    overflow: hidden;
    display: flex;
  }
}
.right {
  background: #f6f6f6;
  flex: 5;
  height: 100%;
  border-radius: 5px;
  .form-login {
    margin-top: 25px;
    padding: 0 15px;
  }
}
.logo {
  margin-top: 50px;
  height: 95px;
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
</style>
