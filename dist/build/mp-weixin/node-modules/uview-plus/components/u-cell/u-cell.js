"use strict";const e=require("../../../../common/vendor.js"),t={name:"u-cell",data:()=>({}),mixins:[e.mpMixin,e.mixin,e.props$4],computed:{titleTextStyle(){return e.addStyle(this.titleStyle)}},emits:["click"],methods:{addStyle:e.addStyle,testEmpty:e.test.empty,clickHandler(e){this.disabled||(this.$emit("click",{name:this.name}),this.openPage(),this.stop&&this.preventEvent(e))}}};if(!Array){(e.resolveComponent("u-icon")+e.resolveComponent("u-line"))()}Math||((()=>"../u-icon/u-icon.js")+(()=>"../u-line/u-line.js"))();const l=e._export_sfc(t,[["render",function(t,l,i,s,n,c){return e.e({a:t.$slots.icon||t.icon},t.$slots.icon||t.icon?e.e({b:t.$slots.icon},t.$slots.icon?{}:{c:e.p({name:t.icon,"custom-style":t.iconStyle,size:"large"===t.size?22:18})}):{},{d:t.$slots.title||!t.title},t.$slots.title||!t.title?{}:{e:e.t(t.title),f:e.s(c.titleTextStyle),g:e.n(t.required&&"u-cell--required"),h:e.n(t.disabled&&"u-cell--disabled"),i:e.n("large"===t.size&&"u-cell__title-text--large")},{j:t.label},t.label?{k:e.t(t.label),l:e.n(t.disabled&&"u-cell--disabled"),m:e.n("large"===t.size&&"u-cell__label--large")}:{},{n:!c.testEmpty(t.value)},c.testEmpty(t.value)?{}:{o:e.t(t.value),p:e.n(t.disabled&&"u-cell--disabled"),q:e.n("large"===t.size&&"u-cell__value--large")},{r:t.$slots["right-icon"]||t.isLink},t.$slots["right-icon"]||t.isLink?e.e({s:t.rightIcon&&!t.$slots["right-icon"]},t.rightIcon&&!t.$slots["right-icon"]?{t:e.p({name:t.rightIcon,"custom-style":t.rightIconStyle,color:t.disabled?"#c8c9cc":"info",size:"large"===t.size?18:16})}:{},{v:e.n(`u-cell__right-icon-wrap--${t.arrowDirection}`)}):{},{w:t.$slots.righticon},t.$slots.righticon?{x:e.n(`u-cell__right-icon-wrap--${t.arrowDirection}`)}:{},{y:e.n(t.center&&"u-cell--center"),z:e.n("large"===t.size&&"u-cell__body--large"),A:t.border},(t.border,{}),{B:e.n(t.customClass),C:e.s(c.addStyle(t.customStyle)),D:t.disabled||!t.clickable&&!t.isLink?"":"u-cell--clickable",E:e.o(((...e)=>c.clickHandler&&c.clickHandler(...e)))})}],["__scopeId","data-v-767dcd4e"]]);wx.createComponent(l);
