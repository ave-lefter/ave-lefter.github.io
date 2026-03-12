import{bq as t,br as e,bu as r,bv as i}from"./D6y-ViDA.js";import{n as o}from"./8ReBD8jy.js";import{o as a}from"./C1IbZtR7.js";import{c as s}from"./BqICjlzW.js";import"./B0kc5KUq.js";const l=t`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var p=function(t,e,r,i){var o,a=arguments.length,s=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,i);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(s=(a<3?o(s):a>3?o(e,r,s):o(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};let n=class extends r{constructor(){super(...arguments),this.disabled=!1}render(){return i`
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
    `}templateError(){return this.errorMessage?i`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};n.styles=[e,l],p([o()],n.prototype,"errorMessage",void 0),p([o({type:Boolean})],n.prototype,"disabled",void 0),p([o()],n.prototype,"value",void 0),p([o()],n.prototype,"tabIdx",void 0),n=p([s("wui-email-input")],n);
