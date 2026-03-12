import{bq as t,br as e,bt as i,bu as o,bv as r}from"./D6y-ViDA.js";import{n as s}from"./8ReBD8jy.js";import{c}from"./BqICjlzW.js";const a=t`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-object-fit='cover']) img {
    object-fit: cover;
    object-position: center center;
  }

  :host([data-object-fit='contain']) img {
    object-fit: contain;
    object-position: center center;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
`;var h=function(t,e,i,o){var r,s=arguments.length,c=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(c=(s<3?r(c):s>3?r(e,i,c):r(e,i))||c);return s>3&&c&&Object.defineProperty(e,i,c),c};let n=class extends o{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0,this.objectFit="cover"}render(){return this.objectFit&&(this.dataset.objectFit=this.objectFit),this.style.cssText=`\n      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      `,r`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};n.styles=[e,i,a],h([s()],n.prototype,"src",void 0),h([s()],n.prototype,"alt",void 0),h([s()],n.prototype,"size",void 0),h([s()],n.prototype,"objectFit",void 0),n=h([c("wui-image")],n);
