import{bq as t,br as e,bu as r,bv as o}from"./D6y-ViDA.js";import{n as a}from"./8ReBD8jy.js";import{c as i}from"./BqICjlzW.js";const s=t`
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
`;var l=function(t,e,r,o){var a,i=arguments.length,s=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var l=t.length-1;l>=0;l--)(a=t[l])&&(s=(i<3?a(s):i>3?a(e,r,s):a(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s};let n=class extends r{constructor(){super(...arguments),this.text=""}render(){return o`${this.template()}`}template(){return this.text?o`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};n.styles=[e,s],l([a()],n.prototype,"text",void 0),n=l([i("wui-separator")],n);
