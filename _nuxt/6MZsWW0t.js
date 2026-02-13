import{bh as t,bi as e,bl as r,bm as o}from"#entry";import{n as i}from"./mQLjjC5r.js";import{c as a}from"./CVzBkT9j.js";const l=t`
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
`;var n=function(t,e,r,o){var i,a=arguments.length,l=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(l=(a<3?i(l):a>3?i(e,r,l):i(e,r))||l);return a>3&&l&&Object.defineProperty(e,r,l),l};let s=class extends r{constructor(){super(...arguments),this.text=""}render(){return o`${this.template()}`}template(){return this.text?o`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};s.styles=[e,l],n([i()],s.prototype,"text",void 0),s=n([a("wui-separator")],s);
