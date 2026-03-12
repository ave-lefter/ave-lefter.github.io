import{bu as e,bv as t,aW as i,bq as o}from"./D6y-ViDA.js";import{n,r}from"./8ReBD8jy.js";import{c as a,A as s,O as l,d as c,e as d,a as p,E as h,R as u,f as w,h as g,i as m,j as b,H as f,C as y,r as v,k as x,T as $,l as k,M as C,m as R,n as E,o as S,p as T,q as O,s as j,W as P}from"./C9CSYTGc.js";import{c as I,U as W,n as L}from"./B5ucxrsR.js";import{o as z}from"./C1IbZtR7.js";import{Q as _}from"./B-_eTJus.js";import{e as A,n as D}from"./CYWoCrGr.js";import"./CevG08QP.js";var B=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let N=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=a.state.connectors,this.count=s.state.count,this.filteredCount=s.state.filteredWallets.length,this.isFetchingRecommendedWallets=s.state.isFetchingRecommendedWallets,this.unsubscribe.push(a.subscribeKey("connectors",e=>this.connectors=e),s.subscribeKey("count",e=>this.count=e),s.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),s.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.connectors.find(e=>"walletConnect"===e.id),{allWallets:i}=l.state;if(!e||"HIDE"===i)return null;if("ONLY_MOBILE"===i&&!c.isMobile())return null;const o=s.state.featured.length,n=this.count+o,r=n<10?n:10*Math.floor(n/10),a=this.filteredCount>0?this.filteredCount:r;let h=`${a}`;this.filteredCount>0?h=`${this.filteredCount}`:a<n&&(h=`${a}+`);const u=d.hasAnyConnection(p.CONNECTOR_ID.WALLET_CONNECT);return t`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${h}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${z(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${u}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){h.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),u.push("AllWallets",{redirectView:u.state.data?.redirectView})}};B([n()],N.prototype,"tabIdx",void 0),B([r()],N.prototype,"connectors",void 0),B([r()],N.prototype,"count",void 0),B([r()],N.prototype,"filteredCount",void 0),B([r()],N.prototype,"isFetchingRecommendedWallets",void 0),N=B([I("w3m-all-wallets-widget")],N);const q=w`
  :host {
    margin-top: ${({spacing:e})=>e[1]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1)
      ${({spacing:e})=>e[2]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`;var U=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let F=class extends e{constructor(){super(),this.unsubscribe=[],this.explorerWallets=s.state.explorerWallets,this.connections=d.state.connections,this.connectorImages=g.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(d.subscribeKey("connections",e=>this.connections=e),g.subscribeKey("connectorImages",e=>this.connectorImages=e),s.subscribeKey("explorerFilteredWallets",e=>{this.explorerWallets=e?.length?e:s.state.explorerWallets}),s.subscribeKey("explorerWallets",e=>{this.explorerWallets?.length||(this.explorerWallets=e)})),c.isTelegram()&&c.isIos()&&(this.loadingTelegram=!d.state.wcUri,this.unsubscribe.push(d.subscribeKey("wcUri",e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return t`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){return m.connectorList().map((e,t)=>"connector"===e.kind?this.renderConnector(e,t):this.renderWallet(e,t))}getConnectorNamespaces(e){return"walletConnect"===e.subtype?[]:"multiChain"===e.subtype?e.connector.connectors?.map(e=>e.chain)||[]:[e.connector.chain]}renderConnector(e,i){const o=e.connector,n=b.getConnectorImage(o)||this.connectorImages[o?.imageId??""],r=(this.connections.get(o.chain)??[]).some(e=>f.isLowerCaseMatch(e.connectorId,o.id));let a,s;"walletConnect"===e.subtype?(a="qr code",s="accent"):"injected"===e.subtype||"announced"===e.subtype?(a=r?"connected":"installed",s=r?"info":"success"):(a=void 0,s=void 0);const l=d.hasAnyConnection(p.CONNECTOR_ID.WALLET_CONNECT),c=("walletConnect"===e.subtype||"external"===e.subtype)&&l;return t`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${z(n)}
        .installed=${!0}
        name=${o.name??"Unknown"}
        .tagVariant=${s}
        tagLabel=${z(a)}
        data-testid=${`wallet-selector-${o.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${z(this.tabIdx)}
        ?disabled=${c}
        rdnsId=${z(o.explorerWallet?.rdns||void 0)}
        walletRank=${z(o.explorerWallet?.order)}
        .namespaces=${this.getConnectorNamespaces(e)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){const t=u.state.data?.redirectView;return"walletConnect"===e.subtype?(a.setActiveConnector(e.connector),void(c.isMobile()?u.push("AllWallets"):u.push("ConnectingWalletConnect",{redirectView:t}))):"multiChain"===e.subtype?(a.setActiveConnector(e.connector),void u.push("ConnectingMultiChain",{redirectView:t})):"injected"===e.subtype?(a.setActiveConnector(e.connector),void u.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet})):"announced"===e.subtype?"walletConnect"===e.connector.id?void(c.isMobile()?u.push("AllWallets"):u.push("ConnectingWalletConnect",{redirectView:t})):void u.push("ConnectingExternal",{connector:e.connector,redirectView:t,wallet:e.connector.explorerWallet}):void u.push("ConnectingExternal",{connector:e.connector,redirectView:t})}renderWallet(e,i){const o=e.wallet,n=b.getWalletImage(o),r=d.hasAnyConnection(p.CONNECTOR_ID.WALLET_CONNECT),a=this.loadingTelegram,s="recent"===e.subtype?"recent":void 0,l="recent"===e.subtype?"info":void 0;return t`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${z(n)}
        name=${o.name??"Unknown"}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${o.id}`}
        tabIdx=${z(this.tabIdx)}
        ?loading=${a}
        ?disabled=${r}
        rdnsId=${z(o.rdns||void 0)}
        walletRank=${z(o.order)}
        tagLabel=${z(s)}
        .tagVariant=${l}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){const t=u.state.data?.redirectView,i=y.state.activeChain;if("featured"===e.subtype)return void a.selectWalletConnector(e.wallet);if("recent"===e.subtype){if(this.loadingTelegram)return;return void a.selectWalletConnector(e.wallet)}if("custom"===e.subtype){if(this.loadingTelegram)return;return void u.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t})}if(this.loadingTelegram)return;const o=i?a.getConnector({id:e.wallet.id,namespace:i}):void 0;o?u.push("ConnectingExternal",{connector:o,redirectView:t}):u.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:t})}};F.styles=q,U([n({type:Number})],F.prototype,"tabIdx",void 0),U([r()],F.prototype,"explorerWallets",void 0),U([r()],F.prototype,"connections",void 0),U([r()],F.prototype,"connectorImages",void 0),U([r()],F.prototype,"loadingTelegram",void 0),F=U([I("w3m-connector-list")],F);const V=w`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:e})=>e.theme.textPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:e})=>e.theme.textPrimary};
    }
  }
`;var M=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const K={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},H={lg:"md",md:"sm",sm:"sm"};let Q=class extends e{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return t`
      <button data-active=${this.active}>
        ${this.icon?t`<wui-icon size=${H[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${K[this.size]}> ${this.label} </wui-text>
      </button>
    `}};Q.styles=[v,x,V],M([n()],Q.prototype,"icon",void 0),M([n()],Q.prototype,"size",void 0),M([n()],Q.prototype,"label",void 0),M([n({type:Boolean})],Q.prototype,"active",void 0),Q=M([I("wui-tab-item")],Q);const G=w`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var X=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Y=class extends e{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,i)=>{const o=i===this.activeTab;return t`
        <wui-tab-item
          @click=${()=>this.onTabClick(i)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${o}
          data-active=${o}
          data-testid="tab-${e.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};Y.styles=[v,x,G],X([n({type:Array})],Y.prototype,"tabs",void 0),X([n()],Y.prototype,"onTabChange",void 0),X([n()],Y.prototype,"size",void 0),X([r()],Y.prototype,"activeTab",void 0),Y=X([I("wui-tabs")],Y);var J=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Z=class extends e{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.generateTabs();return t`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){const e=this.platforms.map(e=>"browser"===e?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===e?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===e?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===e?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===e?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=e.map(({platform:e})=>e),e}onTabChange(e){const t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};J([n({type:Array})],Z.prototype,"platforms",void 0),J([n()],Z.prototype,"onSelectPlatfrom",void 0),Z=J([I("w3m-connecting-header")],Z);const ee=w`
  :host {
    display: block;
    width: 100px;
    height: 100px;
  }

  svg {
    width: 100px;
    height: 100px;
  }

  rect {
    fill: none;
    stroke: ${e=>e.colors.accent100};
    stroke-width: 3px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var te=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ie=class extends e{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const e=this.radius>50?50:this.radius,i=36-e;return t`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${116+i} ${245+i}"
          stroke-dashoffset=${360+1.75*i}
        />
      </svg>
    `}};ie.styles=[v,ee],te([n({type:Number})],ie.prototype,"radius",void 0),ie=te([I("wui-loading-thumbnail")],ie);const oe=w`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding-left: ${({spacing:e})=>e[3]};
    padding-right: ${({spacing:e})=>e[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[6]};
  }

  wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var ne=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let re=class extends e{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return t`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};re.styles=[v,x,oe],ne([n({type:Boolean})],re.prototype,"disabled",void 0),ne([n()],re.prototype,"label",void 0),ne([n()],re.prototype,"buttonLabel",void 0),re=ne([I("wui-cta-button")],re);const ae=w`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e[5]} ${({spacing:e})=>e[5]};
  }
`;var se=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let le=class extends e{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:e,app_store:i,play_store:o,chrome_store:n,homepage:r}=this.wallet,a=c.isMobile(),s=c.isIos(),l=c.isAndroid(),d=[i,o,r,n].filter(Boolean).length>1,p=W.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return d&&!a?t`
        <wui-cta-button
          label=${`Don't have ${p}?`}
          buttonLabel="Get"
          @click=${()=>u.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!d&&r?t`
        <wui-cta-button
          label=${`Don't have ${p}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:i&&s?t`
        <wui-cta-button
          label=${`Don't have ${p}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:o&&l?t`
        <wui-cta-button
          label=${`Don't have ${p}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&c.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&c.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&c.openHref(this.wallet.homepage,"_blank")}};le.styles=[ae],se([n({type:Object})],le.prototype,"wallet",void 0),le=se([I("w3m-mobile-download-links")],le);const ce=w`
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

  wui-wallet-image {
    width: 56px;
    height: 56px;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e[1]} * -1);
    bottom: calc(${({spacing:e})=>e[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:e})=>e.lg};
    transition-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`;var de=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class pe extends e{constructor(){super(),this.wallet=u.state.data?.wallet,this.connector=u.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=b.getConnectorImage(this.connector)??b.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=d.state.wcUri,this.error=d.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(d.subscribeKey("wcUri",e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),d.subscribeKey("wcError",e=>this.error=e)),(c.isTelegram()||c.isSafari())&&c.isIos()&&d.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),d.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();const e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let i="";return this.label?i=this.label:(i=`Continue in ${this.name}`,this.error&&(i="Connection declined")),t`
      <wui-flex
        data-error=${z(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${z(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","0","0"]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?"error":"primary"}>
            ${i}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?t`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?t`
              <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;const e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){d.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){const e=$.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return t`<wui-loading-thumbnail radius=${9*i}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(c.copyToClopboard(this.uri),k.showSuccess("Link copied"))}catch{k.showError("Failed to copy")}}}pe.styles=ce,de([r()],pe.prototype,"isRetrying",void 0),de([r()],pe.prototype,"uri",void 0),de([r()],pe.prototype,"error",void 0),de([r()],pe.prototype,"ready",void 0),de([r()],pe.prototype,"showRetry",void 0),de([r()],pe.prototype,"label",void 0),de([r()],pe.prototype,"secondaryBtnLabel",void 0),de([r()],pe.prototype,"secondaryLabel",void 0),de([r()],pe.prototype,"isLoading",void 0),de([n({type:Boolean})],pe.prototype,"isMobile",void 0),de([n()],pe.prototype,"onRetry",void 0);let he=class extends pe{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),h.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:u.state.view}})}async onConnectProxy(){try{this.error=!1;const{connectors:e}=a.state,t=e.find(e=>"ANNOUNCED"===e.type&&e.info?.rdns===this.wallet?.rdns||"INJECTED"===e.type||e.name===this.wallet?.name);if(!t)throw new Error("w3m-connecting-wc-browser: No connector found");await d.connectExternal(t,t.chain),C.close()}catch(e){e instanceof R&&e.originalName===E.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?h.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):h.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};he=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-connecting-wc-browser")],he);let ue=class extends pe{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),h.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:u.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;const{desktop_link:e,name:t}=this.wallet,{redirect:i,href:o}=c.formatNativeUrl(e,this.uri);d.setWcLinking({name:t,href:o}),d.setRecentWallet(this.wallet),c.openHref(i,"_blank")}catch{this.error=!0}}};ue=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-connecting-wc-desktop")],ue);var we=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ge=class extends pe{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=l.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{S.onConnectMobile(this.wallet)},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=T.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(d.subscribeKey("wcUri",()=>{this.onHandleURI()})),h.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:u.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){d.setWcError(!1),this.onConnect?.()}};we([r()],ge.prototype,"redirectDeeplink",void 0),we([r()],ge.prototype,"redirectUniversalLink",void 0),we([r()],ge.prototype,"target",void 0),we([r()],ge.prototype,"preferUniversalLinks",void 0),we([r()],ge.prototype,"isLoading",void 0),ge=we([I("w3m-connecting-wc-mobile")],ge);function me(e,t,i){if(e===t)return!1;return(e-t<0?t-e:e-t)<=i+.1}const be={generate({uri:e,size:t,logoSize:o,padding:n=8,dotColor:r="var(--apkt-colors-black)"}){const a=10,s=[],l=function(e,t){const i=Array.prototype.slice.call(_.create(e,{errorCorrectionLevel:t}).modules.data,0),o=Math.sqrt(i.length);return i.reduce((e,t,i)=>(i%o===0?e.push([t]):e[e.length-1].push(t))&&e,[])}(e,"Q"),c=(t-2*n)/l.length,d=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];d.forEach(({x:e,y:t})=>{const o=(l.length-7)*c*e+n,p=(l.length-7)*c*t+n,h=.45;for(let n=0;n<d.length;n+=1){const e=c*(7-2*n);s.push(i`
            <rect
              fill=${2===n?"var(--apkt-colors-black)":"var(--apkt-colors-white)"}
              width=${0===n?e-a:e}
              rx= ${0===n?(e-a)*h:e*h}
              ry= ${0===n?(e-a)*h:e*h}
              stroke=${r}
              stroke-width=${0===n?a:0}
              height=${0===n?e-a:e}
              x= ${0===n?p+c*n+5:p+c*n}
              y= ${0===n?o+c*n+5:o+c*n}
            />
          `)}});const p=Math.floor((o+25)/c),h=l.length/2-p/2,u=l.length/2+p/2-1,w=[];l.forEach((e,t)=>{e.forEach((e,i)=>{if(l[t][i]&&!(t<7&&i<7||t>l.length-8&&i<7||t<7&&i>l.length-8||t>h&&t<u&&i>h&&i<u)){const e=t*c+c/2+n,o=i*c+c/2+n;w.push([e,o])}})});const g={};return w.forEach(([e,t])=>{g[e]?g[e]?.push(t):g[e]=[t]}),Object.entries(g).map(([e,t])=>{const i=t.filter(e=>t.every(t=>!me(e,t,c)));return[Number(e),i]}).forEach(([e,t])=>{t.forEach(t=>{s.push(i`<circle cx=${e} cy=${t} fill=${r} r=${c/2.5} />`)})}),Object.entries(g).filter(([e,t])=>t.length>1).map(([e,t])=>{const i=t.filter(e=>t.some(t=>me(e,t,c)));return[Number(e),i]}).map(([e,t])=>{t.sort((e,t)=>e<t?-1:1);const i=[];for(const o of t){const e=i.find(e=>e.some(e=>me(o,e,c)));e?e.push(o):i.push([o])}return[e,i.map(e=>[e[0],e[e.length-1]])]}).forEach(([e,t])=>{t.forEach(([t,o])=>{s.push(i`
              <line
                x1=${e}
                x2=${e}
                y1=${t}
                y2=${o}
                stroke=${r}
                stroke-width=${c/1.25}
                stroke-linecap="round"
              />
            `)})}),s}},fe=w`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    background-color: ${({colors:e})=>e.white};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  :host {
    border-radius: ${({borderRadius:e})=>e[4]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    box-shadow: inset 0 0 0 4px ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[6]};
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: #3396ff !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }

  wui-icon > svg {
    width: inherit;
    height: inherit;
  }
`;var ye=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ve=class extends e{constructor(){super(...arguments),this.uri="",this.size=500,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),t`<wui-flex
      alignItems="center"
      justifyContent="center"
      class="wui-qr-code"
      direction="column"
      gap="4"
      width="100%"
      style="height: 100%"
    >
      ${this.templateVisual()} ${this.templateSvg()}
    </wui-flex>`}templateSvg(){return i`
      <svg viewBox="0 0 ${this.size} ${this.size}" width="100%" height="100%">
        ${be.generate({uri:this.uri,size:this.size,logoSize:this.arenaClear?0:this.size/4})}
      </svg>
    `}templateVisual(){return this.imageSrc?t`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?t`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:t`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};ve.styles=[v,fe],ye([n()],ve.prototype,"uri",void 0),ye([n({type:Number})],ve.prototype,"size",void 0),ye([n()],ve.prototype,"theme",void 0),ye([n()],ve.prototype,"imageSrc",void 0),ye([n()],ve.prototype,"alt",void 0),ye([n({type:Boolean})],ve.prototype,"arenaClear",void 0),ye([n({type:Boolean})],ve.prototype,"farcaster",void 0),ve=ye([I("wui-qr-code")],ve);const xe=w`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var $e=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ke=class extends pe{constructor(){super(),this.basic=!1}firstUpdated(){this.basic||h.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:u.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(e=>e())}render(){return this.onRenderProxy(),t`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","5","5","5"]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const e=this.wallet?this.wallet.name:void 0;d.setWcLinking(void 0),d.setRecentWallet(this.wallet);const i=$.state.themeVariables["--apkt-qr-color"]??$.state.themeVariables["--w3m-qr-color"];return t` <wui-qr-code
      theme=${$.state.themeMode}
      uri=${this.uri}
      imageSrc=${z(b.getWalletImage(this.wallet))}
      color=${z(i)}
      alt=${z(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){const e=!this.uri||!this.ready;return t`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};ke.styles=xe,$e([n({type:Boolean})],ke.prototype,"basic",void 0),ke=$e([I("w3m-connecting-wc-qrcode")],ke);let Ce=class extends e{constructor(){if(super(),this.wallet=u.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");h.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:u.state.view}})}render(){return t`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${z(b.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};Ce=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-connecting-wc-unsupported")],Ce);var Re=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ee=class extends pe{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=T.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(d.subscribeKey("wcUri",()=>{this.updateLoadingState()})),h.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:u.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;const{webapp_link:e,name:t}=this.wallet,{redirect:i,href:o}=c.formatUniversalUrl(e,this.uri);d.setWcLinking({name:t,href:o}),d.setRecentWallet(this.wallet),c.openHref(i,"_blank")}catch{this.error=!0}}};Re([r()],Ee.prototype,"isLoading",void 0),Ee=Re([I("w3m-connecting-wc-web")],Ee);const Se=w`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var Te=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Oe=class extends e{constructor(){super(),this.wallet=u.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=Boolean(l.state.siwx),this.remoteFeatures=l.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(l.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),t`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding&&this.displayBranding?t`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(e=!1){if("browser"!==this.platform&&(!l.state.manualWCControl||e))try{const{wcPairingExpiry:t,status:i}=d.state,{redirectView:o}=u.state.data??{};if(e||l.state.enableEmbedded||c.isPairingExpired(t)||"connecting"===i){const e=d.getConnections(y.state.activeChain),t=this.remoteFeatures?.multiWallet,i=e.length>0;await d.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(i&&t?(u.replace("ProfileWallets"),k.showSuccess("New Wallet Added")):o?u.replace(o):C.close())}}catch(t){if(t instanceof Error&&t.message.includes("An error occurred when attempting to switch chain")&&!l.state.enableNetworkSwitch&&y.state.activeChain)return y.setActiveCaipNetwork(O.getUnsupportedNetwork(`${y.state.activeChain}:${y.state.activeCaipNetwork?.id}`)),void y.showUnsupportedChainUI();t instanceof R&&t.originalName===E.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?h.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:t.message}}):h.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),d.setWcError(!0),k.showError(t.message??"Connection error"),d.resetWcConnection(),u.goBack()}}determinePlatforms(){if(!this.wallet)return this.platforms.push("qrcode"),void(this.platform="qrcode");if(this.platform)return;const{mobile_link:e,desktop_link:t,webapp_link:i,injected:o,rdns:n}=this.wallet,r=o?.map(({injected_id:e})=>e).filter(Boolean),a=[...n?[n]:r??[]],s=!l.state.isUniversalProvider&&a.length,p=e,h=i,u=d.checkInstalled(a),w=s&&u,g=t&&!c.isMobile();w&&!y.state.noAdapters&&this.platforms.push("browser"),p&&this.platforms.push(c.isMobile()?"mobile":"qrcode"),h&&this.platforms.push("web"),g&&this.platforms.push("desktop"),w||!s||y.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return t`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return t`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return t`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return t`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return t`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return t`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?t`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){const t=this.shadowRoot?.querySelector("div");t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};Oe.styles=Se,Te([r()],Oe.prototype,"platform",void 0),Te([r()],Oe.prototype,"platforms",void 0),Te([r()],Oe.prototype,"isSiwxEnabled",void 0),Te([r()],Oe.prototype,"remoteFeatures",void 0),Te([n({type:Boolean})],Oe.prototype,"displayBranding",void 0),Te([n({type:Boolean})],Oe.prototype,"basic",void 0),Oe=Te([I("w3m-connecting-wc-view")],Oe);var je=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Pe=class extends e{constructor(){super(),this.unsubscribe=[],this.isMobile=c.isMobile(),this.remoteFeatures=l.state.remoteFeatures,this.unsubscribe.push(l.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){const{featured:e,recommended:i}=s.state,{customWallets:o}=l.state,n=j.getRecentWallets(),r=e.length||i.length||o?.length||n.length;return t`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${r?t`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return t`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?t` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};je([r()],Pe.prototype,"isMobile",void 0),je([r()],Pe.prototype,"remoteFeatures",void 0),Pe=je([I("w3m-connecting-wc-basic-view")],Pe);const Ie=w`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
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
    background-color: ${({colors:e})=>e.neutrals300};
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:e})=>e.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    background-color: ${({tokens:e})=>e.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:e})=>e.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:e})=>e.theme.textTertiary};
  }
`;var We=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Le=class extends e{constructor(){super(...arguments),this.inputElementRef=A(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return t`
      <label data-size=${this.size}>
        <input
          ${D(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};Le.styles=[v,x,Ie],We([n({type:Boolean})],Le.prototype,"checked",void 0),We([n({type:Boolean})],Le.prototype,"disabled",void 0),We([n()],Le.prototype,"size",void 0),Le=We([I("wui-toggle")],Le);const ze=w`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var _e=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ae=class extends e{constructor(){super(...arguments),this.checked=!1}render(){return t`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};Ae.styles=[v,x,ze],_e([n({type:Boolean})],Ae.prototype,"checked",void 0),Ae=_e([I("wui-certified-switch")],Ae);const De=w`
  :host {
    position: relative;
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    gap: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  .wui-input-text-container {
    position: relative;
    display: flex;
  }

  input {
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    color: inherit;
    background: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[3]} ${({spacing:e})=>e[10]};
    font-size: ${({textSize:e})=>e.large};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    font-weight: ${({fontWeight:e})=>e.regular};
    font-family: ${({fontFamily:e})=>e.regular};
  }

  input[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[4]} ${({spacing:e})=>e[10]};
  }

  @media (hover: hover) and (pointer: fine) {
    input:hover:enabled {
      border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    }
  }

  input:disabled {
    cursor: unset;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  input::placeholder {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  input:focus:enabled {
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  div.wui-input-text-container:has(input:disabled) {
    opacity: 0.5;
  }

  wui-icon.wui-input-text-left-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    left: ${({spacing:e})=>e[4]};
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button.wui-input-text-submit-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: ${({borderRadius:e})=>e[2]};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button.wui-input-text-submit-button:disabled {
    opacity: 1;
  }

  button.wui-input-text-submit-button.loading wui-icon {
    animation: spin 1s linear infinite;
  }

  button.wui-input-text-submit-button:hover {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  input:has(+ .wui-input-text-submit-button) {
    padding-right: ${({spacing:e})=>e[12]};
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  /* -- Keyframes --------------------------------------------------- */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;var Be=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ne=class extends e{constructor(){super(...arguments),this.inputElementRef=A(),this.disabled=!1,this.loading=!1,this.placeholder="",this.type="text",this.value="",this.size="md"}render(){return t` <div class="wui-input-text-container">
        ${this.templateLeftIcon()}
        <input
          data-size=${this.size}
          ${D(this.inputElementRef)}
          data-testid="wui-input-text"
          type=${this.type}
          enterkeyhint=${z(this.enterKeyHint)}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this.dispatchInputChangeEvent.bind(this)}
          @keydown=${this.onKeyDown}
          .value=${this.value||""}
        />
        ${this.templateSubmitButton()}
        <slot class="wui-input-text-slot"></slot>
      </div>
      ${this.templateError()} ${this.templateWarning()}`}templateLeftIcon(){return this.icon?t`<wui-icon
        class="wui-input-text-left-icon"
        size="md"
        data-size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}templateSubmitButton(){return this.onSubmit?t`<button
        class="wui-input-text-submit-button ${this.loading?"loading":""}"
        @click=${this.onSubmit?.bind(this)}
        ?disabled=${this.disabled||this.loading}
      >
        ${this.loading?t`<wui-icon name="spinner" size="md"></wui-icon>`:t`<wui-icon name="chevronRight" size="md"></wui-icon>`}
      </button>`:null}templateError(){return this.errorText?t`<wui-text variant="sm-regular" color="error">${this.errorText}</wui-text>`:null}templateWarning(){return this.warningText?t`<wui-text variant="sm-regular" color="warning">${this.warningText}</wui-text>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};Ne.styles=[v,x,De],Be([n()],Ne.prototype,"icon",void 0),Be([n({type:Boolean})],Ne.prototype,"disabled",void 0),Be([n({type:Boolean})],Ne.prototype,"loading",void 0),Be([n()],Ne.prototype,"placeholder",void 0),Be([n()],Ne.prototype,"type",void 0),Be([n()],Ne.prototype,"value",void 0),Be([n()],Ne.prototype,"errorText",void 0),Be([n()],Ne.prototype,"warningText",void 0),Be([n()],Ne.prototype,"onSubmit",void 0),Be([n()],Ne.prototype,"size",void 0),Be([n({attribute:!1})],Ne.prototype,"onKeyDown",void 0),Ne=Be([I("wui-input-text")],Ne);const qe=w`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:e})=>e[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }
`;var Ue=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Fe=class extends e{constructor(){super(...arguments),this.inputComponentRef=A(),this.inputValue=""}render(){return t`
      <wui-input-text
        ${D(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?t`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(e){this.inputValue=e.detail||""}clearValue(){const e=this.inputComponentRef.value,t=e?.inputElementRef.value;t&&(t.value="",this.inputValue="",t.focus(),t.dispatchEvent(new Event("input")))}};Fe.styles=[v,qe],Ue([n()],Fe.prototype,"inputValue",void 0),Fe=Ue([I("wui-search-bar")],Fe);const Ve=w`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:e})=>e.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var Me=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ke=class extends e{constructor(){super(...arguments),this.type="wallet"}render(){return t`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?t` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${L}`:t`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};Ke.styles=[v,x,Ve],Me([n()],Ke.prototype,"type",void 0),Ke=Me([I("wui-card-select-loader")],Ke);const He=o`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var Qe=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ge=class extends e{render(){return this.style.cssText=`\n      grid-template-rows: ${this.gridTemplateRows};\n      grid-template-columns: ${this.gridTemplateColumns};\n      justify-items: ${this.justifyItems};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      align-content: ${this.alignContent};\n      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};\n      padding-top: ${this.padding&&W.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&W.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&W.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&W.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&W.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&W.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&W.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&W.getSpacingStyles(this.margin,3)};\n    `,t`<slot></slot>`}};Ge.styles=[v,He],Qe([n()],Ge.prototype,"gridTemplateRows",void 0),Qe([n()],Ge.prototype,"gridTemplateColumns",void 0),Qe([n()],Ge.prototype,"justifyItems",void 0),Qe([n()],Ge.prototype,"alignItems",void 0),Qe([n()],Ge.prototype,"justifyContent",void 0),Qe([n()],Ge.prototype,"alignContent",void 0),Qe([n()],Ge.prototype,"columnGap",void 0),Qe([n()],Ge.prototype,"rowGap",void 0),Qe([n()],Ge.prototype,"gap",void 0),Qe([n()],Ge.prototype,"padding",void 0),Qe([n()],Ge.prototype,"margin",void 0),Ge=Qe([I("wui-grid")],Ge);const Xe=w`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[0]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:e})=>e[4]}, 20px);
    transition:
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:e})=>e.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:e})=>e.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:e})=>e.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:e})=>e.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var Ye=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Je=class extends e{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){const e="certified"===this.wallet?.badge_type;return t`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${z(e?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?t`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():t`
      <wui-wallet-image
        size="lg"
        imageSrc=${z(this.imageSrc)}
        name=${z(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return t`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=b.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await b.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){this.wallet&&!this.isImpressed&&(this.isImpressed=!0,h.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:u.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};Je.styles=Xe,Ye([r()],Je.prototype,"visible",void 0),Ye([r()],Je.prototype,"imageSrc",void 0),Ye([r()],Je.prototype,"imageLoading",void 0),Ye([r()],Je.prototype,"isImpressed",void 0),Ye([n()],Je.prototype,"explorerId",void 0),Ye([n()],Je.prototype,"walletQuery",void 0),Ye([n()],Je.prototype,"certified",void 0),Ye([n()],Je.prototype,"displayIndex",void 0),Ye([n({type:Object})],Je.prototype,"wallet",void 0),Je=Ye([I("w3m-all-wallets-list-item")],Je);const Ze=w`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
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

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-inout-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:e})=>e[4]};
    padding-bottom: ${({spacing:e})=>e[4]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var et=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const tt="local-paginator";let it=class extends e{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!s.state.wallets.length,this.wallets=s.state.wallets,this.mobileFullScreen=l.state.enableMobileFullScreen,this.unsubscribe.push(s.subscribeKey("wallets",e=>this.wallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.paginationObserver?.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),t`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;const e=this.shadowRoot?.querySelector("wui-grid");e&&(await s.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,i){return[...Array(e)].map(()=>t`
        <wui-card-select-loader type="wallet" id=${z(i)}></wui-card-select-loader>
      `)}walletsTemplate(){return P.getWalletConnectWallets(this.wallets).map((e,i)=>t`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${e.id}"
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
          explorerId=${e.id}
          certified=${"certified"===this.badge}
          displayIndex=${i}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){const{wallets:e,recommended:t,featured:i,count:o,mobileFilteredOutWalletsLength:n}=s.state,r=window.innerWidth<352?3:4,a=e.length+t.length;let l=Math.ceil(a/r)*r-a+r;return l-=e.length?i.length%r:0,0===o&&i.length>0?null:0===o||[...i,...e,...t].length<o-(n??0)?this.shimmerTemplate(l,tt):null}createPaginationObserver(){const e=this.shadowRoot?.querySelector(`#${tt}`);e&&(this.paginationObserver=new IntersectionObserver(([e])=>{if(e?.isIntersecting&&!this.loading){const{page:e,count:t,wallets:i}=s.state;i.length<t&&s.fetchWalletsByPage({page:e+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){a.selectWalletConnector(e)}};it.styles=Ze,et([r()],it.prototype,"loading",void 0),et([r()],it.prototype,"wallets",void 0),et([r()],it.prototype,"badge",void 0),et([r()],it.prototype,"mobileFullScreen",void 0),it=et([I("w3m-all-wallets-list")],it);const ot=o`
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

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
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
`;var nt=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let rt=class extends e{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=l.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?t`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){this.query.trim()===this.prevQuery.trim()&&this.badge===this.prevBadge||(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await s.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:e}=s.state,i=P.markWalletsAsInstalled(e),o=P.filterWalletsByWcSupport(i);return o.length?t`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${o.map((e,i)=>t`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(e)}
              .wallet=${e}
              data-testid="wallet-search-item-${e.id}"
              explorerId=${e.id}
              certified=${"certified"===this.badge}
              walletQuery=${this.query}
              displayIndex=${i}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:t`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){a.selectWalletConnector(e)}};rt.styles=ot,nt([r()],rt.prototype,"loading",void 0),nt([r()],rt.prototype,"mobileFullScreen",void 0),nt([n()],rt.prototype,"query",void 0),nt([n()],rt.prototype,"badge",void 0),rt=nt([I("w3m-all-wallets-search")],rt);var at=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let st=class extends e{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=c.debounce(e=>{this.search=e})}render(){const e=this.search.length>=2;return t`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${"certified"===this.badge}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?t`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:t`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(e){e.detail?(this.badge="certified",k.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return c.isMobile()?t`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){u.push("ConnectingWalletConnect")}};at([r()],st.prototype,"search",void 0),at([r()],st.prototype,"badge",void 0),st=at([I("w3m-all-wallets-view")],st);let lt=class extends e{constructor(){super(...arguments),this.wallet=u.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return t`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?t`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?t`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?t`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?t`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(h.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),c.openHref(e.href,"_blank"))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};lt=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-downloads-view")],lt);export{st as W3mAllWalletsView,Pe as W3mConnectingWcBasicView,lt as W3mDownloadsView};
