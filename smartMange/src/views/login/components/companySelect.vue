<template>
  <div class="companySelect-wrp">
    <!-- 园区选择 -->
    <el-row>
      <el-col :span="2">
        <span class="svg-container">
          <i class="el-icon-menu" />
        </span>
      </el-col>
      <el-col :span="22">
        <el-select v-model="parkSelectValue" filterable placeholder="请选择企业所在园区" @change="parkSelectChange">
          <el-option
            v-for="item in parkList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 企业楼号选择 -->
    <el-row>
      <el-col :span="2">
        <span class="svg-container">
          <i class="el-icon-location" />
        </span>
      </el-col>
      <el-col :span="22">
        <el-select v-model="apartmentSelectValue" filterable placeholder="请选择企业所在楼号" @change="apartmentSelectChange">
          <el-option
            v-for="item in apartmentList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 企业园区及楼号选择
import { getParkList, getApartmentList, getOrganizationList } from '@/myApi/login';

export default {
  name: 'companySelect',
  props: {
    type: [String, Number],
    loginFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      parkList: [], // 获取园区list
      parkSelectValue: '',
      apartmentList: [],
      apartmentSelectValue:'',
      companyNameList: [],
    }
  },
  beforeMount() {
    // 获取园区信息
    this.getParkList();
  },
  mounted() {

  },
  methods: {
    // 园区列表选择change
    parkSelectChange(value) {
      this.apartmentList = [];
      this.apartmentSelectValue = '';
      this.getApartmentList(value);
      this.$emit('parkSelectChange', {parkId: this.parkSelectValue});
    },

    // 楼号列表选择change
    apartmentSelectChange(value) {
      this.getOrganizationList({parkId:this.parkSelectValue, apartmentId: this.apartmentSelectValue});
    },

    emitCompanyData(companyNameList) {
      this.$emit('apartmentSelectChange', {companyNameList, parkId:this.parkSelectValue, apartmentId: this.apartmentSelectValue });
    },

    // 获取园区列表
    async getParkList() {
      const { data } = await getParkList();
      if(data.success) {
        this.parkList = data.data.list;
      } else {
        this.$message.error(data.msg);
      }
    },

    // 获取单元楼列表
    async getApartmentList(parkId) {
      const { data } = await getApartmentList({parkId});
      if(data.success) {
        this.apartmentList = data.data.list;
      } else {
        this.$message.error(data.msg);
      }
    },

    async getOrganizationList(params) {
      const { data } = await getOrganizationList(params);
      if(data.success) {
        this.companyNameList = data.data.list;
        this.emitCompanyData(this.companyNameList);
      } else {
        this.$message.error(data.msg);
      }
    }

  }
}
</script>


<style lang="scss">

</style>

<style lang="scss" scoped>
.companySelect-wrp {
  .svg-container {
    color: #889aa4;
    padding-left: 14px;
    .svg-icon {
      width: 14px;
    }
  }
}
</style>
