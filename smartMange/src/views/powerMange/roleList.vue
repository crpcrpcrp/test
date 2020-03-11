<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">
      <common-form inline :formLable="formLable" :form="form">
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add" v-if="rolePower.rolePower_add">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </common-form>
    </div>
    <el-table :data="tableList" stripe border fit empty-text="暂无数据" style="width: 100%;">
      <el-table-column prop="id" label="角色编号" align="center" width="130px"></el-table-column>
      <el-table-column prop="name" align="center" label="角色名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orgName" align="center" label="所属单位"></el-table-column>
      <el-table-column prop="typeName" align="center" label="单位类型"></el-table-column>

      <el-table-column label="角色状态" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.status == 1">{{row.statusName}}</span>
          <span v-if="row.status == 0" style="color:red">{{row.statusName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="禁用开关" align="center" v-if="rolePower.rolePower_stop">
        <template slot-scope="scope">
          <el-switch
            @change="getswitch($event,scope.row)"
            v-model="tableList[scope.$index].status"
            inactive-value="1"
            active-value="0"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="280px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="searchDetail(row)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="editor(row)"
            v-if="rolePower.rolePower_update"
          >修改</el-button>
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

    <el-drawer title="查看详情" :visible.sync="detailMessageDio" size="70%" direction="rtl">
      <div class="dra-wrapper" style>
        <div class="content" style>
          <h4>角色信息</h4>
          <div class="detail-name">
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>角色名称：</span>
              <span class="ls-cen-con">{{detailList.name}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>角色编号：</span>
              <span class="ls-cen-con">{{detailList.id}}</span>
            </div>
          </div>
          <div class="detail-name">
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>所属单位：</span>
              <span class="ls-cen-con">{{detailList.organizationName}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>单位类型：</span>
              <span class="ls-cen-con">{{detailList.typeName}}</span>
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

    <el-drawer
      :title="operateType == 'add' ? '添加' : '修改'"
      :visible.sync="dialogFormVisible"
      size="40%"
      direction="rtl"
    >
      <div class="editor">
        <common-form inline :formLable="editorFormlable" :form="editorForm">
          <el-form-item label="权限选择" required>
            <el-tree
              :data="list"
              show-checkbox
              default-expand-all
              :default-checked-keys="checked"
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
          </el-form-item>
        </common-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import CommonForm from "@/components/CommonForm";
import {
  getRoleList, //获取角色列表
  organizationList, //所属单位列表
  listMenu, //添加角色菜单列表
  roleAdd, //添加角色
  roleInfo, //查看
  updateRole, //修改
  disable, //禁用开关
  getOperateHistory //历史记录
} from "@/myApi/powerMange/role/index";
import { mapState } from "vuex";

export default {
  components: { CommonForm },
  data() {
    return {
      formLable: [
        //表单需要的参数,搜索表单
        {
          model: "nick",
          lable: "角色名称",
          option: [],
          placeholder: "请输入用户昵称",
          show: true
        },
        {
          model: "orgId",
          lable: "所属单位",
          option: [],
          type: "select",
          placeholder: "请选择所属单位",
          show: true
        },
        {
          model: "type",
          lable: "单位类型",
          option: [],
          type: "select",
          placeholder: "请选择单位类型",
          show: true
        },
        {
          model: "status",
          lable: "角色状态",
          option: [],
          type: "select",
          placeholder: "请选择账号状态",
          show: true
        }
      ],
      form: {
        //双向绑定的表单
        formInline: true, //该表单是否 inline
        nick: "", //双向绑定的key
        orgId: "",
        type: "",
        status: ""
      },
      listQuery: {
        //默认请求参数
        pageNum: 1,
        pageSize: 20,
        totalCount: 0
      },

      //编辑
      operateType: "",
      dialogFormVisible: false, //控制编辑面板
      editorFormlable: [
        {
          model: "name",
          lable: "角色名称",
          option: [],
          placeholder: "请输入角色名称",
          show: true
        },
        {
          model: "orgId",
          lable: "所属单位",
          option: [],
          type: "select",
          placeholder: "请选择所属单位",
          show: true
        },
        {
          model: "type",
          lable: "单位类型",
          option: [],
          type: "select",
          placeholder: "请选择单位类型",
          show: true
        },
        {
          model: "description",
          lable: "描述",
          option: [],
          type: "textarea",
          placeholder: "请输入描述内容",
          show: true
        }
      ],
      editorForm: {
        name: "", //双向绑定的key
        orgId: "",
        type: "",
        description: ""
      },
      list: [],
      defaultProps: {
        //默认的东西
        children: "children",
        label: "name"
      },
      checked: [],
      editorId: "",
      detailMessageDio: false, //详情
      roleInfoList: [], //权限信息
      listLoading: false, //表格加载loading
      detailList: {},
      detailPage: {
        pageNum: 1,
        pageSize: 5,
        totalCount: 0
      },
      detail: {
        pictureMessageInfoVOS: []
      },
      detailId: "",

      tableList: [], //表格列表
      historyRecord: [] //历史记录
    };
  },
  computed: {
    ...mapState({
      rolePower: state => state.user.MenuButton.role
    })
  },
  created() {
    this.organizationList();
    this.getTbaleList();
  },
  methods: {
    listMenu() {
      //add时间用这个
      listMenu()
        .then(res => {
          if (res.data.code == 200) {
            this.list = res.data.data.list;
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
            message: "系统繁忙"
          });
        });
    },
    organizationList() {
      //所属单位列表
      organizationList()
        .then(res => {
          if (res.data.code == 200) {
            // 筛选
            this.formLable[1].option = res.data.data.orgSelect; //所属单位
            this.formLable[2].option = res.data.data.typeSelect; //单位类型
            this.formLable[3].option = res.data.data.statusSelect; // 状态

            //编辑
            this.editorFormlable[1].option = res.data.data.orgSelect; //所属单位
            this.editorFormlable[2].option = res.data.data.typeSelect; //所属单位
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "系统繁忙"
          });
        });
    },
    add() {
      this.operateType = "add";
      this.dialogFormVisible = true;
      //初始化
      this.editorForm = {
        name: "",
        orgId: "",
        type: "",
        description: ""
      };
      //清空
      this.checked = [];
      this.listMenu();
      try {
        this.$refs.tree.setCheckedKeys([]);
      } catch (e) {
        //console.log('')
      }
    },
    searchDetail(row) {
      //查看详情
      this.detailId = row.id;
      this.roleInfo(row, "detail");
      this.getOperateHistory();
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
        name: this.form.nick, //双向绑定的key
        orgId: this.form.orgId,
        type: this.form.type,
        status: this.form.status
      };
      getRoleList(parmas)
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
    search() {
      this.getTbaleList();
    },
    handleTagList(tagList) {
      let tagListArr = tagList.split(";").map(item => {
        return { tagName: item };
      });
      return tagListArr;
    },
    cancel() {
      this.dialogFormVisible = false;
      this.imgUrlList = [];
      this.fileList = [];
    },
    getOperateHistory() {
      //历史记录
      let parmas = {
        roleId: this.detailId,
        pageNum: this.detailPage.pageNum,
        pageSize: this.detailPage.pageSize
      };
      getOperateHistory(parmas)
        .then(res => {
          if (res.data.code == 200) {
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
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 20;
      this.form = {
        formInline: true,
        nick: "",
        orgId: "",
        type: "",
        status: "",
        tel: ""
      };
      this.getTbaleList();
    },
    submit() {
      if (
        this.editorForm.name === "" ||
        this.editorForm.orgId === "" ||
        this.editorForm.type === "" ||
        this.editorForm.description === ""
      ) {
        this.$message({
          type: "warning",
          message: "请完善信息"
        });
        return;
      }
      let data = {
        name: this.editorForm.name, //双向绑定的key
        orgId: this.editorForm.orgId,
        type: this.editorForm.type,
        description: this.editorForm.description,
        list: this.$refs.tree.getCheckedNodes()
      };
      this.dialogFormVisible = false;
      if (this.operateType == "add") {
        this.roleAdd(data);
      } else if (this.operateType == "editor") {
        data.roleId = this.editorId;
        this.updateRole(data);
      }
    },
    updateRole(data) {
      //修改提交
      updateRole(data)
        .then(res => {
          if (res.data.code == 200) {
            this.$boxMessage(res.data.msg, "warning");
            this.getTbaleList();
          } else {
            this.$confirmMessage("提示", res.data.msg);
          }
        })
        .catch(err => {
          this.$boxMessage("系统繁忙", "warning");
        });
    },
    roleAdd(data) {
      //添加角色
      roleAdd(data)
        .then(res => {
          if (res.data.code == 200) {
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
    editor(row) {
      //修改
      this.editorId = row.id;
      this.operateType = "editor";
      this.checked = [];
      try {
        this.$refs.tree.setCheckedKeys([]);
      } catch (e) {
        console.log("");
      }
      this.roleInfo(row);
      this.editorForm = {
        name: row.name,
        orgId: "" + row.orgId,
        type: "" + row.type,
        description: row.description
      };
    },
    roleInfo(data, message = "edttor") {
      roleInfo(data)
        .then(res => {
          if (res.data.code == 200) {
            this.checked = res.data.data.selectedIdList;
            this.list = res.data.data.menuPermissionTree;
            this.roleInfoList = res.data.data.roleInfoList;
            this.detailList = res.data.data;
            if (message == "detail") {
              this.detailMessageDio = true;
            } else {
              this.dialogFormVisible = true;
            }
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
            message: "系统繁忙"
          });
        });
    },
    getswitch(event, item) {
      // console.log(event,typeof event,item)
      disable(item)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
            this.getTbaleList();
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
            message: "系统繁忙"
          });
        });
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
