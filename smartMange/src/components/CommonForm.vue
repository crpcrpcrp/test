<template>
  <div>
    <el-form
      :model="form"
      ref="form"
      :label-width="labelWidth"
      :inline="form.formInline"
      label-position="right"
      v-if="form.formInline"
    >
      <el-form-item
        v-for="item in formLable"
        :key="item.model"
        :label="item.lable"
        :style="item.width || ''"
      >
        <template v-if="item.show!==false">
          <el-input
            v-model="form[item.model]"
            :disabled="item.disabled === '' ? true : item.disabled"
            :placeholder="item.placeholder"
            v-if="!item.type"
            class="el-item"
          ></el-input>
          <el-input
            v-model="form[item.model]"
            :placeholder="item.placeholder"
            v-if="item.type == 'textarea'"
            :type="item.type"
            :rows="2"
            class="el-item"
          ></el-input>
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.model]"
            :placeholder="item.placeholder"
            class="item-select"
          >
            <el-option
              v-for="ite in (item.option||[])"
              :key="ite.value"
              :label="ite.label"
              :value="ite.value"
            ></el-option>
          </el-select>
          <el-switch
            v-if="item.type === 'switch'"
            v-model="form[item.model]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            class="el-item"
          ></el-switch>
          <el-date-picker
            v-model="form[item.model]"
            :type="item.type"
            placeholder="选择日期"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-if="item.type === 'date'||item.type === 'daterange'"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-time-picker
            v-if="item.type === 'time-picker'"
            is-range
            v-model="form[item.model]"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </template>
      </el-form-item>
      <slot></slot>
    </el-form>
    <el-form
      :model="form"
      ref="form"
      :label-width="labelWidth"
      :inline="form.formInline"
      label-position="right"
      v-if="!form.formInline"
    >
      <el-form-item
        :required="item.required === undefined ? true : item.required"
        v-for="item in formLable"
        :key="item.model"
        :label="item.lable"
        :style="item.width || ''"
      >
        <template v-if="item.show!==false">
          <el-input
            v-model="form[item.model]"
            :disabled="item.disabled === '' ? true : item.disabled"
            :placeholder="item.placeholder"
            v-if="!item.type"
            class="el-item"
          ></el-input>
          <el-input
            v-model="form[item.model]"
            :placeholder="item.placeholder"
            v-if="item.type == 'textarea'"
            :type="item.type"
            :rows="2"
            class="el-item"
          ></el-input>
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.model]"
            :placeholder="item.placeholder"
            class="item-select"
          >
            <el-option
              v-for="ite in item.option"
              :key="ite.value"
              :label="ite.label"
              :value="ite.value"
            ></el-option>
          </el-select>
          <el-switch
            v-if="item.type === 'switch'"
            v-model="form[item.model]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            class="el-item"
          ></el-switch>
          <el-date-picker
            v-model="form[item.model]"
            type="date"
            placeholder="选择日期"
            v-if="item.type === 'date'"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-time-picker
            v-if="item.type === 'time-picker'"
            is-range
            v-model="form[item.model]"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </template>
      </el-form-item>
      <slot></slot>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    inline: Boolean, //表单是否占据一行
    form: Object, //双向绑定的内容
    formLable: Array, //表单的各个元素
    labelWidth: {
      //表单的内容的宽度  默认80px
      type: String,
      default: "90px"
    }
  },
  data() {
    return {
      required: true
    };
  }
};
</script>

<style scoped>
.el-form--inline .el-form-item {
  margin-right: 20px;
}
.item-select {
  width: 100%;
}
</style>