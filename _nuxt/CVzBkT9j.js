import{bh as t,bi as i,bl as e,bm as n}from"#entry";import{n as o,a as r}from"./mQLjjC5r.js";const a={getSpacingStyles:(t,i)=>Array.isArray(t)?t[i]?`var(--wui-spacing-${t[i]})`:void 0:"string"==typeof t?`var(--wui-spacing-${t})`:void 0,getFormattedDate:t=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(t),getHostName(t){try{return new URL(t).hostname}catch(i){return""}},getTruncateString:({string:t,charsStart:i,charsEnd:e,truncate:n})=>t.length<=i+e?t:"end"===n?`${t.substring(0,i)}...`:"start"===n?`...${t.substring(t.length-e)}`:`${t.substring(0,Math.floor(i))}...${t.substring(t.length-Math.floor(e))}`,generateAvatarColors(t){const i=t.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),e=this.hexToRgb(i),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),o=100-3*Number(n?.replace("px","")),r=`${o}% ${o}% at 65% 40%`,a=[];for(let l=0;l<5;l+=1){const t=this.tintColor(e,.15*l);a.push(`rgb(${t[0]}, ${t[1]}, ${t[2]})`)}return`\n    --local-color-1: ${a[0]};\n    --local-color-2: ${a[1]};\n    --local-color-3: ${a[2]};\n    --local-color-4: ${a[3]};\n    --local-color-5: ${a[4]};\n    --local-radial-circle: ${r}\n   `},hexToRgb(t){const i=parseInt(t,16);return[i>>16&255,i>>8&255,255&i]},tintColor(t,i){const[e,n,o]=t;return[Math.round(e+(255-e)*i),Math.round(n+(255-n)*i),Math.round(o+(255-o)*i)]},isNumber:t=>/^[0-9]+$/u.test(t),getColorTheme:t=>t||("undefined"!=typeof window&&window.matchMedia&&"function"==typeof window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark"),splitBalance(t){const i=t.split(".");return 2===i.length?[i[0],i[1]]:["0","00"]},roundNumber:(t,i,e)=>t.toString().length>=i?Number(t).toFixed(e):t};function l(t){return function(i){return"function"==typeof i?function(t,i){return customElements.get(t)||customElements.define(t,i),i}(t,i):function(t,i){const{kind:e,elements:n}=i;return{kind:e,elements:n,finisher(i){customElements.get(t)||customElements.define(t,i)}}}(t,i)}}const s=t`
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
  .wui-font-micro-600,
  .wui-font-micro-500 {
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
`;var p=function(t,i,e,n){var o,r=arguments.length,a=r<3?i:null===n?n=Object.getOwnPropertyDescriptor(i,e):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,i,e,n);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(a=(r<3?o(a):r>3?o(i,e,a):o(i,e))||a);return r>3&&a&&Object.defineProperty(i,e,a),a};let u=class extends e{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){const t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`\n      --local-align: ${this.align};\n      --local-color: var(--wui-color-${this.color});\n    `,n`<slot class=${r(t)}></slot>`}};u.styles=[i,s],p([o()],u.prototype,"variant",void 0),p([o()],u.prototype,"color",void 0),p([o()],u.prototype,"align",void 0),p([o()],u.prototype,"lineClamp",void 0),u=p([l("wui-text")],u);const c=t`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var g=function(t,i,e,n){var o,r=arguments.length,a=r<3?i:null===n?n=Object.getOwnPropertyDescriptor(i,e):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,i,e,n);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(a=(r<3?o(a):r>3?o(i,e,a):o(i,e))||a);return r>3&&a&&Object.defineProperty(i,e,a),a};let f=class extends e{render(){return this.style.cssText=`\n      flex-direction: ${this.flexDirection};\n      flex-wrap: ${this.flexWrap};\n      flex-basis: ${this.flexBasis};\n      flex-grow: ${this.flexGrow};\n      flex-shrink: ${this.flexShrink};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&a.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&a.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&a.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&a.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&a.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&a.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&a.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&a.getSpacingStyles(this.margin,3)};\n    `,n`<slot></slot>`}};f.styles=[i,c],g([o()],f.prototype,"flexDirection",void 0),g([o()],f.prototype,"flexWrap",void 0),g([o()],f.prototype,"flexBasis",void 0),g([o()],f.prototype,"flexGrow",void 0),g([o()],f.prototype,"flexShrink",void 0),g([o()],f.prototype,"alignItems",void 0),g([o()],f.prototype,"justifyContent",void 0),g([o()],f.prototype,"columnGap",void 0),g([o()],f.prototype,"rowGap",void 0),g([o()],f.prototype,"gap",void 0),g([o()],f.prototype,"padding",void 0),g([o()],f.prototype,"margin",void 0),f=g([l("wui-flex")],f);export{a as U,l as c};
