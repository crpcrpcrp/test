<template>
  <div>
    <div class="res-container">
      <i class="el-icon-success" v-if="+type===1"></i>
      <i class="el-icon-error" v-else></i>
      <div class="res-title">{{title}}</div>
      <div v-if="!!desc" class="res-desc">{{desc}}</div>
      <el-button v-if="!!btn" class="res-btn" type="primary" plain @click="btn.do">{{btn.title}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pageresult",
  props: {
    type: Number, // 类型：1-成功，2-失败
    title: String, // 大标题
    desc: String, // 描述
    btn: {
      type: Object
    } // 描述
  },
  computed: {},
  created() {
    console.log(this.btn);
  }
};
</script>

<style lang="scss" scoped>
.res-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-icon-error {
  font-size: 80px;
  margin-top: 160px;
  color: red;
}

.el-icon-success {
  font-size: 80px;
  margin-top: 160px;
  color: #52c41a;
}
.res-title {
  font-size: 25px;
  line-height: 40px;
  margin-top: 20px;
  font-weight: bold;
}

.res-desc {
  color: #909399;
  line-height: 20px;
  margin-top: 10px;
  font-size: 14px;
}
.res-btn {
  margin-top: 160px;
}
</style>
