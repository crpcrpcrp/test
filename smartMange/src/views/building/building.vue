<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">
       <common-form inline :formLable='formLable' :form='form' >
          <el-form-item >
            <el-button type='primary' @click="search">查询</el-button>
          </el-form-item>
           <el-form-item >
            <el-button  @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item >
            <el-button type='primary' @click="add">+新增</el-button>
          </el-form-item>
          <el-form-item >
            <el-button  @click="downLoad">导出数据</el-button>
          </el-form-item>
          <el-form-item >
            <el-button  @click="downLoadDefault">导出模版</el-button>
          </el-form-item>
          <el-form-item >
            <el-upload
              class="upload-demo"
              ref="upload"
              :headers='headers'
              action="string"
              accept='.xlsx'
              :show-file-list="false"
              :http-request='uploadFile'>
              <el-button type="primary">导入数据</el-button>
            </el-upload>
          </el-form-item>


       </common-form>
    </div>

    <el-table
        :data="tableList"
        stripe
        border
        fit
        empty-text="暂无数据"
         style="width: 100%;"
      >
        <el-table-column
          prop="id"
          label='园区编号'
          align="center"
          width='100px'
         >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="园区名称"
          show-overflow-tooltip
         >
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="园区地址"
        >
        </el-table-column>
         <el-table-column
          prop="username"
          align="center"
          label="管理员账号"
          show-overflow-tooltip
         >
        </el-table-column>
        <el-table-column label="操作" align="center"  width="240" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="check(row)" >
              查看详情
            </el-button>
            <el-button type="text" size="mini" @click="doUpdate(row)">
              修改
            </el-button>
            <el-button type="text" size="mini" @click="resetPassword(row)">
              重置密码
            </el-button>
          </template>
        </el-table-column>
    </el-table>

     <div class="page" style="">
        <el-pagination
          v-if="listQuery.totalCount"
          :page-sizes="[20, 100, 200, 300, 400]"
          background
          layout="total, sizes, prev, pager, next,jumper"
          :total="listQuery.totalCount"
          :page-size='listQuery.pageSize'
          :current-page='listry.pageNum'
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          >
        </el-pagination>
     </div>

    <el-drawer
      :title="operateType == 'add' ? '添加' : '修改'"
      :visible.sync="dialogFormVisible"
      size='730px'
      direction="rtl"
      >
         <div style=";" class='wrapper-dra'>
            <p class='title_msg' style=''>基础信息</p>
            <common-form inline :formLable='editorLable' :form='editorForm' :labelWidth='labelWidth'>
               <p class='title_msg margToS'>联系人信息</p>
               <div class='add_wrapper' style=''>
                   <div v-for="(item, index) in contactInfo" :key="item.index">
                      <common-form :formLable="contactInfoLable" :form="contactInfoForm">
                            <el-form-item :label="'联系人'+(index+1)" required>
                              <el-input
                                v-model="item.contactName"
                                placeholder="请输入"
                                class="el-item"
                              ></el-input>
                            </el-form-item>
                            <el-form-item :label="'联系电话'+(index+1)" required>
                              <el-input
                                v-model="item.contactPhone"
                                placeholder="请输入"
                                class="el-item"
                              ></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                @click='deleteContect(index)'
                              ></el-button>
                            </el-form-item>
                      </common-form>
                   </div>
                    <div class='btn_wra' style="">
                      <span
                        class='btn_s'
                        style=""
                        @click='contactAdd'
                      >添加</span>
                    </div>
               </div>
               <p class='title_msg margToS'>联系人信息</p>
               <el-form-item label="管理员账号" required >
                  <el-input
                   :disabled="operateType !== 'add'"
                    v-model="editorForm.username"
                    placeholder="请输入"
                    class="el-item"
                  ></el-input>
               </el-form-item>
               <el-form-item label="登陆密码" required>
                  <el-input
                    v-model="editorForm.password"
                    placeholder="请输入"
                    class="el-item"
                    style='width:300px;'
                  ></el-input>
                  <el-button type="text" size="mini" @click="initPsw">
                      设置为原始密码
                   </el-button>
                </el-form-item>
               <el-form-item >
                    <el-button type='primary' @click="submit">确定</el-button>
                    <el-button type='primary' @click="cancel">取消</el-button>
                </el-form-item>
            </common-form>
         </div>
    </el-drawer>

    <el-drawer
      title="园区详情"
      :visible.sync="checkDeatil"
      size='850px'
      direction="rtl"
      >
      <div class='dra-wrapper' style="">
             <div class="content" style="">
                 <h4>基础信息</h4>
                 <div class="detail-name">
                    <div class='ls-cen' style=''>
                        <span class='ls-cen-title' style="">园区名称：</span>
                        <span class='ls-cen-con' >
                           {{detail.name}}
                        </span>
                    </div>
                     <div class='ls-cen' style=''>
                        <span class='ls-cen-title' style="">园区编号：</span>
                        <span class='ls-cen-con' >
                           {{detail.id}}
                        </span>
                    </div>
                </div>
                <div class="detail-name">
                    <div class='ls-cen' style=''>
                        <span class='ls-cen-title' style="">园区地址：</span>
                        <span class='ls-cen-con' >
                          {{detail.address}}
                        </span>
                    </div>
                     <div class='ls-cen' style=''>
                        <span class='ls-cen-title' style="">管理员帐号：</span>
                        <span class='ls-cen-con' >
                          {{detail.username}}
                        </span>
                    </div>
                </div>
                 <div class="detail-name">
                    <div class='ls-cen' style=''>
                        <span class='ls-cen-title' style="">登陆密码：</span>
                        <span class='ls-cen-con init-psd' style="" @click="resetPassword(detail)">
                          设置为原始密码
                        </span>
                    </div>
                     <div class='ls-cen' style=''>
                    </div>
                </div>
              </div>
              <div class="dra-table" style="">
                   <h4>企业联系人</h4>
                   <el-table
                      :data="record"
                      stripe
                      border
                      fit
                      empty-text="暂无数据"
                    >
                      <el-table-column
                        label='联系人序号'
                        type="index"
                        align="center"
                         width="200"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="contactName"
                        label='联系人姓名'
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="contactPhone"
                        align="center"
                        label="操作员"
                      >
                      </el-table-column>
                  </el-table>
              </div>
          </div>

    </el-drawer>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import CommonForm from '@/components/CommonForm'
import CommonTable from '@/components/CommonTable'

import {
  parkList, //页面list
  parkAdd,  //添加
  parkModify,//修改
  downLoadExcel, //下载文件
  resetPassword, //重置密码
  uploadFile,  //上传文件

  defaultPassword, //默认密码
  downLoadDefault,// 下载模版
} from '@/myApi/building/building'

import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
import { infor } from '@/myApi/login';
export default {
  components: { Pagination, CommonForm,  CommonTable},
  data() {
    return {
      headers:{
           Authorization:getToken()
       },
      formLable:[//表单需要的参数,搜索表单
                {
                    model:'name',
                    lable:'园区名称',
                    option:[],
                    placeholder:"请输入园区名称",
                    show:true
                },
                {
                    model:'address',
                    lable:'园区地址',
                    option:[],
                    placeholder:"请输入园区地址",
                    show:true
                },
      ],
      form:{ //双向绑定的表单
            formInline:true, //该表单是否 inline
            name:"",
            address:""
      },
      editorLable:[  //编辑的需要的参数
                {
                    model:'name',
                    lable:'园区名称',
                    option:[],
                    placeholder:"请输入园区名称",
                    show:true
                },
                {
                    model:'address',
                    lable:'所在地址',
                    option:[],
                    placeholder:"请选择所在地址",
                    show:true
                }
      ],
      editorForm:{   //编辑需要绑定的数据
          formInline:false,
          name:"",
          address:"",
          username:"",
          password:""
      },

      contactInfo:[
        {
          contactName:"",
          contactPhone:"",
        }
      ],
      contactInfoLable:[],
      contactInfoForm:{
         formInline:true,
      },
      labelWidth:"110px",
      checkDeatil:false,    //查看
      detail:{},
      detailId:'',//userno
      userNo:"",
      tableList:[],    //表格列表
      listLoading: false,    //表格加载loading
      listQuery: {          //默认请求参数
        pageNum: 1,
        pageSize: 20,
        totalCount: 0,
      },
      operateType:"",
      dialogFormVisible: false,   //控制编辑面板
      record:[],   //记录
    }
  },
  computed:{

  },

  created() {
     this.getTbaleList()
  },
  methods: {
    resetPassword(row) {
      resetPassword(row).then(res => {
        if(res.data.code == 200) {
          this.$boxMessage(res.data.msg)
        } else {
           this.$boxMessage(res.data.msg)
        }
      }).catch(err => {
          this.$boxMessage('系统繁忙')
      })
    },
    downLoad() {
       let parmas = {
        pageNum:this.listQuery.pageNum,
        pageSize:this.listQuery.pageSize,
        name:this.form.name,
        address:this.form.address,
       }
       parkList(parmas).then(res => {
        this.listLoading = false
        if(res.data.code == 200) {
          this.tableList = res.data.data.list
          this.listQuery.totalCount = res.data.data.total
          if(this.tableList.length >= 1) {
             this.downLoadExcel(parmas)
          } else {
            this.$message({
              type: 'warning',
              message: '暂无数据'
             });
          }

        } else {
            this.$message({
              type: 'warning',
              message: res.data.msg
             });
        }
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: '系统繁忙'
        });
      })

    },
    downLoadExcel(parmas) {
       downLoadExcel(parmas).then(res => {
         const blob = res.data
         const filReader = new window.FileReader()
         filReader.readAsDataURL(blob)
         filReader.onload = event => {
           let a = document.createElement('a')
           a.download = `园区列表.xlsx`
           a.href = event.target.result
           document.body.appendChild(a)
           a.click()
           document.body.removeChild(a)
         }
       }).catch(err => {
         console.log(err)
       })
    },
    uploadFile(e) {
        let file = e.file;
        let formData = new FormData();
        formData.append("file", file);
        uploadFile(formData).then(res => {
          if(res.data.code == 200) {
              this.$boxMessage('上传成功', 'warning')
              this.getTbaleList()
          } else {
              this.$boxMessage(res.data.msg, 'warning')
          }
        }).catch(err => {
          this.$boxMessage('上传失败', 'warning')
        })
    },
    downLoadDefault() {
       downLoadDefault().then(res => {
         if(res.data.code == 200) {
             let a = document.createElement('a')
              a.download = `园区列表录入模版.xlsx`
              a.href = res.data.data.string
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
         } else {
            this.$boxMessage(res.data.msg, 'warning')
         }
       }).catch(err => {
         console.log(err)
       })
    },
    initPsw() {
      defaultPassword().then(res => {
        if(res.data.code == 200) {
          this.editorForm.password = res.data.data.string
        } else {
           this.$boxMessage(res.data.msg)
        }
      }).catch(err => {
         this.$boxMessage('系统繁忙')
      })
    },
    deleteContect(index) {
      if(this.contactInfo.length > 1) {
        this.contactInfo.splice(index,1)
      } else {
         this.$boxMessage('至少存在一个联系人', 'warning')
      }

    },
    contactAdd() {
      let obj = {
          contactName:"",
          contactPhone:"",
      }
      this.contactInfo.push(obj)
    },
    handleSizeChange(pageSize) {  //分页
         this.listQuery.pageSize = pageSize
         this.getTbaleList()
    },
    handleCurrentChange(pageNum) {  //分页
          this.listQuery.pageNum = pageNum
          this.getTbaleList()
    },
    getTbaleList() {//table的数据
      this.listLoading = true
      let parmas = {
        pageNum:this.listQuery.pageNum,
        pageSize:this.listQuery.pageSize,
        name:this.form.name,
        address:this.form.address,
      }
      parkList(parmas).then(res => {
        this.listLoading = false
        if(res.data.code == 200) {
          this.tableList = res.data.data.list
          this.listQuery.totalCount = res.data.data.total
        } else {
            this.$message({
              type: 'warning',
              message: res.data.msg
             });
        }
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: '系统繁忙'
        });
      })
    },
    search() {
      this.getTbaleList()
    },
    add() {//添加按钮
        this.operateType = 'add'
        this.dialogFormVisible = true
        this.editorForm = {   //编辑需要绑定的数据
          formInline:false,
          name:"",
          address:"",
          username:"",
          password:""
         }
         this.contactInfo = [
            {
              contactName:"",
              contactPhone:"",
            }
         ]
      //  this.infoSelect() //
    },
    doUpdate(row) {
      this.operateType = 'editor'
      this.dialogFormVisible = true
      this.detailId = row.id
      this.userNo = row.userNo
      this.editorForm.name = row.name
      this.editorForm.address = row.address
      this.editorForm.username = row.username
      this.editorForm.password = row.password
      this.contactInfo = row.contactInfo
    },
    submit() {  //提交按钮
         if(this.editorForm.name === '' || this.editorForm.address ==='' || this.editorForm.username === '' || this.editorForm.password === '') {
              this.$boxMessage('请填写必填选项')
              return
         }
          this.contactInfo.for
        for(let i = 0; i < this.contactInfo.length; i++) {
          if(this.contactInfo[i].contactName === '' || this.contactInfo[i].contactPhone === '') {
              this.$boxMessage('联系人信息填写有误，请重新填写')
              return
          }
        }

         let data = {
             name:this.editorForm.name,
             address:this.editorForm.address,
             username:this.editorForm.username,
             password:this.editorForm.password,
             contactInfo:this.contactInfo,
          }
          if( this.operateType ==  'add') {
              this.parkAdd(data)
          } else {
              data.id = this.detailId;
              data.userNo = this.userNo;
              this.parkModify(data)
          }

    },
    parkModify(data) {   //修改
      parkModify(data).then(res => {
        if(res.data.code ==  200) {
          this.$boxMessage(res.data.msg, 'success')
          this.dialogFormVisible = false
          this.getTbaleList()
        } else {
          this.$confirmMessage('提示', res.data.msg )
        }
        }).catch(err => {
          this.$boxMessage('系统繁忙', 'warning')
        })
    },
    parkAdd(parmas) { //添加
      parkAdd(parmas).then(res => {
          if(res.data.code ==  200) {
            this.$boxMessage(res.data.msg, 'success');
            this.dialogFormVisible = false;
            this.getTbaleList()
          } else {
            this.$confirmMessage('提示',  res.data.msg )
          }
      }).catch(err => {
          this.$boxMessage('系统繁忙', 'warning')
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    check(row) {//查看
       this.detail = row;
       this.record = row.contactInfo;
       this.checkDeatil = true;
    },
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 20;
      this.form = { //双向绑定的表单
            formInline:true, //该表单是否 inline
            name:"",
            address:"",
      };
      this.getTbaleList();
    }
  }
}
</script>


<style lang="scss" scoped>
.filter-container{
  // margin-bottom: 15px;
}
.el-form-item .el-select{
  width: 100%;
}
.common-table {
    height: 500px;
}
.count {
  margin-right: 5px;
}
.check-wrapper {
  padding:0 20px;
  p {
    height: 30px;
    line-clamp: 30px;
    .check-lable {
      display: inline-block;
      width: 80px;
      margin-right: 20px;
      text-align: right;
    }
  }
}

.dra-wrapper {
     padding:0 60px;
     max-height: calc(100vh - 100px);
     overflow: auto;
     box-sizing: border-box;
     .content {
        // border-bottom: 1px solid gray;
        padding-bottom: 20px;
        .detail-name {
            display:flex;
            font-size: 14px;
            height: 50px;
            .ls-space {
              flex:1;
              height:100%;
              line-height:50px;
            }
            .ls-cen {
                flex:1;
                height:100%;
                position:relative;
                .ls-cen-title {
                  height:50px;
                  line-height:50px;
                  display:inline-block;
                }
                .ls-cen-con {
                    position:absolute;
                    top:50%;
                    word-break:normal;
                    display:inline-block;
                    white-space: normal;
                    word-wrap : break-word;
                    transform:translate(0,-50%);
                }
            }
            .p {
               display: flex;
              //  span {
              //    flex: 1;
              //  }
            }
        }
        .dra-table {
            // max-height:400px;
            height: 350px;
            font-size: 14px;
            p {
              font-size: 16px;
            }
        }
     }
     .margin {
       margin-top: 20px;
     }
}
.upload-wrapper {
  margin-bottom: 15px;
}
.app-container .el-upload-list__item {
      transition: none !important;
}
.checkImage-wrapper {
     padding:40px;
     height:100%;
     width:100%;
     div {
         display:flex;
         flex-wrap:wrap;
         img {
           height:200px;
           width:200px;
           margin-right:10px;
           margin-top:10px;
         }
     }
}
.page {
  padding-top:10px;
  padding-right: 15px;
}
.pic {
 margin-right:10px;
}

.detail-name {

  // span {
  //   box-sizing: border-box;
  //   display: inline-block;
  //   padding: 5px 10px;
  //   border-radius: 5px;
  //   background: #409EFF;
  //   // margin-right: 15px;
  //   color: beige;
  // }
}
.lookImg {
  cursor: pointer;
}
.editor {
    padding: 20px 40px;
    max-height: calc(100vh - 100px);
    overflow: auto;
    .select {
        display:inline-block;
        width:80%;
    }
    .icon-input {
        margin-left:10px;
        color: #8492a6;
        font-size: 20px
    }
}
.infor-wrapper {
    border:1px solid #eeeeee;
    box-sizing:border-box;
    padding:10px 35px;
}
.infor-for {
   border-bottom:1px solid #eeeeee;
   padding:20px 0;
}
.infor-for:last-child{
    border:none;
}
.bc {
  background:red;
  height:100%;
  height:100%;
  display:inline-block;
  position:absolute;
  top:0;
  left:0;
}
.bc:hover {
   background:red;
   top:0;
  left:0;
}
.upload-wrapper {
  position:relative;
}
.wrapper-dra {
  max-height: calc(100vh - 100px);
  overflow: auto;
  padding:0 40px
}
.title_msg {
  font-size:18px;
}
.margToS {
  margin-top:60px;
}
.btn_wra {
  text-align:center;
}
.add_wrapper {
   border:1px solid gray;padding:20px 0;border-radius:10px;
}
.btn_s {
  padding:10px 20px;border:1px solid gray;border-radius:5px;
}
.avatar-uploader {
    border:1px solid #8c939d;
    margin-top:10px;
    height:200px;
    width:200px;
    display:inline-block;
    position:relative;
    margin-right:10px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
}
.init-psd {
  color:#409EFF;
  cursor: pointer;
}
</style>

