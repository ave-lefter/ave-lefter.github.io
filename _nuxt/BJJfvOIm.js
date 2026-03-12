import{cv as e,gZ as t,by as o,bA as i,bq as a,br as s,bu as r,bv as n,bK as c,bs as l,bt as d,bF as p,dM as u,gY as h,bS as w,bC as m,dL as g,bO as b,bJ as f,bz as v,g_ as y,dN as k,g$ as x,dO as C,bH as S,bB as N}from"./D6y-ViDA.js";import{n as T,r as A}from"./8ReBD8jy.js";import{o as E}from"./C1IbZtR7.js";import{c as O,U as $}from"./BqICjlzW.js";import"./DbAB4eZS.js";import"./Bia0ufMq.js";import"./Bnk68-zm.js";import"./DheuQlak.js";import"./C7x2X-wk.js";import"./CYU1QoPF.js";import"./BJ0ltoFe.js";import"./DNMWMCJo.js";import{S as P}from"./F_H-PHCz.js";import"./CevG08QP.js";const W={isUnsupportedChainView:()=>"UnsupportedChain"===o.state.view||"SwitchNetwork"===o.state.view&&o.state.history.includes("UnsupportedChain"),async safeClose(){if(this.isUnsupportedChainView())return void e.shake();await t.isSIWXCloseDisabled()?e.shake():("DataCapture"!==o.state.view&&"DataCaptureOtpConfirm"!==o.state.view||i.disconnect(),e.close())}},I=a`
  :host {
    display: block;
    border-radius: clamp(0px, var(--wui-border-radius-l), 44px);
    box-shadow: 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-modal-bg);
    overflow: hidden;
  }

  :host([data-embedded='true']) {
    box-shadow:
      0 0 0 1px var(--wui-color-gray-glass-005),
      0px 4px 12px 4px var(--w3m-card-embedded-shadow-color);
  }
`;let R=class extends r{render(){return n`<slot></slot>`}};R.styles=[s,I],R=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r}([O("wui-card")],R);const j=a`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-dark-glass-100);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-325);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: var(--wui-border-radius-3xs);
    background-color: var(--local-icon-bg-value);
  }
`;var B=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r};let D=class extends r{constructor(){super(...arguments),this.message="",this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="info"}render(){return this.style.cssText=`\n      --local-icon-bg-value: var(--wui-color-${this.backgroundColor});\n   `,n`
      <wui-flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <wui-flex columnGap="xs" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color=${this.iconColor} size="md" name=${this.icon}></wui-icon>
          </wui-flex>
          <wui-text variant="small-500" color="bg-350" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="bg-350"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){c.close()}};D.styles=[s,j],B([T()],D.prototype,"message",void 0),B([T()],D.prototype,"backgroundColor",void 0),B([T()],D.prototype,"iconColor",void 0),B([T()],D.prototype,"icon",void 0),D=B([O("wui-alertbar")],D);const L=a`
  :host {
    display: block;
    position: absolute;
    top: var(--wui-spacing-s);
    left: var(--wui-spacing-l);
    right: var(--wui-spacing-l);
    opacity: 0;
    pointer-events: none;
  }
`;var z=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r};const K={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"exclamationTriangle"}};let U=class extends r{constructor(){super(),this.unsubscribe=[],this.open=c.state.open,this.onOpen(!0),this.unsubscribe.push(c.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:t}=c.state,o=K[t];return n`
      <wui-alertbar
        message=${e}
        backgroundColor=${o?.backgroundColor}
        iconColor=${o?.iconColor}
        icon=${o?.icon}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};U.styles=L,z([A()],U.prototype,"open",void 0),U=z([O("w3m-alertbar")],U);const H=a`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    gap: var(--wui-spacing-xxs);
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xxs);
  }

  wui-image {
    border-radius: 100%;
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  wui-icon-box {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var Y=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r};let V=class extends r{constructor(){super(...arguments),this.imageSrc=""}render(){return n`<button>
      ${this.imageTemplate()}
      <wui-icon size="xs" color="fg-200" name="chevronBottom"></wui-icon>
    </button>`}imageTemplate(){return this.imageSrc?n`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`:n`<wui-icon-box
      size="xxs"
      iconColor="fg-200"
      backgroundColor="fg-100"
      background="opaque"
      icon="networkPlaceholder"
    ></wui-icon-box>`}};V.styles=[s,l,d,H],Y([T()],V.prototype,"imageSrc",void 0),V=Y([O("wui-select")],V);const M=a`
  :host {
    height: 64px;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards var(--wui-ease-out-power-2),
      slide-down-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards var(--wui-ease-out-power-2),
      slide-up-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;var _=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r};const X=["SmartSessionList"];function q(){const e=o.state.data?.connector?.name,t=o.state.data?.wallet?.name,i=o.state.data?.network?.name,a=t??e,s=b.getConnectors();return{Connect:`Connect ${1===s.length&&"w3m-email"===s[0]?.id?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:a??"Connect Wallet",ConnectingWalletConnect:a??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview convert",Downloads:a?`Get ${a}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:i??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select token",SwapPreview:"Preview swap",WalletSend:"Send",WalletSendPreview:"Review send",WalletSendSelectToken:"Select Token",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a wallet?",ConnectWallets:"Connect wallet",ConnectSocials:"All socials",ConnectingSocial:f.state.socialProvider?f.state.socialProvider:"Connect Social",ConnectingMultiChain:"Select chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in progress",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email",FundWallet:"Fund wallet",PayWithExchange:"Deposit from an exchange"}}let F=class extends r{constructor(){super(),this.unsubscribe=[],this.heading=q()[o.state.view],this.network=p.state.activeCaipNetwork,this.networkImage=u.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=o.state.view,this.viewDirection="",this.headerText=q()[o.state.view],this.unsubscribe.push(h.subscribeNetworkImages(()=>{this.networkImage=u.getNetworkImage(this.network)}),o.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.headerText=q()[e]},w.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),p.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=u.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return n`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){m.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),o.push("WhatIsAWallet")}async onClose(){await W.safeClose()}rightHeaderTemplate(){const e=g?.state?.features?.smartSessions;return"Account"===o.state.view&&e?n`<wui-flex>
      <wui-icon-link
        icon="clock"
        @click=${()=>o.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-link>
      ${this.closeButtonTemplate()}
    </wui-flex> `:this.closeButtonTemplate()}closeButtonTemplate(){return n`
      <wui-icon-link
        icon="close"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-link>
    `}titleTemplate(){const e=X.includes(this.view);return n`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="xs"
      >
        <wui-text variant="paragraph-700" color="fg-100" data-testid="w3m-header-text"
          >${this.headerText}</wui-text
        >
        ${e?n`<wui-tag variant="main">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){const{view:e}=o.state,t="Connect"===e,i=g.state.enableEmbedded,a="ApproveTransaction"===e,s="ConnectingSiwe"===e,r="Account"===e,c=g.state.enableNetworkSwitch,l=a||s||t&&i;return r&&c?n`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${E(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${E(this.networkImage)}
      ></wui-select>`:this.showBack&&!l?n`<wui-icon-link
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-link>`:n`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`}onNetworks(){this.isAllowedNetworkSwitch()&&(m.sendEvent({type:"track",event:"CLICK_NETWORKS"}),o.push("Networks"))}isAllowedNetworkSwitch(){const e=p.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,o=e?.find(({id:e})=>e===this.network?.id);return t||!o}getPadding(){return this.heading?["l","2l","l","2l"]:["0","2l","0","2l"]}onViewChange(){const{history:e}=o.state;let t=w.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=w.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){const{history:e}=o.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){o.goBack()}};F.styles=M,_([A()],F.prototype,"heading",void 0),_([A()],F.prototype,"network",void 0),_([A()],F.prototype,"networkImage",void 0),_([A()],F.prototype,"showBack",void 0),_([A()],F.prototype,"prevHistoryLength",void 0),_([A()],F.prototype,"view",void 0),_([A()],F.prototype,"viewDirection",void 0),_([A()],F.prototype,"headerText",void 0),F=_([O("w3m-header")],F);const G=a`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-s);
    align-items: center;
    padding: var(--wui-spacing-xs) var(--wui-spacing-m) var(--wui-spacing-xs) var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-005);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-175);
    box-shadow:
      0px 14px 64px -4px rgba(0, 0, 0, 0.15),
      0px 8px 22px -6px rgba(0, 0, 0, 0.15);

    max-width: 300px;
  }

  :host wui-loading-spinner {
    margin-left: var(--wui-spacing-3xs);
  }
`;var J=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r};let Z=class extends r{constructor(){super(...arguments),this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="checkmark",this.message="",this.loading=!1,this.iconType="default"}render(){return n`
      ${this.templateIcon()}
      <wui-text variant="paragraph-500" color="fg-100" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return this.loading?n`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:"default"===this.iconType?n`<wui-icon size="xl" color=${this.iconColor} name=${this.icon}></wui-icon>`:n`<wui-icon-box
      size="sm"
      iconSize="xs"
      iconColor=${this.iconColor}
      backgroundColor=${this.backgroundColor}
      icon=${this.icon}
      background="opaque"
    ></wui-icon-box>`}};Z.styles=[s,G],J([T()],Z.prototype,"backgroundColor",void 0),J([T()],Z.prototype,"iconColor",void 0),J([T()],Z.prototype,"icon",void 0),J([T()],Z.prototype,"message",void 0),J([T()],Z.prototype,"loading",void 0),J([T()],Z.prototype,"iconType",void 0),Z=J([O("wui-snackbar")],Z);const Q=a`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var ee=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r};const te={loading:void 0,success:{backgroundColor:"success-100",iconColor:"success-100",icon:"checkmark"},error:{backgroundColor:"error-100",iconColor:"error-100",icon:"close"}};let oe=class extends r{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=v.state.open,this.unsubscribe.push(v.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:t,svg:o}=v.state,i=te[t],{icon:a,iconColor:s}=o??i??{};return n`
      <wui-snackbar
        message=${e}
        backgroundColor=${i?.backgroundColor}
        iconColor=${s}
        icon=${a}
        .loading=${"loading"===t}
      ></wui-snackbar>
    `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),v.state.autoClose&&(this.timeout=setTimeout(()=>v.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};oe.styles=Q,ee([A()],oe.prototype,"open",void 0),oe=ee([O("w3m-snackbar")],oe);const ie=a`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host(.appkit-modal) wui-card {
    max-width: 400px;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`;var ae=function(e,t,o,i){var a,s=arguments.length,r=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(s<3?a(r):s>3?a(t,o,r):a(t,o))||r);return s>3&&r&&Object.defineProperty(t,o,r),r};const se="scroll-lock";class re extends r{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=g.state.enableEmbedded,this.open=e.state.open,this.caipAddress=p.state.activeCaipAddress,this.caipNetwork=p.state.activeCaipNetwork,this.shake=e.state.shake,this.filterByNamespace=b.state.filterByNamespace,this.initializeTheming(),y.prefetchAnalyticsConfig(),this.unsubscribe.push(e.subscribeKey("open",e=>e?this.onOpen():this.onClose()),e.subscribeKey("shake",e=>this.shake=e),p.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),p.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),g.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),b.subscribeKey("filterByNamespace",e=>{this.filterByNamespace===e||p.getAccountData(e)?.caipAddress||(y.fetchRecommendedWallets(),this.filterByNamespace=e)}))}firstUpdated(){if(this.caipAddress){if(this.enableEmbedded)return e.close(),void this.prefetch();this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.cssText=`\n      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--wui-border-radius-l), 44px)":"0px"};\n    `,this.enableEmbedded?n`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?n`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return n` <wui-card
      shake="${this.shake}"
      data-embedded="${E(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){await W.safeClose()}initializeTheming(){const{themeVariables:e,themeMode:t}=k.state,o=$.getColorTheme(t);x(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),v.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=se,e.textContent="\n      body {\n        touch-action: none;\n        overflow: hidden;\n        overscroll-behavior: contain;\n      }\n      w3m-modal {\n        pointer-events: auto;\n      }\n    ",document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${se}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){const{tagName:o}=t.target;!o||o.includes("W3M-")||o.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(i){const a=p.state.isSwitchingNamespace,s="ProfileWallets"===o.state.view;i?await this.onConnected({caipAddress:i,isSwitchingNamespace:a,isInProfileView:s}):a||this.enableEmbedded||s||e.close(),await t.initializeIfEnabled(i),this.caipAddress=i,p.setIsSwitchingNamespace(!1)}async onConnected(i){if(i.isInProfileView)return;const{chainNamespace:a,chainId:s,address:r}=C.parseCaipAddress(i.caipAddress),n=`${a}:${s}`,c=!S.getPlainAddress(this.caipAddress),l=await t.getSessions({address:r,caipNetworkId:n}),d=!t.getSIWX()||l.some(e=>e.data.accountAddress===r),p=i.isSwitchingNamespace&&d&&!this.enableEmbedded,u=this.enableEmbedded&&c;p?o.goBack():u&&e.close()}onNewNetwork(t){const i=this.caipNetwork,a=i?.caipNetworkId?.toString(),s=i?.chainNamespace,r=t?.caipNetworkId?.toString(),n=t?.chainNamespace,c=a!==r,l=c&&!(s!==n),d=i?.name===N.UNSUPPORTED_NETWORK_NAME,u="ConnectingExternal"===o.state.view,h="ProfileWallets"===o.state.view,w=!p.getAccountData(t?.chainNamespace)?.caipAddress,m="UnsupportedChain"===o.state.view,g=e.state.open;let b=!1;this.enableEmbedded&&"SwitchNetwork"===o.state.view&&(b=!0),c&&P.resetState(),!g||u||h||(w?c&&(b=!0):(m||l&&!d)&&(b=!0)),b&&"SIWXSignMessage"!==o.state.view&&o.goBack(),this.caipNetwork=t}prefetch(){this.hasPrefetched||(y.prefetch(),y.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}re.styles=ie,ae([T({type:Boolean})],re.prototype,"enableEmbedded",void 0),ae([A()],re.prototype,"open",void 0),ae([A()],re.prototype,"caipAddress",void 0),ae([A()],re.prototype,"caipNetwork",void 0),ae([A()],re.prototype,"shake",void 0),ae([A()],re.prototype,"filterByNamespace",void 0);let ne=class extends re{};ne=ae([O("w3m-modal")],ne);let ce=class extends re{};ce=ae([O("appkit-modal")],ce);export{ce as AppKitModal,ne as W3mModal,re as W3mModalBase};
