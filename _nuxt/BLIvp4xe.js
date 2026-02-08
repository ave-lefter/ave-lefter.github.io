import{bh as r,bl as o,bm as i}from"#entry";import{n as t}from"./mQLjjC5r.js";import{c as e}from"./CVzBkT9j.js";const a=r`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`;var s=function(r,o,i,t){var e,a=arguments.length,s=a<3?o:null===t?t=Object.getOwnPropertyDescriptor(o,i):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(r,o,i,t);else for(var c=r.length-1;c>=0;c--)(e=r[c])&&(s=(a<3?e(s):a>3?e(o,i,s):e(o,i))||s);return a>3&&s&&Object.defineProperty(o,i,s),s};let c=class extends o{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`\n      width: ${this.width};\n      height: ${this.height};\n      border-radius: clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px);\n    `,i`<slot></slot>`}};c.styles=[a],s([t()],c.prototype,"width",void 0),s([t()],c.prototype,"height",void 0),s([t()],c.prototype,"borderRadius",void 0),s([t()],c.prototype,"variant",void 0),c=s([e("wui-shimmer")],c);
