import{bP as e,bQ as t,bR as r,bq as o,br as n,bu as i,bv as a,dL as s,bs as c}from"./D6y-ViDA.js";import{n as l,r as u}from"./8ReBD8jy.js";import{c as p}from"./BqICjlzW.js";import{o as h}from"./C1IbZtR7.js";import{e as d,n as b}from"./CYWoCrGr.js";import"./DbAB4eZS.js";import{R as f}from"./Dm1rYZ30.js";const g=r({isLegalCheckboxChecked:!1}),w={state:g,subscribe:e=>t(g,()=>e(g)),subscribeKey:(t,r)=>e(g,t,r),setIsLegalCheckboxChecked(e){g.isLegalCheckboxChecked=e}},y=o`
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    column-gap: var(--wui-spacing-1xs);
  }

  label > input[type='checkbox'] {
    height: 0;
    width: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }

  label > span {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
    min-width: var(--wui-spacing-xl);
    min-height: var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-3xs);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-010);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
  }

  label > span:hover,
  label > input[type='checkbox']:focus-visible + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  label input[type='checkbox']:checked + span {
    background-color: var(--wui-color-blue-base-90);
  }

  label > span > wui-icon {
    opacity: 0;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: opacity;
  }

  label > input[type='checkbox']:checked + span wui-icon {
    opacity: 1;
  }
`;var x=function(e,t,r,o){var n,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(i<3?n(a):i>3?n(t,r,a):n(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a};let m=class extends i{constructor(){super(...arguments),this.inputElementRef=d(),this.checked=void 0}render(){return a`
      <label>
        <input
          ${b(this.inputElementRef)}
          ?checked=${h(this.checked)}
          type="checkbox"
          @change=${this.dispatchChangeEvent}
        />
        <span>
          <wui-icon name="checkmarkBold" color="inverse-100" size="xxs"></wui-icon>
        </span>
        <slot></slot>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("checkboxChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};m.styles=[n,y],x([l({type:Boolean})],m.prototype,"checked",void 0),m=x([p("wui-checkbox")],m);const v=o`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  wui-checkbox {
    padding: var(--wui-spacing-s);
  }
  a {
    text-decoration: none;
    color: var(--wui-color-fg-150);
    font-weight: 500;
  }
`;var k=function(e,t,r,o){var n,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(i<3?n(a):i>3?n(t,r,a):n(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a};let C=class extends i{constructor(){super(),this.unsubscribe=[],this.checked=w.state.isLegalCheckboxChecked,this.unsubscribe.push(w.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=s.state,r=s.state.features?.legalCheckbox;return(e||t)&&r?a`
      <wui-checkbox
        ?checked=${this.checked}
        @checkboxChange=${this.onCheckboxChange.bind(this)}
        data-testid="wui-checkbox"
      >
        <wui-text color="fg-250" variant="small-400" align="left">
          I agree to our ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
        </wui-text>
      </wui-checkbox>
    `:null}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=s.state;return e&&t?"and":""}termsTemplate(){const{termsConditionsUrl:e}=s.state;return e?a`<a rel="noreferrer" target="_blank" href=${e}>terms of service</a>`:null}privacyTemplate(){const{privacyPolicyUrl:e}=s.state;return e?a`<a rel="noreferrer" target="_blank" href=${e}>privacy policy</a>`:null}onCheckboxChange(){w.setIsLegalCheckboxChecked(!this.checked)}};C.styles=[v],k([u()],C.prototype,"checked",void 0),C=k([p("w3m-legal-checkbox")],C);const j=o`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.9;
  }
`;let $=class extends i{render(){return a`
      <a
        data-testid="ux-branding-reown"
        href=${f}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="xs"
          .padding=${["0","0","l","0"]}
        >
          <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
          <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};$.styles=[n,c,j],$=function(e,t,r,o){var n,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(i<3?n(a):i>3?n(t,r,a):n(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a}([p("wui-ux-by-reown")],$);const P=o`
  :host > wui-flex {
    background-color: var(--wui-color-gray-glass-005);
  }

  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: var(--wui-spacing-m);
  }

  a {
    text-decoration: none;
    color: var(--wui-color-fg-175);
    font-weight: 500;
  }
`;var R=function(e,t,r,o){var n,i=arguments.length,a=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(i<3?n(a):i>3?n(t,r,a):n(t,r))||a);return i>3&&a&&Object.defineProperty(t,r,a),a};let T=class extends i{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=s.state.remoteFeatures,this.unsubscribe.push(s.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=s.state,r=s.state.features?.legalCheckbox;return!e&&!t||r?a`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:a`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["m","s","s","s"]} justifyContent="center">
          <wui-text color="fg-250" variant="small-400" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=s.state;return e&&t?"and":""}termsTemplate(){const{termsConditionsUrl:e}=s.state;return e?a`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){const{privacyPolicyUrl:e}=s.state;return e?a`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?a`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:a`<wui-ux-by-reown></wui-ux-by-reown>`:null}};T.styles=[P],R([u()],T.prototype,"remoteFeatures",void 0),T=R([p("w3m-legal-footer")],T);export{w as O};
