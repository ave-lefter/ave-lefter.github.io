import{bj as e,be as t,dO as i,bg as n,cc as r,bc as a,bd as o,bl as l,b3 as s,b7 as c,bs as d,b8 as u,el as h,bf as p}from"./DvO0AinD.js";import{c as m}from"./Bo-PKsy5.js";import{W as f}from"./DRyAOi40.js";import{r as w}from"./B_ot7u58.js";import"./DCLEmx3U.js";import"./DUIMwiBp.js";import{e as v,n as E}from"./BPF-pwSa.js";import"./knB1Rbyr.js";import"./DzRxPZgn.js";import"./QP_KuhpX.js";import"./1TgTHKeV.js";import"./DS_txzci.js";import"./4RH0AGma.js";import"./A3Pmin_Z.js";let g=class extends f{constructor(){super(...arguments),this.onOtpSubmit=async s=>{var c,d;try{if(this.authConnector){const l=e.state.activeChain,u=t.getConnections(l),h=null==(c=i.state.remoteFeatures)?void 0:c.multiWallet,p=u.length>0;if(await this.authConnector.provider.connectOtp({otp:s}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),!l)throw new Error("Active chain is not set on ChainControll");if(await t.connectExternal(this.authConnector,l),n.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"email",name:this.authConnector.name||"Unknown"}}),null==(d=i.state.remoteFeatures)?void 0:d.emailCapture)return;if(i.state.siwx)return void r.close();if(p&&h)return a.replace("ProfileWallets"),void o.showSuccess("New Wallet Added");r.close()}}catch(u){throw n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:l.parseError(u)}}),u}},this.onOtpResend=async e=>{this.authConnector&&(await this.authConnector.provider.connectEmail({email:e}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}))}}};g=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([m("w3m-email-verify-otp-view")],g);const b=s`
  wui-icon-box {
    height: var(--wui-icon-box-size-xl);
    width: var(--wui-icon-box-size-xl);
  }
`;var y=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let C=class extends c{constructor(){var e;super(),this.email=null==(e=a.state.data)?void 0:e.email,this.authConnector=d.getAuthConnector(),this.loading=!1,this.listenForDeviceApproval()}render(){if(!this.email)throw new Error("w3m-email-verify-device-view: No email provided");if(!this.authConnector)throw new Error("w3m-email-verify-device-view: No auth connector provided");return u`
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
    `}async listenForDeviceApproval(){if(this.authConnector)try{await this.authConnector.provider.connectDevice(),n.sendEvent({type:"track",event:"DEVICE_REGISTERED_FOR_EMAIL"}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),a.replace("EmailVerifyOtp",{email:this.email})}catch(e){a.goBack()}}async onResendCode(){try{if(!this.loading){if(!this.authConnector||!this.email)throw new Error("w3m-email-login-widget: Unable to resend email");this.loading=!0,await this.authConnector.provider.connectEmail({email:this.email}),this.listenForDeviceApproval(),o.showSuccess("Code email resent")}}catch(e){o.showError(e)}finally{this.loading=!1}}};C.styles=b,y([w()],C.prototype,"loading",void 0),C=y([m("w3m-email-verify-device-view")],C);const O=s`
  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }
`;var x=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let I=class extends c{constructor(){var e,t;super(...arguments),this.formRef=v(),this.initialEmail=(null==(e=a.state.data)?void 0:e.email)??"",this.redirectView=null==(t=a.state.data)?void 0:t.redirectView,this.email="",this.loading=!1}firstUpdated(){var e;null==(e=this.formRef.value)||e.addEventListener("keydown",e=>{"Enter"===e.key&&this.onSubmitEmail(e)})}render(){return u`
      <wui-flex flexDirection="column" padding="m" gap="m">
        <form ${E(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
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
    `}onEmailInputChange(e){this.email=e.detail}async onSubmitEmail(e){try{if(this.loading)return;this.loading=!0,e.preventDefault();const t=d.getAuthConnector();if(!t)throw new Error("w3m-update-email-wallet: Auth connector not found");const i=await t.provider.updateEmail({email:this.email});n.sendEvent({type:"track",event:"EMAIL_EDIT"}),"VERIFY_SECONDARY_OTP"===i.action?a.push("UpdateEmailSecondaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView}):a.push("UpdateEmailPrimaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView})}catch(t){o.showError(t),this.loading=!1}}buttonsTemplate(){const e=!this.loading&&this.email.length>3&&this.email!==this.initialEmail;return this.redirectView?u`
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
    `:u`
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
      `}};I.styles=O,x([w()],I.prototype,"email",void 0),x([w()],I.prototype,"loading",void 0),I=x([m("w3m-update-email-wallet-view")],I);let A=class extends f{constructor(){var e;super(),this.email=null==(e=a.state.data)?void 0:e.email,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailPrimaryOtp({otp:e}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),a.replace("UpdateEmailSecondaryOtp",a.state.data))}catch(t){throw n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:l.parseError(t)}}),t}},this.onStartOver=()=>{a.replace("UpdateEmailWallet",a.state.data)}}};A=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([m("w3m-update-email-primary-otp-view")],A);let R=class extends f{constructor(){var e,t;super(),this.email=null==(e=a.state.data)?void 0:e.newEmail,this.redirectView=null==(t=a.state.data)?void 0:t.redirectView,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailSecondaryOtp({otp:e}),n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),this.redirectView&&a.reset(this.redirectView))}catch(t){throw n.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:l.parseError(t)}}),t}},this.onStartOver=()=>{a.replace("UpdateEmailWallet",a.state.data)}}};R=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([m("w3m-update-email-secondary-otp-view")],R);var _=function(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let j=class extends c{constructor(){var e;super(),this.authConnector=d.getAuthConnector(),this.isEmailEnabled=null==(e=i.state.remoteFeatures)?void 0:e.email,this.isAuthEnabled=this.checkIfAuthEnabled(d.state.connectors),this.connectors=d.state.connectors,d.subscribeKey("connectors",e=>{this.connectors=e,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})}render(){if(!this.isEmailEnabled)throw new Error("w3m-email-login-view: Email is not enabled");if(!this.isAuthEnabled)throw new Error("w3m-email-login-view: No auth connector provided");return u`<wui-flex
      flexDirection="column"
      .padding=${["3xs","m","m","m"]}
      gap="l"
    >
      <w3m-email-login-widget></w3m-email-login-widget>
    </wui-flex> `}checkIfAuthEnabled(e){const t=e.filter(e=>e.type===h.CONNECTOR_TYPE_AUTH).map(e=>e.chain);return p.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(e=>t.includes(e))}};_([w()],j.prototype,"connectors",void 0),j=_([m("w3m-email-login-view")],j);export{j as W3mEmailLoginView,f as W3mEmailOtpWidget,C as W3mEmailVerifyDeviceView,g as W3mEmailVerifyOtpView,A as W3mUpdateEmailPrimaryOtpView,R as W3mUpdateEmailSecondaryOtpView,I as W3mUpdateEmailWalletView};
