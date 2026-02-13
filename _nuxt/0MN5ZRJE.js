import{bx as e,bs as t,dP as i,bu as n,cx as r,bq as a,br as o,bz as s,bh as l,bl as c,bG as d,bm as h,ez as u,bt as m}from"#entry";import{c as p}from"./CVzBkT9j.js";import{W as f}from"./Hr5GcqUr.js";import{r as w}from"./mQLjjC5r.js";import"./PZjNov0a.js";import"./C4n78Wzf.js";import{e as E,n as v}from"./Fdv8sq1b.js";import"./CvL6B188.js";import"./Cp8K89gr.js";import"./cRykC9iU.js";import"./r7P8shUn.js";import"./CW7Luf7h.js";import"./yRNs9a8f.js";import"./4BRf7AHv.js";let g=class extends f{constructor(){super(...arguments),this.onOtpSubmit=async l=>{try{if(this.authConnector){const s=e.state.activeChain,c=t.getConnections(s),d=i.state.remoteFeatures?.multiWallet,h=c.length>0;if(await this.authConnector.provider.connectOtp({otp:l}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),!s)throw new Error("Active chain is not set on ChainControll");if(await t.connectExternal(this.authConnector,s),n.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"email",name:this.authConnector.name||"Unknown"}}),i.state.remoteFeatures?.emailCapture)return;if(i.state.siwx)return void r.close();if(h&&d)return a.replace("ProfileWallets"),void o.showSuccess("New Wallet Added");r.close()}}catch(c){throw n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:s.parseError(c)}}),c}},this.onOtpResend=async e=>{this.authConnector&&(await this.authConnector.provider.connectEmail({email:e}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}))}}};g=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([p("w3m-email-verify-otp-view")],g);const b=l`
  wui-icon-box {
    height: var(--wui-icon-box-size-xl);
    width: var(--wui-icon-box-size-xl);
  }
`;var y=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let C=class extends c{constructor(){super(),this.email=a.state.data?.email,this.authConnector=d.getAuthConnector(),this.loading=!1,this.listenForDeviceApproval()}render(){if(!this.email)throw new Error("w3m-email-verify-device-view: No email provided");if(!this.authConnector)throw new Error("w3m-email-verify-device-view: No auth connector provided");return h`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xxl","s","xxl","s"]}
        gap="l"
      >
        <wui-icon-box
          size="xl"
          iconcolor="accent-100"
          backgroundcolor="accent-100"
          icon="verify"
          background="opaque"
        ></wui-icon-box>

        <wui-flex flexDirection="column" alignItems="center" gap="s">
          <wui-flex flexDirection="column" alignItems="center">
            <wui-text variant="paragraph-400" color="fg-100">
              Approve the login link we sent to
            </wui-text>
            <wui-text variant="paragraph-400" color="fg-100"><b>${this.email}</b></wui-text>
          </wui-flex>

          <wui-text variant="small-400" color="fg-200" align="center">
            The code expires in 20 minutes
          </wui-text>

          <wui-flex alignItems="center" id="w3m-resend-section" gap="xs">
            <wui-text variant="small-400" color="fg-100" align="center">
              Didn't receive it?
            </wui-text>
            <wui-link @click=${this.onResendCode.bind(this)} .disabled=${this.loading}>
              Resend email
            </wui-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}async listenForDeviceApproval(){if(this.authConnector)try{await this.authConnector.provider.connectDevice(),n.sendEvent({type:"track",event:"DEVICE_REGISTERED_FOR_EMAIL"}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),a.replace("EmailVerifyOtp",{email:this.email})}catch(e){a.goBack()}}async onResendCode(){try{if(!this.loading){if(!this.authConnector||!this.email)throw new Error("w3m-email-login-widget: Unable to resend email");this.loading=!0,await this.authConnector.provider.connectEmail({email:this.email}),this.listenForDeviceApproval(),o.showSuccess("Code email resent")}}catch(e){o.showError(e)}finally{this.loading=!1}}};C.styles=b,y([w()],C.prototype,"loading",void 0),C=y([p("w3m-email-verify-device-view")],C);const O=l`
  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }
`;var x=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let I=class extends c{constructor(){super(...arguments),this.formRef=E(),this.initialEmail=a.state.data?.email??"",this.redirectView=a.state.data?.redirectView,this.email="",this.loading=!1}firstUpdated(){this.formRef.value?.addEventListener("keydown",e=>{"Enter"===e.key&&this.onSubmitEmail(e)})}render(){return h`
      <wui-flex flexDirection="column" padding="m" gap="m">
        <form ${v(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
          <wui-email-input
            value=${this.initialEmail}
            .disabled=${this.loading}
            @inputChange=${this.onEmailInputChange.bind(this)}
          >
          </wui-email-input>
          <input type="submit" hidden />
        </form>
        ${this.buttonsTemplate()}
      </wui-flex>
    `}onEmailInputChange(e){this.email=e.detail}async onSubmitEmail(e){try{if(this.loading)return;this.loading=!0,e.preventDefault();const t=d.getAuthConnector();if(!t)throw new Error("w3m-update-email-wallet: Auth connector not found");const i=await t.provider.updateEmail({email:this.email});n.sendEvent({type:"track",event:"EMAIL_EDIT"}),"VERIFY_SECONDARY_OTP"===i.action?a.push("UpdateEmailSecondaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView}):a.push("UpdateEmailPrimaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView})}catch(t){o.showError(t),this.loading=!1}}buttonsTemplate(){const e=!this.loading&&this.email.length>3&&this.email!==this.initialEmail;return this.redirectView?h`
      <wui-flex gap="s">
        <wui-button size="md" variant="neutral" fullWidth @click=${a.goBack}>
          Cancel
        </wui-button>

        <wui-button
          size="md"
          variant="main"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!e}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      </wui-flex>
    `:h`
        <wui-button
          size="md"
          variant="main"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!e}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      `}};I.styles=O,x([w()],I.prototype,"email",void 0),x([w()],I.prototype,"loading",void 0),I=x([p("w3m-update-email-wallet-view")],I);let A=class extends f{constructor(){super(),this.email=a.state.data?.email,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailPrimaryOtp({otp:e}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),a.replace("UpdateEmailSecondaryOtp",a.state.data))}catch(t){throw n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:s.parseError(t)}}),t}},this.onStartOver=()=>{a.replace("UpdateEmailWallet",a.state.data)}}};A=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([p("w3m-update-email-primary-otp-view")],A);let R=class extends f{constructor(){super(),this.email=a.state.data?.newEmail,this.redirectView=a.state.data?.redirectView,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailSecondaryOtp({otp:e}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),this.redirectView&&a.reset(this.redirectView))}catch(t){throw n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:s.parseError(t)}}),t}},this.onStartOver=()=>{a.replace("UpdateEmailWallet",a.state.data)}}};R=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([p("w3m-update-email-secondary-otp-view")],R);var _=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let S=class extends c{constructor(){super(),this.authConnector=d.getAuthConnector(),this.isEmailEnabled=i.state.remoteFeatures?.email,this.isAuthEnabled=this.checkIfAuthEnabled(d.state.connectors),this.connectors=d.state.connectors,d.subscribeKey("connectors",e=>{this.connectors=e,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})}render(){if(!this.isEmailEnabled)throw new Error("w3m-email-login-view: Email is not enabled");if(!this.isAuthEnabled)throw new Error("w3m-email-login-view: No auth connector provided");return h`<wui-flex
      flexDirection="column"
      .padding=${["3xs","m","m","m"]}
      gap="l"
    >
      <w3m-email-login-widget></w3m-email-login-widget>
    </wui-flex> `}checkIfAuthEnabled(e){const t=e.filter(e=>e.type===u.CONNECTOR_TYPE_AUTH).map(e=>e.chain);return m.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(e=>t.includes(e))}};_([w()],S.prototype,"connectors",void 0),S=_([p("w3m-email-login-view")],S);export{S as W3mEmailLoginView,f as W3mEmailOtpWidget,C as W3mEmailVerifyDeviceView,g as W3mEmailVerifyOtpView,A as W3mUpdateEmailPrimaryOtpView,R as W3mUpdateEmailSecondaryOtpView,I as W3mUpdateEmailWalletView};
