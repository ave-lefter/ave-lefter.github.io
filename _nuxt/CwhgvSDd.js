import{a_ as e,b2 as t,c8 as i,dO as s,b3 as n,bn as r,dQ as o,ey as a,bl as l,a$ as u,ba as c,ez as d,bi as m,bg as p,bb as h,bc as g,be as f,bd as w,b8 as b,b7 as y}from"#entry";import{r as v,n as x}from"./BmyCbnts.js";import{c as S}from"./DExhYf3k.js";import{H as R,N as T}from"./CRNgmNht.js";import{e as $,n as N}from"./BEPnAQOh.js";import{o as E}from"./DJ4s7H4Z.js";import"./D3lBXlNu.js";import"./BiJ5Is85.js";import"./BbkVj9z_.js";import"./D-6Zu1lc.js";import"./BC13NySj.js";import"./CptwCqKQ.js";import"./Dh00O0bS.js";import"./DQliy7QU.js";import"./CVhMdH8L.js";import"./CqsZNpmy.js";const k=e`
  div {
    width: 100%;
  }

  [data-ready='false'] {
    transform: scale(1.05);
  }

  @media (max-width: 430px) {
    [data-ready='false'] {
      transform: translateY(-50px);
    }
  }
`;var C=function(e,t,i,s){var n,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let A=class extends t{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(i.subscribeKey("open",e=>{e||this.onHideIframe()}),i.subscribeKey("shake",e=>{this.iframe.style.animation=e?"w3m-shake 500ms var(--wui-ease-out-power-2)":"none"}))}disconnectedCallback(){this.onHideIframe(),this.unsubscribe.forEach(e=>e()),this.bodyObserver?.unobserve(window.document.body)}async firstUpdated(){await this.syncTheme(),this.iframe.style.display="block";const e=this?.renderRoot?.querySelector("div");this.bodyObserver=new ResizeObserver(t=>{const i=t?.[0]?.contentBoxSize,n=i?.[0]?.inlineSize;this.iframe.style.height="600px",e.style.height="600px",s.state.enableEmbedded?this.updateFrameSizeForEmbeddedMode():n&&n<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset",this.onShowIframe()):(this.iframe.style.width="360px",this.iframe.style.left="calc(50% - 180px)",this.iframe.style.top="calc(50% - 300px + 32px)",this.iframe.style.bottom="unset",this.onShowIframe())}),this.bodyObserver.observe(window.document.body)}render(){return n`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){const e=window.innerWidth<=430;this.ready=!0,this.iframe.style.animation=e?"w3m-iframe-zoom-in-mobile 200ms var(--wui-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--wui-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--wui-ease-out-power-2)"}async syncTheme(){const e=r.getAuthConnector();if(e){const t=o.getSnapshot().themeMode,i=o.getSnapshot().themeVariables;await e.provider.syncTheme({themeVariables:i,w3mThemeVariables:a(i,t)})}}async updateFrameSizeForEmbeddedMode(){const e=this?.renderRoot?.querySelector("div");await new Promise(e=>{setTimeout(e,300)});const t=this.getBoundingClientRect();e.style.width="100%",this.iframe.style.left=`${t.left}px`,this.iframe.style.top=`${t.top}px`,this.iframe.style.width=`${t.width}px`,this.iframe.style.height=`${t.height}px`,this.onShowIframe()}};A.styles=k,C([v()],A.prototype,"ready",void 0),A=C([S("w3m-approve-transaction-view")],A);let j=class extends t{render(){return n`
      <wui-flex flexDirection="column" alignItems="center" gap="xl" padding="xl">
        <wui-text variant="paragraph-400" color="fg-100">Follow the instructions on</wui-text>
        <wui-chip
          icon="externalLink"
          variant="fill"
          href=${l.SECURE_SITE_DASHBOARD}
          imageSrc=${l.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-chip>
        <wui-text variant="small-400" color="fg-200">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `}};j=function(e,t,i,s){var n,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o}([S("w3m-upgrade-wallet-view")],j);const I=e`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  .error {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }

  .base-name {
    position: absolute;
    right: 45px;
    top: 15px;
    text-align: right;
  }
`;var O=function(e,t,i,s){var n,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let _=class extends t{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return n`
      <wui-input-text
        value=${E(this.value)}
        ?disabled=${this.disabled}
        .value=${this.value||""}
        data-testid="wui-ens-input"
        inputRightPadding="5xl"
        .onKeyDown=${this.onKeyDown}
      >
        ${this.baseNameTemplate()} ${this.errorTemplate()}${this.loadingTemplate()}
      </wui-input-text>
    `}baseNameTemplate(){return n`<wui-text variant="paragraph-400" color="fg-200" class="base-name">
      ${c.WC_NAME_SUFFIX}
    </wui-text>`}loadingTemplate(){return this.loading?n`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:null}errorTemplate(){return this.errorMessage?n`<wui-text variant="tiny-500" color="error-100" class="error"
        >${this.errorMessage}</wui-text
      >`:null}};_.styles=[u,I],O([x()],_.prototype,"errorMessage",void 0),O([x({type:Boolean})],_.prototype,"disabled",void 0),O([x()],_.prototype,"value",void 0),O([x({type:Boolean})],_.prototype,"loading",void 0),O([x({attribute:!1})],_.prototype,"onKeyDown",void 0),_=O([S("wui-ens-input")],_);const D=e`
  wui-flex {
    width: 100%;
  }

  .suggestion {
    border: none;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    padding: var(--wui-spacing-m);
  }

  .suggestion:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .suggestion:focus-visible:not(:disabled) {
    outline: 1px solid var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-005);
  }

  .suggestion:hover:not(:disabled) {
    background-color: var(--wui-color-gray-glass-005);
  }

  .suggested-name {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  form {
    width: 100%;
    position: relative;
  }

  .input-submit-button,
  .input-loading-spinner {
    position: absolute;
    top: 26px;
    transform: translateY(-50%);
    right: 10px;
  }
`;var M=function(e,t,i,s){var n,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let U=class extends t{constructor(){super(),this.formRef=$(),this.usubscribe=[],this.name="",this.error="",this.loading=d.state.loading,this.suggestions=d.state.suggestions,this.profileName=m.state.profileName,this.onDebouncedNameInputChange=p.debounce(e=>{e.length<4?this.error="Name must be at least 4 characters long":R.isValidReownName(e)?(this.error="",d.getSuggestions(e)):this.error="The value is not a valid username"}),this.usubscribe.push(d.subscribe(e=>{this.suggestions=e.suggestions,this.loading=e.loading}),m.subscribeKey("profileName",e=>{this.profileName=e,e&&(this.error="You already own a name")}))}firstUpdated(){this.formRef.value?.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.usubscribe.forEach(e=>e()),this.formRef.value?.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="m"
        .padding=${["0","s","m","s"]}
      >
        <form ${N(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
          <wui-ens-input
            @inputChange=${this.onNameInputChange.bind(this)}
            .errorMessage=${this.error}
            .value=${this.name}
            .onKeyDown=${this.onKeyDown.bind(this)}
          >
          </wui-ens-input>
          ${this.submitButtonTemplate()}
          <input type="submit" hidden />
        </form>
        ${this.templateSuggestions()}
      </wui-flex>
    `}submitButtonTemplate(){const e=this.suggestions.find(e=>e.name?.split(".")?.[0]===this.name&&e.registered);if(this.loading)return n`<wui-loading-spinner
        class="input-loading-spinner"
        color="fg-200"
      ></wui-loading-spinner>`;const t=`${this.name}${c.WC_NAME_SUFFIX}`;return n`
      <wui-icon-link
        .disabled=${e}
        class="input-submit-button"
        size="sm"
        icon="chevronRight"
        iconColor=${e?"fg-200":"accent-100"}
        @click=${()=>this.onSubmitName(t)}
      >
      </wui-icon-link>
    `}onNameInputChange(e){const t=R.validateReownName(e.detail||"");this.name=t,this.onDebouncedNameInputChange(t)}onKeyDown(e){1!==e.key.length||R.isValidReownName(e.key)||e.preventDefault()}nameSuggestionTagTemplate(e){return this.loading?n`<wui-loading-spinner color="fg-200"></wui-loading-spinner>`:e.registered?n`<wui-tag variant="shade" size="lg">Registered</wui-tag>`:n`<wui-tag variant="success" size="lg">Available</wui-tag>`}templateSuggestions(){return!this.name||this.name.length<4||this.error?null:n`<wui-flex flexDirection="column" gap="xxs" alignItems="center">
      ${this.suggestions.map(e=>n`<button
            .disabled=${e.registered||this.loading}
            data-testid="account-name-suggestion"
            class="suggestion"
            @click=${()=>this.onSubmitName(e.name)}
          >
            <wui-text color="fg-100" variant="paragraph-400" class="suggested-name">
              ${e.name}</wui-text
            >${this.nameSuggestionTagTemplate(e)}
          </button>`)}
    </wui-flex>`}isAllowedToSubmit(e){const t=e.split(".")?.[0],i=this.suggestions.find(e=>e.name?.split(".")?.[0]===t&&e.registered);return!this.loading&&!this.error&&!this.profileName&&t&&d.validateName(t)&&!i}async onSubmitName(e){try{if(!this.isAllowedToSubmit(e))return;h.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:g(f.state.activeChain)===w.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}}),await d.registerName(e),h.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:g(f.state.activeChain)===w.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}})}catch(t){b.showError(t.message),h.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:g(f.state.activeChain)===w.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e,error:t?.message||"Unknown error"}})}}onEnterKey(e){if("Enter"===e.key&&this.name&&this.isAllowedToSubmit(this.name)){const e=`${this.name}${c.WC_NAME_SUFFIX}`;this.onSubmitName(e)}}};U.styles=D,M([x()],U.prototype,"errorMessage",void 0),M([v()],U.prototype,"name",void 0),M([v()],U.prototype,"error",void 0),M([v()],U.prototype,"loading",void 0),M([v()],U.prototype,"suggestions",void 0),M([v()],U.prototype,"profileName",void 0),U=M([S("w3m-register-account-name-view")],U);const z=e`
  .continue-button-container {
    width: 100%;
  }
`;let P=class extends t{render(){return n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="xxl"
        .padding=${["0","0","l","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{p.openHref(T.URLS.FAQ,"_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return n` <wui-flex
      flexDirection="column"
      gap="xxl"
      alignItems="center"
      .padding=${["0","xxl","0","xxl"]}
    >
      <wui-flex gap="s" alignItems="center" justifyContent="center">
        <wui-icon-box
          size="xl"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="s">
        <wui-text align="center" variant="medium-600" color="fg-100">
          Account name chosen successfully
        </wui-text>
        <wui-text align="center" variant="paragraph-400" color="fg-100">
          You can now fund your account and trade crypto
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return n`<wui-flex
      .padding=${["0","2l","0","2l"]}
      gap="s"
      class="continue-button-container"
    >
      <wui-button fullWidth size="lg" borderRadius="xs" @click=${this.redirectToAccount.bind(this)}
        >Let's Go!
      </wui-button>
    </wui-flex>`}redirectToAccount(){y.replace("Account")}};P.styles=z,P=function(e,t,i,s){var n,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o}([S("w3m-register-account-name-success-view")],P);export{A as W3mApproveTransactionView,P as W3mRegisterAccountNameSuccess,U as W3mRegisterAccountNameView,j as W3mUpgradeWalletView};
