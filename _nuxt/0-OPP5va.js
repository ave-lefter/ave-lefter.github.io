import{bJ as t,bF as e,bC as o,by as r,bO as i,bz as a,bH as s,eb as n,bB as l,bq as c,br as u,bu as g,bv as p,bs as d}from"./D6y-ViDA.js";import{n as f}from"./8ReBD8jy.js";import{o as h}from"./C1IbZtR7.js";import{c as w}from"./BqICjlzW.js";import"./DbAB4eZS.js";async function b(o){r.push("ConnectingSocial");const c=i.getAuthConnector();let u=null;try{const r=setTimeout(()=>{throw new Error("Social login timed out. Please try again.")},45e3);if(c&&o){if(s.isTelegram()||(u=function(){try{return s.returnOpenHref(`${l.SECURE_SITE_SDK_ORIGIN}/loading`,"popupWindow","width=600,height=800,scrollbars=yes")}catch(t){throw new Error("Could not open social popup")}}()),u)t.setSocialWindow(u,e.state.activeChain);else if(!s.isTelegram())throw new Error("Could not create social popup");const{uri:i}=await c.provider.getSocialRedirectUri({provider:o});if(!i)throw u?.close(),new Error("Could not fetch the social redirect uri");if(u&&(u.location.href=i),s.isTelegram()){n.setTelegramSocialProvider(o);const t=s.formatTelegramSocialLoginUrl(i);s.openHref(t,"_top")}clearTimeout(r)}}catch(g){u?.close(),a.showError(g?.message)}}async function v(s){t.setSocialProvider(s,e.state.activeChain),o.sendEvent({type:"track",event:"SOCIAL_LOGIN_STARTED",properties:{provider:s}}),"farcaster"===s?await async function(){r.push("ConnectingFarcaster");const o=i.getAuthConnector();if(o&&!t.state.farcasterUrl)try{const{url:r}=await o.provider.getFarcasterUri();t.setFarcasterUrl(r,e.state.activeChain)}catch(s){r.goBack(),a.showError(s)}}():await b(s)}const y=c`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`;var m=function(t,e,o,r){var i,a=arguments.length,s=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,o,r);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,o,s):i(e,o))||s);return a>3&&s&&Object.defineProperty(e,o,s),s};let x=class extends g{constructor(){super(...arguments),this.logo="google"}render(){return p`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};x.styles=[u,y],m([f()],x.prototype,"logo",void 0),x=m([w("wui-logo")],x);const j=c`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    justify-content: flex-start;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-text[data-align='left'] {
    display: flex;
    flex: 1;
  }

  wui-text[data-align='center'] {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  .invisible {
    opacity: 0;
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`;var C=function(t,e,o,r){var i,a=arguments.length,s=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,o,r);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,o,s):i(e,o))||s);return a>3&&s&&Object.defineProperty(e,o,s),s};let O=class extends g{constructor(){super(...arguments),this.logo="google",this.name="Continue with google",this.align="left",this.disabled=!1}render(){return p`
      <button ?disabled=${this.disabled} tabindex=${h(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
        <wui-text
          data-align=${this.align}
          variant="paragraph-500"
          color="inherit"
          align=${this.align}
          >${this.name}</wui-text
        >
        ${this.templatePlacement()}
      </button>
    `}templatePlacement(){return"center"===this.align?p` <wui-logo class="invisible" logo=${this.logo}></wui-logo>`:null}};O.styles=[u,d,j],C([f()],O.prototype,"logo",void 0),C([f()],O.prototype,"name",void 0),C([f()],O.prototype,"align",void 0),C([f()],O.prototype,"tabIdx",void 0),C([f({type:Boolean})],O.prototype,"disabled",void 0),O=C([w("wui-list-social")],O);export{v as e};
