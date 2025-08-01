import{i as t,a as e}from"./CZ-fEcpL.js";import{x as i,b as o,E as r}from"./DIFfro1Y.js";import{n as a,r as n,a as s,e as l}from"./Dh1RFCXV.js";import{e as c,r as d,C as u,A as p,O as h,a as w,E as g,R as b,b as v,c as f,d as m,S as y,f as x,W as $,g as k,h as C,T as R,i as j,M as O,j as I,k as S}from"./cHn03iLJ.js";import{c as T,o as z,U as P,f as W}from"./CsWpnLMA.js";import{Q as E}from"./CyJfnTSJ.js";import"./ChEJjJbq.js";const L=t`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
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

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`;var D=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let B=class extends e{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let t="xxs";return t="lg"===this.size?"m":"md"===this.size?"xs":"xxs",this.style.cssText=`\n       --local-border-radius: var(--wui-border-radius-${t});\n       --local-size: var(--wui-wallet-image-size-${this.size});\n   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),i`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?i`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?i`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:i`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};B.styles=[c,d,L],D([a()],B.prototype,"size",void 0),D([a()],B.prototype,"name",void 0),D([a()],B.prototype,"imageSrc",void 0),D([a()],B.prototype,"walletIcon",void 0),D([a({type:Boolean})],B.prototype,"installed",void 0),D([a()],B.prototype,"badgeSize",void 0),B=D([T("wui-wallet-image")],B);const A=t`
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
`;var _=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let U=class extends e{constructor(){super(...arguments),this.walletImages=[]}render(){const t=this.walletImages.length<4;return i`${this.walletImages.slice(0,4).map((({src:t,walletName:e})=>i`
            <wui-wallet-image
              size="inherit"
              imageSrc=${t}
              name=${z(e)}
            ></wui-wallet-image>
          `))}
      ${t?[...Array(4-this.walletImages.length)].map((()=>i` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`)):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};U.styles=[d,A],_([a({type:Array})],U.prototype,"walletImages",void 0),U=_([T("wui-all-wallets-image")],U);const q=t`
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
`;var N=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let M=class extends e{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return i`
      <button ?disabled=${this.disabled} tabindex=${z(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?i` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?i` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?i`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:i`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.loading?i`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?i`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?i`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};M.styles=[d,c,q],N([a({type:Array})],M.prototype,"walletImages",void 0),N([a()],M.prototype,"imageSrc",void 0),N([a()],M.prototype,"name",void 0),N([a()],M.prototype,"tagLabel",void 0),N([a()],M.prototype,"tagVariant",void 0),N([a()],M.prototype,"icon",void 0),N([a()],M.prototype,"walletIcon",void 0),N([a()],M.prototype,"tabIdx",void 0),N([a({type:Boolean})],M.prototype,"installed",void 0),N([a({type:Boolean})],M.prototype,"disabled",void 0),N([a({type:Boolean})],M.prototype,"showAllWallets",void 0),N([a({type:Boolean})],M.prototype,"loading",void 0),N([a({type:String})],M.prototype,"loadingSpinnerColor",void 0),M=N([T("wui-list-wallet")],M);var V=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let K=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.count=p.state.count,this.filteredCount=p.state.filteredWallets.length,this.isFetchingRecommendedWallets=p.state.isFetchingRecommendedWallets,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t)),p.subscribeKey("count",(t=>this.count=t)),p.subscribeKey("filteredWallets",(t=>this.filteredCount=t.length)),p.subscribeKey("isFetchingRecommendedWallets",(t=>this.isFetchingRecommendedWallets=t)))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){const t=this.connectors.find((t=>"walletConnect"===t.id)),{allWallets:e}=h.state;if(!t||"HIDE"===e)return null;if("ONLY_MOBILE"===e&&!w.isMobile())return null;const o=p.state.featured.length,r=this.count+o,a=r<10?r:10*Math.floor(r/10),n=this.filteredCount>0?this.filteredCount:a;let s=`${n}`;return this.filteredCount>0?s=`${this.filteredCount}`:n<r&&(s=`${n}+`),i`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${s}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${z(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
      ></wui-list-wallet>
    `}onAllWallets(){g.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),b.push("AllWallets")}};V([a()],K.prototype,"tabIdx",void 0),V([n()],K.prototype,"connectors",void 0),V([n()],K.prototype,"count",void 0),V([n()],K.prototype,"filteredCount",void 0),V([n()],K.prototype,"isFetchingRecommendedWallets",void 0),K=V([T("w3m-all-wallets-widget")],K);var G=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let H=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t)))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){const t=this.connectors.filter((t=>"ANNOUNCED"===t.type));return(null==t?void 0:t.length)?i`
      <wui-flex flexDirection="column" gap="xs">
        ${t.filter(v.showConnector).map((t=>i`
              <wui-list-wallet
                imageSrc=${z(f.getConnectorImage(t))}
                name=${t.name??"Unknown"}
                @click=${()=>this.onConnector(t)}
                tagVariant="success"
                tagLabel="installed"
                data-testid=${`wallet-selector-${t.id}`}
                .installed=${!0}
                tabIdx=${z(this.tabIdx)}
              >
              </wui-list-wallet>
            `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){"walletConnect"===t.id?w.isMobile()?b.push("AllWallets"):b.push("ConnectingWalletConnect"):b.push("ConnectingExternal",{connector:t})}};G([a()],H.prototype,"tabIdx",void 0),G([n()],H.prototype,"connectors",void 0),H=G([T("w3m-connect-announced-widget")],H);var F=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let X=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.loading=!1,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t))),w.isTelegram()&&w.isIos()&&(this.loading=!m.state.wcUri,this.unsubscribe.push(m.subscribeKey("wcUri",(t=>this.loading=!t))))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){const{customWallets:t}=h.state;if(!(null==t?void 0:t.length))return this.style.cssText="display: none",null;const e=this.filterOutDuplicateWallets(t);return i`<wui-flex flexDirection="column" gap="xs">
      ${e.map((t=>i`
          <wui-list-wallet
            imageSrc=${z(f.getWalletImage(t))}
            name=${t.name??"Unknown"}
            @click=${()=>this.onConnectWallet(t)}
            data-testid=${`wallet-selector-${t.id}`}
            tabIdx=${z(this.tabIdx)}
            ?loading=${this.loading}
          >
          </wui-list-wallet>
        `))}
    </wui-flex>`}filterOutDuplicateWallets(t){const e=y.getRecentWallets(),i=this.connectors.map((t=>{var e;return null==(e=t.info)?void 0:e.rdns})).filter(Boolean),o=e.map((t=>t.rdns)).filter(Boolean),r=i.concat(o);if(r.includes("io.metamask.mobile")&&w.isMobile()){const t=r.indexOf("io.metamask.mobile");r[t]="io.metamask"}return t.filter((t=>!r.includes(String(null==t?void 0:t.rdns))))}onConnectWallet(t){this.loading||b.push("ConnectingWalletConnect",{wallet:t})}};F([a()],X.prototype,"tabIdx",void 0),F([n()],X.prototype,"connectors",void 0),F([n()],X.prototype,"loading",void 0),X=F([T("w3m-connect-custom-widget")],X);var Q=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Y=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t)))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){const t=this.connectors.filter((t=>"EXTERNAL"===t.type)).filter(v.showConnector).filter((t=>t.id!==x.CONNECTOR_ID.COINBASE_SDK));return(null==t?void 0:t.length)?i`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map((t=>i`
            <wui-list-wallet
              imageSrc=${z(f.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              data-testid=${`wallet-selector-external-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${z(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){b.push("ConnectingExternal",{connector:t})}};Q([a()],Y.prototype,"tabIdx",void 0),Q([n()],Y.prototype,"connectors",void 0),Y=Q([T("w3m-connect-external-widget")],Y);var J=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Z=class extends e{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){return this.wallets.length?i`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map((t=>i`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${t.id}`}
              imageSrc=${z(f.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${z(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){u.selectWalletConnector(t)}};J([a()],Z.prototype,"tabIdx",void 0),J([a()],Z.prototype,"wallets",void 0),Z=J([T("w3m-connect-featured-widget")],Z);var tt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let et=class extends e{constructor(){super(...arguments),this.tabIdx=void 0,this.connectors=[]}render(){const t=this.connectors.filter(v.showConnector);return 0===t.length?(this.style.cssText="display: none",null):i`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map((t=>i`
            <wui-list-wallet
              imageSrc=${z(f.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${z(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `}onConnector(t){u.setActiveConnector(t),b.push("ConnectingExternal",{connector:t})}};tt([a()],et.prototype,"tabIdx",void 0),tt([a()],et.prototype,"connectors",void 0),et=tt([T("w3m-connect-injected-widget")],et);var it=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let ot=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t)))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){const t=this.connectors.filter((t=>"MULTI_CHAIN"===t.type&&"WalletConnect"!==t.name));return(null==t?void 0:t.length)?i`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map((t=>i`
            <wui-list-wallet
              imageSrc=${z(f.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${z(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){u.setActiveConnector(t),b.push("ConnectingMultiChain")}};it([a()],ot.prototype,"tabIdx",void 0),it([n()],ot.prototype,"connectors",void 0),ot=it([T("w3m-connect-multi-chain-widget")],ot);var rt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let at=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.loading=!1,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t))),w.isTelegram()&&w.isIos()&&(this.loading=!m.state.wcUri,this.unsubscribe.push(m.subscribeKey("wcUri",(t=>this.loading=!t))))}render(){const t=y.getRecentWallets().filter((t=>!$.isExcluded(t))).filter((t=>!this.hasWalletConnector(t))).filter((t=>this.isWalletCompatibleWithCurrentChain(t)));return t.length?i`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map((t=>i`
            <wui-list-wallet
              imageSrc=${z(f.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${z(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){this.loading||u.selectWalletConnector(t)}hasWalletConnector(t){return this.connectors.some((e=>e.id===t.id||e.name===t.name))}isWalletCompatibleWithCurrentChain(t){const e=k.state.activeChain;return!e||!t.chains||t.chains.some((t=>{const i=t.split(":")[0];return e===i}))}};rt([a()],at.prototype,"tabIdx",void 0),rt([n()],at.prototype,"connectors",void 0),rt([n()],at.prototype,"loading",void 0),at=rt([T("w3m-connect-recent-widget")],at);var nt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let st=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,w.isTelegram()&&w.isIos()&&(this.loading=!m.state.wcUri,this.unsubscribe.push(m.subscribeKey("wcUri",(t=>this.loading=!t))))}render(){const{connectors:t}=u.state,{customWallets:e,featuredWalletIds:o}=h.state,r=y.getRecentWallets(),a=t.find((t=>"walletConnect"===t.id)),n=t.filter((t=>"INJECTED"===t.type||"ANNOUNCED"===t.type||"MULTI_CHAIN"===t.type)).filter((t=>"Browser Wallet"!==t.name));if(!a)return null;if(o||e||!this.wallets.length)return this.style.cssText="display: none",null;const s=n.length+r.length,l=Math.max(0,2-s),c=$.filterOutDuplicateWallets(this.wallets).slice(0,l);return c.length?i`
      <wui-flex flexDirection="column" gap="xs">
        ${c.map((t=>i`
            <wui-list-wallet
              imageSrc=${z(f.getWalletImage(t))}
              name=${(null==t?void 0:t.name)??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${z(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){if(this.loading)return;const e=u.getConnector(t.id,t.rdns);e?b.push("ConnectingExternal",{connector:e}):b.push("ConnectingWalletConnect",{wallet:t})}};nt([a()],st.prototype,"tabIdx",void 0),nt([a()],st.prototype,"wallets",void 0),nt([n()],st.prototype,"loading",void 0),st=nt([T("w3m-connect-recommended-widget")],st);var lt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let ct=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.connectorImages=C.state.connectorImages,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t)),C.subscribeKey("connectorImages",(t=>this.connectorImages=t)))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){if(w.isMobile())return this.style.cssText="display: none",null;const t=this.connectors.find((t=>"walletConnect"===t.id));if(!t)return this.style.cssText="display: none",null;const e=t.imageUrl||this.connectorImages[(null==t?void 0:t.imageId)??""];return i`
      <wui-list-wallet
        imageSrc=${z(e)}
        name=${t.name??"Unknown"}
        @click=${()=>this.onConnector(t)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${z(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `}onConnector(t){u.setActiveConnector(t),b.push("ConnectingWalletConnect")}};lt([a()],ct.prototype,"tabIdx",void 0),lt([n()],ct.prototype,"connectors",void 0),lt([n()],ct.prototype,"connectorImages",void 0),ct=lt([T("w3m-connect-walletconnect-widget")],ct);const dt=t`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var ut=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let pt=class extends e{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=u.state.connectors,this.recommended=p.state.recommended,this.featured=p.state.featured,this.unsubscribe.push(u.subscribeKey("connectors",(t=>this.connectors=t)),p.subscribeKey("recommended",(t=>this.recommended=t)),p.subscribeKey("featured",(t=>this.featured=t)))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){return i`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){const{custom:t,recent:e,announced:o,injected:r,multiChain:a,recommended:n,featured:s,external:l}=v.getConnectorsByType(this.connectors,this.recommended,this.featured);return v.getConnectorTypeOrder({custom:t,recent:e,announced:o,injected:r,multiChain:a,recommended:n,featured:s,external:l}).map((t=>{switch(t){case"injected":return i`
            ${a.length?i`<w3m-connect-multi-chain-widget
                  tabIdx=${z(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${o.length?i`<w3m-connect-announced-widget
                  tabIdx=${z(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${r.length?i`<w3m-connect-injected-widget
                  .connectors=${r}
                  tabIdx=${z(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return i`<w3m-connect-walletconnect-widget
            tabIdx=${z(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return i`<w3m-connect-recent-widget
            tabIdx=${z(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return i`<w3m-connect-featured-widget
            .wallets=${s}
            tabIdx=${z(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return i`<w3m-connect-custom-widget
            tabIdx=${z(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return i`<w3m-connect-external-widget
            tabIdx=${z(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return i`<w3m-connect-recommended-widget
            .wallets=${n}
            tabIdx=${z(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return null}}))}};pt.styles=dt,ut([a()],pt.prototype,"tabIdx",void 0),ut([n()],pt.prototype,"connectors",void 0),ut([n()],pt.prototype,"recommended",void 0),ut([n()],pt.prototype,"featured",void 0),pt=ut([T("w3m-connector-list")],pt);const ht=t`
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
`;var wt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let gt=class extends e{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`\n      --local-tab: ${this.activeTab};\n      --local-tab-width: ${this.localTabWidth};\n    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map(((t,e)=>{var o;const r=e===this.activeTab;return i`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(e)}
          data-active=${r}
          data-testid="tab-${null==(o=t.label)?void 0:o.toLowerCase()}"
        >
          ${this.iconTemplate(t)}
          <wui-text variant="small-600" color="inherit"> ${t.label} </wui-text>
        </button>
      `}))}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout((()=>{this.animateTabs(0,!0)}),0))}iconTemplate(t){return t.icon?i`<wui-icon size="xs" color="inherit" name=${t.icon}></wui-icon>`:null}onTabClick(t){this.buttons&&this.animateTabs(t,!1),this.activeTab=t,this.onTabChange(t)}animateTabs(t,e){const i=this.buttons[this.activeTab],o=this.buttons[t],r=null==i?void 0:i.querySelector("wui-text"),a=null==o?void 0:o.querySelector("wui-text"),n=null==o?void 0:o.getBoundingClientRect(),s=null==a?void 0:a.getBoundingClientRect();i&&r&&!e&&t!==this.activeTab&&(r.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),i.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),o&&n&&s&&a&&(t!==this.activeTab||e)&&(this.localTabWidth=`${Math.round(n.width+s.width)+6}px`,o.animate([{width:`${n.width+s.width}px`}],{duration:e?0:500,fill:"forwards",easing:"ease"}),a.animate([{opacity:1}],{duration:e?0:125,delay:e?0:200,fill:"forwards",easing:"ease"}))}};gt.styles=[d,c,ht],wt([a({type:Array})],gt.prototype,"tabs",void 0),wt([a()],gt.prototype,"onTabChange",void 0),wt([a({type:Array})],gt.prototype,"buttons",void 0),wt([a({type:Boolean})],gt.prototype,"disabled",void 0),wt([a()],gt.prototype,"localTabWidth",void 0),wt([n()],gt.prototype,"activeTab",void 0),wt([n()],gt.prototype,"isDense",void 0),gt=wt([T("wui-tabs")],gt);var bt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let vt=class extends e{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach((t=>t()))}render(){const t=this.generateTabs();return i`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs .tabs=${t} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){const t=this.platforms.map((t=>"browser"===t?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===t?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===t?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===t?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===t?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"}));return this.platformTabs=t.map((({platform:t})=>t)),t}onTabChange(t){var e;const i=this.platformTabs[t];i&&(null==(e=this.onSelectPlatfrom)||e.call(this,i))}};bt([a({type:Array})],vt.prototype,"platforms",void 0),bt([a()],vt.prototype,"onSelectPlatfrom",void 0),vt=bt([T("w3m-connecting-header")],vt);const ft=t`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: none;
    border-radius: var(--local-border-radius);
    width: var(--local-width);
    white-space: nowrap;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='md'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-l);
    height: 36px;
  }

  button[data-size='md'][data-icon-left='true'][data-icon-right='false'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-s);
  }

  button[data-size='md'][data-icon-right='true'][data-icon-left='false'] {
    padding: 8.2px var(--wui-spacing-s) 9px var(--wui-spacing-l);
  }

  button[data-size='lg'] {
    padding: var(--wui-spacing-m) var(--wui-spacing-2l);
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='inverse'] {
    background-color: var(--wui-color-inverse-100);
    color: var(--wui-color-inverse-000);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='accent-error'] {
    background: var(--wui-color-error-glass-015);
    color: var(--wui-color-error-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-error-glass-010);
  }

  button[data-variant='accent-success'] {
    background: var(--wui-color-success-glass-015);
    color: var(--wui-color-success-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-success-glass-010);
  }

  button[data-variant='neutral'] {
    background: transparent;
    color: var(--wui-color-fg-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-variant='main']:focus-visible:enabled {
    background-color: var(--wui-color-accent-090);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='inverse']:focus-visible:enabled {
    background-color: var(--wui-color-inverse-100);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent']:focus-visible:enabled {
    background-color: var(--wui-color-accent-glass-010);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent-error']:focus-visible:enabled {
    background: var(--wui-color-error-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-error-100),
      0 0 0 4px var(--wui-color-error-glass-020);
  }
  button[data-variant='accent-success']:focus-visible:enabled {
    background: var(--wui-color-success-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-success-100),
      0 0 0 4px var(--wui-color-success-glass-020);
  }
  button[data-variant='neutral']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='accent-error']:hover:enabled {
      background: var(--wui-color-error-glass-020);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-error']:active:enabled {
      background: var(--wui-color-error-glass-030);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-success']:hover:enabled {
      background: var(--wui-color-success-glass-020);
      color: var(--wui-color-success-100);
    }

    button[data-variant='accent-success']:active:enabled {
      background: var(--wui-color-success-glass-030);
      color: var(--wui-color-success-100);
    }

    button[data-variant='neutral']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='neutral']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }

    button[data-size='lg'][data-icon-left='true'][data-icon-right='false'] {
      padding-left: var(--wui-spacing-m);
    }

    button[data-size='lg'][data-icon-right='true'][data-icon-left='false'] {
      padding-right: var(--wui-spacing-m);
    }
  }

  /* -- Disabled state --------------------------------------------------- */
  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    color: var(--wui-color-gray-glass-020);
    cursor: not-allowed;
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`;var mt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};const yt={main:"inverse-100",inverse:"inverse-000",accent:"accent-100","accent-error":"error-100","accent-success":"success-100",neutral:"fg-100",disabled:"gray-glass-020"},xt={lg:"paragraph-600",md:"small-600"},$t={lg:"md",md:"md"};let kt=class extends e{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="main",this.hasIconLeft=!1,this.hasIconRight=!1,this.borderRadius="m"}render(){this.style.cssText=`\n    --local-width: ${this.fullWidth?"100%":"auto"};\n    --local-opacity-100: ${this.loading?0:1};\n    --local-opacity-000: ${this.loading?1:0};\n    --local-border-radius: var(--wui-border-radius-${this.borderRadius});\n    `;const t=this.textVariant??xt[this.size];return i`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${()=>this.handleSlotLeftChange()}></slot>
        <wui-text variant=${t} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight" @slotchange=${()=>this.handleSlotRightChange()}></slot>
      </button>
    `}handleSlotLeftChange(){this.hasIconLeft=!0}handleSlotRightChange(){this.hasIconRight=!0}loadingTemplate(){if(this.loading){const t=$t[this.size],e=this.disabled?yt.disabled:yt[this.variant];return i`<wui-loading-spinner color=${e} size=${t}></wui-loading-spinner>`}return i``}};kt.styles=[d,c,ft],mt([a()],kt.prototype,"size",void 0),mt([a({type:Boolean})],kt.prototype,"disabled",void 0),mt([a({type:Boolean})],kt.prototype,"fullWidth",void 0),mt([a({type:Boolean})],kt.prototype,"loading",void 0),mt([a()],kt.prototype,"variant",void 0),mt([a({type:Boolean})],kt.prototype,"hasIconLeft",void 0),mt([a({type:Boolean})],kt.prototype,"hasIconRight",void 0),mt([a()],kt.prototype,"borderRadius",void 0),mt([a()],kt.prototype,"textVariant",void 0),kt=mt([T("wui-button")],kt);const Ct=t`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var Rt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let jt=class extends e{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return i`
      <button ?disabled=${this.disabled} tabindex=${z(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};jt.styles=[d,c,Ct],Rt([a()],jt.prototype,"tabIdx",void 0),Rt([a({type:Boolean})],jt.prototype,"disabled",void 0),Rt([a()],jt.prototype,"color",void 0),jt=Rt([T("wui-link")],jt);const Ot=t`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var It=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let St=class extends e{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const t=this.radius>50?50:this.radius,e=36-t;return i`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${116+e} ${245+e}"
          stroke-dashoffset=${360+1.75*e}
        />
      </svg>
    `}};St.styles=[d,Ot],It([a({type:Number})],St.prototype,"radius",void 0),St=It([T("wui-loading-thumbnail")],St);const Tt=t`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`;var zt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Pt=class extends e{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){const t="sm"===this.size?"small-600":"paragraph-600";return i`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?i`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${t} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};Pt.styles=[d,c,Tt],zt([a()],Pt.prototype,"variant",void 0),zt([a()],Pt.prototype,"imageSrc",void 0),zt([a({type:Boolean})],Pt.prototype,"disabled",void 0),zt([a()],Pt.prototype,"icon",void 0),zt([a()],Pt.prototype,"size",void 0),zt([a()],Pt.prototype,"text",void 0),Pt=zt([T("wui-chip-button")],Pt);const Wt=t`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var Et=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Lt=class extends e{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return i`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};Lt.styles=[d,c,Wt],Et([a({type:Boolean})],Lt.prototype,"disabled",void 0),Et([a()],Lt.prototype,"label",void 0),Et([a()],Lt.prototype,"buttonLabel",void 0),Lt=Et([T("wui-cta-button")],Lt);const Dt=t`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`;var Bt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let At=class extends e{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:t,app_store:e,play_store:o,chrome_store:r,homepage:a}=this.wallet,n=w.isMobile(),s=w.isIos(),l=w.isAndroid(),c=[e,o,a,r].filter(Boolean).length>1,d=P.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return c&&!n?i`
        <wui-cta-button
          label=${`Don't have ${d}?`}
          buttonLabel="Get"
          @click=${()=>b.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!c&&a?i`
        <wui-cta-button
          label=${`Don't have ${d}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:e&&s?i`
        <wui-cta-button
          label=${`Don't have ${d}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:o&&l?i`
        <wui-cta-button
          label=${`Don't have ${d}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){var t;(null==(t=this.wallet)?void 0:t.app_store)&&w.openHref(this.wallet.app_store,"_blank")}onPlayStore(){var t;(null==(t=this.wallet)?void 0:t.play_store)&&w.openHref(this.wallet.play_store,"_blank")}onHomePage(){var t;(null==(t=this.wallet)?void 0:t.homepage)&&w.openHref(this.wallet.homepage,"_blank")}};At.styles=[Dt],Bt([a({type:Object})],At.prototype,"wallet",void 0),At=Bt([T("w3m-mobile-download-links")],At);const _t=t`
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
`;var Ut=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};class qt extends e{constructor(){var t,e,i,o,r;super(),this.wallet=null==(t=b.state.data)?void 0:t.wallet,this.connector=null==(e=b.state.data)?void 0:e.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=f.getWalletImage(this.wallet)??f.getConnectorImage(this.connector),this.name=(null==(i=this.wallet)?void 0:i.name)??(null==(o=this.connector)?void 0:o.name)??"Wallet",this.isRetrying=!1,this.uri=m.state.wcUri,this.error=m.state.wcError,this.ready=!1,this.showRetry=!1,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(m.subscribeKey("wcUri",(t=>{var e;this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,null==(e=this.onConnect)||e.call(this))})),m.subscribeKey("wcError",(t=>this.error=t))),(w.isTelegram()||w.isSafari())&&w.isIos()&&m.state.wcUri&&(null==(r=this.onConnect)||r.call(this))}firstUpdated(){var t;null==(t=this.onAutoConnect)||t.call(this),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach((t=>t())),m.setWcError(!1),clearTimeout(this.timeout)}render(){var t;null==(t=this.onRender)||t.call(this),this.onShowRetry();const e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let o=`Continue in ${this.name}`;return this.error&&(o="Connection declined"),i`
      <wui-flex
        data-error=${z(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${z(this.imageSrc)}></wui-wallet-image>

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
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${o}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?i`
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

      ${this.isWalletConnect?i`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){var t;if(this.error&&!this.showRetry){this.showRetry=!0;const e=null==(t=this.shadowRoot)?void 0:t.querySelector("wui-button");null==e||e.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){var t,e;m.setWcError(!1),this.onRetry?(this.isRetrying=!0,null==(t=this.onRetry)||t.call(this)):null==(e=this.onConnect)||e.call(this)}loaderTemplate(){const t=R.state.themeVariables["--w3m-border-radius-master"],e=t?parseInt(t.replace("px",""),10):4;return i`<wui-loading-thumbnail radius=${9*e}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(w.copyToClopboard(this.uri),j.showSuccess("Link copied"))}catch{j.showError("Failed to copy")}}}qt.styles=_t,Ut([n()],qt.prototype,"isRetrying",void 0),Ut([n()],qt.prototype,"uri",void 0),Ut([n()],qt.prototype,"error",void 0),Ut([n()],qt.prototype,"ready",void 0),Ut([n()],qt.prototype,"showRetry",void 0),Ut([n()],qt.prototype,"secondaryBtnLabel",void 0),Ut([n()],qt.prototype,"secondaryLabel",void 0),Ut([n()],qt.prototype,"isLoading",void 0),Ut([a({type:Boolean})],qt.prototype,"isMobile",void 0),Ut([a()],qt.prototype,"onRetry",void 0);let Nt=class extends qt{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),g.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){var t;try{this.error=!1;const{connectors:e}=u.state,i=e.find((t=>{var e,i,o;return"ANNOUNCED"===t.type&&(null==(e=t.info)?void 0:e.rdns)===(null==(i=this.wallet)?void 0:i.rdns)||"INJECTED"===t.type||t.name===(null==(o=this.wallet)?void 0:o.name)}));if(!i)throw new Error("w3m-connecting-wc-browser: No connector found");await m.connectExternal(i,i.chain),O.close(),g.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:(null==(t=this.wallet)?void 0:t.name)||"Unknown"}})}catch(e){g.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(null==e?void 0:e.message)??"Unknown"}}),this.error=!0}}};Nt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}([T("w3m-connecting-wc-browser")],Nt);let Mt=class extends qt{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),g.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){var t;!this.ready&&this.uri&&(this.ready=!0,null==(t=this.onConnect)||t.call(this))}onConnectProxy(){var t;if((null==(t=this.wallet)?void 0:t.desktop_link)&&this.uri)try{this.error=!1;const{desktop_link:t,name:e}=this.wallet,{redirect:i,href:o}=w.formatNativeUrl(t,this.uri);m.setWcLinking({name:e,href:o}),m.setRecentWallet(this.wallet),w.openHref(i,"_blank")}catch{this.error=!0}}};Mt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}([T("w3m-connecting-wc-desktop")],Mt);var Vt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Kt=class extends qt{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=h.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{var t;if((null==(t=this.wallet)?void 0:t.mobile_link)&&this.uri)try{this.error=!1;const{mobile_link:t,link_mode:e,name:i}=this.wallet,{redirect:o,redirectUniversalLink:r,href:a}=w.formatNativeUrl(t,this.uri,e);this.redirectDeeplink=o,this.redirectUniversalLink=r,this.target=w.isIframe()?"_top":"_self",m.setWcLinking({name:i,href:a}),m.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?w.openHref(this.redirectUniversalLink,this.target):w.openHref(this.redirectDeeplink,this.target)}catch(e){g.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:e instanceof Error?e.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=I.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(m.subscribeKey("wcUri",(()=>{this.onHandleURI()}))),g.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){var t;this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,null==(t=this.onConnect)||t.call(this))}onTryAgain(){var t;m.setWcError(!1),null==(t=this.onConnect)||t.call(this)}};Vt([n()],Kt.prototype,"redirectDeeplink",void 0),Vt([n()],Kt.prototype,"redirectUniversalLink",void 0),Vt([n()],Kt.prototype,"target",void 0),Vt([n()],Kt.prototype,"preferUniversalLinks",void 0),Vt([n()],Kt.prototype,"isLoading",void 0),Kt=Vt([T("w3m-connecting-wc-mobile")],Kt);function Gt(t,e,i){if(t===e)return!1;return(t-e<0?e-t:t-e)<=i+.1}const Ht={generate({uri:t,size:e,logoSize:i,dotColor:r="#141414"}){const a=[],n=function(t,e){const i=Array.prototype.slice.call(E.create(t,{errorCorrectionLevel:e}).modules.data,0),o=Math.sqrt(i.length);return i.reduce(((t,e,i)=>(i%o==0?t.push([e]):t[t.length-1].push(e))&&t),[])}(t,"Q"),s=e/n.length,l=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];l.forEach((({x:t,y:e})=>{const i=(n.length-7)*s*t,c=(n.length-7)*s*e,d=.45;for(let n=0;n<l.length;n+=1){const t=s*(7-2*n);a.push(o`
            <rect
              fill=${2===n?r:"transparent"}
              width=${0===n?t-5:t}
              rx= ${0===n?(t-5)*d:t*d}
              ry= ${0===n?(t-5)*d:t*d}
              stroke=${r}
              stroke-width=${0===n?5:0}
              height=${0===n?t-5:t}
              x= ${0===n?c+s*n+2.5:c+s*n}
              y= ${0===n?i+s*n+2.5:i+s*n}
            />
          `)}}));const c=Math.floor((i+25)/s),d=n.length/2-c/2,u=n.length/2+c/2-1,p=[];n.forEach(((t,e)=>{t.forEach(((t,i)=>{if(n[e][i]&&!(e<7&&i<7||e>n.length-8&&i<7||e<7&&i>n.length-8||e>d&&e<u&&i>d&&i<u)){const t=e*s+s/2,o=i*s+s/2;p.push([t,o])}}))}));const h={};return p.forEach((([t,e])=>{var i;h[t]?null==(i=h[t])||i.push(e):h[t]=[e]})),Object.entries(h).map((([t,e])=>{const i=e.filter((t=>e.every((e=>!Gt(t,e,s)))));return[Number(t),i]})).forEach((([t,e])=>{e.forEach((e=>{a.push(o`<circle cx=${t} cy=${e} fill=${r} r=${s/2.5} />`)}))})),Object.entries(h).filter((([t,e])=>e.length>1)).map((([t,e])=>{const i=e.filter((t=>e.some((e=>Gt(t,e,s)))));return[Number(t),i]})).map((([t,e])=>{e.sort(((t,e)=>t<e?-1:1));const i=[];for(const o of e){const t=i.find((t=>t.some((t=>Gt(o,t,s)))));t?t.push(o):i.push([o])}return[t,i.map((t=>[t[0],t[t.length-1]]))]})).forEach((([t,e])=>{e.forEach((([e,i])=>{a.push(o`
              <line
                x1=${t}
                x2=${t}
                y1=${e}
                y2=${i}
                stroke=${r}
                stroke-width=${s/1.25}
                stroke-linecap="round"
              />
            `)}))})),a}},Ft=t`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
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
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var Xt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Qt=class extends e{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`\n     --local-size: ${this.size}px;\n     --local-icon-color: ${this.color??"#3396ff"}\n    `,i`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){const t="light"===this.theme?this.size:this.size-32;return o`
      <svg height=${t} width=${t}>
        ${Ht.generate({uri:this.uri,size:t,logoSize:this.arenaClear?0:t/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?i`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?i`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:i`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};Qt.styles=[d,Ft],Xt([a()],Qt.prototype,"uri",void 0),Xt([a({type:Number})],Qt.prototype,"size",void 0),Xt([a()],Qt.prototype,"theme",void 0),Xt([a()],Qt.prototype,"imageSrc",void 0),Xt([a()],Qt.prototype,"alt",void 0),Xt([a()],Qt.prototype,"color",void 0),Xt([a({type:Boolean})],Qt.prototype,"arenaClear",void 0),Xt([a({type:Boolean})],Qt.prototype,"farcaster",void 0),Qt=Xt([T("wui-qr-code")],Qt);const Yt=t`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`;var Jt=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Zt=class extends e{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`\n      width: ${this.width};\n      height: ${this.height};\n      border-radius: clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px);\n    `,i`<slot></slot>`}};Zt.styles=[Yt],Jt([a()],Zt.prototype,"width",void 0),Jt([a()],Zt.prototype,"height",void 0),Jt([a()],Zt.prototype,"borderRadius",void 0),Jt([a()],Zt.prototype,"variant",void 0),Zt=Jt([T("wui-shimmer")],Zt);const te=t`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.9;
  }
`;let ee=class extends e{render(){return i`
      <a
        data-testid="ux-branding-reown"
        href=${"https://reown.com"}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="xs"
          .padding=${["0","0","l","0"]}
        >
          <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
          <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};ee.styles=[d,c,te],ee=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}([T("wui-ux-by-reown")],ee);const ie=t`
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
`;let oe=class extends qt{constructor(){var t;super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),g.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:(null==(t=this.wallet)?void 0:t.name)??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){var t;super.disconnectedCallback(),null==(t=this.unsubscribe)||t.forEach((t=>t())),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),i`
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
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout((()=>{this.ready=!0}),200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const t=this.getBoundingClientRect().width-40,e=this.wallet?this.wallet.name:void 0;return m.setWcLinking(void 0),m.setRecentWallet(this.wallet),i` <wui-qr-code
      size=${t}
      theme=${R.state.themeMode}
      uri=${this.uri}
      imageSrc=${z(f.getWalletImage(this.wallet))}
      color=${z(R.state.themeVariables["--w3m-qr-color"])}
      alt=${z(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){const t=!this.uri||!this.ready;return i`<wui-link
      .disabled=${t}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};oe.styles=ie,oe=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}([T("w3m-connecting-wc-qrcode")],oe);let re=class extends e{constructor(){var t;if(super(),this.wallet=null==(t=b.state.data)?void 0:t.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");g.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return i`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${z(f.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};re=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}([T("w3m-connecting-wc-unsupported")],re);var ae=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let ne=class extends qt{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=I.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(m.subscribeKey("wcUri",(()=>{this.updateLoadingState()}))),g.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){var t;if((null==(t=this.wallet)?void 0:t.webapp_link)&&this.uri)try{this.error=!1;const{webapp_link:t,name:e}=this.wallet,{redirect:i,href:o}=w.formatUniversalUrl(t,this.uri);m.setWcLinking({name:e,href:o}),m.setRecentWallet(this.wallet),w.openHref(i,"_blank")}catch{this.error=!0}}};ae([n()],ne.prototype,"isLoading",void 0),ne=ae([T("w3m-connecting-wc-web")],ne);var se=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let le=class extends e{constructor(){var t;super(),this.wallet=null==(t=b.state.data)?void 0:t.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=Boolean(h.state.siwx),this.remoteFeatures=h.state.remoteFeatures,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(h.subscribeKey("remoteFeatures",(t=>this.remoteFeatures=t)))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){return i`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){var t;return(null==(t=this.remoteFeatures)?void 0:t.reownBranding)?i`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(t=!1){if("browser"!==this.platform&&(!h.state.manualWCControl||t))try{const{wcPairingExpiry:e,status:i}=m.state;(t||h.state.enableEmbedded||w.isPairingExpired(e)||"connecting"===i)&&(await m.connectWalletConnect(),this.isSiwxEnabled||O.close())}catch(e){g.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(null==e?void 0:e.message)??"Unknown"}}),m.setWcError(!0),j.showError(e.message??"Connection error"),m.resetWcConnection(),b.goBack()}}determinePlatforms(){if(!this.wallet)return this.platforms.push("qrcode"),void(this.platform="qrcode");if(this.platform)return;const{mobile_link:t,desktop_link:e,webapp_link:i,injected:o,rdns:r}=this.wallet,a=null==o?void 0:o.map((({injected_id:t})=>t)).filter(Boolean),n=[...r?[r]:a??[]],s=!h.state.isUniversalProvider&&n.length,l=t,c=i,d=m.checkInstalled(n),u=s&&d,p=e&&!w.isMobile();u&&!k.state.noAdapters&&this.platforms.push("browser"),l&&this.platforms.push(w.isMobile()?"mobile":"qrcode"),c&&this.platforms.push("web"),p&&this.platforms.push("desktop"),u||!s||k.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return i`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return i`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return i`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return i`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return i`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return i`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?i`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(t){var e;const i=null==(e=this.shadowRoot)?void 0:e.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};se([n()],le.prototype,"platform",void 0),se([n()],le.prototype,"platforms",void 0),se([n()],le.prototype,"isSiwxEnabled",void 0),se([n()],le.prototype,"remoteFeatures",void 0),le=se([T("w3m-connecting-wc-view")],le);var ce=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let de=class extends e{constructor(){super(...arguments),this.isMobile=w.isMobile()}render(){if(this.isMobile){const{featured:t,recommended:e}=p.state,{customWallets:o}=h.state,r=y.getRecentWallets(),a=t.length||e.length||(null==o?void 0:o.length)||r.length;return i`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${a?i`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return i`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};ce([n()],de.prototype,"isMobile",void 0),de=ce([T("w3m-connecting-wc-basic-view")],de);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue=()=>new pe;class pe{}const he=new WeakMap,we=s(class extends W{render(t){return r}update(t,[e]){var i;const o=e!==this.G;return o&&void 0!==this.G&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.G=e,this.ht=null==(i=t.options)?void 0:i.host,this.rt(this.ct=t.element)),r}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const e=this.ht??globalThis;let i=he.get(e);void 0===i&&(i=new WeakMap,he.set(e,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){var t,e;return"function"==typeof this.G?null==(t=he.get(this.ht??globalThis))?void 0:t.get(this.G):null==(e=this.G)?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),ge=t`
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
`;var be=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let ve=class extends e{constructor(){super(...arguments),this.inputElementRef=ue(),this.checked=void 0}render(){return i`
      <label>
        <input
          ${we(this.inputElementRef)}
          type="checkbox"
          ?checked=${z(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){var t;this.dispatchEvent(new CustomEvent("switchChange",{detail:null==(t=this.inputElementRef.value)?void 0:t.checked,bubbles:!0,composed:!0}))}};ve.styles=[d,c,S,ge],be([a({type:Boolean})],ve.prototype,"checked",void 0),ve=be([T("wui-switch")],ve);const fe=t`
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
`;var me=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let ye=class extends e{constructor(){super(...arguments),this.checked=void 0}render(){return i`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${z(this.checked)}></wui-switch>
      </button>
    `}};ye.styles=[d,c,fe],me([a({type:Boolean})],ye.prototype,"checked",void 0),ye=me([T("wui-certified-switch")],ye);const xe=t`
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
`;var $e=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let ke=class extends e{constructor(){super(...arguments),this.icon="copy"}render(){return i`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};ke.styles=[d,c,xe],$e([a()],ke.prototype,"icon",void 0),ke=$e([T("wui-input-element")],ke);const Ce=t`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md,
  wui-loading-spinner + .wui-size-md {
    padding: 10.5px var(--wui-spacing-3xl) 10.5px var(--wui-spacing-3xl);
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-lg {
    padding: var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-l);
    letter-spacing: var(--wui-letter-spacing-medium-title);
    font-size: var(--wui-font-size-medium-title);
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    color: var(--wui-color-fg-100);
    height: 64px;
  }

  .wui-padding-right-xs {
    padding-right: var(--wui-spacing-xs);
  }

  .wui-padding-right-s {
    padding-right: var(--wui-spacing-s);
  }

  .wui-padding-right-m {
    padding-right: var(--wui-spacing-m);
  }

  .wui-padding-right-l {
    padding-right: var(--wui-spacing-l);
  }

  .wui-padding-right-xl {
    padding-right: var(--wui-spacing-xl);
  }

  .wui-padding-right-2xl {
    padding-right: var(--wui-spacing-2xl);
  }

  .wui-padding-right-3xl {
    padding-right: var(--wui-spacing-3xl);
  }

  .wui-padding-right-4xl {
    padding-right: var(--wui-spacing-4xl);
  }

  .wui-padding-right-5xl {
    padding-right: var(--wui-spacing-5xl);
  }

  wui-icon + .wui-size-lg,
  wui-loading-spinner + .wui-size-lg {
    padding-left: 50px;
  }

  wui-icon[data-input='lg'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-m) 17.25px var(--wui-spacing-m);
  }
  wui-icon + .wui-size-mdl,
  wui-loading-spinner + .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-3xl) 17.25px 40px;
  }
  wui-icon[data-input='mdl'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`;var Re=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let je=class extends e{constructor(){super(...arguments),this.inputElementRef=ue(),this.size="md",this.disabled=!1,this.placeholder="",this.type="text",this.value=""}render(){const t=`wui-padding-right-${this.inputRightPadding}`,e=`wui-size-${this.size}`,o={[e]:!0,[t]:Boolean(this.inputRightPadding)};return i`${this.templateIcon()}
      <input
        data-testid="wui-input-text"
        ${we(this.inputElementRef)}
        class=${l(o)}
        type=${this.type}
        enterkeyhint=${z(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
        .value=${this.value||""}
        tabindex=${z(this.tabIdx)}
      />
      <slot></slot>`}templateIcon(){return this.icon?i`<wui-icon
        data-input=${this.size}
        size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}dispatchInputChangeEvent(){var t;this.dispatchEvent(new CustomEvent("inputChange",{detail:null==(t=this.inputElementRef.value)?void 0:t.value,bubbles:!0,composed:!0}))}};je.styles=[d,c,Ce],Re([a()],je.prototype,"size",void 0),Re([a()],je.prototype,"icon",void 0),Re([a({type:Boolean})],je.prototype,"disabled",void 0),Re([a()],je.prototype,"placeholder",void 0),Re([a()],je.prototype,"type",void 0),Re([a()],je.prototype,"keyHint",void 0),Re([a()],je.prototype,"value",void 0),Re([a()],je.prototype,"inputRightPadding",void 0),Re([a()],je.prototype,"tabIdx",void 0),je=Re([T("wui-input-text")],je);const Oe=t`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;let Ie=class extends e{constructor(){super(...arguments),this.inputComponentRef=ue()}render(){return i`
      <wui-input-text
        ${we(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){const t=this.inputComponentRef.value,e=null==t?void 0:t.inputElementRef.value;e&&(e.value="",e.focus(),e.dispatchEvent(new Event("input")))}};Ie.styles=[d,Oe],Ie=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}([T("wui-search-bar")],Ie);const Se=o`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`,Te=t`
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
`;var ze=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Pe=class extends e{constructor(){super(...arguments),this.type="wallet"}render(){return i`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?i` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${Se}`:i`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};Pe.styles=[d,c,Te],ze([a()],Pe.prototype,"type",void 0),Pe=ze([T("wui-card-select-loader")],Pe);const We=t`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var Ee=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Le=class extends e{render(){return this.style.cssText=`\n      grid-template-rows: ${this.gridTemplateRows};\n      grid-template-columns: ${this.gridTemplateColumns};\n      justify-items: ${this.justifyItems};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      align-content: ${this.alignContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&P.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&P.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&P.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&P.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&P.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&P.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&P.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&P.getSpacingStyles(this.margin,3)};\n    `,i`<slot></slot>`}};Le.styles=[d,We],Ee([a()],Le.prototype,"gridTemplateRows",void 0),Ee([a()],Le.prototype,"gridTemplateColumns",void 0),Ee([a()],Le.prototype,"justifyItems",void 0),Ee([a()],Le.prototype,"alignItems",void 0),Ee([a()],Le.prototype,"justifyContent",void 0),Ee([a()],Le.prototype,"alignContent",void 0),Ee([a()],Le.prototype,"columnGap",void 0),Ee([a()],Le.prototype,"rowGap",void 0),Ee([a()],Le.prototype,"gap",void 0),Ee([a()],Le.prototype,"padding",void 0),Ee([a()],Le.prototype,"margin",void 0),Le=Ee([T("wui-grid")],Le);const De=t`
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
`;var Be=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Ae=class extends e{constructor(){super(),this.observer=new IntersectionObserver((()=>{})),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver((t=>{t.forEach((t=>{t.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1}))}),{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){var t,e;const o="certified"===(null==(t=this.wallet)?void 0:t.badge_type);return i`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${z(o?"certified":void 0)}
            >${null==(e=this.wallet)?void 0:e.name}</wui-text
          >
          ${o?i`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){var t,e;return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():i`
      <wui-wallet-image
        size="md"
        imageSrc=${z(this.imageSrc)}
        name=${null==(t=this.wallet)?void 0:t.name}
        .installed=${null==(e=this.wallet)?void 0:e.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return i`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=f.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await f.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};Ae.styles=De,Be([n()],Ae.prototype,"visible",void 0),Be([n()],Ae.prototype,"imageSrc",void 0),Be([n()],Ae.prototype,"imageLoading",void 0),Be([a()],Ae.prototype,"wallet",void 0),Ae=Be([T("w3m-all-wallets-list-item")],Ae);const _e=t`
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
`;var Ue=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};const qe="local-paginator";let Ne=class extends e{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!p.state.wallets.length,this.wallets=p.state.wallets,this.recommended=p.state.recommended,this.featured=p.state.featured,this.filteredWallets=p.state.filteredWallets,this.unsubscribe.push(p.subscribeKey("wallets",(t=>this.wallets=t)),p.subscribeKey("recommended",(t=>this.recommended=t)),p.subscribeKey("featured",(t=>this.featured=t)),p.subscribeKey("filteredWallets",(t=>this.filteredWallets=t)))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){var t;this.unsubscribe.forEach((t=>t())),null==(t=this.paginationObserver)||t.disconnect()}render(){return i`
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
    `}async initialFetch(){var t;this.loading=!0;const e=null==(t=this.shadowRoot)?void 0:t.querySelector("wui-grid");e&&(await p.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(t,e){return[...Array(t)].map((()=>i`
        <wui-card-select-loader type="wallet" id=${z(e)}></wui-card-select-loader>
      `))}walletsTemplate(){var t;const e=(null==(t=this.filteredWallets)?void 0:t.length)>0?w.uniqueBy([...this.featured,...this.recommended,...this.filteredWallets],"id"):w.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id");return $.markWalletsAsInstalled(e).map((t=>i`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(t)}
          .wallet=${t}
        ></w3m-all-wallets-list-item>
      `))}paginationLoaderTemplate(){const{wallets:t,recommended:e,featured:i,count:o}=p.state,r=window.innerWidth<352?3:4,a=t.length+e.length;let n=Math.ceil(a/r)*r-a+r;return n-=t.length?i.length%r:0,0===o&&i.length>0?null:0===o||[...i,...t,...e].length<o?this.shimmerTemplate(n,qe):null}createPaginationObserver(){var t;const e=null==(t=this.shadowRoot)?void 0:t.querySelector(`#${qe}`);e&&(this.paginationObserver=new IntersectionObserver((([t])=>{if((null==t?void 0:t.isIntersecting)&&!this.loading){const{page:t,count:e,wallets:i}=p.state;i.length<e&&p.fetchWalletsByPage({page:t+1})}})),this.paginationObserver.observe(e))}onConnectWallet(t){u.selectWalletConnector(t)}};Ne.styles=_e,Ue([n()],Ne.prototype,"loading",void 0),Ue([n()],Ne.prototype,"wallets",void 0),Ue([n()],Ne.prototype,"recommended",void 0),Ue([n()],Ne.prototype,"featured",void 0),Ue([n()],Ne.prototype,"filteredWallets",void 0),Ne=Ue([T("w3m-all-wallets-list")],Ne);const Me=t`
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
`;var Ve=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Ke=class extends e{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?i`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){this.query.trim()===this.prevQuery.trim()&&this.badge===this.prevBadge||(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await p.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:t}=p.state,e=$.markWalletsAsInstalled(t);return t.length?i`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${e.map((t=>i`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(t)}
              .wallet=${t}
              data-testid="wallet-search-item-${t.id}"
            ></w3m-all-wallets-list-item>
          `))}
      </wui-grid>
    `:i`
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
      `}onConnectWallet(t){u.selectWalletConnector(t)}};Ke.styles=Me,Ve([n()],Ke.prototype,"loading",void 0),Ve([a()],Ke.prototype,"query",void 0),Ve([a()],Ke.prototype,"badge",void 0),Ke=Ve([T("w3m-all-wallets-search")],Ke);var Ge=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let He=class extends e{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=w.debounce((t=>{this.search=t}))}render(){const t=this.search.length>=2;return i`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?i`<w3m-all-wallets-search
            query=${this.search}
            badge=${z(this.badge)}
          ></w3m-all-wallets-search>`:i`<w3m-all-wallets-list badge=${z(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onClick(){"certified"!==this.badge?(this.badge="certified",j.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return w.isMobile()?i`
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
      `:null}onWalletConnectQr(){b.push("ConnectingWalletConnect")}};Ge([n()],He.prototype,"search",void 0),Ge([n()],He.prototype,"badge",void 0),He=Ge([T("w3m-all-wallets-view")],He);const Fe=t`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var Xe=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n};let Qe=class extends e{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return i`
      <button
        ?disabled=${!!this.loading||Boolean(this.disabled)}
        data-loading=${this.loading}
        data-iconvariant=${z(this.iconVariant)}
        tabindex=${z(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if("image"===this.variant&&this.imageSrc)return i`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if("square"===this.iconVariant&&this.icon&&"icon"===this.variant)return i`<wui-icon name=${this.icon}></wui-icon>`;if("icon"===this.variant&&this.icon&&this.iconVariant){const t=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",e="square-blue"===this.iconVariant?"mdl":"md",o=this.iconSize?this.iconSize:e;return i`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${o}
          background="transparent"
          iconColor=${t}
          backgroundColor=${t}
          size=${e}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?i`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:i``}chevronTemplate(){return this.chevron?i`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};Qe.styles=[d,c,Fe],Xe([a()],Qe.prototype,"icon",void 0),Xe([a()],Qe.prototype,"iconSize",void 0),Xe([a()],Qe.prototype,"tabIdx",void 0),Xe([a()],Qe.prototype,"variant",void 0),Xe([a()],Qe.prototype,"iconVariant",void 0),Xe([a({type:Boolean})],Qe.prototype,"disabled",void 0),Xe([a()],Qe.prototype,"imageSrc",void 0),Xe([a()],Qe.prototype,"alt",void 0),Xe([a({type:Boolean})],Qe.prototype,"chevron",void 0),Xe([a({type:Boolean})],Qe.prototype,"loading",void 0),Qe=Xe([T("wui-list-item")],Qe);let Ye=class extends e{constructor(){var t;super(...arguments),this.wallet=null==(t=b.state.data)?void 0:t.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return i`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){var t;return(null==(t=this.wallet)?void 0:t.chrome_store)?i`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){var t;return(null==(t=this.wallet)?void 0:t.app_store)?i`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){var t;return(null==(t=this.wallet)?void 0:t.play_store)?i`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){var t;return(null==(t=this.wallet)?void 0:t.homepage)?i`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){var t;(null==(t=this.wallet)?void 0:t.chrome_store)&&w.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){var t;(null==(t=this.wallet)?void 0:t.app_store)&&w.openHref(this.wallet.app_store,"_blank")}onPlayStore(){var t;(null==(t=this.wallet)?void 0:t.play_store)&&w.openHref(this.wallet.play_store,"_blank")}onHomePage(){var t;(null==(t=this.wallet)?void 0:t.homepage)&&w.openHref(this.wallet.homepage,"_blank")}};Ye=function(t,e,i,o){var r,a=arguments.length,n=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(n=(a<3?r(n):a>3?r(e,i,n):r(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}([T("w3m-downloads-view")],Ye);export{He as W3mAllWalletsView,de as W3mConnectingWcBasicView,Ye as W3mDownloadsView};
