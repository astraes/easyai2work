"use strict";const t=require("../../../../common/vendor.js"),e={name:"u-gap",mixins:[t.mpMixin,t.mixin,t.props],computed:{gapStyle(){const e={backgroundColor:this.bgColor,height:t.addUnit(this.height),marginTop:t.addUnit(this.marginTop),marginBottom:t.addUnit(this.marginBottom)};return t.deepMerge(e,t.addStyle(this.customStyle))}}};const o=t._export_sfc(e,[["render",function(e,o,n,i,r,a){return{a:t.s(a.gapStyle)}}],["__scopeId","data-v-d1b5a85d"]]);wx.createComponent(o);
