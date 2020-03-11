<template>
  <div class="container">
    <div v-if="this.flag">
      <result :type="type" :title="title" :desc="desc" :btn="btn"/>
    </div>

    <div class="innerContainer" v-if="this.flag1">
      <div class="title">企业基础信息</div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="企业名称：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode" style="width: 100%;">
          <el-input v-model="ruleForm.unifiedSocialCreditCode"></el-input>
        </el-form-item>
        <el-form-item label="企业注册地址：" prop="registerAddress" style="width: 100%;">
          <el-input v-model="ruleForm.registerAddress"></el-input>
        </el-form-item>
        <el-form-item label="企业法人：" prop="legalPerson">
          <el-input v-model="ruleForm.legalPerson"></el-input>
        </el-form-item>

        <el-form-item label="园区地址：" prop="apartmentId">
          <el-select
            v-model="selectId"
            :placeholder="selectId"
            @change="solve(selectId)"
            class="item-select"
          >
            <el-option
              v-for="ite in selectlist"
              :key="ite.value"
              :label="ite.label"
              :value="ite.value"
            ></el-option>
          </el-select>
          <el-select v-model="apartmentId" :placeholder="apartmentId" class="item-select">
            <el-option v-for="ite in lists" :key="ite.value" :label="ite.label" :value="ite.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层：" prop="name">
          <el-input v-model="floor"></el-input>
        </el-form-item>

        <el-form-item label="门牌号：" prop="name">
          <el-input v-model="numberPlate"></el-input>
        </el-form-item>

        <el-form-item label="上传营业执照：" prop="name">
          <!-- <el-upload
             class="avatar-uploader"

             :show-file-list="false"
             :on-success="handleAvatarSuccess"
             :before-upload="beforeAvatarUpload"
           >
             <img v-if="imageUrl" :src="imageUrl"  class="avatar">
             <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9">

             </i>
             <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>-->

          <el-upload
            class="avatar-uploader"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :on-change="handleList"
            action="string"
            :http-request="uploadFilePer"
            :file-list="fileList"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过3MB</div>
          </el-upload>
        </el-form-item>
        <div class="bottomLine"></div>

        <div class="title">企业员工情况</div>

        <el-form-item label="企业员工人数：" prop="employeeCount">
          <el-input-number
            v-model="ruleForm.employeeCount"
            controls-position="right"
            @change="handleChange"
            :min="1"
            :max="1000000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="联系人：" prop="contactName">
          <el-input v-model="ruleForm.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机：" prop="contactPhone">
          <el-input v-model="ruleForm.contactPhone"></el-input>
        </el-form-item>
        、
        <div v-if="this.flag3">
          <div class="bottomLine"></div>

          <div class="title">申诉信息</div>

          <el-form-item label="申诉理由（选填）：">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入申诉理由"
              v-model="ruleForm.appealReason" ></el-input>
          </el-form-item>

        </div>




        <el-form-item prop="name">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>

    <div class="middleContainer" v-if="this.flag2">
      <div>
        <div class="innerTop">
          <i class="el-icon-success"></i>
        </div>
        <div class="innerBottom">企业信息认证通过</div>
      </div>
      <div class="title">企业基础信息</div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="企业名称:" style="width: 30%;">
          <span>{{this.list.name||''}}</span>
        </el-form-item>
        <el-form-item label="注册地址:" style="width: 30%;">
          <span>{{this.list.registerAddress||''}}</span>
        </el-form-item>
        <el-form-item label="企业法人:" style="width: 30%;">
          <span>{{this.list.legalPerson||''}}</span>
        </el-form-item>
        <el-form-item label="园区地址:" style="width: 30%;">
          <span>{{this.list.addressInPark||''}}</span>
        </el-form-item>
      </el-form>
    </div>

    <div class="bottomContainer" v-if="this.flag2">
      <div class="bottomLine"></div>
      <div class="title">企业员工情况</div>

      <el-form
        :model="list"
        :rules="ruleList"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="企业员工人数：" prop="employeeCount">
          <el-input-number
            v-model="list.employeeCount"
            controls-position="right"
            @change="handleChange"
            :min="1"
            :max="1000000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="联系人：" prop="contactName">
          <el-input v-model="list.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机：" prop="contactPhone">
          <el-input v-model="list.contactPhone"></el-input>
        </el-form-item>

        <el-form-item prop="name">
          <el-button type="primary" @click="submitForms('list')">提交</el-button>
          <el-button @click="resetForms('list')">取消</el-button>
        </el-form-item>
      </el-form>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
  </div>
</template>

<script>
  import result from "@/views/result.vue";
  import {
    getList,
    postList,
    changeUser,
    uploadFile,
    selectList,
    selectLists
  } from "@/myApi/permission/permissionPage";

  export default {
    name: "Login",
    components: {
      result
    },
    data() {
      return {
        flag: false, //审核中和认证失败
        flag1: false, //企业信息没有认证
        flag2: false, //企业信息认证通过
        flag3: false,
        list: {},
        lists: [],
        selectId: "1",
        numberPlate: "",
        apartmentId: "",
        floor: "",
        ruleList: {
          employeeCount: [
            {required: true, message: "请输入企业员工人数", trigger: "blur"}
          ],
          contactPhone: [
            {required: true, message: "请输入联系人手机", trigger: "blur"}
          ],
          contactName: [
            {
              type: "date",
              required: true,
              message: "请输入联系人",
              trigger: "blur"
            }
          ]
        },

        type: 2,

        checked: true,
        required: true,
        imageUrl: "",
        fileList: [],
        selectlist: [],
        ruleForm: {
          name: "",
          contactName: "",
          businessLicense: "",
          contactPhone: "",
          employeeCount: "",
          floor: "",
          legalPerson: "",
          registerAddress: "",
          unifiedSocialCreditCode: "",
          numberPlate: "",
          apartmentId: "",
          appealReason: '',
        },
        rules: {
          businessLicense: [
            {required: true, message: "请上传营业执照照片", trigger: "blur"}
          ],
          contactName: [
            {required: true, message: "请输入企业联系人姓名", trigger: "blur"}
          ],
          contactPhone: [
            {required: true, message: "请输入企业联系人手机号", trigger: "blur"}
          ],
          employeeCount: [
            {required: true, message: "请输入员工人数", trigger: "blur"}
          ],
          legalPerson: [
            {required: true, message: "请输入企业法人", trigger: "blur"}
          ],
          name: [{required: true, message: "请输入企业名称", trigger: "blur"}],
          registerAddress: [
            {required: true, message: "请输入注册地址", trigger: "blur"}
          ],
          unifiedSocialCreditCode: [
            {required: true, message: "请输入统一社会信用代码", trigger: "blur"}
          ],
          floor: [{required: true, message: "请输入楼层", trigger: "blur"}],
          numberPlate: [
            {required: true, message: "请输入门牌号", trigger: "blur"}
          ],
          apartmentId: [
            {required: true, message: "请输入园区单元", trigger: "blur"}
          ]
        }
      };
    },
    computed: {
      // 弹窗title
      title() {
        return this.type === 1
          ? "企业信息已提交，认证审核中"
          : "企业信息认证失败";
      },
      desc() {
        return this.type === 1 ? "" : "请核对并修改企业信息后，再重新提交。";
      },
      btn() {
        return this.type === 1
          ? null
          : {
            title: "返回修改",
            do: () => {
              this.flag1 = true;
              this.flag = false;
              this.flag2 = false;
              this.flag3 = true;
            }
          };
      }
    },
    watch: {
      $route: {}
    },
    created() {
      this.handleChange();

      selectList().then(res => {
        let data = res.data || [];
        let dataList = data.data || [];
        this.selectlist = dataList.list || [];
      });

      const token = 111;
      let id = 1;
      getList({headers: {token}}).then(res => {
        let data = res.data || [];
        let dataList = data.data || [];
        let status = dataList.status || "";

        this.list = dataList.organizationInfoVO || {};
        this.ruleForm = dataList.organizationInfoVO || {};
        let datas = dataList.organizationInfoVO || {};
        id = this.ruleForm.id;

        let params = {
          parkId: id
        };

        selectLists(params).then(res => {
          let data = res.data || [];
          let dataList = data.data || [];
          this.lists = dataList.list || [];
        });

        console.log(this.ruleForm);
        console.log("这是ruleForm");

        this.imageUrl = datas.businessLicense;

        if (datas.addressInParkList) {
          this.apartmentId = "" + datas.addressInParkList[0].apartmentId || "";
          this.floor = datas.addressInParkList[0].floor || "";
          this.numberPlate = datas.addressInParkList[0].numberPlate || "";

          this.ruleForm.apartmentId =
            "" + datas.addressInParkList[0].apartmentId || "";
          this.ruleForm.floor = datas.addressInParkList[0].floor || "";
          this.ruleForm.numberPlate =
            datas.addressInParkList[0].numberPlate || "";
        }

        switch (status) {
          case "AUTH_SUCCESS":
            return (this.flag2 = true);

          case "AUTH_FAILED":
            this.flag = true;
            this.flag3 = true;
            this.type = 2;
            break;
          case "AUTH_ING":
            this.flag = true;
            this.type = 1;
            break;

          case "UNAUTH":
            this.flag1 = true;
            break;
        }
      });
    },
    methods: {
      solve(e) {
        let params = {
          parkId: e
        };
        this.apartmentId = "";

        selectLists(params).then(res => {
          let data = res.data || [];
          let dataList = data.data || [];
          this.lists = dataList.list || [];
        });
      },
      handleChange: async () => {
        let data = {
          token: 111
        };
        let res = await postList(data);
      },
      submitForm(formName) {
        this.ruleForm.businessLicense = this.imageUrl;
        this.ruleForm.parkId = this.selectId;
        //this.ruleForm.parkId = 1;
        this.ruleForm.addressInParkList = [
          {
            apartmentId: this.apartmentId,
            floor: this.floor,
            numberPlate: this.numberPlate
          }
        ];

        let data = {
          ...this.ruleForm
        };
        postList(data).then(res => {
          let data = res.data || [];
          if (data.success) {
            this.flag = true;
            this.type = 1;
            this.flag1 = false;
            this.flag2 = false;
            this.$message.success(data.msg);
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      submitForms(formName) {
        let params = {
          ...this.list
        };
        changeUser(params).then(res => {
          let data = res.data || [];
          if (data.success) {
            this.$message.success(data.msg);
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      resetForms(formName) {
        this.$refs[formName].resetFields();
      },

      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isPNG = file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 3;
        if (!isJPG && !isPNG) {
          this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
          return false;
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 3MB!");
          return false;
        }
        return true;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.$emit("upload", {name: this.name, str: ""});
      },
      handlePreview(file) {
        console.log(file);
      },
      handleList(file, fileList) {
        this.fileList = fileList.slice(-1);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      /** 文件上传 **/
      async uploadFilePer(item) {
        console.log(item.file, "file item");
        // 发起上传请求
        const formData = new FormData();
        formData.append("file", item.file);
        uploadFile(formData)
          .then(res => {
            const {data} = res;

            if (data.code === 200) {
              this.$emit("upload", {name: this.name, str: data.data.string});
              this.imageUrl = data.data.string;
            } else {
              this.fileList.splice(0, this.fileList.length);
            }
          })
          .catch(res => {
            this.$message.error(res.message);
            this.fileList.splice(0, this.fileList.length);
            this.$emit("upload", {name: this.name, str: ""});
          });
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 3;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 3MB!");
        }
        return false;
      }
    }
  };
</script>


<style lang="scss" scoped>
  .container {
    .innerTop {
      width: 100px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      position: relative;
      left: calc(50% - 50px);
      font-weight: bolder;
      font-size: 28px;
      top: 20px;
    }

    .innerBottom {
      position: relative;
      width: 600px;
      height: 30px;
      line-height: 30px;
      font-weight: bolder;
      font-size: 32px;
      text-align: center;
      border-radius: 5px;
      left: calc(50% - 300px);
      top: 80px;
    }

    .innerContainer {
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
        border-color: #409eff;
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

      .title {
        padding-bottom: 30px;
        font-weight: bolder;
      }
    }

    .bottomLine {
      width: 65vw;
      margin: 20px auto;
      height: 1px;
      background: cyan;
    }

    .middleContainer {
      width: 70vw;
      position: relative;
      left: calc(20% - 50px);
      top: 20px;

      .el-icon-success {
        font-size: 80px;
        color: #52c41a;
      }

      .title {
        padding-bottom: 30px;
        margin-top: 120px;
        font-weight: bolder;
      }
    }

    .bottomContainer {
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
        border-color: #409eff;
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

      .title {
        padding-bottom: 30px;
        font-weight: bolder;
      }
    }
  }
</style>
