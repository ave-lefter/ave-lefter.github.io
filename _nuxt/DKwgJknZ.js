const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CqpQj4FJ.js","./CZ-fEcpL.js","./DIFfro1Y.js","./CKEe0377.js","./C-CsArvP.js","./BW2KeeDy.js","./DQf3hUqa.js","./CMTQXRe6.js","./DvDwad7z.js","./D2g4ordG.js","./DV44Bluy.js","./DdBwco3Q.js","./Ct3_zC9s.js","./D7ogFaw-.js","./PVEHctjt.js","./CCmfyDlS.js","./C8BowMU-.js","./CMo9HmEs.js","./CL47zORF.js","./ByGZb6S6.js","./D2j7XSWu.js","./8JopDrsq.js","./M3ltfHaV.js","./BANtlv8s.js","./-kckmQN2.js","./BwPxS-Mk.js","./2sLmcrNa.js","./B_WASYP5.js","./XMT1hewh.js","./NE8yFqO2.js","./DSHhHnMy.js","./DB6FurzM.js","./C6G7FWtw.js","./CJGqU9uM.js","./CK145qiu.js","./DybjVNh_.js","./BnasRXdO.js","./DGxWD9Sm.js","./IOUIjpti.js","./DG-xmUmR.js","./BzEtp1CL.js","./5kB-EiTd.js","./CprFwP2T.js","./BcRwbWyp.js","./DjL3xo7y.js","./NRnSrkpx.js","./CqSm3bhI.js","./BuilTkZM.js","./CIAsoX7j.js","./BAeddFbX.js","./CYbSw1w5.js","./CINOJ9B2.js","./DOeQK8_7.js","./DiQJiZ8m.js","./GE2_jXQr.js","./CHI72XWN.js","./B4mZIip5.js","./D1R-Pfxb.js","./BNyeSKud.js","./DlC6nfH9.js","./C-fqBgxk.js","./Dp8VQa6B.js","./e6bvnEbk.js","./CbeRJSdm.js","./C16jxGFk.js","./DXzjpy47.js","./ByzU_kLh.js","./BfLr7xZ8.js","./BTF0Gc5u.js","./CCQ4XhM1.js","./BdoabGW3.js","./CGiscfhm.js","./BLc9WMTZ.js","./B4oDoXYc.js","./CfouuUY7.js","./D_u58mDO.js"])))=>i.map(i=>d[i]);
import{i as t,a as r}from"./CZ-fEcpL.js";import{x as e,E as a,T as o}from"./DIFfro1Y.js";import{n as i,i as n,t as s,a as c,e as l}from"./Dh1RFCXV.js";import{r as g,k as p,e as u}from"./D2lrfLzB.js";import{c5 as m}from"./DTfPz4Fz.js";const v={getSpacingStyles:(t,r)=>Array.isArray(t)?t[r]?`var(--wui-spacing-${t[r]})`:void 0:"string"==typeof t?`var(--wui-spacing-${t})`:void 0,getFormattedDate:t=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(t),getHostName(t){try{return new URL(t).hostname}catch(r){return""}},getTruncateString:({string:t,charsStart:r,charsEnd:e,truncate:a})=>t.length<=r+e?t:"end"===a?`${t.substring(0,r)}...`:"start"===a?`...${t.substring(t.length-e)}`:`${t.substring(0,Math.floor(r))}...${t.substring(t.length-Math.floor(e))}`,generateAvatarColors(t){const r=t.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),e=this.hexToRgb(r),a=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),o=100-3*Number(null==a?void 0:a.replace("px","")),i=`${o}% ${o}% at 65% 40%`,n=[];for(let s=0;s<5;s+=1){const t=this.tintColor(e,.15*s);n.push(`rgb(${t[0]}, ${t[1]}, ${t[2]})`)}return`\n    --local-color-1: ${n[0]};\n    --local-color-2: ${n[1]};\n    --local-color-3: ${n[2]};\n    --local-color-4: ${n[3]};\n    --local-color-5: ${n[4]};\n    --local-radial-circle: ${i}\n   `},hexToRgb(t){const r=parseInt(t,16);return[r>>16&255,r>>8&255,255&r]},tintColor(t,r){const[e,a,o]=t;return[Math.round(e+(255-e)*r),Math.round(a+(255-a)*r),Math.round(o+(255-o)*r)]},isNumber:t=>/^[0-9]+$/u.test(t),getColorTheme(t){var r;return t||("undefined"!=typeof window&&window.matchMedia?(null==(r=window.matchMedia("(prefers-color-scheme: dark)"))?void 0:r.matches)?"dark":"light":"dark")},splitBalance(t){const r=t.split(".");return 2===r.length?[r[0],r[1]]:["0","00"]},roundNumber:(t,r,e)=>t.toString().length>=r?Number(t).toFixed(e):t,formatNumberToLocalString:(t,r=2)=>void 0===t?"0.00":"number"==typeof t?t.toLocaleString("en-US",{maximumFractionDigits:r,minimumFractionDigits:r}):parseFloat(t).toLocaleString("en-US",{maximumFractionDigits:r,minimumFractionDigits:r})};function w(t){return function(r){return"function"==typeof r?function(t,r){return customElements.get(t)||customElements.define(t,r),r}(t,r):function(t,r){const{kind:e,elements:a}=r;return{kind:e,elements:a,finisher(r){customElements.get(t)||customElements.define(t,r)}}}(t,r)}}const h=t`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var _=function(t,r,e,a){var o,i=arguments.length,n=i<3?r:null===a?a=Object.getOwnPropertyDescriptor(r,e):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,e,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(i<3?o(n):i>3?o(r,e,n):o(r,e))||n);return i>3&&n&&Object.defineProperty(r,e,n),n};let d=class extends r{render(){return this.style.cssText=`\n      flex-direction: ${this.flexDirection};\n      flex-wrap: ${this.flexWrap};\n      flex-basis: ${this.flexBasis};\n      flex-grow: ${this.flexGrow};\n      flex-shrink: ${this.flexShrink};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&v.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&v.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&v.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&v.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&v.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&v.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&v.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&v.getSpacingStyles(this.margin,3)};\n    `,e`<slot></slot>`}};d.styles=[g,h],_([i()],d.prototype,"flexDirection",void 0),_([i()],d.prototype,"flexWrap",void 0),_([i()],d.prototype,"flexBasis",void 0),_([i()],d.prototype,"flexGrow",void 0),_([i()],d.prototype,"flexShrink",void 0),_([i()],d.prototype,"alignItems",void 0),_([i()],d.prototype,"justifyContent",void 0),_([i()],d.prototype,"columnGap",void 0),_([i()],d.prototype,"rowGap",void 0),_([i()],d.prototype,"gap",void 0),_([i()],d.prototype,"padding",void 0),_([i()],d.prototype,"margin",void 0),d=_([w("wui-flex")],d);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y=t=>t??a
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,f=(t,r)=>{var e;const a=t._$AN;if(void 0===a)return!1;for(const o of a)null==(e=o._$AO)||e.call(o,r,!1),f(o,r);return!0},S=t=>{let r,e;do{if(void 0===(r=t._$AM))break;e=r._$AN,e.delete(t),t=r}while(0===(null==e?void 0:e.size))},E=t=>{for(let r;r=t._$AM;t=r){let e=r._$AN;if(void 0===e)r._$AN=e=new Set;else if(e.has(t))break;e.add(t),x(r)}};function b(t){void 0!==this._$AN?(S(this),this._$AM=t,E(this)):this._$AM=t}function $(t,r=!1,e=0){const a=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(r)if(Array.isArray(a))for(let i=e;i<a.length;i++)f(a[i],!1),S(a[i]);else null!=a&&(f(a,!1),S(a));else f(this,t)}const x=t=>{t.type==s.CHILD&&(t._$AP??(t._$AP=$),t._$AQ??(t._$AQ=b))};class R extends n{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,r,e){super._$AT(t,r,e),E(this),this.isConnected=t._$AU}_$AO(t,r=!0){var e,a;t!==this.isConnected&&(this.isConnected=t,t?null==(e=this.reconnected)||e.call(this):null==(a=this.disconnected)||a.call(this)),r&&(f(this,t),S(this))}setValue(t){if(void 0===this._$Ct.strings)this._$Ct._$AI(t,this);else{const r=[...this._$Ct._$AH];r[this._$Ci]=t,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class j{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}}class P{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??(this.Y=new Promise((t=>this.Z=t)))}resume(){var t;null==(t=this.Z)||t.call(this),this.Y=this.Z=void 0}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const A=t=>{return!(r=t,null===r||"object"!=typeof r&&"function"!=typeof r||"function"!=typeof t.then);var r},T=1073741823;const O=c(class extends R{constructor(){super(...arguments),this._$Cwt=T,this._$Cbt=[],this._$CK=new j(this),this._$CX=new P}render(...t){return t.find((t=>!A(t)))??o}update(t,r){const e=this._$Cbt;let a=e.length;this._$Cbt=r;const i=this._$CK,n=this._$CX;this.isConnected||this.disconnected();for(let o=0;o<r.length&&!(o>this._$Cwt);o++){const t=r[o];if(!A(t))return this._$Cwt=o,t;o<a&&t===e[o]||(this._$Cwt=T,a=0,Promise.resolve(t).then((async r=>{for(;n.get();)await n.get();const e=i.deref();if(void 0!==e){const a=e._$Cbt.indexOf(t);a>-1&&a<e._$Cwt&&(e._$Cwt=a,e.setValue(r))}})))}return o}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}});const L=new class{constructor(){this.cache=new Map}set(t,r){this.cache.set(t,r)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},k=t`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;var D=function(t,r,e,a){var o,i=arguments.length,n=i<3?r:null===a?a=Object.getOwnPropertyDescriptor(r,e):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,e,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(i<3?o(n):i>3?o(r,e,n):o(r,e))||n);return i>3&&n&&Object.defineProperty(r,e,n),n};const I={add:async()=>(await m((async()=>{const{addSvg:t}=await import("./CqpQj4FJ.js");return{addSvg:t}}),__vite__mapDeps([0,1,2]),import.meta.url)).addSvg,allWallets:async()=>(await m((async()=>{const{allWalletsSvg:t}=await import("./CKEe0377.js");return{allWalletsSvg:t}}),__vite__mapDeps([3,1,2]),import.meta.url)).allWalletsSvg,arrowBottomCircle:async()=>(await m((async()=>{const{arrowBottomCircleSvg:t}=await import("./C-CsArvP.js");return{arrowBottomCircleSvg:t}}),__vite__mapDeps([4,1,2]),import.meta.url)).arrowBottomCircleSvg,appStore:async()=>(await m((async()=>{const{appStoreSvg:t}=await import("./BW2KeeDy.js");return{appStoreSvg:t}}),__vite__mapDeps([5,1,2]),import.meta.url)).appStoreSvg,apple:async()=>(await m((async()=>{const{appleSvg:t}=await import("./DQf3hUqa.js");return{appleSvg:t}}),__vite__mapDeps([6,1,2]),import.meta.url)).appleSvg,arrowBottom:async()=>(await m((async()=>{const{arrowBottomSvg:t}=await import("./CMTQXRe6.js");return{arrowBottomSvg:t}}),__vite__mapDeps([7,1,2]),import.meta.url)).arrowBottomSvg,arrowLeft:async()=>(await m((async()=>{const{arrowLeftSvg:t}=await import("./DvDwad7z.js");return{arrowLeftSvg:t}}),__vite__mapDeps([8,1,2]),import.meta.url)).arrowLeftSvg,arrowRight:async()=>(await m((async()=>{const{arrowRightSvg:t}=await import("./D2g4ordG.js");return{arrowRightSvg:t}}),__vite__mapDeps([9,1,2]),import.meta.url)).arrowRightSvg,arrowTop:async()=>(await m((async()=>{const{arrowTopSvg:t}=await import("./DV44Bluy.js");return{arrowTopSvg:t}}),__vite__mapDeps([10,1,2]),import.meta.url)).arrowTopSvg,bank:async()=>(await m((async()=>{const{bankSvg:t}=await import("./DdBwco3Q.js");return{bankSvg:t}}),__vite__mapDeps([11,1,2]),import.meta.url)).bankSvg,browser:async()=>(await m((async()=>{const{browserSvg:t}=await import("./Ct3_zC9s.js");return{browserSvg:t}}),__vite__mapDeps([12,1,2]),import.meta.url)).browserSvg,card:async()=>(await m((async()=>{const{cardSvg:t}=await import("./D7ogFaw-.js");return{cardSvg:t}}),__vite__mapDeps([13,1,2]),import.meta.url)).cardSvg,checkmark:async()=>(await m((async()=>{const{checkmarkSvg:t}=await import("./PVEHctjt.js");return{checkmarkSvg:t}}),__vite__mapDeps([14,1,2]),import.meta.url)).checkmarkSvg,checkmarkBold:async()=>(await m((async()=>{const{checkmarkBoldSvg:t}=await import("./CCmfyDlS.js");return{checkmarkBoldSvg:t}}),__vite__mapDeps([15,1,2]),import.meta.url)).checkmarkBoldSvg,chevronBottom:async()=>(await m((async()=>{const{chevronBottomSvg:t}=await import("./C8BowMU-.js");return{chevronBottomSvg:t}}),__vite__mapDeps([16,1,2]),import.meta.url)).chevronBottomSvg,chevronLeft:async()=>(await m((async()=>{const{chevronLeftSvg:t}=await import("./CMo9HmEs.js");return{chevronLeftSvg:t}}),__vite__mapDeps([17,1,2]),import.meta.url)).chevronLeftSvg,chevronRight:async()=>(await m((async()=>{const{chevronRightSvg:t}=await import("./CL47zORF.js");return{chevronRightSvg:t}}),__vite__mapDeps([18,1,2]),import.meta.url)).chevronRightSvg,chevronTop:async()=>(await m((async()=>{const{chevronTopSvg:t}=await import("./ByGZb6S6.js");return{chevronTopSvg:t}}),__vite__mapDeps([19,1,2]),import.meta.url)).chevronTopSvg,chromeStore:async()=>(await m((async()=>{const{chromeStoreSvg:t}=await import("./D2j7XSWu.js");return{chromeStoreSvg:t}}),__vite__mapDeps([20,1,2]),import.meta.url)).chromeStoreSvg,clock:async()=>(await m((async()=>{const{clockSvg:t}=await import("./8JopDrsq.js");return{clockSvg:t}}),__vite__mapDeps([21,1,2]),import.meta.url)).clockSvg,close:async()=>(await m((async()=>{const{closeSvg:t}=await import("./M3ltfHaV.js");return{closeSvg:t}}),__vite__mapDeps([22,1,2]),import.meta.url)).closeSvg,compass:async()=>(await m((async()=>{const{compassSvg:t}=await import("./BANtlv8s.js");return{compassSvg:t}}),__vite__mapDeps([23,1,2]),import.meta.url)).compassSvg,coinPlaceholder:async()=>(await m((async()=>{const{coinPlaceholderSvg:t}=await import("./-kckmQN2.js");return{coinPlaceholderSvg:t}}),__vite__mapDeps([24,1,2]),import.meta.url)).coinPlaceholderSvg,copy:async()=>(await m((async()=>{const{copySvg:t}=await import("./BwPxS-Mk.js");return{copySvg:t}}),__vite__mapDeps([25,1,2]),import.meta.url)).copySvg,cursor:async()=>(await m((async()=>{const{cursorSvg:t}=await import("./2sLmcrNa.js");return{cursorSvg:t}}),__vite__mapDeps([26,1,2]),import.meta.url)).cursorSvg,cursorTransparent:async()=>(await m((async()=>{const{cursorTransparentSvg:t}=await import("./B_WASYP5.js");return{cursorTransparentSvg:t}}),__vite__mapDeps([27,1,2]),import.meta.url)).cursorTransparentSvg,desktop:async()=>(await m((async()=>{const{desktopSvg:t}=await import("./XMT1hewh.js");return{desktopSvg:t}}),__vite__mapDeps([28,1,2]),import.meta.url)).desktopSvg,disconnect:async()=>(await m((async()=>{const{disconnectSvg:t}=await import("./NE8yFqO2.js");return{disconnectSvg:t}}),__vite__mapDeps([29,1,2]),import.meta.url)).disconnectSvg,discord:async()=>(await m((async()=>{const{discordSvg:t}=await import("./DSHhHnMy.js");return{discordSvg:t}}),__vite__mapDeps([30,1,2]),import.meta.url)).discordSvg,etherscan:async()=>(await m((async()=>{const{etherscanSvg:t}=await import("./DB6FurzM.js");return{etherscanSvg:t}}),__vite__mapDeps([31,1,2]),import.meta.url)).etherscanSvg,extension:async()=>(await m((async()=>{const{extensionSvg:t}=await import("./C6G7FWtw.js");return{extensionSvg:t}}),__vite__mapDeps([32,1,2]),import.meta.url)).extensionSvg,externalLink:async()=>(await m((async()=>{const{externalLinkSvg:t}=await import("./CJGqU9uM.js");return{externalLinkSvg:t}}),__vite__mapDeps([33,1,2]),import.meta.url)).externalLinkSvg,facebook:async()=>(await m((async()=>{const{facebookSvg:t}=await import("./CK145qiu.js");return{facebookSvg:t}}),__vite__mapDeps([34,1,2]),import.meta.url)).facebookSvg,farcaster:async()=>(await m((async()=>{const{farcasterSvg:t}=await import("./DybjVNh_.js");return{farcasterSvg:t}}),__vite__mapDeps([35,1,2]),import.meta.url)).farcasterSvg,filters:async()=>(await m((async()=>{const{filtersSvg:t}=await import("./BnasRXdO.js");return{filtersSvg:t}}),__vite__mapDeps([36,1,2]),import.meta.url)).filtersSvg,github:async()=>(await m((async()=>{const{githubSvg:t}=await import("./DGxWD9Sm.js");return{githubSvg:t}}),__vite__mapDeps([37,1,2]),import.meta.url)).githubSvg,google:async()=>(await m((async()=>{const{googleSvg:t}=await import("./IOUIjpti.js");return{googleSvg:t}}),__vite__mapDeps([38,1,2]),import.meta.url)).googleSvg,helpCircle:async()=>(await m((async()=>{const{helpCircleSvg:t}=await import("./DG-xmUmR.js");return{helpCircleSvg:t}}),__vite__mapDeps([39,1,2]),import.meta.url)).helpCircleSvg,image:async()=>(await m((async()=>{const{imageSvg:t}=await import("./BzEtp1CL.js");return{imageSvg:t}}),__vite__mapDeps([40,1,2]),import.meta.url)).imageSvg,id:async()=>(await m((async()=>{const{idSvg:t}=await import("./5kB-EiTd.js");return{idSvg:t}}),__vite__mapDeps([41,1,2]),import.meta.url)).idSvg,infoCircle:async()=>(await m((async()=>{const{infoCircleSvg:t}=await import("./CprFwP2T.js");return{infoCircleSvg:t}}),__vite__mapDeps([42,1,2]),import.meta.url)).infoCircleSvg,lightbulb:async()=>(await m((async()=>{const{lightbulbSvg:t}=await import("./BcRwbWyp.js");return{lightbulbSvg:t}}),__vite__mapDeps([43,1,2]),import.meta.url)).lightbulbSvg,mail:async()=>(await m((async()=>{const{mailSvg:t}=await import("./DjL3xo7y.js");return{mailSvg:t}}),__vite__mapDeps([44,1,2]),import.meta.url)).mailSvg,mobile:async()=>(await m((async()=>{const{mobileSvg:t}=await import("./NRnSrkpx.js");return{mobileSvg:t}}),__vite__mapDeps([45,1,2]),import.meta.url)).mobileSvg,more:async()=>(await m((async()=>{const{moreSvg:t}=await import("./CqSm3bhI.js");return{moreSvg:t}}),__vite__mapDeps([46,1,2]),import.meta.url)).moreSvg,networkPlaceholder:async()=>(await m((async()=>{const{networkPlaceholderSvg:t}=await import("./BuilTkZM.js");return{networkPlaceholderSvg:t}}),__vite__mapDeps([47,1,2]),import.meta.url)).networkPlaceholderSvg,nftPlaceholder:async()=>(await m((async()=>{const{nftPlaceholderSvg:t}=await import("./CIAsoX7j.js");return{nftPlaceholderSvg:t}}),__vite__mapDeps([48,1,2]),import.meta.url)).nftPlaceholderSvg,off:async()=>(await m((async()=>{const{offSvg:t}=await import("./BAeddFbX.js");return{offSvg:t}}),__vite__mapDeps([49,1,2]),import.meta.url)).offSvg,playStore:async()=>(await m((async()=>{const{playStoreSvg:t}=await import("./CYbSw1w5.js");return{playStoreSvg:t}}),__vite__mapDeps([50,1,2]),import.meta.url)).playStoreSvg,plus:async()=>(await m((async()=>{const{plusSvg:t}=await import("./CINOJ9B2.js");return{plusSvg:t}}),__vite__mapDeps([51,1,2]),import.meta.url)).plusSvg,qrCode:async()=>(await m((async()=>{const{qrCodeIcon:t}=await import("./DOeQK8_7.js");return{qrCodeIcon:t}}),__vite__mapDeps([52,1,2]),import.meta.url)).qrCodeIcon,recycleHorizontal:async()=>(await m((async()=>{const{recycleHorizontalSvg:t}=await import("./DiQJiZ8m.js");return{recycleHorizontalSvg:t}}),__vite__mapDeps([53,1,2]),import.meta.url)).recycleHorizontalSvg,refresh:async()=>(await m((async()=>{const{refreshSvg:t}=await import("./GE2_jXQr.js");return{refreshSvg:t}}),__vite__mapDeps([54,1,2]),import.meta.url)).refreshSvg,search:async()=>(await m((async()=>{const{searchSvg:t}=await import("./CHI72XWN.js");return{searchSvg:t}}),__vite__mapDeps([55,1,2]),import.meta.url)).searchSvg,send:async()=>(await m((async()=>{const{sendSvg:t}=await import("./B4mZIip5.js");return{sendSvg:t}}),__vite__mapDeps([56,1,2]),import.meta.url)).sendSvg,swapHorizontal:async()=>(await m((async()=>{const{swapHorizontalSvg:t}=await import("./D1R-Pfxb.js");return{swapHorizontalSvg:t}}),__vite__mapDeps([57,1,2]),import.meta.url)).swapHorizontalSvg,swapHorizontalMedium:async()=>(await m((async()=>{const{swapHorizontalMediumSvg:t}=await import("./BNyeSKud.js");return{swapHorizontalMediumSvg:t}}),__vite__mapDeps([58,1,2]),import.meta.url)).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await m((async()=>{const{swapHorizontalBoldSvg:t}=await import("./DlC6nfH9.js");return{swapHorizontalBoldSvg:t}}),__vite__mapDeps([59,1,2]),import.meta.url)).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await m((async()=>{const{swapHorizontalRoundedBoldSvg:t}=await import("./C-fqBgxk.js");return{swapHorizontalRoundedBoldSvg:t}}),__vite__mapDeps([60,1,2]),import.meta.url)).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await m((async()=>{const{swapVerticalSvg:t}=await import("./Dp8VQa6B.js");return{swapVerticalSvg:t}}),__vite__mapDeps([61,1,2]),import.meta.url)).swapVerticalSvg,telegram:async()=>(await m((async()=>{const{telegramSvg:t}=await import("./e6bvnEbk.js");return{telegramSvg:t}}),__vite__mapDeps([62,1,2]),import.meta.url)).telegramSvg,threeDots:async()=>(await m((async()=>{const{threeDotsSvg:t}=await import("./CbeRJSdm.js");return{threeDotsSvg:t}}),__vite__mapDeps([63,1,2]),import.meta.url)).threeDotsSvg,twitch:async()=>(await m((async()=>{const{twitchSvg:t}=await import("./C16jxGFk.js");return{twitchSvg:t}}),__vite__mapDeps([64,1,2]),import.meta.url)).twitchSvg,twitter:async()=>(await m((async()=>{const{xSvg:t}=await import("./DXzjpy47.js");return{xSvg:t}}),__vite__mapDeps([65,1,2]),import.meta.url)).xSvg,twitterIcon:async()=>(await m((async()=>{const{twitterIconSvg:t}=await import("./ByzU_kLh.js");return{twitterIconSvg:t}}),__vite__mapDeps([66,1,2]),import.meta.url)).twitterIconSvg,verify:async()=>(await m((async()=>{const{verifySvg:t}=await import("./BfLr7xZ8.js");return{verifySvg:t}}),__vite__mapDeps([67,1,2]),import.meta.url)).verifySvg,verifyFilled:async()=>(await m((async()=>{const{verifyFilledSvg:t}=await import("./BTF0Gc5u.js");return{verifyFilledSvg:t}}),__vite__mapDeps([68,1,2]),import.meta.url)).verifyFilledSvg,wallet:async()=>(await m((async()=>{const{walletSvg:t}=await import("./CCQ4XhM1.js");return{walletSvg:t}}),__vite__mapDeps([69,1,2]),import.meta.url)).walletSvg,walletConnect:async()=>(await m((async()=>{const{walletConnectSvg:t}=await import("./BdoabGW3.js");return{walletConnectSvg:t}}),__vite__mapDeps([70,1,2]),import.meta.url)).walletConnectSvg,walletConnectLightBrown:async()=>(await m((async()=>{const{walletConnectLightBrownSvg:t}=await import("./BdoabGW3.js");return{walletConnectLightBrownSvg:t}}),__vite__mapDeps([70,1,2]),import.meta.url)).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await m((async()=>{const{walletConnectBrownSvg:t}=await import("./BdoabGW3.js");return{walletConnectBrownSvg:t}}),__vite__mapDeps([70,1,2]),import.meta.url)).walletConnectBrownSvg,walletPlaceholder:async()=>(await m((async()=>{const{walletPlaceholderSvg:t}=await import("./CGiscfhm.js");return{walletPlaceholderSvg:t}}),__vite__mapDeps([71,1,2]),import.meta.url)).walletPlaceholderSvg,warningCircle:async()=>(await m((async()=>{const{warningCircleSvg:t}=await import("./BLc9WMTZ.js");return{warningCircleSvg:t}}),__vite__mapDeps([72,1,2]),import.meta.url)).warningCircleSvg,x:async()=>(await m((async()=>{const{xSvg:t}=await import("./DXzjpy47.js");return{xSvg:t}}),__vite__mapDeps([65,1,2]),import.meta.url)).xSvg,info:async()=>(await m((async()=>{const{infoSvg:t}=await import("./B4oDoXYc.js");return{infoSvg:t}}),__vite__mapDeps([73,1,2]),import.meta.url)).infoSvg,exclamationTriangle:async()=>(await m((async()=>{const{exclamationTriangleSvg:t}=await import("./CfouuUY7.js");return{exclamationTriangleSvg:t}}),__vite__mapDeps([74,1,2]),import.meta.url)).exclamationTriangleSvg,reown:async()=>(await m((async()=>{const{reownSvg:t}=await import("./D_u58mDO.js");return{reownSvg:t}}),__vite__mapDeps([75,1,2]),import.meta.url)).reownSvg};let C=class extends r{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`\n      --local-color: var(--wui-color-${this.color});\n      --local-width: var(--wui-icon-size-${this.size});\n      --local-aspect-ratio: ${this.aspectRatio}\n    `,e`${O(async function(t){if(L.has(t))return L.get(t);const r=(I[t]??I.copy)();return L.set(t,r),r}(this.name),e`<div class="fallback"></div>`)}`}};C.styles=[g,p,k],D([i()],C.prototype,"size",void 0),D([i()],C.prototype,"name",void 0),D([i()],C.prototype,"color",void 0),D([i()],C.prototype,"aspectRatio",void 0),C=D([w("wui-icon")],C);const z=t`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;var V=function(t,r,e,a){var o,i=arguments.length,n=i<3?r:null===a?a=Object.getOwnPropertyDescriptor(r,e):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,e,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(i<3?o(n):i>3?o(r,e,n):o(r,e))||n);return i>3&&n&&Object.defineProperty(r,e,n),n};let B=class extends r{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){const t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`\n      --local-align: ${this.align};\n      --local-color: var(--wui-color-${this.color});\n    `,e`<slot class=${l(t)}></slot>`}};B.styles=[g,z],V([i()],B.prototype,"variant",void 0),V([i()],B.prototype,"color",void 0),V([i()],B.prototype,"align",void 0),V([i()],B.prototype,"lineClamp",void 0),B=V([w("wui-text")],B);const H=t`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var M=function(t,r,e,a){var o,i=arguments.length,n=i<3?r:null===a?a=Object.getOwnPropertyDescriptor(r,e):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,e,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(i<3?o(n):i>3?o(r,e,n):o(r,e))||n);return i>3&&n&&Object.defineProperty(r,e,n),n};let F=class extends r{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const t=this.iconSize||this.size,r="lg"===this.size,a="xl"===this.size,o=r?"12%":"16%",i=r?"xxs":a?"s":"3xl",n="gray"===this.background,s="opaque"===this.background,c="accent-100"===this.backgroundColor&&s||"success-100"===this.backgroundColor&&s||"error-100"===this.backgroundColor&&s||"inverse-100"===this.backgroundColor&&s;let l=`var(--wui-color-${this.backgroundColor})`;return c?l=`var(--wui-icon-box-bg-${this.backgroundColor})`:n&&(l=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`\n       --local-bg-value: ${l};\n       --local-bg-mix: ${c||n?"100%":o};\n       --local-border-radius: var(--wui-border-radius-${i});\n       --local-size: var(--wui-icon-box-size-${this.size});\n       --local-border: ${"wui-color-bg-125"===this.borderColor?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}\n   `,e` <wui-icon color=${this.iconColor} size=${t} name=${this.icon}></wui-icon> `}};F.styles=[g,u,H],M([i()],F.prototype,"size",void 0),M([i()],F.prototype,"backgroundColor",void 0),M([i()],F.prototype,"iconColor",void 0),M([i()],F.prototype,"iconSize",void 0),M([i()],F.prototype,"background",void 0),M([i({type:Boolean})],F.prototype,"border",void 0),M([i()],F.prototype,"borderColor",void 0),M([i()],F.prototype,"icon",void 0),F=M([w("wui-icon-box")],F);const G=t`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var N=function(t,r,e,a){var o,i=arguments.length,n=i<3?r:null===a?a=Object.getOwnPropertyDescriptor(r,e):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,e,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(i<3?o(n):i>3?o(r,e,n):o(r,e))||n);return i>3&&n&&Object.defineProperty(r,e,n),n};let Y=class extends r{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`\n      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      `,e`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};Y.styles=[g,p,G],N([i()],Y.prototype,"src",void 0),N([i()],Y.prototype,"alt",void 0),N([i()],Y.prototype,"size",void 0),Y=N([w("wui-image")],Y);const q=t`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`;var U=function(t,r,e,a){var o,i=arguments.length,n=i<3?r:null===a?a=Object.getOwnPropertyDescriptor(r,e):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,e,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(i<3?o(n):i>3?o(r,e,n):o(r,e))||n);return i>3&&n&&Object.defineProperty(r,e,n),n};let W=class extends r{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;const t="md"===this.size?"mini-700":"micro-700";return e`
      <wui-text data-variant=${this.variant} variant=${t} color="inherit">
        <slot></slot>
      </wui-text>
    `}};W.styles=[g,q],U([i()],W.prototype,"variant",void 0),U([i()],W.prototype,"size",void 0),W=U([w("wui-tag")],W);const K=t`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var X=function(t,r,e,a){var o,i=arguments.length,n=i<3?r:null===a?a=Object.getOwnPropertyDescriptor(r,e):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,e,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(i<3?o(n):i>3?o(r,e,n):o(r,e))||n);return i>3&&n&&Object.defineProperty(r,e,n),n};let Z=class extends r{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText="--local-color: "+("inherit"===this.color?"inherit":`var(--wui-color-${this.color})`),this.dataset.size=this.size,e`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};Z.styles=[g,K],X([i()],Z.prototype,"color",void 0),X([i()],Z.prototype,"size",void 0),Z=X([w("wui-loading-spinner")],Z);export{v as U,w as c,R as f,y as o};
