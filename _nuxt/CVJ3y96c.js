import{bh as e,bi as t,bl as r,bm as i}from"#entry";import{n as o}from"./mQLjjC5r.js";import{o as a}from"./BQCf4GoV.js";import{c as s}from"./CVzBkT9j.js";import"./CUdLdgyG.js";const l=e`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var n=function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let p=class extends r{constructor(){super(...arguments),this.disabled=!1}render(){return i`
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
    `}templateError(){return this.errorMessage?i`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};p.styles=[t,l],n([o()],p.prototype,"errorMessage",void 0),n([o({type:Boolean})],p.prototype,"disabled",void 0),n([o()],p.prototype,"value",void 0),n([o()],p.prototype,"tabIdx",void 0),p=n([s("wui-email-input")],p);
