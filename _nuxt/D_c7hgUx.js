import{aR as t,bh as e,bi as r,bl as o,bm as i}from"#entry";import{n as s}from"./mQLjjC5r.js";import"./vuhCDpor.js";import"./CrwaebpX.js";import{Q as a}from"./7vh09V3t.js";import{c as n}from"./CVzBkT9j.js";function l(t,e,r){if(t===e)return!1;return(t-e<0?e-t:t-e)<=r+.1}const c={generate({uri:e,size:r,logoSize:o,dotColor:i="#141414"}){const s=[],n=function(t,e){const r=Array.prototype.slice.call(a.create(t,{errorCorrectionLevel:e}).modules.data,0),o=Math.sqrt(r.length);return r.reduce((t,e,r)=>(r%o===0?t.push([e]):t[t.length-1].push(e))&&t,[])}(e,"Q"),c=r/n.length,h=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];h.forEach(({x:e,y:r})=>{const o=(n.length-7)*c*e,a=(n.length-7)*c*r,l=.45;for(let n=0;n<h.length;n+=1){const e=c*(7-2*n);s.push(t`
            <rect
              fill=${2===n?i:"transparent"}
              width=${0===n?e-5:e}
              rx= ${0===n?(e-5)*l:e*l}
              ry= ${0===n?(e-5)*l:e*l}
              stroke=${i}
              stroke-width=${0===n?5:0}
              height=${0===n?e-5:e}
              x= ${0===n?a+c*n+2.5:a+c*n}
              y= ${0===n?o+c*n+2.5:o+c*n}
            />
          `)}});const u=Math.floor((o+25)/c),p=n.length/2-u/2,d=n.length/2+u/2-1,f=[];n.forEach((t,e)=>{t.forEach((t,r)=>{if(n[e][r]&&!(e<7&&r<7||e>n.length-8&&r<7||e<7&&r>n.length-8||e>p&&e<d&&r>p&&r<d)){const t=e*c+c/2,o=r*c+c/2;f.push([t,o])}})});const g={};return f.forEach(([t,e])=>{g[t]?g[t]?.push(e):g[t]=[e]}),Object.entries(g).map(([t,e])=>{const r=e.filter(t=>e.every(e=>!l(t,e,c)));return[Number(t),r]}).forEach(([e,r])=>{r.forEach(r=>{s.push(t`<circle cx=${e} cy=${r} fill=${i} r=${c/2.5} />`)})}),Object.entries(g).filter(([t,e])=>e.length>1).map(([t,e])=>{const r=e.filter(t=>e.some(e=>l(t,e,c)));return[Number(t),r]}).map(([t,e])=>{e.sort((t,e)=>t<e?-1:1);const r=[];for(const o of e){const t=r.find(t=>t.some(t=>l(o,t,c)));t?t.push(o):r.push([o])}return[t,r.map(t=>[t[0],t[t.length-1]])]}).forEach(([e,r])=>{r.forEach(([r,o])=>{s.push(t`
              <line
                x1=${e}
                x2=${e}
                y1=${r}
                y2=${o}
                stroke=${i}
                stroke-width=${c/1.25}
                stroke-linecap="round"
              />
            `)})}),s}},h=e`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var u=function(t,e,r,o){var i,s=arguments.length,a=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(a=(s<3?i(a):s>3?i(e,r,a):i(e,r))||a);return s>3&&a&&Object.defineProperty(e,r,a),a};let p=class extends o{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`\n     --local-size: ${this.size}px;\n     --local-icon-color: ${this.color??"#3396ff"}\n    `,i`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){const e="light"===this.theme?this.size:this.size-32;return t`
      <svg height=${e} width=${e}>
        ${c.generate({uri:this.uri,size:e,logoSize:this.arenaClear?0:e/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?i`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?i`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:i`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};p.styles=[r,h],u([s()],p.prototype,"uri",void 0),u([s({type:Number})],p.prototype,"size",void 0),u([s()],p.prototype,"theme",void 0),u([s()],p.prototype,"imageSrc",void 0),u([s()],p.prototype,"alt",void 0),u([s()],p.prototype,"color",void 0),u([s({type:Boolean})],p.prototype,"arenaClear",void 0),u([s({type:Boolean})],p.prototype,"farcaster",void 0),p=u([n("wui-qr-code")],p);
