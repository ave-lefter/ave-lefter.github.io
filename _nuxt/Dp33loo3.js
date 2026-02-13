import{bh as t,bl as e,bm as r}from"#entry";import{c as i}from"./CVzBkT9j.js";import"./BZm2orYq.js";import"./mQLjjC5r.js";import"./PZjNov0a.js";import"./r7P8shUn.js";import"./CW7Luf7h.js";import"./C4n78Wzf.js";import"./yRNs9a8f.js";import"./CrwaebpX.js";import"./BLIvp4xe.js";const o=t`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;let s=class extends e{render(){return r`
      <wui-flex flexDirection="column" .padding=${["0","m","m","m"]} gap="s">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};s.styles=o,s=function(t,e,r,i){var o,s=arguments.length,l=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,r,i);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(l=(s<3?o(l):s>3?o(e,r,l):o(e,r))||l);return s>3&&l&&Object.defineProperty(e,r,l),l}([i("w3m-transactions-view")],s);export{s as W3mTransactionsView};
