<template>
  <div class="retrievePwd-container">
    <div class="login-form">
      <div class="right">
        <div class="logo">
          <div class="img">
            <img src="../../assets/logo.png" />
          </div>
          <div class="name">园区企业账号找回密码</div>
        </div>
        <div class="form-login">
          <!-- 登录账号 -->
          <el-row>
            <el-col :span="2">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
            </el-col>
            <el-col :span="22">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入登录账号"
                type="text"
                auto-complete="false"
              />
            </el-col>
          </el-row>
          <!-- 园区id，企业楼号 -->
          <CompanySelect @parkSelectChange="parkSelectChange" @apartmentSelectChange="apartmentSelectChange" />
          <!-- 请输入新密码 -->
          <el-row>
            <el-col :span="2">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
            </el-col>
            <el-col :span="22">
              <el-input
                v-model="loginForm.newPassword"
                placeholder="请输入新密码"
                type="password"
                auto-complete="false"
              />
            </el-col>
          </el-row>
          <!-- 请再次输入新密码 -->
          <el-row>
            <el-col :span="2">
              <span class="svg-container">
                <i class="el-icon-circle-check" />
              </span>
            </el-col>
            <el-col :span="22">
              <el-input
                v-model="loginForm.confirmPassword"
                placeholder="请再次输入新密码"
                type="password"
                auto-complete="false"
              />
            </el-col>
          </el-row>

        <!-- 注册 -->
        <div style="width:100%;margin-bottom:30px;" class="btn" @click="handleConfirm">确认修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompanySelect from "./components/companySelect";
import { resetPwd } from "@/myApi/login";
import { removeUserMessage } from '@/utils/auth';

export default {
  name: "retrievePwd",
  components: {
    CompanySelect
  },
  data() {
    return {
      loginForm: {
        username: '',
        newPassword: '',
        confirmPassword: '',
      },
      parkId:'',
      buildId: '',
      loginFlag: true,
    };
  },
  mounted() {},
  methods: {
    // 园区下拉框变动
    parkSelectChange(value) {
      this.parkId = value.parkId;
    },
    // 楼号下拉框变动
    apartmentSelectChange(value) {
      this.parkId = value.parkId;
      this.buildId = value.apartmentId;
    },
    handleConfirm() {
      if(!this.loginForm.username) {
        this.$message.error('请输入登录账号');
      } else if(!this.parkId) {
        this.$message.error('请选择企业所在园区');
      } else if (!this.buildId) {
        this.$message.error('请选择企业所在楼号');
      } else if(!this.loginForm.newPassword.trim()) {
        this.$message.error('请输入登录密码');
      } else if(this.loginForm.newPassword.trim() !== this.loginForm.confirmPassword.trim()) {
        this.$message.error('新密码与确认密码输入不一致');
      } else {
        this.submitForm({...this.loginForm, parkId: this.parkId, buildId: this.buildId});
      }
    },
    submitForm(value) {
      this.loginFlag = false;
        // 注册
      resetPwd(value)
        .then(res => {
          const { data } = res;
          if(data.success) {
            this.$message.success('密码修改成功');
            this.$router.push({ path:  "/" });
            // 清空本地存储的 用户名/密码
            removeUserMessage();
          } else {
            this.$message.error(data.msg);
          }

          this.loginFlag = true;
        })
        .catch(err => {
          this.loginFlag = true;
        });
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
.retrievePwd-container {
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

  .el-row{
    display: flex;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.03);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 12px;
  }
  .el-select {
    display: flex;
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

.retrievePwd-container {
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
    top: calc(50% - 290px);
    left: calc(50% - 200px);
    width: 480px;
    height: 550px;
    overflow: hidden;
    display: flex;
    // 注册按钮
    .btn {
      margin-top: 8px;
      border-radius: 10px;
      background: #00cdcd;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: white;
      cursor: pointer;
    }
    .loginDes {
      position: absolute;
      right: 16px;
      bottom: 30px;
      padding: 0;
      margin: 0;
      color: #00bbbb;
      font-size: 14px;
      cursor: pointer;
    }
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
    .svg-container {
      color: #889aa4;
      padding-left: 14px;
      .svg-icon {
        width: 14px;
      }
    }
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
