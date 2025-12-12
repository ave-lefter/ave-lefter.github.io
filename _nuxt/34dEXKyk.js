import{b3 as e,b7 as t,bl as i,bj as n,be as r,iR as o,b8 as s,b4 as a,b5 as l,bc as c,b9 as u,dP as d,bd as h,bg as p,bh as w,bi as f}from"./DvO0AinD.js";import{n as g,r as v}from"./B_ot7u58.js";import{c as m,U as x}from"./Bo-PKsy5.js";import"./knB1Rbyr.js";import"./DCLEmx3U.js";import{e as k,n as b}from"./BPF-pwSa.js";import"./1TgTHKeV.js";import{n as y,s as $}from"./Dm1rYZ30.js";import"./DUIMwiBp.js";import"./CoRX4Huk.js";import{S as A}from"./IKbGZ03p.js";import"./A3Pmin_Z.js";import"./DBTsf3Pl.js";import"./BvvJ-7-A.js";import"./BRI2zjzy.js";import{o as T}from"./4RH0AGma.js";import"./QP_KuhpX.js";import"./DS_txzci.js";import"./DNhRgnSN.js";const C=e`
  :host {
    width: 100%;
    height: 100px;
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-002);
    background-color: var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
    position: relative;
  }

  :host(:hover) {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    display: ruby;
    color: var(--wui-color-fg-100);
    margin: 0 var(--wui-spacing-xs);
  }

  .instruction {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .paste {
    display: inline-flex;
  }

  textarea {
    background: transparent;
    width: 100%;
    font-family: var(--w3m-font-family);
    font-size: var(--wui-font-size-medium);
    font-style: normal;
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    letter-spacing: var(--wui-letter-spacing-medium);
    color: var(--wui-color-fg-100);
    caret-color: var(--wui-color-accent-100);
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    border: none;
    outline: none;
    appearance: none;
    resize: none;
    overflow: hidden;
  }
`;var R=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let P=class extends t{constructor(){super(...arguments),this.inputElementRef=k(),this.instructionElementRef=k(),this.instructionHidden=Boolean(this.value),this.pasting=!1,this.onDebouncedSearch=i.debounce(async e=>{if(!e.length)return void this.setReceiverAddress("");const t=n.state.activeChain;if(i.isAddress(e,t))this.setReceiverAddress(e);else try{const t=await r.getEnsAddress(e);if(t){o.setReceiverProfileName(e),o.setReceiverAddress(t);const i=await r.getEnsAvatar(e);o.setReceiverProfileImageUrl(i||void 0)}}catch(s){this.setReceiverAddress(e)}finally{o.setLoading(!1)}})}firstUpdated(){this.value&&(this.instructionHidden=!0),this.checkHidden()}render(){return s` <wui-flex
      @click=${this.onBoxClick.bind(this)}
      flexDirection="column"
      justifyContent="center"
      gap="4xs"
      .padding=${["2xl","l","xl","l"]}
    >
      <wui-text
        ${b(this.instructionElementRef)}
        class="instruction"
        color="fg-300"
        variant="medium-400"
      >
        Type or
        <wui-button
          class="paste"
          size="md"
          variant="neutral"
          iconLeft="copy"
          @click=${this.onPasteClick.bind(this)}
        >
          <wui-icon size="sm" color="inherit" slot="iconLeft" name="copy"></wui-icon>
          Paste
        </wui-button>
        address
      </wui-text>
      <textarea
        spellcheck="false"
        ?disabled=${!this.instructionHidden}
        ${b(this.inputElementRef)}
        @input=${this.onInputChange.bind(this)}
        @blur=${this.onBlur.bind(this)}
        .value=${this.value??""}
        autocomplete="off"
      >
${this.value??""}</textarea
      >
    </wui-flex>`}async focusInput(){var e;this.instructionElementRef.value&&(this.instructionHidden=!0,await this.toggleInstructionFocus(!1),this.instructionElementRef.value.style.pointerEvents="none",null==(e=this.inputElementRef.value)||e.focus(),this.inputElementRef.value&&(this.inputElementRef.value.selectionStart=this.inputElementRef.value.selectionEnd=this.inputElementRef.value.value.length))}async focusInstruction(){var e;this.instructionElementRef.value&&(this.instructionHidden=!1,await this.toggleInstructionFocus(!0),this.instructionElementRef.value.style.pointerEvents="auto",null==(e=this.inputElementRef.value)||e.blur())}async toggleInstructionFocus(e){this.instructionElementRef.value&&await this.instructionElementRef.value.animate([{opacity:e?0:1},{opacity:e?1:0}],{duration:100,easing:"ease",fill:"forwards"}).finished}onBoxClick(){this.value||this.instructionHidden||this.focusInput()}onBlur(){this.value||!this.instructionHidden||this.pasting||this.focusInstruction()}checkHidden(){this.instructionHidden&&this.focusInput()}async onPasteClick(){this.pasting=!0;const e=await navigator.clipboard.readText();o.setReceiverAddress(e),this.focusInput()}onInputChange(e){var t;const i=e.target;this.pasting=!1,this.value=null==(t=e.target)?void 0:t.value,i.value&&!this.instructionHidden&&this.focusInput(),o.setLoading(!0),this.onDebouncedSearch(i.value)}setReceiverAddress(e){o.setReceiverAddress(e),o.setReceiverProfileName(void 0),o.setReceiverProfileImageUrl(void 0),o.setLoading(!1)}};P.styles=C,R([g()],P.prototype,"value",void 0),R([v()],P.prototype,"instructionHidden",void 0),R([v()],P.prototype,"pasting",void 0),P=R([m("w3m-input-address")],P);const N=e`
  :host {
    position: relative;
    display: inline-block;
  }

  input {
    background: transparent;
    width: 100%;
    height: auto;
    font-family: var(--wui-font-family);
    color: var(--wui-color-fg-100);

    font-feature-settings: 'case' on;
    font-size: 32px;
    font-weight: var(--wui-font-weight-light);
    caret-color: var(--wui-color-accent-100);
    line-height: 130%;
    letter-spacing: -1.28px;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }
`;var j=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let S=class extends t{constructor(){super(...arguments),this.inputElementRef=k(),this.disabled=!1,this.value="",this.placeholder="0"}render(){var e;return(null==(e=this.inputElementRef)?void 0:e.value)&&this.value&&(this.inputElementRef.value.value=this.value),s`<input
      ${b(this.inputElementRef)}
      type="text"
      inputmode="decimal"
      pattern="[0-9,.]*"
      placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      autofocus
      value=${this.value??""}
      @input=${this.dispatchInputChangeEvent.bind(this)}
    /> `}dispatchInputChangeEvent(e){var t,i;const n=e.data;if(n&&(null==(t=this.inputElementRef)?void 0:t.value))if(","===n){const e=this.inputElementRef.value.value.replace(",",".");this.inputElementRef.value.value=e,this.value=`${this.value}${e}`}else y.test(n)||(this.inputElementRef.value.value=this.value.replace(new RegExp(n.replace($,"\\$&"),"gu"),""));this.dispatchEvent(new CustomEvent("inputChange",{detail:null==(i=this.inputElementRef.value)?void 0:i.value,bubbles:!0,composed:!0}))}};S.styles=[a,l,N],j([g({type:Boolean})],S.prototype,"disabled",void 0),j([g({type:String})],S.prototype,"value",void 0),j([g({type:String})],S.prototype,"placeholder",void 0),S=j([m("wui-input-amount")],S);const E=e`
  :host {
    width: 100%;
    height: 100px;
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-002);
    background-color: var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
  }

  :host(:hover) {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  wui-input-amount {
    mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
  }

  .totalValue {
    width: 100%;
  }
`;var B=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let I=class extends t{render(){return s` <wui-flex
      flexDirection="column"
      gap="4xs"
      .padding=${["xl","s","l","l"]}
    >
      <wui-flex alignItems="center">
        <wui-input-amount
          @inputChange=${this.onInputChange.bind(this)}
          ?disabled=${!this.token&&!0}
          .value=${this.sendTokenAmount?String(this.sendTokenAmount):""}
        ></wui-input-amount>
        ${this.buttonTemplate()}
      </wui-flex>
      <wui-flex alignItems="center" justifyContent="space-between">
        ${this.sendValueTemplate()}
        <wui-flex alignItems="center" gap="4xs" justifyContent="flex-end">
          ${this.maxAmountTemplate()} ${this.actionTemplate()}
        </wui-flex>
      </wui-flex>
    </wui-flex>`}buttonTemplate(){return this.token?s`<wui-token-button
        text=${this.token.symbol}
        imageSrc=${this.token.iconUrl}
        @click=${this.handleSelectButtonClick.bind(this)}
      >
      </wui-token-button>`:s`<wui-button
      size="md"
      variant="accent"
      @click=${this.handleSelectButtonClick.bind(this)}
      >Select token</wui-button
    >`}handleSelectButtonClick(){c.push("WalletSendSelectToken")}sendValueTemplate(){if(this.token&&this.sendTokenAmount){const e=this.token.price*this.sendTokenAmount;return s`<wui-text class="totalValue" variant="small-400" color="fg-200"
        >${e?`$${u.formatNumberToLocalString(e,2)}`:"Incorrect value"}</wui-text
      >`}return null}maxAmountTemplate(){return this.token?this.sendTokenAmount&&this.sendTokenAmount>Number(this.token.quantity.numeric)?s` <wui-text variant="small-400" color="error-100">
          ${x.roundNumber(Number(this.token.quantity.numeric),6,5)}
        </wui-text>`:s` <wui-text variant="small-400" color="fg-200">
        ${x.roundNumber(Number(this.token.quantity.numeric),6,5)}
      </wui-text>`:null}actionTemplate(){return this.token?this.sendTokenAmount&&this.sendTokenAmount>Number(this.token.quantity.numeric)?s`<wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>`:s`<wui-link @click=${this.onMaxClick.bind(this)}>Max</wui-link>`:null}onInputChange(e){o.setTokenAmount(e.detail)}onMaxClick(){if(this.token){const e=u.bigNumber(this.token.quantity.numeric);o.setTokenAmount(Number(e.toFixed(20)))}}onBuyClick(){c.push("OnRampProviders")}};I.styles=E,B([g({type:Object})],I.prototype,"token",void 0),B([g({type:Number})],I.prototype,"sendTokenAmount",void 0),I=B([m("w3m-input-token")],I);const O=e`
  :host {
    display: block;
  }

  wui-flex {
    position: relative;
  }

  wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xs) !important;
    border: 5px solid var(--wui-color-bg-125);
    background: var(--wui-color-bg-175);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }

  wui-button {
    --local-border-radius: var(--wui-border-radius-xs) !important;
  }

  .inputContainer {
    height: fit-content;
  }
`;var z=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let D=class extends t{constructor(){super(),this.unsubscribe=[],this.token=o.state.token,this.sendTokenAmount=o.state.sendTokenAmount,this.receiverAddress=o.state.receiverAddress,this.receiverProfileName=o.state.receiverProfileName,this.loading=o.state.loading,this.message="Preview Send",this.token&&(this.fetchBalances(),this.fetchNetworkPrice()),this.unsubscribe.push(o.subscribe(e=>{this.token=e.token,this.sendTokenAmount=e.sendTokenAmount,this.receiverAddress=e.receiverAddress,this.receiverProfileName=e.receiverProfileName,this.loading=e.loading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return this.getMessage(),s` <wui-flex flexDirection="column" .padding=${["0","l","l","l"]}>
      <wui-flex class="inputContainer" gap="xs" flexDirection="column">
        <w3m-input-token
          .token=${this.token}
          .sendTokenAmount=${this.sendTokenAmount}
        ></w3m-input-token>
        <wui-icon-box
          size="inherit"
          backgroundColor="fg-300"
          iconSize="lg"
          iconColor="fg-250"
          background="opaque"
          icon="arrowBottom"
        ></wui-icon-box>
        <w3m-input-address
          .value=${this.receiverProfileName?this.receiverProfileName:this.receiverAddress}
        ></w3m-input-address>
      </wui-flex>
      <wui-flex .margin=${["l","0","0","0"]}>
        <wui-button
          @click=${this.onButtonClick.bind(this)}
          ?disabled=${!this.message.startsWith("Preview Send")}
          size="lg"
          variant="main"
          ?loading=${this.loading}
          fullWidth
        >
          ${this.message}
        </wui-button>
      </wui-flex>
    </wui-flex>`}async fetchBalances(){await o.fetchTokenBalance(),o.fetchNetworkBalance()}async fetchNetworkPrice(){await A.getNetworkTokenPrice()}onButtonClick(){c.push("WalletSendPreview")}getMessage(){var e;if(this.message="Preview Send",this.receiverAddress&&!i.isAddress(this.receiverAddress,n.state.activeChain)&&(this.message="Invalid Address"),this.receiverAddress||(this.message="Add Address"),this.sendTokenAmount&&this.token&&this.sendTokenAmount>Number(this.token.quantity.numeric)&&(this.message="Insufficient Funds"),this.sendTokenAmount||(this.message="Add Amount"),this.sendTokenAmount&&(null==(e=this.token)?void 0:e.price)){this.sendTokenAmount*this.token.price||(this.message="Incorrect Value")}this.token||(this.message="Select Token")}};D.styles=O,z([v()],D.prototype,"token",void 0),z([v()],D.prototype,"sendTokenAmount",void 0),z([v()],D.prototype,"receiverAddress",void 0),z([v()],D.prototype,"receiverProfileName",void 0),z([v()],D.prototype,"loading",void 0),z([v()],D.prototype,"message",void 0),D=z([m("w3m-wallet-send-view")],D);const U=e`
  .contentContainer {
    height: 440px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }

  wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }
`;var V=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let H=class extends t{constructor(){super(),this.unsubscribe=[],this.tokenBalances=o.state.tokenBalances,this.search="",this.onDebouncedSearch=i.debounce(e=>{this.search=e}),this.fetchBalancesAndNetworkPrice(),this.unsubscribe.push(o.subscribe(e=>{this.tokenBalances=e.tokenBalances}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return s`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}async fetchBalancesAndNetworkPrice(){var e;this.tokenBalances&&0!==(null==(e=this.tokenBalances)?void 0:e.length)||(await this.fetchBalances(),await this.fetchNetworkPrice())}async fetchBalances(){await o.fetchTokenBalance(),o.fetchNetworkBalance()}async fetchNetworkPrice(){await A.getNetworkTokenPrice()}templateSearchInput(){return s`
      <wui-flex gap="xs" padding="s">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){var e,t;return this.tokens=null==(e=this.tokenBalances)?void 0:e.filter(e=>{var t;return e.chainId===(null==(t=n.state.activeCaipNetwork)?void 0:t.caipNetworkId)}),this.search?this.filteredTokens=null==(t=this.tokenBalances)?void 0:t.filter(e=>e.name.toLowerCase().includes(this.search.toLowerCase())):this.filteredTokens=this.tokens,s`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","s","0","s"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["m","s","s","s"]}>
          <wui-text variant="paragraph-500" color="fg-200">Your tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="xs">
          ${this.filteredTokens&&this.filteredTokens.length>0?this.filteredTokens.map(e=>s`<wui-list-token
                    @click=${this.handleTokenClick.bind(this,e)}
                    ?clickable=${!0}
                    tokenName=${e.name}
                    tokenImageUrl=${e.iconUrl}
                    tokenAmount=${e.quantity.numeric}
                    tokenValue=${e.value}
                    tokenCurrency=${e.symbol}
                  ></wui-list-token>`):s`<wui-flex
                .padding=${["4xl","0","0","0"]}
                alignItems="center"
                flexDirection="column"
                gap="l"
              >
                <wui-icon-box
                  icon="coinPlaceholder"
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
                  <wui-text variant="paragraph-500" align="center" color="fg-100"
                    >No tokens found</wui-text
                  >
                  <wui-text variant="small-400" align="center" color="fg-200"
                    >Your tokens will appear here</wui-text
                  >
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){c.push("OnRampProviders")}onInputChange(e){this.onDebouncedSearch(e.detail)}handleTokenClick(e){o.setToken(e),o.setTokenAmount(void 0),c.goBack()}};H.styles=U,V([v()],H.prototype,"tokenBalances",void 0),V([v()],H.prototype,"tokens",void 0),V([v()],H.prototype,"filteredTokens",void 0),V([v()],H.prototype,"search",void 0),H=V([m("w3m-wallet-send-select-token-view")],H);const q=e`
  :host {
    display: flex;
    gap: var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    padding: var(--wui-spacing-2xs) var(--wui-spacing-xs) var(--wui-spacing-2xs)
      var(--wui-spacing-s);
    align-items: center;
  }

  wui-avatar,
  wui-icon,
  wui-image {
    width: 32px;
    height: 32px;
    border: 1px solid var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-002);
  }
`;var F=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let L=class extends t{constructor(){super(...arguments),this.text="",this.address="",this.isAddress=!1}render(){return s`<wui-text variant="large-500" color="fg-100">${this.text}</wui-text>
      ${this.imageTemplate()}`}imageTemplate(){return this.isAddress?s`<wui-avatar address=${this.address} .imageSrc=${this.imageSrc}></wui-avatar>`:this.imageSrc?s`<wui-image src=${this.imageSrc}></wui-image>`:s`<wui-icon size="inherit" color="fg-200" name="networkPlaceholder"></wui-icon>`}};L.styles=[a,l,q],F([g()],L.prototype,"text",void 0),F([g()],L.prototype,"address",void 0),F([g()],L.prototype,"imageSrc",void 0),F([g({type:Boolean})],L.prototype,"isAddress",void 0),L=F([m("wui-preview-item")],L);const M=e`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-s);
    padding: 17px 18px 17px var(--wui-spacing-m);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
  }

  wui-image {
    width: var(--wui-icon-size-lg);
    height: var(--wui-icon-size-lg);
    border-radius: var(--wui-border-radius-3xl);
  }

  wui-icon {
    width: var(--wui-icon-size-lg);
    height: var(--wui-icon-size-lg);
  }
`;var W=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let Y=class extends t{constructor(){super(...arguments),this.imageSrc=void 0,this.textTitle="",this.textValue=void 0}render(){return s`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="paragraph-500" color=${this.textValue?"fg-200":"fg-100"}>
          ${this.textTitle}
        </wui-text>
        ${this.templateContent()}
      </wui-flex>
    `}templateContent(){return this.imageSrc?s`<wui-image src=${this.imageSrc} alt=${this.textTitle}></wui-image>`:this.textValue?s` <wui-text variant="paragraph-400" color="fg-100"> ${this.textValue} </wui-text>`:s`<wui-icon size="inherit" color="fg-200" name="networkPlaceholder"></wui-icon>`}};Y.styles=[a,l,M],W([g()],Y.prototype,"imageSrc",void 0),W([g()],Y.prototype,"textTitle",void 0),W([g()],Y.prototype,"textValue",void 0),Y=W([m("wui-list-content")],Y);const _=e`
  :host {
    display: flex;
    width: auto;
    flex-direction: column;
    gap: var(--wui-border-radius-1xs);
    border-radius: var(--wui-border-radius-s);
    background: var(--wui-color-gray-glass-002);
    padding: var(--wui-spacing-s) var(--wui-spacing-1xs) var(--wui-spacing-1xs)
      var(--wui-spacing-1xs);
  }

  wui-text {
    padding: 0 var(--wui-spacing-1xs);
  }

  wui-flex {
    margin-top: var(--wui-spacing-1xs);
  }

  .network {
    cursor: pointer;
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
  }

  .network:focus-visible {
    border: 1px solid var(--wui-color-accent-100);
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  .network:hover {
    background-color: var(--wui-color-gray-glass-005);
  }

  .network:active {
    background-color: var(--wui-color-gray-glass-010);
  }
`;var G=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let K=class extends t{render(){return s` <wui-text variant="small-400" color="fg-200">Details</wui-text>
      <wui-flex flexDirection="column" gap="xxs">
        <wui-list-content
          textTitle="Address"
          textValue=${x.getTruncateString({string:this.receiverAddress??"",charsStart:4,charsEnd:4,truncate:"middle"})}
        >
        </wui-list-content>
        ${this.networkTemplate()}
      </wui-flex>`}networkTemplate(){var e;return(null==(e=this.caipNetwork)?void 0:e.name)?s` <wui-list-content
        @click=${()=>this.onNetworkClick(this.caipNetwork)}
        class="network"
        textTitle="Network"
        imageSrc=${T(d.getNetworkImage(this.caipNetwork))}
      ></wui-list-content>`:null}onNetworkClick(e){e&&c.push("Networks",{network:e})}};K.styles=_,G([g()],K.prototype,"receiverAddress",void 0),G([g({type:Object})],K.prototype,"caipNetwork",void 0),K=G([m("w3m-wallet-send-details")],K);const Q=e`
  wui-avatar,
  wui-image {
    display: ruby;
    width: 32px;
    height: 32px;
    border-radius: var(--wui-border-radius-3xl);
  }

  .sendButton {
    width: 70%;
    --local-width: 100% !important;
    --local-border-radius: var(--wui-border-radius-xs) !important;
  }

  .cancelButton {
    width: 30%;
    --local-width: 100% !important;
    --local-border-radius: var(--wui-border-radius-xs) !important;
  }
`;var J=function(e,t,i,n){var r,o=arguments.length,s=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,i,s):r(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s};let X=class extends t{constructor(){super(),this.unsubscribe=[],this.token=o.state.token,this.sendTokenAmount=o.state.sendTokenAmount,this.receiverAddress=o.state.receiverAddress,this.receiverProfileName=o.state.receiverProfileName,this.receiverProfileImageUrl=o.state.receiverProfileImageUrl,this.caipNetwork=n.state.activeCaipNetwork,this.loading=o.state.loading,this.unsubscribe.push(o.subscribe(e=>{this.token=e.token,this.sendTokenAmount=e.sendTokenAmount,this.receiverAddress=e.receiverAddress,this.receiverProfileName=e.receiverProfileName,this.receiverProfileImageUrl=e.receiverProfileImageUrl,this.loading=e.loading}),n.subscribeKey("activeCaipNetwork",e=>this.caipNetwork=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){var e,t;return s` <wui-flex flexDirection="column" .padding=${["0","l","l","l"]}>
      <wui-flex gap="xs" flexDirection="column" .padding=${["0","xs","0","xs"]}>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-flex flexDirection="column" gap="4xs">
            <wui-text variant="small-400" color="fg-150">Send</wui-text>
            ${this.sendValueTemplate()}
          </wui-flex>
          <wui-preview-item
            text="${this.sendTokenAmount?x.roundNumber(this.sendTokenAmount,6,5):"unknown"} ${null==(e=this.token)?void 0:e.symbol}"
            .imageSrc=${null==(t=this.token)?void 0:t.iconUrl}
          ></wui-preview-item>
        </wui-flex>
        <wui-flex>
          <wui-icon color="fg-200" size="md" name="arrowBottom"></wui-icon>
        </wui-flex>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="small-400" color="fg-150">To</wui-text>
          <wui-preview-item
            text="${this.receiverProfileName?x.getTruncateString({string:this.receiverProfileName,charsStart:20,charsEnd:0,truncate:"end"}):x.getTruncateString({string:this.receiverAddress?this.receiverAddress:"",charsStart:4,charsEnd:4,truncate:"middle"})}"
            address=${this.receiverAddress??""}
            .imageSrc=${this.receiverProfileImageUrl??void 0}
            .isAddress=${!0}
          ></wui-preview-item>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" .padding=${["xxl","0","0","0"]}>
        <w3m-wallet-send-details
          .caipNetwork=${this.caipNetwork}
          .receiverAddress=${this.receiverAddress}
        ></w3m-wallet-send-details>
        <wui-flex justifyContent="center" gap="xxs" .padding=${["s","0","0","0"]}>
          <wui-icon size="sm" color="fg-200" name="warningCircle"></wui-icon>
          <wui-text variant="small-400" color="fg-200">Review transaction carefully</wui-text>
        </wui-flex>
        <wui-flex justifyContent="center" gap="s" .padding=${["l","0","0","0"]}>
          <wui-button
            class="cancelButton"
            @click=${this.onCancelClick.bind(this)}
            size="lg"
            variant="neutral"
          >
            Cancel
          </wui-button>
          <wui-button
            class="sendButton"
            @click=${this.onSendClick.bind(this)}
            size="lg"
            variant="main"
            .loading=${this.loading}
          >
            Send
          </wui-button>
        </wui-flex>
      </wui-flex></wui-flex
    >`}sendValueTemplate(){if(this.token&&this.sendTokenAmount){const e=this.token.price*this.sendTokenAmount;return s`<wui-text variant="paragraph-400" color="fg-100"
        >$${e.toFixed(2)}</wui-text
      >`}return null}async onSendClick(){var e,t;if(this.sendTokenAmount&&this.receiverAddress)try{await o.sendToken(),h.showSuccess("Transaction started"),c.replace("Account")}catch(i){h.showError("Failed to send transaction. Please try again.");const r=i instanceof Error?i.message:"Unknown error";p.sendEvent({type:"track",event:"SEND_ERROR",properties:{message:r,isSmartAccount:w(n.state.activeChain)===f.ACCOUNT_TYPES.SMART_ACCOUNT,token:(null==(e=this.token)?void 0:e.symbol)||"",amount:this.sendTokenAmount,network:(null==(t=n.state.activeCaipNetwork)?void 0:t.caipNetworkId)||""}})}else h.showError("Please enter a valid amount and receiver address")}onCancelClick(){c.goBack()}};X.styles=Q,J([v()],X.prototype,"token",void 0),J([v()],X.prototype,"sendTokenAmount",void 0),J([v()],X.prototype,"receiverAddress",void 0),J([v()],X.prototype,"receiverProfileName",void 0),J([v()],X.prototype,"receiverProfileImageUrl",void 0),J([v()],X.prototype,"caipNetwork",void 0),J([v()],X.prototype,"loading",void 0),X=J([m("w3m-wallet-send-preview-view")],X);export{H as W3mSendSelectTokenView,X as W3mWalletSendPreviewView,D as W3mWalletSendView};
