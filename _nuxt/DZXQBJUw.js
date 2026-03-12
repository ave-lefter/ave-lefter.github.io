import{dO as e,dL as t,bC as n,bJ as s,bH as a,bz as r,bN as o,bG as i,bP as c,bQ as u,bR as m,bq as p,bu as h,bF as d,bv as g,dM as l,by as y}from"./D6y-ViDA.js";import{r as w}from"./8ReBD8jy.js";import{c as x}from"./BqICjlzW.js";import"./BrbFNUz2.js";import"./Bia0ufMq.js";import"./Bnk68-zm.js";import"./C7yOXWF_.js";import"./D6omKXlF.js";import"./CYU1QoPF.js";import"./DbAB4eZS.js";import"./CevG08QP.js";import"./C1IbZtR7.js";import"./DheuQlak.js";const f={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};class P extends Error{}async function I(e,n){const s=`https://rpc.walletconnect.org/v1/json-rpc?projectId=${t.getSnapshot().projectId}&source=fund-wallet`,{sdkType:a,sdkVersion:r,projectId:o}=t.getSnapshot(),i={jsonrpc:"2.0",id:1,method:e,params:{...n||{},st:a,sv:r,projectId:o}},c=await fetch(s,{method:"POST",body:JSON.stringify(i),headers:{"Content-Type":"application/json"}}),u=await c.json();if(u.error)throw new P(u.error.message);return u}function b(t,n){const{chainNamespace:s,chainId:a}=e.parseCaipNetworkId(t),r=f[s];if(!r)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${s}`);let o=r.native.assetNamespace,i=r.native.assetReference;"native"!==n&&(o=r.defaultTokenNamespace,i=n);return`${`${s}:${a}`}/${o}:${i}`}const k={paymentAsset:{network:"eip155:1",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:0}},amount:0,tokenAmount:0,tokenPrice:null,priceLoading:!1,error:null,exchanges:[],isLoading:!1,currentPayment:void 0,isPaymentInProgress:!1,paymentId:""},v=m(k),E={state:v,subscribe:e=>u(v,()=>e(v)),subscribeKey:(e,t)=>c(v,e,t),resetState(){Object.assign(v,{...k})},async fetchTokenPrice(){v.priceLoading=!0;const e=o(),t=await i.fetchTokenPrice({addresses:[e]});v.tokenPrice=t.fungibles?.[0]?.price||null,v.priceLoading=!1},getTokenAmount(){if(!v.tokenPrice)throw new Error("Cannot get token price");const e=new Intl.NumberFormat("en-US",{minimumFractionDigits:0,maximumFractionDigits:4}).format(v.amount/v.tokenPrice);return Number(e)},setAmount(e){v.amount=e,v.tokenPrice&&(v.tokenAmount=this.getTokenAmount())},setPaymentAsset(e){v.paymentAsset=e},async fetchExchanges(){try{v.isLoading=!0;const e=await async function(e){return(await I("reown_getExchanges",e)).result}({page:0,asset:b(v.paymentAsset.network,v.paymentAsset.asset),amount:v.amount.toString()});v.exchanges=e.exchanges.slice(0,2)}catch(e){throw r.showError("Unable to get exchanges"),new Error("Unable to get exchanges")}finally{v.isLoading=!1}},async getPayUrl(e,t){try{const s=Number(t.amount),a=await async function(e){return(await I("reown_getExchangePayUrl",e)).result}({exchangeId:e,asset:b(t.network,t.asset),amount:s.toString(),recipient:`${t.network}:${t.recipient}`});return n.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:e},source:"fund-from-exchange",headless:!1}}),a}catch(s){if(s instanceof Error&&s.message.includes("is not supported"))throw new Error("Asset not supported");throw new Error(s.message)}},async handlePayWithExchange(e){try{if(!s.state.address)throw new Error("No account connected");v.isPaymentInProgress=!0,v.paymentId=crypto.randomUUID(),v.currentPayment={type:"exchange",exchangeId:e};const{network:t,asset:n}=v.paymentAsset,r={network:t,asset:n,amount:v.tokenAmount,recipient:s.state.address},o=await this.getPayUrl(e,r);if(!o)throw new Error("Unable to initiate payment");v.currentPayment.sessionId=o.sessionId,v.currentPayment.status="IN_PROGRESS",v.currentPayment.exchangeId=e,a.openHref(o.url,"_blank","popup=yes,width=480,height=720,noopener,noreferrer")}catch(t){v.error="Unable to initiate payment",r.showError(v.error)}},async waitUntilComplete({exchangeId:e,sessionId:t,paymentId:n,retries:s=20}){const a=await this.getBuyStatus(e,t,n);if("SUCCESS"===a.status||"FAILED"===a.status)return a;if(0===s)throw new Error("Unable to get deposit status");return await new Promise(e=>{setTimeout(e,5e3)}),this.waitUntilComplete({exchangeId:e,sessionId:t,paymentId:n,retries:s-1})},async getBuyStatus(e,t,a){try{if(!v.currentPayment)throw new Error("No current payment");const r=await async function(e){return(await I("reown_getExchangeBuyStatus",e)).result}({sessionId:t,exchangeId:e});return v.currentPayment.status=r.status,"SUCCESS"!==r.status&&"FAILED"!==r.status||(v.currentPayment.result=r.txHash,v.isPaymentInProgress=!1,n.sendEvent({type:"track",event:"SUCCESS"===r.status?"PAY_SUCCESS":"PAY_ERROR",properties:{source:"fund-from-exchange",paymentId:a,configuration:{network:v.paymentAsset.network,asset:v.paymentAsset.asset,recipient:s.state.address||"",amount:v.amount},currentPayment:{type:"exchange",exchangeId:v.currentPayment?.exchangeId,sessionId:v.currentPayment?.sessionId,result:r.txHash}}})),r}catch(r){return{status:"UNKNOWN",txHash:""}}},reset(){v.currentPayment=void 0,v.isPaymentInProgress=!1,v.paymentId="",v.paymentAsset={network:"eip155:1",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:0}},v.amount=0,v.tokenAmount=0,v.tokenPrice=null,v.priceLoading=!1,v.error=null,v.exchanges=[],v.isLoading=!1}},A=p`
  .amount-input-container {
    border-radius: var(--wui-border-radius-m);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom: 1px solid var(--wui-color-gray-glass-010);
    background-color: var(--wui-color-bg-100);
  }

  .container {
    background-color: var(--wui-color-bg-125);
  }
`;var S=function(e,t,n,s){var a,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,n,s);else for(var i=e.length-1;i>=0;i--)(a=e[i])&&(o=(r<3?a(o):r>3?a(t,n,o):a(t,n))||o);return r>3&&o&&Object.defineProperty(t,n,o),o};const C=[10,50,100];let $=class extends h{constructor(){super(),this.unsubscribe=[],this.network=d.state.activeCaipNetwork,this.exchanges=E.state.exchanges,this.isLoading=E.state.isLoading,this.amount=E.state.amount,this.tokenAmount=E.state.tokenAmount,this.priceLoading=E.state.priceLoading,this.isPaymentInProgress=E.state.isPaymentInProgress,this.currentPayment=E.state.currentPayment,this.paymentId=E.state.paymentId,this.unsubscribe.push(E.subscribe(e=>{this.exchanges=e.exchanges,this.isLoading=e.isLoading,this.amount=e.amount,this.tokenAmount=e.tokenAmount,this.priceLoading=e.priceLoading,this.paymentId=e.paymentId,this.isPaymentInProgress=e.isPaymentInProgress,this.currentPayment=e.currentPayment;e.isPaymentInProgress&&e.currentPayment?.exchangeId&&e.currentPayment?.sessionId&&e.paymentId&&this.handlePaymentInProgress()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),E.reset()}firstUpdated(){E.fetchExchanges(),E.fetchTokenPrice()}render(){return g`
      <wui-flex flexDirection="column" gap="xs" class="container">
        ${this.amountInputTemplate()} ${this.exchangesTemplate()}
      </wui-flex>
    `}exchangesTemplate(){return g`
      <wui-flex
        flexDirection="column"
        gap="xs"
        .padding=${["xs","s","s","s"]}
        class="exchanges-container"
      >
        ${this.exchanges.map(e=>g`<wui-list-item
              @click=${()=>this.onExchangeClick(e)}
              chevron
              variant="image"
              imageSrc=${e.imageUrl}
              ?loading=${this.isLoading}
              ?disabled=${!this.amount}
            >
              <wui-text variant="paragraph-500" color="fg-200">
                Deposit from ${e.name}
              </wui-text>
            </wui-list-item>`)}
      </wui-flex>
    `}amountInputTemplate(){return g`
      <wui-flex flexDirection="column" gap="s" .padding=${["0","s","s","s"]} class="amount-input-container">
        <wui-flex justifyContent="space-between">
          <wui-text variant="paragraph-500" color="fg-200">Asset</wui-text>
          <wui-chip-button
            data-testid="deposit-from-exchange-asset-button"
            text=${this.network?.nativeCurrency.symbol||""}
            imageSrc=${l.getNetworkImage(this.network)}
            size="sm"
            variant="gray"
            icon=${null}
          ></wui-chip-button>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" justifyContent="center">
          <wui-flex alignItems="center" gap="4xs">
            <wui-text variant="2xl-500" color="fg-200">${this.amount}</wui-text>
            <wui-text variant="paragraph-500" color="fg-200">USD</wui-text>
          </wui-flex>
          ${this.tokenAmountTemplate()}
          </wui-flex>
          <wui-flex justifyContent="space-between" gap="xs">
            ${C.map(e=>g`<wui-button @click=${()=>this.onPresetAmountClick(e)} variant=${this.amount===e?"accent":"shade"} size="sm" fullWidth>$${e}</wui-button>`)}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}tokenAmountTemplate(){return this.priceLoading?g`<wui-shimmer
        width="65px"
        height="20px"
        borderRadius="xxs"
        variant="light"
      ></wui-shimmer>`:g`
      <wui-text variant="paragraph-500" color="fg-200">
        ${this.tokenAmount} ${this.network?.nativeCurrency.symbol}
      </wui-text>
    `}async onExchangeClick(e){this.amount&&await E.handlePayWithExchange(e.id)}handlePaymentInProgress(){this.isPaymentInProgress&&this.currentPayment?.exchangeId&&this.currentPayment?.sessionId&&this.paymentId&&(r.showLoading("Deposit in progress..."),y.replace("Account"),E.waitUntilComplete({exchangeId:this.currentPayment.exchangeId,sessionId:this.currentPayment.sessionId,paymentId:this.paymentId}).then(e=>{"SUCCESS"===e.status?r.showSuccess("Deposit completed"):"FAILED"===e.status&&r.showError("Deposit failed")}))}onPresetAmountClick(e){E.setAmount(e)}};$.styles=A,S([w()],$.prototype,"network",void 0),S([w()],$.prototype,"exchanges",void 0),S([w()],$.prototype,"isLoading",void 0),S([w()],$.prototype,"amount",void 0),S([w()],$.prototype,"tokenAmount",void 0),S([w()],$.prototype,"priceLoading",void 0),S([w()],$.prototype,"isPaymentInProgress",void 0),S([w()],$.prototype,"currentPayment",void 0),S([w()],$.prototype,"paymentId",void 0),$=S([x("w3m-deposit-from-exchange-view")],$);export{$ as W3mDepositFromExchangeView};
