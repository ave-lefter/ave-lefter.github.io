import{a_ as t,a$ as e,b2 as r,b3 as o}from"#entry";import{n as a}from"./BmyCbnts.js";import{c as i}from"./DExhYf3k.js";const n=t`
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
`;var s=function(t,e,r,o){var a,i=arguments.length,n=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(e,r,n):a(e,r))||n);return i>3&&n&&Object.defineProperty(e,r,n),n};let l=class extends r{constructor(){super(...arguments),this.text=""}render(){return o`${this.template()}`}template(){return this.text?o`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};l.styles=[e,n],s([a()],l.prototype,"text",void 0),l=s([i("wui-separator")],l);
