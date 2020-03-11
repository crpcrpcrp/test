import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import req from './modules/req';
import settings from './modules/settings';
import user from './modules/user';
import permission from './modules/permission';
import createLogger from 'vuex/dist/logger';

const debug = process.env.NODE_ENV !== 'production';
const plugins = [];
debug ? plugins.push(createLogger()) : null;

Vue.use(Vuex)
const store = new Vuex.Store({
  plugins,
  modules: {
    app,
    settings,
    user,
    permission,
    req
  },
  getters
})
export default store