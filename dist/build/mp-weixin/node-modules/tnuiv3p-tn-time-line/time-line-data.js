"use strict";const e=require("../../common/vendor.js");Math||n();const n=()=>"../@tuniao/tnui-vue3-uniapp/components/icon/src/icon.js",t=e.defineComponent({options:{virtualHost:!0},__name:"time-line-data",props:e.timeLineDataProps,emits:e.timeLineDataEmits,setup(n,{emit:t}){const o=n,i=t,s=e.inject(e.timeLineKey,void 0),u=e.computed((()=>void 0===(null==s?void 0:s.showLine.value)||(null==s?void 0:s.showLine.value))),{ns:a,dotClass:c,dotStyle:m}=e.useTimeLineDataCustomStyle(o),r=()=>{i("click")};return(n,t)=>({a:e.p({name:n.dotIcon}),b:e.n(e.unref(a).e("dot")),c:e.n(e.unref(c)),d:e.s(e.unref(m)),e:e.n(e.unref(a).e("content")),f:e.n(e.unref(a).b()),g:e.n(e.unref(a).is("line",u.value)),h:e.o(r)})}});wx.createComponent(t);
