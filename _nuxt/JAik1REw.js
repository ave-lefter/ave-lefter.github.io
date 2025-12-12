import{b3 as e,b4 as t,b5 as i,b7 as r,b8 as o,bn as s,bj as a,bd as n,dP as c,dQ as l,bh as d,bi as u,bc as p,bl as w}from"./DvO0AinD.js";import{n as m,r as h}from"./B_ot7u58.js";import{o as f}from"./4RH0AGma.js";import{c as g,U as b}from"./Bo-PKsy5.js";import"./BJJ0JJad.js";import"./1TgTHKeV.js";import"./BRI2zjzy.js";import"./7KCP2O4P.js";import"./DS_txzci.js";import"./DceVWoup.js";const v=e`
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
`;var k=function(e,t,i,r){var o,s=arguments.length,a=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let x=class extends r{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return o`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){const e=this.networkImages.slice(0,5);return o` <wui-flex class="networks">
      ${null==e?void 0:e.map(e=>o` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};x.styles=[t,i,v],k([m({type:Array})],x.prototype,"networkImages",void 0),k([m()],x.prototype,"text",void 0),x=k([g("wui-compatible-network")],x);const y=e`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var N=function(e,t,i,r){var o,s=arguments.length,a=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let C=class extends r{constructor(){super(),this.unsubscribe=[],this.address=s.state.address,this.profileName=s.state.profileName,this.network=a.state.activeCaipNetwork,this.unsubscribe.push(s.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName):n.showError("Account not found")}),a.subscribeKey("activeCaipNetwork",e=>{(null==e?void 0:e.id)&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");const e=c.getNetworkImage(this.network);return o` <wui-flex
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
    </wui-flex>`}networkTemplate(){var e;const t=a.getAllRequestedCaipNetworks(),i=a.checkIfSmartAccountEnabled(),r=a.state.activeCaipNetwork,s=t.filter(e=>(null==e?void 0:e.chainNamespace)===(null==r?void 0:r.chainNamespace));if(d(null==r?void 0:r.chainNamespace)===u.ACCOUNT_TYPES.SMART_ACCOUNT&&i)return r?o`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[c.getNetworkImage(r)??""]}
      ></wui-compatible-network>`:null;const n=(null==(e=null==s?void 0:s.filter(e=>{var t;return null==(t=null==e?void 0:e.assets)?void 0:t.imageId}))?void 0:e.slice(0,5)).map(c.getNetworkImage).filter(Boolean);return o`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${n}
    ></wui-compatible-network>`}onReceiveClick(){p.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(w.copyToClopboard(this.address),n.showSuccess("Address copied"))}catch{n.showError("Failed to copy")}}};C.styles=y,N([h()],C.prototype,"address",void 0),N([h()],C.prototype,"profileName",void 0),N([h()],C.prototype,"network",void 0),C=N([g("w3m-wallet-receive-view")],C);export{C as W3mWalletReceiveView};
