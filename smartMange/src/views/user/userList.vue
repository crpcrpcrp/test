<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">
      <common-form inline :formLable="formLable" :form="form">
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </common-form>
    </div>
    <el-table :data="tableList" stripe border fit empty-text="暂无数据" style="width: 100%;">
      <el-table-column prop="id" label="用户编号" align="center" width="130px"></el-table-column>
      <el-table-column prop="nick" align="center" label="用户昵称" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="tel" align="center" label="绑定手机" width="180"></el-table-column>
      <el-table-column prop="realName" align="center" label="真实姓名"></el-table-column>
      <el-table-column prop="cardNo" align="center" label="证件号" width="200"></el-table-column>
      <el-table-column prop="carNo" align="center" label="默认车牌" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column
        prop="hasBankCard"
        align="center"
        label="是否绑卡"
        show-overflow-tooltip
        width="120"
      ></el-table-column>
      <el-table-column
        prop="loginWays"
        align="center"
        label="第三方登陆绑定"
        width="140"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="注册时间"
        width="200"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="loginTime"
        align="center"
        label="最后登陆时间"
        width="200"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column label="账号状态" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.status == 1">正常</span>
          <span v-if="row.status == 0" style="color:red">封停</span>
        </template>
      </el-table-column>

      <el-table-column label="封停开关" align="center" v-if="userList.userList_stop">
        <template slot-scope="scope">
          <el-switch
            @change="getswitch($event,scope.row)"
            v-model="tableList[scope.$index].status"
            inactive-value="1"
            active-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="searchDetail(row)">查看</el-button>
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

    <el-drawer title="查看详情" :visible.sync="detailMessageDio" size="60%" direction="rtl">
      <div class="dra-wrapper" style>
        <div class="content" style>
          <h4>用户信息</h4>
          <div class="detail-name" style>
            <p style="flex:1">用户昵称：{{detailList.nick}}</p>
            <p style="flex:1" class="p">真实姓名：{{detailList.realName}}</p>
          </div>
          <div class="detail-name" style>
            <p style="flex:1">身份证号：{{detailList.cardNo}}</p>
            <p style="flex:1">用户编号：{{detailList.id}}</p>
          </div>
          <div class="detail-name">
            <div style class="ls-space">绑定手机号：{{detailList.tel}}</div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>绑定车牌号：</span>
              <span class="ls-cen-con">{{detailList.carNo}}</span>
            </div>
          </div>

          <div class="detail-name" style>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>登陆绑定：</span>
              <span class="ls-cen-con">{{detailList.loginWays}}</span>
            </div>
            <div class="ls-cen" style>
              <span class="ls-cen-title" style>登陆密码：</span>
              <span class="ls-cen-con">{{detailList.passwordSet}}</span>
              <span class="reset-pas" @click="resetPas">重置</span>
            </div>
          </div>
        </div>
        <div class="content margin" style>
          <h4>账号信息</h4>
          <div class="detail-name" style>
            <p style="flex:1">注册时间：{{detailList.createTime}}</p>
            <p style="flex:1">注册设备：暂时缺少</p>
          </div>
          <div class="detail-name" style>
            <p style="flex:1">最后登陆时间：{{detailList.loginTime}}</p>
            <p style="flex:1">最后登陆设备：暂时缺少</p>
          </div>
        </div>

        <div class="content margin" style>
          <h4>钱包信息</h4>
          <div class="detail-name" style v-for="(item, index) in cardList" :key="index">
            <template v-if="cardList.length">
              <p style="flex:1">卡类型：{{item.cardType}}</p>
              <p style="flex:1">卡号码：{{item.cardNo}}</p>
            </template>
          </div>
          <div class="detail-name" v-if="cardList.length == 0">
            <p style="flex:1;color:gray;">暂无数据</p>
          </div>
        </div>

        <div class="content margin" style>
          <h4>半年消费</h4>
          <div class="detail-name">
            <p style="flex:1;color:gray;">暂无数据</p>
          </div>
        </div>
        <!-- 操作记录 -->
        <!-- <div class="dra-table" style="">
                  <p>后台操作记录</p>
                  <el-table
                    :data="historyRecord"
                    max-height="280" 
                    stripe
                    border
                    fit
                    empty-text="暂无数据"
                  >
                    <el-table-column
                      prop="operateType"
                      label='操作类型'
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="operateUser"
                      align="center"
                      label="操作员"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="operateResult"
                      align="center"
                      label="执行结果"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="operateTime"
                      align="center"
                      label="操作时间"
                      width="200"
                    >
                    </el-table-column>
                </el-table>
                <div class="block">
                  <el-pagination
                    v-if="detailPage.totalCount"
                    @size-change="handleSizeChangeDra"
                    @current-change="handleCurrentChangeDra"
                    :page-size='5'
                    layout="total, prev, pager, next"
                    :total="detailPage.totalCount">
                  </el-pagination>
                </div>
        </div>-->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import CommonForm from "@/components/CommonForm";
import CommonTable from "@/components/CommonTable";

import {
  getUserList, //获取list
  getUserDetail,
  cancel, //封停
  resetPas //重置
} from "@/myApi/user";
import { setTimeout } from "timers";
import { mapState } from "vuex";
import { setUserMessage } from "@/utils/auth.js";
export default {
  components: { Pagination, CommonForm, CommonTable },
  data() {
    return {
      formLable: [
        //表单需要的参数,搜索表单
        {
          model: "nick",
          lable: "用户昵称",
          option: [],
          placeholder: "请输入用户昵称",
          show: true
        },
        {
          model: "cardNo",
          lable: "证件号码",
          option: [],
          placeholder: "请输入证件号码",
          show: true
        },
        {
          model: "tel",
          lable: "手机号",
          option: [],
          placeholder: "请输入手机号",
          show: true
        },
        {
          model: "status",
          lable: "账号状态",
          option: [
            {
              value: "0",
              label: "封停"
            },
            {
              value: "1",
              label: "正常"
            }
          ],
          type: "select",
          placeholder: "请选择账号状态",
          show: true
        }
      ],
      form: {
        //双向绑定的表单
        formInline: true, //该表单是否 inline
        nick: "", //双向绑定的key
        cardNo: "",
        tel: "", //双向绑定的key
        status: ""
      },
      handleRecord: false, //历史记录
      detailMessageDio: false, //详情
      detailList: {},
      cardList: [],

      detailId: "",
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
      editorId: "", //修改的id
      historyRecord: [] //历史记录
    };
  },
  computed: {
    ...mapState({
      userList: state => state.user.MenuButton.userList
    })
  },
  created() {
    this.getTbaleList();
  },
  methods: {
    resetPas() {
      let data = {
        id: this.detailId
      };
      resetPas(data)
        .then(res => {
          if (res.data.cde == 200) {
            this.$boxMessage(res.data.msg, "success");
          } else {
            this.$boxMessage(res.data.msg, "warning");
          }
        })
        .catch(err => {
          this.$boxMessage("系统繁忙", "warning");
        });
    },
    searchDetail(row) {
      //查看详情
      this.detailId = row.id;
      getUserDetail(row)
        .then(res => {
          if (res.data.code == 200) {
            this.detailMessageDio = true;
            this.detailList = res.data.data;
            this.cardList = res.data.data.bankCardList;
          } else {
            this.$message({
              type: "success",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "success",
            message: "删除成功!"
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
        nick: this.form.nick, //双向绑定的key
        cardNo: this.form.cardNo,
        tel: this.form.tel, //双向绑定的key
        status: this.form.status
      };
      getUserList(parmas)
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
    getOperateHistory() {
      //历史记录
      let parmas = {
        attractionId: this.detailId,
        pageNum: this.detailPage.pageNum,
        pageSize: this.detailPage.pageSize
      };
      //   getAttractionOperateHistory(parmas).then(res => {
      //     if(res.data.code == 200) {
      //        this.checkDeatil = true
      //        this.historyRecord = res.data.data.list
      //        this.detailPage.totalCount = res.data.data.totalCount
      //     }
      //  }).catch(err => {
      //       this.$message({
      //         type: 'warning',
      //         message: '系统繁忙'
      //       });
      //  })
    },
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 20;
      this.form = {
        //双向绑定的表单
        formInline: true,
        nick: "",
        cardNo: "",
        tel: "",
        status: ""
      };
      this.getTbaleList();
    },
    getswitch(event, item) {
      console.log(event, item);
      cancel(item)
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
    border-bottom: 1px solid gray;
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
          padding-right: 10px;
          box-sizing: border-box;
        }
        .reset-pas {
          position: absolute;
          top: 50%;
          left: 35%;
          word-break: normal;
          display: inline-block;
          white-space: normal;
          word-wrap: break-word;
          transform: translate(0, -50%);
          padding-right: 10px;
          box-sizing: border-box;
          color: #409eff;
          cursor: pointer;
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
.resetPasw {
  margin-left: 20px;
  padding: 15px;
  color: red;
}
</style>
