import{bh as o,bi as r,bj as e,bl as t,bn as a,bm as i}from"#entry";import{n as l}from"./mQLjjC5r.js";import"./vuhCDpor.js";import"./CrwaebpX.js";import{c,U as s}from"./CVzBkT9j.js";const n=o`
  button {
    padding: 6.5px var(--wui-spacing-l) 6.5px var(--wui-spacing-xs);
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    background-color: var(--wui-color-gray-glass-002);
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image,
  wui-icon {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var d=function(o,r,e,t){var a,i=arguments.length,l=i<3?r:null===t?t=Object.getOwnPropertyDescriptor(r,e):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(o,r,e,t);else for(var c=o.length-1;c>=0;c--)(a=o[c])&&(l=(i<3?a(l):i>3?a(r,e,l):a(r,e))||l);return i>3&&l&&Object.defineProperty(r,e,l),l};let u=class extends t{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1}render(){return i`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="s" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex flexDirection="column" justifyContent="spaceBetween">
            <wui-text variant="paragraph-500" color="fg-100">${this.tokenName}</wui-text>
            <wui-text variant="small-400" color="fg-200">
              ${a.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-text variant="paragraph-500" color="fg-100">$${this.tokenValue.toFixed(2)}</wui-text>
      </button>
    `}visualTemplate(){return this.tokenName&&this.tokenImageUrl?i`<wui-image alt=${this.tokenName} src=${this.tokenImageUrl}></wui-image>`:i`<wui-icon name="coinPlaceholder" color="fg-100"></wui-icon>`}};u.styles=[r,e,n],d([l()],u.prototype,"tokenName",void 0),d([l()],u.prototype,"tokenImageUrl",void 0),d([l({type:Number})],u.prototype,"tokenValue",void 0),d([l()],u.prototype,"tokenAmount",void 0),d([l()],u.prototype,"tokenCurrency",void 0),d([l({type:Boolean})],u.prototype,"clickable",void 0),u=d([c("wui-list-token")],u);const m=o`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
    border-radius: var(--wui-border-radius-3xl);
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    overflow: hidden;
    position: relative;
  }

  :host([data-variant='generated']) {
    --mixed-local-color-1: var(--local-color-1);
    --mixed-local-color-2: var(--local-color-2);
    --mixed-local-color-3: var(--local-color-3);
    --mixed-local-color-4: var(--local-color-4);
    --mixed-local-color-5: var(--local-color-5);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host([data-variant='generated']) {
      --mixed-local-color-1: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-1)
      );
      --mixed-local-color-2: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-2)
      );
      --mixed-local-color-3: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-3)
      );
      --mixed-local-color-4: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-4)
      );
      --mixed-local-color-5: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-5)
      );
    }
  }

  :host([data-variant='generated']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      var(--local-radial-circle),
      #fff 0.52%,
      var(--mixed-local-color-5) 31.25%,
      var(--mixed-local-color-3) 51.56%,
      var(--mixed-local-color-2) 65.63%,
      var(--mixed-local-color-1) 82.29%,
      var(--mixed-local-color-4) 100%
    );
  }

  :host([data-variant='default']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      75.29% 75.29% at 64.96% 24.36%,
      #fff 0.52%,
      #f5ccfc 31.25%,
      #dba4f5 51.56%,
      #9a8ee8 65.63%,
      #6493da 82.29%,
      #6ebdea 100%
    );
  }
`;var v=function(o,r,e,t){var a,i=arguments.length,l=i<3?r:null===t?t=Object.getOwnPropertyDescriptor(r,e):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(o,r,e,t);else for(var c=o.length-1;c>=0;c--)(a=o[c])&&(l=(i<3?a(l):i>3?a(r,e,l):a(r,e))||l);return i>3&&l&&Object.defineProperty(r,e,l),l};let g=class extends t{constructor(){super(...arguments),this.imageSrc=void 0,this.alt=void 0,this.address=void 0,this.size="xl"}render(){return this.style.cssText=`\n    --local-width: var(--wui-icon-box-size-${this.size});\n    --local-height: var(--wui-icon-box-size-${this.size});\n    `,i`${this.visualTemplate()}`}visualTemplate(){if(this.imageSrc)return this.dataset.variant="image",i`<wui-image src=${this.imageSrc} alt=${this.alt??"avatar"}></wui-image>`;if(this.address){this.dataset.variant="generated";const o=s.generateAvatarColors(this.address);return this.style.cssText+=`\n ${o}`,null}return this.dataset.variant="default",null}};g.styles=[r,m],v([l()],g.prototype,"imageSrc",void 0),v([l()],g.prototype,"alt",void 0),v([l()],g.prototype,"address",void 0),v([l()],g.prototype,"size",void 0),g=v([c("wui-avatar")],g);
