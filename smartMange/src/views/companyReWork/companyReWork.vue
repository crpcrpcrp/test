<template>
  <div class="app-container">
    <result v-if="showErr" :type="1" :title="title" :desc="desc" :btn="btn" />
    <div class="filter-container">
      <common-form inline :formLable="formLable" :form="form" labelWidth>
        <el-form-item>
          <el-button type="primary" @click="search()">搜索</el-button>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
      </common-form>
    </div>
    <el-table :data="tableList" stripe border fit empty-text="暂无数据" style="width: 100%;">
      <el-table-column prop="unifiedSocialCreditCode" align="center" label="统一社会信用代码" width="100"></el-table-column>
      <el-table-column prop="name" align="center" label="企业名称" width="160"></el-table-column>
      <el-table-column prop="legalPerson" align="center" label="企业法人" width="110"></el-table-column>
      <el-table-column
        prop="addressInPark"
        align="center"
        label="园区地址"
        width="240"
        show-overflow-tooltip
      >
        <!-- <template slot-scope="{row}">
          <div style="white-space: normal;">{{row.registerAddress+" "+row.addressInPark}}</div>
        </template>-->
      </el-table-column>
      <el-table-column prop="status" align="center" label="审核状态" width="100"></el-table-column>
      <el-table-column prop="applyTime" align="center" label="申请日期" width="140"></el-table-column>
      <el-table-column prop="auditTime" align="center" label="审核日期" width="140"></el-table-column>
      <el-table-column prop="auditBy" align="center" label="审核人" width="110"></el-table-column>
      <el-table-column prop="id" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" @click="showDetail(row)">查看详情</el-button>
          <el-popover placement="top" v-if="row.status!=='通过'||row.status!=='拒绝'" width="160" v-model="row.visible">
            <p>确定要通过吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="audio(row,1)">确定</el-button>
            </div>
            <el-button slot="reference" type="text">通过</el-button>
          </el-popover>
          <!-- <el-popover placement="top" width="160" v-model="row.visible2">
            <p>确定要驳回吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="row.visible2 = false">取消</el-button>
              <el-button type="primary" size="mini" @click="audio(row,-1)">确定</el-button>
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

    <el-drawer title="复工申请详情" :visible.sync="detailVis" size="40%" direction="rtl">
      <div class="dra-wrapper">
        <div class="content">
          <h4>企业基础信息</h4>
          <div class="detail-name">
            <div class="ls-cen">
              <span class="ls-cen-title">企业名称：</span>
              <span class="ls-cen-con">{{detail.name}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">统一社会信用代码：</span>
              <span class="ls-cen-con">{{detail.unifiedSocialCreditCode}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">企业法人：</span>
              <span class="ls-cen-con">{{detail.legalPerson}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">注册地址：</span>
              <span class="ls-cen-con">{{detail.registerAddress}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">申请日期：</span>
              <span class="ls-cen-con">{{detail.applyTime}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">审核状态：</span>
              <span class="ls-cen-con">{{detail.status}}</span>
            </div>
          </div>
        </div>
        <div class="content">
          <h4>复工情况</h4>
          <div class="detail-name">
            <div class="ls-cen">
              <span class="ls-cen-title">复工日期：</span>
              <span class="ls-cen-con">{{detail.resumeDate}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">复工人数：</span>
              <span class="ls-cen-con">{{detail.resumeCount}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">非本市人数：</span>
              <span class="ls-cen-con">{{detail.notThisCityCount}}</span>
            </div>
            <div class="ls-cen">
              <span class="ls-cen-title">从湖北(含经停)返回人数：</span>
              <span class="ls-cen-con">{{detail.hubeiBackCount}}</span>
            </div>
          </div>
        </div>
        <div class="content">
          <h4>复工情况</h4>
          <div class="detail-name">
            <div class="fileCon">
              <i class="el-icon-paperclip"></i>
              <span class="textDown">复工方案</span>
              <el-button
                style="padding-left:30px;"
                size="mini"
                type="text"
                @click="downloadFile(detail.scheme)"
              >下载文件</el-button>
            </div>
            <div class="fileCon">
              <i class="el-icon-paperclip"></i>
              <span class="textDown">复工职工防疫承诺书</span>
              <el-button
                style="padding-left:30px;"
                size="mini"
                type="text"
                @click="downloadFile(detail.employeeProtectLetter)"
              >下载文件</el-button>
            </div>
            <div class="fileCon">
              <i class="el-icon-paperclip"></i>
              <span class="textDown">复工人员情况表</span>
              <el-button
                style="padding-left:30px;"
                size="mini"
                type="text"
                @click="downloadFile(detail.resumeEmployeeSituation)"
              >下载文件</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import result from "@/views/result.vue";
import Pagination from "@/components/Pagination";
import CommonForm from "@/components/CommonForm";
import CommonTable from "@/components/CommonTable";
import {
  getReworkList,
  getAuthType,
  reworkAudit
} from "@/myApi/reWork/companyReWork";
const formLable = [
  //表单需要的参数,搜索表单
  {
    model: "unifiedSocialCreditCode",
    lable: "统一社会信用代码",
    placeholder: "请输入"
  },
  {
    model: "name",
    lable: "企业名称",
    placeholder: "请输入"
  },
  {
    model: "status",
    lable: "审核状态",
    type: "select",
    placeholder: "请选择",
    option: []
  },
  {
    model: "auditBy",
    lable: "审核人",
    placeholder: "请输入"
  },
  {
    model: "applyTime",
    lable: "申请日期",
    type: "daterange"
  },
  {
    model: "auditTime",
    lable: "审核日期",
    type: "daterange"
  }
];

const formInit = {
  //双向绑定的表单
  formInline: true, //该表单是否 inline
  applyAuthTimeStart: "",
  applyAuthTimeEnd: "",
  auditBy: "",
  auditTimeStart: "",
  auditTimeEnd: "",
  name: "",
  status: "",
  unifiedSocialCreditCode: ""
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
      showErr: false,
      type: 1,
      visible: false,
      detail: {},
      desc: "请先进行企业认证",
      tableList: [], //表格列表
      qcodeStr: "", //二维码
      btn: {
        title: "去申请",
        do: () => {
          location.reload();
        }
      },
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
    title() {
      return this.type == 1 ? "请先进行企业认证" : "请先进行复工申请";
    }
  },
  methods: {
    /**************  接口部分  ***************/
    // 获取数据列表
    async getDataList(_params) {
      let params = {
        pageNum: this.listQuery.pageNum || 1,
        pageSize: this.listQuery.pageSize || 20,
        ..._params
      };

      let res = await getReworkList(params);
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
    // 选项列表
    async getListSelect() {
      let res = await getAuthType();
      let resData = res.data || {};
      if (resData.code === 200) {
        let data = resData.data || {};
        // 列表
        let list = data.list || [];
        list.push({ value: "", label: "全部" });
        // 修改审核状态选择项
        this.formLable.map(item => {
          if (item.model === "status") {
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
    /*************** 事件部分 ***************/
    async search() {
      let params = {
        applyAuthTimeStart: (this.form.applyAuthTime || [])[0] || "",
        applyAuthTimeEnd: (this.form.applyAuthTime || [])[1] || "",
        auditBy: this.form.auditBy || "",
        auditTimeStart: (this.form.auditTime || [])[0] || "",
        auditTimeEnd: (this.form.auditTime || [])[1] || "",
        name: this.form.name || "",
        status: this.form.status || "",
        unifiedSocialCreditCode: this.form.unifiedSocialCreditCode || ""
      };
      await this.getDataList(params);
    },
    // 提交审核submit
    async rejectBtn(row) {
      this.rejectVis = true;
      this.rejectDetail = row;
    },
    // 审核
    async audio(row, result) {
      row.visible = false;
      let isPass = result === 1;
      let params = { id: row.id, auditResult: result };
      if (!isPass) {
        // 驳回原因
        params.rejectReason = this.rejectReason || "";
      }
      let res = await reworkAudit(params);
      let resData = res.data || {};
      if (resData.code === 200) {
        this.$message({
          type: "success",
          message: isPass ? "通过成功" : "驳回成功"
        });
        if (isPass) {
          this.rejectVis = false;
        }
        this.search();
      } else {
        this.$message({
          type: "error",
          message: resData.msg || "审核失败"
        });
      }
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
      this.detail = row;
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
    // 下载文件
    downloadFile(url) {
      window.open(url);
    }
  },
  async created() {
    // 数据列表
    this.getDataList();
    // 选择项列表
    this.getListSelect();
    // 获取企业二维码
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
  .fileCon {
    padding-bottom: 20px;
  }
  .textDown {
    color: #606266;
  }
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
