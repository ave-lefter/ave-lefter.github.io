import{aO as t}from"./DvO0AinD.js";import{f as s}from"./DS_txzci.js";import{e as i}from"./B_ot7u58.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=()=>new h;class h{}const o=new WeakMap,n=i(class extends s{render(s){return t}update(s,[i]){var e;const h=i!==this.G;return h&&void 0!==this.G&&this.rt(void 0),(h||this.lt!==this.ct)&&(this.G=i,this.ht=null==(e=s.options)?void 0:e.host,this.rt(this.ct=s.element)),t}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const s=this.ht??globalThis;let i=o.get(s);void 0===i&&(i=new WeakMap,o.set(s,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){var t,s;return"function"==typeof this.G?null==(t=o.get(this.ht??globalThis))?void 0:t.get(this.G):null==(s=this.G)?void 0:s.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{e,n};
