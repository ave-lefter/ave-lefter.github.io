import{bh as t,bi as i,bj as r,bl as e,bm as o}from"#entry";import{n as s}from"./mQLjjC5r.js";import"./CrwaebpX.js";import"./BLIvp4xe.js";import{c as a}from"./CVzBkT9j.js";import"./C3_5JNG7.js";const n=t`
  :host {
    display: block;
  }

  :host > button,
  :host > wui-flex {
    gap: var(--wui-spacing-xxs);
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-1xs);
    height: 40px;
    border-radius: var(--wui-border-radius-l);
    background: var(--wui-color-gray-glass-002);
    border-width: 0px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
  }

  :host > button wui-image {
    width: 24px;
    height: 24px;
    border-radius: var(--wui-border-radius-s);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }
`;var u=function(t,i,r,e){var o,s=arguments.length,a=s<3?i:null===e?e=Object.getOwnPropertyDescriptor(i,r):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,i,r,e);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(a=(s<3?o(a):s>3?o(i,r,a):o(i,r))||a);return s>3&&a&&Object.defineProperty(i,r,a),a};let p=class extends e{constructor(){super(...arguments),this.text="",this.loading=!1}render(){return this.loading?o` <wui-flex alignItems="center" gap="xxs" padding="xs">
        <wui-shimmer width="24px" height="24px"></wui-shimmer>
        <wui-shimmer width="40px" height="20px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:o`
      <button>
        ${this.tokenTemplate()}
        <wui-text variant="paragraph-600" color="fg-100">${this.text}</wui-text>
      </button>
    `}tokenTemplate(){return this.imageSrc?o`<wui-image src=${this.imageSrc}></wui-image>`:o`
      <wui-icon-box
        size="sm"
        iconColor="fg-200"
        backgroundColor="fg-300"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};p.styles=[i,r,n],u([s()],p.prototype,"imageSrc",void 0),u([s()],p.prototype,"text",void 0),u([s({type:Boolean})],p.prototype,"loading",void 0),p=u([a("wui-token-button")],p);
