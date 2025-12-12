import{b3 as t,b4 as e,b7 as o,b8 as r}from"./DvO0AinD.js";import{n as a}from"./B_ot7u58.js";import{c as i}from"./Bo-PKsy5.js";const s=t`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: var(--wui-color-gray-glass-005);
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 10px;
    background-color: var(--wui-color-modal-bg);
    transition: background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color;
  }
`;var l=function(t,e,o,r){var a,i=arguments.length,s=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,o,r);else for(var l=t.length-1;l>=0;l--)(a=t[l])&&(s=(i<3?a(s):i>3?a(e,o,s):a(e,o))||s);return i>3&&s&&Object.defineProperty(e,o,s),s};let n=class extends o{constructor(){super(...arguments),this.text=""}render(){return r`${this.template()}`}template(){return this.text?r`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};n.styles=[e,s],l([a()],n.prototype,"text",void 0),n=l([i("wui-separator")],n);
