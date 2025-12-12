import{b3 as e,b4 as t,b7 as r,b8 as i}from"./DvO0AinD.js";import{n as o}from"./B_ot7u58.js";import{o as a}from"./4RH0AGma.js";import{c as s}from"./Bo-PKsy5.js";import"./A3Pmin_Z.js";const l=e`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var p=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let n=class extends r{constructor(){super(...arguments),this.disabled=!1}render(){return i`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="mdl"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${a(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?i`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};n.styles=[t,l],p([o()],n.prototype,"errorMessage",void 0),p([o({type:Boolean})],n.prototype,"disabled",void 0),p([o()],n.prototype,"value",void 0),p([o()],n.prototype,"tabIdx",void 0),n=p([s("wui-email-input")],n);
