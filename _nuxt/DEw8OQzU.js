import{bu as e,bv as t,aW as i,bq as o}from"./D6y-ViDA.js";import{n as a,r as n,a as r}from"./8ReBD8jy.js";import{o as s}from"./C1IbZtR7.js";import{t as c,w as l,R as d,l as u,e as p,a as h,E as m,u as w,x as g,C as y,B as f,d as b,y as v,z as k,D as x,p as T,F as S,c as A,G as $,I as P,J as C,M as I,K as E,f as N,r as R,k as O,P as z,L as D,Q as U,U as W,H as j,O as B,V as F,j as L,v as q,h as _,A as M,T as H,X as V,Y as K}from"./C9CSYTGc.js";import{c as Q,n as G,U as Y}from"./B5ucxrsR.js";const X={getGasPriceInEther:(e,t)=>Number(t*e)/1e18,getGasPriceInUSD(e,t,i){const o=X.getGasPriceInEther(t,i);return c.bigNumber(e).times(o).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:i,toTokenAmount:o}){const a=c.bigNumber(e).times(t),n=c.bigNumber(o).times(i);return a.minus(n).div(a).times(100).toNumber()},getMaxSlippage(e,t){const i=c.bigNumber(e).div(100);return c.multiply(t,i).toNumber()},getProviderFee:(e,t=.0085)=>c.bigNumber(e).times(t).toString(),isInsufficientNetworkTokenForGas(e,t){const i=t||"0";return!!c.bigNumber(e).eq(0)||c.bigNumber(c.bigNumber(i)).gt(e)},isInsufficientSourceTokenForSwap(e,t,i){const o=i?.find(e=>e.address===t)?.quantity?.numeric;return c.bigNumber(o||"0").lt(e)}},Z=15e4,J={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,switchingTokens:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:T.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},ee=C({...J}),te={state:ee,subscribe:e=>P(ee,()=>e(ee)),subscribeKey:(e,t)=>$(ee,e,t),getParams(){const e=y.state.activeChain,t=y.getAccountData(e)?.caipAddress??y.state.activeCaipAddress,i=b.getPlainAddress(t),o=S(),a=A.getConnectorId(y.state.activeChain);if(!i)throw new Error("No address found to swap the tokens from.");const n=!ee.toToken?.address||!ee.toToken?.decimals,r=!ee.sourceToken?.address||!ee.sourceToken?.decimals||!c.bigNumber(ee.sourceTokenAmount).gt(0),s=!ee.sourceTokenAmount;return{networkAddress:o,fromAddress:i,fromCaipAddress:t,sourceTokenAddress:ee.sourceToken?.address,toTokenAddress:ee.toToken?.address,toTokenAmount:ee.toTokenAmount,toTokenDecimals:ee.toToken?.decimals,sourceTokenAmount:ee.sourceTokenAmount,sourceTokenDecimals:ee.sourceToken?.decimals,invalidToToken:n,invalidSourceToken:r,invalidSourceTokenAmount:s,availableToSwap:t&&!n&&!r&&!s,isAuthConnector:a===h.CONNECTOR_ID.AUTH}},async setSourceToken(e){if(!e)return ee.sourceToken=e,ee.sourceTokenAmount="",void(ee.sourceTokenPriceInUSD=0);ee.sourceToken=e,await ie.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){ee.sourceTokenAmount=e},async setToToken(e){if(!e)return ee.toToken=e,ee.toTokenAmount="",void(ee.toTokenPriceInUSD=0);ee.toToken=e,await ie.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){ee.toTokenAmount=e?c.toFixed(e,6):""},async setTokenPrice(e,t){let i=ee.tokensPriceMap[e]||0;i||(ee.loadingPrices=!0,i=await ie.getAddressPrice(e)),"sourceToken"===t?ee.sourceTokenPriceInUSD=i:"toToken"===t&&(ee.toTokenPriceInUSD=i),ee.loadingPrices&&(ee.loadingPrices=!1),ie.getParams().availableToSwap&&!ee.switchingTokens&&ie.swapTokens()},async switchTokens(){if(!ee.initializing&&ee.initialized&&!ee.switchingTokens){ee.switchingTokens=!0;try{const e=ee.toToken?{...ee.toToken}:void 0,t=ee.sourceToken?{...ee.sourceToken}:void 0,i=e&&""===ee.toTokenAmount?"1":ee.toTokenAmount;ie.setSourceTokenAmount(i),ie.setToTokenAmount(""),await ie.setSourceToken(e),await ie.setToToken(t),ee.switchingTokens=!1,ie.swapTokens()}catch(e){throw ee.switchingTokens=!1,e}}},resetState(){ee.myTokensWithBalance=J.myTokensWithBalance,ee.tokensPriceMap=J.tokensPriceMap,ee.initialized=J.initialized,ee.initializing=J.initializing,ee.switchingTokens=J.switchingTokens,ee.sourceToken=J.sourceToken,ee.sourceTokenAmount=J.sourceTokenAmount,ee.sourceTokenPriceInUSD=J.sourceTokenPriceInUSD,ee.toToken=J.toToken,ee.toTokenAmount=J.toTokenAmount,ee.toTokenPriceInUSD=J.toTokenPriceInUSD,ee.networkPrice=J.networkPrice,ee.networkTokenSymbol=J.networkTokenSymbol,ee.networkBalanceInUSD=J.networkBalanceInUSD,ee.inputError=J.inputError},resetValues(){const{networkAddress:e}=ie.getParams(),t=ee.tokens?.find(t=>t.address===e);ie.setSourceToken(t),ie.setToToken(void 0)},getApprovalLoadingState:()=>ee.loadingApprovalTransaction,clearError(){ee.transactionError=void 0},async initializeState(){if(!ee.initializing){if(ee.initializing=!0,!ee.initialized)try{await ie.fetchTokens(),ee.initialized=!0}catch(e){ee.initialized=!1,u.showError("Failed to initialize swap"),d.goBack()}ee.initializing=!1}},async fetchTokens(){const{networkAddress:e}=ie.getParams();await ie.getNetworkTokenPrice(),await ie.getMyTokensWithBalance();const t=ee.myTokensWithBalance?.find(t=>t.address===e);t&&(ee.networkTokenSymbol=t.symbol,ie.setSourceToken(t),ie.setSourceTokenAmount("0"))},async getTokenList(){const e=y.state.activeCaipNetwork?.caipNetworkId;if(ee.caipNetworkId!==e||!ee.tokens)try{ee.tokensLoading=!0;const t=await v.getTokenList(e);ee.tokens=t,ee.caipNetworkId=e,ee.popularTokens=t.sort((e,t)=>e.symbol<t.symbol?-1:e.symbol>t.symbol?1:0);const i=(e&&T.SUGGESTED_TOKENS_BY_CHAIN?.[e]||[]).map(e=>t.find(t=>t.symbol===e)).filter(e=>Boolean(e)),o=(T.SWAP_SUGGESTED_TOKENS||[]).map(e=>t.find(t=>t.symbol===e)).filter(e=>Boolean(e)).filter(e=>!i.some(t=>t.address===e.address));ee.suggestedTokens=[...i,...o]}catch(t){ee.tokens=[],ee.popularTokens=[],ee.suggestedTokens=[]}finally{ee.tokensLoading=!1}},async getAddressPrice(e){const t=ee.tokensPriceMap[e];if(t)return t;const i=await f.fetchTokenPrice({addresses:[e]}),o=i?.fungibles||[],a=[...ee.tokens||[],...ee.myTokensWithBalance||[]],n=a?.find(t=>t.address===e)?.symbol,r=o.find(e=>e.symbol.toLowerCase()===n?.toLowerCase())?.price||0,s=parseFloat(r.toString());return ee.tokensPriceMap[e]=s,s},async getNetworkTokenPrice(){const{networkAddress:e}=ie.getParams(),t=await f.fetchTokenPrice({addresses:[e]}).catch(()=>(u.showError("Failed to fetch network token price"),{fungibles:[]})),i=t.fungibles?.[0],o=i?.price.toString()||"0";ee.tokensPriceMap[e]=parseFloat(o),ee.networkTokenSymbol=i?.symbol||"",ee.networkPrice=o},async getMyTokensWithBalance(e){const t=await x.getMyTokensWithBalance({forceUpdate:e,caipNetwork:y.state.activeCaipNetwork,address:y.getAccountData()?.address}),i=v.mapBalancesToSwapTokens(t);i&&(await ie.getInitialGasPrice(),ie.setBalances(i))},setBalances(e){const{networkAddress:t}=ie.getParams(),i=y.state.activeCaipNetwork;if(!i)return;const o=e.find(e=>e.address===t);e.forEach(e=>{ee.tokensPriceMap[e.address]=e.price||0}),ee.myTokensWithBalance=e.filter(e=>e.address.startsWith(i.caipNetworkId)),ee.networkBalanceInUSD=o?c.multiply(o.quantity.numeric,o.price).toString():"0"},async getInitialGasPrice(){const e=await v.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(y.state?.activeCaipNetwork?.chainNamespace){case h.CHAIN.SOLANA:return ee.gasFee=e.standard??"0",ee.gasPriceInUSD=c.multiply(e.standard,ee.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(ee.gasFee),gasPriceInUSD:Number(ee.gasPriceInUSD)};case h.CHAIN.EVM:default:const t=e.standard??"0",i=BigInt(t),o=BigInt(Z),a=X.getGasPriceInUSD(ee.networkPrice,o,i);return ee.gasFee=t,ee.gasPriceInUSD=a,{gasPrice:i,gasPriceInUSD:a}}},async swapTokens(){const e=y.getAccountData()?.address,t=ee.sourceToken,i=ee.toToken,o=c.bigNumber(ee.sourceTokenAmount).gt(0);if(o||ie.setToTokenAmount(""),!i||!t||ee.loadingPrices||!o||!e)return;ee.loadingQuote=!0;const a=c.bigNumber(ee.sourceTokenAmount).times(10**t.decimals).round(0).toFixed(0);try{const o=await f.fetchSwapQuote({userAddress:e,from:t.address,to:i.address,gasPrice:ee.gasFee,amount:a.toString()});ee.loadingQuote=!1;const n=o?.quotes?.[0]?.toAmount;if(!n)return void k.open({displayMessage:"Incorrect amount",debugMessage:"Please enter a valid amount"},"error");const r=c.bigNumber(n).div(10**i.decimals).toString();ie.setToTokenAmount(r);ie.hasInsufficientToken(ee.sourceTokenAmount,t.address)?ee.inputError="Insufficient balance":(ee.inputError=void 0,ie.setTransactionDetails())}catch(n){const e=await v.handleSwapError(n);ee.loadingQuote=!1,ee.inputError=e||"Insufficient balance"}},async getTransaction(){const{fromCaipAddress:e,availableToSwap:t}=ie.getParams(),i=ee.sourceToken,o=ee.toToken;if(e&&t&&i&&o&&!ee.loadingQuote)try{ee.loadingBuildTransaction=!0;let t;return t=await v.fetchSwapAllowance({userAddress:e,tokenAddress:i.address,sourceTokenAmount:ee.sourceTokenAmount,sourceTokenDecimals:i.decimals})?await ie.createSwapTransaction():await ie.createAllowanceTransaction(),ee.loadingBuildTransaction=!1,ee.fetchError=!1,t}catch(a){return d.goBack(),u.showError("Failed to check allowance"),ee.loadingBuildTransaction=!1,ee.approvalTransaction=void 0,ee.swapTransaction=void 0,void(ee.fetchError=!0)}},async createAllowanceTransaction(){const{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:i}=ie.getParams();if(e&&i){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{const o=await f.generateApproveCalldata({from:t,to:i,userAddress:e}),a=b.getPlainAddress(o.tx.from);if(!a)throw new Error("SwapController:createAllowanceTransaction - address is required");const n={data:o.tx.data,to:a,gasPrice:BigInt(o.tx.eip155.gasPrice),value:BigInt(o.tx.value),toAmount:ee.toTokenAmount};return ee.swapTransaction=void 0,ee.approvalTransaction={data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount},{data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount}}catch(o){return d.goBack(),u.showError("Failed to create approval transaction"),ee.approvalTransaction=void 0,ee.swapTransaction=void 0,void(ee.fetchError=!0)}}},async createSwapTransaction(){const{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:i}=ie.getParams(),o=ee.sourceToken,a=ee.toToken;if(!(t&&i&&o&&a))return;const n=p.parseUnits(i,o.decimals)?.toString();try{const i=await f.generateSwapCalldata({userAddress:t,from:o.address,to:a.address,amount:n,disableEstimate:!0}),r=o.address===e,s=BigInt(i.tx.eip155.gas),c=BigInt(i.tx.eip155.gasPrice),l=b.getPlainAddress(i.tx.to);if(!l)throw new Error("SwapController:createSwapTransaction - address is required");const d={data:i.tx.data,to:l,gas:s,gasPrice:c,value:r?BigInt(n??"0"):BigInt("0"),toAmount:ee.toTokenAmount};return ee.gasPriceInUSD=X.getGasPriceInUSD(ee.networkPrice,s,c),ee.approvalTransaction=void 0,ee.swapTransaction=d,d}catch(r){return d.goBack(),u.showError("Failed to create transaction"),ee.approvalTransaction=void 0,ee.swapTransaction=void 0,void(ee.fetchError=!0)}},onEmbeddedWalletApprovalSuccess(){u.showLoading("Approve limit increase in your wallet"),d.replace("SwapPreview")},async sendTransactionForApproval(e){const{fromAddress:t,isAuthConnector:i}=ie.getParams();ee.loadingApprovalTransaction=!0;i?d.pushTransactionStack({onSuccess:ie.onEmbeddedWalletApprovalSuccess}):u.showLoading("Approve limit increase in your wallet");try{await p.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:h.CHAIN.EVM}),await ie.swapTokens(),await ie.getTransaction(),ee.approvalTransaction=void 0,ee.loadingApprovalTransaction=!1}catch(o){const e=o;ee.transactionError=e?.displayMessage,ee.loadingApprovalTransaction=!1,u.showError(e?.displayMessage||"Transaction error"),m.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:e?.displayMessage||e?.message||"Unknown",network:y.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:ie.state.sourceToken?.symbol||"",swapToToken:ie.state.toToken?.symbol||"",swapFromAmount:ie.state.sourceTokenAmount||"",swapToAmount:ie.state.toTokenAmount||"",isSmartAccount:w(h.CHAIN.EVM)===g.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;const{fromAddress:t,toTokenAmount:i,isAuthConnector:o}=ie.getParams();ee.loadingTransaction=!0;const a=`Swapping ${ee.sourceToken?.symbol} to ${c.formatNumberToLocalString(i,3)} ${ee.toToken?.symbol}`,n=`Swapped ${ee.sourceToken?.symbol} to ${c.formatNumberToLocalString(i,3)} ${ee.toToken?.symbol}`;o?d.pushTransactionStack({onSuccess(){d.replace("Account"),u.showLoading(a),te.resetState()}}):u.showLoading("Confirm transaction in your wallet");try{const i=[ee.sourceToken?.address,ee.toToken?.address].join(","),a=await p.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:h.CHAIN.EVM});return ee.loadingTransaction=!1,u.showSuccess(n),m.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:y.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:ie.state.sourceToken?.symbol||"",swapToToken:ie.state.toToken?.symbol||"",swapFromAmount:ie.state.sourceTokenAmount||"",swapToAmount:ie.state.toTokenAmount||"",isSmartAccount:w(h.CHAIN.EVM)===g.ACCOUNT_TYPES.SMART_ACCOUNT}}),te.resetState(),o||d.replace("Account"),te.getMyTokensWithBalance(i),a}catch(r){const e=r;return ee.transactionError=e?.displayMessage,ee.loadingTransaction=!1,u.showError(e?.displayMessage||"Transaction error"),void m.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:e?.displayMessage||e?.message||"Unknown",network:y.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:ie.state.sourceToken?.symbol||"",swapToToken:ie.state.toToken?.symbol||"",swapFromAmount:ie.state.sourceTokenAmount||"",swapToAmount:ie.state.toTokenAmount||"",isSmartAccount:w(h.CHAIN.EVM)===g.ACCOUNT_TYPES.SMART_ACCOUNT}})}},hasInsufficientToken:(e,t)=>X.isInsufficientSourceTokenForSwap(e,t,ee.myTokensWithBalance),setTransactionDetails(){const{toTokenAddress:e,toTokenDecimals:t}=ie.getParams();e&&t&&(ee.gasPriceInUSD=X.getGasPriceInUSD(ee.networkPrice,BigInt(ee.gasFee),BigInt(Z)),ee.priceImpact=X.getPriceImpact({sourceTokenAmount:ee.sourceTokenAmount,sourceTokenPriceInUSD:ee.sourceTokenPriceInUSD,toTokenPriceInUSD:ee.toTokenPriceInUSD,toTokenAmount:ee.toTokenAmount}),ee.maxSlippage=X.getMaxSlippage(ee.slippage,ee.toTokenAmount),ee.providerFee=X.getProviderFee(ee.sourceTokenAmount))}},ie=l(te),oe=C({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),ae=l({state:oe,subscribe:e=>P(oe,()=>e(oe)),subscribeKey:(e,t)=>$(oe,e,t),showTooltip({message:e,triggerRect:t,variant:i}){oe.open=!0,oe.message=e,oe.triggerRect=t,oe.variant=i},hide(){oe.open=!1,oe.message="",oe.triggerRect={width:0,height:0,top:0,left:0}}}),ne={isUnsupportedChainView:()=>"UnsupportedChain"===d.state.view||"SwitchNetwork"===d.state.view&&d.state.history.includes("UnsupportedChain"),async safeClose(){if(this.isUnsupportedChainView())return void I.shake();await E.isSIWXCloseDisabled()?I.shake():("DataCapture"!==d.state.view&&"DataCaptureOtpConfirm"!==d.state.view||p.disconnect(),I.close())}},re={interpolate(e,t,i){if(2!==e.length||2!==t.length)throw new Error("inputRange and outputRange must be an array of length 2");const o=e[0]||0,a=e[1]||0,n=t[0]||0,r=t[1]||0;return i<o?n:i>a?r:(r-n)/(a-o)*(i-o)+n}},se=N`
  :host {
    display: block;
    border-radius: clamp(0px, ${({borderRadius:e})=>e[8]}, 44px);
    box-shadow: 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    overflow: hidden;
  }
`;let ce=class extends e{render(){return t`<slot></slot>`}};ce.styles=[R,se],ce=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}([Q("wui-card")],ce);const le=N`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[6]};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  :host > wui-flex[data-type='info'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};

      wui-icon {
        color: ${({tokens:e})=>e.theme.iconDefault};
      }
    }
  }
  :host > wui-flex[data-type='success'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderSuccess};
      }
    }
  }
  :host > wui-flex[data-type='warning'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundWarning};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderWarning};
      }
    }
  }
  :host > wui-flex[data-type='error'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundError};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderError};
      }
    }
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
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e[2]};
    background-color: var(--local-icon-bg-value);
  }
`;var de=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const ue={info:"info",success:"checkmark",warning:"warningCircle",error:"warning"};let pe=class extends e{constructor(){super(...arguments),this.message="",this.type="info"}render(){return t`
      <wui-flex
        data-type=${s(this.type)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="2"
      >
        <wui-flex columnGap="2" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color="inherit" size="md" name=${ue[this.type]}></wui-icon>
          </wui-flex>
          <wui-text variant="md-medium" color="inherit" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="inherit"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){k.close()}};pe.styles=[R,le],de([a()],pe.prototype,"message",void 0),de([a()],pe.prototype,"type",void 0),pe=de([Q("wui-alertbar")],pe);const he=N`
  :host {
    display: block;
    position: absolute;
    top: ${({spacing:e})=>e[3]};
    left: ${({spacing:e})=>e[4]};
    right: ${({spacing:e})=>e[4]};
    opacity: 0;
    pointer-events: none;
  }
`;var me=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const we={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"warning"}};let ge=class extends e{constructor(){super(),this.unsubscribe=[],this.open=k.state.open,this.onOpen(!0),this.unsubscribe.push(k.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:i}=k.state,o=we[i];return t`
      <wui-alertbar
        message=${e}
        backgroundColor=${o?.backgroundColor}
        iconColor=${o?.iconColor}
        icon=${o?.icon}
        type=${i}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};ge.styles=he,me([n()],ge.prototype,"open",void 0),ge=me([Q("w3m-alertbar")],ge);const ye=N`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var fe=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let be=class extends e{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return t`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${s(this.iconSize)}></wui-icon>
    </button>`}};be.styles=[R,O,ye],fe([a()],be.prototype,"icon",void 0),fe([a()],be.prototype,"variant",void 0),fe([a()],be.prototype,"type",void 0),fe([a()],be.prototype,"size",void 0),fe([a()],be.prototype,"iconSize",void 0),fe([a({type:Boolean})],be.prototype,"fullWidth",void 0),fe([a({type:Boolean})],be.prototype,"disabled",void 0),be=fe([Q("wui-icon-button")],be);const ve=N`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: 100%;
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
  }

  .left-icon-container,
  .right-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-type='filled-dropdown'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button[data-type='text-dropdown'] {
    background-color: transparent;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    opacity: 0.5;
  }
`;var ke=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const xe={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},Te={lg:"lg",md:"md",sm:"sm"};let Se=class extends e{constructor(){super(...arguments),this.imageSrc="",this.text="",this.size="lg",this.type="text-dropdown",this.disabled=!1}render(){return t`<button ?disabled=${this.disabled} data-size=${this.size} data-type=${this.type}>
      ${this.imageTemplate()} ${this.textTemplate()}
      <wui-flex class="right-icon-container">
        <wui-icon name="chevronBottom"></wui-icon>
      </wui-flex>
    </button>`}textTemplate(){const e=xe[this.size];return this.text?t`<wui-text color="primary" variant=${e}>${this.text}</wui-text>`:null}imageTemplate(){if(this.imageSrc)return t`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`;const e=Te[this.size];return t` <wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}};Se.styles=[R,O,ve],ke([a()],Se.prototype,"imageSrc",void 0),ke([a()],Se.prototype,"text",void 0),ke([a()],Se.prototype,"size",void 0),ke([a()],Se.prototype,"type",void 0),ke([a({type:Boolean})],Se.prototype,"disabled",void 0),Se=ke([Q("wui-select")],Se);const Ae={ACCOUNT_TABS:[{label:"Tokens"},{label:"Activity"}],VIEW_DIRECTION:{Next:"next",Prev:"prev"},ANIMATION_DURATIONS:{HeaderText:120},VIEWS_WITH_LEGAL_FOOTER:["Connect","ConnectWallets","OnRampTokenSelect","OnRampFiatSelect","OnRampProviders"],VIEWS_WITH_DEFAULT_FOOTER:["Networks"]},$e=N`
  button {
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-variant='accent']:hover:enabled,
  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='primary']:hover:enabled,
  button[data-variant='primary']:focus-visible,
  button[data-variant='secondary']:hover:enabled,
  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button[data-size='xs'] > wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='xs'],
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'],
  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='md'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`;var Pe=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Ce=class extends e{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="default",this.variant="accent"}render(){return t`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${{accent:"accent-primary",primary:"inverse",secondary:"default"}[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};Ce.styles=[R,O,$e],Pe([a()],Ce.prototype,"size",void 0),Pe([a({type:Boolean})],Ce.prototype,"disabled",void 0),Pe([a()],Ce.prototype,"icon",void 0),Pe([a()],Ce.prototype,"iconColor",void 0),Pe([a()],Ce.prototype,"variant",void 0),Ce=Pe([Q("wui-icon-link")],Ce);const Ie=i`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`,Ee=i`
  <svg fill="none" viewBox="0 0 36 40">
    <path
      d="M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z"
    />
  </svg>
`,Ne=N`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-round='true']) {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 100%;
    outline: 1px solid ${({tokens:e})=>e.core.glass010};
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  svg > path {
    stroke: var(--local-stroke);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`;var Re=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Oe=class extends e{constructor(){super(...arguments),this.size="md",this.name="uknown",this.networkImagesBySize={sm:Ee,md:G,lg:Ie},this.selected=!1,this.round=!1}render(){const e={sm:"4",md:"6",lg:"10"};return this.round?(this.dataset.round="true",this.style.cssText="\n      --local-width: var(--apkt-spacing-10);\n      --local-height: var(--apkt-spacing-10);\n      --local-icon-size: var(--apkt-spacing-4);\n    "):this.style.cssText=`\n\n      --local-path: var(--apkt-path-network-${this.size});\n      --local-width:  var(--apkt-width-network-${this.size});\n      --local-height:  var(--apkt-height-network-${this.size});\n      --local-icon-size:  var(--apkt-spacing-${e[this.size]});\n    `,t`${this.templateVisual()} ${this.svgTemplate()} `}svgTemplate(){return this.round?null:this.networkImagesBySize[this.size]}templateVisual(){return this.imageSrc?t`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:t`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};Oe.styles=[R,Ne],Re([a()],Oe.prototype,"size",void 0),Re([a()],Oe.prototype,"name",void 0),Re([a({type:Object})],Oe.prototype,"networkImagesBySize",void 0),Re([a()],Oe.prototype,"imageSrc",void 0),Re([a({type:Boolean})],Oe.prototype,"selected",void 0),Re([a({type:Boolean})],Oe.prototype,"round",void 0),Oe=Re([Q("wui-network-image")],Oe);const ze=N`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: ${({tokens:e})=>e.theme.borderPrimary};
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 8px;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  :host([data-bg-color='primary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  :host([data-bg-color='secondary']) > wui-text {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var De=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Ue=class extends e{constructor(){super(...arguments),this.text="",this.bgColor="primary"}render(){return this.dataset.bgColor=this.bgColor,t`${this.template()}`}template(){return this.text?t`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};Ue.styles=[R,ze],De([a()],Ue.prototype,"text",void 0),De([a()],Ue.prototype,"bgColor",void 0),Ue=De([Q("wui-separator")],Ue);const We="INVALID_PAYMENT_CONFIG",je="INVALID_RECIPIENT",Be="INVALID_ASSET",Fe="INVALID_AMOUNT",Le="UNKNOWN_ERROR",qe="UNABLE_TO_INITIATE_PAYMENT",_e="INVALID_CHAIN_NAMESPACE",Me="GENERIC_PAYMENT_ERROR",He="UNABLE_TO_GET_EXCHANGES",Ve="ASSET_NOT_SUPPORTED",Ke="UNABLE_TO_GET_PAY_URL",Qe="UNABLE_TO_GET_BUY_STATUS",Ge="UNABLE_TO_GET_TOKEN_BALANCES",Ye="UNABLE_TO_GET_QUOTE",Xe="UNABLE_TO_GET_QUOTE_STATUS",Ze="INVALID_RECIPIENT_ADDRESS_FOR_ASSET",Je={[We]:"Invalid payment configuration",[je]:"Invalid recipient address",[Be]:"Invalid asset specified",[Fe]:"Invalid payment amount",[Ze]:"Invalid recipient address for the asset selected",[Le]:"Unknown payment error occurred",[qe]:"Unable to initiate payment",[_e]:"Invalid chain namespace",[Me]:"Unable to process payment",[He]:"Unable to get exchanges",[Ve]:"Asset not supported by the selected exchange",[Ke]:"Unable to get payment URL",[Qe]:"Unable to get buy status",[Ge]:"Unable to get token balances",[Ye]:"Unable to get quote. Please choose a different token",[Xe]:"Unable to get quote status"};class et extends Error{get message(){return Je[this.code]}constructor(e,t){super(Je[e]),this.name="AppKitPayError",this.code=e,this.details=t,Error.captureStackTrace&&Error.captureStackTrace(this,et)}}const tt="reown_test";function it(e){if(!e)return null;const t=e.steps[0];return t&&t.type===yt?t:null}function ot(e,t=0){if(!e)return[];const i=e.steps.filter(e=>e.type===ft),o=i.filter((e,i)=>i+1>t);return i.length>0&&i.length<3?o:[]}const at=new W({baseUrl:b.getApiUrl(),clientId:null});class nt extends Error{}function rt(){const{projectId:e,sdkType:t,sdkVersion:i}=B.state;return{projectId:e,st:t||"appkit",sv:i||"html-wagmi-4.2.2"}}async function st(e,t){const i=`https://rpc.walletconnect.org/v1/json-rpc?projectId=${B.getSnapshot().projectId}`,{sdkType:o,sdkVersion:a,projectId:n}=B.getSnapshot(),r={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:o,sv:a,projectId:n}},s=await fetch(i,{method:"POST",body:JSON.stringify(r),headers:{"Content-Type":"application/json"}}),c=await s.json();if(c.error)throw new nt(c.error.message);return c}async function ct(e){return(await st("reown_getExchanges",e)).result}async function lt(e){return(await st("reown_getExchangePayUrl",e)).result}async function dt(e){const t=j.isLowerCaseMatch(e.sourceToken.network,e.toToken.network),i=j.isLowerCaseMatch(e.sourceToken.asset,e.toToken.asset);return t&&i?async function({sourceToken:e,toToken:t,amount:i,recipient:o}){const a=p.parseUnits(i,e.metadata.decimals),n=p.parseUnits(i,t.metadata.decimals);return Promise.resolve({type:gt,origin:{amount:a?.toString()??"0",currency:e},destination:{amount:n?.toString()??"0",currency:t},fees:[{id:"service",label:"Service Fee",amount:"0",currency:t}],steps:[{requestId:gt,type:"deposit",deposit:{amount:a?.toString()??"0",currency:e.asset,receiver:o}}],timeInSeconds:6})}(e):async function(e){const t=c.bigNumber(e.amount).times(10**e.toToken.metadata.decimals).toString(),{chainId:i,chainNamespace:o}=U.parseCaipNetworkId(e.sourceToken.network),{chainId:a,chainNamespace:n}=U.parseCaipNetworkId(e.toToken.network),r="native"===e.sourceToken.asset?F(o):e.sourceToken.asset,s="native"===e.toToken.asset?F(n):e.toToken.asset;return await at.post({path:"/appkit/v1/transfers/quote",body:{user:e.address,originChainId:i.toString(),originCurrency:r,destinationChainId:a.toString(),destinationCurrency:s,recipient:e.recipient,amount:t},params:rt()})}(e)}const ut=["eip155","solana"],pt={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function ht(e,t){const{chainNamespace:i,chainId:o}=U.parseCaipNetworkId(e),a=pt[i];if(!a)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${i}`);let n=a.native.assetNamespace,r=a.native.assetReference;"native"!==t&&(n=a.defaultTokenNamespace,r=t);return`${`${i}:${o}`}/${n}:${r}`}function mt(e){const t=c.bigNumber(e,{safe:!0});return t.lt(.001)?"<0.001":t.round(4).toString()}const wt="unknown",gt="direct-transfer",yt="deposit",ft="transaction",bt=C({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:"pay",tokenBalances:{[h.CHAIN.EVM]:[],[h.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:"waiting",quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),vt={state:bt,subscribe:e=>P(bt,()=>e(bt)),subscribeKey:(e,t)=>$(bt,e,t),async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.initializeAnalytics(),function(){const{chainNamespace:e}=U.parseCaipNetworkId(vt.state.paymentAsset.network);if(!b.isAddress(vt.state.recipient,e))throw new et(Ze,`Provide valid recipient address for namespace "${e}"`)}(),await this.prepareTokenLogo(),bt.isConfigured=!0,m.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:bt.exchanges,configuration:{network:bt.paymentAsset.network,asset:bt.paymentAsset.asset,recipient:bt.recipient,amount:bt.amount}}}),await I.open({view:"Pay"})},resetState(){bt.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},bt.recipient="0x0",bt.amount=0,bt.isConfigured=!1,bt.error=null,bt.isPaymentInProgress=!1,bt.isLoading=!1,bt.currentPayment=void 0,bt.selectedExchange=void 0,bt.exchangeUrlForQuote=void 0,bt.requestId=void 0},resetQuoteState(){bt.quote=void 0,bt.quoteStatus="waiting",bt.quoteError=null,bt.isFetchingQuote=!1,bt.requestId=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new et(We);try{bt.choice=e.choice??"pay",bt.paymentAsset=e.paymentAsset,bt.recipient=e.recipient,bt.amount=e.amount,bt.openInNewTab=e.openInNewTab??!0,bt.redirectUrl=e.redirectUrl,bt.payWithExchange=e.payWithExchange,bt.error=null}catch(t){throw new et(We,t.message)}},setSelectedPaymentAsset(e){bt.selectedPaymentAsset=e},setSelectedExchange(e){bt.selectedExchange=e},setRequestId(e){bt.requestId=e},setPaymentInProgress(e){bt.isPaymentInProgress=e},getPaymentAsset:()=>bt.paymentAsset,getExchanges:()=>bt.exchanges,async fetchExchanges(){try{bt.isLoading=!0;const e=await ct({page:0});bt.exchanges=e.exchanges.slice(0,2)}catch(e){throw u.showError(Je.UNABLE_TO_GET_EXCHANGES),new et(He)}finally{bt.isLoading=!1}},async getAvailableExchanges(e){try{const t=e?.asset&&e?.network?ht(e.network,e.asset):void 0;return await ct({page:e?.page??0,asset:t,amount:e?.amount?.toString()})}catch(t){throw new et(He)}},async getPayUrl(e,t,i=!1){try{const o=Number(t.amount),a=await lt({exchangeId:e,asset:ht(t.network,t.asset),amount:o.toString(),recipient:`${t.network}:${t.recipient}`});return m.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:o},currentPayment:{type:"exchange",exchangeId:e},headless:i}}),i&&(this.initiatePayment(),m.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:bt.paymentId||wt,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:o},currentPayment:{type:"exchange",exchangeId:e}}})),a}catch(o){if(o instanceof Error&&o.message.includes("is not supported"))throw new et(Ve);throw new Error(o.message)}},async generateExchangeUrlForQuote({exchangeId:e,paymentAsset:t,amount:i,recipient:o}){const a=await lt({exchangeId:e,asset:ht(t.network,t.asset),amount:i.toString(),recipient:o});bt.exchangeSessionId=a.sessionId,bt.exchangeUrlForQuote=a.url},async openPayUrl(e,t,i=!1){try{const o=await this.getPayUrl(e.exchangeId,t,i);if(!o)throw new et(Ke);const a=e.openInNewTab??!0?"_blank":"_self";return b.openHref(o.url,a),o}catch(o){throw bt.error=o instanceof et?o.message:Je.GENERIC_PAYMENT_ERROR,new et(Ke)}},async onTransfer({chainNamespace:e,fromAddress:t,toAddress:i,amount:o,paymentAsset:a}){if(bt.currentPayment={type:"wallet",status:"IN_PROGRESS"},!bt.isPaymentInProgress)try{this.initiatePayment();const n=y.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===a.network);if(!n)throw new Error("Target network not found");const r=y.state.activeCaipNetwork;switch(j.isLowerCaseMatch(r?.caipNetworkId,n.caipNetworkId)||await y.switchActiveNetwork(n),e){case h.CHAIN.EVM:"native"===a.asset&&(bt.currentPayment.result=await async function(e,t,i){if(t!==h.CHAIN.EVM)throw new et(_e);if(!i.fromAddress)throw new et(We,"fromAddress is required for native EVM payments.");const o="string"==typeof i.amount?parseFloat(i.amount):i.amount;if(isNaN(o))throw new et(We);const a=e.metadata?.decimals??18,n=p.parseUnits(o.toString(),a);if("bigint"!=typeof n)throw new et(Me);return await p.sendTransaction({chainNamespace:t,to:i.recipient,address:i.fromAddress,value:n,data:"0x"})??void 0}(a,e,{recipient:i,amount:o,fromAddress:t})),a.asset.startsWith("0x")&&(bt.currentPayment.result=await async function(e,t){if(!t.fromAddress)throw new et(We,"fromAddress is required for ERC20 EVM payments.");const i=e.asset,o=t.recipient,a=Number(e.metadata.decimals),n=p.parseUnits(t.amount.toString(),a);if(void 0===n)throw new et(Me);return await p.writeContract({fromAddress:t.fromAddress,tokenAddress:i,args:[o,n],method:"transfer",abi:D.getERC20Abi(i),chainNamespace:h.CHAIN.EVM})??void 0}(a,{recipient:i,amount:o,fromAddress:t})),bt.currentPayment.status="SUCCESS";break;case h.CHAIN.SOLANA:bt.currentPayment.result=await async function(e,t){if(e!==h.CHAIN.SOLANA)throw new et(_e);if(!t.fromAddress)throw new et(We,"fromAddress is required for Solana payments.");const i="string"==typeof t.amount?parseFloat(t.amount):t.amount;if(isNaN(i)||i<=0)throw new et(We,"Invalid payment amount.");try{if(!z.getProvider(e))throw new et(Me,"No Solana provider available.");const o=await p.sendTransaction({chainNamespace:h.CHAIN.SOLANA,to:t.recipient,value:i,tokenMint:t.tokenMint});if(!o)throw new et(Me,"Transaction failed.");return o}catch(o){if(o instanceof et)throw o;throw new et(Me,`Solana payment failed: ${o}`)}}(e,{recipient:i,amount:o,fromAddress:t,tokenMint:"native"===a.asset?void 0:a.asset}),bt.currentPayment.status="SUCCESS";break;default:throw new et(_e)}}catch(n){throw bt.error=n instanceof et?n.message:Je.GENERIC_PAYMENT_ERROR,bt.currentPayment.status="FAILED",u.showError(bt.error),n}finally{bt.isPaymentInProgress=!1}},async onSendTransaction(e){try{const{namespace:t,transactionStep:i}=e;vt.initiatePayment();const o=y.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===bt.paymentAsset?.network);if(!o)throw new Error("Target network not found");const a=y.state.activeCaipNetwork;if(j.isLowerCaseMatch(a?.caipNetworkId,o.caipNetworkId)||await y.switchActiveNetwork(o),t===h.CHAIN.EVM){const{from:e,to:o,data:a,value:n}=i.transaction;await p.sendTransaction({address:e,to:o,data:a,value:BigInt(n),chainNamespace:t})}else if(t===h.CHAIN.SOLANA){const{instructions:e}=i.transaction;await p.writeSolanaTransaction({instructions:e})}}catch(t){throw bt.error=t instanceof et?t.message:Je.GENERIC_PAYMENT_ERROR,u.showError(bt.error),t}finally{bt.isPaymentInProgress=!1}},getExchangeById:e=>bt.exchanges.find(t=>t.id===e),validatePayConfig(e){const{paymentAsset:t,recipient:i,amount:o}=e;if(!t)throw new et(We);if(!i)throw new et(je);if(!t.asset)throw new et(Be);if(null==o||o<=0)throw new et(Fe)},async handlePayWithExchange(e){try{bt.currentPayment={type:"exchange",exchangeId:e};const{network:t,asset:i}=bt.paymentAsset,o={network:t,asset:i,amount:bt.amount,recipient:bt.recipient},a=await this.getPayUrl(e,o);if(!a)throw new et(qe);return bt.currentPayment.sessionId=a.sessionId,bt.currentPayment.status="IN_PROGRESS",bt.currentPayment.exchangeId=e,this.initiatePayment(),{url:a.url,openInNewTab:bt.openInNewTab}}catch(t){return bt.error=t instanceof et?t.message:Je.GENERIC_PAYMENT_ERROR,bt.isPaymentInProgress=!1,u.showError(bt.error),null}},async getBuyStatus(e,t){try{const i=await async function(e){return(await st("reown_getExchangeBuyStatus",e)).result}({sessionId:t,exchangeId:e});return"SUCCESS"!==i.status&&"FAILED"!==i.status||m.sendEvent({type:"track",event:"SUCCESS"===i.status?"PAY_SUCCESS":"PAY_ERROR",properties:{message:"FAILED"===i.status?b.parseError(bt.error):void 0,source:"pay",paymentId:bt.paymentId||wt,configuration:{network:bt.paymentAsset.network,asset:bt.paymentAsset.asset,recipient:bt.recipient,amount:bt.amount},currentPayment:{type:"exchange",exchangeId:bt.currentPayment?.exchangeId,sessionId:bt.currentPayment?.sessionId,result:i.txHash}}}),i}catch(i){throw new et(Qe)}},async fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:i}){if(!e)return[];const{address:o}=U.parseCaipAddress(e);let a=t;i===h.CHAIN.EVM&&(a=void 0);return await x.getMyTokensWithBalance({address:o,caipNetwork:a})},async fetchTokensFromExchange(){if(!bt.selectedExchange)return[];const e=await async function(e){return await at.get({path:`/appkit/v1/transfers/assets/exchanges/${e}`,params:rt()})}(bt.selectedExchange.id),t=Object.values(e.assets).flat();return await Promise.all(t.map(async e=>{const t={chainId:(i=e).network,address:`${i.network}:${i.asset}`,symbol:i.metadata.symbol,name:i.metadata.name,iconUrl:i.metadata.logoURI||"",price:0,quantity:{numeric:"0",decimals:i.metadata.decimals.toString()}};var i;const{chainNamespace:o}=U.parseCaipNetworkId(t.chainId);let a=t.address;if(b.isCaipAddress(a)){const{address:e}=U.parseCaipAddress(a);a=e}const n=await L.getImageByToken(a??"",o).catch(()=>{});return t.iconUrl=n??"",t}))},async fetchTokens({caipAddress:e,caipNetwork:t,namespace:i}){try{bt.isFetchingTokenBalances=!0;const o=Boolean(bt.selectedExchange)?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:i}),a=await o;bt.tokenBalances={...bt.tokenBalances,[i]:a}}catch(o){const e=o instanceof Error?o.message:"Unable to get token balances";u.showError(e)}finally{bt.isFetchingTokenBalances=!1}},async fetchQuote({amount:e,address:t,sourceToken:i,toToken:o,recipient:a}){try{vt.resetQuoteState(),bt.isFetchingQuote=!0;const n=await dt({amount:e,address:bt.selectedExchange?void 0:t,sourceToken:i,toToken:o,recipient:a});if(bt.selectedExchange){const e=it(n);if(e){const t=`${i.network}:${e.deposit.receiver}`,o=c.formatNumber(e.deposit.amount,{decimals:i.metadata.decimals??0,round:8});await vt.generateExchangeUrlForQuote({exchangeId:bt.selectedExchange.id,paymentAsset:i,amount:o.toString(),recipient:t})}}bt.quote=n}catch(n){let e=Je.UNABLE_TO_GET_QUOTE;if(n instanceof Error&&n.cause&&n.cause instanceof Response)try{const t=await n.cause.json();t.error&&"string"==typeof t.error&&(e=t.error)}catch{}throw bt.quoteError=e,u.showError(e),new et(Ye)}finally{bt.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:e}){try{if(e===gt){const e=bt.selectedExchange,t=bt.exchangeSessionId;if(e&&t){switch((await this.getBuyStatus(e.id,t)).status){case"IN_PROGRESS":case"UNKNOWN":default:bt.quoteStatus="waiting";break;case"SUCCESS":bt.quoteStatus="success",bt.isPaymentInProgress=!1;break;case"FAILED":bt.quoteStatus="failure",bt.isPaymentInProgress=!1}return}return void(bt.quoteStatus="success")}const{status:t}=await async function(e){return await at.get({path:"/appkit/v1/transfers/status",params:{requestId:e.requestId,...rt()}})}({requestId:e});bt.quoteStatus=t}catch{throw bt.quoteStatus="failure",new et(Xe)}},initiatePayment(){bt.isPaymentInProgress=!0,bt.paymentId=crypto.randomUUID()},initializeAnalytics(){bt.analyticsSet||(bt.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(bt.currentPayment?.status&&"UNKNOWN"!==bt.currentPayment.status){const e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[bt.currentPayment.status];m.sendEvent({type:"track",event:e,properties:{message:"FAILED"===bt.currentPayment.status?b.parseError(bt.error):void 0,source:"pay",paymentId:bt.paymentId||wt,configuration:{network:bt.paymentAsset.network,asset:bt.paymentAsset.asset,recipient:bt.recipient,amount:bt.amount},currentPayment:{type:bt.currentPayment.type,exchangeId:bt.currentPayment.exchangeId,sessionId:bt.currentPayment.sessionId,result:bt.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!bt.paymentAsset.metadata.logoURI)try{const{chainNamespace:e}=U.parseCaipNetworkId(bt.paymentAsset.network),t=await L.getImageByToken(bt.paymentAsset.asset,e);bt.paymentAsset.metadata.logoURI=t}catch{}}},kt=N`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[8]};
    border-top-left-radius: ${({borderRadius:e})=>e[8]};
  }
`;var xt=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Tt=class extends e{constructor(){super(),this.unsubscribe=[],this.amount=vt.state.amount,this.namespace=void 0,this.paymentAsset=vt.state.paymentAsset,this.activeConnectorIds=A.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=vt.state.exchanges,this.isLoading=vt.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(vt.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(A.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(vt.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(vt.subscribeKey("isLoading",e=>this.isLoading=e)),vt.fetchExchanges(),vt.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return t`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return t`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){const e=y.state.activeChain;this.namespace=e,this.caipAddress=y.getAccountData(e)?.caipAddress,this.unsubscribe.push(y.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},e))}paymentDetailsTemplate(){const e=y.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return t`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${["6","8","6","8"]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${mt(this.amount||"0")}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||"Unknown"}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${e?.name||"Unknown"}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${s(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${s(L.getNetworkImage(e))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return function(e){const{chainNamespace:t}=U.parseCaipNetworkId(e);return ut.includes(t)}(this.paymentAsset.network)?this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate():t``}connectedWalletTemplate(){const{name:e,image:i}=this.getWalletProperties({namespace:this.namespace});return t`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${s(i)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return t`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return t`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;const e=this.exchanges.filter(e=>function(e){const t=y.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.network);return!!t&&Boolean(t.testnet)}(this.paymentAsset)?e.id===tt:e.id!==tt);return 0===e.length?t`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:e.map(e=>t`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(e)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          imageSrc=${s(e.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${e.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return t`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw new Error("Namespace not found");this.caipAddress?d.push("PayQuote"):(await A.connect(),await I.open({view:"PayQuote"}))}onExchangePayment(e){vt.setSelectedExchange(e),d.push("PayQuote")}async onDisconnect(){try{await p.disconnect(),await I.open({view:"Pay"})}catch{u.showError("Failed to disconnect")}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};const t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};const i=A.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};const o=L.getConnectorImage(i);return{name:i.name,image:o}}};Tt.styles=kt,xt([n()],Tt.prototype,"amount",void 0),xt([n()],Tt.prototype,"namespace",void 0),xt([n()],Tt.prototype,"paymentAsset",void 0),xt([n()],Tt.prototype,"activeConnectorIds",void 0),xt([n()],Tt.prototype,"caipAddress",void 0),xt([n()],Tt.prototype,"exchanges",void 0),xt([n()],Tt.prototype,"isLoading",void 0),Tt=xt([Q("w3m-pay-view")],Tt);const St=N`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;var At=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const $t={"accent-primary":q.tokens.core.backgroundAccentPrimary};let Pt=class extends e{constructor(){super(...arguments),this.rings=3,this.duration=2,this.opacity=.3,this.size="200px",this.variant="accent-primary"}render(){const e=$t[this.variant];this.style.cssText=`\n      --pulse-size: ${this.size};\n      --pulse-duration: ${this.duration}s;\n      --pulse-color: ${e};\n      --pulse-opacity: ${this.opacity};\n    `;const i=Array.from({length:this.rings},(e,t)=>this.renderRing(t,this.rings));return t`
      <div class="pulse-container">
        <div class="pulse-rings">${i}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(e,i){const o=e/i*this.duration;return t`<div class="pulse-ring" style=${`animation-delay: ${o}s;`}></div>`}};Pt.styles=[R,St],At([a({type:Number})],Pt.prototype,"rings",void 0),At([a({type:Number})],Pt.prototype,"duration",void 0),At([a({type:Number})],Pt.prototype,"opacity",void 0),At([a()],Pt.prototype,"size",void 0),At([a()],Pt.prototype,"variant",void 0),Pt=At([Q("wui-pulse")],Pt);const Ct=[{id:"received",title:"Receiving funds",icon:"dollar"},{id:"processing",title:"Swapping asset",icon:"recycleHorizontal"},{id:"sending",title:"Sending asset to the recipient address",icon:"send"}],It=["success","submitted","failure","timeout","refund"],Et=N`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:e})=>e[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:e})=>e.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[6]};
    border-top-left-radius: ${({borderRadius:e})=>e[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }
`;var Nt=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const Rt={received:["pending","success","submitted"],processing:["success","submitted"],sending:["success","submitted"]};let Ot=class extends e{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=vt.state.paymentAsset,this.quoteStatus=vt.state.quoteStatus,this.quote=vt.state.quote,this.amount=vt.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=A.state.activeConnectorIds,this.selectedExchange=vt.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(vt.subscribeKey("quoteStatus",e=>this.quoteStatus=e),vt.subscribeKey("quote",e=>this.quote=e),A.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e),vt.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(e=>e())}render(){return t`
      <wui-flex flexDirection="column" .padding=${["3","0","0","0"]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){const e=mt(this.amount||"0"),i=this.paymentAsset.metadata.symbol??"Unknown",o=y.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network),a="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus;return"success"===this.quoteStatus||"submitted"===this.quoteStatus?t`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:a?t`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:t`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${s(L.getNetworkImage(o))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${e} ${i}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return t`
      <wui-flex flexDirection="column" gap="2" .padding=${["0","6","0","6"]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){const e=this.getStepsWithStatus();return t`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${["2","0","2","0"]}>
          ${e.map(e=>this.renderStep(e))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){const e="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus,i="success"===this.quoteStatus||"submitted"===this.quoteStatus;if(e)return t`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `;if(i)return t`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `;const o=this.quote?.timeInSeconds??0;return t`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${o} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){const e=y.getAllRequestedCaipNetworks().find(e=>{const t=this.quote?.origin.currency.network;if(!t)return!1;const{chainId:i}=U.parseCaipNetworkId(t);return j.isLowerCaseMatch(e.id.toString(),i.toString())}),i=mt(c.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString()),o=this.quote?.origin.currency.metadata.symbol??"Unknown";return t`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${i}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${o}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${s(L.getNetworkImage(e))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${e?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return t`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Wallet</wui-text>

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){const{image:e}=this.getWalletProperties({namespace:this.namespace}),{address:i}=this.caipAddress?U.parseCaipAddress(this.caipAddress):{},o=this.selectedExchange?.name;return this.selectedExchange?t`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${o}</wui-text>
          <wui-image src=${s(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:t`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${Y.getTruncateString({string:this.profileName||i||o||"",charsStart:this.profileName?16:4,charsEnd:this.profileName?0:6,truncate:this.profileName?"end":"middle"})}
        </wui-text>

        <wui-image src=${s(e)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return"failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus?Ct.map(e=>({...e,status:"failed"})):Ct.map(e=>{const t=(Rt[e.id]??[]).includes(this.quoteStatus)?"completed":"pending";return{...e,status:t}})}renderStep({title:e,icon:i,status:o}){return t`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${i} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${r({"step-icon-box":!0,success:"completed"===o})}>
            ${this.renderStatusIndicator(o)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${e}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(e){return"completed"===e?t`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:"failed"===e?t`<wui-icon size="sm" color="error" name="close"></wui-icon>`:"pending"===e?t`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},3e3))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){const e=vt.state.requestId;if(!e||It.includes(this.quoteStatus))this.stopPolling();else try{await vt.fetchQuoteStatus({requestId:e}),It.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){const e=y.state.activeChain;this.namespace=e,this.caipAddress=y.getAccountData(e)?.caipAddress,this.profileName=y.getAccountData(e)?.profileName??null,this.unsubscribe.push(y.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null},e))}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};const t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};const i=A.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};const o=L.getConnectorImage(i);return{name:i.name,image:o}}};Ot.styles=Et,Nt([n()],Ot.prototype,"paymentAsset",void 0),Nt([n()],Ot.prototype,"quoteStatus",void 0),Nt([n()],Ot.prototype,"quote",void 0),Nt([n()],Ot.prototype,"amount",void 0),Nt([n()],Ot.prototype,"namespace",void 0),Nt([n()],Ot.prototype,"caipAddress",void 0),Nt([n()],Ot.prototype,"profileName",void 0),Nt([n()],Ot.prototype,"activeConnectorIds",void 0),Nt([n()],Ot.prototype,"selectedExchange",void 0),Ot=Nt([Q("w3m-pay-loading-view")],Ot);const zt=N`
  button {
    display: flex;
    align-items: center;
    height: 40px;
    padding: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[4]};
    column-gap: ${({spacing:e})=>e[1]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  wui-image,
  .icon-box {
    width: ${({spacing:e})=>e[6]};
    height: ${({spacing:e})=>e[6]};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    flex: 1;
  }

  .icon-box {
    position: relative;
  }

  .icon-box[data-active='true'] {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .circle {
    position: absolute;
    left: 16px;
    top: 15px;
    width: 8px;
    height: 8px;
    background-color: ${({tokens:e})=>e.core.textSuccess};
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 50%;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var Dt=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Ut=class extends e{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.enableGreenCircle=!0,this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return t`
      <button>
        ${this.leftImageTemplate()} ${this.textTemplate()} ${this.rightImageTemplate()}
      </button>
    `}leftImageTemplate(){const e=this.icon?t`<wui-icon
          size=${s(this.iconSize)}
          color="default"
          name=${this.icon}
          class="icon"
        ></wui-icon>`:t`<wui-image src=${this.imageSrc} alt=${this.alt}></wui-image>`;return t`
      <wui-flex
        alignItems="center"
        justifyContent="center"
        class="icon-box"
        data-active=${Boolean(this.icon)}
      >
        ${e}
        ${this.enableGreenCircle?t`<wui-flex class="circle"></wui-flex>`:null}
      </wui-flex>
    `}textTemplate(){return t`
      <wui-text variant="lg-regular" color="primary">
        ${Y.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
      </wui-text>
    `}rightImageTemplate(){return t`<wui-icon name="chevronBottom" size="sm" color="default"></wui-icon>`}};Ut.styles=[R,O,zt],Dt([a()],Ut.prototype,"address",void 0),Dt([a()],Ut.prototype,"profileName",void 0),Dt([a()],Ut.prototype,"alt",void 0),Dt([a()],Ut.prototype,"imageSrc",void 0),Dt([a()],Ut.prototype,"icon",void 0),Dt([a()],Ut.prototype,"iconSize",void 0),Dt([a({type:Boolean})],Ut.prototype,"enableGreenCircle",void 0),Dt([a({type:Boolean})],Ut.prototype,"loading",void 0),Dt([a({type:Number})],Ut.prototype,"charsStart",void 0),Dt([a({type:Number})],Ut.prototype,"charsEnd",void 0),Ut=Dt([Q("wui-wallet-switch")],Ut);const Wt=o`
  :host {
    display: block;
  }
`;let jt=class extends e{render(){return t`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};jt.styles=[Wt],jt=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}([Q("w3m-pay-fees-skeleton")],jt);const Bt=N`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var Ft=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Lt=class extends e{constructor(){super(),this.unsubscribe=[],this.quote=vt.state.quote,this.unsubscribe.push(vt.subscribeKey("quote",e=>this.quote=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=c.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return t`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${e} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(e=>this.renderFee(e)):null}
      </wui-flex>
    `}renderFee(e){const i="network"===e.id,o=c.formatNumber(e.amount||"0",{decimals:e.currency.metadata.decimals??0,round:6}).toString();if(i){const i=y.getAllRequestedCaipNetworks().find(t=>j.isLowerCaseMatch(t.caipNetworkId,e.currency.network));return t`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${o} ${e.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${s(L.getNetworkImage(i))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${i?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return t`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${o} ${e.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};Lt.styles=[Bt],Ft([n()],Lt.prototype,"quote",void 0),Lt=Ft([Q("w3m-pay-fees")],Lt);const qt=N`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var _t=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Mt=class extends e{constructor(){super(),this.unsubscribe=[],this.selectedExchange=vt.state.selectedExchange,this.unsubscribe.push(vt.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=Boolean(this.selectedExchange);return t`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${e?null:t`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};Mt.styles=[qt],_t([a({type:Array})],Mt.prototype,"selectedExchange",void 0),Mt=_t([Q("w3m-pay-options-empty")],Mt);const Ht=N`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`;let Vt=class extends e{render(){return t`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return t`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};Vt.styles=[Ht],Vt=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}([Q("w3m-pay-options-skeleton")],Vt);const Kt=N`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var Qt=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Gt=class extends e{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect();const e=this.shadowRoot?.querySelector(".pay-options-container");e?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){const e=this.shadowRoot?.querySelector(".pay-options-container");e&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),e?.addEventListener("scroll",this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(e),this.handleOptionsListScroll())}render(){return t`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(e=>this.payOptionTemplate(e))}
      </wui-flex>
    `}payOptionTemplate(e){const{network:i,metadata:o,asset:a,amount:n="0"}=e,r=y.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===i),l=`${i}:${a}`===`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,d=c.bigNumber(n,{safe:!0}),u=d.gt(0);return t`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(e)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${s(o.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${s(L.getNetworkImage(r))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${o.symbol}</wui-text>
            ${u?t`<wui-text variant="sm-regular" color="secondary">
                  ${d.round(6).toString()} ${o.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${l?t`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){const e=this.shadowRoot?.querySelector(".pay-options-container");if(!e)return;e.scrollHeight>300?(e.style.setProperty("--options-mask-image","linear-gradient(\n          to bottom,\n          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,\n          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,\n          black 50px,\n          black calc(100% - 50px),\n          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),\n          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%\n        )"),e.style.setProperty("--options-scroll--top-opacity",re.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--options-scroll--bottom-opacity",re.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--options-mask-image","none"),e.style.setProperty("--options-scroll--top-opacity","0"),e.style.setProperty("--options-scroll--bottom-opacity","0"))}};Gt.styles=[Kt],Qt([a({type:Array})],Gt.prototype,"options",void 0),Qt([a()],Gt.prototype,"selectedPaymentAsset",void 0),Qt([a()],Gt.prototype,"onSelect",void 0),Gt=Qt([Q("w3m-pay-options")],Gt);const Yt=N`
  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[5]};
    border-top-left-radius: ${({borderRadius:e})=>e[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding: ${({spacing:e})=>e[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;var Xt=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const Zt={eip155:{icon:"ethereum",label:"EVM"},solana:{icon:"solana",label:"Solana"},bip122:{icon:"bitcoin",label:"Bitcoin"},ton:{icon:"ton",label:"Ton"}};let Jt=class extends e{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=vt.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=vt.state.amount,this.recipient=vt.state.recipient,this.activeConnectorIds=A.state.activeConnectorIds,this.selectedPaymentAsset=vt.state.selectedPaymentAsset,this.selectedExchange=vt.state.selectedExchange,this.isFetchingQuote=vt.state.isFetchingQuote,this.quoteError=vt.state.quoteError,this.quote=vt.state.quote,this.isFetchingTokenBalances=vt.state.isFetchingTokenBalances,this.tokenBalances=vt.state.tokenBalances,this.isPaymentInProgress=vt.state.isPaymentInProgress,this.exchangeUrlForQuote=vt.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(vt.subscribeKey("paymentAsset",e=>this.paymentAsset=e)),this.unsubscribe.push(vt.subscribeKey("tokenBalances",e=>this.onTokenBalancesChanged(e))),this.unsubscribe.push(vt.subscribeKey("isFetchingTokenBalances",e=>this.isFetchingTokenBalances=e)),this.unsubscribe.push(A.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(vt.subscribeKey("selectedPaymentAsset",e=>this.selectedPaymentAsset=e)),this.unsubscribe.push(vt.subscribeKey("isFetchingQuote",e=>this.isFetchingQuote=e)),this.unsubscribe.push(vt.subscribeKey("quoteError",e=>this.quoteError=e)),this.unsubscribe.push(vt.subscribeKey("quote",e=>this.quote=e)),this.unsubscribe.push(vt.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(vt.subscribeKey("recipient",e=>this.recipient=e)),this.unsubscribe.push(vt.subscribeKey("isPaymentInProgress",e=>this.isPaymentInProgress=e)),this.unsubscribe.push(vt.subscribeKey("selectedExchange",e=>this.selectedExchange=e)),this.unsubscribe.push(vt.subscribeKey("exchangeUrlForQuote",e=>this.exchangeUrlForQuote=e)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(e=>e())}updated(e){super.updated(e);e.has("selectedPaymentAsset")&&this.fetchQuote()}render(){return t`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){const e=c.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return t`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?t`<wui-text variant="lg-regular" color="primary">
                ${c.bigNumber(e,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:t`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}const e=b.getPlainAddress(this.caipAddress)??"",{name:i,image:o}=this.getWalletProperties({namespace:this.namespace}),{icon:a,label:n}=Zt[this.namespace]??{};return t`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${s(this.profileName)}
          address=${s(e)}
          imageSrc=${s(o)}
          alt=${s(i)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${s(n)}
          address=${s(e)}
          icon=${s(a)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${s(n)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){const e=y.state.activeChain;this.namespace=e,this.caipAddress=y.getAccountData(e)?.caipAddress,this.profileName=y.getAccountData(e)?.profileName??null,this.unsubscribe.push(y.subscribeChainProp("accountState",e=>this.onAccountStateChanged(e),e))}async fetchTokens(){if(this.namespace){let e;if(this.caipAddress){const{chainId:t,chainNamespace:i}=U.parseCaipAddress(this.caipAddress),o=`${i}:${t}`;e=y.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===o)}await vt.fetchTokens({caipAddress:this.caipAddress,caipNetwork:e,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){const{address:e}=this.caipAddress?U.parseCaipAddress(this.caipAddress):{};vt.fetchQuote({amount:this.amount.toString(),address:e,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};const t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};const i=A.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};const o=L.getConnectorImage(i);return{name:i.name,image:o}}paymentOptionsViewTemplate(){return t`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){const e=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return t`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(0===e.length)return t`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;const i={disabled:this.isFetchingQuote};return t`<w3m-pay-options
      class=${r(i)}
      .options=${e}
      .selectedPaymentAsset=${s(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?t`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:t`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){const e=this.isFetchingQuote||this.isFetchingTokenBalances,i=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||Boolean(this.quoteError),o=c.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?e||i?t`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:t`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:t`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${e||i?t`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:t`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${mt(o)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:e,isDisabled:i})}
      </wui-flex>
    `}actionButtonTemplate(e){const i=ot(this.quote),{isLoading:o,isDisabled:a}=e;let n="Pay";return i.length>1&&0===this.completedTransactionsCount&&(n="Approve"),t`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${o||this.isPaymentInProgress}
        ?disabled=${a||this.isPaymentInProgress}
        @click=${()=>{i.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${n}
        ${o?null:t`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){if(!this.namespace)return[];return(this.tokenBalances[this.namespace]??[]).map(e=>{try{return function(e){const t=y.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.chainId);let i=e.address;if(!t)throw new Error(`Target network not found for balance chainId "${e.chainId}"`);if(j.isLowerCaseMatch(e.symbol,t.nativeCurrency.symbol))i="native";else if(b.isCaipAddress(i)){const{address:e}=U.parseCaipAddress(i);i=e}else if(!i)throw new Error(`Balance address not found for balance symbol "${e.symbol}"`);return{network:t.caipNetworkId,asset:i,metadata:{name:e.name,symbol:e.symbol,decimals:Number(e.quantity.decimals),logoURI:e.iconUrl},amount:e.quantity.numeric}}(e)}catch(t){return null}}).filter(e=>Boolean(e)).filter(e=>{const{chainId:t}=U.parseCaipNetworkId(e.network),{chainId:i}=U.parseCaipNetworkId(this.paymentAsset.network);return!!j.isLowerCaseMatch(e.asset,this.paymentAsset.asset)||(!this.selectedExchange||!j.isLowerCaseMatch(t.toString(),i.toString()))})}onTokenBalancesChanged(e){this.tokenBalances=e;const[t]=this.getPaymentAssetFromTokenBalances();t&&vt.setSelectedPaymentAsset(t)}async onConnectOtherWallet(){await A.connect(),await I.open({view:"PayQuote"})}onAccountStateChanged(e){const{address:t}=this.caipAddress?U.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null,t){const{address:e}=this.caipAddress?U.parseCaipAddress(this.caipAddress):{};e?j.isLowerCaseMatch(e,t)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):I.close()}}onSelectedPaymentAssetChanged(e){this.isFetchingQuote||vt.setSelectedPaymentAsset(e)}async onTransfer(){const e=it(this.quote);if(e){if(!j.isLowerCaseMatch(this.selectedPaymentAsset?.asset,e.deposit.currency))throw new Error("Quote asset is not the same as the selected payment asset");const t=this.selectedPaymentAsset?.amount??"0",i=c.formatNumber(e.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!c.bigNumber(t).gte(i))return void u.showError("Insufficient funds");if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){const{address:t}=U.parseCaipAddress(this.caipAddress);await vt.onTransfer({chainNamespace:this.namespace,fromAddress:t,toAddress:e.deposit.receiver,amount:i,paymentAsset:this.selectedPaymentAsset}),vt.setRequestId(e.requestId),d.push("PayLoading")}}}async onSendTransactions(){const e=this.selectedPaymentAsset?.amount??"0",t=c.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!c.bigNumber(e).gte(t))return void u.showError("Insufficient funds");const i=ot(this.quote),[o]=ot(this.quote,this.completedTransactionsCount);if(o&&this.namespace){await vt.onSendTransaction({namespace:this.namespace,transactionStep:o}),this.completedTransactionsCount+=1;this.completedTransactionsCount===i.length&&(vt.setRequestId(o.requestId),d.push("PayLoading"))}}onPayWithExchange(){if(this.exchangeUrlForQuote){const e=b.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!e)throw new Error("Could not create popup window");e.location.href=this.exchangeUrlForQuote;const t=it(this.quote);t&&vt.setRequestId(t.requestId),vt.initiatePayment(),d.push("PayLoading")}}resetAssetsState(){vt.setSelectedPaymentAsset(null)}resetQuoteState(){vt.resetQuoteState()}};Jt.styles=Yt,Xt([n()],Jt.prototype,"profileName",void 0),Xt([n()],Jt.prototype,"paymentAsset",void 0),Xt([n()],Jt.prototype,"namespace",void 0),Xt([n()],Jt.prototype,"caipAddress",void 0),Xt([n()],Jt.prototype,"amount",void 0),Xt([n()],Jt.prototype,"recipient",void 0),Xt([n()],Jt.prototype,"activeConnectorIds",void 0),Xt([n()],Jt.prototype,"selectedPaymentAsset",void 0),Xt([n()],Jt.prototype,"selectedExchange",void 0),Xt([n()],Jt.prototype,"isFetchingQuote",void 0),Xt([n()],Jt.prototype,"quoteError",void 0),Xt([n()],Jt.prototype,"quote",void 0),Xt([n()],Jt.prototype,"isFetchingTokenBalances",void 0),Xt([n()],Jt.prototype,"tokenBalances",void 0),Xt([n()],Jt.prototype,"isPaymentInProgress",void 0),Xt([n()],Jt.prototype,"exchangeUrlForQuote",void 0),Xt([n()],Jt.prototype,"completedTransactionsCount",void 0),Jt=Xt([Q("w3m-pay-quote-view")],Jt);const ei=N`
  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .transfers-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }
`;var ti=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let ii=class extends e{constructor(){super(),this.unsubscribe=[],this.paymentAsset=vt.state.paymentAsset,this.amount=vt.state.amount,this.unsubscribe.push(vt.subscribeKey("paymentAsset",e=>{this.paymentAsset=e}),vt.subscribeKey("amount",e=>{this.amount=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=y.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return t`<wui-flex
      alignItems="center"
      gap="1"
      .padding=${["1","2","1","1"]}
      class="transfers-badge"
    >
      <wui-image src=${s(this.paymentAsset.metadata.logoURI)} size="xl"></wui-image>
      <wui-text variant="lg-regular" color="primary">
        ${this.amount} ${this.paymentAsset.metadata.symbol}
      </wui-text>
      <wui-text variant="sm-regular" color="secondary">
        on ${e?.name??"Unknown"}
      </wui-text>
    </wui-flex>`}};ii.styles=[ei],ti([a()],ii.prototype,"paymentAsset",void 0),ti([a()],ii.prototype,"amount",void 0),ii=ti([Q("w3m-pay-header")],ii);const oi=N`
  :host {
    height: 60px;
  }

  :host > wui-flex {
    box-sizing: border-box;
    background-color: var(--local-header-background-color);
  }

  wui-text {
    background-color: var(--local-header-background-color);
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-down-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-up-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-icon-button[data-hidden='true'] {
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
`;var ai=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const ni=["SmartSessionList"],ri={PayWithExchange:q.tokens.theme.foregroundPrimary};function si(){const e=d.state.data?.connector?.name,t=d.state.data?.wallet?.name,i=d.state.data?.network?.name,o=t??e,a=A.getConnectors(),n=1===a.length&&"w3m-email"===a[0]?.id,r=y.getAccountData()?.socialProvider;return{Connect:`Connect ${n?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",UsageExceeded:"Usage Exceeded",ConnectingExternal:o??"Connect Wallet",ConnectingWalletConnect:o??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview Convert",Downloads:o?`Get ${o}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a Wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:i??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade Your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose Name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select Token",SwapPreview:"Preview Swap",WalletSend:"Send",WalletSendPreview:"Review Send",WalletSendSelectToken:"Select Token",WalletSendConfirmed:"Confirmed",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a Wallet?",ConnectWallets:"Connect Wallet",ConnectSocials:"All Socials",ConnectingSocial:r?r.charAt(0).toUpperCase()+r.slice(1):"Connect Social",ConnectingMultiChain:"Select Chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch Chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Processing payment...",PayQuote:"Payment Quote",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email",FundWallet:"Fund Wallet",PayWithExchange:"Deposit from Exchange",PayWithExchangeSelectAsset:"Select Asset",SmartAccountSettings:"Smart Account Settings"}}let ci=class extends e{constructor(){super(),this.unsubscribe=[],this.heading=si()[d.state.view],this.network=y.state.activeCaipNetwork,this.networkImage=L.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=d.state.view,this.viewDirection="",this.unsubscribe.push(_.subscribeNetworkImages(()=>{this.networkImage=L.getNetworkImage(this.network)}),d.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.heading=si()[e]},Ae.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),y.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=L.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=ri[d.state.view]??q.tokens.theme.backgroundPrimary;return this.style.setProperty("--local-header-background-color",e),t`
      <wui-flex
        .padding=${["0","4","0","4"]}
        justifyContent="space-between"
        alignItems="center"
      >
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){m.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),d.push("WhatIsAWallet")}async onClose(){await ne.safeClose()}rightHeaderTemplate(){const e=B?.state?.features?.smartSessions;return"Account"===d.state.view&&e?t`<wui-flex>
      <wui-icon-button
        icon="clock"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${()=>d.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-button>
      ${this.closeButtonTemplate()}
    </wui-flex> `:this.closeButtonTemplate()}closeButtonTemplate(){return t`
      <wui-icon-button
        icon="close"
        size="lg"
        type="neutral"
        variant="primary"
        iconSize="lg"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-button>
    `}titleTemplate(){if("PayQuote"===this.view)return t`<w3m-pay-header></w3m-pay-header>`;const e=ni.includes(this.view);return t`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="2"
      >
        <wui-text
          display="inline"
          variant="lg-regular"
          color="primary"
          data-testid="w3m-header-text"
        >
          ${this.heading}
        </wui-text>
        ${e?t`<wui-tag variant="accent" size="md">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){const{view:e}=d.state,i="Connect"===e,o=B.state.enableEmbedded,a="ApproveTransaction"===e,n="ConnectingSiwe"===e,r="Account"===e,c=B.state.enableNetworkSwitch,l=a||n||i&&o;return r&&c?t`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${s(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${s(this.networkImage)}
      ></wui-select>`:this.showBack&&!l?t`<wui-icon-button
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-button>`:t`<wui-icon-button
      data-hidden=${!i}
      id="dynamic"
      icon="helpCircle"
      size="lg"
      iconSize="lg"
      type="neutral"
      variant="primary"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-button>`}onNetworks(){this.isAllowedNetworkSwitch()&&(m.sendEvent({type:"track",event:"CLICK_NETWORKS"}),d.push("Networks"))}isAllowedNetworkSwitch(){const e=y.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,i=e?.find(({id:e})=>e===this.network?.id);return t||!i}onViewChange(){const{history:e}=d.state;let t=Ae.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=Ae.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){const{history:e}=d.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){d.goBack()}};ci.styles=oi,ai([n()],ci.prototype,"heading",void 0),ai([n()],ci.prototype,"network",void 0),ai([n()],ci.prototype,"networkImage",void 0),ai([n()],ci.prototype,"showBack",void 0),ai([n()],ci.prototype,"prevHistoryLength",void 0),ai([n()],ci.prototype,"view",void 0),ai([n()],ci.prototype,"viewDirection",void 0),ci=ai([Q("w3m-header")],ci);const li=N`
  :host {
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow:
      0px 0px 8px 0px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px ${({tokens:e})=>e.theme.borderPrimary};
    max-width: 320px;
  }

  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e.round} !important;
    overflow: hidden;
  }

  wui-loading-spinner {
    padding: ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    border-radius: ${({borderRadius:e})=>e.round} !important;
  }
`;var di=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let ui=class extends e{constructor(){super(...arguments),this.message="",this.variant="success"}render(){return t`
      ${this.templateIcon()}
      <wui-text variant="lg-regular" color="primary" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return"loading"===this.variant?t`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:t`<wui-icon-box
      size="md"
      color=${{success:"success",error:"error",warning:"warning",info:"default"}[this.variant]}
      icon=${{success:"checkmark",error:"warning",warning:"warningCircle",info:"info"}[this.variant]}
    ></wui-icon-box>`}};ui.styles=[R,li],di([a()],ui.prototype,"message",void 0),di([a()],ui.prototype,"variant",void 0),ui=di([Q("wui-snackbar")],ui);const pi=o`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var hi=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let mi=class extends e{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=u.state.open,this.unsubscribe.push(u.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:i}=u.state;return t` <wui-snackbar message=${e} variant=${i}></wui-snackbar> `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),u.state.autoClose&&(this.timeout=setTimeout(()=>u.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};mi.styles=pi,hi([n()],mi.prototype,"open",void 0),mi=hi([Q("w3m-snackbar")],mi);const wi=o`
  :host {
    width: 100%;
    display: block;
  }
`;var gi=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let yi=class extends e{constructor(){super(),this.unsubscribe=[],this.text="",this.open=ae.state.open,this.unsubscribe.push(d.subscribeKey("view",()=>{ae.hide()}),I.subscribeKey("open",e=>{e||ae.hide()}),ae.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),ae.hide()}render(){return t`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return t`<slot></slot> `}onMouseEnter(){const e=this.getBoundingClientRect();if(!this.open){const t=document.querySelector("w3m-modal"),i={width:e.width,height:e.height,left:e.left,top:e.top};if(t){const o=t.getBoundingClientRect();i.left=e.left-(window.innerWidth-o.width)/2,i.top=e.top-(window.innerHeight-o.height)/2}ae.showTooltip({message:this.text,triggerRect:i,variant:"shade"})}}onMouseLeave(e){this.contains(e.relatedTarget)||ae.hide()}};yi.styles=[wi],gi([a()],yi.prototype,"text",void 0),gi([n()],yi.prototype,"open",void 0),yi=gi([Q("w3m-tooltip-trigger")],yi);const fi=N`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px ${({spacing:e})=>e[3]} 10px ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: absolute;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--apkt-modal-width) - ${({spacing:e})=>e[5]});
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var bi=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let vi=class extends e{constructor(){super(),this.unsubscribe=[],this.open=ae.state.open,this.message=ae.state.message,this.triggerRect=ae.state.triggerRect,this.variant=ae.state.variant,this.unsubscribe.push(ae.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;const e=this.triggerRect.top,i=this.triggerRect.left;return this.style.cssText=`\n    --w3m-tooltip-top: ${e}px;\n    --w3m-tooltip-left: ${i}px;\n    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;\n    --w3m-tooltip-display: ${this.open?"flex":"none"};\n    --w3m-tooltip-opacity: ${this.open?1:0};\n    `,t`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};vi.styles=[fi],bi([n()],vi.prototype,"open",void 0),bi([n()],vi.prototype,"message",void 0),bi([n()],vi.prototype,"triggerRect",void 0),bi([n()],vi.prototype,"variant",void 0),vi=bi([Q("w3m-tooltip")],vi);const ki={getTabsByNamespace:e=>Boolean(e)&&e===h.CHAIN.EVM?!1===B.state.remoteFeatures?.activity?Ae.ACCOUNT_TABS.filter(e=>"Activity"!==e.label):Ae.ACCOUNT_TABS:[],isValidReownName:e=>/^[a-zA-Z0-9]+$/gu.test(e),isValidEmail:e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(e),validateReownName:e=>e.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,""),hasFooter(){const e=d.state.view;if(Ae.VIEWS_WITH_LEGAL_FOOTER.includes(e)){const{termsConditionsUrl:e,privacyPolicyUrl:t}=B.state,i=B.state.features?.legalCheckbox;return!(!e&&!t||i)}return Ae.VIEWS_WITH_DEFAULT_FOOTER.includes(e)}},xi=N`
  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: ${({spacing:e})=>e[3]};
  }

  a {
    text-decoration: none;
    color: ${({tokens:e})=>e.core.textAccentPrimary};
    font-weight: 500;
  }
`;var Ti=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Si=class extends e{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=B.state.remoteFeatures,this.unsubscribe.push(B.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{termsConditionsUrl:e,privacyPolicyUrl:i}=B.state,o=B.state.features?.legalCheckbox;return!e&&!i||o?t`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:t`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["4","3","3","3"]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=B.state;return e&&t?"and":""}termsTemplate(){const{termsConditionsUrl:e}=B.state;return e?t`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){const{privacyPolicyUrl:e}=B.state;return e?t`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?t`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:t`<wui-ux-by-reown></wui-ux-by-reown>`:null}};Si.styles=[xi],Ti([n()],Si.prototype,"remoteFeatures",void 0),Si=Ti([Q("w3m-legal-footer")],Si);const Ai=o``;let $i=class extends e{render(){const{termsConditionsUrl:e,privacyPolicyUrl:i}=B.state;return e||i?t`
      <wui-flex
        .padding=${["4","3","3","3"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <wui-text color="secondary" variant="md-regular" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `:null}howDoesItWorkTemplate(){return t` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){m.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:w(y.state.activeChain)===g.ACCOUNT_TYPES.SMART_ACCOUNT}}),d.push("WhatIsABuy")}};$i.styles=[Ai],$i=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}([Q("w3m-onramp-providers-footer")],$i);const Pi=N`
  :host {
    display: block;
  }

  div.container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    height: auto;
    display: block;
  }

  div.container[status='hide'] {
    animation: fade-out;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: 0s;
  }

  div.container[status='show'] {
    animation: fade-in;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      filter: blur(6px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
      filter: blur(0px);
    }
    to {
      opacity: 0;
      filter: blur(6px);
    }
  }
`;var Ci=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Ii=class extends e{constructor(){super(...arguments),this.resizeObserver=void 0,this.unsubscribe=[],this.status="hide",this.view=d.state.view}firstUpdated(){this.status=ki.hasFooter()?"show":"hide",this.unsubscribe.push(d.subscribeKey("view",e=>{if(this.view=e,this.status=ki.hasFooter()?"show":"hide","hide"===this.status){document.documentElement.style.setProperty("--apkt-footer-height","0px")}})),this.resizeObserver=new ResizeObserver(e=>{for(const t of e)if(t.target===this.getWrapper()){const e=`${t.contentRect.height}px`;document.documentElement.style.setProperty("--apkt-footer-height",e)}}),this.resizeObserver.observe(this.getWrapper())}render(){return t`
      <div class="container" status=${this.status}>${this.templatePageContainer()}</div>
    `}templatePageContainer(){return ki.hasFooter()?t` ${this.templateFooter()}`:null}templateFooter(){switch(this.view){case"Networks":return this.templateNetworksFooter();case"Connect":case"ConnectWallets":case"OnRampFiatSelect":case"OnRampTokenSelect":return t`<w3m-legal-footer></w3m-legal-footer>`;case"OnRampProviders":return t`<w3m-onramp-providers-footer></w3m-onramp-providers-footer>`;default:return null}}templateNetworksFooter(){return t` <wui-flex
      class="footer-in"
      padding="3"
      flexDirection="column"
      gap="3"
      alignItems="center"
    >
      <wui-text variant="md-regular" color="secondary" align="center">
        Your connected wallet may not support some of the networks available for this dApp
      </wui-text>
      <wui-link @click=${this.onNetworkHelp.bind(this)}>
        <wui-icon size="sm" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
        What is a network
      </wui-link>
    </wui-flex>`}onNetworkHelp(){m.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),d.push("WhatIsANetwork")}getWrapper(){return this.shadowRoot?.querySelector("div.container")}};Ii.styles=[Pi],Ci([n()],Ii.prototype,"status",void 0),Ci([n()],Ii.prototype,"view",void 0),Ii=Ci([Q("w3m-footer")],Ii);const Ei=N`
  :host {
    display: block;
    width: inherit;
  }
`;var Ni=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Ri=class extends e{constructor(){super(),this.unsubscribe=[],this.viewState=d.state.view,this.history=d.state.history.join(","),this.unsubscribe.push(d.subscribeKey("view",()=>{this.history=d.state.history.join(","),document.documentElement.style.setProperty("--apkt-duration-dynamic","var(--apkt-durations-lg)")}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),document.documentElement.style.setProperty("--apkt-duration-dynamic","0s")}render(){return t`${this.templatePageContainer()}`}templatePageContainer(){return t`<w3m-router-container
      history=${this.history}
      .setView=${()=>{this.viewState=d.state.view}}
    >
      ${this.viewTemplate(this.viewState)}
    </w3m-router-container>`}viewTemplate(e){switch(e){case"AccountSettings":return t`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return t`<w3m-account-view></w3m-account-view>`;case"AllWallets":return t`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return t`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return t`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return t`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return t`<w3m-connect-view></w3m-connect-view>`;case"Create":return t`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return t`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return t`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return t`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return t`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return t`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return t`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return t`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return t`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return t`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return t`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return t`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return t`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return t`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return t`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return t`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return t`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return t`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return t`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return t`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return t`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return t`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return t`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return t`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return t`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return t`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return t`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return t`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return t`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return t`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return t`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return t`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return t`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WalletSendConfirmed":return t`<w3m-send-confirmed-view></w3m-send-confirmed-view>`;case"WhatIsABuy":return t`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return t`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return t`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return t`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return t`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return t`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return t`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return t`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return t`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return t`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return t`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return t`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return t`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return t`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return t`<w3m-pay-loading-view></w3m-pay-loading-view>`;case"PayQuote":return t`<w3m-pay-quote-view></w3m-pay-quote-view>`;case"FundWallet":return t`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case"PayWithExchange":return t`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`;case"PayWithExchangeSelectAsset":return t`<w3m-deposit-from-exchange-select-asset-view></w3m-deposit-from-exchange-select-asset-view>`;case"UsageExceeded":return t`<w3m-usage-exceeded-view></w3m-usage-exceeded-view>`;case"SmartAccountSettings":return t`<w3m-smart-account-settings-view></w3m-smart-account-settings-view>`}}};Ri.styles=[Ei],Ni([n()],Ri.prototype,"viewState",void 0),Ni([n()],Ri.prototype,"history",void 0),Ri=Ni([Q("w3m-router")],Ri);const Oi=N`
  :host {
    z-index: ${({tokens:e})=>e.core.zIndex};
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
    background-color: ${({tokens:e})=>e.theme.overlay};
    backdrop-filter: blur(0px);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      backdrop-filter ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
    backdrop-filter: blur(8px);
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--apkt-modal-width);
    width: 100%;
    position: relative;
    outline: none;
    transform: translateY(4px);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    transition:
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: border-radius, background-color, transform, box-shadow;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: var(--local-modal-padding);
    box-sizing: border-box;
  }

  :host(.open) wui-card {
    transform: translateY(0px);
  }

  wui-card::before {
    z-index: 1;
    pointer-events: none;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    transition-delay: ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  :host([data-mobile-fullscreen='true']) wui-card::before {
    border-radius: 0px;
  }

  :host([data-border='true']) wui-card::before {
    box-shadow: inset 0px 0px 0px 4px ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-border='false']) wui-card::before {
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.borderPrimaryDark};
  }

  :host([data-border='true']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-border var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  :host([data-border='false']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-default var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: 0s;
  }

  :host(.appkit-modal) wui-card {
    max-width: var(--apkt-modal-width);
  }

  wui-card[shake='true'] {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      w3m-shake ${({durations:e})=>e.xl}
        ${({easings:e})=>e["ease-out-power-2"]};
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
      margin: var(--apkt-spacing-6) 0px;
    }
  }

  @media (max-width: 430px) {
    :host([data-mobile-fullscreen='true']) {
      height: 100dvh;
    }
    :host([data-mobile-fullscreen='true']) wui-flex {
      align-items: stretch;
    }
    :host([data-mobile-fullscreen='true']) wui-card {
      max-width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
    }
    :host(:not([data-mobile-fullscreen='true'])) wui-flex {
      align-items: flex-end;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card {
      max-width: 100%;
      border-bottom: none;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card[data-embedded='true'] {
      border-bottom-left-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
      border-bottom-right-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card:not([data-embedded='true']) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    wui-card[shake='true'] {
      animation: w3m-shake 0.5s ${({easings:e})=>e["ease-out-power-2"]};
    }
  }

  @keyframes fade-in {
    0% {
      transform: scale(0.99) translateY(4px);
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

  @keyframes card-background-border {
    from {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  @keyframes card-background-default {
    from {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
  }
`;var zi=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};const Di="scroll-lock",Ui={PayWithExchange:"0",PayWithExchangeSelectAsset:"0",Pay:"0",PayQuote:"0",PayLoading:"0"};class Wi extends e{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=B.state.enableEmbedded,this.open=I.state.open,this.caipAddress=y.state.activeCaipAddress,this.caipNetwork=y.state.activeCaipNetwork,this.shake=I.state.shake,this.filterByNamespace=A.state.filterByNamespace,this.padding=q.spacing[1],this.mobileFullScreen=B.state.enableMobileFullScreen,this.initializeTheming(),M.prefetchAnalyticsConfig(),this.unsubscribe.push(I.subscribeKey("open",e=>e?this.onOpen():this.onClose()),I.subscribeKey("shake",e=>this.shake=e),y.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),y.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),B.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),A.subscribeKey("filterByNamespace",e=>{this.filterByNamespace===e||y.getAccountData(e)?.caipAddress||(M.fetchRecommendedWallets(),this.filterByNamespace=e)}),d.subscribeKey("view",()=>{this.dataset.border=ki.hasFooter()?"true":"false",this.padding=Ui[d.state.view]??q.spacing[1]}))}firstUpdated(){if(this.dataset.border=ki.hasFooter()?"true":"false",this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.caipAddress){if(this.enableEmbedded)return I.close(),void this.prefetch();this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.setProperty("--local-modal-padding",this.padding),this.enableEmbedded?t`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?t`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return t` <wui-card
      shake="${this.shake}"
      data-embedded="${s(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-footer></w3m-footer>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){if(e.target===e.currentTarget){if(this.mobileFullScreen)return;await this.handleClose()}}async handleClose(){await ne.safeClose()}initializeTheming(){const{themeVariables:e,themeMode:t}=H.state,i=Y.getColorTheme(t);V(e,i)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),u.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=Di,e.textContent="\n      body {\n        touch-action: none;\n        overflow: hidden;\n        overscroll-behavior: contain;\n      }\n      w3m-modal {\n        pointer-events: auto;\n      }\n    ",document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${Di}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){const{tagName:i}=t.target;!i||i.includes("W3M-")||i.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){const t=y.state.isSwitchingNamespace,i="ProfileWallets"===d.state.view;!e&&!t&&!i&&I.close(),await E.initializeIfEnabled(e),this.caipAddress=e,y.setIsSwitchingNamespace(!1)}onNewNetwork(e){const t=this.caipNetwork,i=t?.caipNetworkId?.toString(),o=e?.caipNetworkId?.toString(),a=i!==o,n="UnsupportedChain"===d.state.view,r=I.state.open;let s=!1;this.enableEmbedded&&"SwitchNetwork"===d.state.view&&(s=!0),a&&ie.resetState(),r&&n&&(s=!0),s&&"SIWXSignMessage"!==d.state.view&&d.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(M.prefetch(),M.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}Wi.styles=Oi,zi([a({type:Boolean})],Wi.prototype,"enableEmbedded",void 0),zi([n()],Wi.prototype,"open",void 0),zi([n()],Wi.prototype,"caipAddress",void 0),zi([n()],Wi.prototype,"caipNetwork",void 0),zi([n()],Wi.prototype,"shake",void 0),zi([n()],Wi.prototype,"filterByNamespace",void 0),zi([n()],Wi.prototype,"padding",void 0),zi([n()],Wi.prototype,"mobileFullScreen",void 0);let ji=class extends Wi{};ji=zi([Q("w3m-modal")],ji);let Bi=class extends Wi{};Bi=zi([Q("appkit-modal")],Bi);const Fi=N`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: ${({borderRadius:e})=>e[5]};
    background-color: ${({colors:e})=>e.semanticError010};
  }
`;let Li=class extends e{constructor(){super()}render(){return t`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${["1","3","4","3"]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="error" name="warningCircle"></wui-icon>
        </wui-flex>

        <wui-text variant="lg-medium" color="primary" align="center">
          The app isn't responding as expected
        </wui-text>
        <wui-text variant="md-regular" color="secondary" align="center">
          Try again or reach out to the app team for help.
        </wui-text>

        <wui-button
          variant="neutral-secondary"
          size="md"
          @click=${this.onTryAgainClick.bind(this)}
          data-testid="w3m-usage-exceeded-button"
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try Again
        </wui-button>
      </wui-flex>
    `}onTryAgainClick(){d.goBack()}};Li.styles=Fi,Li=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}([Q("w3m-usage-exceeded-view")],Li);const qi=N`
  :host {
    width: 100%;
  }
`;var _i=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Mi=class extends e{constructor(){super(...arguments),this.hasImpressionSent=!1,this.walletImages=[],this.imageSrc="",this.name="",this.size="md",this.tabIdx=void 0,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100",this.rdnsId="",this.displayIndex=void 0,this.walletRank=void 0,this.namespaces=[]}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupIntersectionObserver()}updated(e){super.updated(e),(e.has("name")||e.has("imageSrc")||e.has("walletRank"))&&(this.hasImpressionSent=!1);e.has("walletRank")&&this.walletRank&&!this.intersectionObserver&&this.setupIntersectionObserver()}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{!e.isIntersecting||this.loading||this.hasImpressionSent||this.sendImpressionEvent()})},{threshold:.1}),this.intersectionObserver.observe(this)}cleanupIntersectionObserver(){this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=void 0)}sendImpressionEvent(){this.name&&!this.hasImpressionSent&&this.walletRank&&(this.hasImpressionSent=!0,(this.rdnsId||this.name)&&m.sendWalletImpressionEvent({name:this.name,walletRank:this.walletRank,rdnsId:this.rdnsId,view:d.state.view,displayIndex:this.displayIndex}))}handleGetWalletNamespaces(){return Object.keys(K.state.adapters).length>1?this.namespaces:[]}render(){return t`
      <wui-list-wallet
        .walletImages=${this.walletImages}
        imageSrc=${s(this.imageSrc)}
        name=${this.name}
        size=${s(this.size)}
        tagLabel=${s(this.tagLabel)}
        .tagVariant=${this.tagVariant}
        .walletIcon=${this.walletIcon}
        .tabIdx=${this.tabIdx}
        .disabled=${this.disabled}
        .showAllWallets=${this.showAllWallets}
        .loading=${this.loading}
        loadingSpinnerColor=${this.loadingSpinnerColor}
        .namespaces=${this.handleGetWalletNamespaces()}
      ></wui-list-wallet>
    `}};Mi.styles=qi,_i([a({type:Array})],Mi.prototype,"walletImages",void 0),_i([a()],Mi.prototype,"imageSrc",void 0),_i([a()],Mi.prototype,"name",void 0),_i([a()],Mi.prototype,"size",void 0),_i([a()],Mi.prototype,"tagLabel",void 0),_i([a()],Mi.prototype,"tagVariant",void 0),_i([a()],Mi.prototype,"walletIcon",void 0),_i([a()],Mi.prototype,"tabIdx",void 0),_i([a({type:Boolean})],Mi.prototype,"disabled",void 0),_i([a({type:Boolean})],Mi.prototype,"showAllWallets",void 0),_i([a({type:Boolean})],Mi.prototype,"loading",void 0),_i([a({type:String})],Mi.prototype,"loadingSpinnerColor",void 0),_i([a()],Mi.prototype,"rdnsId",void 0),_i([a()],Mi.prototype,"displayIndex",void 0),_i([a()],Mi.prototype,"walletRank",void 0),_i([a({type:Array})],Mi.prototype,"namespaces",void 0),Mi=_i([Q("w3m-list-wallet")],Mi);const Hi=N`
  :host {
    --local-duration-height: 0s;
    --local-duration: ${({durations:e})=>e.lg};
    --local-transition: ${({easings:e})=>e["ease-out-power-2"]};
  }

  .container {
    display: block;
    overflow: hidden;
    overflow: hidden;
    position: relative;
    height: var(--local-container-height);
    transition: height var(--local-duration-height) var(--local-transition);
    will-change: height, padding-bottom;
  }

  .container[data-mobile-fullscreen='true'] {
    overflow: scroll;
  }

  .page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    width: inherit;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-bottom-left-radius: var(--local-border-bottom-radius);
    border-bottom-right-radius: var(--local-border-bottom-radius);
    transition: border-bottom-left-radius var(--local-duration) var(--local-transition);
  }

  .page[data-mobile-fullscreen='true'] {
    height: 100%;
  }

  .page-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .footer {
    height: var(--apkt-footer-height);
  }

  div.page[view-direction^='prev-'] .page-content {
    animation:
      slide-left-out var(--local-duration) forwards var(--local-transition),
      slide-left-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  div.page[view-direction^='next-'] .page-content {
    animation:
      slide-right-out var(--local-duration) forwards var(--local-transition),
      slide-right-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }
`;var Vi=function(e,t,i,o){var a,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Ki=class extends e{constructor(){super(...arguments),this.resizeObserver=void 0,this.transitionDuration="0.15s",this.transitionFunction="",this.history="",this.view="",this.setView=void 0,this.viewDirection="",this.historyState="",this.previousHeight="0px",this.mobileFullScreen=B.state.enableMobileFullScreen,this.onViewportResize=()=>{this.updateContainerHeight()}}updated(e){if(e.has("history")){const e=this.history;""!==this.historyState&&this.historyState!==e&&this.onViewChange(e)}e.has("transitionDuration")&&this.style.setProperty("--local-duration",this.transitionDuration),e.has("transitionFunction")&&this.style.setProperty("--local-transition",this.transitionFunction)}firstUpdated(){this.transitionFunction&&this.style.setProperty("--local-transition",this.transitionFunction),this.style.setProperty("--local-duration",this.transitionDuration),this.historyState=this.history,this.resizeObserver=new ResizeObserver(e=>{for(const t of e)if(t.target===this.getWrapper()){let e=t.contentRect.height;const i=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");if(this.mobileFullScreen){e=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-i,this.style.setProperty("--local-border-bottom-radius","0px")}else{e=e+i,this.style.setProperty("--local-border-bottom-radius",i?"var(--apkt-borderRadius-5)":"0px")}this.style.setProperty("--local-container-height",`${e}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${e}px`}}),this.resizeObserver.observe(this.getWrapper()),this.updateContainerHeight(),window.addEventListener("resize",this.onViewportResize),window.visualViewport?.addEventListener("resize",this.onViewportResize)}disconnectedCallback(){const e=this.getWrapper();e&&this.resizeObserver&&this.resizeObserver.unobserve(e),window.removeEventListener("resize",this.onViewportResize),window.visualViewport?.removeEventListener("resize",this.onViewportResize)}render(){return t`
      <div class="container" data-mobile-fullscreen="${s(this.mobileFullScreen)}">
        <div
          class="page"
          data-mobile-fullscreen="${s(this.mobileFullScreen)}"
          view-direction="${this.viewDirection}"
        >
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}onViewChange(e){const t=e.split(",").filter(Boolean),i=this.historyState.split(",").filter(Boolean),o=i.length,a=t.length,n=t[t.length-1]||"",r=Y.cssDurationToNumber(this.transitionDuration);let s="";a>o?s="next":a<o?s="prev":a===o&&t[a-1]!==i[o-1]&&(s="next"),this.viewDirection=`${s}-${n}`,setTimeout(()=>{this.historyState=e,this.setView?.(n)},r),setTimeout(()=>{this.viewDirection=""},2*r)}getWrapper(){return this.shadowRoot?.querySelector("div.page")}updateContainerHeight(){const e=this.getWrapper();if(!e)return;const t=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");let i=0;if(this.mobileFullScreen){i=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-t,this.style.setProperty("--local-border-bottom-radius","0px")}else i=e.getBoundingClientRect().height+t,this.style.setProperty("--local-border-bottom-radius",t?"var(--apkt-borderRadius-5)":"0px");this.style.setProperty("--local-container-height",`${i}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${i}px`}getHeaderHeight(){return 60}};Ki.styles=[Hi],Vi([a({type:String})],Ki.prototype,"transitionDuration",void 0),Vi([a({type:String})],Ki.prototype,"transitionFunction",void 0),Vi([a({type:String})],Ki.prototype,"history",void 0),Vi([a({type:String})],Ki.prototype,"view",void 0),Vi([a({attribute:!1})],Ki.prototype,"setView",void 0),Vi([n()],Ki.prototype,"viewDirection",void 0),Vi([n()],Ki.prototype,"historyState",void 0),Vi([n()],Ki.prototype,"previousHeight",void 0),Vi([n()],Ki.prototype,"mobileFullScreen",void 0),Ki=Vi([Q("w3m-router-container")],Ki);export{Bi as AppKitModal,Mi as W3mListWallet,ji as W3mModal,Wi as W3mModalBase,Ki as W3mRouterContainer,Li as W3mUsageExceededView};
