"use strict";const e=require("../../../../../../common/vendor.js");Math||o();const o=()=>"../../lazy-load/src/lazy-load.js",t=e.defineComponent({__name:"photo-album",props:e.photoAlbumProps,emits:e.photoAlbumEmits,setup(o,{emit:t}){const n=o,a=t,m=e.useNamespace("photo-album"),{imageData:r,imageClickEvent:d}=e.usePhotoAlbum(n,a),s=e.computed((()=>{const e={};let o=`calc(100% / ${n.column} - 20rpx)`;return e.width=e.paddingBottom=o,e}));return(o,t)=>({a:e.f(e.unref(r),((t,a,r)=>e.e(o.lazyLoad?{a:"d79d4130-0-"+r,b:e.p({src:t,mode:n.imgMode})}:{c:e.n(e.unref(m).e("item__image")),d:t,e:n.imgMode},{f:a,g:e.o((o=>e.unref(d)(a)),a)}))),b:o.lazyLoad,c:e.n(e.unref(m).e("item")),d:e.n(e.unref(m).e("container")),e:e.s(s.value),f:e.n(e.unref(m).b())})}}),n=e._export_sfc(t,[["__scopeId","data-v-d79d4130"]]);wx.createComponent(n);
