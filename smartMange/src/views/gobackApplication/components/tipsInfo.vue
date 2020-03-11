<template>
  <div class="tipsInfo">
    <div class="icon">
      <slot></slot>
    </div>
    <div class="text">{{text}}</div>
    <div class="subText">{{subText}}</div>
    <el-button v-show="buttonText" class="button" type="primary" size="medium" @click.prevent.stop="btnClick">{{buttonText}}</el-button>
  </div>
</template>
<script>
export default {
  name:'tipsInfo',
  props: {
    text: {
      type: String,
      default: '',
    },
    subText: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
  },
  data(){
    return {
      
    }
  },
  mounted() {
    
  },
  methods: {
    btnClick() {
      this.$emit('btnClick');
    }
  },
}
</script>
<style lang="scss" scoped>
  .tipsInfo {
    width: 100%;
    min-height: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    & .icon {
      padding-top: 200px;
      margin-bottom: 20px;
    }
    & .text {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #333;
    }
    .subText {
      font-size: 16px;
      color: #888;
    }
    .button {
      margin-top: 120px
    }
  }
</style>