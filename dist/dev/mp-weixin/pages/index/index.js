"use strict";
const common_vendor = require("../../common/vendor.js");
const composables_useCommon = require("../../composables/useCommon.js");
const composables_useWorkFlow = require("../../composables/useWorkFlow.js");
const utils_request = require("../../utils/request.js");
const utils_common = require("../../utils/common.js");
const stores_appStore = require("../../stores/appStore.js");
const types_event_types = require("../../types/event.types.js");
const utils_emitter = require("../../utils/emitter.js");
if (!Array) {
  const _easycom_fui_tabs2 = common_vendor.resolveComponent("fui-tabs");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_up_gap2 = common_vendor.resolveComponent("up-gap");
  const _easycom_up_status_bar2 = common_vendor.resolveComponent("up-status-bar");
  const _easycom_fui_footer2 = common_vendor.resolveComponent("fui-footer");
  const _easycom_up_avatar2 = common_vendor.resolveComponent("up-avatar");
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  const _easycom_up_cell2 = common_vendor.resolveComponent("up-cell");
  const _easycom_up_cell_group2 = common_vendor.resolveComponent("up-cell-group");
  const _component_template = common_vendor.resolveComponent("template");
  (_easycom_fui_tabs2 + _easycom_fui_nav_bar2 + _easycom_up_gap2 + _easycom_up_status_bar2 + _easycom_fui_footer2 + _easycom_up_avatar2 + _easycom_up_icon2 + _easycom_up_cell2 + _easycom_up_cell_group2 + _component_template)();
}
const _easycom_fui_tabs = () => "../../components/firstui/fui-tabs/fui-tabs.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_up_gap = () => "../../node-modules/uview-plus/components/u-gap/u-gap.js";
const _easycom_up_status_bar = () => "../../node-modules/uview-plus/components/u-status-bar/u-status-bar.js";
const _easycom_fui_footer = () => "../../components/firstui/fui-footer/fui-footer.js";
const _easycom_up_avatar = () => "../../node-modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_up_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_up_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_up_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_fui_tabs + _easycom_fui_nav_bar + fuiBackgroundImage + AppSwiper + _easycom_up_gap + AppTags + AppWaterFall + _easycom_up_status_bar + MyGraphicCard + BaseLayout + _easycom_fui_footer + _easycom_up_avatar + UserMemberInfo + GetUserInfoPopup + _easycom_up_icon + _easycom_up_cell + _easycom_up_cell_group + TnIcon)();
}
const BaseLayout = () => "../../layouts/BaseLayout.js";
const GetUserInfoPopup = () => "../../components/GetUserInfoPopup.js";
const TnIcon = () => "../../node-modules/@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js";
const UserMemberInfo = () => "../../components/home/UserMemberInfo.js";
const MyGraphicCard = () => "../../components/custom/MyGraphicCard/MyGraphicCard.js";
const AppSwiper = () => "../../components/home/AppSwiper.js";
const AppTags = () => "../../components/home/AppTags.js";
const AppWaterFall = () => "../../components/home/AppWaterFall.js";
const fuiBackgroundImage = () => "../../components/firstui/fui-background-image/fui-background-image.js";
const backGroundImage = "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/aidraw/image/temps/67873d6c232a3c5d52240dd6/Home2.jpg";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    function img2pay() {
      pageindex.value = 2;
      showPay.value = true;
    }
    common_vendor.ref("fuiNavBar");
    const { tabbarIndex } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    const pageindex = common_vendor.ref(0);
    const changeHomePage = (index) => {
      pageindex.value = index.index;
      console.log("index", pageindex.value);
    };
    const name_value = common_vendor.ref("我的");
    function wode_loging() {
      if (!composables_useCommon.isLogin.value) {
        name_value.value = "登录";
      } else {
        name_value.value = "我的";
      }
    }
    const tabbarData = [
      {
        name: "首页",
        to: "/pages/index/index",
        onClick: tabbarIndex
      },
      {
        name: "创意",
        to: "/pages/creative/creative",
        onClick: tabbarIndex
      },
      {
        name: name_value,
        onClick: tabbarIndex
      }
    ];
    common_vendor.onMounted(() => {
      getTestImageData();
    });
    common_vendor.onUnmounted(() => {
      imageData.value = [];
    });
    const getTestImageData = async () => {
      imageData.value = await utils_request.request("draw/history/findMany", {
        method: "POST",
        data: {
          history: {
            is_deleted: false,
            is_public: true
          }
        }
      });
    };
    const imageData = common_vendor.ref([]);
    const graphicDatas = common_vendor.computed(() => {
      return imageData.value.map((item) => {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
          id: item._id,
          avatar: ((_a = item.user_id) == null ? void 0 : _a.avatar_url) || "",
          username: ((_b = item.user_id) == null ? void 0 : _b.nickname) || ((_c = item.user_id) == null ? void 0 : _c.username),
          title: (_d = item.options) == null ? void 0 : _d.workflow_title,
          description: utils_common.formatDateTime(new Date(item.created_at)),
          tags: item.tags,
          content: ((_f = (_e = item.params) == null ? void 0 : _e.positive) == null ? void 0 : _f.slice(0, 120)) + "...",
          images: (() => {
            const inputImages = [];
            for (const key in item.params) {
              if (key.startsWith("image_path_") && item.params[key]) {
                inputImages.push(item.params[key]);
              }
            }
            if (!item.output) {
              return inputImages;
            }
            return [...inputImages, ...item.output];
          })(),
          commentCount: (_g = item.comment) == null ? void 0 : _g.length
        };
      });
    });
    function toEmpty() {
      common_vendor.index.navigateTo({
        url: "/pages/Empty/Empty"
      });
    }
    const { user } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    common_vendor.ref(true);
    common_vendor.ref("");
    function handleGotoHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/history/history_fui/history_fui"
      });
    }
    const handleLogin = async () => {
      if (composables_useCommon.isLogin.value) {
        return;
      }
      common_vendor.index.showLoading({
        title: "正在登录...",
        mask: true
      });
      const { uniPlatform } = common_vendor.index.getSystemInfoSync();
      if (uniPlatform !== "web") {
        handleLoginByWechat();
      } else {
        console.log("dev");
        const user2 = await composables_useCommon.loginByUsername({
          username: "test456",
          password: "123456"
        });
        composables_useCommon.saveLoginInfo(user2);
        common_vendor.index.hideLoading();
      }
      name_value.value = "我的";
    };
    const handleLoginByWechat = () => {
      common_vendor.index.login({
        success: async function({ code }) {
          const result = await composables_useCommon.loginByWechatCode(code);
          composables_useCommon.saveLoginInfo(result);
          common_vendor.index.hideLoading();
        },
        fail: function(err) {
          common_vendor.index.showToast({
            title: "登录错误",
            icon: "none"
          });
        }
      });
    };
    const { socketInit } = composables_useWorkFlow.useWorkFlow();
    common_vendor.onReady(() => {
      socketInit();
      utils_emitter.on(types_event_types.EventType.PAY_SUCCESS, ({ order_id }) => handlePayMessage(order_id));
      wode_loging();
    });
    const handlePayMessage = async (order_id) => {
      console.log("收到支付成功消息", order_id);
      const order = await composables_useCommon.getOrderInfoById(order_id);
      if (order[0] && order[0].order_status === 1) {
        common_vendor.index.showToast({
          title: "支付成功",
          icon: "none"
        });
        composables_useCommon.refreshUserInfo();
      }
    };
    const handleLoginOut = () => {
      common_vendor.index.showLoading({
        title: "正在退出登录...",
        mask: true
      });
      composables_useCommon.loginOut();
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({
        title: "退出成功",
        icon: "none"
      });
      name_value.value = "登录";
    };
    const { showPay } = common_vendor.storeToRefs(stores_appStore.useAppStore());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(changeHomePage),
        b: common_vendor.p({
          direction: "column",
          color: "#ACB0D0",
          isSlider: false,
          selectedColor: "#17135F",
          tabs: tabbarData,
          scale: "1.5",
          center: false,
          short: true,
          scroll: false,
          itemPadding: "25",
          current: pageindex.value,
          size: "28",
          fontWeight: "900",
          background: true
        }),
        c: common_vendor.p({
          custom: true,
          background: true
        }),
        d: common_vendor.p({
          src: backGroundImage
        }),
        e: common_vendor.p({
          height: "10"
        }),
        f: common_vendor.o(img2pay),
        g: common_vendor.o(handleGotoHistory),
        h: common_vendor.p({
          height: "10"
        }),
        i: pageindex.value == 0,
        j: common_vendor.p({
          src: backGroundImage
        }),
        k: common_vendor.f(graphicDatas.value, (graphicData, k0, i0) => {
          return {
            a: "83a5a03c-11-" + i0 + ",83a5a03c-9",
            b: common_vendor.p({
              avatar: graphicData.avatar,
              title: graphicData.title,
              username: graphicData.username,
              description: graphicData.description,
              tags: graphicData.tags,
              content: graphicData.content,
              images: graphicData.images,
              ["view-count"]: graphicData.viewCount,
              ["comment-count"]: graphicData.commentCount,
              ["like-count"]: graphicData.likeCount,
              ["view-user-avatars"]: graphicData.viewUserAvatars
            })
          };
        }),
        l: common_vendor.p({
          text: "Copyright © 2021 Fuzi-AI"
        }),
        m: pageindex.value == 1,
        n: common_vendor.p({
          src: backGroundImage
        }),
        o: common_vendor.p({
          src: common_vendor.unref(user).avatar_url,
          size: "80"
        }),
        p: !common_vendor.unref(composables_useCommon.isLogin)
      }, !common_vendor.unref(composables_useCommon.isLogin) ? {} : {}, {
        q: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        r: common_vendor.t(common_vendor.unref(user).nickname)
      } : {}, {
        s: common_vendor.unref(composables_useCommon.isLogin)
      }, common_vendor.unref(composables_useCommon.isLogin) ? {
        t: common_vendor.t(common_vendor.unref(user).balance)
      } : {}, {
        v: common_vendor.p({
          name: "scan",
          color: "#969799",
          size: "28"
        }),
        w: common_vendor.o(toEmpty),
        x: common_vendor.p({
          name: "arrow-right",
          color: "#969799",
          size: "28"
        }),
        y: common_vendor.o(toEmpty),
        z: common_vendor.o(handleLogin),
        A: common_vendor.o(($event) => showPay.value = true),
        B: common_vendor.p({
          icon: "rmb-circle",
          title: "算力充值",
          border: false
        }),
        C: common_vendor.o(handleGotoHistory),
        D: common_vendor.p({
          border: false,
          icon: "photo",
          title: "绘图历史"
        }),
        E: common_vendor.p({
          name: "logout"
        }),
        F: common_vendor.o(handleLoginOut),
        G: common_vendor.p({
          border: false,
          icon: "setting",
          title: "退出登录"
        }),
        H: common_vendor.p({
          icon: "chat-fill",
          title: "微信客服"
        }),
        I: pageindex.value == 2
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
