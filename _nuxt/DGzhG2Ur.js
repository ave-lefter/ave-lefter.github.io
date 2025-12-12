import{b7 as e,b8 as t,b3 as o}from"./DvO0AinD.js";import{n as i,r as a}from"./B_ot7u58.js";import{o as r}from"./4RH0AGma.js";import{c as n,w as s,p as c,R as l,d,e as u,a as p,E as w,f as h,W as m,C as g,B as v,h as f,i as b,j as y,k,l as x,m as T,n as S,s as C,o as A,M as P,q as $,r as I,t as E,u as R,v as N,x as O,y as W,z as D,O as z,A as B,T as U,D as F}from"./q8v0_EFd.js";import{c as j,U as L}from"./BXdaP9GO.js";const H={getGasPriceInEther:(e,t)=>Number(t*e)/1e18,getGasPriceInUSD(e,t,o){const i=H.getGasPriceInEther(t,o);return n.bigNumber(e).times(i).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:o,toTokenAmount:i}){const a=n.bigNumber(e).times(t),r=n.bigNumber(i).times(o);return a.minus(r).div(a).times(100).toNumber()},getMaxSlippage(e,t){const o=n.bigNumber(e).div(100);return n.multiply(t,o).toNumber()},getProviderFee:(e,t=.0085)=>n.bigNumber(e).times(t).toString(),isInsufficientNetworkTokenForGas(e,t){const o=t||"0";return!!n.bigNumber(e).eq(0)||n.bigNumber(n.bigNumber(o)).gt(e)},isInsufficientSourceTokenForSwap(e,t,o){var i,a;const r=null==(a=null==(i=null==o?void 0:o.find(e=>e.address===t))?void 0:i.quantity)?void 0:a.numeric;return n.bigNumber(r||"0").lt(e)}},V=15e4,M={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,switchingTokens:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:x.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},_=c({...M}),K={state:_,subscribe:e=>A(_,()=>e(_)),subscribeKey:(e,t)=>C(_,e,t),getParams(){var e,t,o,i,a,r,s,c,l;const d=g.state.activeChain,u=(null==(e=g.getAccountData(d))?void 0:e.caipAddress)??g.state.activeCaipAddress,w=f.getPlainAddress(u),h=T(),m=S.getConnectorId(g.state.activeChain);if(!w)throw new Error("No address found to swap the tokens from.");const v=!(null==(t=_.toToken)?void 0:t.address)||!(null==(o=_.toToken)?void 0:o.decimals),b=!(null==(i=_.sourceToken)?void 0:i.address)||!(null==(a=_.sourceToken)?void 0:a.decimals)||!n.bigNumber(_.sourceTokenAmount).gt(0),y=!_.sourceTokenAmount;return{networkAddress:h,fromAddress:w,fromCaipAddress:u,sourceTokenAddress:null==(r=_.sourceToken)?void 0:r.address,toTokenAddress:null==(s=_.toToken)?void 0:s.address,toTokenAmount:_.toTokenAmount,toTokenDecimals:null==(c=_.toToken)?void 0:c.decimals,sourceTokenAmount:_.sourceTokenAmount,sourceTokenDecimals:null==(l=_.sourceToken)?void 0:l.decimals,invalidToToken:v,invalidSourceToken:b,invalidSourceTokenAmount:y,availableToSwap:u&&!v&&!b&&!y,isAuthConnector:m===p.CONNECTOR_ID.AUTH}},async setSourceToken(e){if(!e)return _.sourceToken=e,_.sourceTokenAmount="",void(_.sourceTokenPriceInUSD=0);_.sourceToken=e,await G.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){_.sourceTokenAmount=e},async setToToken(e){if(!e)return _.toToken=e,_.toTokenAmount="",void(_.toTokenPriceInUSD=0);_.toToken=e,await G.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){_.toTokenAmount=e?n.toFixed(e,6):""},async setTokenPrice(e,t){let o=_.tokensPriceMap[e]||0;o||(_.loadingPrices=!0,o=await G.getAddressPrice(e)),"sourceToken"===t?_.sourceTokenPriceInUSD=o:"toToken"===t&&(_.toTokenPriceInUSD=o),_.loadingPrices&&(_.loadingPrices=!1),G.getParams().availableToSwap&&!_.switchingTokens&&G.swapTokens()},async switchTokens(){if(!_.initializing&&_.initialized&&!_.switchingTokens){_.switchingTokens=!0;try{const e=_.toToken?{..._.toToken}:void 0,t=_.sourceToken?{..._.sourceToken}:void 0,o=e&&""===_.toTokenAmount?"1":_.toTokenAmount;G.setSourceTokenAmount(o),G.setToTokenAmount(""),await G.setSourceToken(e),await G.setToToken(t),_.switchingTokens=!1,G.swapTokens()}catch(e){throw _.switchingTokens=!1,e}}},resetState(){_.myTokensWithBalance=M.myTokensWithBalance,_.tokensPriceMap=M.tokensPriceMap,_.initialized=M.initialized,_.initializing=M.initializing,_.switchingTokens=M.switchingTokens,_.sourceToken=M.sourceToken,_.sourceTokenAmount=M.sourceTokenAmount,_.sourceTokenPriceInUSD=M.sourceTokenPriceInUSD,_.toToken=M.toToken,_.toTokenAmount=M.toTokenAmount,_.toTokenPriceInUSD=M.toTokenPriceInUSD,_.networkPrice=M.networkPrice,_.networkTokenSymbol=M.networkTokenSymbol,_.networkBalanceInUSD=M.networkBalanceInUSD,_.inputError=M.inputError},resetValues(){var e;const{networkAddress:t}=G.getParams(),o=null==(e=_.tokens)?void 0:e.find(e=>e.address===t);G.setSourceToken(o),G.setToToken(void 0)},getApprovalLoadingState:()=>_.loadingApprovalTransaction,clearError(){_.transactionError=void 0},async initializeState(){if(!_.initializing){if(_.initializing=!0,!_.initialized)try{await G.fetchTokens(),_.initialized=!0}catch(e){_.initialized=!1,d.showError("Failed to initialize swap"),l.goBack()}_.initializing=!1}},async fetchTokens(){var e;const{networkAddress:t}=G.getParams();await G.getNetworkTokenPrice(),await G.getMyTokensWithBalance();const o=null==(e=_.myTokensWithBalance)?void 0:e.find(e=>e.address===t);o&&(_.networkTokenSymbol=o.symbol,G.setSourceToken(o),G.setSourceTokenAmount("0"))},async getTokenList(){var e,t;const o=null==(e=g.state.activeCaipNetwork)?void 0:e.caipNetworkId;if(_.caipNetworkId!==o||!_.tokens)try{_.tokensLoading=!0;const e=await b.getTokenList(o);_.tokens=e,_.caipNetworkId=o,_.popularTokens=e.sort((e,t)=>e.symbol<t.symbol?-1:e.symbol>t.symbol?1:0);const i=(o&&(null==(t=x.SUGGESTED_TOKENS_BY_CHAIN)?void 0:t[o])||[]).map(t=>e.find(e=>e.symbol===t)).filter(e=>Boolean(e)),a=(x.SWAP_SUGGESTED_TOKENS||[]).map(t=>e.find(e=>e.symbol===t)).filter(e=>Boolean(e)).filter(e=>!i.some(t=>t.address===e.address));_.suggestedTokens=[...i,...a]}catch(i){_.tokens=[],_.popularTokens=[],_.suggestedTokens=[]}finally{_.tokensLoading=!1}},async getAddressPrice(e){var t,o;const i=_.tokensPriceMap[e];if(i)return i;const a=await v.fetchTokenPrice({addresses:[e]}),r=(null==a?void 0:a.fungibles)||[],n=[..._.tokens||[],..._.myTokensWithBalance||[]],s=null==(t=null==n?void 0:n.find(t=>t.address===e))?void 0:t.symbol,c=(null==(o=r.find(e=>e.symbol.toLowerCase()===(null==s?void 0:s.toLowerCase())))?void 0:o.price)||0,l=parseFloat(c.toString());return _.tokensPriceMap[e]=l,l},async getNetworkTokenPrice(){var e;const{networkAddress:t}=G.getParams(),o=null==(e=(await v.fetchTokenPrice({addresses:[t]}).catch(()=>(d.showError("Failed to fetch network token price"),{fungibles:[]}))).fungibles)?void 0:e[0],i=(null==o?void 0:o.price.toString())||"0";_.tokensPriceMap[t]=parseFloat(i),_.networkTokenSymbol=(null==o?void 0:o.symbol)||"",_.networkPrice=i},async getMyTokensWithBalance(e){const t=await k.getMyTokensWithBalance(e),o=b.mapBalancesToSwapTokens(t);o&&(await G.getInitialGasPrice(),G.setBalances(o))},setBalances(e){const{networkAddress:t}=G.getParams(),o=g.state.activeCaipNetwork;if(!o)return;const i=e.find(e=>e.address===t);e.forEach(e=>{_.tokensPriceMap[e.address]=e.price||0}),_.myTokensWithBalance=e.filter(e=>e.address.startsWith(o.caipNetworkId)),_.networkBalanceInUSD=i?n.multiply(i.quantity.numeric,i.price).toString():"0"},async getInitialGasPrice(){var e,t;const o=await b.fetchGasPrice();if(!o)return{gasPrice:null,gasPriceInUSD:null};switch(null==(t=null==(e=g.state)?void 0:e.activeCaipNetwork)?void 0:t.chainNamespace){case p.CHAIN.SOLANA:return _.gasFee=o.standard??"0",_.gasPriceInUSD=n.multiply(o.standard,_.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(_.gasFee),gasPriceInUSD:Number(_.gasPriceInUSD)};case p.CHAIN.EVM:default:const e=o.standard??"0",t=BigInt(e),i=BigInt(V),a=H.getGasPriceInUSD(_.networkPrice,i,t);return _.gasFee=e,_.gasPriceInUSD=a,{gasPrice:t,gasPriceInUSD:a}}},async swapTokens(){var e,t,o;const i=null==(e=g.getAccountData())?void 0:e.address,a=_.sourceToken,r=_.toToken,s=n.bigNumber(_.sourceTokenAmount).gt(0);if(s||G.setToTokenAmount(""),!r||!a||_.loadingPrices||!s||!i)return;_.loadingQuote=!0;const c=n.bigNumber(_.sourceTokenAmount).times(10**a.decimals).round(0);try{const e=await v.fetchSwapQuote({userAddress:i,from:a.address,to:r.address,gasPrice:_.gasFee,amount:c.toString()});_.loadingQuote=!1;const s=null==(o=null==(t=null==e?void 0:e.quotes)?void 0:t[0])?void 0:o.toAmount;if(!s)return void y.open({displayMessage:"Incorrect amount",debugMessage:"Please enter a valid amount"},"error");const l=n.bigNumber(s).div(10**r.decimals).toString();G.setToTokenAmount(l);G.hasInsufficientToken(_.sourceTokenAmount,a.address)?_.inputError="Insufficient balance":(_.inputError=void 0,G.setTransactionDetails())}catch(l){const e=await b.handleSwapError(l);_.loadingQuote=!1,_.inputError=e||"Insufficient balance"}},async getTransaction(){const{fromCaipAddress:e,availableToSwap:t}=G.getParams(),o=_.sourceToken,i=_.toToken;if(e&&t&&o&&i&&!_.loadingQuote)try{_.loadingBuildTransaction=!0;let t;return t=await b.fetchSwapAllowance({userAddress:e,tokenAddress:o.address,sourceTokenAmount:_.sourceTokenAmount,sourceTokenDecimals:o.decimals})?await G.createSwapTransaction():await G.createAllowanceTransaction(),_.loadingBuildTransaction=!1,_.fetchError=!1,t}catch(a){return l.goBack(),d.showError("Failed to check allowance"),_.loadingBuildTransaction=!1,_.approvalTransaction=void 0,_.swapTransaction=void 0,void(_.fetchError=!0)}},async createAllowanceTransaction(){const{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:o}=G.getParams();if(e&&o){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{const i=await v.generateApproveCalldata({from:t,to:o,userAddress:e}),a=f.getPlainAddress(i.tx.from);if(!a)throw new Error("SwapController:createAllowanceTransaction - address is required");const r={data:i.tx.data,to:a,gasPrice:BigInt(i.tx.eip155.gasPrice),value:BigInt(i.tx.value),toAmount:_.toTokenAmount};return _.swapTransaction=void 0,_.approvalTransaction={data:r.data,to:r.to,gasPrice:r.gasPrice,value:r.value,toAmount:r.toAmount},{data:r.data,to:r.to,gasPrice:r.gasPrice,value:r.value,toAmount:r.toAmount}}catch(i){return l.goBack(),d.showError("Failed to create approval transaction"),_.approvalTransaction=void 0,_.swapTransaction=void 0,void(_.fetchError=!0)}}},async createSwapTransaction(){var e;const{networkAddress:t,fromCaipAddress:o,sourceTokenAmount:i}=G.getParams(),a=_.sourceToken,r=_.toToken;if(!(o&&i&&a&&r))return;const n=null==(e=u.parseUnits(i,a.decimals))?void 0:e.toString();try{const e=await v.generateSwapCalldata({userAddress:o,from:a.address,to:r.address,amount:n,disableEstimate:!0}),i=a.address===t,s=BigInt(e.tx.eip155.gas),c=BigInt(e.tx.eip155.gasPrice),l=f.getPlainAddress(e.tx.to);if(!l)throw new Error("SwapController:createSwapTransaction - address is required");const d={data:e.tx.data,to:l,gas:s,gasPrice:c,value:i?BigInt(n??"0"):BigInt("0"),toAmount:_.toTokenAmount};return _.gasPriceInUSD=H.getGasPriceInUSD(_.networkPrice,s,c),_.approvalTransaction=void 0,_.swapTransaction=d,d}catch(s){return l.goBack(),d.showError("Failed to create transaction"),_.approvalTransaction=void 0,_.swapTransaction=void 0,void(_.fetchError=!0)}},onEmbeddedWalletApprovalSuccess(){d.showLoading("Approve limit increase in your wallet"),l.replace("SwapPreview")},async sendTransactionForApproval(e){var t,o,i;const{fromAddress:a,isAuthConnector:r}=G.getParams();_.loadingApprovalTransaction=!0;r?l.pushTransactionStack({onSuccess:G.onEmbeddedWalletApprovalSuccess}):d.showLoading("Approve limit increase in your wallet");try{await u.sendTransaction({address:a,to:e.to,data:e.data,value:e.value,chainNamespace:p.CHAIN.EVM}),await G.swapTokens(),await G.getTransaction(),_.approvalTransaction=void 0,_.loadingApprovalTransaction=!1}catch(n){const e=n;_.transactionError=null==e?void 0:e.displayMessage,_.loadingApprovalTransaction=!1,d.showError((null==e?void 0:e.displayMessage)||"Transaction error"),w.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:(null==e?void 0:e.displayMessage)||(null==e?void 0:e.message)||"Unknown",network:(null==(t=g.state.activeCaipNetwork)?void 0:t.caipNetworkId)||"",swapFromToken:(null==(o=G.state.sourceToken)?void 0:o.symbol)||"",swapToToken:(null==(i=G.state.toToken)?void 0:i.symbol)||"",swapFromAmount:G.state.sourceTokenAmount||"",swapToAmount:G.state.toTokenAmount||"",isSmartAccount:h(p.CHAIN.EVM)===m.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){var t,o,i,a,r,s,c,v,f,b,y,k;if(!e)return;const{fromAddress:x,toTokenAmount:T,isAuthConnector:S}=G.getParams();_.loadingTransaction=!0;const C=`Swapping ${null==(t=_.sourceToken)?void 0:t.symbol} to ${n.formatNumberToLocalString(T,3)} ${null==(o=_.toToken)?void 0:o.symbol}`,A=`Swapped ${null==(i=_.sourceToken)?void 0:i.symbol} to ${n.formatNumberToLocalString(T,3)} ${null==(a=_.toToken)?void 0:a.symbol}`;S?l.pushTransactionStack({onSuccess(){l.replace("Account"),d.showLoading(C),K.resetState()}}):d.showLoading("Confirm transaction in your wallet");try{const t=[null==(r=_.sourceToken)?void 0:r.address,null==(s=_.toToken)?void 0:s.address].join(","),o=await u.sendTransaction({address:x,to:e.to,data:e.data,value:e.value,chainNamespace:p.CHAIN.EVM});return _.loadingTransaction=!1,d.showSuccess(A),w.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:(null==(c=g.state.activeCaipNetwork)?void 0:c.caipNetworkId)||"",swapFromToken:(null==(v=G.state.sourceToken)?void 0:v.symbol)||"",swapToToken:(null==(f=G.state.toToken)?void 0:f.symbol)||"",swapFromAmount:G.state.sourceTokenAmount||"",swapToAmount:G.state.toTokenAmount||"",isSmartAccount:h(p.CHAIN.EVM)===m.ACCOUNT_TYPES.SMART_ACCOUNT}}),K.resetState(),S||l.replace("Account"),K.getMyTokensWithBalance(t),o}catch(P){const e=P;return _.transactionError=null==e?void 0:e.displayMessage,_.loadingTransaction=!1,d.showError((null==e?void 0:e.displayMessage)||"Transaction error"),void w.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:(null==e?void 0:e.displayMessage)||(null==e?void 0:e.message)||"Unknown",network:(null==(b=g.state.activeCaipNetwork)?void 0:b.caipNetworkId)||"",swapFromToken:(null==(y=G.state.sourceToken)?void 0:y.symbol)||"",swapToToken:(null==(k=G.state.toToken)?void 0:k.symbol)||"",swapFromAmount:G.state.sourceTokenAmount||"",swapToAmount:G.state.toTokenAmount||"",isSmartAccount:h(p.CHAIN.EVM)===m.ACCOUNT_TYPES.SMART_ACCOUNT}})}},hasInsufficientToken:(e,t)=>H.isInsufficientSourceTokenForSwap(e,t,_.myTokensWithBalance),setTransactionDetails(){const{toTokenAddress:e,toTokenDecimals:t}=G.getParams();e&&t&&(_.gasPriceInUSD=H.getGasPriceInUSD(_.networkPrice,BigInt(_.gasFee),BigInt(V)),_.priceImpact=H.getPriceImpact({sourceTokenAmount:_.sourceTokenAmount,sourceTokenPriceInUSD:_.sourceTokenPriceInUSD,toTokenPriceInUSD:_.toTokenPriceInUSD,toTokenAmount:_.toTokenAmount}),_.maxSlippage=H.getMaxSlippage(_.slippage,_.toTokenAmount),_.providerFee=H.getProviderFee(_.sourceTokenAmount))}},G=s(K),Y=c({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),X=s({state:Y,subscribe:e=>A(Y,()=>e(Y)),subscribeKey:(e,t)=>C(Y,e,t),showTooltip({message:e,triggerRect:t,variant:o}){Y.open=!0,Y.message=e,Y.triggerRect=t,Y.variant=o},hide(){Y.open=!1,Y.message="",Y.triggerRect={width:0,height:0,top:0,left:0}}}),q={isUnsupportedChainView:()=>"UnsupportedChain"===l.state.view||"SwitchNetwork"===l.state.view&&l.state.history.includes("UnsupportedChain"),async safeClose(){if(this.isUnsupportedChainView())return void P.shake();await $.isSIWXCloseDisabled()?P.shake():("DataCapture"!==l.state.view&&"DataCaptureOtpConfirm"!==l.state.view||u.disconnect(),P.close())}},Q=I`
  :host {
    display: block;
    border-radius: clamp(0px, ${({borderRadius:e})=>e[8]}, 44px);
    box-shadow: 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    overflow: hidden;
  }
`;let Z=class extends e{render(){return t`<slot></slot>`}};Z.styles=[E,Q],Z=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n}([j("wui-card")],Z);const J=I`
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
`;var ee=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const te={info:"info",success:"checkmark",warning:"warningCircle",error:"warning"};let oe=class extends e{constructor(){super(...arguments),this.message="",this.type="info"}render(){return t`
      <wui-flex
        data-type=${r(this.type)}
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
            <wui-icon color="inherit" size="md" name=${te[this.type]}></wui-icon>
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
    `}onClose(){y.close()}};oe.styles=[E,J],ee([i()],oe.prototype,"message",void 0),ee([i()],oe.prototype,"type",void 0),oe=ee([j("wui-alertbar")],oe);const ie=I`
  :host {
    display: block;
    position: absolute;
    top: ${({spacing:e})=>e[3]};
    left: ${({spacing:e})=>e[4]};
    right: ${({spacing:e})=>e[4]};
    opacity: 0;
    pointer-events: none;
  }
`;var ae=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const re={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"warning"}};let ne=class extends e{constructor(){super(),this.unsubscribe=[],this.open=y.state.open,this.onOpen(!0),this.unsubscribe.push(y.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:o}=y.state,i=re[o];return t`
      <wui-alertbar
        message=${e}
        backgroundColor=${null==i?void 0:i.backgroundColor}
        iconColor=${null==i?void 0:i.iconColor}
        icon=${null==i?void 0:i.icon}
        type=${o}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};ne.styles=ie,ae([a()],ne.prototype,"open",void 0),ne=ae([j("w3m-alertbar")],ne);const se=I`
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
`;var ce=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let le=class extends e{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return t`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${r(this.iconSize)}></wui-icon>
    </button>`}};le.styles=[E,R,se],ce([i()],le.prototype,"icon",void 0),ce([i()],le.prototype,"variant",void 0),ce([i()],le.prototype,"type",void 0),ce([i()],le.prototype,"size",void 0),ce([i()],le.prototype,"iconSize",void 0),ce([i({type:Boolean})],le.prototype,"fullWidth",void 0),ce([i({type:Boolean})],le.prototype,"disabled",void 0),le=ce([j("wui-icon-button")],le);const de=I`
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
`;var ue=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const pe={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},we={lg:"lg",md:"md",sm:"sm"};let he=class extends e{constructor(){super(...arguments),this.imageSrc="",this.text="",this.size="lg",this.type="text-dropdown",this.disabled=!1}render(){return t`<button ?disabled=${this.disabled} data-size=${this.size} data-type=${this.type}>
      ${this.imageTemplate()} ${this.textTemplate()}
      <wui-flex class="right-icon-container">
        <wui-icon name="chevronBottom"></wui-icon>
      </wui-flex>
    </button>`}textTemplate(){const e=pe[this.size];return this.text?t`<wui-text color="primary" variant=${e}>${this.text}</wui-text>`:null}imageTemplate(){if(this.imageSrc)return t`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`;const e=we[this.size];return t` <wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}};he.styles=[E,R,de],ue([i()],he.prototype,"imageSrc",void 0),ue([i()],he.prototype,"text",void 0),ue([i()],he.prototype,"size",void 0),ue([i()],he.prototype,"type",void 0),ue([i({type:Boolean})],he.prototype,"disabled",void 0),he=ue([j("wui-select")],he);const me=I`
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
`;var ge=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const ve=["SmartSessionList"],fe={PayWithExchange:N.tokens.theme.foregroundPrimary};function be(){var e,t,o,i,a,r,n,s;const c=null==(t=null==(e=l.state.data)?void 0:e.connector)?void 0:t.name,d=null==(i=null==(o=l.state.data)?void 0:o.wallet)?void 0:i.name,u=null==(r=null==(a=l.state.data)?void 0:a.network)?void 0:r.name,p=d??c,w=S.getConnectors(),h=1===w.length&&"w3m-email"===(null==(n=w[0])?void 0:n.id),m=null==(s=g.getAccountData())?void 0:s.socialProvider;return{Connect:`Connect ${h?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",UsageExceeded:"Usage Exceeded",ConnectingExternal:p??"Connect Wallet",ConnectingWalletConnect:p??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview Convert",Downloads:p?`Get ${p}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a Wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:u??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade Your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose Name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select Token",SwapPreview:"Preview Swap",WalletSend:"Send",WalletSendPreview:"Review Send",WalletSendSelectToken:"Select Token",WalletSendConfirmed:"Confirmed",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a Wallet?",ConnectWallets:"Connect Wallet",ConnectSocials:"All Socials",ConnectingSocial:m?m.charAt(0).toUpperCase()+m.slice(1):"Connect Social",ConnectingMultiChain:"Select Chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch Chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in Progress",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email",FundWallet:"Fund Wallet",PayWithExchange:"Deposit from Exchange",PayWithExchangeSelectAsset:"Select Asset"}}let ye=class extends e{constructor(){super(),this.unsubscribe=[],this.heading=be()[l.state.view],this.network=g.state.activeCaipNetwork,this.networkImage=O.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=l.state.view,this.viewDirection="",this.unsubscribe.push(W.subscribeNetworkImages(()=>{this.networkImage=O.getNetworkImage(this.network)}),l.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.heading=be()[e]},D.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),g.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=O.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=fe[l.state.view]??N.tokens.theme.backgroundPrimary;return this.style.setProperty("--local-header-background-color",e),t`
      <wui-flex
        .padding=${["0","4","0","4"]}
        justifyContent="space-between"
        alignItems="center"
      >
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){w.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),l.push("WhatIsAWallet")}async onClose(){await q.safeClose()}rightHeaderTemplate(){var e,o,i;const a=null==(i=null==(o=null==(e=z)?void 0:e.state)?void 0:o.features)?void 0:i.smartSessions;return"Account"===l.state.view&&a?t`<wui-flex>
      <wui-icon-button
        icon="clock"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${()=>l.push("SmartSessionList")}
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
    `}titleTemplate(){const e=ve.includes(this.view);return t`
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
    `}leftHeaderTemplate(){var e;const{view:o}=l.state,i="Connect"===o,a=z.state.enableEmbedded,n="ApproveTransaction"===o,s="ConnectingSiwe"===o,c="Account"===o,d=z.state.enableNetworkSwitch,u=n||s||i&&a;return c&&d?t`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${r(null==(e=this.network)?void 0:e.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${r(this.networkImage)}
      ></wui-select>`:this.showBack&&!u?t`<wui-icon-button
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
    ></wui-icon-button>`}onNetworks(){this.isAllowedNetworkSwitch()&&(w.sendEvent({type:"track",event:"CLICK_NETWORKS"}),l.push("Networks"))}isAllowedNetworkSwitch(){const e=g.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,o=null==e?void 0:e.find(({id:e})=>{var t;return e===(null==(t=this.network)?void 0:t.id)});return t||!o}onViewChange(){const{history:e}=l.state;let t=D.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=D.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){var e;const{history:t}=l.state,o=null==(e=this.shadowRoot)?void 0:e.querySelector("#dynamic");t.length>1&&!this.showBack&&o?(await o.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,o.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):t.length<=1&&this.showBack&&o&&(await o.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,o.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){l.goBack()}};ye.styles=me,ge([a()],ye.prototype,"heading",void 0),ge([a()],ye.prototype,"network",void 0),ge([a()],ye.prototype,"networkImage",void 0),ge([a()],ye.prototype,"showBack",void 0),ge([a()],ye.prototype,"prevHistoryLength",void 0),ge([a()],ye.prototype,"view",void 0),ge([a()],ye.prototype,"viewDirection",void 0),ye=ge([j("w3m-header")],ye);const ke=I`
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
`;var xe=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Te=class extends e{constructor(){super(...arguments),this.message="",this.variant="success"}render(){return t`
      ${this.templateIcon()}
      <wui-text variant="lg-regular" color="primary" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return"loading"===this.variant?t`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:t`<wui-icon-box
      size="md"
      color=${{success:"success",error:"error",warning:"warning",info:"default"}[this.variant]}
      icon=${{success:"checkmark",error:"warning",warning:"warningCircle",info:"info"}[this.variant]}
    ></wui-icon-box>`}};Te.styles=[E,ke],xe([i()],Te.prototype,"message",void 0),xe([i()],Te.prototype,"variant",void 0),Te=xe([j("wui-snackbar")],Te);const Se=o`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var Ce=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Ae=class extends e{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=d.state.open,this.unsubscribe.push(d.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){const{message:e,variant:o}=d.state;return t` <wui-snackbar message=${e} variant=${o}></wui-snackbar> `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),d.state.autoClose&&(this.timeout=setTimeout(()=>d.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};Ae.styles=Se,Ce([a()],Ae.prototype,"open",void 0),Ae=Ce([j("w3m-snackbar")],Ae);const Pe=I`
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
`;var $e=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Ie=class extends e{constructor(){super(),this.unsubscribe=[],this.open=X.state.open,this.message=X.state.message,this.triggerRect=X.state.triggerRect,this.variant=X.state.variant,this.unsubscribe.push(X.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;const e=this.triggerRect.top,o=this.triggerRect.left;return this.style.cssText=`\n    --w3m-tooltip-top: ${e}px;\n    --w3m-tooltip-left: ${o}px;\n    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;\n    --w3m-tooltip-display: ${this.open?"flex":"none"};\n    --w3m-tooltip-opacity: ${this.open?1:0};\n    `,t`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};Ie.styles=[Pe],$e([a()],Ie.prototype,"open",void 0),$e([a()],Ie.prototype,"message",void 0),$e([a()],Ie.prototype,"triggerRect",void 0),$e([a()],Ie.prototype,"variant",void 0),Ie=$e([j("w3m-tooltip")],Ie);const Ee={getTabsByNamespace(e){var t;return Boolean(e)&&e===p.CHAIN.EVM?!1===(null==(t=z.state.remoteFeatures)?void 0:t.activity)?D.ACCOUNT_TABS.filter(e=>"Activity"!==e.label):D.ACCOUNT_TABS:[]},isValidReownName:e=>/^[a-zA-Z0-9]+$/gu.test(e),isValidEmail:e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(e),validateReownName:e=>e.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,""),hasFooter(){var e;const t=l.state.view;if(D.VIEWS_WITH_LEGAL_FOOTER.includes(t)){const{termsConditionsUrl:t,privacyPolicyUrl:o}=z.state,i=null==(e=z.state.features)?void 0:e.legalCheckbox;return!(!t&&!o||i)}return D.VIEWS_WITH_DEFAULT_FOOTER.includes(t)}},Re=I`
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
`;var Ne=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Oe=class extends e{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=z.state.remoteFeatures,this.unsubscribe.push(z.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){var e;const{termsConditionsUrl:o,privacyPolicyUrl:i}=z.state,a=null==(e=z.state.features)?void 0:e.legalCheckbox;return!o&&!i||a?t`
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
    `}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=z.state;return e&&t?"and":""}termsTemplate(){const{termsConditionsUrl:e}=z.state;return e?t`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){const{privacyPolicyUrl:e}=z.state;return e?t`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){var o;return(null==(o=this.remoteFeatures)?void 0:o.reownBranding)?e?t`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:t`<wui-ux-by-reown></wui-ux-by-reown>`:null}};Oe.styles=[Re],Ne([a()],Oe.prototype,"remoteFeatures",void 0),Oe=Ne([j("w3m-legal-footer")],Oe);const We=o``;let De=class extends e{render(){const{termsConditionsUrl:e,privacyPolicyUrl:o}=z.state;return e||o?t`
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
    </wui-link>`}onWhatIsBuy(){w.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:h(g.state.activeChain)===m.ACCOUNT_TYPES.SMART_ACCOUNT}}),l.push("WhatIsABuy")}};De.styles=[We],De=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n}([j("w3m-onramp-providers-footer")],De);const ze=I`
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
`;var Be=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Ue=class extends e{constructor(){super(...arguments),this.resizeObserver=void 0,this.unsubscribe=[],this.status="hide",this.view=l.state.view}firstUpdated(){this.status=Ee.hasFooter()?"show":"hide",this.unsubscribe.push(l.subscribeKey("view",e=>{if(this.view=e,this.status=Ee.hasFooter()?"show":"hide","hide"===this.status){document.documentElement.style.setProperty("--apkt-footer-height","0px")}})),this.resizeObserver=new ResizeObserver(e=>{for(const t of e)if(t.target===this.getWrapper()){const e=`${t.contentRect.height}px`;document.documentElement.style.setProperty("--apkt-footer-height",e)}}),this.resizeObserver.observe(this.getWrapper())}render(){return t`
      <div class="container" status=${this.status}>${this.templatePageContainer()}</div>
    `}templatePageContainer(){return Ee.hasFooter()?t` ${this.templateFooter()}`:null}templateFooter(){switch(this.view){case"Networks":return this.templateNetworksFooter();case"Connect":case"ConnectWallets":case"OnRampFiatSelect":case"OnRampTokenSelect":return t`<w3m-legal-footer></w3m-legal-footer>`;case"OnRampProviders":return t`<w3m-onramp-providers-footer></w3m-onramp-providers-footer>`;default:return null}}templateNetworksFooter(){return t` <wui-flex
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
    </wui-flex>`}onNetworkHelp(){w.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),l.push("WhatIsANetwork")}getWrapper(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("div.container")}};Ue.styles=[ze],Be([a()],Ue.prototype,"status",void 0),Be([a()],Ue.prototype,"view",void 0),Ue=Be([j("w3m-footer")],Ue);const Fe=I`
  :host {
    display: block;
    width: inherit;
  }
`;var je=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Le=class extends e{constructor(){super(),this.unsubscribe=[],this.viewState=l.state.view,this.history=l.state.history.join(","),this.unsubscribe.push(l.subscribeKey("view",()=>{this.history=l.state.history.join(","),document.documentElement.style.setProperty("--apkt-duration-dynamic","var(--apkt-durations-lg)")}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),document.documentElement.style.setProperty("--apkt-duration-dynamic","0s")}render(){return t`${this.templatePageContainer()}`}templatePageContainer(){return t`<w3m-router-container
      history=${this.history}
      .setView=${()=>{this.viewState=l.state.view}}
    >
      ${this.viewTemplate(this.viewState)}
    </w3m-router-container>`}viewTemplate(e){switch(e){case"AccountSettings":return t`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return t`<w3m-account-view></w3m-account-view>`;case"AllWallets":return t`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return t`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return t`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return t`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return t`<w3m-connect-view></w3m-connect-view>`;case"Create":return t`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return t`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return t`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return t`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return t`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return t`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return t`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return t`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return t`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return t`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return t`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return t`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return t`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return t`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return t`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return t`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return t`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return t`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return t`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return t`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return t`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return t`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return t`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return t`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return t`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return t`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return t`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return t`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return t`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return t`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return t`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return t`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return t`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WalletSendConfirmed":return t`<w3m-send-confirmed-view></w3m-send-confirmed-view>`;case"WhatIsABuy":return t`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return t`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return t`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return t`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return t`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return t`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return t`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return t`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return t`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return t`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return t`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return t`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return t`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return t`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return t`<w3m-pay-loading-view></w3m-pay-loading-view>`;case"FundWallet":return t`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case"PayWithExchange":return t`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`;case"PayWithExchangeSelectAsset":return t`<w3m-deposit-from-exchange-select-asset-view></w3m-deposit-from-exchange-select-asset-view>`;case"UsageExceeded":return t`<w3m-usage-exceeded-view></w3m-usage-exceeded-view>`}}};Le.styles=[Fe],je([a()],Le.prototype,"viewState",void 0),je([a()],Le.prototype,"history",void 0),Le=je([j("w3m-router")],Le);const He=I`
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
`;var Ve=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};const Me="scroll-lock",_e={PayWithExchange:"0",PayWithExchangeSelectAsset:"0"};class Ke extends e{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=z.state.enableEmbedded,this.open=P.state.open,this.caipAddress=g.state.activeCaipAddress,this.caipNetwork=g.state.activeCaipNetwork,this.shake=P.state.shake,this.filterByNamespace=S.state.filterByNamespace,this.padding=N.spacing[1],this.mobileFullScreen=z.state.enableMobileFullScreen,this.initializeTheming(),B.prefetchAnalyticsConfig(),this.unsubscribe.push(P.subscribeKey("open",e=>e?this.onOpen():this.onClose()),P.subscribeKey("shake",e=>this.shake=e),g.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),g.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),z.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),S.subscribeKey("filterByNamespace",e=>{var t;this.filterByNamespace===e||(null==(t=g.getAccountData(e))?void 0:t.caipAddress)||(B.fetchRecommendedWallets(),this.filterByNamespace=e)}),l.subscribeKey("view",()=>{this.dataset.border=Ee.hasFooter()?"true":"false",this.padding=_e[l.state.view]??N.spacing[1]}))}firstUpdated(){if(this.dataset.border=Ee.hasFooter()?"true":"false",this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.caipAddress){if(this.enableEmbedded)return P.close(),void this.prefetch();this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.setProperty("--local-modal-padding",this.padding),this.enableEmbedded?t`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?t`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return t` <wui-card
      shake="${this.shake}"
      data-embedded="${r(this.enableEmbedded)}"
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
    </wui-card>`}async onOverlayClick(e){if(e.target===e.currentTarget){if(this.mobileFullScreen)return;await this.handleClose()}}async handleClose(){await q.safeClose()}initializeTheming(){const{themeVariables:e,themeMode:t}=U.state,o=L.getColorTheme(t);F(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),d.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=Me,e.textContent="\n      body {\n        touch-action: none;\n        overflow: hidden;\n        overscroll-behavior: contain;\n      }\n      w3m-modal {\n        pointer-events: auto;\n      }\n    ",document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${Me}"]`);e&&e.remove()}onAddKeyboardListener(){var e;this.abortController=new AbortController;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("wui-card");null==t||t.focus(),window.addEventListener("keydown",e=>{if("Escape"===e.key)this.handleClose();else if("Tab"===e.key){const{tagName:o}=e.target;!o||o.includes("W3M-")||o.includes("WUI-")||null==t||t.focus()}},this.abortController)}onRemoveKeyboardListener(){var e;null==(e=this.abortController)||e.abort(),this.abortController=void 0}async onNewAddress(e){const t=g.state.isSwitchingNamespace,o="ProfileWallets"===l.state.view;!e&&!t&&!o&&P.close(),await $.initializeIfEnabled(e),this.caipAddress=e,g.setIsSwitchingNamespace(!1)}onNewNetwork(e){var t,o;const i=this.caipNetwork,a=(null==(t=null==i?void 0:i.caipNetworkId)?void 0:t.toString())!==(null==(o=null==e?void 0:e.caipNetworkId)?void 0:o.toString()),r="UnsupportedChain"===l.state.view,n=P.state.open;let s=!1;this.enableEmbedded&&"SwitchNetwork"===l.state.view&&(s=!0),a&&G.resetState(),n&&r&&(s=!0),s&&"SIWXSignMessage"!==l.state.view&&l.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(B.prefetch(),B.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}Ke.styles=He,Ve([i({type:Boolean})],Ke.prototype,"enableEmbedded",void 0),Ve([a()],Ke.prototype,"open",void 0),Ve([a()],Ke.prototype,"caipAddress",void 0),Ve([a()],Ke.prototype,"caipNetwork",void 0),Ve([a()],Ke.prototype,"shake",void 0),Ve([a()],Ke.prototype,"filterByNamespace",void 0),Ve([a()],Ke.prototype,"padding",void 0),Ve([a()],Ke.prototype,"mobileFullScreen",void 0);let Ge=class extends Ke{};Ge=Ve([j("w3m-modal")],Ge);let Ye=class extends Ke{};Ye=Ve([j("appkit-modal")],Ye);const Xe=I`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: ${({borderRadius:e})=>e[5]};
    background-color: ${({colors:e})=>e.semanticError010};
  }
`;let qe=class extends e{constructor(){super()}render(){return t`
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
    `}onTryAgainClick(){l.goBack()}};qe.styles=Xe,qe=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n}([j("w3m-usage-exceeded-view")],qe);const Qe=I`
  :host {
    width: 100%;
  }
`;var Ze=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let Je=class extends e{constructor(){super(...arguments),this.hasImpressionSent=!1,this.walletImages=[],this.imageSrc="",this.name="",this.size="md",this.tabIdx=void 0,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100",this.rdnsId="",this.displayIndex=void 0,this.walletRank=void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupIntersectionObserver()}updated(e){super.updated(e),(e.has("name")||e.has("imageSrc")||e.has("walletRank"))&&(this.hasImpressionSent=!1);e.has("walletRank")&&this.walletRank&&!this.intersectionObserver&&this.setupIntersectionObserver()}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{!e.isIntersecting||this.loading||this.hasImpressionSent||this.sendImpressionEvent()})},{threshold:.1}),this.intersectionObserver.observe(this)}cleanupIntersectionObserver(){this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=void 0)}sendImpressionEvent(){this.name&&!this.hasImpressionSent&&this.walletRank&&(this.hasImpressionSent=!0,(this.rdnsId||this.name)&&w.sendWalletImpressionEvent({name:this.name,walletRank:this.walletRank,rdnsId:this.rdnsId,view:l.state.view,displayIndex:this.displayIndex}))}render(){return t`
      <wui-list-wallet
        .walletImages=${this.walletImages}
        imageSrc=${r(this.imageSrc)}
        name=${this.name}
        size=${r(this.size)}
        tagLabel=${r(this.tagLabel)}
        .tagVariant=${this.tagVariant}
        .walletIcon=${this.walletIcon}
        .tabIdx=${this.tabIdx}
        .disabled=${this.disabled}
        .showAllWallets=${this.showAllWallets}
        .loading=${this.loading}
        loadingSpinnerColor=${this.loadingSpinnerColor}
      ></wui-list-wallet>
    `}};Je.styles=Qe,Ze([i({type:Array})],Je.prototype,"walletImages",void 0),Ze([i()],Je.prototype,"imageSrc",void 0),Ze([i()],Je.prototype,"name",void 0),Ze([i()],Je.prototype,"size",void 0),Ze([i()],Je.prototype,"tagLabel",void 0),Ze([i()],Je.prototype,"tagVariant",void 0),Ze([i()],Je.prototype,"walletIcon",void 0),Ze([i()],Je.prototype,"tabIdx",void 0),Ze([i({type:Boolean})],Je.prototype,"disabled",void 0),Ze([i({type:Boolean})],Je.prototype,"showAllWallets",void 0),Ze([i({type:Boolean})],Je.prototype,"loading",void 0),Ze([i({type:String})],Je.prototype,"loadingSpinnerColor",void 0),Ze([i()],Je.prototype,"rdnsId",void 0),Ze([i()],Je.prototype,"displayIndex",void 0),Ze([i()],Je.prototype,"walletRank",void 0),Je=Ze([j("w3m-list-wallet")],Je);const et=I`
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
`;var tt=function(e,t,o,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(n=(r<3?a(n):r>3?a(t,o,n):a(t,o))||n);return r>3&&n&&Object.defineProperty(t,o,n),n};let ot=class extends e{constructor(){super(...arguments),this.resizeObserver=void 0,this.transitionDuration="0.15s",this.transitionFunction="",this.history="",this.view="",this.setView=void 0,this.viewDirection="",this.historyState="",this.previousHeight="0px",this.mobileFullScreen=z.state.enableMobileFullScreen,this.onViewportResize=()=>{this.updateContainerHeight()}}updated(e){if(e.has("history")){const e=this.history;""!==this.historyState&&this.historyState!==e&&this.onViewChange(e)}e.has("transitionDuration")&&this.style.setProperty("--local-duration",this.transitionDuration),e.has("transitionFunction")&&this.style.setProperty("--local-transition",this.transitionFunction)}firstUpdated(){var e;this.transitionFunction&&this.style.setProperty("--local-transition",this.transitionFunction),this.style.setProperty("--local-duration",this.transitionDuration),this.historyState=this.history,this.resizeObserver=new ResizeObserver(e=>{var t;for(const o of e)if(o.target===this.getWrapper()){let e=o.contentRect.height;const i=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");if(this.mobileFullScreen){e=((null==(t=window.visualViewport)?void 0:t.height)||window.innerHeight)-this.getHeaderHeight()-i,this.style.setProperty("--local-border-bottom-radius","0px")}else{e=e+i,this.style.setProperty("--local-border-bottom-radius",i?"var(--apkt-borderRadius-5)":"0px")}this.style.setProperty("--local-container-height",`${e}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${e}px`}}),this.resizeObserver.observe(this.getWrapper()),this.updateContainerHeight(),window.addEventListener("resize",this.onViewportResize),null==(e=window.visualViewport)||e.addEventListener("resize",this.onViewportResize)}disconnectedCallback(){var e;const t=this.getWrapper();t&&this.resizeObserver&&this.resizeObserver.unobserve(t),window.removeEventListener("resize",this.onViewportResize),null==(e=window.visualViewport)||e.removeEventListener("resize",this.onViewportResize)}render(){return t`
      <div class="container" data-mobile-fullscreen="${r(this.mobileFullScreen)}">
        <div
          class="page"
          data-mobile-fullscreen="${r(this.mobileFullScreen)}"
          view-direction="${this.viewDirection}"
        >
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}onViewChange(e){const t=e.split(",").filter(Boolean),o=this.historyState.split(",").filter(Boolean),i=o.length,a=t.length,r=t[t.length-1]||"",n=L.cssDurationToNumber(this.transitionDuration);let s="";a>i?s="next":a<i?s="prev":a===i&&t[a-1]!==o[i-1]&&(s="next"),this.viewDirection=`${s}-${r}`,setTimeout(()=>{var t;this.historyState=e,null==(t=this.setView)||t.call(this,r)},n),setTimeout(()=>{this.viewDirection=""},2*n)}getWrapper(){var e;return null==(e=this.shadowRoot)?void 0:e.querySelector("div.page")}updateContainerHeight(){var e;const t=this.getWrapper();if(!t)return;const o=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");let i=0;if(this.mobileFullScreen){i=((null==(e=window.visualViewport)?void 0:e.height)||window.innerHeight)-this.getHeaderHeight()-o,this.style.setProperty("--local-border-bottom-radius","0px")}else i=t.getBoundingClientRect().height+o,this.style.setProperty("--local-border-bottom-radius",o?"var(--apkt-borderRadius-5)":"0px");this.style.setProperty("--local-container-height",`${i}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${i}px`}getHeaderHeight(){return 60}};ot.styles=[et],tt([i({type:String})],ot.prototype,"transitionDuration",void 0),tt([i({type:String})],ot.prototype,"transitionFunction",void 0),tt([i({type:String})],ot.prototype,"history",void 0),tt([i({type:String})],ot.prototype,"view",void 0),tt([i({attribute:!1})],ot.prototype,"setView",void 0),tt([a()],ot.prototype,"viewDirection",void 0),tt([a()],ot.prototype,"historyState",void 0),tt([a()],ot.prototype,"previousHeight",void 0),tt([a()],ot.prototype,"mobileFullScreen",void 0),ot=tt([j("w3m-router-container")],ot);export{Ye as AppKitModal,Je as W3mListWallet,Ge as W3mModal,Ke as W3mModalBase,ot as W3mRouterContainer,qe as W3mUsageExceededView};
