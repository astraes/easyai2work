"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const e=require("./common/vendor.js"),o=require("./stores/appStore.js");Math;const n=e.defineComponent({__name:"App",setup(n){e.onLoad((()=>{console.log("App onLoad")})),e.onShow((()=>{console.log("App onShow")})),e.onHide((()=>{console.log("App onHide")})),o.useAppStore().init();const t=e.reactive({socket:null,isInitialized:!1});e.provide("socketState",t);const{uniPlatform:p}=e.index.getSystemInfoSync();return console.log("平台信息",p),()=>{}}});function t(){const o=e.createSSRApp(n),t=e.createPinia();return o.use(t),o.use(e.uviewPlus),{app:o}}t().app.mount("#app"),exports.createApp=t;
