"use strict";
const common_vendor = require("../common/vendor.js");
const composables_useCommon = require("../composables/useCommon.js");
const useAppStore = common_vendor.defineStore("app", {
  state: () => ({
    showExecuting: false,
    //显示任务正在执行的得进度提示
    workflows_all: [],
    //所有的工作流
    home_tagActiveIndex: 0,
    //首页激活的tag编号
    home_tagsList: [],
    tabbarIndex: 0,
    //底部菜单栏的index
    user: {},
    localTasks: [],
    //本地的任务
    //     展示支付页面
    showPay: false
  }),
  actions: {
    init() {
      this.getUser();
    },
    toggleShowExecuting() {
      this.showExecuting = !this.showExecuting;
    },
    async initWorkFlows_All() {
      this.workflows_all = await composables_useCommon.getApps();
    },
    setUser(user) {
      this.user = { ...this.user, ...user };
      common_vendor.index.setStorageSync("user", JSON.stringify(this.user));
    },
    clearUser() {
      this.user = {};
      common_vendor.index.removeStorageSync("user");
    },
    getUser() {
      const userString = common_vendor.index.getStorageSync("user");
      if (userString) {
        this.user = JSON.parse(userString);
      }
      return this.user;
    }
  }
});
exports.useAppStore = useAppStore;
