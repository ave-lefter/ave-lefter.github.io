import{a_ as e,a$ as t,b0 as r,b2 as i,b3 as s,bi as o,be as a,b8 as c,dP as n,dQ as l,bc as d,bd as p,b7 as u,bg as w}from"#entry";import{n as m,r as h}from"./BmyCbnts.js";import{o as f}from"./DJ4s7H4Z.js";import{c as g,U as b}from"./DExhYf3k.js";import"./keTeMZ-U.js";import"./BbkVj9z_.js";import"./CVhMdH8L.js";import"./DvnjDLz5.js";import"./CqsZNpmy.js";import"./CZyDi-Gs.js";const k=e`
  button {
    display: flex;
    gap: var(--wui-spacing-xl);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-m) var(--wui-spacing-s);
  }

  wui-text {
    width: 100%;
  }

  wui-flex {
    width: auto;
  }

  .network-icon {
    width: var(--wui-spacing-2l);
    height: var(--wui-spacing-2l);
    border-radius: calc(var(--wui-spacing-2l) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`;var v=function(e,t,r,i){var s,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(a=(o<3?s(a):o>3?s(t,r,a):s(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let x=class extends i{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return s`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){const e=this.networkImages.slice(0,5);return s` <wui-flex class="networks">
      ${e?.map(e=>s` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};x.styles=[t,r,k],v([m({type:Array})],x.prototype,"networkImages",void 0),v([m()],x.prototype,"text",void 0),x=v([g("wui-compatible-network")],x);const y=e`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var N=function(e,t,r,i){var s,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(a=(o<3?s(a):o>3?s(t,r,a):s(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let C=class extends i{constructor(){super(),this.unsubscribe=[],this.address=o.state.address,this.profileName=o.state.profileName,this.network=a.state.activeCaipNetwork,this.unsubscribe.push(o.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName):c.showError("Account not found")}),a.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");const e=n.getNetworkImage(this.network);return s` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${b.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["l","0","0","0"]}
        alignItems="center"
        gap="s"
      >
        <wui-qr-code
          size=${232}
          theme=${l.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${f(l.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){const e=a.getAllRequestedCaipNetworks(),t=a.checkIfSmartAccountEnabled(),r=a.state.activeCaipNetwork,i=e.filter(e=>e?.chainNamespace===r?.chainNamespace);if(d(r?.chainNamespace)===p.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return r?s`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[n.getNetworkImage(r)??""]}
      ></wui-compatible-network>`:null;const o=i?.filter(e=>e?.assets?.imageId)?.slice(0,5),c=o.map(n.getNetworkImage).filter(Boolean);return s`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${c}
    ></wui-compatible-network>`}onReceiveClick(){u.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(w.copyToClopboard(this.address),c.showSuccess("Address copied"))}catch{c.showError("Failed to copy")}}};C.styles=y,N([h()],C.prototype,"address",void 0),N([h()],C.prototype,"profileName",void 0),N([h()],C.prototype,"network",void 0),C=N([g("w3m-wallet-receive-view")],C);export{C as W3mWalletReceiveView};
