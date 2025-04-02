"use strict";
const stores_inviteStore_js = require("../../stores/inviteStore.js.js");
const share = {
  data() {
    return {
      shareParams: {
        path: "",
        title: "邀请您成为新用户"
      }
    };
  },
  created() {
    const inviteStore = stores_inviteStore_js.useInviteStore();
    if (inviteStore.inviteCode) {
      this.shareParams.path = `/pages/index/index?my_invite_code=${inviteStore.inviteCode}`;
    }
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: this.shareParams.title,
      path: this.shareParams.path,
      imageUrl: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/67873d6c232a3c5d52240dd6/upload/白银.png",
      desc: "邀请你使用"
    };
  },
  onShareTimeline() {
    return {
      title: this.shareParams.title,
      path: this.shareParams.path,
      imageUrl: "https://chinahu-ai-server.oss-cn-chengdu.aliyuncs.com/67873d6c232a3c5d52240dd6/upload/白银.png"
    };
  }
};
exports.share = share;
