<template>
  <div class="container">
    <!-- <div>
       <div class="innerTop">请先进行企业认证</div>
       <div class="innerBottom" @click="solve">去认证</div>
     </div>-->


    <div class="innerContainer">
      <div class="title">
        企业基础信息
      </div>


      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="企业名称：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业注册地址：" prop="name" style="width: 100%;">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业法人：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="企业所在楼：" prop="region">
          <el-select v-model="ruleForm.region" style="width: 100%;" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业所在楼层：" prop="region">
          <el-select v-model="ruleForm.region" style="width: 100%;" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业门牌号：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="企业门牌号：" prop="name">
          <el-upload
            class="avatar-uploader"

            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl"  class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;width: 150px;height: 150px;">
            </i>
          </el-upload>
        </el-form-item>
        <div class="bottomLine">

        </div>



        <div class="title">
          企业员工情况
        </div>

        <el-form-item label="企业所在楼：" prop="region">
          <el-select v-model="ruleForm.region"  placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item  prop="name">
          <el-button type="primary">提交</el-button>
          <el-button >取消</el-button>
        </el-form-item>





      </el-form>
    </div>

  </div>
</template>

<script>
  export default {
    props:{},
    name: 'unPass',
    data() {
      return {

        checked:true,
        required:true,
        imageUrl: '',
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },

      }
    },
    computed:{
      // 弹窗title
      title() {
        return this.isAdd ? "新增" : "修改";
      }
    },
    watch: {
      $route: {

      }
    },
    created() {
    },
    methods: {
      solve(){
        console.log('hello');
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    }
  }
</script>


<style lang="scss" scoped>
  .container{
    .innerTop{
      width: 300px;
      height: 50px;
      border: 1px solid red;
      text-align: center;
      line-height: 50px;
      position: relative;
      left: calc(50% - 150px);
      font-weight: bolder;
      font-size: 28px;
      top: 200px;

    }
    .innerBottom{
      position: relative;
      width: 80px;
      height: 30px;
      line-height: 30px;
      background: #409EFF;
      text-align: center;
      border-radius: 5px;
      left: calc(50% - 40px);
      top: 500px;

    }
    .innerContainer{
      width: 600px;
      position: relative;
      left: calc(20% - 50px);
      top: 20px;

      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }


      .title{
        padding-bottom: 30px;
        font-weight: bolder;

      }
    }
    .bottomLine{
      width: 65vw;
      margin: 50px auto;
      height: 1px;
      background: cyan;
    }

  }


</style>
