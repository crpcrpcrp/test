<template>
  <div class="register-container">
    <div class="login-form">
      <div class="right">
        <div class="logo">
          <div class="img">
            <img src="../../assets/logo.png" />
          </div>
          <div class="name">慧管家管理系统</div>
        </div>
        <div class="form-login">
          <CompanySelect @parkSelectChange="parkSelectChange" @apartmentSelectChange="apartmentSelectChange" />
          <!-- 企业选择 -->
          <el-row>
            <el-col :span="2">
              <span class="svg-container">
                <i class="el-icon-edit" />
              </span>
            </el-col>
            <el-col :span="22">
               <el-select
                v-model="companyValue"
                filterable
                :allow-create="companyCreateFlag"
                default-first-option
                placeholder="请输入企业名称"
                @change="companySelectChange">
                <el-option
                  v-for="item in companyNameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
         
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
                tabindex="1"
                auto-complete="false"
              />
            </el-col>
          </el-row>
          <!-- 登录密码 -->
          <el-row>
            <el-col :span="2">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
            </el-col>
            <el-col :span="22">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入登录密码"
                type="password"
                tabindex="1"
                auto-complete="false"
              />
            </el-col>
          </el-row>

        <!-- 注册 -->
        <div style="width:100%;margin-bottom:30px;" class="btn" @click="handleLogin">注册</div>
        <p class="loginDes" @click.prevent.stop="switchType">使用已有账户登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompanySelect from "./components/companySelect";
import { infor } from "@/myApi/login";
import { register } from "@/myApi/msgLogin";
import { setToken, setCookies, removeUserMessage } from "@/utils/auth";

export default {
  name: "Login",
  components: {
    CompanySelect
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      redirect: undefined,
      loginFlag: true,
      companyNameList: [],
      companyValue: '',
      companyCreateFlag: false, // 选择框是否允许新增
      parkId:'',  // 园区id
      apartmentId: '', // 单元楼id
      orgId: null,  // 选择的企业id
      orgName: null, // 新增的企业name
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
    // 跳转登录页
    switchType() {
      this.$router.push({name: 'login'})
    }, 
    // 园区列表选择change
    parkSelectChange() {
      this.companyValue = '';
      this.companyNameList = [];
    },
    // 单元楼列表选择change
    apartmentSelectChange(obj) {
      const { companyNameList, parkId, apartmentId } = obj;
      this.companyValue = '';
      this.companyCreateFlag = true; // 企业可新增

      this.companyNameList = companyNameList;
      this.parkId = parkId || '';
      this.apartmentId = apartmentId || '';
    },
    // 企业名称选择/编辑
    companySelectChange(value) {
      let idFlag = false;
      this.companyNameList.forEach(item=>{
        if(item.value === value) {
          idFlag = true;
        }
      });
      if(idFlag) {
        this.orgId = value.trim();
        this.orgName = null;
      } else {
        this.orgId = null;
        this.orgName = value.trim();
      }
    },

    handleLogin() {
      if(!this.orgId && !this.orgName) {
        this.$message.error('请输入企业名称');
      } else if(!this.loginForm.username.trim()) {
        this.$message.error('请输入登录账号');
      } else if(!this.loginForm.password.trim()) {
        this.$message.error('请输入登录密码');
      } else {
        const params = {...this.loginForm, orgId: this.orgId, orgName: this.orgName };
        this.submitForm(params);
      }
    },

    // 表单提交
    submitForm(value) {
      this.loginFlag = false;
      // 注册
      register(value).then(res => {
          const { data } = res;
          if (data.code === 200) {
            this.$message.success("注册成功");
            setCookies({userRole: 'company'});
            removeUserMessage();
            setToken(data.data.string);
            this.$router.push({ path: this.redirect || "/" });
          } else {
            this.$message.error(data.msg);
          }
          this.loginFlag = true;
        })
        .catch(err => {
          this.loginFlag = true;
          this.$message.error(err);
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
.register-container {
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

.register-container {
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
    height: 576px;
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
