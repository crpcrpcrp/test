<template>
  <div id="app" v-loading="reqNum">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      reqNum: state => state.req.reqNum,
      state: state => state
      // 传字符串参数 'count' 等同于 `state => state.count`
    })
  }
};
</script>
