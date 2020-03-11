<template>
  <div class="inputBox-wrp">
    <el-form ref="loginForm" :model="loginForm" label-position="left">
      <!------------------------------ 手机号 -------------------------------->
      <el-form-item prop="phonenum" style="background:#DDDDDD;">
        <el-row>
          <el-col :span="2">
            <span class="svg-container">
              <i class="el-icon-mobile-phone"></i>
            </span>
          </el-col>
          <el-col :span="22">
            <el-input
              ref="phonenum"
              v-model="loginForm.phonenum"
              placeholder="手机号"
              name="phonenum"
              type="text"
              tabindex="1"
              auto-complete="false"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <!------------------------------ 验证码 -------------------------------->
      <el-row  :gutter="20"> 
        <el-col :span="16">
            <el-form-item prop="msgCode" style="background:#DDDDDD;">
            <el-row>
              <el-col :span="3">
                <span class="svg-container">
                  <svg-icon icon-class="email" />
                </span>
              </el-col>
              <el-col :span="21">
                <el-input
                  ref="msgCode"
                  v-model="loginForm.msgCode"
                  type="text"
                  placeholder="验证码"
                  name="msgCode"
                  tabindex="2"
                  auto-complete="false"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <button class="codeBtn" :class="{disable: codeFlag}" @click.prevent.stop="getCode">{{codeFlag?`${countDown} 秒`:'获取验证码'}}</button>
        </el-col>
      </el-row>
    </el-form>
    <div style="width:100%;margin-bottom:30px;" class="btn" @click="handleLogin">
      <i v-show="!loginFlag" class="el-icon-loading" style="color:#fff;fontSize:16px;fontWeight:500;"></i>
      {{type==='2'?'注册':'登录'}}
    </div>
    <p class="loginDes" @click.prevent.stop="switchType">{{type==='2'?'使用已有账户登录':'注册账户'}}</p>
  </div>
</template>

<script>
import { getCode } from '@/myApi/msgLogin';

export default {
  name: 'inputBox',
  props: {
    type: [String, Number],
    loginFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loginForm: {
        phonenum: '',
        msgCode: '',
      },
      countDownTimer: null,
      codeFlag: false,
      countDown: 60,
    }
  },
  mounted() {
    if(this.countDownTimer) clearInterval(this.countDownTimer);
  },
  beforeDestroy() {
    if(this.countDownTimer) clearInterval(this.countDownTimer);
  },
  methods: {
    // 获取验证码
    getCode() {
      if(this.codeFlag) return;
      if(this.loginForm.phonenum && this.telCheck(this.loginForm.phonenum)) {
        getCode({telephone:this.loginForm.phonenum, type: Number(this.type)}).then(res=>{
          const {data} = res;
          if( data && data.code === 200 ) {
            this.$message.success('验证码已发送');
            // 开启倒计时
            this.countDownLoop();
          }
        })
      } else {
        this.$message.error('请输入正确的手机号');
      }
    },
    //验证手机号
    telCheck(str) {
      const pattern = /^1[12345789]\d{9}$/;
      if (pattern.test(str)) {
          return true;
      } else {
          return false;
      }
    },
    // 倒计时
    countDownLoop() {
      this.codeFlag = true;
      this.countDownTimer = setInterval(() => {
        if(this.countDown > 1) {
          this.countDown = this.countDown - 1;
        } else {
          this.codeFlag = false;
          clearInterval(this.countDownTimer);
          this.countDown = 60;
        }
      }, 1000);
    },
    // 切换登录类型
    switchType() {
      this.$emit('switchType', this.type);
    },
    //  登录/注册
    handleLogin() {
      if(!this.telCheck(this.loginForm.phonenum)) {
        this.$message.error('请输入正确的手机号');
        return ;
      }
      if(!this.loginForm.msgCode) {
        this.$message.error('请输入验证码');
        return ;
      }
      this.$emit('submit', {type:this.type, code:this.loginForm.msgCode, telephone:this.loginForm.phonenum})
    },

  }
}
</script>


<style lang="scss">

//$bg:gray;
$bg:#DDDDDD;
$light_gray:#fff;
$cursor:black;

/* reset element-ui css */
.inputBox-wrp {
  .codeBtn {
    outline: 0;
    width: 100%;
    height: 52px;
    border: 1px solid #00CDCD;
    color: #14b1b1;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    &.disable {
      background: #ddd;
      border-color: #ccc;
      color: #555;
      cursor: not-allowed;
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
      color:$cursor;
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
.el-select .el-input{
  width: 100% !important;
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.inputBox-wrp {
  .login-form {
    position: absolute;
    top:  calc(50% - 210px);
    left: calc(50% - 200px);
    width: 480px;
    height: 450px;
    overflow: hidden;
    display: flex;
    .el-form-item__content{
      overflow: hidden;
      .el-select{
        box-sizing: border-box;
        width: calc(100% - 35px);
      }
    }
    .el-button{
      background:#ef8200;
      border-color:#ef8200;
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
    padding : 10px 0 20px 0;
    img{
      width: 300px;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .vercode-wrap{
    display: flex;
    width: 100%;
    .el-form-item{
      flex:1;
    }
    .img-wrap{
      margin-bottom: 22px;
      align-items: center;
      padding-left:15px;
      box-sizing: border-box;
      img{
        height:80%;
        width:auto;
        margin-top:5px;
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

  .btn {
    margin-top: 8px;
    border-radius: 10px;
    background: #00CDCD;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    cursor: pointer;
  }
  .loginDes {
    position: absolute;
    right: 16px;
    bottom: 40px;
    padding: 0;
    margin: 0;
    color: #00bbbb;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
