"use strict";
const common_vendor = require("../common/vendor.js");
const useInviteStore = common_vendor.defineStore("invite", {
  state: () => ({
    inviteCode: ""
  }),
  actions: {
    setInviteCode(inviteCode) {
      this.inviteCode = inviteCode;
    }
  }
});
exports.useInviteStore = useInviteStore;
