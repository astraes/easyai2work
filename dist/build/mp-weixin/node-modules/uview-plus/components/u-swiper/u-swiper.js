"use strict";const e=require("../../../../common/vendor.js"),t={name:"u-swiper",mixins:[e.mpMixin,e.mixin,e.props$14],data:()=>({currentIndex:0}),watch:{current(e,t){e!==t&&(this.currentIndex=e)}},emits:["click","change"],computed:{itemStyle(){return t=>{const i={};return this.nextMargin&&this.previousMargin&&(i.borderRadius=e.addUnit(this.radius),t!==this.currentIndex&&(i.transform="scale(0.92)")),i}}},methods:{addStyle:e.addStyle,addUnit:e.addUnit,testObject:e.test.object,testImage:e.test.image,getItemType(t){return"string"==typeof t?e.test.video(this.getSource(t))?"video":"image":"object"==typeof t&&this.keyName?t.type?"image"===t.type?"image":"video"===t.type?"video":"image":e.test.video(this.getSource(t))?"video":"image":void 0},getSource(e){return"string"==typeof e?e:"object"==typeof e&&this.keyName?e[this.keyName]:""},change(e){const{current:t}=e.detail;this.pauseVideo(this.currentIndex),this.currentIndex=t,this.$emit("change",e.detail)},pauseVideo(t){const i=this.getSource(this.list[t]);if(e.test.video(i)){e.index.createVideoContext(`video-${t}`,this).pause()}},getPoster:e=>"object"==typeof e&&e.poster?e.poster:"",clickHandler(e){this.$emit("click",e)}}};if(!Array){(e.resolveComponent("up-loading-icon")+e.resolveComponent("up-swiper-indicator"))()}Math||((()=>"../u-loading-icon/u-loading-icon.js")+(()=>"../u-swiper-indicator/u-swiper-indicator.js"))();const i=e._export_sfc(t,[["render",function(t,i,o,n,r,d){return e.e({a:t.loading},t.loading?{b:e.p({mode:"circle"})}:{c:e.f(t.list,((i,o,n)=>e.e({a:"image"===d.getItemType(i)},"image"===d.getItemType(i)?{b:d.getSource(i),c:t.imgMode,d:e.o((e=>d.clickHandler(o)),o),e:d.addUnit(t.height),f:d.addUnit(t.radius)}:{},{g:"video"===d.getItemType(i)},"video"===d.getItemType(i)?{h:`video-${o}`,i:d.getSource(i),j:d.getPoster(i),k:t.showTitle&&d.testObject(i)&&i.title?i.title:"",l:d.addUnit(t.height),m:e.o((e=>d.clickHandler(o)),o)}:{},{n:t.showTitle&&d.testObject(i)&&i.title&&d.testImage(d.getSource(i))},t.showTitle&&d.testObject(i)&&i.title&&d.testImage(d.getSource(i))?{o:e.t(i.title)}:{},{p:e.s(d.itemStyle(o)),q:"d-"+n,r:e.r("d",{item:i,index:o},n),s:o}))),d:d.addUnit(t.height),e:e.o(((...e)=>d.change&&d.change(...e))),f:t.circular,g:t.interval,h:t.duration,i:t.autoplay,j:t.current,k:t.currentItemId,l:d.addUnit(t.previousMargin),m:d.addUnit(t.nextMargin),n:t.acceleration,o:t.displayMultipleItems,p:t.easingFunction},{q:!t.loading&&t.indicator&&!t.showTitle},t.loading||!t.indicator||t.showTitle?{}:{r:e.p({indicatorActiveColor:t.indicatorActiveColor,indicatorInactiveColor:t.indicatorInactiveColor,length:t.list.length,current:r.currentIndex,indicatorMode:t.indicatorMode})},{s:e.s(d.addStyle(t.indicatorStyle)),t:t.bgColor,v:d.addUnit(t.height),w:d.addUnit(t.radius)})}],["__scopeId","data-v-eeef383b"]]);wx.createComponent(i);
