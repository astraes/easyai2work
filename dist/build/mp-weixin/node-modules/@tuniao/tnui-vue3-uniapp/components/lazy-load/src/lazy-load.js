"use strict";const e=require("../../../../../../common/vendor.js");Math||n();const n=()=>"../../icon/src/icon.js",r=e.defineComponent({options:{virtualHost:!0},__name:"lazy-load",props:e.lazyLoadProps,emits:e.lazyLoadEmits,setup(n){const r=n,{componentId:o,imageStatus:a,showImage:u,handleImageLoadedSuccess:i,handleImageLoadedFailed:d}=e.useLazyLoad(r),{ns:s,lazyLoadStyle:t}=e.useLazyLoadCustomStyle(r);return(n,r)=>e.e({a:"loading"===e.unref(a)},"loading"===e.unref(a)?{b:e.p({name:"loading"}),c:e.n(e.unref(s).e("loading__icon")),d:e.n(e.unref(s).e("loading")),e:e.n(e.unref(s).e("container"))}:{},{f:e.unref(u)&&"error"!==e.unref(a)},e.unref(u)&&"error"!==e.unref(a)?{g:e.n(e.unref(s).e("image")),h:e.n(e.unref(s).is("animation","loaded"===e.unref(a)&&n.transition)),i:e.n(e.unref(s).is("no-animation","loaded"===e.unref(a)&&!n.transition)),j:n.src,k:n.mode,l:e.o(((...n)=>e.unref(i)&&e.unref(i)(...n))),m:e.o(((...n)=>e.unref(d)&&e.unref(d)(...n))),n:e.n(e.unref(s).e("container"))}:{},{o:"error"===e.unref(a)},"error"===e.unref(a)?{p:e.p({name:"image-fill"}),q:e.n(e.unref(s).e("error")),r:e.n(e.unref(s).e("container"))}:{},{s:e.unref(o),t:e.n(e.unref(s).b()),v:e.n(e.unref(s).is("show-image",e.unref(u)&&"loaded"===e.unref(a))),w:e.s(e.unref(t))})}}),o=e._export_sfc(r,[["__scopeId","data-v-d6dd9a1e"]]);wx.createComponent(o);
