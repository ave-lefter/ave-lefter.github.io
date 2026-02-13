import{bh as i,bi as o,bj as t,bl as a,bm as r}from"#entry";import{n}from"./mQLjjC5r.js";import{o as e}from"./yRNs9a8f.js";import"./r7P8shUn.js";import"./CrwaebpX.js";import"./cRykC9iU.js";import{c as s}from"./CVzBkT9j.js";import"./PZjNov0a.js";const u=i`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var l=function(i,o,t,a){var r,n=arguments.length,e=n<3?o:null===a?a=Object.getOwnPropertyDescriptor(o,t):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)e=Reflect.decorate(i,o,t,a);else for(var s=i.length-1;s>=0;s--)(r=i[s])&&(e=(n<3?r(e):n>3?r(o,t,e):r(o,t))||e);return n>3&&e&&Object.defineProperty(o,t,e),e};let c=class extends a{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return r`
      <button
        ?disabled=${!!this.loading||Boolean(this.disabled)}
        data-loading=${this.loading}
        data-iconvariant=${e(this.iconVariant)}
        tabindex=${e(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if("image"===this.variant&&this.imageSrc)return r`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if("square"===this.iconVariant&&this.icon&&"icon"===this.variant)return r`<wui-icon name=${this.icon}></wui-icon>`;if("icon"===this.variant&&this.icon&&this.iconVariant){const i=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",o="square-blue"===this.iconVariant?"mdl":"md",t=this.iconSize?this.iconSize:o;return r`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${t}
          background="transparent"
          iconColor=${i}
          backgroundColor=${i}
          size=${o}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?r`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:r``}chevronTemplate(){return this.chevron?r`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};c.styles=[o,t,u],l([n()],c.prototype,"icon",void 0),l([n()],c.prototype,"iconSize",void 0),l([n()],c.prototype,"tabIdx",void 0),l([n()],c.prototype,"variant",void 0),l([n()],c.prototype,"iconVariant",void 0),l([n({type:Boolean})],c.prototype,"disabled",void 0),l([n()],c.prototype,"imageSrc",void 0),l([n()],c.prototype,"alt",void 0),l([n({type:Boolean})],c.prototype,"chevron",void 0),l([n({type:Boolean})],c.prototype,"loading",void 0),c=l([s("wui-list-item")],c);
