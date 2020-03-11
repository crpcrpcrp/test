const state = {
  reqNum: 0,
}

const mutations = {
  UPDATE_REQNUM: (state, value) => {
    const {
      reqNum,
      type
    } = value || [];
    switch (type) {
      case 'add':
        state.reqNum += ~~reqNum;
        break;
      case "reduce":
        state.reqNum -= ~~reqNum;
        break
    }
  }
}

const actions = {
  updateReqNum(ctx, value) {
    ctx.commit("UPDATE_REQNUM", {
      reqNum: value.reqNum,
      type: value.type
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
