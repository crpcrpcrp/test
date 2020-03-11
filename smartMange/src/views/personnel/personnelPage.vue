<template>
  <div class="app-container">
    <result v-if="showErr" :type="1" :title="errTitle" :desc="errDesc" :btn="btn" />
    <template v-else>
      <div class="filter-container">
        <common-form inline :formLable="formLable" :form="form">
          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="reset()">重置</el-button>
          </el-form-item>
          <el-form-item>
            <!-- <el-button type="primary" @click="search">导出表格</el-button> -->
            <el-button @click="showQrCode()">获取企业二维码</el-button>
          </el-form-item>
        </common-form>
      </div>
      <el-table :data="tableList" stripe border fit empty-text="暂无数据" style="width: 100%;">
        <el-table-column prop="userNum" align="center" label="员工工号" width="80"></el-table-column>
        <el-table-column prop="userName" align="center" label="真实姓名" width="110"></el-table-column>
        <el-table-columnr
          prop="idCard"
          align="center"
          label="身份证号"
          width="220"
          show-overflow-tooltip
        ></el-table-columnr>
        <el-table-column prop="telephone" align="center" label="手机号码" width="180"></el-table-column>
        <el-table-column prop="resultName" align="center" label="审核状态" width="100"></el-table-column>
        <el-table-column prop="createTime" align="center" label="申请日期" width="140"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="审核日期" width="140"></el-table-column>
        <el-table-column prop="updateBy" align="center" label="审核人" width="110"></el-table-column>
        <el-table-column prop="id" align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" @click="showDetail(row)">查看详情</el-button>
            <el-popover placement="top" v-if="row.status!=='通过'||row.status!=='拒绝'" width="160" v-model="row.visible">
              <p>确定要通过吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="check(row,1)">确定</el-button>
              </div>
              <el-button slot="reference" type="text">通过</el-button>
            </el-popover>
            <!-- <el-popover placement="top" width="160" v-model="row.visible2">
              <p>确定要驳回吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.visible2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="check(row,-1)">确定</el-button>
              </div>
              <el-button slot="reference" type="text">驳回</el-button>
            </el-popover>-->
            <el-button slot="reference" type="text" @click="rejectBtn(row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
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

      <el-drawer :title="'企业'" :visible.sync="userNumVis" size="40%" direction="rtl">
        <div class="dra-wrapper" style="padding:20px;">
          <img :src="qcodeStr" alt style="width: 100%;" />
          <div class="footer">
            <el-button type="primary" @click="downloadQCode">下载二维码</el-button>
          </div>
        </div>
      </el-drawer>

      <el-drawer title="驳回原因" :visible.sync="rejectVis" size="40%" direction="rtl">
        <div class="dra-wrapper">
          <div class="content">
            <h4>拒绝信息</h4>
            <div class="detail-name">
              <div class="ls-cen" style="width:80%; display: flex;">
                <span class="ls-cen-title" style="flex:0 0 70px">属性方式：</span>
                <span class="ls-cen-input" style="flex:1 1 auto">
                  <el-input
                    placeholder="请输入内容"
                    type="textarea"
                    :rows="3"
                    v-model="rejectReason"
                    clearable
                  ></el-input>
                </span>
              </div>
            </div>
          </div>
          <div class="footer">
            <el-button slot="reference" @click="()=>{rejectVis=false}">取消</el-button>
            <el-button
              slot="reference"
              type="primary"
              style="margin-left:20px"
              @click="audio(rejectDetail,-1)"
            >确定</el-button>
          </div>
        </div>
      </el-drawer>

      <el-drawer title="员工详情" :visible.sync="detailVis" size="40%" direction="rtl">
        <div class="dra-wrapper">
          <div class="content">
            <h4>基础信息</h4>
            <div class="detail-name">
              <div class="ls-cen">
                <span class="ls-cen-title">真实姓名：</span>
                <span class="ls-cen-con">{{detail.userName}}</span>
              </div>
              <div class="ls-cen">
                <span class="ls-cen-title">员工工号：</span>
                <span class="ls-cen-con">{{detail.userNum}}</span>
              </div>
              <div class="ls-cen">
                <span class="ls-cen-title">身份证号：</span>
                <span class="ls-cen-con">{{detail.idCard}}</span>
              </div>
              <div class="ls-cen">
                <span class="ls-cen-title">手机号码：</span>
                <span class="ls-cen-con">{{detail.telephone}}</span>
              </div>
              <div class="ls-cen">
                <span class="ls-cen-title">申请日期：</span>
                <span class="ls-cen-con">{{detail.createTime}}</span>
              </div>
              <div class="ls-cen">
                <span class="ls-cen-title">审核状态：</span>
                <span class="ls-cen-con">{{detail.resultName}}</span>
              </div>
            </div>
          </div>
          <div class="content">
            <h4>接触历史</h4>
            <div class="detail-name">
              <div class="ls-only">当前是否有发热、咳嗽、乏力、肌肉酸痛、呼吸急促、腹泻等症状：</div>
              <div class="ls-res">{{detail.healthFlgName}}</div>
              <div class="ls-only">近14天，是否在湖北、河南、广东等疫情重灾区路过或停留：</div>
              <div class="ls-res">{{detail.passFlgName}}</div>
              <div class="ls-only">近14天，是否有接触过来自湖北、河南、广东等疫情重灾区人员：</div>
              <div class="ls-res">{{detail.accessAreFlgName}}</div>
              <div class="ls-only">近14天，是否有接触疑似或确诊的新型冠状肺炎患者或密切接触者：</div>
              <div class="ls-res">{{detail.accessPeopleFlgName}}</div>
              <div class="ls-only">近14天，所居住的楼道是否有疑似或确诊的新型冠状肺炎患者或密切接触者：</div>
              <div class="ls-res">{{detail.nearFlgName}}</div>
            </div>
          </div>
          <div class="footer">
            <!-- <el-popover placement="top" width="160" v-model="detail.visible2">
              <p>确定要驳回吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="detail.visible2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="check(detail,-1)">确定</el-button>
              </div>
              <el-button slot="reference">驳回</el-button>
            </el-popover>-->
            <el-button slot="reference" @click="rejectBtn(row)">驳回</el-button>
            <el-popover placement="top" width="160" v-if="row.status!=='通过'||row.status!=='拒绝'" v-model="detail.visible">
              <p>确定要通过吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="detail.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="check(detail,1)">确定</el-button>
              </div>
              <el-button slot="reference" type="primary" style="margin-left:20px">通过</el-button>
            </el-popover>
          </div>
        </div>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import result from "@/views/result.vue";
import Pagination from "@/components/Pagination";
import CommonForm from "@/components/CommonForm";
import CommonTable from "@/components/CommonTable";
import {
  getVirusList,
  getVirusInfo,
  getVirusListSelect,
  getVirusQrCode,
  virusResult,
  getEmployeeAuthCheck
} from "@/myApi/virus/personnelPage";
const formLable = [
  //表单需要的参数,搜索表单
  {
    model: "userNum",
    lable: "员工工号",
    placeholder: "请输入员工工号"
  },
  {
    model: "userName",
    lable: "真实姓名",
    placeholder: "请输入真实姓名"
  },
  {
    model: "telephone",
    lable: "手机号码",
    placeholder: "请输入绑定手机号码"
  },
  {
    model: "idCard",
    lable: "身份证号",
    placeholder: "请输入绑定身份证号"
  },
  {
    model: "result",
    lable: "审核状态",
    type: "select",
    placeholder: "请选择审核状态",
    option: []
  },
  {
    model: "updateBy",
    lable: "审核人",
    placeholder: "请输入绑定审核人"
  },
  {
    model: "createTime",
    lable: "申请日期",
    type: "daterange"
  },
  {
    model: "updateTime",
    lable: "审核日期",
    type: "daterange"
  }
];

const formInit = {
  //双向绑定的表单
  formInline: true, //该表单是否 inline
  userNum: "",
  userName: "",
  telephone: "",
  idCard: "",
  result: "",
  updateBy: "",
  createTime: "",
  updateTime: ""
};

export default {
  name: "employee",
  components: {
    result,
    Pagination,
    CommonForm,
    CommonTable
  },
  data() {
    return {
      //驳回相关
      rejectVis: false,
      rejectReason: "",
      rejectDetail: {},
      //
      errType: null,
      detail: {},
      tableList: [], //表格列表
      qcodeStr: "", //二维码
      userNumVis: false, //查看
      detailVis: false, //控制编辑面板
      roleSelect: [],
      value: [],
      popoverVis: false,
      listQuery: {
        //默认请求参数
        pageNum: 1,
        pageSize: 20,
        totalCount: 1
      },
      formLable,
      form: JSON.parse(JSON.stringify(formInit))
    };
  },
  computed: {
    errTitle() {
      return this.errType === "UNAUTH"
        ? "请先进行企业认证"
        : "请先进行复工申请";
    },
    errDesc() {
      return this.errType === "UNAUTH"
        ? "请先进行企业认证"
        : "请先进行复工申请";
    },
    showErr() {
      return this.errType === "UNAUTH" || this.errType === "UNAPPLY";
    },
    btn() {
      return {
        title: this.errType === "UNAUTH" ? "去认证" : "去申请",
        do: () => {
          let to =
            this.errType === "UNAUTH"
              ? "/componeyPermission/permissionPage"
              : "/gobackComponenyApplication/gobackApplication";
          this.$router.push(to);
        }
      };
    }
  },
  methods: {
    /**************  接口部分  ***************/

    // 获取数据列表
    async getCheck() {
      // UNAPPLY  未进行复工申请"),
      // UNAUTH  未进行企业认证"),
      // PASS  可以进行员工信息审核");
      let res = await getEmployeeAuthCheck();
      let resData = res.data || {};
      if (resData.code === 200) {
        let data = resData.data || {};
        this.errType = data.string || "";
      } else {
        this.$message({
          type: "error",
          message: "员工权限: " + (resData.msg || "请求失败")
        });
      }
    },
    // 获取数据列表
    async getDataList(_params) {
      let params = {
        pageNum: this.listQuery.pageNum || 1,
        pageSize: this.listQuery.pageSize || 20,
        ..._params
      };

      let res = await getVirusList(params);
      let resData = res.data || {};
      if (resData.code === 200) {
        let data = resData.data || {};
        // 列表
        this.tableList = data.list || [];
        // 分页总页数
        this.listQuery.totalCount = +data.total || 1;
      } else {
        this.$message({
          type: "error",
          message: "列表: " + (resData.msg || "请求失败")
        });
      }
    },
    async getInfo(id) {
      let res = await getVirusInfo(id);
      let resData = res.data || {};
      if (resData.code === 200) {
        let data = resData.data || {};
        // 列表
        this.detail = data;
      } else {
        this.$message({
          type: "error",
          message: "员工详情: " + (resData.msg || "请求失败")
        });
      }
    },
    // 选项列表
    async getListSelect() {
      let res = await getVirusListSelect();
      let resData = res.data || {};
      if (resData.code === 200) {
        let data = resData.data || {};
        // 列表
        let list = data.list || [];
        list.push({ value: "", label: "全部" });
        // 修改审核状态选择项
        this.formLable.map(item => {
          if (item.model === "result") {
            item.option = list;
          }
          return item;
        });
      } else {
        this.$message({
          type: "error",
          message: "审核状态选择项: " + (resData.msg || "请求失败")
        });
      }
    },
    // 获取企业二维码
    async getQrCode() {
      let res = await getVirusQrCode();
      let resData = res.data || {};
      if (resData.code === 200) {
        let data = resData.data || {};
        this.qcodeStr = data.string || "";
      } else {
        this.$message({
          type: "error",
          message: "企业二维码: " + (resData.msg || "请求失败")
        });
      }
    },
    /*************** 事件部分 ***************/
    async search() {
      let params = {
        userNum: this.form.userNum || "",
        userName: this.form.userName || "",
        telephone: this.form.telephone || "",
        idCard: this.form.idCard || "",
        result: this.form.result || "",
        updateBy: this.form.updateBy || "",
        createTimeStart: (this.form.createTime || [])[0] || "",
        createTimeEnd: (this.form.createTime || [])[1] || "",
        updateTimeStart: (this.form.updateTime || [])[0] || "",
        updateTimeEnd: (this.form.updateTime || [])[1] || ""
      };
      await this.getDataList(params);
    },
    async reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 20;
      this.form = JSON.parse(JSON.stringify(formInit));
      await this.search();
    },
    // 查看详情
    showDetail(row) {
      this.detailVis = true;
      this.getInfo(row.id);
    },
    // 提交审核submit
    async rejectBtn(row) {
      this.rejectVis = true;
      this.rejectDetail = row;
    },
    // 审核
    async check(row, result) {
      row.visible = false;
      let isPass = result === 1;
      let params = { id: row.id, result };
      if (!isPass) {
        // 驳回原因
        params.rejectReason = this.rejectReason || "";
      }
      let res = await virusResult(params);
      let resData = res.data || {};
      if (resData.code === 200) {
        this.detailVis = false;
        if (isPass) {
          this.rejectVis = false;
        }
        this.$message({
          type: "success",
          message: isPass ? "通过成功" : "驳回成功"
        });
        this.search();
      } else {
        this.$message({
          type: "error",
          message: resData.msg || "审核失败"
        });
      }
    },
    // 分页变化
    handleSizeChange(e) {
      this.listQuery.pageSize = e;
      let params = {
        ...this.form
      };
      this.getDataList(params);
    },
    handleCurrentChange(e) {
      let params = {
        ...this.form
      };
      this.listQuery.pageNum = e;
      this.getDataList(params);
    },
    // 展示二维码
    showQrCode() {
      this.userNumVis = true;
      this.getQrCode();
    },
    // 下载二维码
    downloadQCode() {
      window.open(this.qcodeStr);
    }
  },
  async created() {
    // 数据列表
    this.getDataList();
    // 选择项列表
    this.getListSelect();
    // 获取员工权限
    this.getCheck();
  }
};
</script>
<style lang="scss" scoped>
.admin-wrap {
  width: 100%;
  box-sizing: border-box;
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 400px;
    width: 400px;
  }
}
.btnCon {
  padding: 0 20px 20px 20px;
}
.content {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
  .detail-name {
    font-size: 14px;
    .ls-space {
      flex: 1;
      height: 100%;
      line-height: 50px;
    }
    .ls-only {
      width: 100%;
    }
    .ls-res {
      padding: 10px 0;
      color: #606266;
    }
    .ls-cen {
      width: 47%;
      display: inline-block;
      height: 100%;
      position: relative;
      .ls-cen-title {
        height: 40px;
        line-height: 40px;
        display: inline-block;
        vertical-align: middle;
      }
      .ls-cen-con {
        position: absolute;
        top: 50%;
        word-break: normal;
        display: inline-block;
        vertical-align: middle;
        white-space: normal;
        word-wrap: break-word;
        transform: translate(0, -50%);
      }
    }
    .p {
      display: flex;
    }
  }
}
.dra-wrapper {
  position: relative;
  height: 96%;
}
.footer {
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  text-align: center;
}
</style>
