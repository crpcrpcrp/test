<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">
      <common-form inline :formLable="formLable" :form="form">
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add" v-if="admin.admin_add">+新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </common-form>
    </div>
    <el-table :data="tableList" stripe border fit empty-text="暂无数据" style="width: 100%;">
      <el-table-column prop="id" label="用户编号" align="center" width="100px"></el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="用户账号"
        show-overflow-tooltip
        width="180"
      ></el-table-column>
      <el-table-column prop="telephone" align="center" label="绑定手机" width="180"></el-table-column>
      <el-table-column prop="realName" align="center" label="真实姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardNo" align="center" label="证件号码" width="200"></el-table-column>
      <el-table-column prop="roleListName" align="center" label="用户角色" width="200"></el-table-column>
      <el-table-column prop="orgName" align="center" label="所属单位" width="200"></el-table-column>
      <el-table-column prop="typeName" align="center" label="单位类型" width="200"></el-table-column>
      <el-table-column label="账号状态" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.status == 1">{{row.statusName}}</span>
          <span v-if="row.status == 0" style="color:red">{{row.statusName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="封停开关" align="center" v-if="admin.admin_stop">
        <template slot-scope="scope">
          <el-switch
            @change="getswitch($event,scope.row)"
            v-model="tableList[scope.$index].status"
            inactive-value="1"
            active-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="check(row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="resetPsw(row)"
            v-if="admin.admin_resetPsw"
          >重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page" style>
      <el-pagination
        v-if="listQuery.totalCount"
        background
        layout="total, sizes, prev, pager, next,jumper"
        :total="listQuery.totalCount"
        :page-size="listQuery.pageSize"
        :current-page="listQuery.pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <el-drawer
      :title="operateType == 'add' ? '添加' : '修改'"
      :visible.sync="dialogFormVisible"
      size="40%"
      direction="rtl"
    >
      <div style="padding:40px;">
        <common-form inline :formLable="editorLable" :form="editorForm">
          <el-form-item label="用户角色" required>
            <template>
              <el-select
                v-model="value"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择用户角色"
              >
                <el-option
                  v-for="item in roleSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
          </el-form-item>
        </common-form>
      </div>
    </el-drawer>

    <el-drawer title="查看详情" :visible.sync="checkDeatil" size="70%" direction="rtl">
      <div class="dra-wrapper" style>
        <div class="content" style>
          <h4>角色信息</h4>
          <div class="detail-name">
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>用户账号：</span>
              <span class="ls-cen-con">{{detail.username}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>真实姓名：</span>
              <span class="ls-cen-con">{{detail.realName}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>身份证号：</span>
              <span class="ls-cen-con">{{detail.cardNo}}</span>
            </div>
          </div>
          <div class="detail-name">
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>用户编号：</span>
              <span class="ls-cen-con">{{detail.userNo}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>绑定手机号：</span>
              <span class="ls-cen-con">{{detail.telephone}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>所属单位：</span>
              <span class="ls-cen-con">{{detail.orgName}}</span>
            </div>
          </div>

          <div class="detail-name">
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>单位属性：</span>
              <span class="ls-cen-con">{{detail.typeName}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>所属角色：</span>
              <span class="ls-cen-con">{{roleList}}</span>
            </div>
            <div class="ls-cen" style>
              <!-- <span class='ls-cen-title' style="">所属角色：</span>
                        <span class='ls-cen-con' >
                          {{roleList}}
              </span>-->
            </div>
          </div>
        </div>
        <div class="content" style>
          <h4>权限信息</h4>
          <div style class="infor-wrapper">
            <div v-for="(item, index) in roleInfoList" :key="index" style=";" class="infor-for">
              <div style="height:40px;line-height:40px;">{{item.name}}</div>
              <div class="detail-name" v-for="(ite, ind) in item.menuInfoList" :key="ind">
                <div class="ls-cen" style>
                  <span class="ls-cen-title" style>菜单权限：</span>
                  <span class="ls-cen-con">{{ite.name}}</span>
                </div>
                <div class="ls-cen" style>
                  <span class="ls-cen-title" style>操作权限：</span>
                  <span class="ls-cen-con">{{ite.permission}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dra-table" style>
          <h4>操作记录</h4>
          <el-table :data="historyRecord" max-height="280" stripe border fit empty-text="暂无数据">
            <el-table-column prop="name" label="操作类型" align="center"></el-table-column>
            <el-table-column prop="createBy" align="center" label="操作员"></el-table-column>
            <el-table-column prop="result" align="center" label="执行结果"></el-table-column>
            <el-table-column prop="createTime" align="center" label="操作时间" width="200"></el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              v-if="detailPage.totalCount"
              @size-change="handleSizeChangeDra"
              @current-change="handleCurrentChangeDra"
              :page-size="5"
              layout="total, prev, pager, next"
              :total="detailPage.totalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import CommonForm from "@/components/CommonForm";
import CommonTable from "@/components/CommonTable";

import {
  adminList, //用户管理页面list
  selectList, //所属单位
  resetPsw, //重置密码
  limit,
  inforLogs, //记录
  detail, //详情
  adminAdd, //添加
  selectAdd //添加的下啦
} from "@/myApi/powerMange/admin";

import { setTimeout } from "timers";
import { mapState } from "vuex";
export default {
  components: { Pagination, CommonForm, CommonTable },
  data() {
    return {
      roleSelect: [],
      value: [],
      formLable: [
        //表单需要的参数,搜索表单
        {
          model: "username",
          lable: "用户账号",
          placeholder: "请输入用户账号"
        },
        {
          model: "realName",
          lable: "真实姓名",
          placeholder: "请输入真实姓名"
        },
        {
          model: "telphone",
          lable: "手机号",
          placeholder: "请输入绑定手机号"
        },
        {
          model: "orgId",
          lable: "所属单位",
          type: "select",
          placeholder: "请选择所属单位"
        }
      ],
      form: {
        //双向绑定的表单
        formInline: true, //该表单是否 inline
        username: "",
        realName: "",
        telphone: "",
        orgId: ""
      },

      editorLable: [
        //编辑的需要的参数
        {
          model: "username",
          lable: "用户账号",
          placeholder: "请输入用户账号"
        },
        {
          model: "realName",
          lable: "真实姓名",
          placeholder: "请输入真实姓名"
        },
        {
          model: "cardNo",
          lable: "身份证号",
          placeholder: "请输入身份证号"
        },
        {
          model: "telphone",
          lable: "手机号码",
          placeholder: "请输入手机号码"
        },
        {
          model: "organizationId",
          lable: "所属单位",
          type: "select",
          placeholder: "请选择所属单位"
        },
        {
          model: "type",
          lable: "单位类型",
          type: "select",
          placeholder: "请选择单位类型"
        }
      ],
      editorForm: {
        //编辑需要绑定的数据
        formInline: false,
        username: "",
        realName: "",
        telphone: "",
        organizationId: "",
        type: "",
        cardNo: ""
      },
      inline: true,
      checkDeatil: false, //查看
      detail: {},
      detailId: "", //userno
      detailPage: {
        pageNum: 1,
        pageSize: 5,
        totalCount: 0
      },
      tableList: [], //表格列表
      listLoading: false, //表格加载loading
      listQuery: {
        //默认请求参数
        pageNum: 1,
        pageSize: 20,
        totalCount: 0
      },
      operateType: "",
      dialogFormVisible: false, //控制编辑面板
      historyRecord: [], //历史记录
      roleInfoList: [],
      roleList: ""
    };
  },
  computed: {
    ...mapState({
      admin: state => state.user.MenuButton.admin
    })
  },
  created() {
    this.selectList(); //下拉
    this.getTbaleList();
  },
  methods: {
    selectAdd() {
      //添加时间的下啦
      selectAdd()
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            this.roleSelect = res.data.data.roleSelect;
            this.editorLable[4].option = res.data.data.orgSelect;
            this.editorLable[5].option = res.data.data.typeSelect;
            this.dialogFormVisible = true;
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: "系统繁忙!"
          });
        });
    },
    getswitch(event, row) {
      //封停
      limit(row)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
          this.getTbaleList();
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: res.data.msg
          });
        });
    },
    handleSizeChangeDra(pageSize) {
      //操作记录
      this.detailPage.pageSize = pageSize;
      this.getOperateHistory();
    },
    handleCurrentChangeDra(pageNum) {
      //分页
      this.detailPage.pageNum = pageNum;
      this.getOperateHistory();
    },
    handleSizeChange(pageSize) {
      //分页
      this.listQuery.pageSize = pageSize;
      this.getTbaleList();
    },
    handleCurrentChange(pageNum) {
      //分页
      this.listQuery.pageNum = pageNum;
      this.getTbaleList();
    },
    getTbaleList() {
      //table的数据
      this.listLoading = true;
      let parmas = {
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        username: this.form.username,
        realName: this.form.realName,
        telephone: this.form.telphone,
        orgId: this.form.orgId
      };
      adminList(parmas)
        .then(res => {
          this.listLoading = false;
          if (res.data.code == 200) {
            this.tableList = res.data.data.list;
            this.listQuery.totalCount = res.data.data.total;
          } else {
            this.$message({
              type: "warning",
              message: "系统繁忙"
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: "系统繁忙"
          });
        });
    },
    selectList() {
      //景区名称
      selectList()
        .then(res => {
          if (res.data.code == 200) {
            //筛选
            this.formLable[3].option = res.data.data.list;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: "系统繁忙!"
          });
        });
    },
    search() {
      this.getTbaleList();
    },
    add() {
      //添加按钮
      this.operateType = "add";
      this.value = [];
      this.editorForm = {
        //编辑需要绑定的数据
        formInline: false,
        username: "",
        realName: "",
        telphone: "",
        organizationId: "",
        type: "",
        cardNo: ""
      };
      this.selectAdd();
    },
    submit() {
      //提交按钮
      if (
        this.editorForm.cardNo === "" ||
        this.editorForm.username === "" ||
        this.editorForm.realName === "" ||
        this.editorForm.telphone === "" ||
        this.editorForm.organizationId === "" ||
        this.editorForm.type === "" ||
        !this.value.length
      ) {
        this.$message({
          type: "warning",
          message: "请完善信息!"
        });
        return;
      }
      let data = {
        username: this.editorForm.username,
        realName: this.editorForm.realName,
        telephone: this.editorForm.telphone,
        organizationId: this.editorForm.organizationId,
        type: this.editorForm.type,
        cardNo: this.editorForm.cardNo,
        roleIdList: this.value
      };
      this.adminAdd(data);
    },
    adminAdd(parmas) {
      //添加
      adminAdd(parmas)
        .then(res => {
          if (res.data.code == 200) {
            this.dialogFormVisible = false;
            this.$boxMessage(res.data.msg, "success");
            this.getTbaleList();
          } else {
            this.$confirmMessage("提示", res.data.msg);
          }
        })
        .catch(err => {
          this.$boxMessage("系统繁忙", "warning");
        });
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    resetPsw(row) {
      //删除其实只修改DeleteState状态值
      this.$confirm("此操作将重置用户密码, 是否继续?", "警告！", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          resetPsw(row).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getTbaleList();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    },
    check(row) {
      //查看
      this.roleList = row.roleListName;
      this.getDetail(row);
      this.detailId = row.userNo;
      this.detailPage = {
        //每次进来先初始化pageNum和pageSize
        pageNum: 1,
        pageSize: 5,
        totalCount: 0
      };
      this.getOperateHistory();
    },
    getOperateHistory() {
      //历史记录
      let parmas = {
        userNo: this.detailId,
        pageNum: this.detailPage.pageNum,
        pageSize: this.detailPage.pageSize
      };
      inforLogs(parmas)
        .then(res => {
          if (res.data.code == 200) {
            this.checkDeatil = true;
            this.historyRecord = res.data.data.list;
            this.detailPage.totalCount = res.data.data.total;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: "系统繁忙"
          });
        });
    },
    getDetail(row) {
      detail(row)
        .then(res => {
          if (res.data.code == 200) {
            this.checkDeatil = true;
            this.detail = res.data.data;
            this.roleInfoList = res.data.data.roleInfoList;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: "系统繁忙"
          });
        });
    },
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 20;

      this.form = {
        formInline: true,
        username: "",
        realName: "",
        telphone: "",
        orgId: ""
      };
      this.getTbaleList();
    }
  }
};
</script>


<style lang="scss" scoped>
.filter-container {
  // margin-bottom: 15px;
}
.el-form-item .el-select {
  width: 100%;
}
.common-table {
  height: 500px;
}
.count {
  margin-right: 5px;
}
.check-wrapper {
  padding: 0 20px;
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
  padding: 0 60px;
  max-height: calc(100vh - 100px);
  overflow: auto;
  box-sizing: border-box;
  .content {
    // border-bottom: 1px solid gray;
    padding-bottom: 20px;
    .detail-name {
      display: flex;
      font-size: 14px;
      height: 50px;
      .ls-space {
        flex: 1;
        height: 100%;
        line-height: 50px;
      }
      .ls-cen {
        flex: 1;
        height: 100%;
        position: relative;
        .ls-cen-title {
          height: 50px;
          line-height: 50px;
          display: inline-block;
        }
        .ls-cen-con {
          position: absolute;
          top: 50%;
          word-break: normal;
          display: inline-block;
          white-space: normal;
          word-wrap: break-word;
          transform: translate(0, -50%);
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
  padding: 40px;
  height: 100%;
  width: 100%;
  div {
    display: flex;
    flex-wrap: wrap;
    img {
      height: 200px;
      width: 200px;
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
.page {
  padding-top: 10px;
  padding-right: 15px;
}
.pic {
  margin-right: 10px;
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
    display: inline-block;
    width: 80%;
  }
  .icon-input {
    margin-left: 10px;
    color: #8492a6;
    font-size: 20px;
  }
}
.infor-wrapper {
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  padding: 10px 35px;
}
.infor-for {
  border-bottom: 1px solid #eeeeee;
  padding: 20px 0;
}
.infor-for:last-child {
  border: none;
}
</style>
