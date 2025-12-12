import{b3 as o,b4 as t,b5 as r,b7 as e,b8 as s}from"./DvO0AinD.js";import{n as a}from"./B_ot7u58.js";import{o as i}from"./4RH0AGma.js";import{c as l}from"./Bo-PKsy5.js";const n=o`
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
`;var c=function(o,t,r,e){var s,a=arguments.length,i=a<3?t:null===e?e=Object.getOwnPropertyDescriptor(t,r):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(o,t,r,e);else for(var l=o.length-1;l>=0;l--)(s=o[l])&&(i=(a<3?s(i):a>3?s(t,r,i):s(t,r))||i);return a>3&&i&&Object.defineProperty(t,r,i),i};let d=class extends e{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return s`
      <button ?disabled=${this.disabled} tabindex=${i(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};d.styles=[t,r,n],c([a()],d.prototype,"tabIdx",void 0),c([a({type:Boolean})],d.prototype,"disabled",void 0),c([a()],d.prototype,"color",void 0),d=c([l("wui-link")],d);
