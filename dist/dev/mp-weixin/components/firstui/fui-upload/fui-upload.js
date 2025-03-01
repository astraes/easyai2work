"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-upload",
  emits: ["success", "error", "complete", "preview", "reupload", "delete"],
  // components:{
  // 	fuiIcon
  // },
  props: {
    width: {
      type: [Number, String],
      default: 200
    },
    height: {
      type: [Number, String],
      default: 200
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    max: {
      type: [Number, String],
      default: 9
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    addColor: {
      type: String,
      default: "#333"
    },
    addSize: {
      type: [Number, String],
      default: 88
    },
    background: {
      type: String,
      default: "#eee"
    },
    radius: {
      type: [Number, String],
      default: 0
    },
    borderColor: {
      type: String,
      default: ""
    },
    //solid、dashed、dotted
    borderSytle: {
      type: String,
      default: "solid"
    },
    isDel: {
      type: Boolean,
      default: true
    },
    delColor: {
      type: String,
      default: "rgba(0,0,0,.6)"
    },
    confirmDel: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ""
    },
    immediate: {
      type: Boolean,
      default: false
    },
    //V1.9.8+ 是否调用upload 方法进行上传操作
    callUpload: {
      type: Boolean,
      default: false
    },
    sizeType: {
      type: Array,
      default() {
        return ["original", "compressed"];
      }
    },
    sourceType: {
      type: Array,
      default() {
        return ["album", "camera"];
      }
    },
    //图片后缀名限制
    suffix: {
      type: Array,
      default() {
        return [];
      }
    },
    //单张图片大小限制 MB
    size: {
      type: [Number, String],
      default: 4
    },
    name: {
      type: String,
      default: "file"
    },
    header: {
      type: Object,
      default() {
        return {};
      }
    },
    formData: {
      type: Object,
      default() {
        return {};
      }
    },
    param: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      urls: [],
      tempFiles: [],
      //preupload、uploading、success、error
      status: []
    };
  },
  created() {
    this.initData(this.fileList);
  },
  watch: {
    fileList(vals) {
      this.initData(vals);
    }
  },
  computed: {
    showAdd() {
      let show = true;
      let len = this.urls.length;
      if (!this.isAdd || this.max == -1 && len >= 9 || this.max != -1 && len >= this.max) {
        show = false;
      }
      return show;
    }
  },
  methods: {
    initData(urls) {
      urls = urls || [];
      this.status = [];
      let status = [];
      let tempFiles = [];
      urls.forEach((item) => {
        status.push("success");
        tempFiles.push({
          path: item
        });
      });
      this.urls = [...urls];
      this.tempFiles = tempFiles;
      this.status = status;
    },
    reUpload(index) {
      this.$set(this.status, index, "uploading");
      if (this.callUpload) {
        this.$emit("reupload", {
          index
        });
      } else {
        this.uploadImage(index, this.urls[index]).then((res) => {
          this._success(res);
        }).catch((res) => {
          this._error(res);
        });
      }
    },
    getStatus() {
      if (this.status.length === 0)
        return "";
      let status = "preupload";
      if (this.status.indexOf("preupload") === -1) {
        status = ~this.status.indexOf("uploading") ? "uploading" : "success";
        if (status !== "uploading" && ~this.status.indexOf("error")) {
          status = "error";
        }
      }
      return status;
    },
    onComplete(action) {
      let status = this.getStatus();
      this.$emit("complete", {
        status,
        urls: this.urls,
        tempFiles: this.tempFiles,
        action,
        param: this.param
      });
    },
    _success(res) {
      let status = this.getStatus();
      this.$emit("success", {
        status,
        ...res,
        param: this.param
      });
    },
    _error(res) {
      let status = this.getStatus();
      this.$emit("error", {
        status,
        ...res,
        param: this.param
      });
    },
    result(url, index) {
      if (!url || index === void 0)
        return;
      this.$set(this.urls, index, url);
      setTimeout(() => {
        this.onComplete("upload");
      }, 0);
    },
    toast(text) {
      text && common_vendor.index.showToast({
        title: text,
        icon: "none"
      });
    },
    chooseImage() {
      let max = Number(this.max);
      common_vendor.index.chooseImage({
        count: max === -1 ? 9 : max - this.urls.length,
        sizeType: this.sizeType,
        sourceType: this.sourceType,
        success: (e) => {
          let imageArr = [];
          for (let i = 0; i < e.tempFiles.length; i++) {
            let len = this.urls.length;
            if (len >= max && max !== -1) {
              this.toast(`最多可上传${max}张图片`);
              break;
            }
            let path = e.tempFiles[i].path;
            if (this.suffix.length > 0) {
              let format = "";
              format = path.split(".")[path.split(".").length - 1];
              if (this.suffix.indexOf(format) == -1) {
                let text = `只能上传 ${this.suffix.join(",")} 格式图片！`;
                this.toast(text);
                continue;
              }
            }
            let size = e.tempFiles[i].size;
            if (Number(this.size) * 1024 * 1024 < size) {
              let err = `单张图片大小不能超过：${this.size}MB`;
              this.toast(err);
              continue;
            }
            imageArr.push(path);
            this.urls.push(path);
            this.tempFiles.push(e.tempFiles[i]);
            this.status.push(this.immediate ? "uploading" : "preupload");
          }
          this.onComplete("choose");
          let start = this.urls.length - imageArr.length;
          if (this.immediate) {
            for (let j = 0; j < imageArr.length; j++) {
              let index = start + j;
              this.uploadImage(index, imageArr[j]).then((res) => {
                this._success(res);
              }).catch((res) => {
                this._error(res);
              });
            }
          }
        }
      });
    },
    uploadImage(index, imgUrl, url) {
      return new Promise((resolve, reject) => {
        common_vendor.index.uploadFile({
          url: this.url || url,
          name: this.name,
          header: this.header,
          formData: this.formData,
          filePath: imgUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              this.$set(this.status, index, "success");
              resolve({
                res,
                index
              });
            } else {
              this.$set(this.status, index, "error");
              reject({
                res,
                index
              });
            }
          },
          fail: (res) => {
            this.$set(this.status, index, "error");
            reject({
              res,
              index
            });
          }
        });
      });
    },
    deleteImage(index) {
      let status = this.getStatus();
      if (status === "uploading") {
        this.toast("请等待上传结束再进行删除！");
      } else {
        if (this.confirmDel) {
          let _this = this;
          common_vendor.index.showModal({
            content: "确定将该图片删除吗？",
            showCancel: true,
            confirmText: "确定",
            success(res) {
              if (res.confirm) {
                _this.urls.splice(index, 1);
                _this.tempFiles.splice(index, 1);
                _this.status.splice(index, 1);
                _this.onComplete("delete");
                _this.$emit("delete", {
                  index
                });
              }
            }
          });
        } else {
          this.urls.splice(index, 1);
          this.tempFiles.splice(index, 1);
          this.status.splice(index, 1);
          this.onComplete("delete");
          this.$emit("delete", {
            index
          });
        }
      }
    },
    previewImage(index) {
      if (this.status.length === 0)
        return;
      common_vendor.index.previewImage({
        current: this.urls[index],
        loop: true,
        urls: this.urls
      });
      this.$emit("preview", {
        index,
        urls: this.urls
      });
    },
    start() {
      if (!this.url) {
        this.toast("请传入服务器接口地址！");
        return;
      }
      let urls = [...this.urls];
      const len = urls.length;
      for (let i = 0; i < len; i++) {
        if (urls[i].startsWith("https")) {
          continue;
        } else {
          this.$set(this.status, i, "uploading");
          this.uploadImage(i, urls[i], this.url).then((res) => {
            this._success(res);
          }).catch((error) => {
            this._error(error);
          });
        }
      }
    },
    upload(callback, index) {
      if (index === void 0 || index === null) {
        let urls = [...this.urls];
        const len = urls.length;
        for (let i = 0; i < len; i++) {
          if (urls[i].startsWith("https")) {
            continue;
          } else {
            this.$set(this.status, i, "uploading");
            if (typeof callback === "function") {
              callback(this.tempFiles[i]).then((res) => {
                this.$set(this.status, i, "success");
                this.result(res, i);
              }).catch((err) => {
                this.$set(this.status, i, "error");
              });
            }
          }
        }
      } else {
        this.$set(this.status, index, "uploading");
        if (typeof callback === "function") {
          callback(this.tempFiles[index]).then((res) => {
            this.$set(this.status, index, "success");
            this.result(res, index);
          }).catch((err) => {
            this.$set(this.status, index, "error");
          });
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  _easycom_fui_icon2();
}
const _easycom_fui_icon = () => "../fui-icon/fui-icon.js";
if (!Math) {
  _easycom_fui_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.urls, (item, index, i0) => {
      return common_vendor.e({
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index), index),
        c: $data.status[index] !== "success" && $data.status[index] !== "preupload"
      }, $data.status[index] !== "success" && $data.status[index] !== "preupload" ? common_vendor.e({
        d: $data.status[index] === "error"
      }, $data.status[index] === "error" ? {
        e: "2d5d0fa0-0-" + i0,
        f: common_vendor.p({
          name: "warning-fill",
          color: "#fff",
          size: 48
        })
      } : {}, {
        g: $data.status[index] === "error"
      }, $data.status[index] === "error" ? {
        h: common_vendor.o(($event) => $options.reUpload(index), index)
      } : {}, {
        i: $data.status[index] === "uploading"
      }, $data.status[index] === "uploading" ? {} : {}, {
        j: $data.status[index] === "uploading"
      }, $data.status[index] === "uploading" ? {} : {}) : {}, $props.isDel ? {
        k: "2d5d0fa0-1-" + i0,
        l: common_vendor.p({
          name: "close",
          color: "#fff",
          size: 32
        }),
        m: $props.delColor,
        n: common_vendor.o(($event) => $options.deleteImage(index), index)
      } : {}, {
        o: index
      });
    }),
    b: $props.width + "rpx",
    c: $props.height + "rpx",
    d: $props.radius + "rpx",
    e: $props.isDel,
    f: $props.width + "rpx",
    g: $props.height + "rpx",
    h: $props.radius + "rpx",
    i: $options.showAdd
  }, $options.showAdd ? {
    j: common_vendor.p({
      name: "plus",
      size: $props.addSize,
      color: $props.addColor
    }),
    k: common_vendor.n($props.borderColor && $props.borderColor !== true ? "fui-upload__border" : "fui-upload__noborder"),
    l: $props.width + "rpx",
    m: $props.height + "rpx",
    n: $props.background,
    o: $props.radius + "rpx",
    p: $props.borderColor,
    q: $props.borderSytle,
    r: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2d5d0fa0"]]);
wx.createComponent(Component);
