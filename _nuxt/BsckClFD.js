import{bq as e,br as t,bu as r,bv as s}from"./D6y-ViDA.js";import{n as i}from"./8ReBD8jy.js";import{c as o}from"./BqICjlzW.js";const a=e`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var d=function(e,t,r,s){var i,o=arguments.length,a=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,r):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,s);else for(var d=e.length-1;d>=0;d--)(i=e[d])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let n=class extends r{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const e=this.radius>50?50:this.radius,t=36-e;return s`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${116+t} ${245+t}"
          stroke-dashoffset=${360+1.75*t}
        />
      </svg>
    `}};n.styles=[t,a],d([i({type:Number})],n.prototype,"radius",void 0),n=d([o("wui-loading-thumbnail")],n);
