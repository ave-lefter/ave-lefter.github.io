import{b3 as e,b7 as t,cc as i,dO as s,b8 as n,bs as o,dQ as r,ey as a,bq as l,b4 as u,bf as c,ez as d,bn as m,bl as p,bg as h,bh as g,bj as f,bi as w,bd as b,bc as v}from"./DvO0AinD.js";import{r as y,n as x}from"./B_ot7u58.js";import{c as S}from"./Bo-PKsy5.js";import{H as R,N as T}from"./CXvtA_UG.js";import{e as $,n as N}from"./BPF-pwSa.js";import{o as E}from"./4RH0AGma.js";import"./QP_KuhpX.js";import"./A3Pmin_Z.js";import"./1TgTHKeV.js";import"./8LK8nPcT.js";import"./CVPvgowY.js";import"./knB1Rbyr.js";import"./DCLEmx3U.js";import"./DUIMwiBp.js";import"./BRI2zjzy.js";import"./DS_txzci.js";const C=e`
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
`;var j=function(e,t,i,s){var n,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(o<3?n(r):o>3?n(t,i,r):n(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r};let k=class extends t{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(i.subscribeKey("open",e=>{e||this.onHideIframe()}),i.subscribeKey("shake",e=>{this.iframe.style.animation=e?"w3m-shake 500ms var(--wui-ease-out-power-2)":"none"}))}disconnectedCallback(){var e;this.onHideIframe(),this.unsubscribe.forEach(e=>e()),null==(e=this.bodyObserver)||e.unobserve(window.document.body)}async firstUpdated(){var e;await this.syncTheme(),this.iframe.style.display="block";const t=null==(e=null==this?void 0:this.renderRoot)?void 0:e.querySelector("div");this.bodyObserver=new ResizeObserver(e=>{var i,n;const o=null==(i=null==e?void 0:e[0])?void 0:i.contentBoxSize,r=null==(n=null==o?void 0:o[0])?void 0:n.inlineSize;this.iframe.style.height="600px",t.style.height="600px",s.state.enableEmbedded?this.updateFrameSizeForEmbeddedMode():r&&r<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset",this.onShowIframe()):(this.iframe.style.width="360px",this.iframe.style.left="calc(50% - 180px)",this.iframe.style.top="calc(50% - 300px + 32px)",this.iframe.style.bottom="unset",this.onShowIframe())}),this.bodyObserver.observe(window.document.body)}render(){return n`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){const e=window.innerWidth<=430;this.ready=!0,this.iframe.style.animation=e?"w3m-iframe-zoom-in-mobile 200ms var(--wui-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--wui-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--wui-ease-out-power-2)"}async syncTheme(){const e=o.getAuthConnector();if(e){const t=r.getSnapshot().themeMode,i=r.getSnapshot().themeVariables;await e.provider.syncTheme({themeVariables:i,w3mThemeVariables:a(i,t)})}}async updateFrameSizeForEmbeddedMode(){var e;const t=null==(e=null==this?void 0:this.renderRoot)?void 0:e.querySelector("div");await new Promise(e=>{setTimeout(e,300)});const i=this.getBoundingClientRect();t.style.width="100%",this.iframe.style.left=`${i.left}px`,this.iframe.style.top=`${i.top}px`,this.iframe.style.width=`${i.width}px`,this.iframe.style.height=`${i.height}px`,this.onShowIframe()}};k.styles=C,j([y()],k.prototype,"ready",void 0),k=j([S("w3m-approve-transaction-view")],k);let A=class extends t{render(){return n`
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
    `}};A=function(e,t,i,s){var n,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(o<3?n(r):o>3?n(t,i,r):n(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r}([S("w3m-upgrade-wallet-view")],A);const I=e`
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
`;var O=function(e,t,i,s){var n,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(o<3?n(r):o>3?n(t,i,r):n(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r};let D=class extends t{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return n`
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
      >`:null}};D.styles=[u,I],O([x()],D.prototype,"errorMessage",void 0),O([x({type:Boolean})],D.prototype,"disabled",void 0),O([x()],D.prototype,"value",void 0),O([x({type:Boolean})],D.prototype,"loading",void 0),O([x({attribute:!1})],D.prototype,"onKeyDown",void 0),D=O([S("wui-ens-input")],D);const _=e`
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
`;var M=function(e,t,i,s){var n,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(o<3?n(r):o>3?n(t,i,r):n(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r};let P=class extends t{constructor(){super(),this.formRef=$(),this.usubscribe=[],this.name="",this.error="",this.loading=d.state.loading,this.suggestions=d.state.suggestions,this.profileName=m.state.profileName,this.onDebouncedNameInputChange=p.debounce(e=>{e.length<4?this.error="Name must be at least 4 characters long":R.isValidReownName(e)?(this.error="",d.getSuggestions(e)):this.error="The value is not a valid username"}),this.usubscribe.push(d.subscribe(e=>{this.suggestions=e.suggestions,this.loading=e.loading}),m.subscribeKey("profileName",e=>{this.profileName=e,e&&(this.error="You already own a name")}))}firstUpdated(){var e;null==(e=this.formRef.value)||e.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){var e;super.disconnectedCallback(),this.usubscribe.forEach(e=>e()),null==(e=this.formRef.value)||e.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return n`
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
    `}submitButtonTemplate(){const e=this.suggestions.find(e=>{var t,i;return(null==(i=null==(t=e.name)?void 0:t.split("."))?void 0:i[0])===this.name&&e.registered});if(this.loading)return n`<wui-loading-spinner
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
    </wui-flex>`}isAllowedToSubmit(e){var t;const i=null==(t=e.split("."))?void 0:t[0],s=this.suggestions.find(e=>{var t,s;return(null==(s=null==(t=e.name)?void 0:t.split("."))?void 0:s[0])===i&&e.registered});return!this.loading&&!this.error&&!this.profileName&&i&&d.validateName(i)&&!s}async onSubmitName(e){try{if(!this.isAllowedToSubmit(e))return;h.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:g(f.state.activeChain)===w.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}}),await d.registerName(e),h.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:g(f.state.activeChain)===w.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}})}catch(t){b.showError(t.message),h.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:g(f.state.activeChain)===w.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e,error:(null==t?void 0:t.message)||"Unknown error"}})}}onEnterKey(e){if("Enter"===e.key&&this.name&&this.isAllowedToSubmit(this.name)){const e=`${this.name}${c.WC_NAME_SUFFIX}`;this.onSubmitName(e)}}};P.styles=_,M([x()],P.prototype,"errorMessage",void 0),M([y()],P.prototype,"name",void 0),M([y()],P.prototype,"error",void 0),M([y()],P.prototype,"loading",void 0),M([y()],P.prototype,"suggestions",void 0),M([y()],P.prototype,"profileName",void 0),P=M([S("w3m-register-account-name-view")],P);const U=e`
  .continue-button-container {
    width: 100%;
  }
`;let z=class extends t{render(){return n`
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
    </wui-flex>`}redirectToAccount(){v.replace("Account")}};z.styles=U,z=function(e,t,i,s){var n,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(o<3?n(r):o>3?n(t,i,r):n(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r}([S("w3m-register-account-name-success-view")],z);export{k as W3mApproveTransactionView,z as W3mRegisterAccountNameSuccess,P as W3mRegisterAccountNameView,A as W3mUpgradeWalletView};
