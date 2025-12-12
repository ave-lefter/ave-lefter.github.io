import{b3 as e,b4 as t,b5 as i,b7 as o,b8 as n,bj as a,dO as r,iN as s,dP as l,bn as c,bl as d,cc as u,bg as p,e3 as h,bs as w,bf as g,bc as b,bq as m,bd as f,bh as v,bi as x,be as y,iR as C,m6 as k,m7 as $,m8 as S,dR as I,b6 as T,iP as R,m9 as E,em as A,bo as O,el as N,dQ as j,ma as P,mb as D,iO as L}from"./DvO0AinD.js";import{n as W,r as U,a as B}from"./B_ot7u58.js";import{o as _}from"./4RH0AGma.js";import{c as z,U as F}from"./Bo-PKsy5.js";import"./BRI2zjzy.js";import"./QP_KuhpX.js";import"./DBTsf3Pl.js";import"./DCLEmx3U.js";import{W as M}from"./BKLMysYG.js";import"./8LK8nPcT.js";import"./FzsKt89_.js";import"./1TgTHKeV.js";import"./knB1Rbyr.js";import"./CVPvgowY.js";import{n as K}from"./BKiGSG7i.js";import{H as V,N as q}from"./CXvtA_UG.js";import"./x8dGABd-.js";import"./DUIMwiBp.js";import{M as H}from"./BP3KiNyC.js";import"./Drb5iOBj.js";import"./BvvJ-7-A.js";import{e as G,n as Y}from"./BPF-pwSa.js";import"./A3Pmin_Z.js";import"./DNhRgnSN.js";import"./DzRxPZgn.js";import{O as X}from"./DQNVNTvw.js";import{e as Q}from"./BQsKLo_n.js";import"./B6anJ0ED.js";import"./BJJ0JJad.js";import"./7KCP2O4P.js";import"./C6QKtC5l.js";import"./DS_txzci.js";import"./Dm1rYZ30.js";import"./DceVWoup.js";const Z=e`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    background: var(--wui-color-gray-glass-002);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-3xs) var(--wui-spacing-xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  button:disabled {
    background: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-image,
  button:disabled > wui-flex > wui-avatar {
    filter: grayscale(1);
  }

  button:has(wui-image) {
    padding: var(--wui-spacing-3xs) var(--wui-spacing-3xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
  }

  wui-text {
    color: var(--wui-color-fg-100);
  }

  wui-flex > wui-text {
    color: var(--wui-color-fg-200);
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  wui-flex {
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    background: var(--wui-color-gray-glass-005);
    padding: 4px var(--wui-spacing-m) 4px var(--wui-spacing-xxs);
  }

  button.local-no-balance {
    border-radius: 0px;
    border: none;
    background: transparent;
  }

  wui-avatar {
    width: 20px;
    height: 20px;
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-010);
  }

  @media (max-width: 500px) {
    button {
      gap: 0px;
      padding: var(--wui-spacing-3xs) var(--wui-spacing-xs) !important;
      height: 32px;
    }
    wui-image,
    wui-icon-box,
    button > wui-text {
      visibility: hidden;
      width: 0px;
      height: 0px;
    }
    button {
      border-radius: 0px;
      border: none;
      background: transparent;
      padding: 0px;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }

    button:active:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }
  }
`;var J=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ee=class extends o{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address="",this.profileName="",this.charsStart=4,this.charsEnd=6}render(){return n`
      <button
        ?disabled=${this.disabled}
        class=${_(this.balance?void 0:"local-no-balance")}
      >
        ${this.balanceTemplate()}
        <wui-flex gap="xxs" alignItems="center">
          <wui-avatar
            .imageSrc=${this.avatarSrc}
            alt=${this.address}
            address=${this.address}
          ></wui-avatar>
          <wui-text variant="paragraph-600" color="inherit">
            ${this.address?F.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"}):null}
          </wui-text>
        </wui-flex>
      </button>
    `}balanceTemplate(){if(this.isUnsupportedChain)return n` <wui-icon-box
          size="sm"
          iconColor="error-100"
          backgroundColor="error-100"
          icon="warningCircle"
          data-testid="wui-account-button-unsupported-chain"
        ></wui-icon-box>
        <wui-text variant="paragraph-600" color="inherit"> Switch Network</wui-text>`;if(this.balance){const e=this.networkSrc?n`<wui-image src=${this.networkSrc}></wui-image>`:n`
            <wui-icon-box
              size="sm"
              iconColor="fg-200"
              backgroundColor="fg-300"
              icon="networkPlaceholder"
            ></wui-icon-box>
          `,t=this.loading?n`<wui-loading-spinner size="md" color="fg-200"></wui-loading-spinner>`:n`<wui-text variant="paragraph-600" color="inherit"> ${this.balance}</wui-text>`;return n`${e} ${t}`}return null}};ee.styles=[t,i,Z],J([W()],ee.prototype,"networkSrc",void 0),J([W()],ee.prototype,"avatarSrc",void 0),J([W()],ee.prototype,"balance",void 0),J([W({type:Boolean})],ee.prototype,"isUnsupportedChain",void 0),J([W({type:Boolean})],ee.prototype,"disabled",void 0),J([W({type:Boolean})],ee.prototype,"loading",void 0),J([W()],ee.prototype,"address",void 0),J([W()],ee.prototype,"profileName",void 0),J([W()],ee.prototype,"charsStart",void 0),J([W()],ee.prototype,"charsEnd",void 0),ee=J([z("wui-account-button")],ee);var te=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class ie extends o{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance="show",this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.isSupported=!!r.state.allowUnsupportedChain||(!a.state.activeChain||a.checkIfSupportedNetwork(a.state.activeChain))}connectedCallback(){super.connectedCallback(),this.setAccountData(a.getAccountData(this.namespace)),this.setNetworkData(a.getNetworkData(this.namespace))}firstUpdated(){const e=this.namespace;e?this.unsubscribe.push(a.subscribeChainProp("accountState",e=>{this.setAccountData(e)},e),a.subscribeChainProp("networkState",t=>{var i;this.setNetworkData(t),this.isSupported=a.checkIfSupportedNetwork(e,null==(i=null==t?void 0:t.caipNetwork)?void 0:i.caipNetworkId)},e)):this.unsubscribe.push(s.subscribeNetworkImages(()=>{this.networkImage=l.getNetworkImage(this.network)}),a.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),c.subscribeKey("balance",e=>this.balanceVal=e),c.subscribeKey("balanceSymbol",e=>this.balanceSymbol=e),c.subscribeKey("profileName",e=>this.profileName=e),c.subscribeKey("profileImage",e=>this.profileImage=e),a.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=l.getNetworkImage(e),this.isSupported=!(null==e?void 0:e.chainNamespace)||a.checkIfSupportedNetwork(null==e?void 0:e.chainNamespace),this.fetchNetworkImage(e)}))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!a.state.activeChain)return null;const e="show"===this.balance,t="string"!=typeof this.balanceVal;return n`
      <wui-account-button
        .disabled=${Boolean(this.disabled)}
        .isUnsupportedChain=${!r.state.allowUnsupportedChain&&!this.isSupported}
        address=${_(d.getPlainAddress(this.caipAddress))}
        profileName=${_(this.profileName)}
        networkSrc=${_(this.networkImage)}
        avatarSrc=${_(this.profileImage)}
        balance=${e?d.formatBalance(this.balanceVal,this.balanceSymbol):""}
        @click=${this.onClick.bind(this)}
        data-testid=${"account-button"+(this.namespace?`-${this.namespace}`:"")}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${t}
      >
      </wui-account-button>
    `}onClick(){this.isSupported||r.state.allowUnsupportedChain?u.open({namespace:this.namespace}):u.open({view:"UnsupportedChain"})}async fetchNetworkImage(e){var t,i;(null==(t=null==e?void 0:e.assets)?void 0:t.imageId)&&(this.networkImage=await l.fetchNetworkImage(null==(i=null==e?void 0:e.assets)?void 0:i.imageId))}setAccountData(e){e&&(this.caipAddress=e.caipAddress,this.balanceVal=e.balance,this.balanceSymbol=e.balanceSymbol,this.profileName=e.profileName,this.profileImage=e.profileImage)}setNetworkData(e){e&&(this.network=e.caipNetwork,this.networkImage=l.getNetworkImage(e.caipNetwork))}}te([W({type:Boolean})],ie.prototype,"disabled",void 0),te([W()],ie.prototype,"balance",void 0),te([W()],ie.prototype,"charsStart",void 0),te([W()],ie.prototype,"charsEnd",void 0),te([W()],ie.prototype,"namespace",void 0),te([U()],ie.prototype,"caipAddress",void 0),te([U()],ie.prototype,"balanceVal",void 0),te([U()],ie.prototype,"balanceSymbol",void 0),te([U()],ie.prototype,"profileName",void 0),te([U()],ie.prototype,"profileImage",void 0),te([U()],ie.prototype,"network",void 0),te([U()],ie.prototype,"networkImage",void 0),te([U()],ie.prototype,"isSupported",void 0);let oe=class extends ie{};oe=te([z("w3m-account-button")],oe);let ne=class extends ie{};ne=te([z("appkit-account-button")],ne);const ae=e`
  :host {
    display: block;
    width: max-content;
  }
`;var re=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class se extends o{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0}firstUpdated(){var e,t;this.caipAddress=this.namespace?null==(t=null==(e=a.state.chains.get(this.namespace))?void 0:e.accountState)?void 0:t.caipAddress:a.state.activeCaipAddress,this.namespace?this.unsubscribe.push(a.subscribeChainProp("accountState",e=>{this.caipAddress=null==e?void 0:e.caipAddress},this.namespace)):this.unsubscribe.push(a.subscribeKey("activeCaipAddress",e=>this.caipAddress=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return this.caipAddress?n`
          <appkit-account-button
            .disabled=${Boolean(this.disabled)}
            balance=${_(this.balance)}
            .charsStart=${_(this.charsStart)}
            .charsEnd=${_(this.charsEnd)}
            namespace=${_(this.namespace)}
          >
          </appkit-account-button>
        `:n`
          <appkit-connect-button
            size=${_(this.size)}
            label=${_(this.label)}
            loadingLabel=${_(this.loadingLabel)}
            namespace=${_(this.namespace)}
          ></appkit-connect-button>
        `}}se.styles=ae,re([W({type:Boolean})],se.prototype,"disabled",void 0),re([W()],se.prototype,"balance",void 0),re([W()],se.prototype,"size",void 0),re([W()],se.prototype,"label",void 0),re([W()],se.prototype,"loadingLabel",void 0),re([W()],se.prototype,"charsStart",void 0),re([W()],se.prototype,"charsEnd",void 0),re([W()],se.prototype,"namespace",void 0),re([U()],se.prototype,"caipAddress",void 0);let le=class extends se{};le=re([z("w3m-button")],le);let ce=class extends se{};ce=re([z("appkit-button")],ce);const de=e`
  :host {
    position: relative;
    display: block;
  }

  button {
    background: var(--wui-color-accent-100);
    border: 1px solid var(--wui-color-gray-glass-010);
    border-radius: var(--wui-border-radius-m);
    gap: var(--wui-spacing-xs);
  }

  button.loading {
    background: var(--wui-color-gray-glass-010);
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  button:disabled > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button:active:enabled {
      background-color: var(--wui-color-accent-080);
    }
  }

  button:focus-visible {
    border: 1px solid var(--wui-color-gray-glass-010);
    background-color: var(--wui-color-accent-090);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  button[data-size='sm'] {
    padding: 6.75px 10px 7.25px;
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
    color: var(--wui-color-inverse-100);
  }

  button[data-size='md'] {
    padding: 9px var(--wui-spacing-l) 9px var(--wui-spacing-l);
  }

  button[data-size='md'] + wui-text {
    padding-left: var(--wui-spacing-3xs);
  }

  @media (max-width: 500px) {
    button[data-size='md'] {
      height: 32px;
      padding: 5px 12px;
    }

    button[data-size='md'] > wui-text > slot {
      font-size: 14px !important;
    }
  }

  wui-loading-spinner {
    width: 14px;
    height: 14px;
  }

  wui-loading-spinner::slotted(svg) {
    width: 10px !important;
    height: 10px !important;
  }

  button[data-size='sm'] > wui-loading-spinner {
    width: 12px;
    height: 12px;
  }
`;var ue=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let pe=class extends o{constructor(){super(...arguments),this.size="md",this.loading=!1}render(){const e="md"===this.size?"paragraph-600":"small-600";return n`
      <button data-size=${this.size} ?disabled=${this.loading}>
        ${this.loadingTemplate()}
        <wui-text variant=${e} color=${this.loading?"accent-100":"inherit"}>
          <slot></slot>
        </wui-text>
      </button>
    `}loadingTemplate(){return this.loading?n`<wui-loading-spinner size=${this.size} color="accent-100"></wui-loading-spinner>`:null}};pe.styles=[t,i,de],ue([W()],pe.prototype,"size",void 0),ue([W({type:Boolean})],pe.prototype,"loading",void 0),pe=ue([z("wui-connect-button")],pe);var he=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class we extends o{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=u.state.open,this.loading=this.namespace?u.state.loadingNamespaceMap.get(this.namespace):u.state.loading,this.unsubscribe.push(u.subscribe(e=>{this.open=e.open,this.loading=this.namespace?e.loadingNamespaceMap.get(this.namespace):e.loading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`
      <wui-connect-button
        size=${_(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${"connect-button"+(this.namespace?`-${this.namespace}`:"")}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?u.close():this.loading||u.open({view:"Connect",namespace:this.namespace})}}he([W()],we.prototype,"size",void 0),he([W()],we.prototype,"label",void 0),he([W()],we.prototype,"loadingLabel",void 0),he([W()],we.prototype,"namespace",void 0),he([U()],we.prototype,"open",void 0),he([U()],we.prototype,"loading",void 0);let ge=class extends we{};ge=he([z("w3m-connect-button")],ge);let be=class extends we{};be=he([z("appkit-connect-button")],be);const me=e`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-2xs) var(--wui-spacing-s) var(--wui-spacing-2xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-color-gray-glass-010);
    background-color: var(--wui-color-gray-glass-005);
    color: var(--wui-color-fg-100);
  }

  button:disabled {
    border: 1px solid var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-015);
    }
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }
`;var fe=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ve=class extends o{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1}render(){return n`
      <button data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant="paragraph-600" color="inherit">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?n`
        <wui-icon-box
          size="sm"
          iconColor="error-100"
          backgroundColor="error-100"
          icon="warningCircle"
        ></wui-icon-box>
      `:this.imageSrc?n`<wui-image src=${this.imageSrc}></wui-image>`:n`
      <wui-icon-box
        size="sm"
        iconColor="inverse-100"
        backgroundColor="fg-100"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};ve.styles=[t,i,me],fe([W()],ve.prototype,"imageSrc",void 0),fe([W({type:Boolean})],ve.prototype,"isUnsupportedChain",void 0),fe([W({type:Boolean})],ve.prototype,"disabled",void 0),ve=fe([z("wui-network-button")],ve);const xe=e`
  :host {
    display: block;
    width: max-content;
  }
`;var ye=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class Ce extends o{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=a.state.activeCaipNetwork,this.networkImage=l.getNetworkImage(this.network),this.caipAddress=a.state.activeCaipAddress,this.loading=u.state.loading,this.isSupported=!!r.state.allowUnsupportedChain||(!a.state.activeChain||a.checkIfSupportedNetwork(a.state.activeChain)),this.unsubscribe.push(s.subscribeNetworkImages(()=>{this.networkImage=l.getNetworkImage(this.network)}),a.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),a.subscribeKey("activeCaipNetwork",e=>{var t;this.network=e,this.networkImage=l.getNetworkImage(e),this.isSupported=!(null==e?void 0:e.chainNamespace)||a.checkIfSupportedNetwork(e.chainNamespace),l.fetchNetworkImage(null==(t=null==e?void 0:e.assets)?void 0:t.imageId)}),u.subscribeKey("loading",e=>this.loading=e))}firstUpdated(){var e,t;l.fetchNetworkImage(null==(t=null==(e=this.network)?void 0:e.assets)?void 0:t.imageId)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=!this.network||a.checkIfSupportedNetwork(this.network.chainNamespace);return n`
      <wui-network-button
        .disabled=${Boolean(this.disabled||this.loading)}
        .isUnsupportedChain=${!r.state.allowUnsupportedChain&&!e}
        imageSrc=${_(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?this.isSupported||r.state.allowUnsupportedChain?this.network.name:"Switch Network":this.label?this.label:this.caipAddress?"Unknown Network":"Select Network"}onClick(){this.loading||(p.sendEvent({type:"track",event:"CLICK_NETWORKS"}),u.open({view:"Networks"}))}}Ce.styles=xe,ye([W({type:Boolean})],Ce.prototype,"disabled",void 0),ye([W({type:String})],Ce.prototype,"label",void 0),ye([U()],Ce.prototype,"network",void 0),ye([U()],Ce.prototype,"networkImage",void 0),ye([U()],Ce.prototype,"caipAddress",void 0),ye([U()],Ce.prototype,"loading",void 0),ye([U()],Ce.prototype,"isSupported",void 0);let ke=class extends Ce{};ke=ye([z("w3m-network-button")],ke);let $e=class extends Ce{};$e=ye([z("appkit-network-button")],$e);const Se=e`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: block;
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    padding-left: var(--wui-spacing-s);
    padding-right: var(--wui-spacing-2l);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-accent-glass-010);
  }

  button:hover {
    background-color: var(--wui-color-accent-glass-015) !important;
  }

  button:active {
    background-color: var(--wui-color-accent-glass-020) !important;
  }
`;var Ie=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Te=class extends o{constructor(){super(...arguments),this.label="",this.description="",this.icon="wallet"}render(){return n`
      <button>
        <wui-flex gap="m" alignItems="center" justifyContent="space-between">
          <wui-icon-box
            size="lg"
            iconcolor="accent-100"
            backgroundcolor="accent-100"
            icon=${this.icon}
            background="transparent"
          ></wui-icon-box>

          <wui-flex flexDirection="column" gap="3xs">
            <wui-text variant="paragraph-500" color="fg-100">${this.label}</wui-text>
            <wui-text variant="small-400" color="fg-200">${this.description}</wui-text>
          </wui-flex>

          <wui-icon size="md" color="fg-200" name="chevronRight"></wui-icon>
        </wui-flex>
      </button>
    `}};Te.styles=[t,i,Se],Ie([W()],Te.prototype,"label",void 0),Ie([W()],Te.prototype,"description",void 0),Ie([W()],Te.prototype,"icon",void 0),Te=Ie([z("wui-notice-card")],Te);var Re=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ee=class extends o{constructor(){super(),this.unsubscribe=[],this.socialProvider=h.getConnectedSocialProvider(),this.socialUsername=h.getConnectedSocialUsername(),this.namespace=a.state.activeChain,this.unsubscribe.push(a.subscribeKey("activeChain",e=>{this.namespace=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=w.getConnectorId(this.namespace),t=w.getAuthConnector();if(!t||e!==g.CONNECTOR_ID.AUTH)return this.style.cssText="display: none",null;const i=t.provider.getEmail()??"";return i||this.socialUsername?n`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon=${this.socialProvider??"mail"}
        iconSize=${this.socialProvider?"xxl":"sm"}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(i,this.socialProvider)}}
      >
        <wui-text variant="paragraph-500" color="fg-100">${this.getAuthName(i)}</wui-text>
      </wui-list-item>
    `:(this.style.cssText="display: none",null)}onGoToUpdateEmail(e,t){t||b.push("UpdateEmailWallet",{email:e,redirectView:"Account"})}getAuthName(e){return this.socialUsername?"discord"===this.socialProvider&&this.socialUsername.endsWith("0")?this.socialUsername.slice(0,-1):this.socialUsername:e.length>30?`${e.slice(0,-3)}...`:e}};Re([U()],Ee.prototype,"namespace",void 0),Ee=Re([z("w3m-account-auth-button")],Ee);var Ae=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Oe=class extends o{constructor(){super(),this.usubscribe=[],this.networkImages=s.state.networkImages,this.address=c.state.address,this.profileImage=c.state.profileImage,this.profileName=c.state.profileName,this.network=a.state.activeCaipNetwork,this.disconnecting=!1,this.loading=!1,this.switched=!1,this.text="",this.remoteFeatures=r.state.remoteFeatures,this.usubscribe.push(c.subscribe(e=>{e.address&&(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName)}),a.subscribeKey("activeCaipNetwork",e=>{(null==e?void 0:e.id)&&(this.network=e)}),r.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.usubscribe.forEach(e=>e())}render(){var e,t,i;if(!this.address)throw new Error("w3m-account-settings-view: No account provided");const o=this.networkImages[(null==(t=null==(e=this.network)?void 0:e.assets)?void 0:t.imageId)??""];return n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="l"
        .padding=${["0","xl","m","xl"]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${_(this.profileImage)}
          size="2lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="3xs" alignItems="center" justifyContent="center">
            <wui-text variant="title-6-600" color="fg-100" data-testid="account-settings-address">
              ${F.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="fg-200"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="m">
        <wui-flex flexDirection="column" gap="xs" .padding=${["0","l","m","l"]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            .variant=${o?"image":"icon"}
            iconVariant="overlay"
            icon="networkPlaceholder"
            imageSrc=${_(o)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="paragraph-500" color="fg-100">
              ${(null==(i=this.network)?void 0:i.name)??"Unknown"}
            </wui-text>
          </wui-list-item>
          ${this.togglePreferredAccountBtnTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="disconnect"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){var e;const t=null==(e=this.network)?void 0:e.chainNamespace,i=w.getConnectorId(t),o=w.getAuthConnector();return a.checkIfNamesSupported()&&o&&i===g.CONNECTOR_ID.AUTH&&!this.profileName?n`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="id"
        iconSize="sm"
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="paragraph-500" color="fg-100">Choose account name </wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){var e;const t=w.getConnectorId(null==(e=this.network)?void 0:e.chainNamespace),i=w.getAuthConnector(),{origin:o}=location;return!i||t!==g.CONNECTOR_ID.AUTH||o.includes(m.SECURE_SITE)?null:n`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){const e=a.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,i=null==e?void 0:e.find(({id:e})=>{var t;return e===(null==(t=this.network)?void 0:t.id)});return t||!i}onCopyAddress(){try{this.address&&(d.copyToClopboard(this.address),f.showSuccess("Address copied"))}catch{f.showError("Failed to copy")}}togglePreferredAccountBtnTemplate(){var e;const t=null==(e=this.network)?void 0:e.chainNamespace,i=a.checkIfSmartAccountEnabled(),o=w.getConnectorId(t);return w.getAuthConnector()&&o===g.CONNECTOR_ID.AUTH&&i?(this.switched||(this.text=v(t)===x.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account"),n`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="swapHorizontalBold"
        iconSize="sm"
        ?chevron=${!0}
        ?loading=${this.loading}
        @click=${this.changePreferredAccountType.bind(this)}
        data-testid="account-toggle-preferred-account-type"
      >
        <wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text>
      </wui-list-item>
    `):null}onChooseName(){b.push("ChooseAccountName")}async changePreferredAccountType(){var e;const t=null==(e=this.network)?void 0:e.chainNamespace,i=a.checkIfSmartAccountEnabled(),o=v(t)!==x.ACCOUNT_TYPES.SMART_ACCOUNT&&i?x.ACCOUNT_TYPES.SMART_ACCOUNT:x.ACCOUNT_TYPES.EOA;w.getAuthConnector()&&(this.loading=!0,await y.setPreferredAccountType(o,t),this.text=o===x.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account",this.switched=!0,C.resetSend(),this.loading=!1,this.requestUpdate())}onNetworks(){this.isAllowedNetworkSwitch()&&b.push("Networks")}async onDisconnect(){var e,t;try{this.disconnecting=!0;const i=null==(e=this.network)?void 0:e.chainNamespace,o=y.getConnections(i).length>0,n=i&&w.state.activeConnectorIds[i],a=null==(t=this.remoteFeatures)?void 0:t.multiWallet;await y.disconnect(a?{id:n,namespace:i}:{}),o&&a&&(b.push("ProfileWallets"),f.showSuccess("Wallet deleted"))}catch{p.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),f.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onGoToUpgradeView(){p.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),b.push("UpgradeEmailWallet")}};Ae([U()],Oe.prototype,"address",void 0),Ae([U()],Oe.prototype,"profileImage",void 0),Ae([U()],Oe.prototype,"profileName",void 0),Ae([U()],Oe.prototype,"network",void 0),Ae([U()],Oe.prototype,"disconnecting",void 0),Ae([U()],Oe.prototype,"loading",void 0),Ae([U()],Oe.prototype,"switched",void 0),Ae([U()],Oe.prototype,"text",void 0),Ae([U()],Oe.prototype,"remoteFeatures",void 0),Oe=Ae([z("w3m-account-settings-view")],Oe);const Ne=e`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var je=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Pe=class extends o{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`\n      --local-tab: ${this.activeTab};\n      --local-tab-width: ${this.localTabWidth};\n    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map((e,t)=>{var i;const o=t===this.activeTab;return n`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(t)}
          data-active=${o}
          data-testid="tab-${null==(i=e.label)?void 0:i.toLowerCase()}"
        >
          ${this.iconTemplate(e)}
          <wui-text variant="small-600" color="inherit"> ${e.label} </wui-text>
        </button>
      `})}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout(()=>{this.animateTabs(0,!0)},0))}iconTemplate(e){return e.icon?n`<wui-icon size="xs" color="inherit" name=${e.icon}></wui-icon>`:null}onTabClick(e){this.buttons&&this.animateTabs(e,!1),this.activeTab=e,this.onTabChange(e)}animateTabs(e,t){const i=this.buttons[this.activeTab],o=this.buttons[e],n=null==i?void 0:i.querySelector("wui-text"),a=null==o?void 0:o.querySelector("wui-text"),r=null==o?void 0:o.getBoundingClientRect(),s=null==a?void 0:a.getBoundingClientRect();i&&n&&!t&&e!==this.activeTab&&(n.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),i.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),o&&r&&s&&a&&(e!==this.activeTab||t)&&(this.localTabWidth=`${Math.round(r.width+s.width)+6}px`,o.animate([{width:`${r.width+s.width}px`}],{duration:t?0:500,fill:"forwards",easing:"ease"}),a.animate([{opacity:1}],{duration:t?0:125,delay:t?0:200,fill:"forwards",easing:"ease"}))}};Pe.styles=[t,i,Ne],je([W({type:Array})],Pe.prototype,"tabs",void 0),je([W()],Pe.prototype,"onTabChange",void 0),je([W({type:Array})],Pe.prototype,"buttons",void 0),je([W({type:Boolean})],Pe.prototype,"disabled",void 0),je([W()],Pe.prototype,"localTabWidth",void 0),je([U()],Pe.prototype,"activeTab",void 0),je([U()],Pe.prototype,"isDense",void 0),Pe=je([z("wui-tabs")],Pe);const De=e`
  button {
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-xxs);
    column-gap: var(--wui-spacing-xs);
  }

  wui-image,
  .icon-box {
    width: var(--wui-spacing-xxl);
    height: var(--wui-spacing-xxl);
    border-radius: var(--wui-border-radius-3xs);
  }

  wui-text {
    flex: 1;
  }

  .icon-box {
    position: relative;
  }

  .icon-box[data-active='true'] {
    background-color: var(--wui-color-gray-glass-005);
  }

  .circle {
    position: absolute;
    left: 16px;
    top: 15px;
    width: var(--wui-spacing-1xs);
    height: var(--wui-spacing-1xs);
    background-color: var(--wui-color-success-100);
    border: 2px solid var(--wui-color-modal-bg);
    border-radius: 50%;
  }
`;var Le=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let We=class extends o{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return n`
      <button>
        ${this.leftImageTemplate()} ${this.textTemplate()} ${this.rightImageTemplate()}
      </button>
    `}leftImageTemplate(){const e=this.icon?n`<wui-icon
          size=${this.iconSize}
          color="fg-200"
          name=${this.icon}
          class="icon"
        ></wui-icon>`:n`<wui-image src=${this.imageSrc} alt=${this.alt}></wui-image>`;return n`
      <wui-flex
        alignItems="center"
        justifyContent="center"
        class="icon-box"
        data-active=${Boolean(this.icon)}
      >
        ${e}
        <wui-flex class="circle"></wui-flex>
      </wui-flex>
    `}textTemplate(){return n`
      <wui-text variant="paragraph-500" color="fg-100">
        ${F.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
      </wui-text>
    `}rightImageTemplate(){return n`<wui-icon name="chevronBottom" size="xs" color="fg-200"></wui-icon>`}};We.styles=[t,i,De],Le([W()],We.prototype,"address",void 0),Le([W()],We.prototype,"profileName",void 0),Le([W()],We.prototype,"alt",void 0),Le([W()],We.prototype,"imageSrc",void 0),Le([W()],We.prototype,"icon",void 0),Le([W()],We.prototype,"iconSize",void 0),Le([W({type:Boolean})],We.prototype,"loading",void 0),Le([W({type:Number})],We.prototype,"charsStart",void 0),Le([W({type:Number})],We.prototype,"charsEnd",void 0),We=Le([z("wui-wallet-switch")],We);const Ue=e`
  wui-flex {
    width: 100%;
  }

  :host > wui-flex:first-child {
    transform: translateY(calc(var(--wui-spacing-xxs) * -1));
  }

  wui-icon-link {
    margin-right: calc(var(--wui-icon-box-size-md) * -1);
  }

  wui-notice-card {
    margin-bottom: var(--wui-spacing-3xs);
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-s);
    height: 48px;
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-s);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: 24px;
    transition: background-color 0.2s linear;
  }

  .account-button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  wui-wallet-switch {
    margin-top: var(--wui-spacing-xs);
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition:
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md),
      opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #667dff;
  }
`;var Be=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let _e=class extends o{constructor(){super(),this.unsubscribe=[],this.caipAddress=c.state.caipAddress,this.address=d.getPlainAddress(c.state.caipAddress),this.profileImage=c.state.profileImage,this.profileName=c.state.profileName,this.disconnecting=!1,this.balance=c.state.balance,this.balanceSymbol=c.state.balanceSymbol,this.features=r.state.features,this.remoteFeatures=r.state.remoteFeatures,this.namespace=a.state.activeChain,this.activeConnectorIds=w.state.activeConnectorIds,this.unsubscribe.push(c.subscribeKey("caipAddress",e=>{this.address=d.getPlainAddress(e),this.caipAddress=e}),c.subscribeKey("balance",e=>this.balance=e),c.subscribeKey("balanceSymbol",e=>this.balanceSymbol=e),c.subscribeKey("profileName",e=>this.profileName=e),c.subscribeKey("profileImage",e=>this.profileImage=e),r.subscribeKey("features",e=>this.features=e),r.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),w.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),a.subscribeKey("activeChain",e=>this.namespace=e),a.subscribeKey("activeCaipNetwork",e=>{(null==e?void 0:e.chainNamespace)&&(this.namespace=null==e?void 0:e.chainNamespace)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.caipAddress||!this.namespace)return null;const e=this.activeConnectorIds[this.namespace],t=e?w.getConnectorById(e):void 0,i=l.getConnectorImage(t);return n`<wui-flex
        flexDirection="column"
        .padding=${["0","xl","m","xl"]}
        alignItems="center"
        gap="s"
      >
        <wui-avatar
          alt=${_(this.caipAddress)}
          address=${_(d.getPlainAddress(this.caipAddress))}
          imageSrc=${_(null===this.profileImage?void 0:this.profileImage)}
          data-testid="single-account-avatar"
        ></wui-avatar>
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          imageSrc=${i}
          alt=${null==t?void 0:t.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-text variant="paragraph-500" color="fg-200">
            ${d.formatBalance(this.balance,this.balanceSymbol)}
          </wui-text>
        </wui-flex>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="xs" .padding=${["0","s","s","s"]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          variant="icon"
          iconVariant="overlay"
          icon="disconnect"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}fundWalletTemplate(){var e,t;if(!this.namespace)return null;const i=m.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),o=(null==(e=this.remoteFeatures)?void 0:e.onramp)&&i,a=Boolean(null==(t=this.features)?void 0:t.receive);return o||a?n`
      <wui-list-item
        data-testid="w3m-account-default-fund-wallet-button"
        iconVariant="blue"
        icon="dollar"
        ?chevron=${!0}
        @click=${this.handleClickFundWallet.bind(this)}
      >
        <wui-text variant="paragraph-500" color="fg-100">Fund wallet</wui-text>
      </wui-list-item>
    `:null}orderedFeaturesTemplate(){var e;return((null==(e=this.features)?void 0:e.walletFeaturesOrder)||m.DEFAULT_FEATURES.walletFeaturesOrder).map(e=>{switch(e){case"onramp":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}activityTemplate(){var e;if(!this.namespace)return null;return(null==(e=this.remoteFeatures)?void 0:e.activity)&&m.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?n` <wui-list-item
          iconVariant="blue"
          icon="clock"
          iconSize="sm"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
          data-testid="w3m-account-default-activity-button"
        >
          <wui-text variant="paragraph-500" color="fg-100">Activity</wui-text>
        </wui-list-item>`:null}swapsTemplate(){var e;const t=null==(e=this.remoteFeatures)?void 0:e.swaps,i=a.state.activeChain===g.CHAIN.EVM;return t&&i?n`
      <wui-list-item
        iconVariant="blue"
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
        data-testid="w3m-account-default-swaps-button"
      >
        <wui-text variant="paragraph-500" color="fg-100">Swap</wui-text>
      </wui-list-item>
    `:null}sendTemplate(){var e;const t=null==(e=this.features)?void 0:e.send,i=a.state.activeChain;if(!i)throw new Error("SendController:sendTemplate - namespace is required");const o=m.SEND_SUPPORTED_NAMESPACES.includes(i);return t&&o?n`
      <wui-list-item
        iconVariant="blue"
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
        data-testid="w3m-account-default-send-button"
      >
        <wui-text variant="paragraph-500" color="fg-100">Send</wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){const e=a.state.activeChain;if(!e)throw new Error("AuthCardTemplate:authCardTemplate - namespace is required");const t=w.getConnectorId(e),i=w.getAuthConnector(),{origin:o}=location;return!i||t!==g.CONNECTOR_ID.AUTH||o.includes(m.SECURE_SITE)?null:n`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleClickFundWallet(){b.push("FundWallet")}handleClickSwap(){b.push("Swap")}handleClickSend(){b.push("WalletSend")}explorerBtnTemplate(){return c.state.addressExplorerUrl?n`
      <wui-button size="md" variant="neutral" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}onTransactions(){p.sendEvent({type:"track",event:"CLICK_TRANSACTIONS",properties:{isSmartAccount:v(a.state.activeChain)===x.ACCOUNT_TYPES.SMART_ACCOUNT}}),b.push("Transactions")}async onDisconnect(){var e;try{this.disconnecting=!0;const t=y.getConnections(this.namespace).length>0,i=this.namespace&&w.state.activeConnectorIds[this.namespace],o=null==(e=this.remoteFeatures)?void 0:e.multiWallet;await y.disconnect(o?{id:i,namespace:this.namespace}:{}),t&&o&&(b.push("ProfileWallets"),f.showSuccess("Wallet deleted"))}catch{p.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),f.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onExplorer(){const e=c.state.addressExplorerUrl;e&&d.openHref(e,"_blank")}onGoToUpgradeView(){p.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),b.push("UpgradeEmailWallet")}onGoToProfileWalletsView(){b.push("ProfileWallets")}};_e.styles=Ue,Be([U()],_e.prototype,"caipAddress",void 0),Be([U()],_e.prototype,"address",void 0),Be([U()],_e.prototype,"profileImage",void 0),Be([U()],_e.prototype,"profileName",void 0),Be([U()],_e.prototype,"disconnecting",void 0),Be([U()],_e.prototype,"balance",void 0),Be([U()],_e.prototype,"balanceSymbol",void 0),Be([U()],_e.prototype,"features",void 0),Be([U()],_e.prototype,"remoteFeatures",void 0),Be([U()],_e.prototype,"namespace",void 0),Be([U()],_e.prototype,"activeConnectorIds",void 0),_e=Be([z("w3m-account-default-widget")],_e);const ze=e`
  span {
    font-weight: 500;
    font-size: 40px;
    color: var(--wui-color-fg-100);
    line-height: 130%; /* 52px */
    letter-spacing: -1.6px;
    text-align: center;
  }

  .pennies {
    color: var(--wui-color-fg-200);
  }
`;var Fe=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Me=class extends o{constructor(){super(...arguments),this.dollars="0",this.pennies="00"}render(){return n`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};Me.styles=[t,ze],Fe([W()],Me.prototype,"dollars",void 0),Fe([W()],Me.prototype,"pennies",void 0),Me=Fe([z("wui-balance")],Me);const Ke=e`
  :host {
    display: block;
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);

    color: var(--wui-color-bg-100);
    position: relative;
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var Ve=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let qe=class extends o{constructor(){super(...arguments),this.placement="top",this.variant="fill",this.message=""}render(){return this.dataset.variant=this.variant,n`<wui-icon
        data-placement=${this.placement}
        color="fg-100"
        size="inherit"
        name=${"fill"===this.variant?"cursor":"cursorTransparent"}
      ></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>`}};qe.styles=[t,i,Ke],Ve([W()],qe.prototype,"placement",void 0),Ve([W()],qe.prototype,"variant",void 0),Ve([W()],qe.prototype,"message",void 0),qe=Ve([z("wui-tooltip")],qe);const He=e`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`;let Ge=class extends o{render(){return n`<w3m-activity-list page="account"></w3m-activity-list>`}};Ge.styles=He,Ge=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-account-activity-widget")],Ge);const Ye=e`
  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`;let Xe=class extends o{render(){return n`${this.nftTemplate()}`}nftTemplate(){return n` <wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
    >
      <wui-icon-box
        icon="wallet"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text
          variant="paragraph-500"
          align="center"
          color="fg-100"
          data-testid="nft-template-title"
          >Coming soon</wui-text
        >
        <wui-text
          variant="small-400"
          align="center"
          color="fg-200"
          data-testid="nft-template-description"
          >Stay tuned for our upcoming NFT feature</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)} data-testid="link-receive-funds"
        >Receive funds</wui-link
      >
    </wui-flex>`}onReceiveClick(){b.push("WalletReceive")}};Xe.styles=Ye,Xe=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-account-nfts-widget")],Xe);const Qe=e`
  button {
    width: 100%;
    display: flex;
    gap: var(--wui-spacing-s);
    align-items: center;
    justify-content: flex-start;
    padding: var(--wui-spacing-s) var(--wui-spacing-m) var(--wui-spacing-s) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon-box {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
  }

  wui-flex {
    width: auto;
  }
`;var Ze=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Je=class extends o{constructor(){super(...arguments),this.icon="card",this.text="",this.description="",this.tag=void 0,this.iconBackgroundColor="accent-100",this.iconColor="accent-100",this.disabled=!1}render(){return n`
      <button ?disabled=${this.disabled}>
        <wui-icon-box
          iconColor=${this.iconColor}
          backgroundColor=${this.iconBackgroundColor}
          size="inherit"
          icon=${this.icon}
          iconSize="md"
        ></wui-icon-box>
        <wui-flex flexDirection="column" justifyContent="spaceBetween">
          ${this.titleTemplate()}
          ${this.description?n`<wui-text variant="small-400" color="fg-200"> ${this.description}</wui-text>`:null}</wui-flex
        >
      </button>
    `}titleTemplate(){return this.tag?n` <wui-flex alignItems="center" gap="xxs"
        ><wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text
        ><wui-tag tagType="main" size="md">${this.tag}</wui-tag>
      </wui-flex>`:n`<wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text>`}};Je.styles=[t,i,Qe],Ze([W()],Je.prototype,"icon",void 0),Ze([W()],Je.prototype,"text",void 0),Ze([W()],Je.prototype,"description",void 0),Ze([W()],Je.prototype,"tag",void 0),Ze([W()],Je.prototype,"iconBackgroundColor",void 0),Ze([W()],Je.prototype,"iconColor",void 0),Ze([W({type:Boolean})],Je.prototype,"disabled",void 0),Je=Ze([z("wui-list-description")],Je);const et=e`
  :host {
    width: 100%;
  }

  wui-flex {
    width: 100%;
  }

  .contentContainer {
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }
`;var tt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let it=class extends o{constructor(){super(),this.unsubscribe=[],this.tokenBalance=c.state.tokenBalance,this.remoteFeatures=r.state.remoteFeatures,this.unsubscribe.push(c.subscribe(e=>{this.tokenBalance=e.tokenBalance}),r.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`${this.tokenTemplate()}`}tokenTemplate(){var e;return this.tokenBalance&&(null==(e=this.tokenBalance)?void 0:e.length)>0?n`<wui-flex class="contentContainer" flexDirection="column" gap="xs">
        ${this.tokenItemTemplate()}
      </wui-flex>`:n` <wui-flex flexDirection="column" gap="xs"
      >${this.onRampTemplate()}
      <wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Scan the QR code and receive funds"
        icon="qrCode"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="w3m-account-receive-button"
      ></wui-list-description
    ></wui-flex>`}onRampTemplate(){var e;return(null==(e=this.remoteFeatures)?void 0:e.onramp)?n`<wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="w3m-account-onramp-button"
      ></wui-list-description>`:n``}tokenItemTemplate(){var e;return null==(e=this.tokenBalance)?void 0:e.map(e=>n`<wui-list-token
          tokenName=${e.name}
          tokenImageUrl=${e.iconUrl}
          tokenAmount=${e.quantity.numeric}
          tokenValue=${e.value}
          tokenCurrency=${e.symbol}
        ></wui-list-token>`)}onReceiveClick(){b.push("WalletReceive")}onBuyClick(){p.sendEvent({type:"track",event:"SELECT_BUY_CRYPTO",properties:{isSmartAccount:v(a.state.activeChain)===x.ACCOUNT_TYPES.SMART_ACCOUNT}}),b.push("OnRampProviders")}};it.styles=et,tt([U()],it.prototype,"tokenBalance",void 0),tt([U()],it.prototype,"remoteFeatures",void 0),it=tt([z("w3m-account-tokens-widget")],it);const ot=e`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * var(--wui-spacing-2l));
  }

  wui-promo + wui-profile-button {
    margin-top: var(--wui-spacing-2l);
  }

  wui-tabs {
    width: 100%;
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`;var nt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let at=class extends o{constructor(){super(),this.unsubscribe=[],this.address=c.state.address,this.profileName=c.state.profileName,this.network=a.state.activeCaipNetwork,this.currentTab=c.state.currentTab,this.tokenBalance=c.state.tokenBalance,this.features=r.state.features,this.namespace=a.state.activeChain,this.activeConnectorIds=w.state.activeConnectorIds,this.remoteFeatures=r.state.remoteFeatures,this.unsubscribe.push(c.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName,this.currentTab=e.currentTab,this.tokenBalance=e.tokenBalance):u.close()}),w.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),a.subscribeKey("activeChain",e=>this.namespace=e),a.subscribeKey("activeCaipNetwork",e=>this.network=e),r.subscribeKey("features",e=>this.features=e),r.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),clearInterval(this.watchTokenBalance)}firstUpdated(){c.fetchTokenBalance()}render(){if(!this.address)throw new Error("w3m-account-view: No account provided");if(!this.namespace)return null;const e=this.activeConnectorIds[this.namespace],t=e?w.getConnectorById(e):void 0,{icon:i,iconSize:o}=this.getAuthData();return n`<wui-flex
      flexDirection="column"
      .padding=${["0","xl","m","xl"]}
      alignItems="center"
      gap="m"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center" gap="xs">
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          icon=${i}
          iconSize=${o}
          alt=${null==t?void 0:t.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        ${this.tokenBalanceTemplate()}
      </wui-flex>
      ${this.orderedWalletFeatures()} ${this.tabsTemplate()} ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){var e;const t=(null==(e=this.features)?void 0:e.walletFeaturesOrder)||m.DEFAULT_FEATURES.walletFeaturesOrder;if(t.every(e=>{var t,i;return"send"===e||"receive"===e?!(null==(t=this.features)?void 0:t[e]):"swaps"!==e&&"onramp"!==e||!(null==(i=this.remoteFeatures)?void 0:i[e])}))return null;const i=t.map(e=>"receive"===e||"onramp"===e?"fund":e),o=[...new Set(i)];return n`<wui-flex gap="s">
      ${o.map(e=>{switch(e){case"fund":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}
    </wui-flex>`}fundWalletTemplate(){var e,t;const i=null==(e=this.remoteFeatures)?void 0:e.onramp,o=null==(t=this.features)?void 0:t.receive;return i||o?n`
      <w3m-tooltip-trigger text="Fund wallet">
        <wui-icon-button
          data-testid="wallet-features-fund-wallet-button"
          @click=${this.onFundWalletClick.bind(this)}
          icon="dollar"
        ></wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}swapsTemplate(){var e;const t=null==(e=this.remoteFeatures)?void 0:e.swaps,i=a.state.activeChain===g.CHAIN.EVM;return t&&i?n`
      <w3m-tooltip-trigger text="Swap">
        <wui-icon-button
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          icon="recycleHorizontal"
        >
        </wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}sendTemplate(){var e;const t=null==(e=this.features)?void 0:e.send,i=a.state.activeChain,o=m.SEND_SUPPORTED_NAMESPACES.includes(i);return t&&o?n`
      <w3m-tooltip-trigger text="Send">
        <wui-icon-button
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          icon="send"
        ></wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}watchSwapValues(){this.watchTokenBalance=setInterval(()=>c.fetchTokenBalance(e=>this.onTokenBalanceError(e)),1e4)}onTokenBalanceError(e){if(e instanceof Error&&e.cause instanceof Response){e.cause.status===g.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}}listContentTemplate(){return 0===this.currentTab?n`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:1===this.currentTab?n`<w3m-account-nfts-widget></w3m-account-nfts-widget>`:2===this.currentTab?n`<w3m-account-activity-widget></w3m-account-activity-widget>`:n`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){var e;if(this.tokenBalance&&(null==(e=this.tokenBalance)?void 0:e.length)>=0){const e=d.calculateBalance(this.tokenBalance),{dollars:t="0",pennies:i="00"}=d.formatTokenBalance(e);return n`<wui-balance dollars=${t} pennies=${i}></wui-balance>`}return n`<wui-balance dollars="0" pennies="00"></wui-balance>`}tabsTemplate(){const e=V.getTabsByNamespace(a.state.activeChain);if(0===e.length)return null;let t="104px";return t=d.isMobile()&&window.innerWidth<430?(window.innerWidth-48)/e.length+"px":2===e.length?"156px":"104px",n`<wui-tabs
      .onTabChange=${this.onTabChange.bind(this)}
      .activeTab=${this.currentTab}
      localTabWidth=${t}
      .tabs=${e}
    ></wui-tabs>`}onTabChange(e){c.setCurrentTab(e)}onFundWalletClick(){b.push("FundWallet")}onSwapClick(){var e,t,i;(null==(e=this.network)?void 0:e.caipNetworkId)&&!m.SWAP_SUPPORTED_NETWORKS.includes(null==(t=this.network)?void 0:t.caipNetworkId)?b.push("UnsupportedChain",{swapUnsupportedChain:!0}):(p.sendEvent({type:"track",event:"OPEN_SWAP",properties:{network:(null==(i=this.network)?void 0:i.caipNetworkId)||"",isSmartAccount:v(a.state.activeChain)===x.ACCOUNT_TYPES.SMART_ACCOUNT}}),b.push("Swap"))}getAuthData(){const e=h.getConnectedSocialProvider(),t=h.getConnectedSocialUsername(),i=w.getAuthConnector(),o=(null==i?void 0:i.provider.getEmail())??"";return{name:k.getAuthName({email:o,socialUsername:t,socialProvider:e}),icon:e??"mail",iconSize:e?"xl":"md"}}onGoToProfileWalletsView(){b.push("ProfileWallets")}onSendClick(){var e;p.sendEvent({type:"track",event:"OPEN_SEND",properties:{network:(null==(e=this.network)?void 0:e.caipNetworkId)||"",isSmartAccount:v(a.state.activeChain)===x.ACCOUNT_TYPES.SMART_ACCOUNT}}),b.push("WalletSend")}};at.styles=ot,nt([U()],at.prototype,"watchTokenBalance",void 0),nt([U()],at.prototype,"address",void 0),nt([U()],at.prototype,"profileName",void 0),nt([U()],at.prototype,"network",void 0),nt([U()],at.prototype,"currentTab",void 0),nt([U()],at.prototype,"tokenBalance",void 0),nt([U()],at.prototype,"features",void 0),nt([U()],at.prototype,"namespace",void 0),nt([U()],at.prototype,"activeConnectorIds",void 0),nt([U()],at.prototype,"remoteFeatures",void 0),at=nt([z("w3m-account-wallet-features-widget")],at);var rt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let st=class extends o{constructor(){super(),this.unsubscribe=[],this.namespace=a.state.activeChain,this.unsubscribe.push(a.subscribeKey("activeChain",e=>{this.namespace=e}))}render(){if(!this.namespace)return null;const e=w.getConnectorId(this.namespace),t=w.getAuthConnector();return n`
      ${t&&e===g.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return n`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return n`<w3m-account-default-widget></w3m-account-default-widget>`}};rt([U()],st.prototype,"namespace",void 0),st=rt([z("w3m-account-view")],st);const lt=e`
  wui-image {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
    border-radius: var(--wui-border-radius-3xs);
  }

  wui-image,
  .icon-box {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
    border-radius: var(--wui-border-radius-3xs);
  }

  wui-icon:not(.custom-icon, .icon-badge) {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: var(--wui-color-gray-glass-005);
    border: 2px solid var(--wui-color-modal-bg);
    border-radius: 50%;
    padding: var(--wui-spacing-4xs);
  }
`;var ct=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let dt=class extends o{constructor(){super(...arguments),this.address="",this.profileName="",this.content=[],this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadge=void 0,this.iconBadgeSize="md",this.buttonVariant="neutral",this.enableMoreButton=!1,this.charsStart=4,this.charsEnd=6}render(){return n`
      <wui-flex flexDirection="column" rowGap="xs">
        ${this.topTemplate()} ${this.bottomTemplate()}
      </wui-flex>
    `}topTemplate(){return n`
      <wui-flex alignItems="flex-start" justifyContent="space-between">
        ${this.imageOrIconTemplate()}
        <wui-icon-link
          iconColor="fg-200"
          size="sm"
          icon="copy"
          @click=${this.dispatchCopyEvent}
        ></wui-icon-link>
        <wui-icon-link
          iconColor="fg-200"
          size="sm"
          icon="externalLink"
          @click=${this.dispatchExternalLinkEvent}
        ></wui-icon-link>
        ${this.enableMoreButton?n`<wui-icon-link
              iconColor="fg-200"
              size="sm"
              icon="threeDots"
              @click=${this.dispatchMoreButtonEvent}
              data-testid="wui-active-profile-wallet-item-more-button"
            ></wui-icon-link>`:null}
      </wui-flex>
    `}bottomTemplate(){return n` <wui-flex flexDirection="column">${this.contentTemplate()}</wui-flex> `}imageOrIconTemplate(){return this.icon?n`
        <wui-flex flexGrow="1" alignItems="center">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon
              size=${this.iconSize}
              color="fg-200"
              name=${this.icon}
              class="custom-icon"
            ></wui-icon>

            ${this.iconBadge?n`<wui-icon
                  color="fg-175"
                  size=${this.iconBadgeSize}
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:n`
      <wui-flex flexGrow="1" alignItems="center">
        <wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>
      </wui-flex>
    `}contentTemplate(){return 0===this.content.length?null:n`
      <wui-flex flexDirection="column" rowGap="s">
        ${this.content.map(e=>this.labelAndTagTemplate(e))}
      </wui-flex>
    `}labelAndTagTemplate({address:e,profileName:t,label:i,description:o,enableButton:a,buttonType:r,buttonLabel:s,buttonVariant:l,tagVariant:c,tagLabel:d,alignItems:u="flex-end"}){return n`
      <wui-flex justifyContent="space-between" alignItems=${u} columnGap="3xs">
        <wui-flex flexDirection="column" rowGap="4xs">
          ${i?n`<wui-text variant="micro-600" color="fg-200">${i}</wui-text>`:null}

          <wui-flex alignItems="center" columnGap="3xs">
            <wui-text variant="small-500" color="fg-100">
              ${F.getTruncateString({string:t||e,charsStart:t?16:this.charsStart,charsEnd:t?0:this.charsEnd,truncate:t?"end":"middle"})}
            </wui-text>

            ${c&&d?n`<wui-tag variant=${c} size="xs">${d}</wui-tag>`:null}
          </wui-flex>

          ${o?n`<wui-text variant="tiny-500" color="fg-200">${o}</wui-text>`:null}
        </wui-flex>

        ${a?this.buttonTemplate({buttonType:r,buttonLabel:s,buttonVariant:l}):null}
      </wui-flex>
    `}buttonTemplate({buttonType:e,buttonLabel:t,buttonVariant:i}){return n`
      <wui-button
        size="xs"
        variant=${i}
        @click=${"disconnect"===e?this.dispatchDisconnectEvent.bind(this):this.dispatchSwitchEvent.bind(this)}
        data-testid=${"disconnect"===e?"wui-active-profile-wallet-item-disconnect-button":"wui-active-profile-wallet-item-switch-button"}
      >
        ${t}
      </wui-button>
    `}dispatchDisconnectEvent(){this.dispatchEvent(new CustomEvent("disconnect",{bubbles:!0,composed:!0}))}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("switch",{bubbles:!0,composed:!0}))}dispatchExternalLinkEvent(){this.dispatchEvent(new CustomEvent("externalLink",{bubbles:!0,composed:!0}))}dispatchMoreButtonEvent(){this.dispatchEvent(new CustomEvent("more",{bubbles:!0,composed:!0}))}dispatchCopyEvent(){this.dispatchEvent(new CustomEvent("copy",{bubbles:!0,composed:!0}))}};dt.styles=[t,i,lt],ct([W()],dt.prototype,"address",void 0),ct([W()],dt.prototype,"profileName",void 0),ct([W({type:Array})],dt.prototype,"content",void 0),ct([W()],dt.prototype,"alt",void 0),ct([W()],dt.prototype,"imageSrc",void 0),ct([W()],dt.prototype,"icon",void 0),ct([W()],dt.prototype,"iconSize",void 0),ct([W()],dt.prototype,"iconBadge",void 0),ct([W()],dt.prototype,"iconBadgeSize",void 0),ct([W()],dt.prototype,"buttonVariant",void 0),ct([W({type:Boolean})],dt.prototype,"enableMoreButton",void 0),ct([W({type:Number})],dt.prototype,"charsStart",void 0),ct([W({type:Number})],dt.prototype,"charsEnd",void 0),dt=ct([z("wui-active-profile-wallet-item")],dt);const ut=e`
  wui-image,
  .icon-box {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
    border-radius: var(--wui-border-radius-3xs);
  }

  .right-icon {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: var(--wui-color-gray-glass-005);
    border: 2px solid var(--wui-color-modal-bg);
    border-radius: 50%;
    padding: var(--wui-spacing-4xs);
  }
`;var pt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ht=class extends o{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.buttonLabel="",this.buttonVariant="accent",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadgeSize="md",this.rightIcon="off",this.rightIconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return n`
      <wui-flex alignItems="center" columnGap="xs">
        ${this.imageOrIconTemplate()} ${this.labelAndDescriptionTemplate()}
        ${this.buttonActionTemplate()}
      </wui-flex>
    `}imageOrIconTemplate(){return this.icon?n`
        <wui-flex alignItems="center" justifyContent="center" class="icon-box">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon
              size=${this.iconSize}
              color="fg-200"
              name=${this.icon}
              class="custom-icon"
            ></wui-icon>
            ${this.iconBadge?n`<wui-icon
                  color="fg-175"
                  size=${this.iconBadgeSize}
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:n`<wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>`}labelAndDescriptionTemplate(){return n`
      <wui-flex
        flexDirection="column"
        flexGrow="1"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <wui-text variant="small-500" color="fg-100">
          ${F.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
        </wui-text>
      </wui-flex>
    `}buttonActionTemplate(){return n`
      <wui-flex columnGap="3xs" alignItems="center" justifyContent="center">
        <wui-button
          size="xs"
          variant=${this.buttonVariant}
          .loading=${this.loading}
          @click=${this.handleButtonClick}
          data-testid="wui-inactive-profile-wallet-item-button"
        >
          ${this.buttonLabel}
        </wui-button>

        <wui-icon-link
          iconColor="fg-200"
          size=${this.rightIconSize}
          icon=${this.rightIcon}
          class="right-icon"
          @click=${this.handleIconClick}
        ></wui-icon-link>
      </wui-flex>
    `}handleButtonClick(){this.dispatchEvent(new CustomEvent("buttonClick",{bubbles:!0,composed:!0}))}handleIconClick(){this.dispatchEvent(new CustomEvent("iconClick",{bubbles:!0,composed:!0}))}};ht.styles=[t,i,ut],pt([W()],ht.prototype,"address",void 0),pt([W()],ht.prototype,"profileName",void 0),pt([W()],ht.prototype,"alt",void 0),pt([W()],ht.prototype,"buttonLabel",void 0),pt([W()],ht.prototype,"buttonVariant",void 0),pt([W()],ht.prototype,"imageSrc",void 0),pt([W()],ht.prototype,"icon",void 0),pt([W()],ht.prototype,"iconSize",void 0),pt([W()],ht.prototype,"iconBadge",void 0),pt([W()],ht.prototype,"iconBadgeSize",void 0),pt([W()],ht.prototype,"rightIcon",void 0),pt([W()],ht.prototype,"rightIconSize",void 0),pt([W({type:Boolean})],ht.prototype,"loading",void 0),pt([W({type:Number})],ht.prototype,"charsStart",void 0),pt([W({type:Number})],ht.prototype,"charsEnd",void 0),ht=pt([z("wui-inactive-profile-wallet-item")],ht);const wt={getAuthData(e){var t,i;const o=e.connectorId===g.CONNECTOR_ID.AUTH;if(!o)return{isAuth:!1,icon:void 0,iconSize:void 0,name:void 0};const n=(null==(t=null==e?void 0:e.auth)?void 0:t.name)??h.getConnectedSocialProvider(),a=(null==(i=null==e?void 0:e.auth)?void 0:i.username)??h.getConnectedSocialUsername(),r=w.getAuthConnector(),s=(null==r?void 0:r.provider.getEmail())??"";return{isAuth:!0,icon:n??"mail",iconSize:n?"xl":"md",name:o?k.getAuthName({email:s,socialUsername:a,socialProvider:n}):void 0}}},gt=e`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
  }

  .balance-amount {
    flex: 1;
  }

  .wallet-list {
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
      black 40px,
      black calc(100% - 40px),
      rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
    );
  }

  .active-wallets {
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  .active-wallets-box {
    height: 330px;
  }

  .empty-wallet-list-box {
    height: 400px;
  }

  .empty-box {
    width: 100%;
    padding: var(--wui-spacing-l);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  wui-separator {
    margin: var(--wui-spacing-xs) 0 var(--wui-spacing-xs) 0;
  }

  .active-connection {
    padding: var(--wui-spacing-xs);
  }

  .recent-connection {
    padding: var(--wui-spacing-xs) 0 var(--wui-spacing-xs) 0;
  }

  @media (max-width: 430px) {
    .active-wallets-box,
    .empty-wallet-list-box {
      height: auto;
      max-height: clamp(360px, 470px, 80vh);
    }
  }
`;var bt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const mt={START:4,END:6},ft={SIZE:"md",ICON:"lightbulb"},vt=50,xt=[0,1],yt={eip155:"ethereum",solana:"solana",bip122:"bitcoin"},Ct=[{namespace:"eip155",icon:yt.eip155,label:"EVM"},{namespace:"solana",icon:yt.solana,label:"Solana"},{namespace:"bip122",icon:yt.bip122,label:"Bitcoin"}],kt={eip155:{title:"Add EVM Wallet",description:"Add your first EVM wallet"},solana:{title:"Add Solana Wallet",description:"Add your first Solana wallet"},bip122:{title:"Add Bitcoin Wallet",description:"Add your first Bitcoin wallet"}};let $t=class extends o{constructor(){var e,t;super(),this.unsubscribers=[],this.currentTab=0,this.namespace=a.state.activeChain,this.namespaces=Array.from(a.state.chains.keys()),this.caipAddress=void 0,this.profileName=void 0,this.activeConnectorIds=w.state.activeConnectorIds,this.lastSelectedAddress="",this.lastSelectedConnectorId="",this.isSwitching=!1,this.caipNetwork=a.state.activeCaipNetwork,this.user=c.state.user,this.remoteFeatures=r.state.remoteFeatures,this.tabWidth="",this.currentTab=this.namespace?this.namespaces.indexOf(this.namespace):0,this.caipAddress=null==(e=a.getAccountData(this.namespace))?void 0:e.caipAddress,this.profileName=null==(t=a.getAccountData(this.namespace))?void 0:t.profileName,this.unsubscribers.push(y.subscribeKey("connections",()=>this.onConnectionsChange()),y.subscribeKey("recentConnections",()=>this.requestUpdate()),w.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),a.subscribeKey("activeCaipNetwork",e=>this.caipNetwork=e),c.subscribeKey("user",e=>this.user=e),r.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.chainListener=a.subscribeChainProp("accountState",e=>{this.caipAddress=null==e?void 0:e.caipAddress,this.profileName=null==e?void 0:e.profileName},this.namespace)}disconnectedCallback(){var e,t,i;this.unsubscribers.forEach(e=>e()),null==(e=this.resizeObserver)||e.disconnect(),null==(t=this.tabsResizeObserver)||t.disconnect(),this.removeScrollListener(),null==(i=this.chainListener)||i.call(this)}firstUpdated(){var e,t;const i=null==(e=this.shadowRoot)?void 0:e.querySelector(".wallet-list"),o=null==(t=this.shadowRoot)?void 0:t.querySelector("wui-tabs");if(!i)return;const n=()=>this.updateScrollOpacity(i);if(requestAnimationFrame(n),i.addEventListener("scroll",n),this.resizeObserver=new ResizeObserver(n),this.resizeObserver.observe(i),n(),o){const e=()=>{var e;const t=Ct.filter(e=>this.namespaces.includes(e.namespace)).length;if(t>1){const i=((null==(e=this.getBoundingClientRect())?void 0:e.width)-32-8)/t;this.tabWidth=`${i}px`,this.requestUpdate()}};this.tabsResizeObserver=new ResizeObserver(e),this.tabsResizeObserver.observe(this),e()}}render(){const e=this.namespace;if(!e)throw new Error("Namespace is not set");return n`
      <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="l">
        ${this.renderTabs()} ${this.renderHeader(e)} ${this.renderConnections(e)}
        ${this.renderAddConnectionButton(e)}
      </wui-flex>
    `}renderTabs(){const e=Ct.filter(e=>this.namespaces.includes(e.namespace));return e.length>1?n`
        <wui-tabs
          .onTabChange=${e=>this.handleTabChange(e)}
          .activeTab=${this.currentTab}
          localTabWidth=${this.tabWidth}
          .tabs=${e}
        ></wui-tabs>
      `:null}renderHeader(e){const t=this.getActiveConnections(e).flatMap(({accounts:e})=>e).length+(this.caipAddress?1:0);return n`
      <wui-flex alignItems="center" columnGap="3xs">
        <wui-icon
          name=${yt[e]??yt.eip155}
          size="lg"
        ></wui-icon>
        <wui-text color="fg-200" variant="small-400"
          >${t>1?"Wallets":"Wallet"}</wui-text
        >
        <wui-text
          color="fg-100"
          variant="small-400"
          class="balance-amount"
          data-testid="balance-amount"
        >
          ${t}
        </wui-text>
        <wui-link
          color="fg-200"
          @click=${()=>y.disconnect({namespace:e})}
          ?disabled=${!this.hasAnyConnections(e)}
          data-testid="disconnect-all-button"
        >
          Disconnect All
        </wui-link>
      </wui-flex>
    `}renderConnections(e){const t=this.hasAnyConnections(e);return n`
      <wui-flex flexDirection="column" class=${B({"wallet-list":!0,"active-wallets-box":t,"empty-wallet-list-box":!t})} rowGap="s">
        ${t?this.renderActiveConnections(e):this.renderEmptyState(e)}
      </wui-flex>
    `}renderActiveConnections(e){const t=this.getActiveConnections(e),i=this.activeConnectorIds[e],o=this.getPlainAddress();return n`
      ${o||i||t.length>0?n`<wui-flex
            flexDirection="column"
            .padding=${["l","0","xs","0"]}
            class="active-wallets"
          >
            ${this.renderActiveProfile(e)} ${this.renderActiveConnectionsList(e)}
          </wui-flex>`:null}
      ${this.renderRecentConnections(e)}
    `}renderActiveProfile(e){const t=this.activeConnectorIds[e];if(!t)return null;const{connections:i}=$.getConnectionsData(e),o=w.getConnectorById(t),a=l.getConnectorImage(o),r=this.getPlainAddress();if(!r)return null;const s=e===g.CHAIN.BITCOIN,c=wt.getAuthData({connectorId:t,accounts:[]}),d=this.getActiveConnections(e).flatMap(e=>e.accounts).length>0,u=i.find(e=>e.connectorId===t),p=null==u?void 0:u.accounts.filter(e=>!S.isLowerCaseMatch(e.address,r));return n`
      <wui-flex flexDirection="column" .padding=${["0","l","0","l"]}>
        <wui-active-profile-wallet-item
          address=${r}
          alt=${null==o?void 0:o.name}
          .content=${this.getProfileContent({address:r,connections:i,connectorId:t,namespace:e})}
          .charsStart=${mt.START}
          .charsEnd=${mt.END}
          .icon=${c.icon}
          .iconSize=${c.iconSize}
          .iconBadge=${this.isSmartAccount(r)?ft.ICON:void 0}
          .iconBadgeSize=${this.isSmartAccount(r)?ft.SIZE:void 0}
          imageSrc=${a}
          ?enableMoreButton=${c.isAuth}
          @copy=${()=>this.handleCopyAddress(r)}
          @disconnect=${()=>this.handleDisconnect(e,{id:t})}
          @switch=${()=>{s&&u&&(null==p?void 0:p[0])&&this.handleSwitchWallet(u,p[0].address,e)}}
          @externalLink=${()=>this.handleExternalLink(r)}
          @more=${()=>this.handleMore()}
          data-testid="wui-active-profile-wallet-item"
        ></wui-active-profile-wallet-item>
        ${d?n`<wui-separator></wui-separator>`:null}
      </wui-flex>
    `}renderActiveConnectionsList(e){const t=this.getActiveConnections(e);return 0===t.length?null:n`
      <wui-flex flexDirection="column" .padding=${["0","xs","0","xs"]}>
        ${this.renderConnectionList(t,!1,e)}
      </wui-flex>
    `}renderRecentConnections(e){const{recentConnections:t}=$.getConnectionsData(e);return 0===t.flatMap(e=>e.accounts).length?null:n`
      <wui-flex flexDirection="column" .padding=${["0","xs","0","xs"]} rowGap="xs">
        <wui-text color="fg-200" variant="micro-500" data-testid="recently-connected-text"
          >RECENTLY CONNECTED</wui-text
        >
        <wui-flex flexDirection="column" .padding=${["0","xs","0","xs"]}>
          ${this.renderConnectionList(t,!0,e)}
        </wui-flex>
      </wui-flex>
    `}renderConnectionList(e,t,i){return e.filter(e=>e.accounts.length>0).map((e,o)=>{const a=w.getConnectorById(e.connectorId),r=l.getConnectorImage(a)??"",s=wt.getAuthData(e);return e.accounts.map((a,l)=>{const c=0!==o||0!==l,d=this.isAccountLoading(e.connectorId,a.address);return n`
            <wui-flex flexDirection="column">
              ${c?n`<wui-separator></wui-separator>`:null}
              <wui-inactive-profile-wallet-item
                address=${a.address}
                alt=${e.connectorId}
                buttonLabel=${t?"Connect":"Switch"}
                buttonVariant=${t?"neutral":"accent"}
                rightIcon=${t?"bin":"off"}
                rightIconSize="sm"
                class=${t?"recent-connection":"active-connection"}
                data-testid=${t?"recent-connection":"active-connection"}
                imageSrc=${r}
                .iconBadge=${this.isSmartAccount(a.address)?ft.ICON:void 0}
                .iconBadgeSize=${this.isSmartAccount(a.address)?ft.SIZE:void 0}
                .icon=${s.icon}
                .iconSize=${s.iconSize}
                .loading=${d}
                .showBalance=${!1}
                .charsStart=${mt.START}
                .charsEnd=${mt.END}
                @buttonClick=${()=>this.handleSwitchWallet(e,a.address,i)}
                @iconClick=${()=>this.handleWalletAction({connection:e,address:a.address,isRecentConnection:t,namespace:i})}
              ></wui-inactive-profile-wallet-item>
            </wui-flex>
          `})})}renderAddConnectionButton(e){if(!this.isMultiWalletEnabled()&&this.caipAddress)return null;if(!this.hasAnyConnections(e))return null;const{title:t}=this.getChainLabelInfo(e);return n`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="plus"
        iconSize="sm"
        ?chevron=${!0}
        @click=${()=>this.handleAddConnection(e)}
        data-testid="add-connection-button"
      >
        <wui-text variant="paragraph-500" color="fg-200">${t}</wui-text>
      </wui-list-item>
    `}renderEmptyState(e){const{title:t,description:i}=this.getChainLabelInfo(e);return n`
      <wui-flex alignItems="flex-start" class="empty-template" data-testid="empty-template">
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap="s"
          class="empty-box"
        >
          <wui-icon-box
            size="lg"
            icon="wallet"
            background="gray"
            iconColor="fg-200"
            backgroundColor="glass-002"
          ></wui-icon-box>

          <wui-flex flexDirection="column" alignItems="center" justifyContent="center" gap="3xs">
            <wui-text color="fg-100" variant="paragraph-500" data-testid="empty-state-text"
              >No wallet connected</wui-text
            >
            <wui-text color="fg-200" variant="tiny-500" data-testid="empty-state-description"
              >${i}</wui-text
            >
          </wui-flex>

          <wui-button
            variant="neutral"
            size="md"
            @click=${()=>this.handleAddConnection(e)}
            data-testid="empty-state-button"
          >
            <wui-icon color="inherit" slot="iconLeft" name="plus"></wui-icon>
            ${t}
          </wui-button>
        </wui-flex>
      </wui-flex>
    `}handleTabChange(e){var t,i,o;const n=this.namespaces[e];n&&(null==(t=this.chainListener)||t.call(this),this.currentTab=this.namespaces.indexOf(n),this.namespace=n,this.caipAddress=null==(i=a.getAccountData(n))?void 0:i.caipAddress,this.profileName=null==(o=a.getAccountData(n))?void 0:o.profileName,this.chainListener=a.subscribeChainProp("accountState",e=>{this.caipAddress=null==e?void 0:e.caipAddress},n))}async handleSwitchWallet(e,t,i){try{this.isSwitching=!0,this.lastSelectedConnectorId=e.connectorId,this.lastSelectedAddress=t,await y.switchConnection({connection:e,address:t,namespace:i,closeModalOnConnect:!1,onChange({hasSwitchedAccount:e,hasSwitchedWallet:t}){t?f.showSuccess("Wallet switched"):e&&f.showSuccess("Account switched")}})}catch(o){f.showError("Failed to switch wallet")}finally{this.isSwitching=!1}}handleWalletAction(e){const{connection:t,address:i,isRecentConnection:o,namespace:n}=e;o?(h.deleteAddressFromConnection({connectorId:t.connectorId,address:i,namespace:n}),y.syncStorageConnections(),f.showSuccess("Wallet deleted")):this.handleDisconnect(n,{id:t.connectorId})}async handleDisconnect(e,{id:t}){try{await y.disconnect({id:t,namespace:e}),f.showSuccess("Wallet disconnected")}catch{f.showError("Failed to disconnect wallet")}}handleCopyAddress(e){d.copyToClopboard(e),f.showSuccess("Address copied")}handleMore(){b.push("AccountSettings")}handleExternalLink(e){var t,i;const o=null==(i=null==(t=this.caipNetwork)?void 0:t.blockExplorers)?void 0:i.default.url;o&&d.openHref(`${o}/address/${e}`,"_blank")}handleAddConnection(e){w.setFilterByNamespace(e),b.push("Connect")}getChainLabelInfo(e){return kt[e]??{title:"Add Wallet",description:"Add your first wallet"}}isSmartAccount(e){var t,i;if(!this.namespace)return!1;const o=null==(i=null==(t=this.user)?void 0:t.accounts)?void 0:i.find(e=>"smartAccount"===e.type);return!(!o||!e)&&S.isLowerCaseMatch(o.address,e)}getPlainAddress(){return this.caipAddress?d.getPlainAddress(this.caipAddress):void 0}getActiveConnections(e){const t=this.activeConnectorIds[e],{connections:i}=$.getConnectionsData(e),[o]=i.filter(e=>S.isLowerCaseMatch(e.connectorId,t));if(!t)return i;const n=e===g.CHAIN.BITCOIN,{address:a}=this.caipAddress?I.parseCaipAddress(this.caipAddress):{};let r=[...a?[a]:[]];return n&&o&&(r=o.accounts.map(e=>e.address)||[]),$.excludeConnectorAddressFromConnections({connectorId:t,addresses:r,connections:i})}hasAnyConnections(e){const t=this.getActiveConnections(e),{recentConnections:i}=$.getConnectionsData(e);return Boolean(this.caipAddress)||t.length>0||i.length>0}isAccountLoading(e,t){return S.isLowerCaseMatch(this.lastSelectedConnectorId,e)&&S.isLowerCaseMatch(this.lastSelectedAddress,t)&&this.isSwitching}getProfileContent(e){const{address:t,connections:i,connectorId:o,namespace:n}=e,[a]=i.filter(e=>S.isLowerCaseMatch(e.connectorId,o));if(n===g.CHAIN.BITCOIN&&(null==a?void 0:a.accounts.every(e=>"string"==typeof e.type)))return this.getBitcoinProfileContent(a.accounts,t);const r=wt.getAuthData({connectorId:o,accounts:[]});return[{address:t,tagLabel:"Active",tagVariant:"success",enableButton:!0,profileName:this.profileName,buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral",...r.isAuth?{description:this.isSmartAccount(t)?"Smart Account":"EOA Account"}:{}}]}getBitcoinProfileContent(e,t){const i=e.length>1,o=this.getPlainAddress();return e.map(e=>{const n=S.isLowerCaseMatch(e.address,o);let a="PAYMENT";return"ordinal"===e.type&&(a="ORDINALS"),{address:e.address,tagLabel:S.isLowerCaseMatch(e.address,t)?"Active":void 0,tagVariant:S.isLowerCaseMatch(e.address,t)?"success":void 0,enableButton:!0,...i?{label:a,alignItems:"flex-end",buttonType:n?"disconnect":"switch",buttonLabel:n?"Disconnect":"Switch",buttonVariant:n?"neutral":"accent"}:{alignItems:"center",buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral"}}})}removeScrollListener(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector(".wallet-list");t&&t.removeEventListener("scroll",()=>this.handleConnectListScroll())}handleConnectListScroll(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector(".wallet-list");t&&this.updateScrollOpacity(t)}isMultiWalletEnabled(){var e;return Boolean(null==(e=this.remoteFeatures)?void 0:e.multiWallet)}updateScrollOpacity(e){e.style.setProperty("--connect-scroll--top-opacity",H.interpolate([0,vt],xt,e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",H.interpolate([0,vt],xt,e.scrollHeight-e.scrollTop-e.offsetHeight).toString())}onConnectionsChange(){if(this.isMultiWalletEnabled()&&this.namespace){const{connections:e}=$.getConnectionsData(this.namespace);0===e.length&&b.reset("ProfileWallets")}this.requestUpdate()}};$t.styles=gt,bt([U()],$t.prototype,"currentTab",void 0),bt([U()],$t.prototype,"namespace",void 0),bt([U()],$t.prototype,"namespaces",void 0),bt([U()],$t.prototype,"caipAddress",void 0),bt([U()],$t.prototype,"profileName",void 0),bt([U()],$t.prototype,"activeConnectorIds",void 0),bt([U()],$t.prototype,"lastSelectedAddress",void 0),bt([U()],$t.prototype,"lastSelectedConnectorId",void 0),bt([U()],$t.prototype,"isSwitching",void 0),bt([U()],$t.prototype,"caipNetwork",void 0),bt([U()],$t.prototype,"user",void 0),bt([U()],$t.prototype,"remoteFeatures",void 0),bt([U()],$t.prototype,"tabWidth",void 0),$t=bt([z("w3m-profile-wallets-view")],$t);const St=e`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`;var It=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Tt=class extends o{constructor(){super(...arguments),this.inputElementRef=G(),this.checked=void 0}render(){return n`
      <label>
        <input
          ${Y(this.inputElementRef)}
          type="checkbox"
          ?checked=${_(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){var e;this.dispatchEvent(new CustomEvent("switchChange",{detail:null==(e=this.inputElementRef.value)?void 0:e.checked,bubbles:!0,composed:!0}))}};Tt.styles=[t,i,T,St],It([W({type:Boolean})],Tt.prototype,"checked",void 0),Tt=It([z("wui-switch")],Tt);const Rt=e`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var Et=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let At=class extends o{constructor(){super(...arguments),this.checked=void 0}render(){return n`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${_(this.checked)}></wui-switch>
      </button>
    `}};At.styles=[t,i,Rt],Et([W({type:Boolean})],At.prototype,"checked",void 0),At=Et([z("wui-certified-switch")],At);const Ot=e`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`;var Nt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let jt=class extends o{constructor(){super(...arguments),this.icon="copy"}render(){return n`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};jt.styles=[t,i,Ot],Nt([W()],jt.prototype,"icon",void 0),jt=Nt([z("wui-input-element")],jt);const Pt=e`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;let Dt=class extends o{constructor(){super(...arguments),this.inputComponentRef=G()}render(){return n`
      <wui-input-text
        ${Y(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){const e=this.inputComponentRef.value,t=null==e?void 0:e.inputElementRef.value;t&&(t.value="",t.focus(),t.dispatchEvent(new Event("input")))}};Dt.styles=[t,Pt],Dt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("wui-search-bar")],Dt);const Lt=e`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var Wt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ut=class extends o{constructor(){super(...arguments),this.type="wallet"}render(){return n`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?n` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${K}`:n`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};Ut.styles=[t,i,Lt],Wt([W()],Ut.prototype,"type",void 0),Ut=Wt([z("wui-card-select-loader")],Ut);const Bt=e`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var _t=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let zt=class extends o{render(){return this.style.cssText=`\n      grid-template-rows: ${this.gridTemplateRows};\n      grid-template-columns: ${this.gridTemplateColumns};\n      justify-items: ${this.justifyItems};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      align-content: ${this.alignContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&F.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&F.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&F.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&F.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&F.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&F.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&F.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&F.getSpacingStyles(this.margin,3)};\n    `,n`<slot></slot>`}};zt.styles=[t,Bt],_t([W()],zt.prototype,"gridTemplateRows",void 0),_t([W()],zt.prototype,"gridTemplateColumns",void 0),_t([W()],zt.prototype,"justifyItems",void 0),_t([W()],zt.prototype,"alignItems",void 0),_t([W()],zt.prototype,"justifyContent",void 0),_t([W()],zt.prototype,"alignContent",void 0),_t([W()],zt.prototype,"columnGap",void 0),_t([W()],zt.prototype,"rowGap",void 0),_t([W()],zt.prototype,"gap",void 0),_t([W()],zt.prototype,"padding",void 0),_t([W()],zt.prototype,"margin",void 0),zt=_t([z("wui-grid")],zt);const Ft=e`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var Mt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Kt=class extends o{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){var e,t;const i="certified"===(null==(e=this.wallet)?void 0:e.badge_type);return n`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${_(i?"certified":void 0)}
            >${null==(t=this.wallet)?void 0:t.name}</wui-text
          >
          ${i?n`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){var e,t;return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():n`
      <wui-wallet-image
        size="md"
        imageSrc=${_(this.imageSrc)}
        name=${null==(e=this.wallet)?void 0:e.name}
        .installed=${null==(t=this.wallet)?void 0:t.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return n`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=l.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await l.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};Kt.styles=Ft,Mt([U()],Kt.prototype,"visible",void 0),Mt([U()],Kt.prototype,"imageSrc",void 0),Mt([U()],Kt.prototype,"imageLoading",void 0),Mt([W()],Kt.prototype,"wallet",void 0),Kt=Mt([z("w3m-all-wallets-list-item")],Kt);const Vt=e`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var qt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Ht="local-paginator";let Gt=class extends o{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!R.state.wallets.length,this.wallets=R.state.wallets,this.recommended=R.state.recommended,this.featured=R.state.featured,this.filteredWallets=R.state.filteredWallets,this.unsubscribe.push(R.subscribeKey("wallets",e=>this.wallets=e),R.subscribeKey("recommended",e=>this.recommended=e),R.subscribeKey("featured",e=>this.featured=e),R.subscribeKey("filteredWallets",e=>this.filteredWallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){var e;this.unsubscribe.forEach(e=>e()),null==(e=this.paginationObserver)||e.disconnect()}render(){return n`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){var e;this.loading=!0;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("wui-grid");t&&(await R.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,t){return[...Array(e)].map(()=>n`
        <wui-card-select-loader type="wallet" id=${_(t)}></wui-card-select-loader>
      `)}getWallets(){var e;const t=[...this.featured,...this.recommended];(null==(e=this.filteredWallets)?void 0:e.length)>0?t.push(...this.filteredWallets):t.push(...this.wallets);const i=d.uniqueBy(t,"id"),o=E.markWalletsAsInstalled(i);return E.markWalletsWithDisplayIndex(o)}walletsTemplate(){return this.getWallets().map(e=>n`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){const{wallets:e,recommended:t,featured:i,count:o}=R.state,n=window.innerWidth<352?3:4,a=e.length+t.length;let r=Math.ceil(a/n)*n-a+n;return r-=e.length?i.length%n:0,0===o&&i.length>0?null:0===o||[...i,...e,...t].length<o?this.shimmerTemplate(r,Ht):null}createPaginationObserver(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector(`#${Ht}`);t&&(this.paginationObserver=new IntersectionObserver(([e])=>{if((null==e?void 0:e.isIntersecting)&&!this.loading){const{page:e,count:t,wallets:i}=R.state;i.length<t&&R.fetchWalletsByPage({page:e+1})}}),this.paginationObserver.observe(t))}onConnectWallet(e){w.selectWalletConnector(e)}};Gt.styles=Vt,qt([U()],Gt.prototype,"loading",void 0),qt([U()],Gt.prototype,"wallets",void 0),qt([U()],Gt.prototype,"recommended",void 0),qt([U()],Gt.prototype,"featured",void 0),qt([U()],Gt.prototype,"filteredWallets",void 0),Gt=qt([z("w3m-all-wallets-list")],Gt);const Yt=e`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var Xt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Qt=class extends o{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?n`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){this.query.trim()===this.prevQuery.trim()&&this.badge===this.prevBadge||(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await R.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:e}=R.state,t=E.markWalletsAsInstalled(e);return e.length?n`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${t.map(e=>n`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(e)}
              .wallet=${e}
              data-testid="wallet-search-item-${e.id}"
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:n`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){w.selectWalletConnector(e)}};Qt.styles=Yt,Xt([U()],Qt.prototype,"loading",void 0),Xt([W()],Qt.prototype,"query",void 0),Xt([W()],Qt.prototype,"badge",void 0),Qt=Xt([z("w3m-all-wallets-search")],Qt);var Zt=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Jt=class extends o{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=d.debounce(e=>{this.search=e})}render(){const e=this.search.length>=2;return n`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?n`<w3m-all-wallets-search
            query=${this.search}
            badge=${_(this.badge)}
          ></w3m-all-wallets-search>`:n`<w3m-all-wallets-list badge=${_(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onClick(){"certified"!==this.badge?(this.badge="certified",f.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return d.isMobile()?n`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){b.push("ConnectingWalletConnect")}};Zt([U()],Jt.prototype,"search",void 0),Zt([U()],Jt.prototype,"badge",void 0),Jt=Zt([z("w3m-all-wallets-view")],Jt);const ei=e`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 16.5px var(--wui-spacing-l) 16.5px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
    justify-content: center;
    align-items: center;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`;var ti=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ii=class extends o{constructor(){super(...arguments),this.text="",this.disabled=!1,this.tabIdx=void 0}render(){return n`
      <button ?disabled=${this.disabled} tabindex=${_(this.tabIdx)}>
        <wui-text align="center" variant="paragraph-500" color="inherit">${this.text}</wui-text>
      </button>
    `}};ii.styles=[t,i,ei],ti([W()],ii.prototype,"text",void 0),ti([W({type:Boolean})],ii.prototype,"disabled",void 0),ti([W()],ii.prototype,"tabIdx",void 0),ii=ti([z("wui-list-button")],ii);const oi=e`
  wui-separator {
    margin: var(--wui-spacing-s) calc(var(--wui-spacing-s) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }

  wui-icon-link,
  wui-loading-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  wui-icon-link {
    right: var(--wui-spacing-xs);
  }

  wui-loading-spinner {
    right: var(--wui-spacing-m);
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var ni=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ai=class extends o{constructor(){super(),this.unsubscribe=[],this.formRef=G(),this.email="",this.loading=!1,this.error="",this.remoteFeatures=r.state.remoteFeatures,this.unsubscribe.push(r.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){var e;null==(e=this.formRef.value)||e.addEventListener("keydown",e=>{"Enter"===e.key&&this.onSubmitEmail(e)})}render(){const e=y.hasAnyConnection(g.CONNECTOR_ID.AUTH);return n`
      <form ${Y(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${_(this.tabIdx)}
          ?disabled=${e}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?n`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?n`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:null}templateError(){return this.error?n`<wui-text variant="tiny-500" color="error-100">${this.error}</wui-text>`:null}onEmailInputChange(e){this.email=e.detail.trim(),this.error=""}async onSubmitEmail(e){var t;if(!g.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===a.state.activeChain)){const e=a.getFirstCaipNetworkSupportsAuthConnector();if(e)return void b.push("SwitchNetwork",{network:e})}try{if(this.loading)return;this.loading=!0,e.preventDefault();const i=w.getAuthConnector();if(!i)throw new Error("w3m-email-login-widget: Auth connector not found");const{action:o}=await i.provider.connectEmail({email:this.email});if(p.sendEvent({type:"track",event:"EMAIL_SUBMITTED"}),"VERIFY_OTP"===o)p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),b.push("EmailVerifyOtp",{email:this.email});else if("VERIFY_DEVICE"===o)b.push("EmailVerifyDevice",{email:this.email});else if("CONNECT"===o){const e=null==(t=this.remoteFeatures)?void 0:t.multiWallet;await y.connectExternal(i,a.state.activeChain),e?(b.replace("ProfileWallets"),f.showSuccess("New Wallet Added")):b.replace("Account")}}catch(i){const e=d.parseError(i);(null==e?void 0:e.includes("Invalid email"))?this.error="Invalid email. Try again.":f.showError(i)}finally{this.loading=!1}}onFocusEvent(){p.sendEvent({type:"track",event:"EMAIL_LOGIN_SELECTED"})}};ai.styles=oi,ni([W()],ai.prototype,"tabIdx",void 0),ni([U()],ai.prototype,"email",void 0),ni([U()],ai.prototype,"loading",void 0),ni([U()],ai.prototype,"error",void 0),ni([U()],ai.prototype,"remoteFeatures",void 0),ai=ni([z("w3m-email-login-widget")],ai);const ri=e`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 56px;
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var si=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let li=class extends o{constructor(){super(...arguments),this.logo="google",this.disabled=!1,this.tabIdx=void 0}render(){return n`
      <button ?disabled=${this.disabled} tabindex=${_(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
      </button>
    `}};li.styles=[t,i,ri],si([W()],li.prototype,"logo",void 0),si([W({type:Boolean})],li.prototype,"disabled",void 0),si([W()],li.prototype,"tabIdx",void 0),li=si([z("wui-logo-select")],li);const ci=e`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-m)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var di=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ui=class extends o{constructor(){super(),this.unsubscribe=[],this.walletGuide="get-started",this.tabIdx=void 0,this.connectors=w.state.connectors,this.remoteFeatures=r.state.remoteFeatures,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.isPwaLoading=!1,this.unsubscribe.push(w.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type)}),r.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="xs"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){var e;const t="explore"===this.walletGuide;let i=null==(e=this.remoteFeatures)?void 0:e.socials;return!i&&t?(i=m.DEFAULT_SOCIALS,this.renderTopViewContent(i)):i?this.renderTopViewContent(i):null}renderTopViewContent(e){return 2===e.length?n` <wui-flex gap="xs">
        ${e.slice(0,2).map(e=>n`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${_(this.tabIdx)}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
      </wui-flex>`:n` <wui-list-social
      data-testid=${`social-selector-${e[0]}`}
      @click=${()=>{this.onSocialClick(e[0])}}
      logo=${_(e[0])}
      align="center"
      name=${`Continue with ${e[0]}`}
      tabIdx=${_(this.tabIdx)}
      ?disabled=${this.isPwaLoading||this.hasConnection()}
    ></wui-list-social>`}bottomViewTemplate(){var e;let t=null==(e=this.remoteFeatures)?void 0:e.socials;const i="explore"===this.walletGuide;return(!this.authConnector||!t||0===t.length)&&i&&(t=m.DEFAULT_SOCIALS),t?t.length<=2?null:t&&t.length>6?n`<wui-flex gap="xs">
        ${t.slice(1,5).map(e=>n`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${_(this.tabIdx)}
              ?focusable=${void 0!==this.tabIdx&&this.tabIdx>=0}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
        <wui-logo-select
          logo="more"
          tabIdx=${_(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
          ?disabled=${this.isPwaLoading||this.hasConnection()}
          data-testid="social-selector-more"
        ></wui-logo-select>
      </wui-flex>`:t?n`<wui-flex gap="xs">
      ${t.slice(1,t.length).map(e=>n`<wui-logo-select
            data-testid=${`social-selector-${e}`}
            @click=${()=>{this.onSocialClick(e)}}
            logo=${e}
            tabIdx=${_(this.tabIdx)}
            ?focusable=${void 0!==this.tabIdx&&this.tabIdx>=0}
            ?disabled=${this.isPwaLoading||this.hasConnection()}
          ></wui-logo-select>`)}
    </wui-flex>`:null:null}onMoreSocialsClick(){b.push("ConnectSocials")}async onSocialClick(e){if(!g.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===a.state.activeChain)){const e=a.getFirstCaipNetworkSupportsAuthConnector();if(e)return void b.push("SwitchNetwork",{network:e})}e&&await Q(e)}async handlePwaFrameLoad(){var e;if(d.isPWA()){this.isPwaLoading=!0;try{(null==(e=this.authConnector)?void 0:e.provider)instanceof A&&await this.authConnector.provider.init()}catch(t){O.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:t.message},"error")}finally{this.isPwaLoading=!1}}}hasConnection(){return y.hasAnyConnection(g.CONNECTOR_ID.AUTH)}};ui.styles=ci,di([W()],ui.prototype,"walletGuide",void 0),di([W()],ui.prototype,"tabIdx",void 0),di([U()],ui.prototype,"connectors",void 0),di([U()],ui.prototype,"remoteFeatures",void 0),di([U()],ui.prototype,"authConnector",void 0),di([U()],ui.prototype,"isPwaLoading",void 0),ui=di([z("w3m-social-login-widget")],ui);const pi=e`
  wui-flex {
    width: 100%;
  }

  .wallet-guide {
    width: 100%;
  }

  .chip-box {
    width: fit-content;
    background-color: var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }
`;var hi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let wi=class extends o{constructor(){super(...arguments),this.walletGuide="get-started"}render(){return"explore"===this.walletGuide?n`<wui-flex
          class="wallet-guide"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap="xs"
          data-testid="w3m-wallet-guide-explore"
        >
          <wui-text variant="small-400" color="fg-200" align="center">
            Looking for a self-custody wallet?
          </wui-text>

          <wui-flex class="chip-box">
            <wui-chip
              imageIcon="walletConnectLightBrown"
              icon="externalLink"
              variant="transparent"
              href="https://walletguide.walletconnect.network"
              title="Find one on WalletGuide"
            ></wui-chip>
          </wui-flex>
        </wui-flex>`:n`<wui-flex
          columnGap="4xs"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          .padding=${["s","0","s","0"]}
        >
          <wui-text variant="small-400" class="title" color="fg-200"
            >Haven't got a wallet?</wui-text
          >
          <wui-link
            data-testid="w3m-wallet-guide-get-started"
            color="blue-100"
            class="get-started-link"
            @click=${this.onGetStarted}
            tabIdx=${_(this.tabIdx)}
          >
            Get started
          </wui-link>
        </wui-flex>`}onGetStarted(){b.push("Create")}};wi.styles=pi,hi([W()],wi.prototype,"tabIdx",void 0),hi([W()],wi.prototype,"walletGuide",void 0),wi=hi([z("w3m-wallet-guide")],wi);const gi=e`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`;var bi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let mi=class extends o{constructor(){super(...arguments),this.walletImages=[]}render(){const e=this.walletImages.length<4;return n`${this.walletImages.slice(0,4).map(({src:e,walletName:t})=>n`
            <wui-wallet-image
              size="inherit"
              imageSrc=${e}
              name=${_(t)}
            ></wui-wallet-image>
          `)}
      ${e?[...Array(4-this.walletImages.length)].map(()=>n` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};mi.styles=[t,gi],bi([W({type:Array})],mi.prototype,"walletImages",void 0),mi=bi([z("wui-all-wallets-image")],mi);const fi=e`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`;var vi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let xi=class extends o{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return n`
      <button ?disabled=${this.disabled} tabindex=${_(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?n` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?n` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?n`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:n`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.loading?n`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?n`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?n`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};xi.styles=[t,i,fi],vi([W({type:Array})],xi.prototype,"walletImages",void 0),vi([W()],xi.prototype,"imageSrc",void 0),vi([W()],xi.prototype,"name",void 0),vi([W()],xi.prototype,"tagLabel",void 0),vi([W()],xi.prototype,"tagVariant",void 0),vi([W()],xi.prototype,"icon",void 0),vi([W()],xi.prototype,"walletIcon",void 0),vi([W()],xi.prototype,"tabIdx",void 0),vi([W({type:Boolean})],xi.prototype,"installed",void 0),vi([W({type:Boolean})],xi.prototype,"disabled",void 0),vi([W({type:Boolean})],xi.prototype,"showAllWallets",void 0),vi([W({type:Boolean})],xi.prototype,"loading",void 0),vi([W({type:String})],xi.prototype,"loadingSpinnerColor",void 0),xi=vi([z("wui-list-wallet")],xi);var yi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ci=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.count=R.state.count,this.filteredCount=R.state.filteredWallets.length,this.isFetchingRecommendedWallets=R.state.isFetchingRecommendedWallets,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e),R.subscribeKey("count",e=>this.count=e),R.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),R.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.connectors.find(e=>"walletConnect"===e.id),{allWallets:t}=r.state;if(!e||"HIDE"===t)return null;if("ONLY_MOBILE"===t&&!d.isMobile())return null;const i=R.state.featured.length,o=this.count+i,a=o<10?o:10*Math.floor(o/10),s=this.filteredCount>0?this.filteredCount:a;let l=`${s}`;this.filteredCount>0?l=`${this.filteredCount}`:s<o&&(l=`${s}+`);const c=y.hasAnyConnection(g.CONNECTOR_ID.WALLET_CONNECT);return n`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${l}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${_(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
        ?disabled=${c}
      ></wui-list-wallet>
    `}onAllWallets(){p.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),b.push("AllWallets")}};yi([W()],Ci.prototype,"tabIdx",void 0),yi([U()],Ci.prototype,"connectors",void 0),yi([U()],Ci.prototype,"count",void 0),yi([U()],Ci.prototype,"filteredCount",void 0),yi([U()],Ci.prototype,"isFetchingRecommendedWallets",void 0),Ci=yi([z("w3m-all-wallets-widget")],Ci);var ki=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let $i=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.connections=y.state.connections,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e),y.subscribeKey("connections",e=>this.connections=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.connectors.filter(e=>"ANNOUNCED"===e.type);return(null==e?void 0:e.length)?n`
      <wui-flex flexDirection="column" gap="xs">
        ${e.filter(k.showConnector).map(e=>{const t=(this.connections.get(e.chain)??[]).some(t=>S.isLowerCaseMatch(t.connectorId,e.id));return n`
            <wui-list-wallet
              imageSrc=${_(l.getConnectorImage(e))}
              name=${e.name??"Unknown"}
              @click=${()=>this.onConnector(e)}
              tagVariant=${t?"shade":"success"}
              tagLabel=${t?"connected":"installed"}
              data-testid=${`wallet-selector-${e.id}`}
              .installed=${!0}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `})}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){"walletConnect"===e.id?d.isMobile()?b.push("AllWallets"):b.push("ConnectingWalletConnect"):b.push("ConnectingExternal",{connector:e})}};ki([W()],$i.prototype,"tabIdx",void 0),ki([U()],$i.prototype,"connectors",void 0),ki([U()],$i.prototype,"connections",void 0),$i=ki([z("w3m-connect-announced-widget")],$i);var Si=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ii=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.loading=!1,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e)),d.isTelegram()&&d.isIos()&&(this.loading=!y.state.wcUri,this.unsubscribe.push(y.subscribeKey("wcUri",e=>this.loading=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{customWallets:e}=r.state;if(!(null==e?void 0:e.length))return this.style.cssText="display: none",null;const t=this.filterOutDuplicateWallets(e),i=y.hasAnyConnection(g.CONNECTOR_ID.WALLET_CONNECT);return n`<wui-flex flexDirection="column" gap="xs">
      ${t.map(e=>n`
          <wui-list-wallet
            imageSrc=${_(l.getWalletImage(e))}
            name=${e.name??"Unknown"}
            @click=${()=>this.onConnectWallet(e)}
            data-testid=${`wallet-selector-${e.id}`}
            tabIdx=${_(this.tabIdx)}
            ?loading=${this.loading}
            ?disabled=${i}
          >
          </wui-list-wallet>
        `)}
    </wui-flex>`}filterOutDuplicateWallets(e){const t=h.getRecentWallets(),i=this.connectors.map(e=>{var t;return null==(t=e.info)?void 0:t.rdns}).filter(Boolean),o=t.map(e=>e.rdns).filter(Boolean),n=i.concat(o);if(n.includes("io.metamask.mobile")&&d.isMobile()){const e=n.indexOf("io.metamask.mobile");n[e]="io.metamask"}return e.filter(e=>!n.includes(String(null==e?void 0:e.rdns)))}onConnectWallet(e){this.loading||b.push("ConnectingWalletConnect",{wallet:e})}};Si([W()],Ii.prototype,"tabIdx",void 0),Si([U()],Ii.prototype,"connectors",void 0),Si([U()],Ii.prototype,"loading",void 0),Ii=Si([z("w3m-connect-custom-widget")],Ii);var Ti=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ri=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.connectors.filter(e=>"EXTERNAL"===e.type).filter(k.showConnector).filter(e=>e.id!==g.CONNECTOR_ID.COINBASE_SDK);if(!(null==e?void 0:e.length))return this.style.cssText="display: none",null;const t=y.hasAnyConnection(g.CONNECTOR_ID.WALLET_CONNECT);return n`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(e=>n`
            <wui-list-wallet
              imageSrc=${_(l.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              data-testid=${`wallet-selector-external-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${_(this.tabIdx)}
              ?disabled=${t}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnector(e){b.push("ConnectingExternal",{connector:e})}};Ti([W()],Ri.prototype,"tabIdx",void 0),Ti([U()],Ri.prototype,"connectors",void 0),Ri=Ti([z("w3m-connect-external-widget")],Ri);var Ei=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ai=class extends o{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){if(!this.wallets.length)return this.style.cssText="display: none",null;const e=y.hasAnyConnection(g.CONNECTOR_ID.WALLET_CONNECT);return n`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map(t=>n`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${t.id}`}
              imageSrc=${_(l.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${_(this.tabIdx)}
              ?disabled=${e}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnectWallet(e){w.selectWalletConnector(e)}};Ei([W()],Ai.prototype,"tabIdx",void 0),Ei([W()],Ai.prototype,"wallets",void 0),Ai=Ei([z("w3m-connect-featured-widget")],Ai);var Oi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ni=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=[],this.connections=y.state.connections,this.unsubscribe.push(y.subscribeKey("connections",e=>this.connections=e))}render(){const e=this.connectors.filter(k.showConnector);return 0===e.length?(this.style.cssText="display: none",null):n`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(e=>{const t=(this.connections.get(e.chain)??[]).some(t=>S.isLowerCaseMatch(t.connectorId,e.id));return n`
            <wui-list-wallet
              imageSrc=${_(l.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              tagVariant=${t?"shade":"success"}
              tagLabel=${t?"connected":"installed"}
              data-testid=${`wallet-selector-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `})}
      </wui-flex>
    `}onConnector(e){w.setActiveConnector(e),b.push("ConnectingExternal",{connector:e})}};Oi([W()],Ni.prototype,"tabIdx",void 0),Oi([W()],Ni.prototype,"connectors",void 0),Oi([U()],Ni.prototype,"connections",void 0),Ni=Oi([z("w3m-connect-injected-widget")],Ni);var ji=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Pi=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.connectors.filter(e=>"MULTI_CHAIN"===e.type&&"WalletConnect"!==e.name);return(null==e?void 0:e.length)?n`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(e=>n`
            <wui-list-wallet
              imageSrc=${_(l.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){w.setActiveConnector(e),b.push("ConnectingMultiChain")}};ji([W()],Pi.prototype,"tabIdx",void 0),ji([U()],Pi.prototype,"connectors",void 0),Pi=ji([z("w3m-connect-multi-chain-widget")],Pi);var Di=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Li=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.loading=!1,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e)),d.isTelegram()&&d.isIos()&&(this.loading=!y.state.wcUri,this.unsubscribe.push(y.subscribeKey("wcUri",e=>this.loading=!e)))}render(){const e=h.getRecentWallets().filter(e=>!E.isExcluded(e)).filter(e=>!this.hasWalletConnector(e)).filter(e=>this.isWalletCompatibleWithCurrentChain(e));if(!e.length)return this.style.cssText="display: none",null;const t=y.hasAnyConnection(g.CONNECTOR_ID.WALLET_CONNECT);return n`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(e=>n`
            <wui-list-wallet
              imageSrc=${_(l.getWalletImage(e))}
              name=${e.name??"Unknown"}
              @click=${()=>this.onConnectWallet(e)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${_(this.tabIdx)}
              ?loading=${this.loading}
              ?disabled=${t}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnectWallet(e){this.loading||w.selectWalletConnector(e)}hasWalletConnector(e){return this.connectors.some(t=>t.id===e.id||t.name===e.name)}isWalletCompatibleWithCurrentChain(e){const t=a.state.activeChain;return!t||!e.chains||e.chains.some(e=>{const i=e.split(":")[0];return t===i})}};Di([W()],Li.prototype,"tabIdx",void 0),Di([U()],Li.prototype,"connectors",void 0),Di([U()],Li.prototype,"loading",void 0),Li=Di([z("w3m-connect-recent-widget")],Li);var Wi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ui=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,d.isTelegram()&&d.isIos()&&(this.loading=!y.state.wcUri,this.unsubscribe.push(y.subscribeKey("wcUri",e=>this.loading=!e)))}render(){const{connectors:e}=w.state,{customWallets:t,featuredWalletIds:i}=r.state,o=h.getRecentWallets(),a=e.find(e=>"walletConnect"===e.id),s=e.filter(e=>"INJECTED"===e.type||"ANNOUNCED"===e.type||"MULTI_CHAIN"===e.type).filter(e=>"Browser Wallet"!==e.name);if(!a)return null;if(i||t||!this.wallets.length)return this.style.cssText="display: none",null;const c=s.length+o.length,d=Math.max(0,2-c),u=E.filterOutDuplicateWallets(this.wallets).slice(0,d);if(!u.length)return this.style.cssText="display: none",null;const p=y.hasAnyConnection(g.CONNECTOR_ID.WALLET_CONNECT);return n`
      <wui-flex flexDirection="column" gap="xs">
        ${u.map(e=>n`
            <wui-list-wallet
              imageSrc=${_(l.getWalletImage(e))}
              name=${(null==e?void 0:e.name)??"Unknown"}
              @click=${()=>this.onConnectWallet(e)}
              tabIdx=${_(this.tabIdx)}
              ?loading=${this.loading}
              ?disabled=${p}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnectWallet(e){if(this.loading)return;const t=w.getConnector({id:e.id,rdns:e.rdns});t?b.push("ConnectingExternal",{connector:t}):b.push("ConnectingWalletConnect",{wallet:e})}};Wi([W()],Ui.prototype,"tabIdx",void 0),Wi([W()],Ui.prototype,"wallets",void 0),Wi([U()],Ui.prototype,"loading",void 0),Ui=Wi([z("w3m-connect-recommended-widget")],Ui);var Bi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let _i=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.connectorImages=s.state.connectorImages,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e),s.subscribeKey("connectorImages",e=>this.connectorImages=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(d.isMobile())return this.style.cssText="display: none",null;const e=this.connectors.find(e=>"walletConnect"===e.id);if(!e)return this.style.cssText="display: none",null;const t=e.imageUrl||this.connectorImages[(null==e?void 0:e.imageId)??""],i=y.hasAnyConnection(g.CONNECTOR_ID.WALLET_CONNECT);return n`
      <wui-list-wallet
        imageSrc=${_(t)}
        name=${e.name??"Unknown"}
        @click=${()=>this.onConnector(e)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${_(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
        ?disabled=${i}
      >
      </wui-list-wallet>
    `}onConnector(e){w.setActiveConnector(e),b.push("ConnectingWalletConnect")}};Bi([W()],_i.prototype,"tabIdx",void 0),Bi([U()],_i.prototype,"connectors",void 0),Bi([U()],_i.prototype,"connectorImages",void 0),_i=Bi([z("w3m-connect-walletconnect-widget")],_i);const zi=e`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var Fi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Mi=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=w.state.connectors,this.recommended=R.state.recommended,this.featured=R.state.featured,this.unsubscribe.push(w.subscribeKey("connectors",e=>this.connectors=e),R.subscribeKey("recommended",e=>this.recommended=e),R.subscribeKey("featured",e=>this.featured=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){const{custom:e,recent:t,announced:i,injected:o,multiChain:a,recommended:r,featured:s,external:l}=k.getConnectorsByType(this.connectors,this.recommended,this.featured);return k.getConnectorTypeOrder({custom:e,recent:t,announced:i,injected:o,multiChain:a,recommended:r,featured:s,external:l}).map(e=>{switch(e){case"injected":return n`
            ${a.length?n`<w3m-connect-multi-chain-widget
                  tabIdx=${_(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${i.length?n`<w3m-connect-announced-widget
                  tabIdx=${_(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${o.length?n`<w3m-connect-injected-widget
                  .connectors=${o}
                  tabIdx=${_(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return n`<w3m-connect-walletconnect-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return n`<w3m-connect-recent-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return n`<w3m-connect-featured-widget
            .wallets=${s}
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return n`<w3m-connect-custom-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return n`<w3m-connect-external-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return n`<w3m-connect-recommended-widget
            .wallets=${r}
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return null}})}};Mi.styles=zi,Fi([W()],Mi.prototype,"tabIdx",void 0),Fi([U()],Mi.prototype,"connectors",void 0),Fi([U()],Mi.prototype,"recommended",void 0),Fi([U()],Mi.prototype,"featured",void 0),Mi=Fi([z("w3m-connector-list")],Mi);var Ki=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Vi=class extends o{constructor(){super(...arguments),this.tabIdx=void 0}render(){return n`
      <wui-flex flexDirection="column" gap="xs">
        <w3m-connector-list tabIdx=${_(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${_(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};Ki([W()],Vi.prototype,"tabIdx",void 0),Vi=Ki([z("w3m-wallet-login-list")],Vi);const qi=e`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
    --connect-mask-image: none;
  }

  .connect {
    max-height: clamp(360px, 470px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  .connect::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .connect.disabled,
  .guide.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }

  wui-separator {
    margin: var(--wui-spacing-s) calc(var(--wui-spacing-s) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var Hi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Gi=class extends o{constructor(){var e,t;super(),this.unsubscribe=[],this.connectors=w.state.connectors,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.features=r.state.features,this.remoteFeatures=r.state.remoteFeatures,this.enableWallets=r.state.enableWallets,this.noAdapters=a.state.noAdapters,this.walletGuide="get-started",this.checked=X.state.isLegalCheckboxChecked,this.isEmailEnabled=(null==(e=this.remoteFeatures)?void 0:e.email)&&!a.state.noAdapters,this.isSocialEnabled=(null==(t=this.remoteFeatures)?void 0:t.socials)&&this.remoteFeatures.socials.length>0&&!a.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push(w.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)}),r.subscribeKey("features",e=>{this.features=e}),r.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e,this.setEmailAndSocialEnableCheck(this.noAdapters,this.remoteFeatures)}),r.subscribeKey("enableWallets",e=>this.enableWallets=e),a.subscribeKey("noAdapters",e=>this.setEmailAndSocialEnableCheck(e,this.remoteFeatures)),X.subscribeKey("isLegalCheckboxChecked",e=>this.checked=e))}disconnectedCallback(){var e,t;this.unsubscribe.forEach(e=>e()),null==(e=this.resizeObserver)||e.disconnect();const i=null==(t=this.shadowRoot)?void 0:t.querySelector(".connect");null==i||i.removeEventListener("scroll",this.handleConnectListScroll.bind(this))}firstUpdated(){var e,t;const i=null==(e=this.shadowRoot)?void 0:e.querySelector(".connect");i&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),null==i||i.addEventListener("scroll",this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleConnectListScroll()}),null==(t=this.resizeObserver)||t.observe(i),this.handleConnectListScroll())}render(){var e;const{termsConditionsUrl:t,privacyPolicyUrl:i}=r.state,o=null==(e=r.state.features)?void 0:e.legalCheckbox,a=Boolean(t||i)&&Boolean(o)&&"get-started"===this.walletGuide&&!this.checked,s={connect:!0,disabled:a},l=r.state.enableWalletGuide,c=this.enableWallets,d=this.isSocialEnabled||this.authConnector,u=a?-1:void 0;return n`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          class=${B(s)}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="s"
            .padding=${d&&c&&l&&"get-started"===this.walletGuide?["3xs","s","0","s"]:["3xs","s","s","s"]}
          >
            ${this.renderConnectMethod(u)}
          </wui-flex>
        </wui-flex>
        ${this.guideTemplate(a)}
        <w3m-legal-footer></w3m-legal-footer>
      </wui-flex>
    `}setEmailAndSocialEnableCheck(e,t){this.isEmailEnabled=(null==t?void 0:t.email)&&!e,this.isSocialEnabled=(null==t?void 0:t.socials)&&t.socials.length>0&&!e,this.remoteFeatures=t,this.noAdapters=e}checkIfAuthEnabled(e){const t=e.filter(e=>e.type===N.CONNECTOR_TYPE_AUTH).map(e=>e.chain);return g.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(e=>t.includes(e))}renderConnectMethod(e){const t=E.getConnectOrderMethod(this.features,this.connectors);return n`${t.map((t,i)=>{switch(t){case"email":return n`${this.emailTemplate(e)} ${this.separatorTemplate(i,"email")}`;case"social":return n`${this.socialListTemplate(e)}
          ${this.separatorTemplate(i,"social")}`;case"wallet":return n`${this.walletListTemplate(e)}
          ${this.separatorTemplate(i,"wallet")}`;default:return null}})}`}checkMethodEnabled(e){switch(e){case"wallet":return this.enableWallets;case"social":return this.isSocialEnabled&&this.isAuthEnabled;case"email":return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(e){const t=E.getConnectOrderMethod(this.features,this.connectors)[e+1];if(!t)return;return this.checkMethodEnabled(t)?t:this.checkIsThereNextMethod(e+1)}separatorTemplate(e,t){const i=this.checkIsThereNextMethod(e),o="explore"===this.walletGuide;switch(t){case"wallet":return this.enableWallets&&i&&!o?n`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case"email":{const e="social"===i;return this.isAuthEnabled&&this.isEmailEnabled&&!e&&i?n`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null}case"social":{const e="email"===i;return this.isAuthEnabled&&this.isSocialEnabled&&!e&&i?n`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null}default:return null}}emailTemplate(e){return this.isEmailEnabled&&this.isAuthEnabled?n`<w3m-email-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${_(e)}
    ></w3m-email-login-widget>`:null}socialListTemplate(e){return this.isSocialEnabled&&this.isAuthEnabled?n`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${_(e)}
    ></w3m-social-login-widget>`:null}walletListTemplate(e){var t,i;const o=this.enableWallets,a=!1===(null==(t=this.features)?void 0:t.emailShowWallets),r=null==(i=this.features)?void 0:i.collapseWallets,s=a||r;if(!o)return null;if(d.isTelegram()&&(d.isSafari()||d.isIos())&&y.connectWalletConnect().catch(e=>({})),"explore"===this.walletGuide)return null;return this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&s?n`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${_(e)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
      ></wui-list-button>`:n`<w3m-wallet-login-list tabIdx=${_(e)}></w3m-wallet-login-list>`}guideTemplate(e=!1){if(!r.state.enableWalletGuide)return null;const t={guide:!0,disabled:e},i=e?-1:void 0;return this.authConnector||this.isSocialEnabled?n`
      ${"explore"!==this.walletGuide||a.state.noAdapters?null:n`<wui-separator data-testid="wui-separator" id="explore" text="or"></wui-separator>`}
      <w3m-wallet-guide
        class=${B(t)}
        tabIdx=${_(i)}
        walletGuide=${this.walletGuide}
      ></w3m-wallet-guide>
    `:null}legalCheckboxTemplate(){return"explore"===this.walletGuide?null:n`<w3m-legal-checkbox data-testid="w3m-legal-checkbox"></w3m-legal-checkbox>`}handleConnectListScroll(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector(".connect");if(!t)return;t.scrollHeight>470?(t.style.setProperty("--connect-mask-image","linear-gradient(\n          to bottom,\n          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,\n          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,\n          black 40px,\n          black calc(100% - 40px),\n          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),\n          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%\n        )"),t.style.setProperty("--connect-scroll--top-opacity",H.interpolate([0,50],[0,1],t.scrollTop).toString()),t.style.setProperty("--connect-scroll--bottom-opacity",H.interpolate([0,50],[0,1],t.scrollHeight-t.scrollTop-t.offsetHeight).toString())):(t.style.setProperty("--connect-mask-image","none"),t.style.setProperty("--connect-scroll--top-opacity","0"),t.style.setProperty("--connect-scroll--bottom-opacity","0"))}onContinueWalletClick(){b.push("ConnectWallets")}};Gi.styles=qi,Hi([U()],Gi.prototype,"connectors",void 0),Hi([U()],Gi.prototype,"authConnector",void 0),Hi([U()],Gi.prototype,"features",void 0),Hi([U()],Gi.prototype,"remoteFeatures",void 0),Hi([U()],Gi.prototype,"enableWallets",void 0),Hi([U()],Gi.prototype,"noAdapters",void 0),Hi([W()],Gi.prototype,"walletGuide",void 0),Hi([U()],Gi.prototype,"checked",void 0),Hi([U()],Gi.prototype,"isEmailEnabled",void 0),Hi([U()],Gi.prototype,"isSocialEnabled",void 0),Hi([U()],Gi.prototype,"isAuthEnabled",void 0),Gi=Hi([z("w3m-connect-view")],Gi);const Yi=e`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var Xi=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Qi=class extends o{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return n`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};Qi.styles=[t,i,Yi],Xi([W({type:Boolean})],Qi.prototype,"disabled",void 0),Xi([W()],Qi.prototype,"label",void 0),Xi([W()],Qi.prototype,"buttonLabel",void 0),Qi=Xi([z("wui-cta-button")],Qi);const Zi=e`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`;var Ji=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let eo=class extends o{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:e,app_store:t,play_store:i,chrome_store:o,homepage:a}=this.wallet,r=d.isMobile(),s=d.isIos(),l=d.isAndroid(),c=[t,i,a,o].filter(Boolean).length>1,u=F.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return c&&!r?n`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${()=>b.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!c&&a?n`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:t&&s?n`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:i&&l?n`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){var e;(null==(e=this.wallet)?void 0:e.app_store)&&d.openHref(this.wallet.app_store,"_blank")}onPlayStore(){var e;(null==(e=this.wallet)?void 0:e.play_store)&&d.openHref(this.wallet.play_store,"_blank")}onHomePage(){var e;(null==(e=this.wallet)?void 0:e.homepage)&&d.openHref(this.wallet.homepage,"_blank")}};eo.styles=[Zi],Ji([W({type:Object})],eo.prototype,"wallet",void 0),eo=Ji([z("w3m-mobile-download-links")],eo);const to=e`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`;var io=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class oo extends o{constructor(){var e,t,i,o,n;super(),this.wallet=null==(e=b.state.data)?void 0:e.wallet,this.connector=null==(t=b.state.data)?void 0:t.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=l.getWalletImage(this.wallet)??l.getConnectorImage(this.connector),this.name=(null==(i=this.wallet)?void 0:i.name)??(null==(o=this.connector)?void 0:o.name)??"Wallet",this.isRetrying=!1,this.uri=y.state.wcUri,this.error=y.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(y.subscribeKey("wcUri",e=>{var t;this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,null==(t=this.onConnect)||t.call(this))}),y.subscribeKey("wcError",e=>this.error=e)),(d.isTelegram()||d.isSafari())&&d.isIos()&&y.state.wcUri&&(null==(n=this.onConnect)||n.call(this))}firstUpdated(){var e;null==(e=this.onAutoConnect)||e.call(this),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),y.setWcError(!1),clearTimeout(this.timeout)}render(){var e;null==(e=this.onRender)||e.call(this),this.onShowRetry();const t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let i="";return this.label?i=this.label:(i=`Continue in ${this.name}`,this.error&&(i="Connection declined")),n`
      <wui-flex
        data-error=${_(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${_(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text
            align="center"
            variant="paragraph-500"
            color=${this.error?"error-100":"fg-100"}
          >
            ${i}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?n`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?n`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){var e;if(this.error&&!this.showRetry){this.showRetry=!0;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("wui-button");null==t||t.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){var e,t;y.setWcError(!1),this.onRetry?(this.isRetrying=!0,null==(e=this.onRetry)||e.call(this)):null==(t=this.onConnect)||t.call(this)}loaderTemplate(){const e=j.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return n`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(d.copyToClopboard(this.uri),f.showSuccess("Link copied"))}catch{f.showError("Failed to copy")}}}oo.styles=to,io([U()],oo.prototype,"isRetrying",void 0),io([U()],oo.prototype,"uri",void 0),io([U()],oo.prototype,"error",void 0),io([U()],oo.prototype,"ready",void 0),io([U()],oo.prototype,"showRetry",void 0),io([U()],oo.prototype,"label",void 0),io([U()],oo.prototype,"secondaryBtnLabel",void 0),io([U()],oo.prototype,"secondaryLabel",void 0),io([U()],oo.prototype,"isLoading",void 0),io([W({type:Boolean})],oo.prototype,"isMobile",void 0),io([W()],oo.prototype,"onRetry",void 0);let no=class extends oo{constructor(){var e,t,i,o;if(super(),this.externalViewUnsubscribe=[],this.connectionsByNamespace=y.getConnections(null==(e=this.connector)?void 0:e.chain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.remoteFeatures=r.state.remoteFeatures,this.currentActiveConnectorId=w.state.activeConnectorIds[null==(t=this.connector)?void 0:t.chain],!this.connector)throw new Error("w3m-connecting-view: No connector provided");const n=null==(i=this.connector)?void 0:i.chain;this.isAlreadyConnected(this.connector)&&(this.secondaryBtnLabel=void 0,this.label=`This account is already linked, change your account in ${this.connector.name}`,this.secondaryLabel=`To link a new account, open ${this.connector.name} and switch to the account you want to link`),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:"browser",displayIndex:null==(o=this.wallet)?void 0:o.display_index}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push(w.subscribeKey("activeConnectorIds",e=>{var t;const i=e[n],o=null==(t=this.remoteFeatures)?void 0:t.multiWallet;i!==this.currentActiveConnectorId&&(this.hasMultipleConnections&&o?(b.replace("ProfileWallets"),f.showSuccess("New Wallet Added")):u.close())}),y.subscribeKey("connections",this.onConnectionsChange.bind(this)))}disconnectedCallback(){this.externalViewUnsubscribe.forEach(e=>e())}async onConnectProxy(){try{if(this.error=!1,this.connector){if(this.isAlreadyConnected(this.connector))return;this.connector.id===g.CONNECTOR_ID.COINBASE_SDK&&this.error||(await y.connectExternal(this.connector,this.connector.chain),p.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.connector.name||"Unknown"}}))}}catch(e){p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(null==e?void 0:e.message)??"Unknown"}}),this.error=!0}}onConnectionsChange(e){var t,i;if((null==(t=this.connector)?void 0:t.chain)&&e.get(this.connector.chain)&&this.isAlreadyConnected(this.connector)){const t=e.get(this.connector.chain)??[],o=null==(i=this.remoteFeatures)?void 0:i.multiWallet;if(0===t.length)b.replace("Connect");else{const e=$.getConnectionsByConnectorId(this.connectionsByNamespace,this.connector.id).flatMap(e=>e.accounts),i=$.getConnectionsByConnectorId(t,this.connector.id).flatMap(e=>e.accounts);if(0===i.length)this.hasMultipleConnections&&o?(b.replace("ProfileWallets"),f.showSuccess("Wallet deleted")):u.close();else{!e.every(e=>i.some(t=>S.isLowerCaseMatch(e.address,t.address)))&&o&&b.replace("ProfileWallets")}}}}isAlreadyConnected(e){return Boolean(e)&&this.connectionsByNamespace.some(t=>S.isLowerCaseMatch(t.connectorId,e.id))}};no=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-connecting-external-view")],no);const ao=e`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`;var ro=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let so=class extends o{constructor(){super(),this.unsubscribe=[],this.activeConnector=w.state.activeConnector,this.unsubscribe.push(w.subscribeKey("activeConnector",e=>this.activeConnector=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){var e;return n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["m","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${_(l.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="xs"
          .padding=${["0","s","0","s"]}
        >
          <wui-text variant="paragraph-500" color="fg-100">
            Select Chain for ${null==(e=this.activeConnector)?void 0:e.name}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="xs"
          .padding=${["xs","0","xs","0"]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){var e,t;return null==(t=null==(e=this.activeConnector)?void 0:e.connectors)?void 0:t.map(e=>e.name?n`
            <wui-list-wallet
              imageSrc=${_(l.getChainImage(e.chain))}
              name=${g.CHAIN_NAME_MAP[e.chain]}
              @click=${()=>this.onConnector(e)}
              data-testid="wui-list-chain-${e.chain}"
            ></wui-list-wallet>
          `:null)}onConnector(e){var t,i;const o=null==(i=null==(t=this.activeConnector)?void 0:t.connectors)?void 0:i.find(t=>t.chain===e.chain);o?"walletConnect"===o.id?d.isMobile()?b.push("AllWallets"):b.push("ConnectingWalletConnect"):b.push("ConnectingExternal",{connector:o}):f.showError("Failed to find connector")}};so.styles=ao,ro([U()],so.prototype,"activeConnector",void 0),so=ro([z("w3m-connecting-multi-chain-view")],so);var lo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let co=class extends o{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.generateTabs();return n`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){const e=this.platforms.map(e=>"browser"===e?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===e?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===e?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===e?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===e?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=e.map(({platform:e})=>e),e}onTabChange(e){var t;const i=this.platformTabs[e];i&&(null==(t=this.onSelectPlatfrom)||t.call(this,i))}};lo([W({type:Array})],co.prototype,"platforms",void 0),lo([W()],co.prototype,"onSelectPlatfrom",void 0),co=lo([z("w3m-connecting-header")],co);let uo=class extends oo{constructor(){var e;if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:null==(e=this.wallet)?void 0:e.display_index}})}async onConnectProxy(){var e;try{this.error=!1;const{connectors:t}=w.state,i=t.find(e=>{var t,i,o;return"ANNOUNCED"===e.type&&(null==(t=e.info)?void 0:t.rdns)===(null==(i=this.wallet)?void 0:i.rdns)||"INJECTED"===e.type||e.name===(null==(o=this.wallet)?void 0:o.name)});if(!i)throw new Error("w3m-connecting-wc-browser: No connector found");await y.connectExternal(i,i.chain),u.close(),p.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:(null==(e=this.wallet)?void 0:e.name)||"Unknown"}})}catch(t){p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(null==t?void 0:t.message)??"Unknown"}}),this.error=!0}}};uo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-connecting-wc-browser")],uo);let po=class extends oo{constructor(){var e;if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:null==(e=this.wallet)?void 0:e.display_index}})}onRenderProxy(){var e;!this.ready&&this.uri&&(this.ready=!0,null==(e=this.onConnect)||e.call(this))}onConnectProxy(){var e;if((null==(e=this.wallet)?void 0:e.desktop_link)&&this.uri)try{this.error=!1;const{desktop_link:e,name:t}=this.wallet,{redirect:i,href:o}=d.formatNativeUrl(e,this.uri);y.setWcLinking({name:t,href:o}),y.setRecentWallet(this.wallet),d.openHref(i,"_blank")}catch{this.error=!0}}};po=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-connecting-wc-desktop")],po);var ho=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let wo=class extends oo{constructor(){var e;if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=r.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{var e;if((null==(e=this.wallet)?void 0:e.mobile_link)&&this.uri)try{this.error=!1;const{mobile_link:e,link_mode:t,name:i}=this.wallet,{redirect:o,redirectUniversalLink:n,href:a}=d.formatNativeUrl(e,this.uri,t);this.redirectDeeplink=o,this.redirectUniversalLink=n,this.target=d.isIframe()?"_top":"_self",y.setWcLinking({name:i,href:a}),y.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?d.openHref(this.redirectUniversalLink,this.target):d.openHref(this.redirectDeeplink,this.target)}catch(t){p.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=m.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(y.subscribeKey("wcUri",()=>{this.onHandleURI()})),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:null==(e=this.wallet)?void 0:e.display_index}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){var e;this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,null==(e=this.onConnect)||e.call(this))}onTryAgain(){var e;y.setWcError(!1),null==(e=this.onConnect)||e.call(this)}};ho([U()],wo.prototype,"redirectDeeplink",void 0),ho([U()],wo.prototype,"redirectUniversalLink",void 0),ho([U()],wo.prototype,"target",void 0),ho([U()],wo.prototype,"preferUniversalLinks",void 0),ho([U()],wo.prototype,"isLoading",void 0),wo=ho([z("w3m-connecting-wc-mobile")],wo);const go=e`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }
`;let bo=class extends oo{constructor(){var e,t;super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:(null==(e=this.wallet)?void 0:e.name)??"WalletConnect",platform:"qrcode",displayIndex:null==(t=this.wallet)?void 0:t.display_index}})}disconnectedCallback(){var e;super.disconnectedCallback(),null==(e=this.unsubscribe)||e.forEach(e=>e()),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","xl","xl","xl"]}
        gap="xl"
      >
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const e=this.getBoundingClientRect().width-40,t=this.wallet?this.wallet.name:void 0;return y.setWcLinking(void 0),y.setRecentWallet(this.wallet),n` <wui-qr-code
      size=${e}
      theme=${j.state.themeMode}
      uri=${this.uri}
      imageSrc=${_(l.getWalletImage(this.wallet))}
      color=${_(j.state.themeVariables["--w3m-qr-color"])}
      alt=${_(t)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){const e=!this.uri||!this.ready;return n`<wui-link
      .disabled=${e}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};bo.styles=go,bo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-connecting-wc-qrcode")],bo);let mo=class extends o{constructor(){var e,t;if(super(),this.wallet=null==(e=b.state.data)?void 0:e.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:null==(t=this.wallet)?void 0:t.display_index}})}render(){return n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${_(l.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};mo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-connecting-wc-unsupported")],mo);var fo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let vo=class extends oo{constructor(){var e;if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=m.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(y.subscribeKey("wcUri",()=>{this.updateLoadingState()})),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:null==(e=this.wallet)?void 0:e.display_index}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){var e;if((null==(e=this.wallet)?void 0:e.webapp_link)&&this.uri)try{this.error=!1;const{webapp_link:e,name:t}=this.wallet,{redirect:i,href:o}=d.formatUniversalUrl(e,this.uri);y.setWcLinking({name:t,href:o}),y.setRecentWallet(this.wallet),d.openHref(i,"_blank")}catch{this.error=!0}}};fo([U()],vo.prototype,"isLoading",void 0),vo=fo([z("w3m-connecting-wc-web")],vo);var xo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let yo=class extends o{constructor(){var e;super(),this.wallet=null==(e=b.state.data)?void 0:e.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=Boolean(r.state.siwx),this.remoteFeatures=r.state.remoteFeatures,this.displayBranding=!0,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(r.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){var e;return(null==(e=this.remoteFeatures)?void 0:e.reownBranding)&&this.displayBranding?n`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(e=!1){var t,i;if("browser"!==this.platform&&(!r.state.manualWCControl||e))try{const{wcPairingExpiry:i,status:o}=y.state;if(e||r.state.enableEmbedded||d.isPairingExpired(i)||"connecting"===o){const e=y.getConnections(a.state.activeChain),i=null==(t=this.remoteFeatures)?void 0:t.multiWallet,o=e.length>0;await y.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(o&&i?(b.replace("ProfileWallets"),f.showSuccess("New Wallet Added")):u.close())}}catch(o){if(o instanceof Error&&o.message.includes("An error occurred when attempting to switch chain")&&!r.state.enableNetworkSwitch&&a.state.activeChain)return a.setActiveCaipNetwork(P.getUnsupportedNetwork(`${a.state.activeChain}:${null==(i=a.state.activeCaipNetwork)?void 0:i.id}`)),void a.showUnsupportedChainUI();p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(null==o?void 0:o.message)??"Unknown"}}),y.setWcError(!0),f.showError(o.message??"Connection error"),y.resetWcConnection(),b.goBack()}}determinePlatforms(){if(!this.wallet)return this.platforms.push("qrcode"),void(this.platform="qrcode");if(this.platform)return;const{mobile_link:e,desktop_link:t,webapp_link:i,injected:o,rdns:n}=this.wallet,s=null==o?void 0:o.map(({injected_id:e})=>e).filter(Boolean),l=[...n?[n]:s??[]],c=!r.state.isUniversalProvider&&l.length,u=e,p=i,h=y.checkInstalled(l),w=c&&h,g=t&&!d.isMobile();w&&!a.state.noAdapters&&this.platforms.push("browser"),u&&this.platforms.push(d.isMobile()?"mobile":"qrcode"),p&&this.platforms.push("web"),g&&this.platforms.push("desktop"),w||!c||a.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return n`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return n`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return n`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return n`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return n`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return n`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?n`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){var t;const i=null==(t=this.shadowRoot)?void 0:t.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};xo([U()],yo.prototype,"platform",void 0),xo([U()],yo.prototype,"platforms",void 0),xo([U()],yo.prototype,"isSiwxEnabled",void 0),xo([U()],yo.prototype,"remoteFeatures",void 0),xo([W({type:Boolean})],yo.prototype,"displayBranding",void 0),yo=xo([z("w3m-connecting-wc-view")],yo);var Co=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let ko=class extends o{constructor(){super(),this.unsubscribe=[],this.isMobile=d.isMobile(),this.remoteFeatures=r.state.remoteFeatures,this.unsubscribe.push(r.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){const{featured:e,recommended:t}=R.state,{customWallets:i}=r.state,o=h.getRecentWallets(),a=e.length||t.length||(null==i?void 0:i.length)||o.length;return n`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${a?n`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return n`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
        <w3m-connecting-wc-view .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){var e;return(null==(e=this.remoteFeatures)?void 0:e.reownBranding)?n` <wui-flex flexDirection="column" .padding=${["3xs","0","3xs","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};Co([U()],ko.prototype,"isMobile",void 0),Co([U()],ko.prototype,"remoteFeatures",void 0),ko=Co([z("w3m-connecting-wc-basic-view")],ko);const $o=e`
  .continue-button-container {
    width: 100%;
  }
`;var So=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Io=class extends o{constructor(){super(...arguments),this.loading=!1}render(){return n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="xxl"
        .padding=${["0","0","l","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{d.openHref(q.URLS.FAQ,"_blank")}}
        >
          Learn more about names
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
          icon="id"
          size="xl"
          iconSize="xxl"
          iconColor="fg-200"
          backgroundColor="fg-200"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="s">
        <wui-text align="center" variant="medium-600" color="fg-100">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="paragraph-400" color="fg-100">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return n`<wui-flex
      .padding=${["0","2l","0","2l"]}
      gap="s"
      class="continue-button-container"
    >
      <wui-button
        fullWidth
        .loading=${this.loading}
        size="lg"
        borderRadius="xs"
        @click=${this.handleContinue.bind(this)}
        >Choose name
      </wui-button>
    </wui-flex>`}handleContinue(){b.push("RegisterAccountName"),p.sendEvent({type:"track",event:"OPEN_ENS_FLOW",properties:{isSmartAccount:v(a.state.activeChain)===x.ACCOUNT_TYPES.SMART_ACCOUNT}})}};Io.styles=$o,So([U()],Io.prototype,"loading",void 0),Io=So([z("w3m-choose-account-name-view")],Io);let To=class extends o{constructor(){var e;super(...arguments),this.wallet=null==(e=b.state.data)?void 0:e.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return n`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){var e;return(null==(e=this.wallet)?void 0:e.chrome_store)?n`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){var e;return(null==(e=this.wallet)?void 0:e.app_store)?n`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){var e;return(null==(e=this.wallet)?void 0:e.play_store)?n`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){var e;return(null==(e=this.wallet)?void 0:e.homepage)?n`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){var e;(null==(e=this.wallet)?void 0:e.chrome_store)&&d.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){var e;(null==(e=this.wallet)?void 0:e.app_store)&&d.openHref(this.wallet.app_store,"_blank")}onPlayStore(){var e;(null==(e=this.wallet)?void 0:e.play_store)&&d.openHref(this.wallet.play_store,"_blank")}onHomePage(){var e;(null==(e=this.wallet)?void 0:e.homepage)&&d.openHref(this.wallet.homepage,"_blank")}};To=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-downloads-view")],To);let Ro=class extends o{render(){return n`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.recommendedWalletsTemplate()}
        <wui-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          @click=${()=>{d.openHref("https://walletconnect.com/explorer?type=wallet","_blank")}}
        ></wui-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){const{recommended:e,featured:t}=R.state,{customWallets:i}=r.state;return[...t,...i??[],...e].slice(0,4).map(e=>n`
        <wui-list-wallet
          name=${e.name??"Unknown"}
          tagVariant="main"
          imageSrc=${_(l.getWalletImage(e))}
          @click=${()=>{d.openHref(e.homepage??"https://walletconnect.com/explorer","_blank")}}
        ></wui-list-wallet>
      `)}};Ro=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-get-wallet-view")],Ro);var Eo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ao=class extends o{constructor(){super(...arguments),this.data=[]}render(){return n`
      <wui-flex flexDirection="column" alignItems="center" gap="l">
        ${this.data.map(e=>n`
            <wui-flex flexDirection="column" alignItems="center" gap="xl">
              <wui-flex flexDirection="row" justifyContent="center" gap="1xs">
                ${e.images.map(e=>n`<wui-visual name=${e}></wui-visual>`)}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="xxs">
              <wui-text variant="paragraph-500" color="fg-100" align="center">
                ${e.title}
              </wui-text>
              <wui-text variant="small-500" color="fg-200" align="center">${e.text}</wui-text>
            </wui-flex>
          `)}
      </wui-flex>
    `}};Eo([W({type:Array})],Ao.prototype,"data",void 0),Ao=Eo([z("w3m-help-widget")],Ao);const Oo=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}];let No=class extends o{render(){return n`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${Oo}></w3m-help-widget>
        <wui-button variant="main" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){p.sendEvent({type:"track",event:"CLICK_GET_WALLET"}),b.push("GetWallet")}};No=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-what-is-a-wallet-view")],No);const jo=e`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var Po=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Do=class extends o{constructor(){super(),this.unsubscribe=[],this.checked=X.state.isLegalCheckboxChecked,this.unsubscribe.push(X.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){var e;const{termsConditionsUrl:t,privacyPolicyUrl:i}=r.state,o=null==(e=r.state.features)?void 0:e.legalCheckbox,a=Boolean(t||i)&&Boolean(o),s=a&&!this.checked,l=s?-1:void 0;return n`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${a?["0","s","s","s"]:"s"}
        gap="xs"
        class=${_(s?"disabled":void 0)}
      >
        <w3m-wallet-login-list tabIdx=${_(l)}></w3m-wallet-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}};Do.styles=jo,Po([U()],Do.prototype,"checked",void 0),Do=Po([z("w3m-connect-wallets-view")],Do);const Lo=e`
  :host {
    display: block;
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
  }

  svg {
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: var(--wui-color-accent-100);
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;let Wo=class extends o{render(){return n`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};Wo.styles=[t,Lo],Wo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("wui-loading-hexagon")],Wo);const Uo=e`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`;var Bo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let _o=class extends o{constructor(){var e;super(),this.network=null==(e=b.state.data)?void 0:e.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw new Error("w3m-network-switch-view: No network provided");this.onShowRetry();const e=this.getLabel(),t=this.getSubLabel();return n`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","3xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${_(l.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:n`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            ?border=${!0}
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">${e}</wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){const e=w.getConnectorId(a.state.activeChain);return w.getAuthConnector()&&e===g.CONNECTOR_ID.AUTH?"":this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet"}getLabel(){var e;const t=w.getConnectorId(a.state.activeChain);return w.getAuthConnector()&&t===g.CONNECTOR_ID.AUTH?`Switching to ${(null==(e=this.network)?void 0:e.name)??"Unknown"} network...`:this.error?"Switch declined":"Approve in wallet"}onShowRetry(){var e;if(this.error&&!this.showRetry){this.showRetry=!0;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("wui-button");null==t||t.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}async onSwitchNetwork(){var e;try{this.error=!1,a.state.activeChain!==(null==(e=this.network)?void 0:e.chainNamespace)&&a.setIsSwitchingNamespace(!0),this.network&&await a.switchActiveNetwork(this.network)}catch(t){this.error=!0}}};_o.styles=Uo,Bo([U()],_o.prototype,"showRetry",void 0),Bo([U()],_o.prototype,"error",void 0),_o=Bo([z("w3m-network-switch-view")],_o);const zo=e`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button[data-transparent='true'] {
    pointer-events: none;
    background-color: transparent;
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-image {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    border-radius: 100%;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }
`;var Fo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Mo=class extends o{constructor(){super(...arguments),this.imageSrc="",this.name="",this.disabled=!1,this.selected=!1,this.transparent=!1}render(){return n`
      <button data-transparent=${this.transparent} ?disabled=${this.disabled}>
        <wui-flex gap="s" alignItems="center">
          ${this.templateNetworkImage()}
          <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text></wui-flex
        >
        ${this.checkmarkTemplate()}
      </button>
    `}checkmarkTemplate(){return this.selected?n`<wui-icon size="sm" color="accent-100" name="checkmarkBold"></wui-icon>`:null}templateNetworkImage(){return this.imageSrc?n`<wui-image size="sm" src=${this.imageSrc} name=${this.name}></wui-image>`:this.imageSrc?null:n`<wui-network-image
        ?round=${!0}
        size="md"
        name=${this.name}
      ></wui-network-image>`}};Mo.styles=[t,i,zo],Fo([W()],Mo.prototype,"imageSrc",void 0),Fo([W()],Mo.prototype,"name",void 0),Fo([W({type:Boolean})],Mo.prototype,"disabled",void 0),Fo([W({type:Boolean})],Mo.prototype,"selected",void 0),Fo([W({type:Boolean})],Mo.prototype,"transparent",void 0),Mo=Fo([z("wui-list-network")],Mo);const Ko=e`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`;var Vo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let qo=class extends o{constructor(){super(),this.unsubscribe=[],this.network=a.state.activeCaipNetwork,this.requestedCaipNetworks=a.getCaipNetworks(),this.search="",this.onDebouncedSearch=d.debounce(e=>{this.search=e},100),this.unsubscribe.push(s.subscribeNetworkImages(()=>this.requestUpdate()),a.subscribeKey("activeCaipNetwork",e=>this.network=e),a.subscribe(()=>{this.requestedCaipNetworks=a.getAllRequestedCaipNetworks()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${["0","s","s","s"]}
        flexDirection="column"
        gap="xs"
      >
        ${this.networksTemplate()}
      </wui-flex>

      <wui-separator></wui-separator>

      <wui-flex padding="s" flexDirection="column" gap="m" alignItems="center">
        <wui-text variant="small-400" color="fg-300" align="center">
          Your connected wallet may not support some of the networks available for this dApp
        </wui-text>
        <wui-link @click=${this.onNetworkHelp.bind(this)}>
          <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
          What is a network
        </wui-link>
      </wui-flex>
    `}templateSearchInput(){return n`
      <wui-flex gap="xs" .padding=${["0","s","s","s"]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onNetworkHelp(){p.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),b.push("WhatIsANetwork")}networksTemplate(){var e;const t=a.getAllApprovedCaipNetworkIds(),i=d.sortRequestedNetworks(t,this.requestedCaipNetworks);return this.search?this.filteredNetworks=null==i?void 0:i.filter(e=>{var t;return null==(t=null==e?void 0:e.name)?void 0:t.toLowerCase().includes(this.search.toLowerCase())}):this.filteredNetworks=i,null==(e=this.filteredNetworks)?void 0:e.map(e=>{var t;return n`
        <wui-list-network
          .selected=${(null==(t=this.network)?void 0:t.id)===e.id}
          imageSrc=${_(l.getNetworkImage(e))}
          type="network"
          name=${e.name??e.id}
          @click=${()=>this.onSwitchNetwork(e)}
          .disabled=${this.getNetworkDisabled(e)}
          data-testid=${`w3m-network-switch-${e.name??e.id}`}
        ></wui-list-network>
      `})}getNetworkDisabled(e){const t=e.chainNamespace,i=c.getCaipAddress(t),o=a.getAllApprovedCaipNetworkIds(),n=!1!==a.getNetworkProp("supportsAllNetworks",t),r=w.getConnectorId(t),s=w.getAuthConnector(),l=r===g.CONNECTOR_ID.AUTH&&s;return!(!i||n||l)&&!(null==o?void 0:o.includes(e.caipNetworkId))}onSwitchNetwork(e){D.onSwitchNetwork({network:e})}};qo.styles=Ko,Vo([U()],qo.prototype,"network",void 0),Vo([U()],qo.prototype,"requestedCaipNetworks",void 0),Vo([U()],qo.prototype,"filteredNetworks",void 0),Vo([U()],qo.prototype,"search",void 0),qo=Vo([z("w3m-networks-view")],qo);const Ho=e`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-visual {
    width: var(--wui-wallet-image-size-lg);
    height: var(--wui-wallet-image-size-lg);
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity var(--wui-ease-out-power-2) var(--wui-duration-lg),
      transform var(--wui-ease-out-power-2) var(--wui-duration-lg);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
  }

  .capitalize {
    text-transform: capitalize;
  }
`;var Go=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Yo={eip155:"eth",solana:"solana",bip122:"bitcoin",polkadot:void 0};let Xo=class extends o{constructor(){var e,t;super(...arguments),this.unsubscribe=[],this.switchToChain=null==(e=b.state.data)?void 0:e.switchToChain,this.caipNetwork=null==(t=b.state.data)?void 0:t.network,this.activeChain=a.state.activeChain}firstUpdated(){this.unsubscribe.push(a.subscribeKey("activeChain",e=>this.activeChain=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.switchToChain?g.CHAIN_NAME_MAP[this.switchToChain]:"supported";if(!this.switchToChain)return null;const t=g.CHAIN_NAME_MAP[this.switchToChain];return n`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="xl">
          <wui-visual name=${_(Yo[this.switchToChain])}></wui-visual>
          <wui-text
            data-testid=${`w3m-switch-active-chain-to-${t}`}
            variant="paragraph-500"
            color="fg-100"
            align="center"
            >Switch to <span class="capitalize">${t}</span></wui-text
          >
          <wui-text variant="small-400" color="fg-200" align="center">
            Connected wallet doesn't support connecting to ${e} chain. You
            need to connect with a different wallet.
          </wui-text>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(a.setIsSwitchingNamespace(!0),w.setFilterByNamespace(this.switchToChain),this.caipNetwork?await a.switchActiveNetwork(this.caipNetwork):a.setActiveNamespace(this.switchToChain),b.reset("Connect"))}};Xo.styles=Ho,Go([W()],Xo.prototype,"activeChain",void 0),Xo=Go([z("w3m-switch-active-chain-view")],Xo);const Qo=[{images:["network","layers","system"],title:"The system’s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}];let Zo=class extends o{render(){return n`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${Qo}></w3m-help-widget>
        <wui-button
          variant="main"
          size="md"
          @click=${()=>{d.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Zo=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-what-is-a-network-view")],Zo);const Jo=e`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var en=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let tn=class extends o{constructor(){var e;super(),this.swapUnsupportedChain=null==(e=b.state.data)?void 0:e.swapUnsupportedChain,this.unsubscribe=[],this.disconnecting=!1,this.remoteFeatures=r.state.remoteFeatures,this.unsubscribe.push(s.subscribeNetworkImages(()=>this.requestUpdate()),r.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${["m","xl","xs","xl"]}
          alignItems="center"
          gap="xl"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="s" gap="xs">
          ${this.networksTemplate()}
        </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="s" gap="xs">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="disconnect"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?n`
        <wui-text variant="small-400" color="fg-200" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:n`
      <wui-text variant="small-400" color="fg-200" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){const e=a.getAllRequestedCaipNetworks(),t=a.getAllApprovedCaipNetworkIds(),i=d.sortRequestedNetworks(t,e);return(this.swapUnsupportedChain?i.filter(e=>m.SWAP_SUPPORTED_NETWORKS.includes(e.caipNetworkId)):i).map(e=>n`
        <wui-list-network
          imageSrc=${_(l.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onSwitchNetwork(e)}
        >
        </wui-list-network>
      `)}async onDisconnect(){var e;try{this.disconnecting=!0;const t=a.state.activeChain,i=y.getConnections(t).length>0,o=t&&w.state.activeConnectorIds[t],n=null==(e=this.remoteFeatures)?void 0:e.multiWallet;await y.disconnect(n?{id:o,namespace:t}:{}),i&&n&&(b.push("ProfileWallets"),f.showSuccess("Wallet deleted"))}catch{p.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),f.showError("Failed to disconnect")}finally{this.disconnecting=!1}}async onSwitchNetwork(e){const t=c.state.caipAddress,i=a.getAllApprovedCaipNetworkIds(),o=(a.getNetworkProp("supportsAllNetworks",e.chainNamespace),b.state.data);t?(null==i?void 0:i.includes(e.caipNetworkId))?await a.switchActiveNetwork(e):b.push("SwitchNetwork",{...o,network:e}):t||(a.setActiveCaipNetwork(e),b.push("Connect"))}};tn.styles=Jo,en([U()],tn.prototype,"disconnecting",void 0),en([U()],tn.prototype,"remoteFeatures",void 0),tn=en([z("w3m-unsupported-chain-view")],tn);const on=e`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-s);
    padding: var(--wui-spacing-1xs) var(--wui-spacing-s) var(--wui-spacing-1xs)
      var(--wui-spacing-1xs);
  }
`;var nn=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let an=class extends o{constructor(){super(...arguments),this.icon="externalLink",this.text=""}render(){return n`
      <wui-flex gap="1xs" alignItems="center">
        <wui-icon-box
          size="sm"
          iconcolor="fg-200"
          backgroundcolor="fg-200"
          icon=${this.icon}
          background="transparent"
        ></wui-icon-box>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
      </wui-flex>
    `}};an.styles=[t,i,on],nn([W()],an.prototype,"icon",void 0),nn([W()],an.prototype,"text",void 0),an=nn([z("wui-banner")],an);const rn=e`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;let sn=class extends o{constructor(){super(),this.unsubscribe=[]}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n` <wui-flex
      flexDirection="column"
      .padding=${["xs","s","m","s"]}
      gap="xs"
    >
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){const e=a.getAllRequestedCaipNetworks(),t=a.getAllApprovedCaipNetworkIds(),i=a.state.activeCaipNetwork,o=a.checkIfSmartAccountEnabled();let r=d.sortRequestedNetworks(t,e);if(o&&v(null==i?void 0:i.chainNamespace)===x.ACCOUNT_TYPES.SMART_ACCOUNT){if(!i)return null;r=[i]}return r.filter(e=>e.chainNamespace===(null==i?void 0:i.chainNamespace)).map(e=>n`
        <wui-list-network
          imageSrc=${_(l.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          ?transparent=${!0}
        >
        </wui-list-network>
      `)}};sn.styles=rn,sn=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-wallet-compatible-networks-view")],sn);const ln=e`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--wui-icon-box-size-xl);
    height: var(--wui-icon-box-size-xl);
    box-shadow: 0 0 0 8px var(--wui-thumbnail-border);
    border-radius: var(--local-border-radius);
    overflow: hidden;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`;var cn=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let dn=class extends o{render(){return this.style.cssText=`--local-border-radius: ${this.borderRadiusFull?"1000px":"20px"}; background-color: var(--wui-color-modal-bg);`,n`${this.templateVisual()}`}templateVisual(){return this.imageSrc?n`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:n`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};dn.styles=[t,ln],cn([W()],dn.prototype,"imageSrc",void 0),cn([W()],dn.prototype,"alt",void 0),cn([W({type:Boolean})],dn.prototype,"borderRadiusFull",void 0),dn=cn([z("wui-visual-thumbnail")],dn);const un=e`
  :host {
    display: flex;
    justify-content: center;
    gap: var(--wui-spacing-2xl);
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`;let pn=class extends o{constructor(){var e,t;super(...arguments),this.dappImageUrl=null==(e=r.state.metadata)?void 0:e.icons,this.walletImageUrl=null==(t=c.state.connectedWalletInfo)?void 0:t.icon}firstUpdated(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelectorAll("wui-visual-thumbnail");(null==t?void 0:t[0])&&this.createAnimation(t[0],"translate(18px)"),(null==t?void 0:t[1])&&this.createAnimation(t[1],"translate(-18px)")}render(){var e;return n`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${null==(e=this.dappImageUrl)?void 0:e[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,t){e.animate([{transform:"translateX(0px)"},{transform:t}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};pn.styles=un,pn=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r}([z("w3m-siwx-sign-message-thumbnails")],pn);var hn=function(e,t,i,o){var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let wn=class extends o{constructor(){var e;super(...arguments),this.dappName=null==(e=r.state.metadata)?void 0:e.name,this.isCancelling=!1,this.isSigning=!1}render(){return n`
      <wui-flex justifyContent="center" .padding=${["2xl","0","xxl","0"]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex
        .padding=${["0","4xl","l","4xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex
        .padding=${["0","3xl","l","3xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["l","xl","xl","xl"]} gap="s" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          ${this.isCancelling?"Cancelling...":"Cancel"}
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="main"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0;try{await L.requestSignMessage()}catch(e){if(e instanceof Error&&e.message.includes("OTP is required"))return f.showError({message:"Something went wrong. We need to verify your account again."}),void b.replace("DataCapture");throw e}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,await L.cancelSignMessage().finally(()=>this.isCancelling=!1)}};hn([U()],wn.prototype,"isCancelling",void 0),hn([U()],wn.prototype,"isSigning",void 0),wn=hn([z("w3m-siwx-sign-message-view")],wn);export{ne as AppKitAccountButton,ce as AppKitButton,be as AppKitConnectButton,$e as AppKitNetworkButton,oe as W3mAccountButton,Oe as W3mAccountSettingsView,st as W3mAccountView,Jt as W3mAllWalletsView,le as W3mButton,Io as W3mChooseAccountNameView,ge as W3mConnectButton,Gi as W3mConnectView,Do as W3mConnectWalletsView,no as W3mConnectingExternalView,so as W3mConnectingMultiChainView,ko as W3mConnectingWcBasicView,yo as W3mConnectingWcView,To as W3mDownloadsView,Ro as W3mGetWalletView,ke as W3mNetworkButton,_o as W3mNetworkSwitchView,qo as W3mNetworksView,$t as W3mProfileWalletsView,M as W3mRouter,wn as W3mSIWXSignMessageView,Xo as W3mSwitchActiveChainView,tn as W3mUnsupportedChainView,sn as W3mWalletCompatibleNetworksView,Zo as W3mWhatIsANetworkView,No as W3mWhatIsAWalletView};
