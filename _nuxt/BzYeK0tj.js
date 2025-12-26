import{a_ as e,b2 as t,b7 as o,c8 as r,b3 as s}from"#entry";import{n as i,r as n}from"./BmyCbnts.js";import{c as h}from"./DExhYf3k.js";import{T as a}from"./D88x-OhC.js";const c={interpolate(e,t,o){if(2!==e.length||2!==t.length)throw new Error("inputRange and outputRange must be an array of length 2");const r=e[0]||0,s=e[1]||0,i=t[0]||0,n=t[1]||0;return o<r?i:o>s?n:(n-i)/(s-r)*(o-r)+i}},p=e`
  :host {
    width: 100%;
    display: block;
  }
`;var l=function(e,t,o,r){var s,i=arguments.length,n=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var h=e.length-1;h>=0;h--)(s=e[h])&&(n=(i<3?s(n):i>3?s(t,o,n):s(t,o))||n);return i>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends t{constructor(){super(),this.unsubscribe=[],this.text="",this.open=a.state.open,this.unsubscribe.push(o.subscribeKey("view",()=>{a.hide()}),r.subscribeKey("open",e=>{e||a.hide()}),a.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),a.hide()}render(){return s`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return s`<slot></slot> `}onMouseEnter(){const e=this.getBoundingClientRect();this.open||a.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||a.hide()}};d.styles=[p],l([i()],d.prototype,"text",void 0),l([n()],d.prototype,"open",void 0),d=l([h("w3m-tooltip-trigger")],d);export{c as M};
