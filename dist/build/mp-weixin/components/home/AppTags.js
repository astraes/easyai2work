"use strict";const e=require("../../common/vendor.js"),o=require("../../stores/appStore.js");if(!Array){e.resolveComponent("up-tabs")()}Math;const n=e.defineComponent({__name:"AppTags",setup(n){const{workflows_all:t,home_tagActiveIndex:s,home_tagsList:a}=e.storeToRefs(o.useAppStore()),r=e.computed((()=>{var e;const o=[];return o.push({name:"全部",count:0}),null==(e=t.value)||e.forEach((e=>{null==e||e.tags.forEach((e=>{if(o.find((o=>o.name===e))){const n=o.findIndex((o=>o.name===e));o[n].count++}else o.push({name:e,count:1})})),o[0].count++})),o.sort(((e,o)=>o.count-e.count)),a.value=[...o],o})),u=e=>{console.log(e),s.value=e.index};return(o,n)=>({a:e.o(u),b:e.p({list:r.value})})}});wx.createComponent(n);
