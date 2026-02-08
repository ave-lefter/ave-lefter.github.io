import{bh as e,bl as t,bq as i,bJ as a,bm as r}from"#entry";import{r as n}from"./mQLjjC5r.js";import{c as s}from"./CVzBkT9j.js";import{T as w}from"./DZlW0rpR.js";const c=e`
  :host {
    --prev-height: 0px;
    --new-height: 0px;
    display: block;
  }

  div.w3m-router-container {
    transform: translateY(0);
    opacity: 1;
  }

  div.w3m-router-container[view-direction='prev'] {
    animation:
      slide-left-out 150ms forwards ease,
      slide-left-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  div.w3m-router-container[view-direction='next'] {
    animation:
      slide-right-out 150ms forwards ease,
      slide-right-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(-10px);
      opacity: 0;
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;var o=function(e,t,i,a){var r,n=arguments.length,s=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,a);else for(var w=e.length-1;w>=0;w--)(r=e[w])&&(s=(n<3?r(s):n>3?r(t,i,s):r(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let m=class extends t{constructor(){super(),this.resizeObserver=void 0,this.prevHeight="0px",this.prevHistoryLength=1,this.unsubscribe=[],this.view=i.state.view,this.viewDirection="",this.unsubscribe.push(i.subscribeKey("view",e=>this.onViewChange(e)))}firstUpdated(){this.resizeObserver=new ResizeObserver(([e])=>{const t=`${e?.contentRect.height}px`;"0px"!==this.prevHeight&&(this.style.setProperty("--prev-height",this.prevHeight),this.style.setProperty("--new-height",t),this.style.animation="w3m-view-height 150ms forwards ease",this.style.height="auto"),setTimeout(()=>{this.prevHeight=t,this.style.animation="unset"},a.ANIMATION_DURATIONS.ModalHeight)}),this.resizeObserver?.observe(this.getWrapper())}disconnectedCallback(){this.resizeObserver?.unobserve(this.getWrapper()),this.unsubscribe.forEach(e=>e())}render(){return r`<div class="w3m-router-container" view-direction="${this.viewDirection}">
      ${this.viewTemplate()}
    </div>`}viewTemplate(){switch(this.view){case"AccountSettings":return r`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return r`<w3m-account-view></w3m-account-view>`;case"AllWallets":return r`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return r`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return r`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return r`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return r`<w3m-connect-view></w3m-connect-view>`;case"Create":return r`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return r`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return r`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return r`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return r`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return r`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return r`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return r`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return r`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return r`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return r`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return r`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return r`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return r`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return r`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return r`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return r`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return r`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return r`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return r`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return r`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return r`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return r`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return r`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return r`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return r`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return r`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return r`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return r`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return r`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return r`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return r`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return r`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WhatIsABuy":return r`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return r`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return r`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return r`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return r`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return r`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return r`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return r`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return r`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return r`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return r`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return r`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return r`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return r`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return r`<w3m-pay-loading-view></w3m-pay-loading-view>`;case"FundWallet":return r`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case"PayWithExchange":return r`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`}}onViewChange(e){w.hide();let t=a.VIEW_DIRECTION.Next;const{history:r}=i.state;r.length<this.prevHistoryLength&&(t=a.VIEW_DIRECTION.Prev),this.prevHistoryLength=r.length,this.viewDirection=t,setTimeout(()=>{this.view=e},a.ANIMATION_DURATIONS.ViewTransition)}getWrapper(){return this.shadowRoot?.querySelector("div")}};m.styles=c,o([n()],m.prototype,"view",void 0),o([n()],m.prototype,"viewDirection",void 0),m=o([s("w3m-router")],m);export{m as W};
