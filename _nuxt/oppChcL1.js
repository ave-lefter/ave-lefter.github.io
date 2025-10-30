import{a as e,i as t}from"./CCEllq-w.js";import{x as o}from"./VimA5MXm.js";import{n as i,r as a}from"./B0Q-iWHb.js";import{c as r,o as n,U as s}from"./zaFy8tHJ.js";import{N as c,w as l,p as d,R as u,S as p,b as w,c as h,E as m,o as g,q as f,l as v,B as b,a as y,s as k,t as T,u as x,k as S,x as C,C as A,y as P,z as $,M as I,D as E,d as N,r as R,h as W,v as O,g as D,e as z,F as B,O as U,A as F,T as j,G as L,P as H}from"./rH1-ws5Z.js";import"#entry";const V={getGasPriceInEther:(e,t)=>Number(t*e)/1e18,getGasPriceInUSD(e,t,o){const i=V.getGasPriceInEther(t,o);return c.bigNumber(e).times(i).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:o,toTokenAmount:i}){const a=c.bigNumber(e).times(t),r=c.bigNumber(i).times(o);return a.minus(r).div(a).times(100).toNumber()},getMaxSlippage(e,t){const o=c.bigNumber(e).div(100);return c.multiply(t,o).toNumber()},getProviderFee:(e,t=.0085)=>c.bigNumber(e).times(t).toString(),isInsufficientNetworkTokenForGas(e,t){const o=t||"0";return!!c.bigNumber(e).eq(0)||c.bigNumber(c.bigNumber(o)).gt(e)},isInsufficientSourceTokenForSwap(e,t,o){const i=o?.find(e=>e.address===t)?.quantity?.numeric;return c.bigNumber(i||"0").lt(e)}},M=15e4,_={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,switchingTokens:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:S.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},K=d({..._}),G={state:K,subscribe:e=>$(K,()=>e(K)),subscribeKey:(e,t)=>P(K,e,t),getParams(){const e=v.state.activeChain,t=v.getAccountData(e)?.caipAddress??v.state.activeCaipAddress,o=y.getPlainAddress(t),i=C(),a=A.getConnectorId(v.state.activeChain);if(!o)throw new Error("No address found to swap the tokens from.");const r=!K.toToken?.address||!K.toToken?.decimals,n=!K.sourceToken?.address||!K.sourceToken?.decimals||!c.bigNumber(K.sourceTokenAmount).gt(0),s=!K.sourceTokenAmount;return{networkAddress:i,fromAddress:o,fromCaipAddress:t,sourceTokenAddress:K.sourceToken?.address,toTokenAddress:K.toToken?.address,toTokenAmount:K.toTokenAmount,toTokenDecimals:K.toToken?.decimals,sourceTokenAmount:K.sourceTokenAmount,sourceTokenDecimals:K.sourceToken?.decimals,invalidToToken:r,invalidSourceToken:n,invalidSourceTokenAmount:s,availableToSwap:t&&!r&&!n&&!s,isAuthConnector:a===h.CONNECTOR_ID.AUTH}},async setSourceToken(e){if(!e)return K.sourceToken=e,K.sourceTokenAmount="",void(K.sourceTokenPriceInUSD=0);K.sourceToken=e,await Y.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){K.sourceTokenAmount=e},async setToToken(e){if(!e)return K.toToken=e,K.toTokenAmount="",void(K.toTokenPriceInUSD=0);K.toToken=e,await Y.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){K.toTokenAmount=e?c.toFixed(e,6):""},async setTokenPrice(e,t){let o=K.tokensPriceMap[e]||0;o||(K.loadingPrices=!0,o=await Y.getAddressPrice(e)),"sourceToken"===t?K.sourceTokenPriceInUSD=o:"toToken"===t&&(K.toTokenPriceInUSD=o),K.loadingPrices&&(K.loadingPrices=!1),Y.getParams().availableToSwap&&!K.switchingTokens&&Y.swapTokens()},async switchTokens(){if(!K.initializing&&K.initialized&&!K.switchingTokens){K.switchingTokens=!0;try{const e=K.toToken?{...K.toToken}:void 0,t=K.sourceToken?{...K.sourceToken}:void 0,o=e&&""===K.toTokenAmount?"1":K.toTokenAmount;Y.setSourceTokenAmount(o),Y.setToTokenAmount(""),await Y.setSourceToken(e),await Y.setToToken(t),K.switchingTokens=!1,Y.swapTokens()}catch(e){throw K.switchingTokens=!1,e}}},resetState(){K.myTokensWithBalance=_.myTokensWithBalance,K.tokensPriceMap=_.tokensPriceMap,K.initialized=_.initialized,K.initializing=_.initializing,K.switchingTokens=_.switchingTokens,K.sourceToken=_.sourceToken,K.sourceTokenAmount=_.sourceTokenAmount,K.sourceTokenPriceInUSD=_.sourceTokenPriceInUSD,K.toToken=_.toToken,K.toTokenAmount=_.toTokenAmount,K.toTokenPriceInUSD=_.toTokenPriceInUSD,K.networkPrice=_.networkPrice,K.networkTokenSymbol=_.networkTokenSymbol,K.networkBalanceInUSD=_.networkBalanceInUSD,K.inputError=_.inputError},resetValues(){const{networkAddress:e}=Y.getParams(),t=K.tokens?.find(t=>t.address===e);Y.setSourceToken(t),Y.setToToken(void 0)},getApprovalLoadingState:()=>K.loadingApprovalTransaction,clearError(){K.transactionError=void 0},async initializeState(){if(!K.initializing){if(K.initializing=!0,!K.initialized)try{await Y.fetchTokens(),K.initialized=!0}catch(e){K.initialized=!1,p.showError("Failed to initialize swap"),u.goBack()}K.initializing=!1}},async fetchTokens(){const{networkAddress:e}=Y.getParams();await Y.getNetworkTokenPrice(),await Y.getMyTokensWithBalance();const t=K.myTokensWithBalance?.find(t=>t.address===e);t&&(K.networkTokenSymbol=t.symbol,Y.setSourceToken(t),Y.setSourceTokenAmount("0"))},async getTokenList(){const e=v.state.activeCaipNetwork?.caipNetworkId;if(K.caipNetworkId!==e||!K.tokens)try{K.tokensLoading=!0;const t=await k.getTokenList(e);K.tokens=t,K.caipNetworkId=e,K.popularTokens=t.sort((e,t)=>e.symbol<t.symbol?-1:e.symbol>t.symbol?1:0),K.suggestedTokens=t.filter(e=>!!S.SWAP_SUGGESTED_TOKENS.includes(e.symbol))}catch(t){K.tokens=[],K.popularTokens=[],K.suggestedTokens=[]}finally{K.tokensLoading=!1}},async getAddressPrice(e){const t=K.tokensPriceMap[e];if(t)return t;const o=await b.fetchTokenPrice({addresses:[e]}),i=o?.fungibles||[],a=[...K.tokens||[],...K.myTokensWithBalance||[]],r=a?.find(t=>t.address===e)?.symbol,n=i.find(e=>e.symbol.toLowerCase()===r?.toLowerCase())?.price||0,s=parseFloat(n.toString());return K.tokensPriceMap[e]=s,s},async getNetworkTokenPrice(){const{networkAddress:e}=Y.getParams(),t=await b.fetchTokenPrice({addresses:[e]}).catch(()=>(p.showError("Failed to fetch network token price"),{fungibles:[]})),o=t.fungibles?.[0],i=o?.price.toString()||"0";K.tokensPriceMap[e]=parseFloat(i),K.networkTokenSymbol=o?.symbol||"",K.networkPrice=i},async getMyTokensWithBalance(e){const t=await x.getMyTokensWithBalance(e),o=k.mapBalancesToSwapTokens(t);o&&(await Y.getInitialGasPrice(),Y.setBalances(o))},setBalances(e){const{networkAddress:t}=Y.getParams(),o=v.state.activeCaipNetwork;if(!o)return;const i=e.find(e=>e.address===t);e.forEach(e=>{K.tokensPriceMap[e.address]=e.price||0}),K.myTokensWithBalance=e.filter(e=>e.address.startsWith(o.caipNetworkId)),K.networkBalanceInUSD=i?c.multiply(i.quantity.numeric,i.price).toString():"0"},async getInitialGasPrice(){const e=await k.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(v.state?.activeCaipNetwork?.chainNamespace){case h.CHAIN.SOLANA:return K.gasFee=e.standard??"0",K.gasPriceInUSD=c.multiply(e.standard,K.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(K.gasFee),gasPriceInUSD:Number(K.gasPriceInUSD)};case h.CHAIN.EVM:default:const t=e.standard??"0",o=BigInt(t),i=BigInt(M),a=V.getGasPriceInUSD(K.networkPrice,i,o);return K.gasFee=t,K.gasPriceInUSD=a,{gasPrice:o,gasPriceInUSD:a}}},async swapTokens(){const e=v.getAccountData()?.address,t=K.sourceToken,o=K.toToken,i=c.bigNumber(K.sourceTokenAmount).gt(0);if(i||Y.setToTokenAmount(""),!o||!t||K.loadingPrices||!i||!e)return;K.loadingQuote=!0;const a=c.bigNumber(K.sourceTokenAmount).times(10**t.decimals).round(0);try{const i=await b.fetchSwapQuote({userAddress:e,from:t.address,to:o.address,gasPrice:K.gasFee,amount:a.toString()});K.loadingQuote=!1;const r=i?.quotes?.[0]?.toAmount;if(!r)return void T.open({displayMessage:"Incorrect amount",debugMessage:"Please enter a valid amount"},"error");const n=c.bigNumber(r).div(10**o.decimals).toString();Y.setToTokenAmount(n);Y.hasInsufficientToken(K.sourceTokenAmount,t.address)?K.inputError="Insufficient balance":(K.inputError=void 0,Y.setTransactionDetails())}catch(r){const e=await k.handleSwapError(r);K.loadingQuote=!1,K.inputError=e||"Insufficient balance"}},async getTransaction(){const{fromCaipAddress:e,availableToSwap:t}=Y.getParams(),o=K.sourceToken,i=K.toToken;if(e&&t&&o&&i&&!K.loadingQuote)try{K.loadingBuildTransaction=!0;let t;return t=await k.fetchSwapAllowance({userAddress:e,tokenAddress:o.address,sourceTokenAmount:K.sourceTokenAmount,sourceTokenDecimals:o.decimals})?await Y.createSwapTransaction():await Y.createAllowanceTransaction(),K.loadingBuildTransaction=!1,K.fetchError=!1,t}catch(a){return u.goBack(),p.showError("Failed to check allowance"),K.loadingBuildTransaction=!1,K.approvalTransaction=void 0,K.swapTransaction=void 0,void(K.fetchError=!0)}},async createAllowanceTransaction(){const{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:o}=Y.getParams();if(e&&o){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{const i=await b.generateApproveCalldata({from:t,to:o,userAddress:e}),a=y.getPlainAddress(i.tx.from);if(!a)throw new Error("SwapController:createAllowanceTransaction - address is required");const r={data:i.tx.data,to:a,gasPrice:BigInt(i.tx.eip155.gasPrice),value:BigInt(i.tx.value),toAmount:K.toTokenAmount};return K.swapTransaction=void 0,K.approvalTransaction={data:r.data,to:r.to,gasPrice:r.gasPrice,value:r.value,toAmount:r.toAmount},{data:r.data,to:r.to,gasPrice:r.gasPrice,value:r.value,toAmount:r.toAmount}}catch(i){return u.goBack(),p.showError("Failed to create approval transaction"),K.approvalTransaction=void 0,K.swapTransaction=void 0,void(K.fetchError=!0)}}},async createSwapTransaction(){const{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:o}=Y.getParams(),i=K.sourceToken,a=K.toToken;if(!(t&&o&&i&&a))return;const r=w.parseUnits(o,i.decimals)?.toString();try{const o=await b.generateSwapCalldata({userAddress:t,from:i.address,to:a.address,amount:r,disableEstimate:!0}),n=i.address===e,s=BigInt(o.tx.eip155.gas),c=BigInt(o.tx.eip155.gasPrice),l=y.getPlainAddress(o.tx.to);if(!l)throw new Error("SwapController:createSwapTransaction - address is required");const d={data:o.tx.data,to:l,gas:s,gasPrice:c,value:n?BigInt(r??"0"):BigInt("0"),toAmount:K.toTokenAmount};return K.gasPriceInUSD=V.getGasPriceInUSD(K.networkPrice,s,c),K.approvalTransaction=void 0,K.swapTransaction=d,d}catch(n){return u.goBack(),p.showError("Failed to create transaction"),K.approvalTransaction=void 0,K.swapTransaction=void 0,void(K.fetchError=!0)}},onEmbeddedWalletApprovalSuccess(){p.showLoading("Approve limit increase in your wallet"),u.replace("SwapPreview")},async sendTransactionForApproval(e){const{fromAddress:t,isAuthConnector:o}=Y.getParams();K.loadingApprovalTransaction=!0;o?u.pushTransactionStack({onSuccess:Y.onEmbeddedWalletApprovalSuccess}):p.showLoading("Approve limit increase in your wallet");try{await w.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:h.CHAIN.EVM}),await Y.swapTokens(),await Y.getTransaction(),K.approvalTransaction=void 0,K.loadingApprovalTransaction=!1}catch(i){const e=i;K.transactionError=e?.displayMessage,K.loadingApprovalTransaction=!1,p.showError(e?.displayMessage||"Transaction error"),m.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:e?.displayMessage||e?.message||"Unknown",network:v.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:Y.state.sourceToken?.symbol||"",swapToToken:Y.state.toToken?.symbol||"",swapFromAmount:Y.state.sourceTokenAmount||"",swapToAmount:Y.state.toTokenAmount||"",isSmartAccount:g(h.CHAIN.EVM)===f.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;const{fromAddress:t,toTokenAmount:o,isAuthConnector:i}=Y.getParams();K.loadingTransaction=!0;const a=`Swapping ${K.sourceToken?.symbol} to ${c.formatNumberToLocalString(o,3)} ${K.toToken?.symbol}`,r=`Swapped ${K.sourceToken?.symbol} to ${c.formatNumberToLocalString(o,3)} ${K.toToken?.symbol}`;i?u.pushTransactionStack({onSuccess(){u.replace("Account"),p.showLoading(a),G.resetState()}}):p.showLoading("Confirm transaction in your wallet");try{const o=[K.sourceToken?.address,K.toToken?.address].join(","),a=await w.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:h.CHAIN.EVM});return K.loadingTransaction=!1,p.showSuccess(r),m.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:v.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:Y.state.sourceToken?.symbol||"",swapToToken:Y.state.toToken?.symbol||"",swapFromAmount:Y.state.sourceTokenAmount||"",swapToAmount:Y.state.toTokenAmount||"",isSmartAccount:g(h.CHAIN.EVM)===f.ACCOUNT_TYPES.SMART_ACCOUNT}}),G.resetState(),i||u.replace("Account"),G.getMyTokensWithBalance(o),a}catch(n){const e=n;return K.transactionError=e?.displayMessage,K.loadingTransaction=!1,p.showError(e?.displayMessage||"Transaction error"),void m.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:e?.displayMessage||e?.message||"Unknown",network:v.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:Y.state.sourceToken?.symbol||"",swapToToken:Y.state.toToken?.symbol||"",swapFromAmount:Y.state.sourceTokenAmount||"",swapToAmount:Y.state.toTokenAmount||"",isSmartAccount:g(h.CHAIN.EVM)===f.ACCOUNT_TYPES.SMART_ACCOUNT}})}},hasInsufficientToken:(e,t)=>V.isInsufficientSourceTokenForSwap(e,t,K.myTokensWithBalance),setTransactionDetails(){const{toTokenAddress:e,toTokenDecimals:t}=Y.getParams();e&&t&&(K.gasPriceInUSD=V.getGasPriceInUSD(K.networkPrice,BigInt(K.gasFee),BigInt(M)),K.priceImpact=V.getPriceImpact({sourceTokenAmount:K.sourceTokenAmount,sourceTokenPriceInUSD:K.sourceTokenPriceInUSD,toTokenPriceInUSD:K.toTokenPriceInUSD,toTokenAmount:K.toTokenAmount}),K.maxSlippage=V.getMaxSlippage(K.slippage,K.toTokenAmount),K.providerFee=V.getProviderFee(K.sourceTokenAmount))}},Y=l(G),X=d({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),q=l({state:X,subscribe:e=>$(X,()=>e(X)),subscribeKey:(e,t)=>P(X,e,t),showTooltip({message:e,triggerRect:t,variant:o}){X.open=!0,X.message=e,X.triggerRect=t,X.variant=o},hide(){X.open=!1,X.message="",X.triggerRect={width:0,height:0,top:0,left:0}}}),Q={isUnsupportedChainView:()=>"UnsupportedChain"===u.state.view||"SwitchNetwork"===u.state.view&&u.state.history.includes("UnsupportedChain"),async safeClose(){if(this.isUnsupportedChainView())return void I.shake();await E.isSIWXCloseDisabled()?I.shake():("DataCapture"!==u.state.view&&"DataCaptureOtpConfirm"!==u.state.view||w.disconnect(),I.close())}},Z=N`
  :host {
    display: block;
    border-radius: clamp(0px, ${({borderRadius:e})=>e[8]}, 44px);
    box-shadow: 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    overflow: hidden;
  }
`;let J=class extends e{render(){return o`<slot></slot>`}};J.styles=[R,Z],J=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n}([r("wui-card")],J);const ee=N`
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
`;var te=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const oe={info:"info",success:"checkmark",warning:"warningCircle",error:"warning"};let ie=class extends e{constructor(){super(...arguments),this.message="",this.type="info"}render(){return o`
      <wui-flex
        data-type=${n(this.type)}
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
            <wui-icon color="inherit" size="md" name=${oe[this.type]}></wui-icon>
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
    `}onClose(){T.close()}};ie.styles=[R,ee],te([i()],ie.prototype,"message",void 0),te([i()],ie.prototype,"type",void 0),ie=te([r("wui-alertbar")],ie);const ae=N`
  :host {
    display: block;
    position: absolute;
    top: ${({spacing:e})=>e[3]};
    left: ${({spacing:e})=>e[4]};
    right: ${({spacing:e})=>e[4]};
    opacity: 0;
    pointer-events: none;
  }
`;var re=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const ne={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"warning"}};let se=class extends e{constructor(){super(),this.unsubscribe=[],this.open=T.state.open,this.onOpen(!0),this.unsubscribe.push(T.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:t}=T.state,i=ne[t];return o`
      <wui-alertbar
        message=${e}
        backgroundColor=${i?.backgroundColor}
        iconColor=${i?.iconColor}
        icon=${i?.icon}
        type=${t}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};se.styles=ae,re([a()],se.prototype,"open",void 0),se=re([r("w3m-alertbar")],se);const ce=N`
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
`;var le=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let de=class extends e{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return o`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${n(this.iconSize)}></wui-icon>
    </button>`}};de.styles=[R,W,ce],le([i()],de.prototype,"icon",void 0),le([i()],de.prototype,"variant",void 0),le([i()],de.prototype,"type",void 0),le([i()],de.prototype,"size",void 0),le([i()],de.prototype,"iconSize",void 0),le([i({type:Boolean})],de.prototype,"fullWidth",void 0),le([i({type:Boolean})],de.prototype,"disabled",void 0),de=le([r("wui-icon-button")],de);const ue=N`
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
`;var pe=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const we={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},he={lg:"lg",md:"md",sm:"sm"};let me=class extends e{constructor(){super(...arguments),this.imageSrc="",this.text="",this.size="lg",this.type="text-dropdown",this.disabled=!1}render(){return o`<button ?disabled=${this.disabled} data-size=${this.size} data-type=${this.type}>
      ${this.imageTemplate()} ${this.textTemplate()}
      <wui-flex class="right-icon-container">
        <wui-icon name="chevronBottom"></wui-icon>
      </wui-flex>
    </button>`}textTemplate(){const e=we[this.size];return this.text?o`<wui-text color="primary" variant=${e}>${this.text}</wui-text>`:null}imageTemplate(){if(this.imageSrc)return o`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`;const e=he[this.size];return o` <wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}};me.styles=[R,W,ue],pe([i()],me.prototype,"imageSrc",void 0),pe([i()],me.prototype,"text",void 0),pe([i()],me.prototype,"size",void 0),pe([i()],me.prototype,"type",void 0),pe([i({type:Boolean})],me.prototype,"disabled",void 0),me=pe([r("wui-select")],me);const ge=N`
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
`;var fe=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const ve=["SmartSessionList"],be={PayWithExchange:O.tokens.theme.foregroundPrimary};function ye(){const e=u.state.data?.connector?.name,t=u.state.data?.wallet?.name,o=u.state.data?.network?.name,i=t??e,a=A.getConnectors(),r=1===a.length&&"w3m-email"===a[0]?.id,n=v.getAccountData()?.socialProvider;return{Connect:`Connect ${r?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:i??"Connect Wallet",ConnectingWalletConnect:i??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview Convert",Downloads:i?`Get ${i}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a Wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:o??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade Your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose Name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select Token",SwapPreview:"Preview Swap",WalletSend:"Send",WalletSendPreview:"Review Send",WalletSendSelectToken:"Select Token",WalletSendConfirmed:"Confirmed",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a Wallet?",ConnectWallets:"Connect Wallet",ConnectSocials:"All Socials",ConnectingSocial:n?n.charAt(0).toUpperCase()+n.slice(1):"Connect Social",ConnectingMultiChain:"Select Chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch Chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in Progress",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email",FundWallet:"Fund Wallet",PayWithExchange:"Deposit from Exchange",PayWithExchangeSelectAsset:"Select Asset"}}let ke=class extends e{constructor(){super(),this.unsubscribe=[],this.heading=ye()[u.state.view],this.network=v.state.activeCaipNetwork,this.networkImage=D.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=u.state.view,this.viewDirection="",this.unsubscribe.push(z.subscribeNetworkImages(()=>{this.networkImage=D.getNetworkImage(this.network)}),u.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.heading=ye()[e]},B.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),v.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=D.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=be[u.state.view]??O.tokens.theme.backgroundPrimary;return this.style.setProperty("--local-header-background-color",e),o`
      <wui-flex
        .padding=${["0","4","0","4"]}
        justifyContent="space-between"
        alignItems="center"
      >
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){m.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),u.push("WhatIsAWallet")}async onClose(){await Q.safeClose()}rightHeaderTemplate(){const e=U?.state?.features?.smartSessions;return"Account"===u.state.view&&e?o`<wui-flex>
      <wui-icon-button
        icon="clock"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${()=>u.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-button>
      ${this.closeButtonTemplate()}
    </wui-flex> `:this.closeButtonTemplate()}closeButtonTemplate(){return o`
      <wui-icon-button
        icon="close"
        size="lg"
        type="neutral"
        variant="primary"
        iconSize="lg"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-button>
    `}titleTemplate(){const e=ve.includes(this.view);return o`
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
        ${e?o`<wui-tag variant="accent" size="md">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){const{view:e}=u.state,t="Connect"===e,i=U.state.enableEmbedded,a="ApproveTransaction"===e,r="ConnectingSiwe"===e,s="Account"===e,c=U.state.enableNetworkSwitch,l=a||r||t&&i;return s&&c?o`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${n(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${n(this.networkImage)}
      ></wui-select>`:this.showBack&&!l?o`<wui-icon-button
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-button>`:o`<wui-icon-button
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      size="lg"
      iconSize="lg"
      type="neutral"
      variant="primary"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-button>`}onNetworks(){this.isAllowedNetworkSwitch()&&(m.sendEvent({type:"track",event:"CLICK_NETWORKS"}),u.push("Networks"))}isAllowedNetworkSwitch(){const e=v.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,o=e?.find(({id:e})=>e===this.network?.id);return t||!o}onViewChange(){const{history:e}=u.state;let t=B.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=B.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){const{history:e}=u.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){u.goBack()}};ke.styles=ge,fe([a()],ke.prototype,"heading",void 0),fe([a()],ke.prototype,"network",void 0),fe([a()],ke.prototype,"networkImage",void 0),fe([a()],ke.prototype,"showBack",void 0),fe([a()],ke.prototype,"prevHistoryLength",void 0),fe([a()],ke.prototype,"view",void 0),fe([a()],ke.prototype,"viewDirection",void 0),ke=fe([r("w3m-header")],ke);const Te=N`
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
`;var xe=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Se=class extends e{constructor(){super(...arguments),this.message="",this.variant="success"}render(){return o`
      ${this.templateIcon()}
      <wui-text variant="lg-regular" color="primary" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return"loading"===this.variant?o`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:o`<wui-icon-box
      size="md"
      color=${{success:"success",error:"error",warning:"warning",info:"default"}[this.variant]}
      icon=${{success:"checkmark",error:"warning",warning:"warningCircle",info:"info"}[this.variant]}
    ></wui-icon-box>`}};Se.styles=[R,Te],xe([i()],Se.prototype,"message",void 0),xe([i()],Se.prototype,"variant",void 0),Se=xe([r("wui-snackbar")],Se);const Ce=t`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var Ae=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Pe=class extends e{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=p.state.open,this.unsubscribe.push(p.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:t}=p.state;return o` <wui-snackbar message=${e} variant=${t}></wui-snackbar> `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),p.state.autoClose&&(this.timeout=setTimeout(()=>p.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};Pe.styles=Ce,Ae([a()],Pe.prototype,"open",void 0),Pe=Ae([r("w3m-snackbar")],Pe);const $e=N`
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
    background-color: ${({tokens:e})=>e.theme.textPrimary};
    border: none;
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
`;var Ie=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Ee=class extends e{constructor(){super(),this.unsubscribe=[],this.open=q.state.open,this.message=q.state.message,this.triggerRect=q.state.triggerRect,this.variant=q.state.variant,this.unsubscribe.push(q.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;const e=this.triggerRect.top,t=this.triggerRect.left;return this.style.cssText=`\n    --w3m-tooltip-top: ${e}px;\n    --w3m-tooltip-left: ${t}px;\n    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;\n    --w3m-tooltip-display: ${this.open?"flex":"none"};\n    --w3m-tooltip-opacity: ${this.open?1:0};\n    `,o`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};Ee.styles=[$e],Ie([a()],Ee.prototype,"open",void 0),Ie([a()],Ee.prototype,"message",void 0),Ie([a()],Ee.prototype,"triggerRect",void 0),Ie([a()],Ee.prototype,"variant",void 0),Ee=Ie([r("w3m-tooltip")],Ee);const Ne={getTabsByNamespace:e=>Boolean(e)&&e===h.CHAIN.EVM?!1===U.state.remoteFeatures?.activity?B.ACCOUNT_TABS.filter(e=>"Activity"!==e.label):B.ACCOUNT_TABS:[],isValidReownName:e=>/^[a-zA-Z0-9]+$/gu.test(e),isValidEmail:e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(e),validateReownName:e=>e.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,""),hasFooter(){const e=u.state.view;if(B.VIEWS_WITH_LEGAL_FOOTER.includes(e)){const{termsConditionsUrl:e,privacyPolicyUrl:t}=U.state,o=U.state.features?.legalCheckbox;return!(!e&&!t||o)}return B.VIEWS_WITH_DEFAULT_FOOTER.includes(e)}},Re=N`
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
`;var We=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Oe=class extends e{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=U.state.remoteFeatures,this.unsubscribe.push(U.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=U.state,i=U.state.features?.legalCheckbox;return!e&&!t||i?o`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:o`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["4","3","3","3"]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=U.state;return e&&t?"and":""}termsTemplate(){const{termsConditionsUrl:e}=U.state;return e?o`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){const{privacyPolicyUrl:e}=U.state;return e?o`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?o`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:o`<wui-ux-by-reown></wui-ux-by-reown>`:null}};Oe.styles=[Re],We([a()],Oe.prototype,"remoteFeatures",void 0),Oe=We([r("w3m-legal-footer")],Oe);const De=t``;let ze=class extends e{render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=U.state;return e||t?o`
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
    `:null}howDoesItWorkTemplate(){return o` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){m.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:g(v.state.activeChain)===f.ACCOUNT_TYPES.SMART_ACCOUNT}}),u.push("WhatIsABuy")}};ze.styles=[De],ze=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n}([r("w3m-onramp-providers-footer")],ze);const Be=N`
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
`;var Ue=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Fe=class extends e{constructor(){super(...arguments),this.resizeObserver=void 0,this.unsubscribe=[],this.status="hide",this.view=u.state.view}firstUpdated(){this.status=Ne.hasFooter()?"show":"hide",this.unsubscribe.push(u.subscribeKey("view",e=>{if(this.view=e,this.status=Ne.hasFooter()?"show":"hide","hide"===this.status){document.documentElement.style.setProperty("--apkt-footer-height","0px")}})),this.resizeObserver=new ResizeObserver(e=>{for(const t of e)if(t.target===this.getWrapper()){const e=`${t.contentRect.height}px`;document.documentElement.style.setProperty("--apkt-footer-height",e)}}),this.resizeObserver.observe(this.getWrapper())}render(){return o`
      <div class="container" status=${this.status}>${this.templatePageContainer()}</div>
    `}templatePageContainer(){return Ne.hasFooter()?o` ${this.templateFooter()}`:null}templateFooter(){switch(this.view){case"Networks":return this.templateNetworksFooter();case"Connect":case"ConnectWallets":case"OnRampFiatSelect":case"OnRampTokenSelect":return o`<w3m-legal-footer></w3m-legal-footer>`;case"OnRampProviders":return o`<w3m-onramp-providers-footer></w3m-onramp-providers-footer>`;default:return null}}templateNetworksFooter(){return o` <wui-flex
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
    </wui-flex>`}onNetworkHelp(){m.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),u.push("WhatIsANetwork")}getWrapper(){return this.shadowRoot?.querySelector("div.container")}};Fe.styles=[Be],Ue([a()],Fe.prototype,"status",void 0),Ue([a()],Fe.prototype,"view",void 0),Fe=Ue([r("w3m-footer")],Fe);const je=N`
  :host {
    display: block;
    width: inherit;
  }
`;var Le=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let He=class extends e{constructor(){super(),this.unsubscribe=[],this.viewState=u.state.view,this.history=u.state.history.join(","),this.unsubscribe.push(u.subscribeKey("view",()=>{this.history=u.state.history.join(","),document.documentElement.style.setProperty("--apkt-duration-dynamic","var(--apkt-durations-lg)")}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),document.documentElement.style.setProperty("--apkt-duration-dynamic","0s")}render(){return o`${this.templatePageContainer()}`}templatePageContainer(){return o`<w3m-router-container
      history=${this.history}
      .setView=${()=>{this.viewState=u.state.view}}
    >
      ${this.viewTemplate(this.viewState)}
    </w3m-router-container>`}viewTemplate(e){switch(e){case"AccountSettings":return o`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return o`<w3m-account-view></w3m-account-view>`;case"AllWallets":return o`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return o`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return o`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return o`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return o`<w3m-connect-view></w3m-connect-view>`;case"Create":return o`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return o`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return o`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return o`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return o`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return o`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return o`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return o`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return o`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return o`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return o`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return o`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return o`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return o`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return o`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return o`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return o`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return o`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return o`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return o`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return o`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return o`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return o`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return o`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return o`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return o`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return o`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return o`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return o`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return o`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return o`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return o`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return o`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WalletSendConfirmed":return o`<w3m-send-confirmed-view></w3m-send-confirmed-view>`;case"WhatIsABuy":return o`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return o`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return o`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return o`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return o`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return o`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return o`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return o`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return o`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return o`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return o`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return o`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return o`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return o`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return o`<w3m-pay-loading-view></w3m-pay-loading-view>`;case"FundWallet":return o`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case"PayWithExchange":return o`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`;case"PayWithExchangeSelectAsset":return o`<w3m-deposit-from-exchange-select-asset-view></w3m-deposit-from-exchange-select-asset-view>`}}};He.styles=[je],Le([a()],He.prototype,"viewState",void 0),Le([a()],He.prototype,"history",void 0),He=Le([r("w3m-router")],He);const Ve=N`
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
`;var Me=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const _e="scroll-lock",Ke={PayWithExchange:"0",PayWithExchangeSelectAsset:"0"};class Ge extends e{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=U.state.enableEmbedded,this.open=I.state.open,this.caipAddress=v.state.activeCaipAddress,this.caipNetwork=v.state.activeCaipNetwork,this.shake=I.state.shake,this.filterByNamespace=A.state.filterByNamespace,this.padding=O.spacing[1],this.mobileFullScreen=U.state.enableMobileFullScreen,this.initializeTheming(),F.prefetchAnalyticsConfig(),this.unsubscribe.push(I.subscribeKey("open",e=>e?this.onOpen():this.onClose()),I.subscribeKey("shake",e=>this.shake=e),v.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),v.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),U.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),A.subscribeKey("filterByNamespace",e=>{this.filterByNamespace===e||v.getAccountData(e)?.caipAddress||(F.fetchRecommendedWallets(),this.filterByNamespace=e)}),u.subscribeKey("view",()=>{this.dataset.border=Ne.hasFooter()?"true":"false",this.padding=Ke[u.state.view]??O.spacing[1]}))}firstUpdated(){if(this.dataset.border=Ne.hasFooter()?"true":"false",this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.caipAddress){if(this.enableEmbedded)return I.close(),void this.prefetch();this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.setProperty("--local-modal-padding",this.padding),this.enableEmbedded?o`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?o`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return o` <wui-card
      shake="${this.shake}"
      data-embedded="${n(this.enableEmbedded)}"
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
    </wui-card>`}async onOverlayClick(e){if(e.target===e.currentTarget){if(this.mobileFullScreen)return;await this.handleClose()}}async handleClose(){await Q.safeClose()}initializeTheming(){const{themeVariables:e,themeMode:t}=j.state,o=s.getColorTheme(t);L(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),p.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=_e,e.textContent="\n      body {\n        touch-action: none;\n        overflow: hidden;\n        overscroll-behavior: contain;\n      }\n      w3m-modal {\n        pointer-events: auto;\n      }\n    ",document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${_e}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){const{tagName:o}=t.target;!o||o.includes("W3M-")||o.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){const t=v.state.isSwitchingNamespace,o="ProfileWallets"===u.state.view;e?await this.onConnected({caipAddress:e,isSwitchingNamespace:t,isInProfileView:o}):t||this.enableEmbedded||o||I.close(),await E.initializeIfEnabled(e),this.caipAddress=e,v.setIsSwitchingNamespace(!1)}async onConnected(e){if(e.isInProfileView)return;const{chainNamespace:t,chainId:o,address:i}=H.parseCaipAddress(e.caipAddress),a=`${t}:${o}`,r=!y.getPlainAddress(this.caipAddress),n=await E.getSessions({address:i,caipNetworkId:a}),s=!E.getSIWX()||n.some(e=>e.data.accountAddress===i),c=e.isSwitchingNamespace&&s&&!this.enableEmbedded,l=this.enableEmbedded&&r;c?u.goBack():l&&I.close()}onNewNetwork(e){const t=this.caipNetwork,o=t?.caipNetworkId?.toString(),i=t?.chainNamespace,a=e?.caipNetworkId?.toString(),r=e?.chainNamespace,n=o!==a,s=n&&!(i!==r),c=t?.name===h.UNSUPPORTED_NETWORK_NAME,l="ConnectingExternal"===u.state.view,d="ProfileWallets"===u.state.view,p=!v.getAccountData(e?.chainNamespace)?.caipAddress,w="UnsupportedChain"===u.state.view,m=I.state.open;let g=!1;this.enableEmbedded&&"SwitchNetwork"===u.state.view&&(g=!0),n&&Y.resetState(),!m||l||d||(p?n&&(g=!0):(w||s&&!c)&&(g=!0)),g&&"SIWXSignMessage"!==u.state.view&&u.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(F.prefetch(),F.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}Ge.styles=Ve,Me([i({type:Boolean})],Ge.prototype,"enableEmbedded",void 0),Me([a()],Ge.prototype,"open",void 0),Me([a()],Ge.prototype,"caipAddress",void 0),Me([a()],Ge.prototype,"caipNetwork",void 0),Me([a()],Ge.prototype,"shake",void 0),Me([a()],Ge.prototype,"filterByNamespace",void 0),Me([a()],Ge.prototype,"padding",void 0),Me([a()],Ge.prototype,"mobileFullScreen",void 0);let Ye=class extends Ge{};Ye=Me([r("w3m-modal")],Ye);let Xe=class extends Ge{};Xe=Me([r("appkit-modal")],Xe);const qe=N`
  :host {
    width: 100%;
  }
`;var Qe=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Ze=class extends e{constructor(){super(...arguments),this.hasImpressionSent=!1,this.walletImages=[],this.imageSrc="",this.name="",this.size="md",this.tabIdx=void 0,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100",this.rdnsId="",this.displayIndex=void 0,this.walletRank=void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupIntersectionObserver()}updated(e){super.updated(e),(e.has("name")||e.has("imageSrc")||e.has("walletRank"))&&(this.hasImpressionSent=!1);e.has("walletRank")&&this.walletRank&&!this.intersectionObserver&&this.setupIntersectionObserver()}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{!e.isIntersecting||this.loading||this.hasImpressionSent||this.sendImpressionEvent()})},{threshold:.1}),this.intersectionObserver.observe(this)}cleanupIntersectionObserver(){this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=void 0)}sendImpressionEvent(){this.name&&!this.hasImpressionSent&&this.walletRank&&(this.hasImpressionSent=!0,(this.rdnsId||this.name)&&m.sendWalletImpressionEvent({name:this.name,walletRank:this.walletRank,rdnsId:this.rdnsId,view:u.state.view,displayIndex:this.displayIndex}))}render(){return o`
      <wui-list-wallet
        .walletImages=${this.walletImages}
        imageSrc=${n(this.imageSrc)}
        name=${this.name}
        size=${n(this.size)}
        tagLabel=${n(this.tagLabel)}
        .tagVariant=${this.tagVariant}
        .walletIcon=${this.walletIcon}
        .tabIdx=${this.tabIdx}
        .disabled=${this.disabled}
        .showAllWallets=${this.showAllWallets}
        .loading=${this.loading}
        loadingSpinnerColor=${this.loadingSpinnerColor}
      ></wui-list-wallet>
    `}};Ze.styles=qe,Qe([i({type:Array})],Ze.prototype,"walletImages",void 0),Qe([i()],Ze.prototype,"imageSrc",void 0),Qe([i()],Ze.prototype,"name",void 0),Qe([i()],Ze.prototype,"size",void 0),Qe([i()],Ze.prototype,"tagLabel",void 0),Qe([i()],Ze.prototype,"tagVariant",void 0),Qe([i()],Ze.prototype,"walletIcon",void 0),Qe([i()],Ze.prototype,"tabIdx",void 0),Qe([i({type:Boolean})],Ze.prototype,"disabled",void 0),Qe([i({type:Boolean})],Ze.prototype,"showAllWallets",void 0),Qe([i({type:Boolean})],Ze.prototype,"loading",void 0),Qe([i({type:String})],Ze.prototype,"loadingSpinnerColor",void 0),Qe([i()],Ze.prototype,"rdnsId",void 0),Qe([i()],Ze.prototype,"displayIndex",void 0),Qe([i()],Ze.prototype,"walletRank",void 0),Ze=Qe([r("w3m-list-wallet")],Ze);const Je=N`
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
`;var et=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let tt=class extends e{constructor(){super(...arguments),this.resizeObserver=void 0,this.transitionDuration="0.15s",this.transitionFunction="",this.history="",this.view="",this.setView=void 0,this.viewDirection="",this.historyState="",this.previousHeight="0px",this.mobileFullScreen=U.state.enableMobileFullScreen,this.onViewportResize=()=>{this.updateContainerHeight()}}updated(e){if(e.has("history")){const e=this.history;""!==this.historyState&&this.historyState!==e&&this.onViewChange(e)}e.has("transitionDuration")&&this.style.setProperty("--local-duration",this.transitionDuration),e.has("transitionFunction")&&this.style.setProperty("--local-transition",this.transitionFunction)}firstUpdated(){this.transitionFunction&&this.style.setProperty("--local-transition",this.transitionFunction),this.style.setProperty("--local-duration",this.transitionDuration),this.historyState=this.history,this.resizeObserver=new ResizeObserver(e=>{for(const t of e)if(t.target===this.getWrapper()){let e=t.contentRect.height;const o=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");if(this.mobileFullScreen){e=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-o,this.style.setProperty("--local-border-bottom-radius","0px")}else{e=e+o,this.style.setProperty("--local-border-bottom-radius",o?"var(--apkt-borderRadius-5)":"0px")}this.style.setProperty("--local-container-height",`${e}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${e}px`}}),this.resizeObserver.observe(this.getWrapper()),this.updateContainerHeight(),window.addEventListener("resize",this.onViewportResize),window.visualViewport?.addEventListener("resize",this.onViewportResize)}disconnectedCallback(){const e=this.getWrapper();e&&this.resizeObserver&&this.resizeObserver.unobserve(e),window.removeEventListener("resize",this.onViewportResize),window.visualViewport?.removeEventListener("resize",this.onViewportResize)}render(){return o`
      <div class="container" data-mobile-fullscreen="${n(this.mobileFullScreen)}">
        <div
          class="page"
          data-mobile-fullscreen="${n(this.mobileFullScreen)}"
          view-direction="${this.viewDirection}"
        >
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}onViewChange(e){const t=e.split(",").filter(Boolean),o=this.historyState.split(",").filter(Boolean),i=o.length,a=t.length,r=t[t.length-1]||"",n=s.cssDurationToNumber(this.transitionDuration);let c="";a>i?c="next":a<i?c="prev":a===i&&t[a-1]!==o[i-1]&&(c="next"),this.viewDirection=`${c}-${r}`,setTimeout(()=>{this.historyState=e,this.setView?.(r)},n),setTimeout(()=>{this.viewDirection=""},2*n)}getWrapper(){return this.shadowRoot?.querySelector("div.page")}updateContainerHeight(){const e=this.getWrapper();if(!e)return;const t=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");let o=0;if(this.mobileFullScreen){o=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-t,this.style.setProperty("--local-border-bottom-radius","0px")}else o=e.getBoundingClientRect().height+t,this.style.setProperty("--local-border-bottom-radius",t?"var(--apkt-borderRadius-5)":"0px");this.style.setProperty("--local-container-height",`${o}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${o}px`}getHeaderHeight(){return 60}};tt.styles=[Je],et([i({type:String})],tt.prototype,"transitionDuration",void 0),et([i({type:String})],tt.prototype,"transitionFunction",void 0),et([i({type:String})],tt.prototype,"history",void 0),et([i({type:String})],tt.prototype,"view",void 0),et([i({attribute:!1})],tt.prototype,"setView",void 0),et([a()],tt.prototype,"viewDirection",void 0),et([a()],tt.prototype,"historyState",void 0),et([a()],tt.prototype,"previousHeight",void 0),et([a()],tt.prototype,"mobileFullScreen",void 0),tt=et([r("w3m-router-container")],tt);export{Xe as AppKitModal,Ze as W3mListWallet,Ye as W3mModal,Ge as W3mModalBase,tt as W3mRouterContainer};
