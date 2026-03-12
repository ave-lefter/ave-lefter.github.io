import{bq as o,br as i,bs as t,bt as s,bu as r,bv as e}from"./D6y-ViDA.js";import{n as a}from"./8ReBD8jy.js";import"./DbAB4eZS.js";import{c as n}from"./BqICjlzW.js";const c=o`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    :host(:not([size='sm'])) button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`;var d=function(o,i,t,s){var r,e=arguments.length,a=e<3?i:null===s?s=Object.getOwnPropertyDescriptor(i,t):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(o,i,t,s);else for(var n=o.length-1;n>=0;n--)(r=o[n])&&(a=(e<3?r(a):e>3?r(i,t,a):r(i,t))||a);return e>3&&a&&Object.defineProperty(i,t,a),a};let l=class extends r{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){this.dataset.size=this.size;let o="",i="";switch(this.size){case"lg":o="--wui-border-radius-xs",i="--wui-spacing-1xs";break;case"sm":o="--wui-border-radius-3xs",i="--wui-spacing-xxs";break;default:o="--wui-border-radius-xxs",i="--wui-spacing-2xs"}return this.style.cssText=`\n    --local-border-radius: var(${o});\n    --local-padding: var(${i});\n    `,e`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};l.styles=[i,t,s,c],d([a()],l.prototype,"size",void 0),d([a({type:Boolean})],l.prototype,"disabled",void 0),d([a()],l.prototype,"icon",void 0),d([a()],l.prototype,"iconColor",void 0),l=d([n("wui-icon-link")],l);
