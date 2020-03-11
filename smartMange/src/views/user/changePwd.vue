<template>
  <div class="changPwd-wrp">
    <div class="con-wrp">
       <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="300px" class="demo-ruleForm" size="medium">
        <!-- ------------------------------ S 复工信息 ------------------------------------ -->
        <section class="form-box">
          <h3 class="h3-title">修改密码</h3>

          <!-- 旧密码 -->
          <el-form-item label="旧密码：" prop="oldPassword">
            <el-input v-model="ruleForm.oldPassword" type="password" auto-complete="false"></el-input>
          </el-form-item>

          <!-- 新密码 -->
          <el-form-item label="新密码：" prop="newPassword">
            <el-input v-model="ruleForm.newPassword" type="password" auto-complete="false"></el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码：" prop="confirmPwd">
            <el-input v-model="ruleForm.confirmPwd" type="password" auto-complete="false"></el-input>
          </el-form-item>

        </section>

        <section style="padding-left: 466px;">
          <el-button type="primary" @click.prevent.stop="submitForm('ruleForm')">提交</el-button>
          <el-button @click.prevent.stop="resetForm('ruleForm')">重置</el-button>
        </section>
       </el-form>
    </div>
  </div>
</template>

<script>
import { modifyPwd } from "@/myApi/user";
import { removeUserMessage, removeToken, getCookieValue } from '@/utils/auth';

const rules =  {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请输入确认密码', trigger: 'blur' }
  ],
}
export default {
  name:'changPwd',
  data() {
    return {
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        confirmPwd: '',
      },
      rules: {},
    }                                                                                                      
  },
  beforeMount() {
    this.rules = rules;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.ruleForm.newPassword === this.ruleForm.confirmPwd) {
          this.modifyPwd();
        } else if (this.ruleForm.newPassword !== this.ruleForm.confirmPwd) {
          this.$message.error('新密码与确认密码输入不一致');
        } else if(this.ruleForm.newPassword !== this.ruleForm.oldPassword) {
          this.$message.error('新密码不能与旧密码相同');
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async modifyPwd() {
      const {data} = await modifyPwd({...this.ruleForm});
      if(data.success) {
        this.$message.success('密码修改成功'); 
        // 清空本地的用户名密码、token 跳转回登录页重新登录
        removeUserMessage();
        removeToken();
        
        if(getCookieValue('userRole') !== 'parkAdmin') {
          this.$router.push({ path:  "/login" });
        } else {
          this.$router.push({ path:  "/adminLogin" });
        }
      } else {
        this.$message.error(data.msg);
      }
    },
  }
};
</script>


<style lang="scss" scoped>
.changPwd-wrp {
  box-sizing: border-box;
  min-height: calc(100vh - 50px);
  padding: 20px;
  background: #eee;
  display: flex;
  flex-direction:column;
  .line {
    width: 100%;
    height: 1px;
    background: #dfdfdf;
    padding: 0;
    margin: 40px 0 20px;
  }
  .con-wrp {
    box-sizing: border-box;
    flex-grow: 1;
    background: #fff;
    border-radius: 6px;
    padding: 30px 30px;
    .form-box {
      width: 620px;
      .h3-title {
        padding: 40px 0 34px;
        margin: 0;
        font-size: 18px;
        text-indent: 120px;
      }
    }
  }
}
</style>
