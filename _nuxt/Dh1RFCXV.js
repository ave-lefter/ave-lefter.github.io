import{f as t,u as e}from"./CZ-fEcpL.js";import{T as s}from"./DIFfro1Y.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r={attribute:!0,type:String,converter:e,reflect:!1,hasChanged:t},n=(t=r,e,s)=>{const{kind:n,metadata:i}=s;let o=globalThis.litPropertyMetadata.get(i);if(void 0===o&&globalThis.litPropertyMetadata.set(i,o=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===n){const{name:r}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(r,n,t)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===n){const{name:r}=s;return function(s){const n=this[r];e.call(this,s),this.requestUpdate(r,n,t)}}throw Error("Unsupported decorator location: "+n)};function i(t){return(e,s)=>"object"==typeof s?n(t,e,s):((t,e,s)=>{const r=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),r?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function o(t){return i({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const a={ATTRIBUTE:1,CHILD:2},c=t=>(...e)=>({_$litDirective$:t,values:e});class h{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=c(class extends h{constructor(t){var e;if(super(t),t.type!==a.ATTRIBUTE||"class"!==t.name||(null==(e=t.strings)?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var r,n;if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null==(r=this.nt)?void 0:r.has(t))&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const s of this.st)s in e||(i.remove(s),this.st.delete(s));for(const s in e){const t=!!e[s];t===this.st.has(s)||(null==(n=this.nt)?void 0:n.has(s))||(t?(i.add(s),this.st.add(s)):(i.remove(s),this.st.delete(s)))}return s}});export{c as a,l as e,h as i,i as n,o as r,a as t};
