import{b7 as e,b8 as t,aP as i,b3 as o}from"./DvO0AinD.js";import{n,r}from"./B_ot7u58.js";import{n as a,A as s,O as l,h as c,e as d,a as u,E as p,R as h,r as g,y as w,F as m,x as b,H as f,t as y,u as v,T as x,d as $,M as k,G as C,I as R,l as E,C as S,J as T,K as O,L as j}from"./q8v0_EFd.js";import{c as I,U as P}from"./BXdaP9GO.js";import{o as W}from"./4RH0AGma.js";import{Q as L}from"./DceVWoup.js";import{e as z,n as _}from"./BPF-pwSa.js";import"./DS_txzci.js";var D=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let B=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=a.state.connectors,this.count=s.state.count,this.filteredCount=s.state.filteredWallets.length,this.isFetchingRecommendedWallets=s.state.isFetchingRecommendedWallets,this.unsubscribe.push(a.subscribeKey("connectors",e=>this.connectors=e),s.subscribeKey("count",e=>this.count=e),s.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),s.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.connectors.find(e=>"walletConnect"===e.id),{allWallets:i}=l.state;if(!e||"HIDE"===i)return null;if("ONLY_MOBILE"===i&&!c.isMobile())return null;const o=s.state.featured.length,n=this.count+o,r=n<10?n:10*Math.floor(n/10),a=this.filteredCount>0?this.filteredCount:r;let p=`${a}`;this.filteredCount>0?p=`${this.filteredCount}`:a<n&&(p=`${a}+`);const h=d.hasAnyConnection(u.CONNECTOR_ID.WALLET_CONNECT);return t`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${p}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${W(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${h}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){var e;p.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),h.push("AllWallets",{redirectView:null==(e=h.state.data)?void 0:e.redirectView})}};D([n()],B.prototype,"tabIdx",void 0),D([r()],B.prototype,"connectors",void 0),D([r()],B.prototype,"count",void 0),D([r()],B.prototype,"filteredCount",void 0),D([r()],B.prototype,"isFetchingRecommendedWallets",void 0),B=D([I("w3m-all-wallets-widget")],B);const A=g`
  :host {
    margin-top: ${({spacing:e})=>e[1]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1)
      ${({spacing:e})=>e[2]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`;var N=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let U=class extends e{constructor(){super(),this.unsubscribe=[],this.connectors=a.state.connectors,this.recommended=s.state.recommended,this.featured=s.state.featured,this.explorerWallets=s.state.explorerWallets,this.connections=d.state.connections,this.connectorImages=w.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(a.subscribeKey("connectors",e=>this.connectors=e),d.subscribeKey("connections",e=>this.connections=e),w.subscribeKey("connectorImages",e=>this.connectorImages=e),s.subscribeKey("recommended",e=>this.recommended=e),s.subscribeKey("featured",e=>this.featured=e),s.subscribeKey("explorerFilteredWallets",e=>{this.explorerWallets=(null==e?void 0:e.length)?e:s.state.explorerWallets}),s.subscribeKey("explorerWallets",e=>{var t;(null==(t=this.explorerWallets)?void 0:t.length)||(this.explorerWallets=e)})),c.isTelegram()&&c.isIos()&&(this.loadingTelegram=!d.state.wcUri,this.unsubscribe.push(d.subscribeKey("wcUri",e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return t`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}mapConnectorsToExplorerWallets(e,t){return e.map(e=>{if("MULTI_CHAIN"===e.type&&e.connectors){const i=e.connectors.map(e=>e.id),o=e.connectors.map(e=>e.name),n=e.connectors.map(e=>{var t;return null==(t=e.info)?void 0:t.rdns}),r=null==t?void 0:t.find(e=>i.includes(e.id)||o.includes(e.name)||e.rdns&&(n.includes(e.rdns)||i.includes(e.rdns)));return e.explorerWallet=r??e.explorerWallet,e}const i=null==t?void 0:t.find(t=>{var i;return t.id===e.id||t.rdns===(null==(i=e.info)?void 0:i.rdns)||t.name===e.name});return e.explorerWallet=i??e.explorerWallet,e})}processConnectorsByType(e,t=!0){const i=m.sortConnectorsByExplorerWallet([...e]);return t?i.filter(m.showConnector):i}connectorListTemplate(){const e=this.mapConnectorsToExplorerWallets(this.connectors,this.explorerWallets??[]),t=m.getConnectorsByType(e,this.recommended,this.featured),i=this.processConnectorsByType(t.announced.filter(e=>"walletConnect"!==e.id)),o=this.processConnectorsByType(t.injected),n=this.processConnectorsByType(t.multiChain.filter(e=>"WalletConnect"!==e.name),!1),r=t.custom,a=t.recent,s=this.processConnectorsByType(t.external.filter(e=>e.id!==u.CONNECTOR_ID.COINBASE_SDK)),l=t.recommended,d=t.featured,p=m.getConnectorTypeOrder({custom:r,recent:a,announced:i,injected:o,multiChain:n,recommended:l,featured:d,external:s}),h=this.connectors.find(e=>"walletConnect"===e.id),g=c.isMobile(),w=[];for(const c of p)switch(c){case"walletConnect":!g&&h&&w.push({kind:"connector",subtype:"walletConnect",connector:h});break;case"recent":m.getFilteredRecentWallets().forEach(e=>w.push({kind:"wallet",subtype:"recent",wallet:e}));break;case"injected":n.forEach(e=>w.push({kind:"connector",subtype:"multiChain",connector:e})),i.forEach(e=>w.push({kind:"connector",subtype:"announced",connector:e})),o.forEach(e=>w.push({kind:"connector",subtype:"injected",connector:e}));break;case"featured":d.forEach(e=>w.push({kind:"wallet",subtype:"featured",wallet:e}));break;case"custom":m.getFilteredCustomWallets(r??[]).forEach(e=>w.push({kind:"wallet",subtype:"custom",wallet:e}));break;case"external":s.forEach(e=>w.push({kind:"connector",subtype:"external",connector:e}));break;case"recommended":m.getCappedRecommendedWallets(l).forEach(e=>w.push({kind:"wallet",subtype:"recommended",wallet:e}));break}return w.map((e,t)=>"connector"===e.kind?this.renderConnector(e,t):this.renderWallet(e,t))}renderConnector(e,i){var o,n;const r=e.connector,a=b.getConnectorImage(r)||this.connectorImages[(null==r?void 0:r.imageId)??""],s=(this.connections.get(r.chain)??[]).some(e=>f.isLowerCaseMatch(e.connectorId,r.id));let l,c;"multiChain"===e.subtype?(l="multichain",c="info"):"walletConnect"===e.subtype?(l="qr code",c="accent"):"injected"===e.subtype||"announced"===e.subtype?(l=s?"connected":"installed",c=s?"info":"success"):(l=void 0,c=void 0);const p=d.hasAnyConnection(u.CONNECTOR_ID.WALLET_CONNECT),h=("walletConnect"===e.subtype||"external"===e.subtype)&&p;return t`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${W(a)}
        .installed=${!0}
        name=${r.name??"Unknown"}
        .tagVariant=${c}
        tagLabel=${W(l)}
        data-testid=${`wallet-selector-${r.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${W(this.tabIdx)}
        ?disabled=${h}
        rdnsId=${W((null==(o=r.explorerWallet)?void 0:o.rdns)||void 0)}
        walletRank=${W(null==(n=r.explorerWallet)?void 0:n.order)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){var t;const i=null==(t=h.state.data)?void 0:t.redirectView;return"walletConnect"===e.subtype?(a.setActiveConnector(e.connector),void(c.isMobile()?h.push("AllWallets"):h.push("ConnectingWalletConnect",{redirectView:i}))):"multiChain"===e.subtype?(a.setActiveConnector(e.connector),void h.push("ConnectingMultiChain",{redirectView:i})):"injected"===e.subtype?(a.setActiveConnector(e.connector),void h.push("ConnectingExternal",{connector:e.connector,redirectView:i,wallet:e.connector.explorerWallet})):"announced"===e.subtype?"walletConnect"===e.connector.id?void(c.isMobile()?h.push("AllWallets"):h.push("ConnectingWalletConnect",{redirectView:i})):void h.push("ConnectingExternal",{connector:e.connector,redirectView:i,wallet:e.connector.explorerWallet}):void h.push("ConnectingExternal",{connector:e.connector,redirectView:i})}renderWallet(e,i){const o=e.wallet,n=b.getWalletImage(o),r=d.hasAnyConnection(u.CONNECTOR_ID.WALLET_CONNECT),a=this.loadingTelegram,s="recent"===e.subtype?"recent":void 0,l="recent"===e.subtype?"info":void 0;return t`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${W(n)}
        name=${o.name??"Unknown"}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${o.id}`}
        tabIdx=${W(this.tabIdx)}
        ?loading=${a}
        ?disabled=${r}
        rdnsId=${W(o.rdns||void 0)}
        walletRank=${W(o.order)}
        tagLabel=${W(s)}
        .tagVariant=${l}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){var t;const i=null==(t=h.state.data)?void 0:t.redirectView;if("featured"===e.subtype)return void a.selectWalletConnector(e.wallet);if("recent"===e.subtype){if(this.loadingTelegram)return;return void a.selectWalletConnector(e.wallet)}if("custom"===e.subtype){if(this.loadingTelegram)return;return void h.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:i})}if(this.loadingTelegram)return;const o=a.getConnector({id:e.wallet.id,rdns:e.wallet.rdns});o?h.push("ConnectingExternal",{connector:o,redirectView:i}):h.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:i})}};U.styles=A,N([n({type:Number})],U.prototype,"tabIdx",void 0),N([r()],U.prototype,"connectors",void 0),N([r()],U.prototype,"recommended",void 0),N([r()],U.prototype,"featured",void 0),N([r()],U.prototype,"explorerWallets",void 0),N([r()],U.prototype,"connections",void 0),N([r()],U.prototype,"connectorImages",void 0),N([r()],U.prototype,"loadingTelegram",void 0),U=N([I("w3m-connector-list")],U);const q=g`
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
`;var F=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const M={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},V={lg:"md",md:"sm",sm:"sm"};let K=class extends e{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return t`
      <button data-active=${this.active}>
        ${this.icon?t`<wui-icon size=${V[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${M[this.size]}> ${this.label} </wui-text>
      </button>
    `}};K.styles=[y,v,q],F([n()],K.prototype,"icon",void 0),F([n()],K.prototype,"size",void 0),F([n()],K.prototype,"label",void 0),F([n({type:Boolean})],K.prototype,"active",void 0),K=F([I("wui-tab-item")],K);const H=g`
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
`;var Q=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let G=class extends e{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,i)=>{var o;const n=i===this.activeTab;return t`
        <wui-tab-item
          @click=${()=>this.onTabClick(i)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${n}
          data-active=${n}
          data-testid="tab-${null==(o=e.label)?void 0:o.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};G.styles=[y,v,H],Q([n({type:Array})],G.prototype,"tabs",void 0),Q([n()],G.prototype,"onTabChange",void 0),Q([n()],G.prototype,"size",void 0),Q([r()],G.prototype,"activeTab",void 0),G=Q([I("wui-tabs")],G);var X=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Y=class extends e{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.generateTabs();return t`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){const e=this.platforms.map(e=>"browser"===e?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===e?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===e?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===e?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===e?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=e.map(({platform:e})=>e),e}onTabChange(e){var t;const i=this.platformTabs[e];i&&(null==(t=this.onSelectPlatfrom)||t.call(this,i))}};X([n({type:Array})],Y.prototype,"platforms",void 0),X([n()],Y.prototype,"onSelectPlatfrom",void 0),Y=X([I("w3m-connecting-header")],Y);const J=g`
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
`;var Z=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ee=class extends e{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const e=this.radius>50?50:this.radius,i=36-e;return t`
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
    `}};ee.styles=[y,J],Z([n({type:Number})],ee.prototype,"radius",void 0),ee=Z([I("wui-loading-thumbnail")],ee);const te=g`
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
`;var ie=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let oe=class extends e{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return t`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};oe.styles=[y,v,te],ie([n({type:Boolean})],oe.prototype,"disabled",void 0),ie([n()],oe.prototype,"label",void 0),ie([n()],oe.prototype,"buttonLabel",void 0),oe=ie([I("wui-cta-button")],oe);const ne=g`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e[5]} ${({spacing:e})=>e[5]};
  }
`;var re=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ae=class extends e{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:e,app_store:i,play_store:o,chrome_store:n,homepage:r}=this.wallet,a=c.isMobile(),s=c.isIos(),l=c.isAndroid(),d=[i,o,r,n].filter(Boolean).length>1,u=P.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return d&&!a?t`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${()=>h.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!d&&r?t`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:i&&s?t`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:o&&l?t`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){var e;(null==(e=this.wallet)?void 0:e.app_store)&&c.openHref(this.wallet.app_store,"_blank")}onPlayStore(){var e;(null==(e=this.wallet)?void 0:e.play_store)&&c.openHref(this.wallet.play_store,"_blank")}onHomePage(){var e;(null==(e=this.wallet)?void 0:e.homepage)&&c.openHref(this.wallet.homepage,"_blank")}};ae.styles=[ne],re([n({type:Object})],ae.prototype,"wallet",void 0),ae=re([I("w3m-mobile-download-links")],ae);const se=g`
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
`;var le=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class ce extends e{constructor(){var e,t,i,o,n;super(),this.wallet=null==(e=h.state.data)?void 0:e.wallet,this.connector=null==(t=h.state.data)?void 0:t.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=b.getConnectorImage(this.connector)??b.getWalletImage(this.wallet),this.name=(null==(i=this.wallet)?void 0:i.name)??(null==(o=this.connector)?void 0:o.name)??"Wallet",this.isRetrying=!1,this.uri=d.state.wcUri,this.error=d.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(d.subscribeKey("wcUri",e=>{var t;this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,null==(t=this.onConnect)||t.call(this))}),d.subscribeKey("wcError",e=>this.error=e)),(c.isTelegram()||c.isSafari())&&c.isIos()&&d.state.wcUri&&(null==(n=this.onConnect)||n.call(this))}firstUpdated(){var e;null==(e=this.onAutoConnect)||e.call(this),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),d.setWcError(!1),clearTimeout(this.timeout)}render(){var e;null==(e=this.onRender)||e.call(this),this.onShowRetry();const i=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let o="";return this.label?o=this.label:(o=`Continue in ${this.name}`,this.error&&(o="Connection declined")),t`
      <wui-flex
        data-error=${W(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${W(this.imageSrc)}></wui-wallet-image>

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
            ${o}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${i}</wui-text>
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
    `}onShowRetry(){var e;if(this.error&&!this.showRetry){this.showRetry=!0;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("wui-button");null==t||t.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){var e,t;d.setWcError(!1),this.onRetry?(this.isRetrying=!0,null==(e=this.onRetry)||e.call(this)):null==(t=this.onConnect)||t.call(this)}loaderTemplate(){const e=x.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return t`<wui-loading-thumbnail radius=${9*i}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(c.copyToClopboard(this.uri),$.showSuccess("Link copied"))}catch{$.showError("Failed to copy")}}}ce.styles=se,le([r()],ce.prototype,"isRetrying",void 0),le([r()],ce.prototype,"uri",void 0),le([r()],ce.prototype,"error",void 0),le([r()],ce.prototype,"ready",void 0),le([r()],ce.prototype,"showRetry",void 0),le([r()],ce.prototype,"label",void 0),le([r()],ce.prototype,"secondaryBtnLabel",void 0),le([r()],ce.prototype,"secondaryLabel",void 0),le([r()],ce.prototype,"isLoading",void 0),le([n({type:Boolean})],ce.prototype,"isMobile",void 0),le([n()],ce.prototype,"onRetry",void 0);let de=class extends ce{constructor(){var e;if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:null==(e=this.wallet)?void 0:e.display_index,walletRank:this.wallet.order,view:h.state.view}})}async onConnectProxy(){var e,t;try{this.error=!1;const{connectors:i}=a.state,o=i.find(e=>{var t,i,o;return"ANNOUNCED"===e.type&&(null==(t=e.info)?void 0:t.rdns)===(null==(i=this.wallet)?void 0:i.rdns)||"INJECTED"===e.type||e.name===(null==(o=this.wallet)?void 0:o.name)});if(!o)throw new Error("w3m-connecting-wc-browser: No connector found");await d.connectExternal(o,o.chain),k.close(),p.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:(null==(e=this.wallet)?void 0:e.name)||"Unknown",view:h.state.view,walletRank:null==(t=this.wallet)?void 0:t.order}})}catch(i){i instanceof C&&i.originalName===R.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?p.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:i.message}}):p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(null==i?void 0:i.message)??"Unknown"}}),this.error=!0}}};de=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-connecting-wc-browser")],de);let ue=class extends ce{constructor(){var e;if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:null==(e=this.wallet)?void 0:e.display_index,walletRank:this.wallet.order,view:h.state.view}})}onRenderProxy(){var e;!this.ready&&this.uri&&(this.ready=!0,null==(e=this.onConnect)||e.call(this))}onConnectProxy(){var e;if((null==(e=this.wallet)?void 0:e.desktop_link)&&this.uri)try{this.error=!1;const{desktop_link:e,name:t}=this.wallet,{redirect:i,href:o}=c.formatNativeUrl(e,this.uri);d.setWcLinking({name:t,href:o}),d.setRecentWallet(this.wallet),c.openHref(i,"_blank")}catch{this.error=!0}}};ue=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-connecting-wc-desktop")],ue);var pe=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let he=class extends ce{constructor(){var e;if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=l.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{var e;if((null==(e=this.wallet)?void 0:e.mobile_link)&&this.uri)try{this.error=!1;const{mobile_link:e,link_mode:t,name:i}=this.wallet,{redirect:o,redirectUniversalLink:n,href:r}=c.formatNativeUrl(e,this.uri,t);this.redirectDeeplink=o,this.redirectUniversalLink=n,this.target=c.isIframe()?"_top":"_self",d.setWcLinking({name:i,href:r}),d.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?c.openHref(this.redirectUniversalLink,this.target):c.openHref(this.redirectDeeplink,this.target)}catch(t){p.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=E.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(d.subscribeKey("wcUri",()=>{this.onHandleURI()})),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:null==(e=this.wallet)?void 0:e.display_index,walletRank:this.wallet.order,view:h.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){var e;this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,null==(e=this.onConnect)||e.call(this))}onTryAgain(){var e;d.setWcError(!1),null==(e=this.onConnect)||e.call(this)}};pe([r()],he.prototype,"redirectDeeplink",void 0),pe([r()],he.prototype,"redirectUniversalLink",void 0),pe([r()],he.prototype,"target",void 0),pe([r()],he.prototype,"preferUniversalLinks",void 0),pe([r()],he.prototype,"isLoading",void 0),he=pe([I("w3m-connecting-wc-mobile")],he);function ge(e,t,i){if(e===t)return!1;return(e-t<0?t-e:e-t)<=i+.1}const we={generate({uri:e,size:t,logoSize:o,padding:n=8,dotColor:r="var(--apkt-colors-black)"}){const a=10,s=[],l=function(e,t){const i=Array.prototype.slice.call(L.create(e,{errorCorrectionLevel:t}).modules.data,0),o=Math.sqrt(i.length);return i.reduce((e,t,i)=>(i%o===0?e.push([t]):e[e.length-1].push(t))&&e,[])}(e,"Q"),c=(t-2*n)/l.length,d=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];d.forEach(({x:e,y:t})=>{const o=(l.length-7)*c*e+n,u=(l.length-7)*c*t+n,p=.45;for(let n=0;n<d.length;n+=1){const e=c*(7-2*n);s.push(i`
            <rect
              fill=${2===n?"var(--apkt-colors-black)":"var(--apkt-colors-white)"}
              width=${0===n?e-a:e}
              rx= ${0===n?(e-a)*p:e*p}
              ry= ${0===n?(e-a)*p:e*p}
              stroke=${r}
              stroke-width=${0===n?a:0}
              height=${0===n?e-a:e}
              x= ${0===n?u+c*n+5:u+c*n}
              y= ${0===n?o+c*n+5:o+c*n}
            />
          `)}});const u=Math.floor((o+25)/c),p=l.length/2-u/2,h=l.length/2+u/2-1,g=[];l.forEach((e,t)=>{e.forEach((e,i)=>{if(l[t][i]&&!(t<7&&i<7||t>l.length-8&&i<7||t<7&&i>l.length-8||t>p&&t<h&&i>p&&i<h)){const e=t*c+c/2+n,o=i*c+c/2+n;g.push([e,o])}})});const w={};return g.forEach(([e,t])=>{var i;w[e]?null==(i=w[e])||i.push(t):w[e]=[t]}),Object.entries(w).map(([e,t])=>{const i=t.filter(e=>t.every(t=>!ge(e,t,c)));return[Number(e),i]}).forEach(([e,t])=>{t.forEach(t=>{s.push(i`<circle cx=${e} cy=${t} fill=${r} r=${c/2.5} />`)})}),Object.entries(w).filter(([e,t])=>t.length>1).map(([e,t])=>{const i=t.filter(e=>t.some(t=>ge(e,t,c)));return[Number(e),i]}).map(([e,t])=>{t.sort((e,t)=>e<t?-1:1);const i=[];for(const o of t){const e=i.find(e=>e.some(e=>ge(o,e,c)));e?e.push(o):i.push([o])}return[e,i.map(e=>[e[0],e[e.length-1]])]}).forEach(([e,t])=>{t.forEach(([t,o])=>{s.push(i`
              <line
                x1=${e}
                x2=${e}
                y1=${t}
                y2=${o}
                stroke=${r}
                stroke-width=${c/1.25}
                stroke-linecap="round"
              />
            `)})}),s}},me=g`
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
`;var be=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let fe=class extends e{constructor(){super(...arguments),this.uri="",this.size=500,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),t`<wui-flex
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
        ${we.generate({uri:this.uri,size:this.size,logoSize:this.arenaClear?0:this.size/4})}
      </svg>
    `}templateVisual(){return this.imageSrc?t`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?t`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:t`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};fe.styles=[y,me],be([n()],fe.prototype,"uri",void 0),be([n({type:Number})],fe.prototype,"size",void 0),be([n()],fe.prototype,"theme",void 0),be([n()],fe.prototype,"imageSrc",void 0),be([n()],fe.prototype,"alt",void 0),be([n({type:Boolean})],fe.prototype,"arenaClear",void 0),be([n({type:Boolean})],fe.prototype,"farcaster",void 0),fe=be([I("wui-qr-code")],fe);const ye=g`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundSecondary} 0%,
      ${({tokens:e})=>e.theme.foregroundTertiary} 50%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1s ease-in-out infinite;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;var ve=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let xe=class extends e{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`\n      width: ${this.width};\n      height: ${this.height};\n    `,this.dataset.rounded=this.rounded?"true":"false",t`<slot></slot>`}};xe.styles=[ye],ve([n()],xe.prototype,"width",void 0),ve([n()],xe.prototype,"height",void 0),ve([n()],xe.prototype,"variant",void 0),ve([n({type:Boolean})],xe.prototype,"rounded",void 0),xe=ve([I("wui-shimmer")],xe);const $e=g`
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
`;var ke=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ce=class extends ce{constructor(){super(),this.basic=!1}firstUpdated(){var e,t,i;this.basic||p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:(null==(e=this.wallet)?void 0:e.name)??"WalletConnect",platform:"qrcode",displayIndex:null==(t=this.wallet)?void 0:t.display_index,walletRank:null==(i=this.wallet)?void 0:i.order,view:h.state.view}})}disconnectedCallback(){var e;super.disconnectedCallback(),null==(e=this.unsubscribe)||e.forEach(e=>e())}render(){return this.onRenderProxy(),t`
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
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const e=this.wallet?this.wallet.name:void 0;return d.setWcLinking(void 0),d.setRecentWallet(this.wallet),t` <wui-qr-code
      theme=${x.state.themeMode}
      uri=${this.uri}
      imageSrc=${W(b.getWalletImage(this.wallet))}
      color=${W(x.state.themeVariables["--w3m-qr-color"])}
      alt=${W(e)}
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
    </wui-button>`}};Ce.styles=$e,ke([n({type:Boolean})],Ce.prototype,"basic",void 0),Ce=ke([I("w3m-connecting-wc-qrcode")],Ce);let Re=class extends e{constructor(){var e,t,i;if(super(),this.wallet=null==(e=h.state.data)?void 0:e.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:null==(t=this.wallet)?void 0:t.display_index,walletRank:null==(i=this.wallet)?void 0:i.order,view:h.state.view}})}render(){return t`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${W(b.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};Re=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-connecting-wc-unsupported")],Re);var Ee=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Se=class extends ce{constructor(){var e,t;if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=E.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(d.subscribeKey("wcUri",()=>{this.updateLoadingState()})),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:null==(e=this.wallet)?void 0:e.display_index,walletRank:null==(t=this.wallet)?void 0:t.order,view:h.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){var e;if((null==(e=this.wallet)?void 0:e.webapp_link)&&this.uri)try{this.error=!1;const{webapp_link:e,name:t}=this.wallet,{redirect:i,href:o}=c.formatUniversalUrl(e,this.uri);d.setWcLinking({name:t,href:o}),d.setRecentWallet(this.wallet),c.openHref(i,"_blank")}catch{this.error=!0}}};Ee([r()],Se.prototype,"isLoading",void 0),Se=Ee([I("w3m-connecting-wc-web")],Se);const Te=g`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var Oe=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let je=class extends e{constructor(){var e;super(),this.wallet=null==(e=h.state.data)?void 0:e.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=Boolean(l.state.siwx),this.remoteFeatures=l.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(l.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),t`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){var e;return(null==(e=this.remoteFeatures)?void 0:e.reownBranding)&&this.displayBranding?t`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(e=!1){var t,i;if("browser"!==this.platform&&(!l.state.manualWCControl||e))try{const{wcPairingExpiry:i,status:o}=d.state,{redirectView:n}=h.state.data??{};if(e||l.state.enableEmbedded||c.isPairingExpired(i)||"connecting"===o){const e=d.getConnections(S.state.activeChain),i=null==(t=this.remoteFeatures)?void 0:t.multiWallet,o=e.length>0;await d.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(o&&i?(h.replace("ProfileWallets"),$.showSuccess("New Wallet Added")):n?h.replace(n):k.close())}}catch(o){if(o instanceof Error&&o.message.includes("An error occurred when attempting to switch chain")&&!l.state.enableNetworkSwitch&&S.state.activeChain)return S.setActiveCaipNetwork(T.getUnsupportedNetwork(`${S.state.activeChain}:${null==(i=S.state.activeCaipNetwork)?void 0:i.id}`)),void S.showUnsupportedChainUI();o instanceof C&&o.originalName===R.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?p.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:o.message}}):p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(null==o?void 0:o.message)??"Unknown"}}),d.setWcError(!0),$.showError(o.message??"Connection error"),d.resetWcConnection(),h.goBack()}}determinePlatforms(){if(!this.wallet)return this.platforms.push("qrcode"),void(this.platform="qrcode");if(this.platform)return;const{mobile_link:e,desktop_link:t,webapp_link:i,injected:o,rdns:n}=this.wallet,r=null==o?void 0:o.map(({injected_id:e})=>e).filter(Boolean),a=[...n?[n]:r??[]],s=!l.state.isUniversalProvider&&a.length,u=e,p=i,h=d.checkInstalled(a),g=s&&h,w=t&&!c.isMobile();g&&!S.state.noAdapters&&this.platforms.push("browser"),u&&this.platforms.push(c.isMobile()?"mobile":"qrcode"),p&&this.platforms.push("web"),w&&this.platforms.push("desktop"),g||!s||S.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return t`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return t`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return t`
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
    `:null}async onSelectPlatform(e){var t;const i=null==(t=this.shadowRoot)?void 0:t.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};je.styles=Te,Oe([r()],je.prototype,"platform",void 0),Oe([r()],je.prototype,"platforms",void 0),Oe([r()],je.prototype,"isSiwxEnabled",void 0),Oe([r()],je.prototype,"remoteFeatures",void 0),Oe([n({type:Boolean})],je.prototype,"displayBranding",void 0),Oe([n({type:Boolean})],je.prototype,"basic",void 0),je=Oe([I("w3m-connecting-wc-view")],je);var Ie=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Pe=class extends e{constructor(){super(),this.unsubscribe=[],this.isMobile=c.isMobile(),this.remoteFeatures=l.state.remoteFeatures,this.unsubscribe.push(l.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){const{featured:e,recommended:i}=s.state,{customWallets:o}=l.state,n=O.getRecentWallets(),r=e.length||i.length||(null==o?void 0:o.length)||n.length;return t`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${r?t`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return t`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){var e;return(null==(e=this.remoteFeatures)?void 0:e.reownBranding)?t` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};Ie([r()],Pe.prototype,"isMobile",void 0),Ie([r()],Pe.prototype,"remoteFeatures",void 0),Pe=Ie([I("w3m-connecting-wc-basic-view")],Pe);const We=g`
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
`;var Le=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ze=class extends e{constructor(){super(...arguments),this.inputElementRef=z(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return t`
      <label data-size=${this.size}>
        <input
          ${_(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){var e;this.dispatchEvent(new CustomEvent("switchChange",{detail:null==(e=this.inputElementRef.value)?void 0:e.checked,bubbles:!0,composed:!0}))}};ze.styles=[y,v,We],Le([n({type:Boolean})],ze.prototype,"checked",void 0),Le([n({type:Boolean})],ze.prototype,"disabled",void 0),Le([n()],ze.prototype,"size",void 0),ze=Le([I("wui-toggle")],ze);const _e=g`
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
`;var De=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Be=class extends e{constructor(){super(...arguments),this.checked=!1}render(){return t`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};Be.styles=[y,v,_e],De([n({type:Boolean})],Be.prototype,"checked",void 0),Be=De([I("wui-certified-switch")],Be);const Ae=g`
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
`;var Ne=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ue=class extends e{constructor(){super(...arguments),this.inputElementRef=z(),this.disabled=!1,this.loading=!1,this.placeholder="",this.type="text",this.value="",this.size="md"}render(){return t` <div class="wui-input-text-container">
        ${this.templateLeftIcon()}
        <input
          data-size=${this.size}
          ${_(this.inputElementRef)}
          data-testid="wui-input-text"
          type=${this.type}
          enterkeyhint=${W(this.enterKeyHint)}
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
      ></wui-icon>`:null}templateSubmitButton(){var e;return this.onSubmit?t`<button
        class="wui-input-text-submit-button ${this.loading?"loading":""}"
        @click=${null==(e=this.onSubmit)?void 0:e.bind(this)}
        ?disabled=${this.disabled||this.loading}
      >
        ${this.loading?t`<wui-icon name="spinner" size="md"></wui-icon>`:t`<wui-icon name="chevronRight" size="md"></wui-icon>`}
      </button>`:null}templateError(){return this.errorText?t`<wui-text variant="sm-regular" color="error">${this.errorText}</wui-text>`:null}templateWarning(){return this.warningText?t`<wui-text variant="sm-regular" color="warning">${this.warningText}</wui-text>`:null}dispatchInputChangeEvent(){var e;this.dispatchEvent(new CustomEvent("inputChange",{detail:null==(e=this.inputElementRef.value)?void 0:e.value,bubbles:!0,composed:!0}))}};Ue.styles=[y,v,Ae],Ne([n()],Ue.prototype,"icon",void 0),Ne([n({type:Boolean})],Ue.prototype,"disabled",void 0),Ne([n({type:Boolean})],Ue.prototype,"loading",void 0),Ne([n()],Ue.prototype,"placeholder",void 0),Ne([n()],Ue.prototype,"type",void 0),Ne([n()],Ue.prototype,"value",void 0),Ne([n()],Ue.prototype,"errorText",void 0),Ne([n()],Ue.prototype,"warningText",void 0),Ne([n()],Ue.prototype,"onSubmit",void 0),Ne([n()],Ue.prototype,"size",void 0),Ne([n({attribute:!1})],Ue.prototype,"onKeyDown",void 0),Ue=Ne([I("wui-input-text")],Ue);const qe=g`
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
`;var Fe=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Me=class extends e{constructor(){super(...arguments),this.inputComponentRef=z(),this.inputValue=""}render(){return t`
      <wui-input-text
        ${_(this.inputComponentRef)}
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
    `}onInputChange(e){this.inputValue=e.detail||""}clearValue(){const e=this.inputComponentRef.value,t=null==e?void 0:e.inputElementRef.value;t&&(t.value="",this.inputValue="",t.focus(),t.dispatchEvent(new Event("input")))}};Me.styles=[y,qe],Fe([n()],Me.prototype,"inputValue",void 0),Me=Fe([I("wui-search-bar")],Me);const Ve=i`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`,Ke=g`
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
`;var He=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Qe=class extends e{constructor(){super(...arguments),this.type="wallet"}render(){return t`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?t` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${Ve}`:t`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};Qe.styles=[y,v,Ke],He([n()],Qe.prototype,"type",void 0),Qe=He([I("wui-card-select-loader")],Qe);const Ge=o`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var Xe=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Ye=class extends e{render(){return this.style.cssText=`\n      grid-template-rows: ${this.gridTemplateRows};\n      grid-template-columns: ${this.gridTemplateColumns};\n      justify-items: ${this.justifyItems};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      align-content: ${this.alignContent};\n      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};\n      padding-top: ${this.padding&&P.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&P.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&P.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&P.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&P.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&P.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&P.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&P.getSpacingStyles(this.margin,3)};\n    `,t`<slot></slot>`}};Ye.styles=[y,Ge],Xe([n()],Ye.prototype,"gridTemplateRows",void 0),Xe([n()],Ye.prototype,"gridTemplateColumns",void 0),Xe([n()],Ye.prototype,"justifyItems",void 0),Xe([n()],Ye.prototype,"alignItems",void 0),Xe([n()],Ye.prototype,"justifyContent",void 0),Xe([n()],Ye.prototype,"alignContent",void 0),Xe([n()],Ye.prototype,"columnGap",void 0),Xe([n()],Ye.prototype,"rowGap",void 0),Xe([n()],Ye.prototype,"gap",void 0),Xe([n()],Ye.prototype,"padding",void 0),Xe([n()],Ye.prototype,"margin",void 0),Ye=Xe([I("wui-grid")],Ye);const Je=g`
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
`;var Ze=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let et=class extends e{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){var e,i;const o="certified"===(null==(e=this.wallet)?void 0:e.badge_type);return t`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${W(o?"certified":void 0)}
            >${null==(i=this.wallet)?void 0:i.name}</wui-text
          >
          ${o?t`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){var e,i;return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():t`
      <wui-wallet-image
        size="lg"
        imageSrc=${W(this.imageSrc)}
        name=${W(null==(e=this.wallet)?void 0:e.name)}
        .installed=${(null==(i=this.wallet)?void 0:i.installed)??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return t`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=b.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await b.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){this.wallet&&!this.isImpressed&&(this.isImpressed=!0,p.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:h.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};et.styles=Je,Ze([r()],et.prototype,"visible",void 0),Ze([r()],et.prototype,"imageSrc",void 0),Ze([r()],et.prototype,"imageLoading",void 0),Ze([r()],et.prototype,"isImpressed",void 0),Ze([n()],et.prototype,"explorerId",void 0),Ze([n()],et.prototype,"walletQuery",void 0),Ze([n()],et.prototype,"certified",void 0),Ze([n()],et.prototype,"displayIndex",void 0),Ze([n({type:Object})],et.prototype,"wallet",void 0),et=Ze([I("w3m-all-wallets-list-item")],et);const tt=g`
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
`;var it=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const ot="local-paginator";let nt=class extends e{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!s.state.wallets.length,this.wallets=s.state.wallets,this.recommended=s.state.recommended,this.featured=s.state.featured,this.filteredWallets=s.state.filteredWallets,this.mobileFullScreen=l.state.enableMobileFullScreen,this.unsubscribe.push(s.subscribeKey("wallets",e=>this.wallets=e),s.subscribeKey("recommended",e=>this.recommended=e),s.subscribeKey("featured",e=>this.featured=e),s.subscribeKey("filteredWallets",e=>this.filteredWallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){var e;this.unsubscribe.forEach(e=>e()),null==(e=this.paginationObserver)||e.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),t`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){var e;this.loading=!0;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("wui-grid");t&&(await s.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,i){return[...Array(e)].map(()=>t`
        <wui-card-select-loader type="wallet" id=${W(i)}></wui-card-select-loader>
      `)}getWallets(){var e;const t=[...this.featured,...this.recommended];(null==(e=this.filteredWallets)?void 0:e.length)>0?t.push(...this.filteredWallets):t.push(...this.wallets);const i=c.uniqueBy(t,"id"),o=j.markWalletsAsInstalled(i);return j.markWalletsWithDisplayIndex(o)}walletsTemplate(){return this.getWallets().map((e,i)=>t`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${e.id}"
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
          explorerId=${e.id}
          certified=${"certified"===this.badge}
          displayIndex=${i}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){const{wallets:e,recommended:t,featured:i,count:o,mobileFilteredOutWalletsLength:n}=s.state,r=window.innerWidth<352?3:4,a=e.length+t.length;let l=Math.ceil(a/r)*r-a+r;return l-=e.length?i.length%r:0,0===o&&i.length>0?null:0===o||[...i,...e,...t].length<o-(n??0)?this.shimmerTemplate(l,ot):null}createPaginationObserver(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector(`#${ot}`);t&&(this.paginationObserver=new IntersectionObserver(([e])=>{if((null==e?void 0:e.isIntersecting)&&!this.loading){const{page:e,count:t,wallets:i}=s.state;i.length<t&&s.fetchWalletsByPage({page:e+1})}}),this.paginationObserver.observe(t))}onConnectWallet(e){a.selectWalletConnector(e)}};nt.styles=tt,it([r()],nt.prototype,"loading",void 0),it([r()],nt.prototype,"wallets",void 0),it([r()],nt.prototype,"recommended",void 0),it([r()],nt.prototype,"featured",void 0),it([r()],nt.prototype,"filteredWallets",void 0),it([r()],nt.prototype,"badge",void 0),it([r()],nt.prototype,"mobileFullScreen",void 0),nt=it([I("w3m-all-wallets-list")],nt);const rt=o`
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
`;var at=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let st=class extends e{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=l.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?t`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){this.query.trim()===this.prevQuery.trim()&&this.badge===this.prevBadge||(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await s.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:e}=s.state,i=j.markWalletsAsInstalled(e);return e.length?t`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${i.map((e,i)=>t`
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
      `}onConnectWallet(e){a.selectWalletConnector(e)}};st.styles=rt,at([r()],st.prototype,"loading",void 0),at([r()],st.prototype,"mobileFullScreen",void 0),at([n()],st.prototype,"query",void 0),at([n()],st.prototype,"badge",void 0),st=at([I("w3m-all-wallets-search")],st);var lt=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ct=class extends e{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=c.debounce(e=>{this.search=e})}render(){const e=this.search.length>=2;return t`
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
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(e){e.detail?(this.badge="certified",$.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return c.isMobile()?t`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){h.push("ConnectingWalletConnect")}};lt([r()],ct.prototype,"search",void 0),lt([r()],ct.prototype,"badge",void 0),ct=lt([I("w3m-all-wallets-view")],ct);const dt=g`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, scale;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-image {
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var ut=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let pt=class extends e{constructor(){super(...arguments),this.imageSrc="google",this.loading=!1,this.disabled=!1,this.rightIcon=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",t`
      <button
        ?disabled=${!!this.loading||Boolean(this.disabled)}
        data-loading=${this.loading}
        tabindex=${W(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?t`<wui-image
        icon=${this.icon}
        iconColor=${W(this.iconColor)}
        ?boxed=${!0}
        ?rounded=${this.rounded}
      ></wui-image>`:t`<wui-image
      ?boxed=${!0}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      src=${this.imageSrc}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?t`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:t`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};pt.styles=[y,v,dt],ut([n()],pt.prototype,"imageSrc",void 0),ut([n()],pt.prototype,"icon",void 0),ut([n()],pt.prototype,"iconColor",void 0),ut([n({type:Boolean})],pt.prototype,"loading",void 0),ut([n()],pt.prototype,"tabIdx",void 0),ut([n({type:Boolean})],pt.prototype,"disabled",void 0),ut([n({type:Boolean})],pt.prototype,"rightIcon",void 0),ut([n({type:Boolean})],pt.prototype,"rounded",void 0),ut([n({type:Boolean})],pt.prototype,"fullSize",void 0),pt=ut([I("wui-list-item")],pt);let ht=class extends e{constructor(){var e;super(...arguments),this.wallet=null==(e=h.state.data)?void 0:e.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return t`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){var e;return(null==(e=this.wallet)?void 0:e.chrome_store)?t`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){var e;return(null==(e=this.wallet)?void 0:e.app_store)?t`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){var e;return(null==(e=this.wallet)?void 0:e.play_store)?t`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){var e;return(null==(e=this.wallet)?void 0:e.homepage)?t`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(p.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),c.openHref(e.href,"_blank"))}onChromeStore(){var e;(null==(e=this.wallet)?void 0:e.chrome_store)&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){var e;(null==(e=this.wallet)?void 0:e.app_store)&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){var e;(null==(e=this.wallet)?void 0:e.play_store)&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){var e;(null==(e=this.wallet)?void 0:e.homepage)&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};ht=function(e,t,i,o){var n,r=arguments.length,a=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,i,a):n(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a}([I("w3m-downloads-view")],ht);export{ct as W3mAllWalletsView,Pe as W3mConnectingWcBasicView,ht as W3mDownloadsView};
