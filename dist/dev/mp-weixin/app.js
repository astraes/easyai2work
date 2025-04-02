"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_appStore = require("./stores/appStore.js");
const components_common_share = require("./components/common/share.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/creative/creative.js";
  "./pages/home/home.js";
  "./pages/setting/setting.js";
  "./pages/history/history.js";
  "./pages/draw/apps/apps.js";
  "./pages/Empty/Empty.js";
  "./pages/history/history_fui/history_fui.js";
  "./pages/draw/draw_info/draw_info.js";
  "./pages/console/console.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLoad(() => {
      console.log("App onLoad");
    });
    common_vendor.onShow(() => {
      console.log("App onShow");
    });
    common_vendor.onHide(() => {
      console.log("App onHide");
    });
    stores_appStore.useAppStore().init();
    const socketState = common_vendor.reactive({ socket: null, isInitialized: false });
    common_vendor.provide("socketState", socketState);
    const { uniPlatform } = common_vendor.index.getSystemInfoSync();
    console.log("平台信息", uniPlatform);
    return () => {
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  app.use(common_vendor.uviewPlus);
  app.mixin(components_common_share.share);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
