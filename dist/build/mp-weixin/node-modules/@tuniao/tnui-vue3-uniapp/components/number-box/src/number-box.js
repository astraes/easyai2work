"use strict";const e=require("../../../../../../common/vendor.js");Math||n();const n=()=>"../../icon/src/icon.js",r=e.defineComponent({__name:"number-box",props:e.numberBoxProps,emits:e.numberBoxEmits,setup(n){const r=n,{inputValue:u,handleOperationEvent:o,clearLongPressTimer:s,numberBoxInputEvent:t}=e.useNumberBox(r),{ns:p,numberBoxClass:m,numberBoxStyle:a,numberBoxOperationWrapperClass:i,numberBoxOperationWrapperStyle:f}=e.useNumberBoxCustomStyle(r,u);return(n,r)=>({a:e.p({name:"reduce"}),b:e.n(e.unref(p).e("operation-btn")),c:e.n(e.unref(p).em("operation-btn","minus")),d:e.n(e.unref(i)("minus")),e:e.s(e.unref(f)("minus")),f:e.o((n=>e.unref(o)("minus"))),g:e.o(((...n)=>e.unref(s)&&e.unref(s)(...n))),h:n.disabled||n.inputDisabled,i:e.o([e.m((n=>e.isRef(u)?u.value=n.detail.value:null),{number:!0}),(...n)=>e.unref(t)&&e.unref(t)(...n)]),j:e.unref(u),k:e.n(e.unref(p).e("input")),l:e.n(e.unref(i)("input")),m:e.s(e.unref(f)("input")),n:e.p({name:"add"}),o:e.n(e.unref(p).e("operation-btn")),p:e.n(e.unref(p).em("operation-btn","plus")),q:e.n(e.unref(i)("plus")),r:e.s(e.unref(f)("plus")),s:e.o((n=>e.unref(o)("plus"))),t:e.o(((...n)=>e.unref(s)&&e.unref(s)(...n))),v:e.n(e.unref(m)),w:e.s(e.unref(a))})}}),u=e._export_sfc(r,[["__scopeId","data-v-49b3a3ec"]]);wx.createComponent(u);
