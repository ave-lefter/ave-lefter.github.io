import"./DvO0AinD.js";import{i as t,t as i}from"./B_ot7u58.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=t=>null===t||"object"!=typeof t&&"function"!=typeof t,e=(t,i)=>{var s;const n=t._$AN;if(void 0===n)return!1;for(const o of n)null==(s=o._$AO)||s.call(o,i,!1),e(o,i);return!0},n=t=>{let i,s;do{if(void 0===(i=t._$AM))break;s=i._$AN,s.delete(t),t=i}while(0===(null==s?void 0:s.size))},o=t=>{for(let i;i=t._$AM;t=i){let s=i._$AN;if(void 0===s)i._$AN=s=new Set;else if(s.has(t))break;s.add(t),$(i)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function l(t){void 0!==this._$AN?(n(this),this._$AM=t,o(this)):this._$AM=t}function h(t,i=!1,s=0){const o=this._$AH,l=this._$AN;if(void 0!==l&&0!==l.size)if(i)if(Array.isArray(o))for(let h=s;h<o.length;h++)e(o[h],!1),n(o[h]);else null!=o&&(e(o,!1),n(o));else e(this,t)}const $=t=>{t.type==i.CHILD&&(t._$AP??(t._$AP=h),t._$AQ??(t._$AQ=l))};class _ extends t{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,s){super._$AT(t,i,s),o(this),this.isConnected=t._$AU}_$AO(t,i=!0){var s,o;t!==this.isConnected&&(this.isConnected=t,t?null==(s=this.reconnected)||s.call(this):null==(o=this.disconnected)||o.call(this)),i&&(e(this,t),n(this))}setValue(t){if(void 0===this._$Ct.strings)this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}export{_ as f,s as i};
