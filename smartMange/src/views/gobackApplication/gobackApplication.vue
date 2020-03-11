<template>
  <div class="gobackApplication-box">
    <div class="con-wrp">
      <!-- ------------------------------  S 企业及复工认证状态  ------------------------------------ -->
      <TipsInfo text="请先进行企业认证" buttonText="去认证" @btnClick="goCompanyIdentify"  v-if="companyStatus && companyStatus==='UNAUTH' && !showFormFlag">
        <i class="el-icon-error" style="fontSize:80px; color: #F56C6C"></i>
      </TipsInfo>
      <TipsInfo text="企业认证审核中，请完成认证后再来申请复工" v-if="companyStatus && companyStatus==='AUTH_ING'  && !showFormFlag">
        <i class="el-icon-error" style="fontSize:80px; color: #F56C6C"></i>
      </TipsInfo>
      <TipsInfo text="企业认证未通过，请重新认证" buttonText="去认证" @btnClick="goCompanyIdentify"  v-if="companyStatus && companyStatus==='AUTH_FAILED' && !showFormFlag">
        <i class="el-icon-error" style="fontSize:80px; color: #F56C6C"></i>
      </TipsInfo>
      <TipsInfo text="复工申请已提交，正在审核中" v-if="companyStatus && companyStatus==='AUTH_SUCCESS' && applyStatus && applyStatus==='APPLY_ING' && !showFormFlag">
        <i class="el-icon-success" style="fontSize:80px; color: #67C23A"></i>
      </TipsInfo>
      <TipsInfo text="复工申请审核通过" v-if="companyStatus && companyStatus==='AUTH_SUCCESS' && applyStatus && applyStatus==='APPLY_SUCCESS' && !showFormFlag">
        <i class="el-icon-success" style="fontSize:80px; color: #67C23A"></i>
      </TipsInfo>
      <TipsInfo text="复工申请审核失败" subText="请核对并修改复工信息后，再重新提交" buttonText="返回修改" @btnClick="goApply" v-if="companyStatus && companyStatus==='AUTH_SUCCESS' && applyStatus && applyStatus==='APPLY_FAILED' && !showFormFlag">
        <i class="el-icon-error" style="fontSize:80px; color: #F56C6C"></i>
      </TipsInfo>
      <!-- ------------------------------ E 企业及复工认证状态  ------------------------------------ -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="300px" class="demo-ruleForm" size="medium" v-if="showFormFlag">
        <!-- ------------------------------ S 复工信息 ------------------------------------ -->
        <section class="form-box">
          <h3 class="h3-title">复工信息</h3>
          <!-- 企业名称 -->
          <el-form-item label="企业名称：" prop="name">
            <el-input v-model="ruleForm.name" :disabled="true"></el-input>
          </el-form-item>
          <!-- 统一社会信用代码 -->
          <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
            <el-input v-model="ruleForm.unifiedSocialCreditCode" :disabled="true"></el-input>
          </el-form-item>
          <!-- 活动时间 -->
          <el-form-item label="复工日期：" required>
              <el-form-item prop="resumeDate">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.resumeDate" value-format="yyyy-MM-dd" style="width: 100%;" format="yyyy-MM-dd" ></el-date-picker>
              </el-form-item>
          </el-form-item>
          <!-- 复工人数 -->
          <el-form-item label="复工人数：" prop="resumeCount">
            <el-input-number v-model="ruleForm.resumeCount" @change="handleChange($event,'resumeCount')" :min="0" :max="100000000" controls-position="right"></el-input-number>
          </el-form-item>
          <!-- 非本市人数 -->
          <el-form-item label="非本市人数：" prop="notThisCityCount">
            <el-input-number v-model="ruleForm.notThisCityCount" @change="handleChange($event,'notThisCityCount')" :min="0" :max="100000000" controls-position="right"></el-input-number>
          </el-form-item>
          <!-- 从湖北(含经停)返回人数 -->
          <el-form-item label="从湖北(含经停)返回人数：" prop="hubeiBackCount">
            <el-input-number v-model="ruleForm.hubeiBackCount" @change="handleChange($event,'hubeiBackCount')" :min="0" :max="100000000" controls-position="right"></el-input-number>
          </el-form-item>
        </section>
        <!-- ------------------------------ E 复工信息 ------------------------------------ -->
        <p class="line"></p>
        <!-- ------------------------------ S 申请附件 ------------------------------------ -->
        <section class="form-box">
          <h3 class="h3-title">申请附件</h3>
          <el-form-item label="复工方案：" prop="scheme">
            <Upload ref="file1" @upload="uploadFile" name="scheme" des="支持扩展名：.doc .docx .pdf，文件不大于5M" :supportFileType="supportType1" />
          </el-form-item>
          <el-form-item label="复工职工防疫承诺书：" prop="employeeProtectLetter">
            <Upload ref="file2" @upload="uploadFile" name="employeeProtectLetter" des="支持扩展名：.doc .docx .pdf，文件不大于5M" :supportFileType="supportType1"/>
          </el-form-item>
          <el-form-item label="复工人员情况表：" prop="resumeEmployeeSituation">
            <Upload ref="file3" @upload="uploadFile" name="resumeEmployeeSituation" des="支持扩展名：.xlsx .xls，文件不大于5M" :supportFileType="supportType2"/>
          </el-form-item>
        </section>
        <!-- ------------------------------ E 申请附件 ------------------------------------ -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import TipsInfo from './components/tipsInfo';
import Upload from './components/upload';
import { authCheck, applyCheck, resumeWorkApply } from '@/myApi/gobackApplication';

const rules =  {
  name: [
    { required: true, message: '请输入企业名称', trigger: 'blur' },
    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  unifiedSocialCreditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
  ],
  resumeDate: [
    { type: 'string', required: true, message: '请选择日期', trigger: 'blur' }
  ],
  resumeCount: [
    { required: true, message: '请输入人数', trigger: 'blur' },
  ],
  notThisCityCount: [
    { required: true, message: '请输入人数', trigger: 'blur' },
  ],
  hubeiBackCount: [
    { required: true, message: '请输入人数', trigger: 'blur' },
  ],
  scheme: [
    { required: true, message: '请上传文件', trigger: 'change' },
  ],
  employeeProtectLetter: [
    { required: true, message: '请上传文件', trigger: 'change' },
  ],
  resumeEmployeeSituation: [
    { required: true, message: '请上传文件', trigger: 'change' },
  ]
}
export default {
  name:'gobackApplication',
  components: {
    TipsInfo,
    Upload
  },
  data(){
    return {
      companyStatus: '',  // 企业认证状态      AUTH_ING   待审核   AUTH_SUCCESS   通过   AUTH_FAILED   驳回   UNAUTH   未进行认证
      applyStatus: '',  // 复工申请审核状况
      showFormFlag: false,
      isOrganization: false,
      ruleForm: {
        name: '',
        unifiedSocialCreditCode: '',
        resumeDate: '',
        resumeCount: 0,
        notThisCityCount: 0,
        hubeiBackCount: 0,
        scheme: '',
        employeeProtectLetter: '',
        resumeEmployeeSituation: '',
      },
      defaultDate: '',
      rules: {},
      supportType1: ['pdf', 'document', 'doc', 'docx'],
      supportType2: ['sheet', 'xls', 'xlsx'],
    }
  },
  beforeMount() {
    this.rules = rules;
  },
  mounted() {
    this.authCheck();
    this.applyCheck();
  },
  methods: {
    
    /** AUTH_ING   待审核   AUTH_SUCCESS   通过   AUTH_FAILED   驳回   UNAUTH   未进行认证 **/
    // 企业认证情况
    async authCheck() {
      const {data} = await authCheck();
      if(data && data.code === 200) {
        this.companyStatus = data.data.status;
      }
    },
    // 复工审核情况
    async applyCheck() {
      const {data} = await applyCheck();
      if(data && data.code === 200) {
        this.applyStatus = data.data.status;
        if(this.applyStatus === 'UNAUTH') {
          this.companyStatus = 'UNAUTH';
        } else if(this.applyStatus === 'UNAPPLY') {
          this.showFormFlag = true;
        }
        this.ruleForm.name = data.data.name;
        this.ruleForm.unifiedSocialCreditCode = data.data.unifiedSocialCreditCode;
      }
    },
    // 企业认证
    goCompanyIdentify() {
      // console.log('去企业认证')
      this.$router.push({name: 'permissionPage'});
    },
    // 复工重申请
    goApply() {
      this.showFormFlag = true;
    },
    handleChange(value, formKey) {
      // console.log(value,formKey);
      this.ruleForm[formKey] = value;
    },
    // 文件上传
    uploadFile(obj) {
      this.ruleForm[obj.name] = obj.str;
      if(obj && obj.name && obj.str) {
        this.$refs['ruleForm'].clearValidate(obj.name); // 移除校验
      }
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resumeWorkApply(this.ruleForm).then(res=>{
            const { data } = res;
            if(data && data.code === 200) {
              this.$message.success('申请信息提交成功');
              this.applyStatus = 'APPLY_ING';
              this.showFormFlag = false;
            } else {
              this.$message.error(data.msg);
            }
          }).catch((err)=>{
            this.$message.error(err);
          })
        } else {
          console.log('error submit!!');
          // 附件未上传完整
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this['ruleForm'].resumeDate = '';
      this['ruleForm'].resumeCount = 0;
      this['ruleForm'].notThisCityCount = 0;
      this['ruleForm'].hubeiBackCount = 0;
      this.$refs['file1'].resetFileList();
      this.$refs['file2'].resetFileList();
      this.$refs['file3'].resetFileList();
      // clearValidate
      this.$refs[formName].clearValidate();
    }
  },
}
</script>
<style lang="scss" scoped>
  .gobackApplication-box {
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
<style lang="scss">
  .gobackApplication-box {
    .con-wrp {
      .form-box {
        .el-form-item__content {
          .el-input-number {
            width: 130px;
          }
        }
      }
    }
  }
</style>
