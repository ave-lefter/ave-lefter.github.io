import{dO as e,dR as t,bl as a,bj as n,bf as s,ha as i,be as r,hb as o,bb as c,bg as l,bd as u,bn as d,bc as m,cc as p,bt as h,bu as w,b3 as y,b7 as g,b8 as f,dQ as x,bs as v,dP as b}from"./DvO0AinD.js";import{r as P}from"./B_ot7u58.js";import{o as I}from"./4RH0AGma.js";import{c as E}from"./Bo-PKsy5.js";import"./knB1Rbyr.js";import"./1TgTHKeV.js";import"./BKiGSG7i.js";import"./8LK8nPcT.js";import"./BRI2zjzy.js";import"./FzsKt89_.js";import"./QP_KuhpX.js";import"./BvvJ-7-A.js";import"./B6anJ0ED.js";import"./DS_txzci.js";import"./DCLEmx3U.js";const S="INVALID_PAYMENT_CONFIG",A="INVALID_RECIPIENT",N="INVALID_ASSET",C="INVALID_AMOUNT",k="UNKNOWN_ERROR",T="UNABLE_TO_INITIATE_PAYMENT",U="INVALID_CHAIN_NAMESPACE",D="GENERIC_PAYMENT_ERROR",_="UNABLE_TO_GET_EXCHANGES",R="ASSET_NOT_SUPPORTED",O="UNABLE_TO_GET_PAY_URL",$="UNABLE_TO_GET_BUY_STATUS",M={[S]:"Invalid payment configuration",[A]:"Invalid recipient address",[N]:"Invalid asset specified",[C]:"Invalid payment amount",[k]:"Unknown payment error occurred",[T]:"Unable to initiate payment",[U]:"Invalid chain namespace",[D]:"Unable to process payment",[_]:"Unable to get exchanges",[R]:"Asset not supported by the selected exchange",[O]:"Unable to get payment URL",[$]:"Unable to get buy status"};class L extends Error{get message(){return M[this.code]}constructor(e,t){super(M[e]),this.name="AppKitPayError",this.code=e,this.details=t,Error.captureStackTrace&&Error.captureStackTrace(this,L)}}class j extends Error{}async function W(t,a){const n=`https://rpc.walletconnect.org/v1/json-rpc?projectId=${e.getSnapshot().projectId}`,{sdkType:s,sdkVersion:i,projectId:r}=e.getSnapshot(),o={jsonrpc:"2.0",id:1,method:t,params:{...a||{},st:s,sv:i,projectId:r}},c=await fetch(n,{method:"POST",body:JSON.stringify(o),headers:{"Content-Type":"application/json"}}),l=await c.json();if(l.error)throw new j(l.error.message);return l}async function Y(e){return(await W("reown_getExchanges",e)).result}const F=["eip155","solana"],K={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function z(e,a){const{chainNamespace:n,chainId:s}=t.parseCaipNetworkId(e),i=K[n];if(!i)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${n}`);let r=i.native.assetNamespace,o=i.native.assetReference;"native"!==a&&(r=i.defaultTokenNamespace,o=a);return`${`${n}:${s}`}/${r}:${o}`}const B="unknown",G=c({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),H={state:G,subscribe:e=>w(G,()=>e(G)),subscribeKey:(e,t)=>h(G,e,t),async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.subscribeEvents(),this.initializeAnalytics(),G.isConfigured=!0,l.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:G.exchanges,configuration:{network:G.paymentAsset.network,asset:G.paymentAsset.asset,recipient:G.recipient,amount:G.amount}}}),await p.open({view:"Pay"})},resetState(){G.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},G.recipient="0x0",G.amount=0,G.isConfigured=!1,G.error=null,G.isPaymentInProgress=!1,G.isLoading=!1,G.currentPayment=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new L(S);try{G.paymentAsset=e.paymentAsset,G.recipient=e.recipient,G.amount=e.amount,G.openInNewTab=e.openInNewTab??!0,G.redirectUrl=e.redirectUrl,G.payWithExchange=e.payWithExchange,G.error=null}catch(t){throw new L(S,t.message)}},getPaymentAsset:()=>G.paymentAsset,getExchanges:()=>G.exchanges,async fetchExchanges(){try{G.isLoading=!0;const e=await Y({page:0,asset:z(G.paymentAsset.network,G.paymentAsset.asset),amount:G.amount.toString()});G.exchanges=e.exchanges.slice(0,2)}catch(e){throw u.showError(M.UNABLE_TO_GET_EXCHANGES),new L(_)}finally{G.isLoading=!1}},async getAvailableExchanges(e){var t;try{const a=(null==e?void 0:e.asset)&&(null==e?void 0:e.network)?z(e.network,e.asset):void 0;return await Y({page:(null==e?void 0:e.page)??0,asset:a,amount:null==(t=null==e?void 0:e.amount)?void 0:t.toString()})}catch(a){throw new L(_)}},async getPayUrl(e,t,a=!1){try{const n=Number(t.amount),s=await async function(e){return(await W("reown_getExchangePayUrl",e)).result}({exchangeId:e,asset:z(t.network,t.asset),amount:n.toString(),recipient:`${t.network}:${t.recipient}`});return l.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:n},currentPayment:{type:"exchange",exchangeId:e},headless:a}}),a&&(this.initiatePayment(),l.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:G.paymentId||B,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:n},currentPayment:{type:"exchange",exchangeId:e}}})),s}catch(n){if(n instanceof Error&&n.message.includes("is not supported"))throw new L(R);throw new Error(n.message)}},async openPayUrl(e,t,n=!1){try{const s=await this.getPayUrl(e.exchangeId,t,n);if(!s)throw new L(O);const i=e.openInNewTab??!0?"_blank":"_self";return a.openHref(s.url,i),s}catch(s){throw G.error=s instanceof L?s.message:M.GENERIC_PAYMENT_ERROR,new L(O)}},subscribeEvents(){G.isConfigured||(r.subscribeKey("connections",e=>{e.size>0&&this.handlePayment()}),d.subscribeKey("caipAddress",e=>{const t=r.hasAnyConnection(s.CONNECTOR_ID.WALLET_CONNECT);e&&(t?setTimeout(()=>{this.handlePayment()},100):this.handlePayment())}))},async handlePayment(){G.currentPayment={type:"wallet",status:"IN_PROGRESS"};const e=d.state.caipAddress;if(!e)return;const{chainId:c,address:l}=t.parseCaipAddress(e),m=n.state.activeChain;if(!l||!c||!m)return;if(!i.getProvider(m))return;const h=n.state.activeCaipNetwork;if(h&&!G.isPaymentInProgress)try{this.initiatePayment();const e=n.getAllRequestedCaipNetworks(),t=n.getAllApprovedCaipNetworkIds();switch(await async function(e){const{paymentAssetNetwork:t,activeCaipNetwork:s,approvedCaipNetworkIds:i,requestedCaipNetworks:r}=e,o=a.sortRequestedNetworks(i,r).find(e=>e.caipNetworkId===t);if(!o)throw new L(S);if(o.caipNetworkId===s.caipNetworkId)return;const c=n.getNetworkProp("supportsAllNetworks",o.chainNamespace);if(!(null==i?void 0:i.includes(o.caipNetworkId))&&!c)throw new L(S);try{await n.switchActiveNetwork(o)}catch(l){throw new L(D,l)}}({paymentAssetNetwork:G.paymentAsset.network,activeCaipNetwork:h,approvedCaipNetworkIds:t,requestedCaipNetworks:e}),await p.open({view:"PayLoading"}),m){case s.CHAIN.EVM:"native"===G.paymentAsset.asset&&(G.currentPayment.result=await async function(e,t,a){var n;if(t!==s.CHAIN.EVM)throw new L(U);if(!a.fromAddress)throw new L(S,"fromAddress is required for native EVM payments.");const i="string"==typeof a.amount?parseFloat(a.amount):a.amount;if(isNaN(i))throw new L(S);const o=(null==(n=e.metadata)?void 0:n.decimals)??18,c=r.parseUnits(i.toString(),o);if("bigint"!=typeof c)throw new L(D);return await r.sendTransaction({chainNamespace:t,to:a.recipient,address:a.fromAddress,value:c,data:"0x"})??void 0}(G.paymentAsset,m,{recipient:G.recipient,amount:G.amount,fromAddress:l})),G.paymentAsset.asset.startsWith("0x")&&(G.currentPayment.result=await async function(e,t){if(!t.fromAddress)throw new L(S,"fromAddress is required for ERC20 EVM payments.");const a=e.asset,n=t.recipient,i=Number(e.metadata.decimals),c=r.parseUnits(t.amount.toString(),i);if(void 0===c)throw new L(D);return await r.writeContract({fromAddress:t.fromAddress,tokenAddress:a,args:[n,c],method:"transfer",abi:o.getERC20Abi(a),chainNamespace:s.CHAIN.EVM})??void 0}(G.paymentAsset,{recipient:G.recipient,amount:G.amount,fromAddress:l})),G.currentPayment.status="SUCCESS";break;case s.CHAIN.SOLANA:G.currentPayment.result=await async function(e,t){if(e!==s.CHAIN.SOLANA)throw new L(U);if(!t.fromAddress)throw new L(S,"fromAddress is required for Solana payments.");const a="string"==typeof t.amount?parseFloat(t.amount):t.amount;if(isNaN(a)||a<=0)throw new L(S,"Invalid payment amount.");try{if(!i.getProvider(e))throw new L(D,"No Solana provider available.");const n=await r.sendTransaction({chainNamespace:s.CHAIN.SOLANA,to:t.recipient,value:a,tokenMint:t.tokenMint});if(!n)throw new L(D,"Transaction failed.");return n}catch(n){if(n instanceof L)throw n;throw new L(D,`Solana payment failed: ${n}`)}}(m,{recipient:G.recipient,amount:G.amount,fromAddress:l,tokenMint:"native"===G.paymentAsset.asset?void 0:G.paymentAsset.asset}),G.currentPayment.status="SUCCESS";break;default:throw new L(U)}}catch(w){G.error=w instanceof L?w.message:M.GENERIC_PAYMENT_ERROR,G.currentPayment.status="FAILED",u.showError(G.error)}finally{G.isPaymentInProgress=!1}},getExchangeById:e=>G.exchanges.find(t=>t.id===e),validatePayConfig(e){const{paymentAsset:t,recipient:a,amount:n}=e;if(!t)throw new L(S);if(!a)throw new L(A);if(!t.asset)throw new L(N);if(null==n||n<=0)throw new L(C)},handlePayWithWallet(){const e=d.state.caipAddress;if(!e)return void m.push("Connect");const{chainId:a,address:s}=t.parseCaipAddress(e),i=n.state.activeChain;s&&a&&i?this.handlePayment():m.push("Connect")},async handlePayWithExchange(e){try{G.currentPayment={type:"exchange",exchangeId:e};const{network:t,asset:a}=G.paymentAsset,n={network:t,asset:a,amount:G.amount,recipient:G.recipient},s=await this.getPayUrl(e,n);if(!s)throw new L(T);return G.currentPayment.sessionId=s.sessionId,G.currentPayment.status="IN_PROGRESS",G.currentPayment.exchangeId=e,this.initiatePayment(),{url:s.url,openInNewTab:G.openInNewTab}}catch(t){return G.error=t instanceof L?t.message:M.GENERIC_PAYMENT_ERROR,G.isPaymentInProgress=!1,u.showError(G.error),null}},async getBuyStatus(e,t){var a,n;try{const s=await async function(e){return(await W("reown_getExchangeBuyStatus",e)).result}({sessionId:t,exchangeId:e});return"SUCCESS"!==s.status&&"FAILED"!==s.status||l.sendEvent({type:"track",event:"SUCCESS"===s.status?"PAY_SUCCESS":"PAY_ERROR",properties:{source:"pay",paymentId:G.paymentId||B,configuration:{network:G.paymentAsset.network,asset:G.paymentAsset.asset,recipient:G.recipient,amount:G.amount},currentPayment:{type:"exchange",exchangeId:null==(a=G.currentPayment)?void 0:a.exchangeId,sessionId:null==(n=G.currentPayment)?void 0:n.sessionId,result:s.txHash}}}),s}catch(s){throw new L($)}},async updateBuyStatus(e,t){try{const a=await this.getBuyStatus(e,t);G.currentPayment&&(G.currentPayment.status=a.status,G.currentPayment.result=a.txHash),"SUCCESS"!==a.status&&"FAILED"!==a.status||(G.isPaymentInProgress=!1)}catch(a){throw new L($)}},initiatePayment(){G.isPaymentInProgress=!0,G.paymentId=crypto.randomUUID()},initializeAnalytics(){G.analyticsSet||(G.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{var t;if((null==(t=G.currentPayment)?void 0:t.status)&&"UNKNOWN"!==G.currentPayment.status){const e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[G.currentPayment.status];l.sendEvent({type:"track",event:e,properties:{source:"pay",paymentId:G.paymentId||B,configuration:{network:G.paymentAsset.network,asset:G.paymentAsset.asset,recipient:G.recipient,amount:G.amount},currentPayment:{type:G.currentPayment.type,exchangeId:G.currentPayment.exchangeId,sessionId:G.currentPayment.sessionId,result:G.currentPayment.result}}})}}))}},V=y`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  .token-display {
    padding: var(--wui-spacing-s) var(--wui-spacing-m);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-bg-125);
    margin-top: var(--wui-spacing-s);
    margin-bottom: var(--wui-spacing-s);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--wui-spacing-xs);
  }
`;var q=function(e,t,a,n){var s,i=arguments.length,r=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(i<3?s(r):i>3?s(t,a,r):s(t,a))||r);return i>3&&r&&Object.defineProperty(t,a,r),r};let J=class extends g{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=H.state.exchanges,this.isLoading=H.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=d.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(H.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(H.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(d.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),H.fetchExchanges()}get isWalletConnected(){return"connected"===d.state.status}render(){return f`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){const e=H.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=H.state.amount.toString()}renderPayWithWallet(){return function(e){const{chainNamespace:a}=t.parseCaipNetworkId(e);return F.includes(a)}(this.networkName)?f`<wui-flex flexDirection="column" gap="s">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`:f``}renderPaymentHeader(){let e=this.networkName;if(this.networkName){const t=n.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.networkName);t&&(e=t.name)}return f`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="large-700" color="fg-100">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="xxs">
            <wui-text variant="paragraph-600" color="fg-100">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?f`
                  <wui-text variant="small-500" color="fg-200"> on ${e} </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){var e,t,a;const n=(null==(e=this.connectedWalletInfo)?void 0:e.name)||"connected wallet";return f`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        data-testid="wallet-payment-option"
      >
        <wui-flex alignItems="center" gap="s">
          <wui-wallet-image
            size="sm"
            imageSrc=${I(null==(t=this.connectedWalletInfo)?void 0:t.icon)}
            name=${I(null==(a=this.connectedWalletInfo)?void 0:a.name)}
          ></wui-wallet-image>
          <wui-text variant="paragraph-500" color="inherit">Pay with ${n}</wui-text>
        </wui-flex>
      </wui-list-item>

      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="disconnect"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return f`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="walletPlaceholder"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="paragraph-500" color="inherit">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?f`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:0===this.exchanges.length?f`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="paragraph-500" color="fg-100">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>f`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${null!==this.loadingExchangeId}
        >
          <wui-flex alignItems="center" gap="s">
            ${this.loadingExchangeId===e.id?f`<wui-loading-spinner color="accent-100" size="md"></wui-loading-spinner>`:f`<wui-wallet-image
                  size="sm"
                  imageSrc=${I(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`}
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){H.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;const t=await H.handlePayWithExchange(e);t&&(await p.open({view:"PayLoading"}),a.openHref(t.url,t.openInNewTab?"_blank":"_self"))}catch(t){u.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await r.disconnect()}catch{u.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};J.styles=V,q([P()],J.prototype,"amount",void 0),q([P()],J.prototype,"tokenSymbol",void 0),q([P()],J.prototype,"networkName",void 0),q([P()],J.prototype,"exchanges",void 0),q([P()],J.prototype,"isLoading",void 0),q([P()],J.prototype,"loadingExchangeId",void 0),q([P()],J.prototype,"connectedWalletInfo",void 0),J=q([E("w3m-pay-view")],J);const Z=y`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }
`;var X=function(e,t,a,n){var s,i=arguments.length,r=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(i<3?s(r):i>3?s(t,a,r):s(t,a))||r);return i>3&&r&&Object.defineProperty(t,a,r),r};let Q=class extends g{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=H.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return f`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){var e;switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;default:"exchange"===(null==(e=H.state.currentPayment)?void 0:e.type)?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet")}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();default:return this.loaderTemplate()}}setupExchangeSubscription(){var e;"exchange"===(null==(e=H.state.currentPayment)?void 0:e.type)&&(this.exchangeSubscription=setInterval(async()=>{var e,t,a;const n=null==(e=H.state.currentPayment)?void 0:e.exchangeId,s=null==(t=H.state.currentPayment)?void 0:t.sessionId;n&&s&&(await H.updateBuyStatus(n,s),"SUCCESS"===(null==(a=H.state.currentPayment)?void 0:a.status)&&clearInterval(this.exchangeSubscription))},4e3))}setupSubscription(){H.subscribeKey("isPaymentInProgress",e=>{var t;e||"in-progress"!==this.paymentState||(H.state.error||!(null==(t=H.state.currentPayment)?void 0:t.result)?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{"disconnected"!==r.state.status&&p.close()},3e3))}),H.subscribeKey("error",e=>{e&&"in-progress"===this.paymentState&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){const e=x.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4,a=this.getPaymentIcon();return f`
      <wui-flex justifyContent="center" alignItems="center" style="position: relative;">
        ${a?f`<wui-wallet-image size="lg" imageSrc=${a}></wui-wallet-image>`:null}
        <wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>
      </wui-flex>
    `}getPaymentIcon(){var e;const t=H.state.currentPayment;if(t){if("exchange"===t.type){const e=t.exchangeId;if(e){const t=H.getExchangeById(e);return null==t?void 0:t.imageUrl}}if("wallet"===t.type){const t=null==(e=d.state.connectedWalletInfo)?void 0:e.icon;if(t)return t;const a=n.state.activeChain;if(!a)return;const s=v.getConnectorId(a);if(!s)return;const i=v.getConnectorById(s);if(!i)return;return b.getConnectorImage(i)}}}successTemplate(){return f`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`}errorTemplate(){return f`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`}};Q.styles=Z,X([P()],Q.prototype,"loadingMessage",void 0),X([P()],Q.prototype,"subMessage",void 0),X([P()],Q.prototype,"paymentState",void 0),Q=X([E("w3m-pay-loading-view")],Q);async function ee(e){return H.handleOpenPay(e)}async function te(e,t=3e5){if(t<=0)throw new L(S,"Timeout must be greater than 0");try{await ee(e)}catch(a){if(a instanceof L)throw a;throw new L(T,a.message)}return new Promise((e,a)=>{let n=!1;const s=setTimeout(()=>{n||(n=!0,l(),a(new L(D,"Payment timeout")))},t);function i(){if(n)return;const t=H.state.currentPayment,a=H.state.error,i=H.state.isPaymentInProgress;return"SUCCESS"===(null==t?void 0:t.status)?(n=!0,l(),clearTimeout(s),void e({success:!0,result:t.result})):"FAILED"===(null==t?void 0:t.status)?(n=!0,l(),clearTimeout(s),void e({success:!1,error:a||"Payment failed"})):void(!a||i||t||(n=!0,l(),clearTimeout(s),e({success:!1,error:a})))}const r=re("currentPayment",i),o=re("error",i),c=re("isPaymentInProgress",i),l=(u=[r,o,c],()=>{u.forEach(e=>{try{e()}catch{}})});var u;i()})}function ae(){return H.getExchanges()}function ne(){var e;return null==(e=H.state.currentPayment)?void 0:e.result}function se(){return H.state.error}function ie(){return H.state.isPaymentInProgress}function re(e,t){return H.subscribeKey(e,t)}const oe={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},ce={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},le={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},ue={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},de={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},me={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},pe={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},he={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},we={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},ye={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},ge={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},fe={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},xe={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},ve={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}};export{Q as W3mPayLoadingView,J as W3mPayView,me as arbitrumUSDC,ge as arbitrumUSDT,oe as baseETH,le as baseSepoliaETH,ce as baseUSDC,ue as ethereumUSDC,we as ethereumUSDT,ae as getExchanges,ie as getIsPaymentInProgress,se as getPayError,ne as getPayResult,ee as openPay,de as optimismUSDC,ye as optimismUSDT,te as pay,pe as polygonUSDC,fe as polygonUSDT,ve as solanaSOL,he as solanaUSDC,xe as solanaUSDT};
