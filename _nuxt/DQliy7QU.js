import{a_ as o,a$ as t,b0 as r,b2 as e,b3 as a}from"#entry";import{n as s}from"./BmyCbnts.js";import{o as i}from"./DJ4s7H4Z.js";import{c as n}from"./DExhYf3k.js";const l=o`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var c=function(o,t,r,e){var a,s=arguments.length,i=s<3?t:null===e?e=Object.getOwnPropertyDescriptor(t,r):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(o,t,r,e);else for(var n=o.length-1;n>=0;n--)(a=o[n])&&(i=(s<3?a(i):s>3?a(t,r,i):a(t,r))||i);return s>3&&i&&Object.defineProperty(t,r,i),i};let d=class extends e{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return a`
      <button ?disabled=${this.disabled} tabindex=${i(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};d.styles=[t,r,l],c([s()],d.prototype,"tabIdx",void 0),c([s({type:Boolean})],d.prototype,"disabled",void 0),c([s()],d.prototype,"color",void 0),d=c([n("wui-link")],d);
